import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** GET — lista assignments por tipo + usuários COMMERCIAL (crm.manage) */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "crm.manage")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const commercialRole = await prisma.role.findUnique({ where: { key: "COMMERCIAL" } });
  const ownerRole = await prisma.role.findUnique({ where: { key: "OWNER" } });
  const superAdminRole = await prisma.role.findUnique({ where: { key: "SUPER_ADMIN" } });
  const roleIds = [commercialRole?.id, ownerRole?.id, superAdminRole?.id].filter(Boolean) as string[];

  const [assignments, commercialUsers] = await Promise.all([
    prisma.leadTypeAssignment.findMany({
      include: {
        leadType: { select: { id: true, key: true, name: true, order: true } },
        defaultOwner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { leadType: { order: "asc" } },
    }),
    prisma.user.findMany({
      where: {
        active: true,
        OR: [
          { userRoleAssignments: { some: { roleId: { in: roleIds } } } },
          {
            userPermissions: {
              some: { permission: { key: "comercial.view" }, granted: true },
            },
          },
        ],
      },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  // Incluir todos os lead types; se não tiver assignment, ainda aparecer na lista (UI pode criar)
  const allTypes = await prisma.leadType.findMany({
    where: { isActive: true },
    select: { id: true, key: true, name: true, order: true },
    orderBy: { order: "asc" },
  });

  const assignmentByTypeId = Object.fromEntries(
    assignments.map((a) => [a.leadTypeId, a])
  );

  const list = allTypes.map((t) => ({
    leadType: t,
    assignment: assignmentByTypeId[t.id] ?? null,
  }));

  return NextResponse.json({ list, commercialUsers });
}
