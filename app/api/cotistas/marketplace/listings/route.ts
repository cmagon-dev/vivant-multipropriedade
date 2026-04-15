import type { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";
import {
  assertNoActiveMarketplaceOnWeek,
  logMarketplaceEvent,
  weekIsEligibleForMarketplace,
} from "@/lib/vivant/week-marketplace-service";

export const dynamic = "force-dynamic";

const listingInclude = {
  ownedWeek: true,
  calendarYear: { select: { id: true, year: true } },
  ownerCotista: { select: { id: true, name: true } },
  property: { select: { id: true, name: true } },
} as const;

/** Oportunidades: anúncios publicados da propriedade (opcionalmente exclui o próprio cotista). */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const { searchParams } = request.nextUrl;
    const propertyId = searchParams.get("propertyId");
    const year = searchParams.get("year")
      ? parseInt(searchParams.get("year")!, 10)
      : new Date().getFullYear();
    const excludeMine = searchParams.get("excludeMine") === "1";
    const month = searchParams.get("month"); // 1-12
    const tier = searchParams.get("tier"); // GOLD | SILVER | BLACK
    const typeFilter = searchParams.get("type"); // EXCHANGE | SALE | BOTH

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

    const calYear = await prisma.propertyCalendarYear.findFirst({
      where: { propertyId, year, status: "PUBLISHED" },
    });
    if (!calYear) {
      return NextResponse.json({ listings: [] });
    }

    const where = {
      propertyId,
      propertyCalendarYearId: calYear.id,
      status: "PUBLISHED" as const,
      ...(excludeMine ? { ownerCotistaId: { not: auth.cotistaId } } : {}),
      ...(typeFilter && ["EXCHANGE", "SALE", "BOTH"].includes(typeFilter)
        ? { type: typeFilter as "EXCHANGE" | "SALE" | "BOTH" }
        : {}),
    };

    let listings = await prisma.weekMarketplaceListing.findMany({
      where,
      include: listingInclude,
      orderBy: { createdAt: "desc" },
    });

    if (tier && ["GOLD", "SILVER", "BLACK"].includes(tier)) {
      listings = listings.filter((l) => l.ownedWeek.tier === tier);
    }
    if (month) {
      const m = parseInt(month, 10);
      if (m >= 1 && m <= 12) {
        listings = listings.filter((l) => {
          const d = new Date(l.ownedWeek.startDate);
          return d.getMonth() + 1 === m;
        });
      }
    }

    return NextResponse.json({ listings });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao listar anúncios" }, { status: 500 });
  }
}

/** Criar anúncio (rascunho ou já publicado). */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const body = (await request.json()) as {
      propertyId?: string;
      year?: number;
      ownedCalendarWeekId?: string;
      ownerCotaId?: string;
      type?: "EXCHANGE" | "SALE" | "BOTH";
      publish?: boolean;
      preferences?: Record<string, unknown>;
    };

    const {
      propertyId,
      year = new Date().getFullYear(),
      ownedCalendarWeekId,
      ownerCotaId,
      type,
      publish = false,
      preferences,
    } = body;

    if (!propertyId || !ownedCalendarWeekId || !ownerCotaId || !type) {
      return NextResponse.json(
        { error: "propertyId, ownedCalendarWeekId, ownerCotaId e type são obrigatórios" },
        { status: 400 }
      );
    }

    const cota = await prisma.cotaPropriedade.findFirst({
      where: {
        id: ownerCotaId,
        cotistaId: auth.cotistaId,
        propertyId,
        ativo: true,
      },
    });
    if (!cota) {
      return NextResponse.json({ error: "Cota inválida ou inativa" }, { status: 403 });
    }

    const calYear = await prisma.propertyCalendarYear.findFirst({
      where: { propertyId, year, status: "PUBLISHED" },
    });
    if (!calYear) {
      return NextResponse.json(
        { error: "Calendário deste ano ainda não está publicado." },
        { status: 400 }
      );
    }

    const elig = await weekIsEligibleForMarketplace({
      propertyCalendarWeekId: ownedCalendarWeekId,
      cotaId: ownerCotaId,
      propertyCalendarYearId: calYear.id,
    });
    if (!elig.ok) {
      return NextResponse.json({ error: elig.error }, { status: 400 });
    }

    const free = await assertNoActiveMarketplaceOnWeek(ownedCalendarWeekId);
    if (!free.ok) {
      return NextResponse.json({ error: free.error }, { status: 400 });
    }

    const status = publish ? "PUBLISHED" : "DRAFT";

    const listing = await prisma.$transaction(async (tx) => {
      const created = await tx.weekMarketplaceListing.create({
        data: {
          propertyId,
          propertyCalendarYearId: calYear.id,
          ownerCotistaId: auth.cotistaId,
          ownerCotaId,
          ownedCalendarWeekId,
          type,
          preferences:
            preferences === undefined ? undefined : (preferences as Prisma.InputJsonValue),
          status,
        },
        include: listingInclude,
      });
      await logMarketplaceEvent(tx, {
        listingId: created.id,
        actorCotistaId: auth.cotistaId,
        action: publish ? "LISTING_PUBLISHED" : "LISTING_CREATED_DRAFT",
        payload: { ownedCalendarWeekId, type },
      });
      return created;
    });

    return NextResponse.json({ listing });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Erro ao criar anúncio" }, { status: 500 });
  }
}
