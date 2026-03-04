import { NextRequest, NextResponse } from "next/server";
import { getCotistaSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCotistaSession();

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { status, observacoes, limpezaSolicitada } = body;

    const reserva = await prisma.reserva.findFirst({
      where: {
        id: params.id,
        cotistaId: session.user.id
      }
    });

    if (!reserva) {
      return NextResponse.json(
        { error: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    const updateData: any = {};

    if (status) {
      updateData.status = status;
      
      if (status === "EM_USO") {
        updateData.checkInEm = new Date();
      } else if (status === "FINALIZADA") {
        updateData.checkOutEm = new Date();
      }
    }

    if (observacoes !== undefined) {
      updateData.observacoes = observacoes;
    }

    if (limpezaSolicitada !== undefined) {
      updateData.limpezaSolicitada = limpezaSolicitada;
    }

    const updatedReserva = await prisma.reserva.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      reserva: updatedReserva
    });

  } catch (error) {
    console.error("Erro ao atualizar reserva:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar reserva" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCotistaSession();

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const reserva = await prisma.reserva.findFirst({
      where: {
        id: params.id,
        cotistaId: session.user.id
      },
      include: {
        cota: {
          include: {
            property: {
              include: {
                destino: true
              }
            }
          }
        }
      }
    });

    if (!reserva) {
      return NextResponse.json(
        { error: "Reserva não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ reserva });

  } catch (error) {
    console.error("Erro ao carregar reserva:", error);
    return NextResponse.json(
      { error: "Erro ao carregar reserva" },
      { status: 500 }
    );
  }
}
