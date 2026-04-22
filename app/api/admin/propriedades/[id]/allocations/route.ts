import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import {
  buildExistingMap,
  computeBalancedAssignments,
  computeMetrics,
} from "@/lib/vivant/week-distribution";

function isAdmin(session: unknown) {
  const s = session as { user?: { userType?: string } } | null;
  return s?.user?.userType === "admin";
}

function canManageProps(session: unknown) {
  return (
    isAdmin(session) &&
    hasPermission(session as any, "vivantCare.propriedades.manage")
  );
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    if (
      !hasPermission(session as any, "vivantCare.propriedades.view") &&
      !hasPermission(session as any, "vivantCare.propriedades.manage")
    ) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const { id: propertyId } = await ctx.params;
    const yearParam = request.nextUrl.searchParams.get("year");
    const year = yearParam
      ? parseInt(yearParam, 10)
      : new Date().getFullYear();

    const prop = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!prop) {
      return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 });
    }

    const calYear = await prisma.propertyCalendarYear.findUnique({
      where: { propertyId_year: { propertyId, year } },
    });

    const [cotas, weeks, slots] = await Promise.all([
      prisma.cotaPropriedade.findMany({
        where: { propertyId, ativo: true },
        include: { cotista: { select: { id: true, name: true, email: true } } },
        orderBy: { numeroCota: "asc" },
      }),
      calYear
        ? prisma.propertyCalendarWeek.findMany({
            where: { propertyCalendarYearId: calYear.id },
            orderBy: { weekIndex: "asc" },
          })
        : Promise.resolve([]),
      calYear
        ? prisma.calendarDistributionSlot.findMany({
            where: { propertyCalendarYearId: calYear.id },
            orderBy: { createdAt: "desc" },
            include: {
              assignments: {
                include: {
                  cota: {
                    include: { cotista: { select: { name: true, email: true } } },
                  },
                  calendarWeek: {
                    select: {
                      id: true,
                      weekIndex: true,
                      description: true,
                      startDate: true,
                      endDate: true,
                    },
                  },
                },
              },
            },
          })
        : Promise.resolve([]),
    ]);

    return NextResponse.json({
      cotas,
      weeks,
      distributionSlots: slots,
      calendarYear: calYear,
      year,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao carregar dados" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canManageProps(session)) {
      return NextResponse.json(
        { error: "Sem permissão para alocar semanas" },
        { status: 403 }
      );
    }

    const { id: propertyId } = await ctx.params;
    const body = await request.json();
    const { action } = body as { action?: string };

    const prop = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!prop) {
      return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 });
    }

    if (action === "createSlot") {
      const { label, propertyCalendarYearId } = body as {
        label?: string;
        propertyCalendarYearId?: string;
      };
      if (!label?.trim() || !propertyCalendarYearId) {
        return NextResponse.json(
          { error: "Informe label e propertyCalendarYearId" },
          { status: 400 }
        );
      }
      const cy = await prisma.propertyCalendarYear.findFirst({
        where: { id: propertyCalendarYearId, propertyId },
      });
      if (!cy) {
        return NextResponse.json({ error: "Ano de calendário inválido" }, { status: 400 });
      }
      const slot = await prisma.calendarDistributionSlot.create({
        data: {
          propertyCalendarYearId: cy.id,
          label: label.trim(),
          status: "RASCUNHO",
        },
      });
      return NextResponse.json({ distributionSlot: slot });
    }

    if (action === "allocate") {
      const { distributionSlotId, cotaId, propertyCalendarWeekId, locked } = body as {
        distributionSlotId?: string;
        cotaId?: string;
        propertyCalendarWeekId?: string;
        locked?: boolean;
      };
      if (!distributionSlotId || !cotaId || !propertyCalendarWeekId) {
        return NextResponse.json(
          { error: "distributionSlotId, cotaId e propertyCalendarWeekId são obrigatórios" },
          { status: 400 }
        );
      }

      const slot = await prisma.calendarDistributionSlot.findFirst({
        where: { id: distributionSlotId, calendarYear: { propertyId } },
      });
      if (!slot) {
        return NextResponse.json({ error: "Slot inválido" }, { status: 400 });
      }

      const cota = await prisma.cotaPropriedade.findFirst({
        where: { id: cotaId, propertyId, ativo: true },
      });
      if (!cota) {
        return NextResponse.json({ error: "Cota inválida" }, { status: 400 });
      }

      const week = await prisma.propertyCalendarWeek.findFirst({
        where: {
          id: propertyCalendarWeekId,
          calendarYear: { propertyId },
        },
      });
      if (!week) {
        return NextResponse.json({ error: "Semana inválida" }, { status: 400 });
      }

      const row = await prisma.propertyWeekAssignment.upsert({
        where: {
          distributionSlotId_propertyCalendarWeekId: {
            distributionSlotId,
            propertyCalendarWeekId,
          },
        },
        create: {
          distributionSlotId,
          cotaId,
          propertyCalendarWeekId,
          locked: !!locked,
        },
        update: {
          cotaId,
          locked: locked ?? false,
        },
        include: {
          cota: { include: { cotista: true } },
          calendarWeek: true,
        },
      });

      return NextResponse.json({ allocation: row });
    }

    if (action === "removeAllocation") {
      const { allocationId } = body as { allocationId?: string };
      if (!allocationId) {
        return NextResponse.json({ error: "allocationId obrigatório" }, { status: 400 });
      }
      const row = await prisma.propertyWeekAssignment.findFirst({
        where: {
          id: allocationId,
          distributionSlot: { calendarYear: { propertyId } },
        },
      });
      if (!row) {
        return NextResponse.json({ error: "Alocação não encontrada" }, { status: 404 });
      }
      await prisma.propertyWeekAssignment.delete({ where: { id: allocationId } });
      return NextResponse.json({ ok: true });
    }

    if (action === "autoDistributePreview") {
      const { distributionSlotId, year: yearBody } = body as {
        distributionSlotId?: string;
        year?: number;
      };
      if (!distributionSlotId) {
        return NextResponse.json({ error: "distributionSlotId é obrigatório" }, { status: 400 });
      }

      const slot = await prisma.calendarDistributionSlot.findFirst({
        where: { id: distributionSlotId, calendarYear: { propertyId } },
        include: {
          calendarYear: true,
          assignments: {
            select: { cotaId: true, propertyCalendarWeekId: true },
          },
        },
      });
      if (!slot) {
        return NextResponse.json({ error: "Slot inválido" }, { status: 400 });
      }

      const year =
        typeof yearBody === "number"
          ? yearBody
          : slot.calendarYear.year;

      const [cotas, weeks] = await Promise.all([
        prisma.cotaPropriedade.findMany({
          where: { propertyId, ativo: true },
          orderBy: { numeroCota: "asc" },
          select: { id: true },
        }),
        prisma.propertyCalendarWeek.findMany({
          where: { propertyCalendarYearId: slot.propertyCalendarYearId },
          orderBy: { weekIndex: "asc" },
        }),
      ]);

      if (cotas.length === 0) {
        return NextResponse.json(
          { error: "Não há cotas ativas nesta propriedade" },
          { status: 400 }
        );
      }

      const existingMap = buildExistingMap(
        slot.assignments.map((a) => ({
          propertyCalendarWeekId: a.propertyCalendarWeekId,
          cotaId: a.cotaId,
        }))
      );

      const weeksForDist = weeks.map((w) => ({
        id: w.id,
        weight: Number(w.weight),
        isBlocked: w.isBlocked,
      }));

      const newAssignments = computeBalancedAssignments(
        cotas,
        weeksForDist,
        existingMap
      );

      const weeksById = new Map(
        weeks.map((w) => [w.id, { weight: Number(w.weight) }])
      );

      const combined = [
        ...slot.assignments.map((a) => ({
          cotaId: a.cotaId,
          propertyCalendarWeekId: a.propertyCalendarWeekId,
        })),
        ...newAssignments,
      ];

      const metrics = computeMetrics(cotas, weeksById, combined);

      return NextResponse.json({
        year,
        newAssignments,
        newCount: newAssignments.length,
        metrics,
      });
    }

    if (action === "autoDistributeApply") {
      const { distributionSlotId, year: yearBody } = body as {
        distributionSlotId?: string;
        year?: number;
      };
      if (!distributionSlotId) {
        return NextResponse.json({ error: "distributionSlotId é obrigatório" }, { status: 400 });
      }

      const slot = await prisma.calendarDistributionSlot.findFirst({
        where: { id: distributionSlotId, calendarYear: { propertyId } },
        include: {
          calendarYear: true,
          assignments: {
            select: { cotaId: true, propertyCalendarWeekId: true },
          },
        },
      });
      if (!slot) {
        return NextResponse.json({ error: "Slot inválido" }, { status: 400 });
      }

      const year =
        typeof yearBody === "number"
          ? yearBody
          : slot.calendarYear.year;

      const [cotas, weeks] = await Promise.all([
        prisma.cotaPropriedade.findMany({
          where: { propertyId, ativo: true },
          orderBy: { numeroCota: "asc" },
          select: { id: true },
        }),
        prisma.propertyCalendarWeek.findMany({
          where: { propertyCalendarYearId: slot.propertyCalendarYearId },
          orderBy: { weekIndex: "asc" },
        }),
      ]);

      if (cotas.length === 0) {
        return NextResponse.json(
          { error: "Não há cotas ativas nesta propriedade" },
          { status: 400 }
        );
      }

      const existingMap = buildExistingMap(
        slot.assignments.map((a) => ({
          propertyCalendarWeekId: a.propertyCalendarWeekId,
          cotaId: a.cotaId,
        }))
      );

      const weeksForDist = weeks.map((w) => ({
        id: w.id,
        weight: Number(w.weight),
        isBlocked: w.isBlocked,
      }));

      const newAssignments = computeBalancedAssignments(
        cotas,
        weeksForDist,
        existingMap
      );

      await prisma.$transaction(
        newAssignments.map((a) =>
          prisma.propertyWeekAssignment.upsert({
            where: {
              distributionSlotId_propertyCalendarWeekId: {
                distributionSlotId,
                propertyCalendarWeekId: a.propertyCalendarWeekId,
              },
            },
            create: {
              distributionSlotId,
              cotaId: a.cotaId,
              propertyCalendarWeekId: a.propertyCalendarWeekId,
              locked: false,
            },
            update: {
              cotaId: a.cotaId,
              locked: false,
            },
          })
        )
      );

      return NextResponse.json({
        ok: true,
        applied: newAssignments.length,
      });
    }

    return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao processar" },
      { status: 500 }
    );
  }
}
