import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Oportunidades publicadas na mesma casa (exclui o próprio cotista). */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const minhasProps = await prisma.cotaPropriedade.findMany({
      where: { cotistaId: auth.cotistaId, ativo: true },
      select: { propertyId: true },
    });
    const propertyIds = Array.from(new Set(minhasProps.map((c) => c.propertyId)));
    if (propertyIds.length === 0) {
      return NextResponse.json({ oportunidades: [] });
    }

    const rows = await prisma.weekExchangeRequest.findMany({
      where: {
        propertyId: { in: propertyIds },
        cotistaId: { not: auth.cotistaId },
        status: "PUBLISHED_TO_PEERS",
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        property: { select: { id: true, name: true } },
        ownedWeek: true,
        desiredWeek: true,
        cotista: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ oportunidades: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao listar oportunidades" },
      { status: 500 }
    );
  }
}
