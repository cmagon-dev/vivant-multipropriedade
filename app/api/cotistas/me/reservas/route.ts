import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).userType !== "cotista") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming") === "true";
    const limit = parseInt(searchParams.get("limit") || "10");
    const ano = searchParams.get("ano") ? parseInt(searchParams.get("ano")!) : undefined;

    const now = new Date();

    const where: any = {
      cotistaId: session.user.id,
    };

    if (upcoming) {
      where.dataInicio = { gte: now };
    }

    if (ano) {
      where.ano = ano;
    }

    const reservas = await prisma.reserva.findMany({
      where,
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
      },
      orderBy: {
        dataInicio: "asc"
      },
      take: limit
    });

    const formattedReservas = reservas.map(reserva => ({
      id: reserva.id,
      numeroSemana: reserva.numeroSemana,
      ano: reserva.ano,
      dataInicio: reserva.dataInicio,
      dataFim: reserva.dataFim,
      status: reserva.status,
      confirmadoEm: reserva.confirmadoEm,
      limpezaSolicitada: reserva.limpezaSolicitada,
      property: {
        id: reserva.cota.property.id,
        name: reserva.cota.property.name,
        location: reserva.cota.property.location,
      }
    }));

    return NextResponse.json({ reservas: formattedReservas });

  } catch (error) {
    console.error("Erro ao carregar reservas:", error);
    return NextResponse.json(
      { error: "Erro ao carregar reservas" },
      { status: 500 }
    );
  }
}
