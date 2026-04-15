import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const { searchParams } = new URL(request.url);
    const upcoming = searchParams.get("upcoming") === "true";
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const year = searchParams.get("ano")
      ? parseInt(searchParams.get("ano")!, 10)
      : undefined;

    const now = new Date();

    const where = {
      cotistaId,
      ...(year !== undefined
        ? { calendarWeek: { calendarYear: { year } } }
        : {}),
      ...(upcoming ? { calendarWeek: { startDate: { gte: now } } } : {}),
    };

    const reservas = await prisma.weekReservation.findMany({
      where,
      include: {
        calendarWeek: { include: { calendarYear: { select: { year: true } } } },
        cota: {
          include: {
            property: {
              include: {
                destino: true,
              },
            },
          },
        },
      },
      orderBy: {
        calendarWeek: { startDate: "asc" },
      },
      take: limit,
    });

    const formattedReservas = reservas.map((reserva) => ({
      id: reserva.id,
      propertyCalendarWeekId: reserva.propertyCalendarWeekId,
      weekIndex: reserva.calendarWeek.weekIndex,
      year: reserva.calendarWeek.calendarYear.year,
      dataInicio: reserva.calendarWeek.startDate,
      dataFim: reserva.calendarWeek.endDate,
      officialWeekType: reserva.calendarWeek.officialWeekType,
      tier: reserva.calendarWeek.tier,
      description: reserva.calendarWeek.description,
      status: reserva.status,
      observacoes: reserva.observacoes,
      confirmadoEm: reserva.confirmadoEm,
      limpezaSolicitada: reserva.limpezaSolicitada,
      property: {
        id: reserva.cota.property.id,
        name: reserva.cota.property.name,
        location: reserva.cota.property.location,
      },
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
