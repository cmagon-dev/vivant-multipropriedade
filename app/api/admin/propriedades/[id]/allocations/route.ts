import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
    const session = await getServerSession(authOptions);
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

    const [cotas, weeks, cycles] = await Promise.all([
      prisma.cotaPropriedade.findMany({
        where: { propertyId, ativo: true },
        include: { cotista: { select: { id: true, name: true, email: true } } },
        orderBy: { numeroCota: "asc" },
      }),
      prisma.propertyWeek.findMany({
        where: { propertyId, year },
        orderBy: { weekIndex: "asc" },
      }),
      prisma.propertyAllocationCycle.findMany({
        where: { propertyId },
        orderBy: { createdAt: "desc" },
        include: {
          allocations: {
            include: {
              cota: {
                include: { cotista: { select: { name: true, email: true } } },
              },
              propertyWeek: {
                select: {
                  id: true,
                  weekIndex: true,
                  label: true,
                  startDate: true,
                  endDate: true,
                },
              },
            },
          },
        },
      }),
    ]);

    return NextResponse.json({ cotas, weeks, cycles, year });
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
    const session = await getServerSession(authOptions);
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

    if (action === "createCycle") {
      const { label, yearRef } = body as { label?: string; yearRef?: number };
      if (!label?.trim()) {
        return NextResponse.json({ error: "Informe o nome do ciclo" }, { status: 400 });
      }
      const cycle = await prisma.propertyAllocationCycle.create({
        data: {
          propertyId,
          label: label.trim(),
          yearRef: yearRef ?? null,
          status: "RASCUNHO",
        },
      });
      return NextResponse.json({ cycle });
    }

    if (action === "allocate") {
      const { cycleId, cotaId, propertyWeekId, locked } = body as {
        cycleId?: string;
        cotaId?: string;
        propertyWeekId?: string;
        locked?: boolean;
      };
      if (!cycleId || !cotaId || !propertyWeekId) {
        return NextResponse.json(
          { error: "cycleId, cotaId e propertyWeekId são obrigatórios" },
          { status: 400 }
        );
      }

      const cycle = await prisma.propertyAllocationCycle.findFirst({
        where: { id: cycleId, propertyId },
      });
      if (!cycle) {
        return NextResponse.json({ error: "Ciclo inválido" }, { status: 400 });
      }

      const cota = await prisma.cotaPropriedade.findFirst({
        where: { id: cotaId, propertyId, ativo: true },
      });
      if (!cota) {
        return NextResponse.json({ error: "Cota inválida" }, { status: 400 });
      }

      const week = await prisma.propertyWeek.findFirst({
        where: { id: propertyWeekId, propertyId },
      });
      if (!week) {
        return NextResponse.json({ error: "Semana inválida" }, { status: 400 });
      }

      const row = await prisma.propertyWeekAllocation.upsert({
        where: {
          cycleId_propertyWeekId: { cycleId, propertyWeekId },
        },
        create: {
          cycleId,
          cotaId,
          propertyWeekId,
          locked: !!locked,
          simulationOnly: false,
        },
        update: {
          cotaId,
          locked: locked ?? false,
        },
        include: {
          cota: { include: { cotista: true } },
          propertyWeek: true,
        },
      });

      return NextResponse.json({ allocation: row });
    }

    if (action === "removeAllocation") {
      const { allocationId } = body as { allocationId?: string };
      if (!allocationId) {
        return NextResponse.json({ error: "allocationId obrigatório" }, { status: 400 });
      }
      const row = await prisma.propertyWeekAllocation.findFirst({
        where: { id: allocationId, cycle: { propertyId } },
      });
      if (!row) {
        return NextResponse.json({ error: "Alocação não encontrada" }, { status: 404 });
      }
      await prisma.propertyWeekAllocation.delete({ where: { id: allocationId } });
      return NextResponse.json({ ok: true });
    }

    if (action === "autoDistributePreview") {
      const { cycleId, year: yearBody } = body as {
        cycleId?: string;
        year?: number;
      };
      if (!cycleId) {
        return NextResponse.json({ error: "cycleId é obrigatório" }, { status: 400 });
      }

      const cycle = await prisma.propertyAllocationCycle.findFirst({
        where: { id: cycleId, propertyId },
        include: {
          allocations: {
            select: { cotaId: true, propertyWeekId: true },
          },
        },
      });
      if (!cycle) {
        return NextResponse.json({ error: "Ciclo inválido" }, { status: 400 });
      }

      const year =
        typeof yearBody === "number"
          ? yearBody
          : cycle.yearRef ?? new Date().getFullYear();

      const [cotas, weeks] = await Promise.all([
        prisma.cotaPropriedade.findMany({
          where: { propertyId, ativo: true },
          orderBy: { numeroCota: "asc" },
          select: { id: true },
        }),
        prisma.propertyWeek.findMany({
          where: { propertyId, year },
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
        cycle.allocations.map((a) => ({
          propertyWeekId: a.propertyWeekId,
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
        ...cycle.allocations.map((a) => ({
          cotaId: a.cotaId,
          propertyWeekId: a.propertyWeekId,
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
      const { cycleId, year: yearBody } = body as {
        cycleId?: string;
        year?: number;
      };
      if (!cycleId) {
        return NextResponse.json({ error: "cycleId é obrigatório" }, { status: 400 });
      }

      const cycle = await prisma.propertyAllocationCycle.findFirst({
        where: { id: cycleId, propertyId },
        include: {
          allocations: {
            select: { cotaId: true, propertyWeekId: true },
          },
        },
      });
      if (!cycle) {
        return NextResponse.json({ error: "Ciclo inválido" }, { status: 400 });
      }

      const year =
        typeof yearBody === "number"
          ? yearBody
          : cycle.yearRef ?? new Date().getFullYear();

      const [cotas, weeks] = await Promise.all([
        prisma.cotaPropriedade.findMany({
          where: { propertyId, ativo: true },
          orderBy: { numeroCota: "asc" },
          select: { id: true },
        }),
        prisma.propertyWeek.findMany({
          where: { propertyId, year },
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
        cycle.allocations.map((a) => ({
          propertyWeekId: a.propertyWeekId,
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
          prisma.propertyWeekAllocation.upsert({
            where: {
              cycleId_propertyWeekId: {
                cycleId,
                propertyWeekId: a.propertyWeekId,
              },
            },
            create: {
              cycleId,
              cotaId: a.cotaId,
              propertyWeekId: a.propertyWeekId,
              locked: false,
              simulationOnly: false,
            },
            update: {
              cotaId: a.cotaId,
              locked: false,
              simulationOnly: false,
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
