import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { id } = await params;
    const dist = await prisma.capitalDistribution.findUnique({
      where: { id },
      include: {
        assetConfig: { include: { property: { select: { id: true, name: true } } } },
        items: {
          include: {
            investorProfile: { include: { user: { select: { name: true, email: true } } } },
          },
        },
      },
    });
    if (!dist) return NextResponse.json({ error: "Distribuição não encontrada" }, { status: 404 });

    return NextResponse.json({
      ...dist,
      receitaBruta: Number(dist.receitaBruta),
      custos: Number(dist.custos),
      taxaAdministracaoValor: Number(dist.taxaAdministracaoValor),
      reservaValor: Number(dist.reservaValor),
      resultadoDistribuivel: Number(dist.resultadoDistribuivel),
      valorTotalDistribuido: Number(dist.valorTotalDistribuido),
      items: dist.items.map((i) => ({
        ...i,
        percentualAplicado: Number(i.percentualAplicado),
        valorDevido: Number(i.valorDevido),
        valorPago: Number(i.valorPago),
      })),
    });
  } catch (e) {
    console.error("Erro ao buscar distribuição:", e);
    return NextResponse.json({ error: "Erro ao buscar distribuição" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !["RASCUNHO", "APROVADA", "PAGA"].includes(status)) {
      return NextResponse.json({ error: "status inválido (RASCUNHO, APROVADA, PAGA)" }, { status: 400 });
    }

    const dist = await prisma.capitalDistribution.update({
      where: { id },
      data: {
        status,
        ...(status === "APROVADA" && { dataAprovacao: new Date() }),
      },
      include: { assetConfig: { include: { property: { select: { name: true } } } } },
    });

    return NextResponse.json({
      ...dist,
      receitaBruta: Number(dist.receitaBruta),
      custos: Number(dist.custos),
      resultadoDistribuivel: Number(dist.resultadoDistribuivel),
      valorTotalDistribuido: Number(dist.valorTotalDistribuido),
    });
  } catch (e) {
    console.error("Erro ao atualizar distribuição:", e);
    return NextResponse.json({ error: "Erro ao atualizar distribuição" }, { status: 500 });
  }
}
