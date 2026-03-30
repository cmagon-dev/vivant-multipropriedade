import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";
import { getWeekInfo } from "@/lib/calendar-rotation";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const body = await request.json();
    const { cotaId, ano, numeroSemana, observacoes } = body;

    const cota = await prisma.cotaPropriedade.findFirst({
      where: {
        id: cotaId,
        cotistaId,
        ativo: true
      }
    });

    if (!cota) {
      return NextResponse.json(
        { error: "Cota não encontrada" },
        { status: 404 }
      );
    }

    const existingReserva = await prisma.reserva.findUnique({
      where: {
        cotaId_ano_numeroSemana: {
          cotaId,
          ano,
          numeroSemana
        }
      }
    });

    if (existingReserva && existingReserva.status === "CONFIRMADA") {
      return NextResponse.json(
        { error: "Esta semana já está confirmada" },
        { status: 400 }
      );
    }

    const weekInfo = getWeekInfo(ano, numeroSemana);

    const reserva = await prisma.reserva.upsert({
      where: {
        cotaId_ano_numeroSemana: {
          cotaId,
          ano,
          numeroSemana
        }
      },
      update: {
        status: "CONFIRMADA",
        confirmadoEm: new Date(),
        observacoes
      },
      create: {
        cotaId,
        cotistaId,
        ano,
        numeroSemana,
        dataInicio: weekInfo.startDate,
        dataFim: weekInfo.endDate,
        status: "CONFIRMADA",
        confirmadoEm: new Date(),
        observacoes
      }
    });

    return NextResponse.json({
      success: true,
      reserva
    });

  } catch (error) {
    console.error("Erro ao criar reserva:", error);
    return NextResponse.json(
      { error: "Erro ao criar reserva" },
      { status: 500 }
    );
  }
}
