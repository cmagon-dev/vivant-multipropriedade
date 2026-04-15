import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { generateThuToWedWeeks } from "@/lib/vivant/official-calendar";
import { toAdminWeekJson } from "@/lib/vivant/admin-week-visual";
import type { OfficialWeekType, WeekTier } from "@prisma/client";

function canManage(session: unknown) {
  const s = session as { user?: { userType?: string } } | null;
  if (!s?.user || s.user.userType !== "admin") return false;
  return (
    hasPermission(session as any, "vivantCare.propriedades.manage") ||
    hasPermission(session as any, "vivantCare.propriedades.view")
  );
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!canManage(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const { id: propertyId } = await ctx.params;
    const yearParam = _req.nextUrl.searchParams.get("year");
    const year = yearParam ? parseInt(yearParam, 10) : new Date().getFullYear();

    const calYear = await prisma.propertyCalendarYear.findUnique({
      where: { propertyId_year: { propertyId, year } },
      include: {
        weeks: {
          orderBy: { weekIndex: "asc" },
          include: {
            assignments: { select: { id: true } },
            weekReservations: {
              select: { status: true },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
        },
      },
    });

    const weeksJson =
      calYear?.weeks.map((w) => toAdminWeekJson(w)) ?? [];

    return NextResponse.json({
      weeks: weeksJson,
      calendarYear: calYear
        ? { id: calYear.id, year: calYear.year, status: calYear.status, label: calYear.label }
        : null,
      year,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao listar semanas" },
      { status: 500 }
    );
  }
}

/** Cria ou atualiza semanas oficiais em lote (admin). */
export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { userType?: string }).userType !== "admin") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    if (!hasPermission(session as any, "vivantCare.propriedades.manage")) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const { id: propertyId } = await ctx.params;
    const prop = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!prop) {
      return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 });
    }

    const body = await request.json();
    const { weeks, generate } = body as {
      weeks?: Array<{
        weekIndex: number;
        startDate: string;
        endDate: string;
        description?: string | null;
        officialWeekType?: OfficialWeekType;
        tier?: WeekTier;
        isExtra?: boolean;
        weight?: number;
        isBlocked?: boolean;
        exchangeAllowed?: boolean;
        notes?: string | null;
      }>;
      generate?: {
        year: number;
        pattern: "SAT_TO_SAT" | "THU_TO_WED";
        weightDefault?: number;
      };
    };

    if (generate?.year && (generate.pattern === "SAT_TO_SAT" || generate.pattern === "THU_TO_WED")) {
      const { calendarYear, weeks: created } = await generateThuToWedWeeks(
        propertyId,
        generate.year
      );
      const weeksWithStatus = created.map((w) => toAdminWeekJson(w));
      return NextResponse.json({
        ok: true,
        count: created.length,
        weeks: weeksWithStatus,
        calendarYear: {
          id: calendarYear.id,
          status: calendarYear.status,
          year: calendarYear.year,
        },
      });
    }

    if (!weeks?.length) {
      return NextResponse.json(
        { error: "Informe weeks[] ou generate" },
        { status: 400 }
      );
    }

    const yearFromFirst = new Date(weeks[0].startDate).getFullYear();
    const calYear = await prisma.propertyCalendarYear.upsert({
      where: { propertyId_year: { propertyId, year: yearFromFirst } },
      create: { propertyId, year: yearFromFirst, status: "DRAFT" },
      update: {},
    });

    let upserted = 0;
    for (const w of weeks) {
      await prisma.propertyCalendarWeek.upsert({
        where: {
          propertyCalendarYearId_weekIndex: {
            propertyCalendarYearId: calYear.id,
            weekIndex: w.weekIndex,
          },
        },
        create: {
          propertyCalendarYearId: calYear.id,
          weekIndex: w.weekIndex,
          startDate: new Date(w.startDate),
          endDate: new Date(w.endDate),
          description: w.description ?? null,
          officialWeekType: w.officialWeekType ?? "TYPE_1",
          tier: w.tier ?? "SILVER",
          isExtra: !!w.isExtra,
          weight: w.weight ?? 1,
          isBlocked: !!w.isBlocked,
          exchangeAllowed: w.exchangeAllowed !== false,
          notes: w.notes ?? null,
        },
        update: {
          startDate: new Date(w.startDate),
          endDate: new Date(w.endDate),
          description: w.description ?? null,
          officialWeekType: w.officialWeekType ?? "TYPE_1",
          tier: w.tier ?? "SILVER",
          isExtra: !!w.isExtra,
          weight: w.weight ?? 1,
          isBlocked: !!w.isBlocked,
          exchangeAllowed: w.exchangeAllowed !== false,
          notes: w.notes ?? null,
        },
      });
      upserted += 1;
    }

    return NextResponse.json({ ok: true, upserted, calendarYearId: calYear.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao salvar semanas" },
      { status: 500 }
    );
  }
}
