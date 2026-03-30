import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const body = await request.json();
    const { status, observacoes, limpezaSolicitada } = body;

    const reserva = await prisma.reserva.findFirst({
      where: {
        id: params.id,
        cotistaId
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
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const reserva = await prisma.reserva.findFirst({
      where: {
        id: params.id,
        cotistaId
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
