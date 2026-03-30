import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import type { WeekSeasonType } from "@prisma/client";

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

    const weeks = await prisma.propertyWeek.findMany({
      where: { propertyId, year },
      orderBy: [{ weekIndex: "asc" }],
    });

    return NextResponse.json({ weeks, year });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao listar semanas" },
      { status: 500 }
    );
  }
}

/** Cria ou atualiza semanas em lote (admin). */
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
        year: number;
        weekIndex: number;
        startDate: string;
        endDate: string;
        label?: string;
        seasonType?: WeekSeasonType;
        weight?: number;
        isHoliday?: boolean;
        isSchoolVacation?: boolean;
        isBlocked?: boolean;
        isExchangeAllowed?: boolean;
        color?: string;
        notes?: string;
      }>;
      generate?: {
        year: number;
        pattern: "SAT_TO_SAT";
        weightDefault?: number;
      };
    };

    if (generate?.year && generate.pattern === "SAT_TO_SAT") {
      const y = generate.year;
      const weight = generate.weightDefault ?? 1;
      let d = new Date(y, 0, 1);
      while (d.getDay() !== 6) {
        d.setDate(d.getDate() + 1);
      }
      let idx = 1;
      while (d.getFullYear() === y && idx <= 53) {
        const start = new Date(d);
        const end = new Date(d);
        end.setDate(end.getDate() + 6);
        end.setHours(23, 59, 59, 999);
        await prisma.propertyWeek.upsert({
          where: {
            propertyId_year_weekIndex: {
              propertyId,
              year: y,
              weekIndex: idx,
            },
          },
          create: {
            propertyId,
            year: y,
            weekIndex: idx,
            startDate: start,
            endDate: end,
            label: `Semana ${String(idx).padStart(2, "0")}`,
            seasonType: "MEDIA",
            weight,
            isHoliday: false,
            isSchoolVacation: false,
            isBlocked: false,
            isExchangeAllowed: true,
          },
          update: {
            startDate: start,
            endDate: end,
            weight,
          },
        });
        d.setDate(d.getDate() + 7);
        idx += 1;
      }
      const created = await prisma.propertyWeek.findMany({
        where: { propertyId, year: y },
        orderBy: { weekIndex: "asc" },
      });
      return NextResponse.json({ ok: true, count: created.length, weeks: created });
    }

    if (!weeks?.length) {
      return NextResponse.json(
        { error: "Informe weeks[] ou generate" },
        { status: 400 }
      );
    }

    let upserted = 0;
    for (const w of weeks) {
      await prisma.propertyWeek.upsert({
        where: {
          propertyId_year_weekIndex: {
            propertyId,
            year: w.year,
            weekIndex: w.weekIndex,
          },
        },
        create: {
          propertyId,
          year: w.year,
          weekIndex: w.weekIndex,
          startDate: new Date(w.startDate),
          endDate: new Date(w.endDate),
          label: w.label ?? null,
          seasonType: w.seasonType ?? "MEDIA",
          weight: w.weight ?? 1,
          isHoliday: !!w.isHoliday,
          isSchoolVacation: !!w.isSchoolVacation,
          isBlocked: !!w.isBlocked,
          isExchangeAllowed: w.isExchangeAllowed !== false,
          color: w.color ?? null,
          notes: w.notes ?? null,
        },
        update: {
          startDate: new Date(w.startDate),
          endDate: new Date(w.endDate),
          label: w.label ?? null,
          seasonType: w.seasonType ?? "MEDIA",
          weight: w.weight ?? 1,
          isHoliday: !!w.isHoliday,
          isSchoolVacation: !!w.isSchoolVacation,
          isBlocked: !!w.isBlocked,
          isExchangeAllowed: w.isExchangeAllowed !== false,
          color: w.color ?? null,
          notes: w.notes ?? null,
        },
      });
      upserted += 1;
    }

    return NextResponse.json({ ok: true, upserted });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao salvar semanas" },
      { status: 500 }
    );
  }
}
