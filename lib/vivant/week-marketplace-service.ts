import type { Prisma } from "@prisma/client";
import { WeekUsageOverrideReason } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const ACTIVE_LISTING: Array<
  "PUBLISHED" | "NEGOTIATING" | "WAITING_CONFIRMATION"
> = ["PUBLISHED", "NEGOTIATING", "WAITING_CONFIRMATION"];

const ACTIVE_PROPOSAL: Array<
  "PENDING" | "ACCEPTED_BY_OWNER" | "ACCEPTED_BY_PROPOSER"
> = ["PENDING", "ACCEPTED_BY_OWNER", "ACCEPTED_BY_PROPOSER"];

export async function logMarketplaceEvent(
  tx: Prisma.TransactionClient,
  input: {
    listingId?: string | null;
    actorCotistaId?: string | null;
    action: string;
    payload?: unknown;
  }
) {
  await tx.weekMarketplaceEventLog.create({
    data: {
      listingId: input.listingId ?? null,
      actorCotistaId: input.actorCotistaId ?? null,
      action: input.action,
      payload: input.payload === undefined ? undefined : (input.payload as Prisma.InputJsonValue),
    },
  });
}

async function getSlotForYear(propertyCalendarYearId: string) {
  return prisma.calendarDistributionSlot.findFirst({
    where: { propertyCalendarYearId },
    orderBy: { createdAt: "desc" },
  });
}

export async function assertCotaHoldsWeek(params: {
  cotaId: string;
  propertyCalendarWeekId: string;
  propertyCalendarYearId: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const slot = await getSlotForYear(params.propertyCalendarYearId);
  if (!slot) {
    return { ok: false, error: "Não há rodada de distribuição para este ano." };
  }
  const a = await prisma.propertyWeekAssignment.findFirst({
    where: {
      cotaId: params.cotaId,
      distributionSlotId: slot.id,
      propertyCalendarWeekId: params.propertyCalendarWeekId,
    },
  });
  if (!a) {
    return { ok: false, error: "Esta cota não possui esta semana na distribuição." };
  }
  return { ok: true };
}

export async function weekIsEligibleForMarketplace(params: {
  propertyCalendarWeekId: string;
  cotaId: string;
  propertyCalendarYearId: string;
}): Promise<
  | { ok: true; week: { tier: string; isBlocked: boolean; exchangeAllowed: boolean } }
  | { ok: false; error: string }
> {
  const week = await prisma.propertyCalendarWeek.findFirst({
    where: {
      id: params.propertyCalendarWeekId,
      propertyCalendarYearId: params.propertyCalendarYearId,
    },
  });
  if (!week) {
    return { ok: false, error: "Semana não encontrada neste ano." };
  }
  if (week.isBlocked) {
    return { ok: false, error: "Semana bloqueada no calendário." };
  }
  if (!week.exchangeAllowed) {
    return { ok: false, error: "Troca não permitida para esta semana." };
  }
  const hold = await assertCotaHoldsWeek({
    cotaId: params.cotaId,
    propertyCalendarWeekId: params.propertyCalendarWeekId,
    propertyCalendarYearId: params.propertyCalendarYearId,
  });
  if (!hold.ok) return hold;

  const blocking = await prisma.weekReservation.findFirst({
    where: {
      cotaId: params.cotaId,
      propertyCalendarWeekId: params.propertyCalendarWeekId,
      status: { in: ["CONFIRMADA", "EM_USO", "PENDENTE"] },
    },
  });
  if (blocking) {
    return { ok: false, error: "Existe reserva ativa ou pendente para esta semana." };
  }

  const existingOverride = await prisma.weekUsageOverride.findUnique({
    where: { propertyCalendarWeekId: params.propertyCalendarWeekId },
  });
  if (existingOverride) {
    return { ok: false, error: "Esta semana já possui uso redirecionado por outra operação." };
  }

  return { ok: true, week: { tier: week.tier, isBlocked: week.isBlocked, exchangeAllowed: week.exchangeAllowed } };
}

export async function assertNoActiveMarketplaceOnWeek(
  propertyCalendarWeekId: string,
  excludeListingId?: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const listing = await prisma.weekMarketplaceListing.findFirst({
    where: {
      ownedCalendarWeekId: propertyCalendarWeekId,
      status: { in: ACTIVE_LISTING },
      ...(excludeListingId ? { id: { not: excludeListingId } } : {}),
    },
  });
  if (listing) {
    return { ok: false, error: "Esta semana já está em anúncio ativo no marketplace." };
  }

  const prop = await prisma.weekMarketplaceProposal.findFirst({
    where: {
      status: { in: ACTIVE_PROPOSAL },
      OR: [
        { proposerWeekId: propertyCalendarWeekId },
        { listing: { ownedCalendarWeekId: propertyCalendarWeekId } },
      ],
    },
  });
  if (prop) {
    return { ok: false, error: "Esta semana está em uma negociação ativa." };
  }
  return { ok: true };
}

export function listingAcceptsProposalType(
  listingType: string,
  proposalType: string
): boolean {
  if (listingType === "BOTH") return true;
  return listingType === proposalType;
}

export async function executeExchangeProposal(proposalId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const proposal = await tx.weekMarketplaceProposal.findUnique({
      where: { id: proposalId },
      include: {
        listing: {
          include: {
            ownedWeek: true,
            calendarYear: true,
          },
        },
        proposerWeek: true,
        proposerCota: true,
      },
    });
    if (!proposal || proposal.type !== "EXCHANGE" || !proposal.proposerWeekId) {
      throw new Error("Proposta de troca inválida.");
    }
    const listing = proposal.listing;
    const yearId = listing.propertyCalendarYearId;
    const wA = listing.ownedCalendarWeekId;
    const wB = proposal.proposerWeekId;
    const cotaOwner = listing.ownerCotaId;
    const cotaProposer = proposal.proposerCotaId;

    const resOwnerHold = await assertCotaHoldsWeek({
      cotaId: cotaOwner,
      propertyCalendarWeekId: wA,
      propertyCalendarYearId: yearId,
    });
    if (!resOwnerHold.ok) throw new Error(resOwnerHold.error);
    const resProposerHold = await assertCotaHoldsWeek({
      cotaId: cotaProposer,
      propertyCalendarWeekId: wB,
      propertyCalendarYearId: yearId,
    });
    if (!resProposerHold.ok) throw new Error(resProposerHold.error);

    if (listing.ownedWeek.tier !== proposal.proposerWeek!.tier) {
      throw new Error("As semanas precisam ter a mesma classificação (Gold/Silver/Black) para troca.");
    }

    await tx.weekUsageOverride.create({
      data: {
        propertyCalendarWeekId: wA,
        fromCotaId: cotaOwner,
        toCotaId: cotaProposer,
        reason: WeekUsageOverrideReason.EXCHANGE,
        proposalId: proposal.id,
      },
    });
    await tx.weekUsageOverride.create({
      data: {
        propertyCalendarWeekId: wB,
        fromCotaId: cotaProposer,
        toCotaId: cotaOwner,
        reason: WeekUsageOverrideReason.EXCHANGE,
        proposalId: proposal.id,
      },
    });

    await tx.weekMarketplaceProposal.update({
      where: { id: proposalId },
      data: { status: "COMPLETED" },
    });
    await tx.weekMarketplaceListing.update({
      where: { id: listing.id },
      data: { status: "COMPLETED" },
    });

    await logMarketplaceEvent(tx, {
      listingId: listing.id,
      action: "EXCHANGE_COMPLETED",
      payload: { proposalId, weeks: [wA, wB] },
    });
  });
}

export async function executeSaleProposal(proposalId: string): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const proposal = await tx.weekMarketplaceProposal.findUnique({
      where: { id: proposalId },
      include: {
        listing: { include: { calendarYear: true } },
      },
    });
    if (!proposal || proposal.type !== "SALE") {
      throw new Error("Proposta de venda inválida.");
    }
    const listing = proposal.listing;
    const w = listing.ownedCalendarWeekId;
    const sellerCota = listing.ownerCotaId;
    const buyerCota = proposal.proposerCotaId;

    const res = await assertCotaHoldsWeek({
      cotaId: sellerCota,
      propertyCalendarWeekId: w,
      propertyCalendarYearId: listing.propertyCalendarYearId,
    });
    if (!res.ok) throw new Error(res.error);

    await tx.weekUsageOverride.create({
      data: {
        propertyCalendarWeekId: w,
        fromCotaId: sellerCota,
        toCotaId: buyerCota,
        reason: WeekUsageOverrideReason.SALE,
        proposalId: proposal.id,
      },
    });

    await tx.weekMarketplaceProposal.update({
      where: { id: proposalId },
      data: { status: "COMPLETED" },
    });
    await tx.weekMarketplaceListing.update({
      where: { id: listing.id },
      data: { status: "COMPLETED" },
    });

    await logMarketplaceEvent(tx, {
      listingId: listing.id,
      action: "SALE_COMPLETED",
      payload: { proposalId, weekId: w },
    });
  });
}

export type MarketplaceProposalAction =
  | "owner_accept"
  | "proposer_confirm_exchange"
  | "seller_confirm_sale"
  | "buyer_confirm_sale"
  | "reject"
  | "cancel";

async function tryCompleteSale(proposalId: string) {
  const p = await prisma.weekMarketplaceProposal.findUnique({ where: { id: proposalId } });
  if (!p || p.type !== "SALE") return;
  if (p.sellerConfirmedAt && p.buyerConfirmedAt) {
    await executeSaleProposal(proposalId);
  }
}

export async function applyProposalAction(params: {
  proposalId: string;
  actorCotistaId: string;
  action: MarketplaceProposalAction;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const proposal = await prisma.weekMarketplaceProposal.findUnique({
    where: { id: params.proposalId },
    include: {
      listing: true,
    },
  });
  if (!proposal) {
    return { ok: false, error: "Proposta não encontrada." };
  }
  const listing = proposal.listing;
  const isOwner = listing.ownerCotistaId === params.actorCotistaId;
  const isProposer = proposal.proposerCotistaId === params.actorCotistaId;

  try {
    if (params.action === "reject") {
      if (!isOwner && !isProposer) {
        return { ok: false, error: "Sem permissão." };
      }
      if (proposal.status !== "PENDING" && proposal.status !== "ACCEPTED_BY_OWNER") {
        return { ok: false, error: "Esta proposta não pode ser recusada agora." };
      }
      await prisma.$transaction(async (tx) => {
        await tx.weekMarketplaceProposal.update({
          where: { id: proposal.id },
          data: { status: "REJECTED" },
        });
        await tx.weekMarketplaceListing.update({
          where: { id: listing.id },
          data: {
            status:
              listing.status === "NEGOTIATING" || listing.status === "WAITING_CONFIRMATION"
                ? "PUBLISHED"
                : listing.status,
          },
        });
        await logMarketplaceEvent(tx, {
          listingId: listing.id,
          actorCotistaId: params.actorCotistaId,
          action: "PROPOSAL_REJECTED",
          payload: { proposalId: proposal.id },
        });
      });
      return { ok: true };
    }

    if (params.action === "cancel") {
      if (!isProposer) {
        return { ok: false, error: "Apenas quem enviou pode cancelar." };
      }
      if (proposal.status !== "PENDING") {
        return { ok: false, error: "Não é possível cancelar neste status." };
      }
      await prisma.$transaction(async (tx) => {
        await tx.weekMarketplaceProposal.update({
          where: { id: proposal.id },
          data: { status: "CANCELLED" },
        });
        await logMarketplaceEvent(tx, {
          listingId: listing.id,
          actorCotistaId: params.actorCotistaId,
          action: "PROPOSAL_CANCELLED",
          payload: { proposalId: proposal.id },
        });
      });
      return { ok: true };
    }

    if (params.action === "owner_accept") {
      if (!isOwner) {
        return { ok: false, error: "Apenas o anunciante pode aceitar." };
      }
      if (proposal.status !== "PENDING") {
        return { ok: false, error: "Proposta não está pendente." };
      }
      await prisma.$transaction(async (tx) => {
        await tx.weekMarketplaceProposal.updateMany({
          where: {
            listingId: listing.id,
            id: { not: proposal.id },
            status: "PENDING",
          },
          data: { status: "REJECTED" },
        });
        await tx.weekMarketplaceProposal.update({
          where: { id: proposal.id },
          data: {
            status: "ACCEPTED_BY_OWNER",
            ownerAcceptedAt: new Date(),
          },
        });
        await tx.weekMarketplaceListing.update({
          where: { id: listing.id },
          data: {
            status: proposal.type === "SALE" ? "WAITING_CONFIRMATION" : "NEGOTIATING",
          },
        });
        await logMarketplaceEvent(tx, {
          listingId: listing.id,
          actorCotistaId: params.actorCotistaId,
          action: "OWNER_ACCEPTED_PROPOSAL",
          payload: { proposalId: proposal.id },
        });
      });

      return { ok: true };
    }

    if (params.action === "proposer_confirm_exchange") {
      if (!isProposer) {
        return { ok: false, error: "Apenas o proponente pode confirmar." };
      }
      if (proposal.type !== "EXCHANGE") {
        return { ok: false, error: "Esta ação é só para troca." };
      }
      if (proposal.status !== "ACCEPTED_BY_OWNER") {
        return { ok: false, error: "O anunciante ainda não aceitou." };
      }
      await prisma.$transaction(async (tx) => {
        await tx.weekMarketplaceProposal.update({
          where: { id: proposal.id },
          data: {
            proposerAcceptedAt: new Date(),
            status: "ACCEPTED_BY_PROPOSER",
          },
        });
        await logMarketplaceEvent(tx, {
          listingId: listing.id,
          actorCotistaId: params.actorCotistaId,
          action: "PROPOSER_CONFIRMED_EXCHANGE",
          payload: { proposalId: proposal.id },
        });
      });
      await executeExchangeProposal(proposal.id);
      return { ok: true };
    }

    if (params.action === "seller_confirm_sale") {
      if (!isOwner) {
        return { ok: false, error: "Apenas o vendedor (anunciante) pode confirmar a venda." };
      }
      if (proposal.type !== "SALE") {
        return { ok: false, error: "Esta ação é só para venda." };
      }
      if (proposal.status !== "ACCEPTED_BY_OWNER") {
        return { ok: false, error: "Aceite a proposta antes." };
      }
      await prisma.weekMarketplaceProposal.update({
        where: { id: proposal.id },
        data: { sellerConfirmedAt: new Date() },
      });
      await tryCompleteSale(proposal.id);
      return { ok: true };
    }

    if (params.action === "buyer_confirm_sale") {
      if (!isProposer) {
        return { ok: false, error: "Apenas o comprador pode confirmar a compra." };
      }
      if (proposal.type !== "SALE") {
        return { ok: false, error: "Esta ação é só para venda." };
      }
      if (proposal.status !== "ACCEPTED_BY_OWNER") {
        return { ok: false, error: "O anunciante ainda não aceitou." };
      }
      await prisma.weekMarketplaceProposal.update({
        where: { id: proposal.id },
        data: { buyerConfirmedAt: new Date() },
      });
      await tryCompleteSale(proposal.id);
      return { ok: true };
    }

    return { ok: false, error: "Ação inválida." };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro ao processar.";
    return { ok: false, error: msg };
  }
}
