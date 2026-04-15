import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const proposalInclude = {
  listing: {
    include: {
      ownedWeek: true,
      calendarYear: { select: { year: true } },
      property: { select: { id: true, name: true } },
      ownerCotista: { select: { id: true, name: true } },
    },
  },
  proposerWeek: true,
  proposerCota: { select: { id: true, numeroCota: true } },
  proposerCotista: { select: { id: true, name: true } },
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

    const sent = await prisma.weekMarketplaceProposal.findMany({
      where: { proposerCotistaId: auth.cotistaId, listing: { propertyId } },
      include: proposalInclude,
      orderBy: { updatedAt: "desc" },
    });

    const received = await prisma.weekMarketplaceProposal.findMany({
      where: { listing: { propertyId, ownerCotistaId: auth.cotistaId } },
      include: proposalInclude,
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ sent, received });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao carregar negociações" }, { status: 500 });
  }
}
