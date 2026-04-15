import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const cota = await prisma.cotaPropriedade.findFirst({
      where: {
        id: params.id,
        cotistaId
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
