import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any).userType !== "cotista") {
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

    const statusFinanceiro = pagamentosPendentes > 0 ? "PENDENTE" : "EM_DIA";

    return NextResponse.json({
      proximasReservas: reservasProximas,
      pagamentosPendentes,
      propriedades: cotas,
      proximaSemana,
      statusFinanceiro,
    });

  } catch (error) {
    console.error("Erro ao carregar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao carregar estatísticas" },
      { status: 500 }
    );
  }
}
