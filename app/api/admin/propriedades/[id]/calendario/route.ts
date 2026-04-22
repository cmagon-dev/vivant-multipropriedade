import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

function canView(session: unknown) {
  const s = session as { user?: { userType?: string } } | null;
  if (!s?.user || s.user.userType !== "admin") return false;
  return (
    hasPermission(session as any, "vivantCare.propriedades.view") ||
    hasPermission(session as any, "vivantCare.propriedades.manage")
  );
}

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canView(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { id: propertyId } = await ctx.params;
    const { searchParams } = request.nextUrl;
    const ano = parseInt(
      searchParams.get("ano") || new Date().getFullYear().toString(),
      10
    );

    const propriedade = await prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        cotas: {
          where: { ativo: true },
          include: {
            cotista: {
              select: { id: true, name: true, email: true },
            },
            weekReservations: {
              where: {
                calendarWeek: {
                  calendarYear: { year: ano },
                },
              },
              include: { calendarWeek: true },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!propriedade) {
      return NextResponse.json(
        { error: "Propriedade não encontrada" },
        { status: 404 }
      );
    }

    const calYear = await prisma.propertyCalendarYear.findUnique({
      where: { propertyId_year: { propertyId, year: ano } },
      include: {
        weeks: { orderBy: { weekIndex: "asc" } },
      },
    });

    const slot =
      calYear &&
      (await prisma.calendarDistributionSlot.findFirst({
        where: { propertyCalendarYearId: calYear.id },
        orderBy: { createdAt: "desc" },
        include: {
          assignments: {
            include: {
              cota: {
                include: {
                  cotista: { select: { id: true, name: true, email: true } },
                },
              },
            },
          },
        },
      }));

    const allocByWeekId = new Map(
      (slot?.assignments ?? []).map((a) => [a.propertyCalendarWeekId, a])
    );

    const propertyWeeks = calYear?.weeks ?? [];

    const buildSlot = (
      pw: (typeof propertyWeeks)[0] | null
    ) => {
      if (!pw) return null;

      let reservaInfo: {
        id: string;
        status: string;
        dataInicio: string;
        dataFim: string;
        confirmadoEm: string | null;
      } | null = null;
      let cotaReserva: {
        id: string;
        numeroCota: string;
        cotista: { id: string; name: string; email: string };
      } | null = null;

      for (const cota of propriedade.cotas) {
        const res = cota.weekReservations.find(
          (r) => r.propertyCalendarWeekId === pw.id
        );
        if (res) {
          reservaInfo = {
            id: res.id,
            status: res.status,
            dataInicio: res.calendarWeek.startDate.toISOString(),
            dataFim: res.calendarWeek.endDate.toISOString(),
            confirmadoEm: res.confirmadoEm?.toISOString() ?? null,
          };
          cotaReserva = {
            id: cota.id,
            numeroCota: cota.numeroCota,
            cotista: cota.cotista,
          };
          break;
        }
      }

      const alloc = allocByWeekId.get(pw.id);
      const cotaAlocacao = alloc
        ? {
            id: alloc.cota.id,
            numeroCota: alloc.cota.numeroCota,
            cotista: alloc.cota.cotista,
          }
        : null;

      const cotaExibicao = cotaReserva ?? cotaAlocacao;
      const origemCota: "RESERVA" | "ALOCACAO" | null = cotaReserva
        ? "RESERVA"
        : cotaAlocacao
          ? "ALOCACAO"
          : null;

      return {
        semana: pw.weekIndex,
        propertyWeek: {
          id: pw.id,
          description: pw.description,
          weekIndex: pw.weekIndex,
          startDate: pw.startDate.toISOString(),
          endDate: pw.endDate.toISOString(),
          isBlocked: pw.isBlocked,
          officialWeekType: pw.officialWeekType,
          tier: pw.tier,
          isExtra: pw.isExtra,
        },
        reserva: reservaInfo,
        cota: cotaExibicao,
        origemCota,
        disponivel: !reservaInfo && !cotaAlocacao,
      };
    };

    let calendario: NonNullable<ReturnType<typeof buildSlot>>[] = [];

    if (propertyWeeks.length > 0) {
      calendario = propertyWeeks.map((pw) => buildSlot(pw)!);
    }

    return NextResponse.json({
      propriedade: {
        id: propriedade.id,
        name: propriedade.name,
        totalCotas: propriedade.totalCotas,
        cotasAlocadas: propriedade.cotas.length,
      },
      ano,
      semanasPlanejadas: propertyWeeks.length,
      calendario,
    });
  } catch (error) {
    console.error("Erro ao buscar calendário:", error);
    return NextResponse.json(
      { error: "Erro ao buscar calendário" },
      { status: 500 }
    );
  }
}
