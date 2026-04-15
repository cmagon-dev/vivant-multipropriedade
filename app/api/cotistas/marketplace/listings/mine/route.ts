import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const listingInclude = {
  ownedWeek: true,
  calendarYear: { select: { id: true, year: true } },
  proposals: {
    include: {
      proposerCotista: { select: { id: true, name: true } },
      proposerWeek: true,
    },
    orderBy: { createdAt: "desc" as const },
  },
} as const;

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const propertyId = request.nextUrl.searchParams.get("propertyId");
    if (!propertyId) {
      return NextResponse.json({ error: "propertyId é obrigatório" }, { status: 400 });
    }

    const member = await prisma.cotaPropriedade.findFirst({
      where: { cotistaId: auth.cotistaId, propertyId, ativo: true },
      select: { id: true },
    });
    if (!member) {
      return NextResponse.json({ error: "Sem cota nesta propriedade" }, { status: 403 });
    }

    const listings = await prisma.weekMarketplaceListing.findMany({
      where: { propertyId, ownerCotistaId: auth.cotistaId },
      include: listingInclude,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ listings });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao carregar anúncios" }, { status: 500 });
  }
}
