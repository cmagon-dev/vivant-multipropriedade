import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();
    
    if (!session || !session.user.role || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { mes, ano, tipo, valor, descricao } = body;

    if (!mes || !ano || !tipo || !valor || !descricao) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const cotas = await prisma.cotaPropriedade.findMany({
      where: {
        ativo: true
      }
    });

    const dataVencimento = new Date(ano, mes, 5);

    const cobrancasData = cotas.map(cota => ({
      cotaId: cota.id,
      tipo,
      descricao,
      valor,
      mesReferencia: mes,
      anoReferencia: ano,
      dataVencimento,
      status: "PENDENTE" as const,
    }));

    const result = await prisma.cobranca.createMany({
      data: cobrancasData,
      skipDuplicates: true,
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} cobranças geradas com sucesso`
    });

  } catch (error) {
    console.error("Erro ao gerar cobranças:", error);
    return NextResponse.json(
      { error: "Erro ao gerar cobranças" },
      { status: 500 }
    );
  }
}
