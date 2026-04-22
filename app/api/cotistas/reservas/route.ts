import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const body = await request.json();
    const { cotaId, propertyCalendarWeekId, observacoes } = body as {
      cotaId?: string;
      propertyCalendarWeekId?: string;
      observacoes?: string;
    };

    if (!cotaId || !propertyCalendarWeekId) {
      return NextResponse.json(
        { error: "cotaId e propertyCalendarWeekId são obrigatórios" },
        { status: 400 }
      );
    }

    const cota = await prisma.cotaPropriedade.findFirst({
      where: {
        id: cotaId,
        cotistaId,
        ativo: true,
      },
    });

    if (!cota) {
      return NextResponse.json(
        { error: "Cota não encontrada" },
        { status: 404 }
      );
    }

    const week = await prisma.propertyCalendarWeek.findFirst({
      where: {
        id: propertyCalendarWeekId,
        calendarYear: {
          propertyId: cota.propertyId,
          status: "PUBLISHED",
        },
      },
      include: { calendarYear: true },
    });

    if (!week) {
      return NextResponse.json(
        { error: "Semana oficial não encontrada ou calendário não publicado" },
        { status: 404 }
      );
    }

    const assigned = await prisma.propertyWeekAssignment.findFirst({
      where: {
        cotaId,
        propertyCalendarWeekId,
        distributionSlot: {
          propertyCalendarYearId: week.propertyCalendarYearId,
        },
      },
    });

    if (!assigned) {
      return NextResponse.json(
        {
          error:
            "Esta semana não está atribuída à sua cota. Verifique o planejamento com a administração.",
        },
        { status: 403 }
      );
    }

    const existing = await prisma.weekReservation.findUnique({
      where: {
        cotaId_propertyCalendarWeekId: {
          cotaId,
          propertyCalendarWeekId,
        },
      },
    });

    if (existing && existing.status === "CONFIRMADA") {
      return NextResponse.json(
        { error: "Esta semana já está confirmada" },
        { status: 400 }
      );
    }

    const reserva = await prisma.weekReservation.upsert({
      where: {
        cotaId_propertyCalendarWeekId: {
          cotaId,
          propertyCalendarWeekId,
        },
      },
      update: {
        status: "CONFIRMADA",
        confirmadoEm: new Date(),
        observacoes,
      },
      create: {
        cotaId,
        cotistaId,
        propertyCalendarWeekId,
        status: "CONFIRMADA",
        confirmadoEm: new Date(),
        observacoes,
      },
    });

    return NextResponse.json({
      success: true,
      reserva,
    });
  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return NextResponse.json(
      { error: "Erro ao criar reserva" },
      { status: 500 }
    );
  }
}
