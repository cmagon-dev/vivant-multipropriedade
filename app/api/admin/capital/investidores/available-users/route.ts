import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";

/** GET — usuários com perfil Capital (role INVESTOR ou permissão capital.portal) que ainda não têm perfil de investidor. */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const withProfile = await prisma.capitalInvestorProfile.findMany({
      select: { userId: true },
    });
    const userIdsWithProfile = new Set(withProfile.map((p) => p.userId));

    const users = await prisma.user.findMany({
      where: {
        id: { notIn: Array.from(userIdsWithProfile) },
        active: true,
        OR: [
          { userRoleAssignments: { some: { role: { key: "INVESTOR" } } } },
          { userPermissions: { some: { permission: { key: "capital.portal" }, granted: true } } },
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
