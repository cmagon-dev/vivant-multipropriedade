import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAdminSession();

    if (!session || session.user.userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const { searchParams } = request.nextUrl;
    const ano = parseInt(searchParams.get("ano") || new Date().getFullYear().toString());

    // Buscar a propriedade com cotas e reservas do ano
    const propriedade = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        cotas: {
          include: {
            cotista: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            },
            reservas: {
              where: {
                ano: ano,
              },
              orderBy: {
                numeroSemana: 'asc',
              }
            }
          }
        }
      }
    });

    if (!propriedade) {
      return NextResponse.json(
        { error: "Propriedade não encontrada" },
        { status: 404 }
      );
    }

    // Construir calendário de 52 semanas
    const calendario = [];
    
    for (let semana = 1; semana <= 52; semana++) {
      // Encontrar reserva desta semana
      let reservaInfo = null;
      let cotaInfo = null;
      
      for (const cota of propriedade.cotas) {
        const reserva = cota.reservas.find(r => r.numeroSemana === semana);
        if (reserva) {
          reservaInfo = {
            id: reserva.id,
            status: reserva.status,
            dataInicio: reserva.dataInicio,
            dataFim: reserva.dataFim,
            confirmadoEm: reserva.confirmadoEm,
          };
          cotaInfo = {
            id: cota.id,
            numeroCota: cota.numeroCota,
            cotista: cota.cotista,
          };
          break;
        }
      }

      // Verificar se alguma cota tem direito a esta semana
      const cotasComDireito = propriedade.cotas.filter(cota => {
        const config = cota.semanasConfig as any;
        if (config && Array.isArray(config.weeks)) {
          return config.weeks.includes(semana);
        }
        return false;
      });

      calendario.push({
        semana,
        reserva: reservaInfo,
        cota: cotaInfo,
        disponivel: !reservaInfo,
        cotasComDireito: cotasComDireito.map(c => ({
          id: c.id,
          numeroCota: c.numeroCota,
          cotista: c.cotista,
        }))
      });
    }

    return NextResponse.json({
      propriedade: {
        id: propriedade.id,
        name: propriedade.name,
        totalCotas: propriedade.totalCotas,
        cotasAlocadas: propriedade.cotas.length,
      },
      ano,
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
