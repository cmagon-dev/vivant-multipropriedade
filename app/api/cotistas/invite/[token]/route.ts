import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { token } = params;

    const cotista = await prisma.cotista.findUnique({
      where: { inviteToken: token },
      include: {
        cotas: {
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

    if (!cotista) {
      return NextResponse.json(
        { error: "Convite não encontrado" },
        { status: 404 }
      );
    }

    if (cotista.active) {
      return NextResponse.json(
        { error: "Este convite já foi aceito" },
        { status: 400 }
      );
    }

    if (cotista.inviteTokenExpiry && cotista.inviteTokenExpiry < new Date()) {
      return NextResponse.json(
        { error: "Este convite expirou" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      cotista: {
        name: cotista.name,
        email: cotista.email,
        cotas: cotista.cotas.map(cota => ({
          id: cota.id,
          numeroCota: cota.numeroCota,
          semanasAno: cota.semanasAno,
          property: {
            name: cota.property.name,
            location: cota.property.location,
            destino: cota.property.destino.name
          }
        }))
      }
    });

  } catch (error) {
    console.error("Erro ao validar convite:", error);
    return NextResponse.json(
      { error: "Erro ao validar convite" },
      { status: 500 }
    );
  }
}
