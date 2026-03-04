import { NextRequest, NextResponse } from "next/server";
import { getCotistaSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function GET(request: NextRequest) {
  try {
    const session = await getCotistaSession();
    
    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const now = new Date();

    const [cotas, reservasProximas, pagamentosPendentes, proximaReserva] = await Promise.all([
      prisma.cotaPropriedade.count({
        where: {
          cotistaId: session.user.id,
          ativo: true
        }
      }),
      
      prisma.reserva.count({
        where: {
          cotistaId: session.user.id,
          dataInicio: { gte: now },
          status: { in: ["CONFIRMADA", "PENDENTE"] }
        }
      }),
      
      prisma.cobranca.count({
        where: {
          cota: {
            cotistaId: session.user.id
          },
          status: { in: ["PENDENTE", "VENCIDA"] }
        }
      }),
      
      prisma.reserva.findFirst({
        where: {
          cotistaId: session.user.id,
          dataInicio: { gte: now },
          status: { in: ["CONFIRMADA", "PENDENTE"] }
        },
        include: {
          cota: {
            include: {
              property: true
            }
          }
        },
        orderBy: {
          dataInicio: "asc"
        }
      })
    ]);

    const proximaSemana = proximaReserva 
      ? `Semana ${proximaReserva.numeroSemana} em ${proximaReserva.cota.property.name} - ${format(new Date(proximaReserva.dataInicio), "dd 'de' MMMM", { locale: ptBR })}`
      : null;

    return NextResponse.json({
      proximasReservas: reservasProximas,
      pagamentosPendentes,
      propriedades: cotas,
      proximaSemana
    });

  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao carregar estatísticas" },
      { status: 500 }
    );
  }
}
