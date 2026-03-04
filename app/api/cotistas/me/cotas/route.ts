import { NextRequest, NextResponse } from "next/server";
import { getCotistaSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getCotistaSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const cotas = await prisma.cotaPropriedade.findMany({
      where: {
        cotistaId: session.user.id,
        ativo: true
      },
      include: {
        property: {
          include: {
            destino: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    const formattedCotas = cotas.map(cota => ({
      id: cota.id,
      name: cota.property.name,
      location: cota.property.location,
      numeroCota: cota.numeroCota,
      semanasAno: cota.semanasAno,
      destino: cota.property.destino.name,
      property: {
        id: cota.property.id,
        name: cota.property.name,
        location: cota.property.location,
        images: cota.property.images,
      }
    }));

    return NextResponse.json({ cotas: formattedCotas });

  } catch (error) {
    console.error("Erro ao carregar cotas:", error);
    return NextResponse.json(
      { error: "Erro ao carregar cotas" },
      { status: 500 }
    );
  }
}
