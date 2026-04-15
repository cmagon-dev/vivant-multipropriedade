import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const propertyId = request.nextUrl.searchParams.get("propertyId");
    const cotaIdParam = request.nextUrl.searchParams.get("cotaId");
    const yearParam = request.nextUrl.searchParams.get("year");
    const year = yearParam
      ? parseInt(yearParam, 10)
      : new Date().getFullYear();

    if (!propertyId) {
      return NextResponse.json(
        { error: "propertyId é obrigatório" },
        { status: 400 }
      );
    }

    const cota = cotaIdParam
      ? await prisma.cotaPropriedade.findFirst({
          where: {
            id: cotaIdParam,
            cotistaId: auth.cotistaId,
            propertyId,
            ativo: true,
          },
          select: { id: true },
        })
      : await prisma.cotaPropriedade.findFirst({
          where: {
            cotistaId: auth.cotistaId,
            propertyId,
            ativo: true,
          },
          select: { id: true },
        });
    if (!cota) {
      return NextResponse.json(
        { error: "Você não possui cota nesta propriedade" },
        { status: 403 }
      );
    }

    const calYear = await prisma.propertyCalendarYear.findFirst({
      where: { propertyId, year, status: "PUBLISHED" },
    });

    if (!calYear) {
      return NextResponse.json({
        weeks: [],
        myPropertyWeekIds: [],
        allocations: [],
        calendarPublished: false,
      });
    }

    const weeks = await prisma.propertyCalendarWeek.findMany({
      where: { propertyCalendarYearId: calYear.id },
      orderBy: { weekIndex: "asc" },
    });

    const allocations = await prisma.propertyWeekAssignment.findMany({
      where: {
        cotaId: cota.id,
        distributionSlot: { propertyCalendarYearId: calYear.id },
      },
      include: {
        distributionSlot: {
          select: { id: true, label: true, status: true },
        },
      },
    });
    const weekIdSet = new Set(weeks.map((w) => w.id));
    const myWeekIds = new Set(allocations.map((a) => a.propertyCalendarWeekId));

    const overrides =
      weekIdSet.size === 0
        ? []
        : await prisma.weekUsageOverride.findMany({
            where: {
              propertyCalendarWeekId: { in: Array.from(weekIdSet) },
              OR: [{ fromCotaId: cota.id }, { toCotaId: cota.id }],
            },
          });
    for (const o of overrides) {
      if (o.fromCotaId === cota.id) {
        myWeekIds.delete(o.propertyCalendarWeekId);
      }
      if (o.toCotaId === cota.id) {
        myWeekIds.add(o.propertyCalendarWeekId);
      }
    }

    return NextResponse.json({
      weeks,
      myPropertyWeekIds: Array.from(myWeekIds),
      allocations,
      calendarPublished: true,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao carregar semanas" },
      { status: 500 }
    );
  }
}
