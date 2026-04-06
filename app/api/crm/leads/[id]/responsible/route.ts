import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getResponsibleCandidates(currentUserId: string) {
  const roles = await prisma.role.findMany({
    where: { key: { in: ["COMMERCIAL", "OWNER", "ADMIN"] } },
    select: { id: true },
  });
  const roleIds = roles.map((r) => r.id);

  return prisma.user.findMany({
    where: {
      active: true,
      OR: [
        { id: currentUserId },
        { userRoleAssignments: { some: { roleId: { in: roleIds } } } },
        {
          userPermissions: {
            some: {
              granted: true,
              permission: { key: { in: ["comercial.view", "crm.manage"] } },
            },
          },
        },
      ],
    },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

/** PATCH — atualizar responsável de lead (apenas OWNER). */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const roleKey = (session.user as { roleKey?: string }).roleKey;
  if (roleKey !== "OWNER") {
    return NextResponse.json({ error: "Apenas OWNER pode redistribuir leads." }, { status: 403 });
  }

  const leadId = params.id;
  if (!leadId) {
    return NextResponse.json({ error: "Lead inválido." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const responsibleUserId = (body as { responsibleUserId?: string | null }).responsibleUserId;

  let normalizedResponsible: string | null = null;
  if (typeof responsibleUserId === "string" && responsibleUserId.trim()) {
    normalizedResponsible = responsibleUserId.trim();
    const candidates = await getResponsibleCandidates(session.user.id);
    if (!candidates.some((u) => u.id === normalizedResponsible)) {
      return NextResponse.json({ error: "Responsável inválido." }, { status: 400 });
    }
  }

  const exists = await prisma.lead.findUnique({ where: { id: leadId }, select: { id: true } });
  if (!exists) {
    return NextResponse.json({ error: "Lead não encontrado." }, { status: 404 });
  }

  let updated;
  try {
    updated = await prisma.lead.update({
      where: { id: leadId },
      data: {
        ownerUserId: normalizedResponsible,
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2011"
    ) {
      return NextResponse.json(
        { error: "Banco ainda não permite responsável vazio. Aplique a migração de leads para continuar." },
        { status: 400 }
      );
    }
    throw error;
  }

  return NextResponse.json({
    id: updated.id,
    owner: updated.owner,
    ownerUserId: updated.ownerUserId,
  });
}

