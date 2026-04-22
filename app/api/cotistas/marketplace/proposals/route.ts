import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";
import {
  assertNoActiveMarketplaceOnWeek,
  listingAcceptsProposalType,
  logMarketplaceEvent,
  weekIsEligibleForMarketplace,
} from "@/lib/vivant/week-marketplace-service";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const body = (await request.json()) as {
      listingId?: string;
      proposerCotaId?: string;
      type?: "EXCHANGE" | "SALE";
      proposerWeekId?: string | null;
      message?: string;
    };

    const { listingId, proposerCotaId, type, proposerWeekId, message } = body;
    if (!listingId || !proposerCotaId || !type) {
      return NextResponse.json(
        { error: "listingId, proposerCotaId e type são obrigatórios" },
        { status: 400 }
      );
    }

    if (type === "EXCHANGE" && !proposerWeekId) {
      return NextResponse.json(
        { error: "Informe a semana oferecida em troca (proposerWeekId)." },
        { status: 400 }
      );
    }
    if (type === "SALE" && proposerWeekId) {
      return NextResponse.json({ error: "Venda não utiliza semana do comprador." }, { status: 400 });
    }

    const listing = await prisma.weekMarketplaceListing.findFirst({
      where: { id: listingId, status: "PUBLISHED" },
      include: { calendarYear: true },
    });
    if (!listing) {
      return NextResponse.json({ error: "Anúncio não disponível." }, { status: 404 });
    }

    if (listing.ownerCotistaId === auth.cotistaId) {
      return NextResponse.json({ error: "Não é possível propor na própria oferta." }, { status: 400 });
    }

    if (!listingAcceptsProposalType(listing.type, type)) {
      return NextResponse.json(
        { error: "Este anúncio não aceita este tipo de negociação." },
        { status: 400 }
      );
    }

    const cota = await prisma.cotaPropriedade.findFirst({
      where: {
        id: proposerCotaId,
        cotistaId: auth.cotistaId,
        propertyId: listing.propertyId,
        ativo: true,
      },
    });
    if (!cota) {
      return NextResponse.json({ error: "Cota inválida nesta propriedade." }, { status: 403 });
    }

    const dup = await prisma.weekMarketplaceProposal.findFirst({
      where: {
        listingId,
        proposerCotistaId: auth.cotistaId,
        status: { in: ["PENDING", "ACCEPTED_BY_OWNER", "ACCEPTED_BY_PROPOSER"] },
      },
    });
    if (dup) {
      return NextResponse.json(
        { error: "Você já possui uma proposta ativa neste anúncio." },
        { status: 400 }
      );
    }

    if (type === "EXCHANGE" && proposerWeekId) {
      const elig = await weekIsEligibleForMarketplace({
        propertyCalendarWeekId: proposerWeekId,
        cotaId: proposerCotaId,
        propertyCalendarYearId: listing.propertyCalendarYearId,
      });
      if (!elig.ok) {
        return NextResponse.json({ error: elig.error }, { status: 400 });
      }
      const ownerWeek = await prisma.propertyCalendarWeek.findUnique({
        where: { id: listing.ownedCalendarWeekId },
      });
      const propWeek = await prisma.propertyCalendarWeek.findUnique({
        where: { id: proposerWeekId },
      });
      if (!ownerWeek || !propWeek || ownerWeek.tier !== propWeek.tier) {
        return NextResponse.json(
          { error: "As semanas precisam ter a mesma classificação (Gold/Silver/Black)." },
          { status: 400 }
        );
      }
      const free = await assertNoActiveMarketplaceOnWeek(proposerWeekId);
      if (!free.ok) {
        return NextResponse.json({ error: free.error }, { status: 400 });
      }
    }

    const proposal = await prisma.$transaction(async (tx) => {
      const p = await tx.weekMarketplaceProposal.create({
        data: {
          listingId,
          proposerCotistaId: auth.cotistaId,
          proposerCotaId,
          proposerWeekId: type === "EXCHANGE" ? proposerWeekId! : null,
          type,
          message: message ?? null,
        },
        include: {
          listing: { select: { id: true, propertyId: true } },
          proposerWeek: true,
        },
      });
      await tx.weekMarketplaceListing.update({
        where: { id: listingId },
        data: { status: "NEGOTIATING" },
      });
      await logMarketplaceEvent(tx, {
        listingId,
        actorCotistaId: auth.cotistaId,
        action: "PROPOSAL_CREATED",
        payload: { proposalId: p.id, type },
      });
      return p;
    });

    return NextResponse.json({
      proposal,
      aviso:
        type === "SALE"
          ? "Pagamento é feito fora da plataforma. O sistema apenas registra o acordo entre cotistas."
          : undefined,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao enviar proposta" }, { status: 500 });
  }
}
