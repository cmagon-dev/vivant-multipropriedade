import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
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

/** GET — contexto da edição inline de responsável na tabela de leads. */
export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const roleKey = (session.user as { roleKey?: string }).roleKey;
  const canEditInlineResponsible = roleKey === "OWNER";

  if (!canEditInlineResponsible) {
    return NextResponse.json({
      canEditInlineResponsible: false,
      users: [],
    });
  }

  const users = await getResponsibleCandidates(session.user.id);

  return NextResponse.json({
    canEditInlineResponsible: true,
    users,
  });
}

