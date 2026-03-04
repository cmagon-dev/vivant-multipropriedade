import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { getAdminSession } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
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

    const body = await request.json();
    const { cotistaId, numeroCota, percentualCota, semanasAno } = body;

    if (!cotistaId || !numeroCota) {
      return NextResponse.json(
        { error: "Cotista e número da cota são obrigatórios" },
        { status: 400 }
      );
    }

    // Verificar se a propriedade existe
    const propriedade = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        cotas: true,
      }
    });

    if (!propriedade) {
      return NextResponse.json(
        { error: "Propriedade não encontrada" },
        { status: 404 }
      );
    }

    // Validar se totalCotas foi definido
    if (!propriedade.totalCotas) {
      return NextResponse.json(
        { error: "Configure o total de cotas da propriedade antes de alocar cotas" },
        { status: 400 }
      );
    }

    // Verificar se o limite de cotas foi atingido
    if (propriedade.cotas.length >= propriedade.totalCotas) {
      return NextResponse.json(
        { error: `Limite de cotas atingido. Esta propriedade possui apenas ${propriedade.totalCotas} cotas disponíveis.` },
        { status: 400 }
      );
    }

    // Verificar se o número da cota já está em uso
    const cotaExistente = propriedade.cotas.find(c => c.numeroCota === numeroCota);
    if (cotaExistente) {
      return NextResponse.json(
        { error: `Cota número ${numeroCota} já está alocada` },
        { status: 400 }
      );
    }

    // Validar soma de percentuais
    const percentualAtual = percentualCota || 0;
    const somaPercentuais = propriedade.cotas.reduce((sum, c) => {
      const percentual = c.percentualCota ? Number(c.percentualCota) : 0;
      return sum + percentual;
    }, 0);
    
    if (somaPercentuais + percentualAtual > 100) {
      return NextResponse.json(
        { error: `Soma dos percentuais das cotas excede 100%. Percentual disponível: ${100 - somaPercentuais}%` },
        { status: 400 }
      );
    }

    // Verificar se o cotista existe
    const cotista = await prisma.cotista.findUnique({
      where: { id: cotistaId },
    });

    if (!cotista) {
      return NextResponse.json(
        { error: "Cotista não encontrado" },
        { status: 404 }
      );
    }

    // Criar a cota
    const cota = await prisma.cotaPropriedade.create({
      data: {
        cotistaId,
        propertyId: params.id,
        numeroCota,
        percentualCota: percentualCota || 0,
        semanasAno: semanasAno || 0,
        semanasConfig: {
          baseYear: new Date().getFullYear(),
          weeks: []
        },
        ativo: true,
      },
      include: {
        cotista: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(cota, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar cota:", error);
    return NextResponse.json(
      { error: "Erro ao criar cota" },
      { status: 500 }
    );
  }
}
