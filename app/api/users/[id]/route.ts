import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { userUpdateSchema } from "@/lib/validations/user";
import { createAuditLog } from "@/lib/audit";
import { hasPermission } from "@/lib/auth/permissions";

// GET /api/users/[id] - Buscar um específico (users.manage)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "users.manage")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        defaultRoute: true,
        createdAt: true,
        userRoleAssignments: {
          take: 1,
          orderBy: { id: "asc" },
          select: { role: { select: { key: true, name: true } } },
        },
        userPermissions: {
          select: { permission: { select: { key: true } } },
        },
        _count: {
          select: {
            properties: true,
            destinations: true,
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }
    
    const roleKey = user.userRoleAssignments?.[0]?.role?.key ?? null;
    const extraPermissionKeys = (user.userPermissions ?? []).map((up) => up.permission.key);
    const { userRoleAssignments, userPermissions, ...rest } = user;
    return NextResponse.json({
      ...rest,
      roleKey,
      extraPermissionKeys,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Erro ao buscar usuário" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Atualizar (users.manage). RBAC: roleKey e extraPermissionKeys opcionais.
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "users.manage")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  try {
    const body = await request.json();
    const validated = userUpdateSchema.parse(body);
    
    const updateData: Record<string, unknown> = {
      ...(validated.name !== undefined && { name: validated.name }),
      ...(validated.email !== undefined && { email: validated.email }),
      ...(validated.active !== undefined && { active: validated.active }),
      ...(validated.defaultRoute !== undefined && { defaultRoute: validated.defaultRoute }),
    };
    if (validated.password) {
      updateData.password = await bcrypt.hash(validated.password, 12);
    }
    
    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
      }
    });
    
    if (validated.roleKey != null) {
      const role = await prisma.role.findUnique({ where: { key: validated.roleKey } });
      if (!role) {
        return NextResponse.json({ error: "Role inválido" }, { status: 400 });
      }
      const defaultCompany = await prisma.company.findFirst({ where: { slug: "default" } });
      await prisma.userRoleAssignment.deleteMany({
        where: { userId: params.id },
      });
      await prisma.userRoleAssignment.create({
        data: {
          userId: params.id,
          roleId: role.id,
          companyId: defaultCompany?.id ?? null,
        },
      });
    }
    
    if (validated.extraPermissionKeys !== undefined) {
      await prisma.userPermission.deleteMany({
        where: { userId: params.id },
      });
      for (const key of validated.extraPermissionKeys) {
        const perm = await prisma.permission.findUnique({ where: { key } });
        if (perm) {
          await prisma.userPermission.create({
            data: {
              userId: params.id,
              permissionId: perm.id,
              companyId: null,
              granted: true,
            },
          });
        }
      }
    }
    
    await createAuditLog({
      userId: session.user.id,
      action: "UPDATE",
      entity: "User",
      entityId: user.id,
      changes: validated,
    });
    
    return NextResponse.json(user);
  } catch (error: any) {
    // Evita erros internos do console ao inspecionar objetos complexos (ex: erros do Prisma/Zod)
    console.error("Error updating user:", (error && (error as any).message) || String(error));
    if (error?.name === "ZodError") {
      return NextResponse.json(
        { error: "Dados inválidos", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Deletar (users.manage)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "users.manage")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  
  // Não permitir deletar a si mesmo
  if (session.user.id === params.id) {
    return NextResponse.json(
      { error: "Você não pode deletar sua própria conta" },
      { status: 400 }
    );
  }
  
  try {
    await prisma.user.delete({
      where: { id: params.id }
    });
    
    await createAuditLog({
      userId: session.user.id,
      action: "DELETE",
      entity: "User",
      entityId: params.id,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Erro ao deletar usuário" },
      { status: 500 }
    );
  }
}
