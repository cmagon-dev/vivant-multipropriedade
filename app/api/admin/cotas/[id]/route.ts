import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || session.user.userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    // Verificar se a cota existe
    const cota = await prisma.cotaPropriedade.findUnique({
      where: { id: params.id },
      include: {
        weekReservations: true,
        cobrancas: true,
      },
    });

    if (!cota) {
      return NextResponse.json(
        { error: "Cota não encontrada" },
        { status: 404 }
      );
    }

    // Verificar se há reservas ou cobranças vinculadas
    if (cota.weekReservations.length > 0 || cota.cobrancas.length > 0) {
      return NextResponse.json(
        { error: "Não é possível remover uma cota com reservas ou cobranças vinculadas" },
        { status: 400 }
      );
    }

    // Deletar a cota
    await prisma.cotaPropriedade.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar cota:", error);
    return NextResponse.json(
      { error: "Erro ao deletar cota" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || session.user.userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { numeroCota, percentualCota, semanasAno, active } = body;

    const cota = await prisma.cotaPropriedade.update({
      where: { id: params.id },
      data: {
        ...(numeroCota !== undefined && { numeroCota }),
        ...(percentualCota !== undefined && { percentualCota }),
        ...(semanasAno !== undefined && { semanasAno }),
        ...(active !== undefined && { ativo: active }),
      },
      include: {
        cotista: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(cota);
  } catch (error) {
    console.error("Erro ao atualizar cota:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar cota" },
      { status: 500 }
    );
  }
}
