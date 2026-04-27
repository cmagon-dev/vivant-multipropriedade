import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";

/** GET — usuários com perfil Capital (role INVESTOR ou permissão capital.portal) que ainda não têm perfil de investidor. */
export async function GET() {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const companyId = await getCapitalCompanyId(session);

    const withProfile = await prisma.capitalInvestorProfile.findMany({
      where: { companyId },
      select: { userId: true },
    });
    const userIdsWithProfile = new Set(withProfile.map((p) => p.userId));

    const users = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(userIdsWithProfile) },
        active: true,
        OR: [
          {
            userRoleAssignments: {
              some: {
                role: { key: "INVESTOR" },
                OR: [{ companyId }, { companyId: null }],
              },
            },
          },
          {
            userPermissions: {
              some: {
                permission: { key: "capital.portal" },
                granted: true,
                OR: [{ companyId }, { companyId: null }],
              },
            },
          },
        ],
      },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ users });
  } catch (e) {
    console.error("Erro ao listar usuários disponíveis para investidor:", e);
    return NextResponse.json({ error: "Erro ao listar usuários" }, { status: 500 });
  }
}
