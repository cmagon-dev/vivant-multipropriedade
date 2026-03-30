import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
    const session = await getServerSession(authOptions);
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
            reservas: {
              where: { ano },
              orderBy: { numeroSemana: "asc" },
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

    const [propertyWeeks, cycle] = await Promise.all([
      prisma.propertyWeek.findMany({
        where: { propertyId, year: ano },
        orderBy: { weekIndex: "asc" },
      }),
      prisma.propertyAllocationCycle.findFirst({
        where: { propertyId, yearRef: ano },
        orderBy: { createdAt: "desc" },
        include: {
          allocations: {
            include: {
              cota: {
                include: {
                  cotista: { select: { id: true, name: true, email: true } },
                },
              },
            },
          },
        },
      }),
    ]);

    const allocByWeekId = new Map(
      (cycle?.allocations ?? []).map((a) => [a.propertyWeekId, a])
    );

    const cotasComDireitoLegacy = (semana: number) => {
      return propriedade.cotas.filter((cota) => {
        const config = cota.semanasConfig as { weeks?: number[] } | null;
        if (config && Array.isArray(config.weeks)) {
          return config.weeks.includes(semana);
        }
        return false;
      });
    };

    const buildSlot = (semana: number, pw: (typeof propertyWeeks)[0] | null) => {
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
        const reserva = cota.reservas.find((r) => r.numeroSemana === semana);
        if (reserva) {
          reservaInfo = {
            id: reserva.id,
            status: reserva.status,
            dataInicio: reserva.dataInicio.toISOString(),
            dataFim: reserva.dataFim.toISOString(),
            confirmadoEm: reserva.confirmadoEm?.toISOString() ?? null,
          };
          cotaReserva = {
            id: cota.id,
            numeroCota: cota.numeroCota,
            cotista: cota.cotista,
          };
          break;
        }
      }

      const alloc = pw ? allocByWeekId.get(pw.id) : undefined;
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

      const direito = cotasComDireitoLegacy(semana);

      return {
        semana,
        propertyWeek: pw
          ? {
              id: pw.id,
              label: pw.label,
              weekIndex: pw.weekIndex,
              startDate: pw.startDate.toISOString(),
              endDate: pw.endDate.toISOString(),
              isBlocked: pw.isBlocked,
              seasonType: pw.seasonType,
            }
          : null,
        reserva: reservaInfo,
        cota: cotaExibicao,
        origemCota,
        disponivel: !reservaInfo && !cotaAlocacao,
        cotasComDireito: direito.map((c) => ({
          id: c.id,
          numeroCota: c.numeroCota,
          cotista: c.cotista,
        })),
      };
    };

    let calendario: ReturnType<typeof buildSlot>[];

    if (propertyWeeks.length > 0) {
      calendario = propertyWeeks.map((pw) => buildSlot(pw.weekIndex, pw));
    } else {
      calendario = [];
      for (let semana = 1; semana <= 52; semana++) {
        calendario.push(buildSlot(semana, null));
      }
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
