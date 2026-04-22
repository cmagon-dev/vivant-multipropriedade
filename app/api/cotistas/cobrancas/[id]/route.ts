import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const cobranca = await prisma.cobranca.findFirst({
      where: {
        id: params.id,
        cota: {
          cotistaId
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
