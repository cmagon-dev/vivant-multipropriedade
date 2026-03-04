import { NextRequest, NextResponse } from "next/server";
import { getCotistaSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

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

    const cota = await prisma.cotaPropriedade.findFirst({
      where: {
        id: params.id,
        cotistaId: session.user.id
      },
      include: {
        property: {
          include: {
            destino: true
          }
        }
      }
    });

    if (!cota) {
      return NextResponse.json(
        { error: "Cota não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: cota.id,
      numeroCota: cota.numeroCota,
      percentualCota: Number(cota.percentualCota),
      semanasAno: cota.semanasAno,
      semanasConfig: cota.semanasConfig,
      property: {
        id: cota.property.id,
        name: cota.property.name,
        location: cota.property.location,
        images: cota.property.images,
      }
    });

  } catch (error) {
    console.error("Erro ao carregar cota:", error);
    return NextResponse.json(
      { error: "Erro ao carregar cota" },
      { status: 500 }
    );
  }
}
