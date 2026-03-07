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
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: any = {
      cota: {
        cotistaId: session.user.id
      }
    };

    if (status) {
      where.status = status;
    }

    const cobrancas = await prisma.cobranca.findMany({
      where,
      include: {
        cota: {
          include: {
            property: true
          }
        }
      },
      orderBy: {
        dataVencimento: "desc"
      },
      take: limit
    });

    const formattedCobrancas = cobrancas.map(cobranca => ({
      id: cobranca.id,
      tipo: cobranca.tipo,
      descricao: cobranca.descricao,
      valor: Number(cobranca.valor),
      valorPago: Number(cobranca.valorPago),
      dataVencimento: cobranca.dataVencimento,
      dataPagamento: cobranca.dataPagamento,
      status: cobranca.status,
      urlBoleto: cobranca.urlBoleto,
      property: {
        name: cobranca.cota.property.name
      }
    }));

    return NextResponse.json({ cobrancas: formattedCobrancas });

  } catch (error) {
    console.error("Erro ao carregar cobranças:", error);
    return NextResponse.json(
      { error: "Erro ao carregar cobranças" },
      { status: 500 }
    );
  }
}
