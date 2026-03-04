import { NextRequest, NextResponse } from "next/server";
import { getCotistaSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getCotistaSession();

    if (!session) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const cobranca = await prisma.cobranca.findFirst({
      where: {
        id: params.id,
        cota: {
          cotistaId: session.user.id
        }
      },
      include: {
        cota: {
          include: {
            property: true
          }
        }
      }
    });

    if (!cobranca) {
      return NextResponse.json(
        { error: "Cobrança não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      cobranca: {
        id: cobranca.id,
        tipo: cobranca.tipo,
        descricao: cobranca.descricao,
        valor: Number(cobranca.valor),
        valorPago: Number(cobranca.valorPago),
        mesReferencia: cobranca.mesReferencia,
        anoReferencia: cobranca.anoReferencia,
        dataVencimento: cobranca.dataVencimento,
        dataPagamento: cobranca.dataPagamento,
        status: cobranca.status,
        urlBoleto: cobranca.urlBoleto,
        urlComprovante: cobranca.urlComprovante,
        observacoes: cobranca.observacoes,
        property: {
          name: cobranca.cota.property.name,
          location: cobranca.cota.property.location
        }
      }
    });

  } catch (error) {
    console.error("Erro ao carregar cobrança:", error);
    return NextResponse.json(
      { error: "Erro ao carregar cobrança" },
      { status: 500 }
    );
  }
}
