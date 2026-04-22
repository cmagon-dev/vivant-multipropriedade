import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

/**
 * Estatísticas do cotista.
 * Query opcional `cotaId`: ID de uma linha em `CotaPropriedade` (é o que o seletor do portal
 * grava em localStorage como "selectedPropertyId"). Quando informado, os números refletem só
 * a propriedade dessa cota — alinhado ao contexto do header.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const cotaIdParam = request.nextUrl.searchParams.get("cotaId")?.trim();
    let propertyIdFilter: string | undefined;
    if (cotaIdParam) {
      const ref = await prisma.cotaPropriedade.findFirst({
        where: { id: cotaIdParam, cotistaId, ativo: true },
        select: { propertyId: true },
      });
      if (ref) propertyIdFilter = ref.propertyId;
    }

    const cotaWhere = {
      cotistaId,
      ativo: true,
      ...(propertyIdFilter ? { propertyId: propertyIdFilter } : {}),
    };

    const now = new Date();

    const reservaWhereBase = {
      cotistaId,
      calendarWeek: { startDate: { gte: now } },
      status: { in: ["CONFIRMADA" as const, "PENDENTE" as const] },
      ...(propertyIdFilter ? { cota: { propertyId: propertyIdFilter } } : {}),
    };

    const cobrancaWhereBase = {
      status: { in: ["PENDENTE" as const, "VENCIDA" as const] },
      cota: {
        cotistaId,
        ...(propertyIdFilter ? { propertyId: propertyIdFilter } : {}),
      },
    };

    const cotasAtivas = await prisma.cotaPropriedade.count({ where: cotaWhere });

    const quantidadePropriedades = propertyIdFilter
      ? cotasAtivas > 0
        ? 1
        : 0
      : (
          await prisma.cotaPropriedade.findMany({
            where: { cotistaId, ativo: true },
            select: { propertyId: true },
          })
        ).reduce((acc, row) => {
          acc.add(row.propertyId);
          return acc;
        }, new Set<string>()).size;

    const [reservasProximas, pagamentosPendentes, proximaReserva] = await Promise.all([
      prisma.weekReservation.count({ where: reservaWhereBase }),

      prisma.cobranca.count({ where: cobrancaWhereBase }),

      prisma.weekReservation.findFirst({
        where: reservaWhereBase,
        include: {
          calendarWeek: true,
          cota: {
            include: {
              property: true,
            },
          },
        },
        orderBy: {
          calendarWeek: { startDate: "asc" },
        },
      }),
    ]);

    const proximaSemana = proximaReserva
      ? `Semana ${proximaReserva.calendarWeek.weekIndex} em ${proximaReserva.cota.property.name} - ${format(new Date(proximaReserva.calendarWeek.startDate), "dd 'de' MMMM", { locale: ptBR })}`
      : null;

    const statusFinanceiro = pagamentosPendentes > 0 ? "PENDENTE" : "EM_DIA";

    return NextResponse.json(
      {
        proximasReservas: reservasProximas,
        pagamentosPendentes,
        cotasAtivas,
        quantidadePropriedades,
        proximaSemana,
        statusFinanceiro,
        escopo: propertyIdFilter ? ("propriedade" as const) : ("todas" as const),
      },
      {
        headers: {
          "Cache-Control": "private, no-store, max-age=0",
        },
      }
    );

  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao carregar estatísticas" },
      { status: 500 }
    );
  }
}
