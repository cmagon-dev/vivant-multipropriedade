import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { userCreateSchema } from "@/lib/validations/user";
import { createAuditLog } from "@/lib/audit";
import { hasPermission } from "@/lib/auth/permissions";
import { trackEvent } from "@/lib/telemetry/trackEvent";

// GET /api/users - Listar usuários (users.manage)
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "users.manage")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        userRoleAssignments: {
          take: 1,
          orderBy: { id: "asc" },
          select: { role: { select: { key: true, name: true } } },
        },
        _count: {
          select: {
            properties: true,
            destinations: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    const mapped = users.map((u) => ({
      ...u,
      roleKey: u.userRoleAssignments?.[0]?.role?.key ?? null,
      roleName: u.userRoleAssignments?.[0]?.role?.name ?? null,
      userRoleAssignments: undefined,
    }));
    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuários" },
      { status: 500 }
    );
  }
}

// POST /api/users - Criar usuário (users.manage). RBAC: roleKey obrigatório + extraPermissionKeys opcional.
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "users.manage")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = userCreateSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email },
    });
    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(validated.password, 12);
    const roleKey = validated.roleKey ?? null;
    if (!roleKey) {
      return NextResponse.json({ error: "Role (RBAC) é obrigatório" }, { status: 400 });
    }
    const extraKeys = validated.extraPermissionKeys ?? [];

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
        role: "EDITOR",
        ...(roleKey === "COTISTA" ? { defaultRoute: "/dashboard" } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    const role = await prisma.role.findUnique({ where: { key: roleKey } });
    if (!role) {
      await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
      return NextResponse.json({ error: "Role inválido" }, { status: 400 });
    }
    const defaultCompany = await prisma.company.findFirst({ where: { slug: "default" } });
    await prisma.userRoleAssignment.create({
      data: {
        userId: user.id,
        roleId: role.id,
        companyId: defaultCompany?.id ?? null,
      },
    });

    /** Role COTISTA: mesmo login admin, mas portal usa tabela `cotistas` (APIs /api/cotistas/me/*). */
    if (roleKey === "COTISTA") {
      await prisma.cotista.upsert({
        where: { email: validated.email },
        create: {
          name: validated.name,
          email: validated.email,
          cpf: `PENDING-${user.id}`,
          password: hashedPassword,
          active: true,
        },
        update: {
          name: validated.name,
          password: hashedPassword,
          active: true,
        },
      });
    }
    for (const key of extraKeys) {
      const perm = await prisma.permission.findUnique({ where: { key } });
      if (perm) {
        await prisma.userPermission.create({
          data: {
            userId: user.id,
            permissionId: perm.id,
            companyId: null,
            granted: true,
          },
        });
      }
    }

    await createAuditLog({
      userId: session.user.id,
      action: "CREATE",
      entity: "User",
      entityId: user.id,
      changes: { name: user.name, email: user.email, roleKey },
    });
    trackEvent({
      actorUserId: session.user.id,
      actorRole: (session.user as { roleKey?: string }).roleKey ?? undefined,
      type: "admin.user.created",
      entityType: "User",
      entityId: user.id,
      status: "OK",
      message: `Usuário criado: ${user.email}`,
      meta: { roleKey, extraPermissionsCount: extraKeys.length },
    }).catch(() => {});

    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao criar usuário" },
      { status: 500 }
    );
  }
}
