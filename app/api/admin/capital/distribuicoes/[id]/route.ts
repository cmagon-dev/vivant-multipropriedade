import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { createCapitalPaymentWithSplit } from "@/lib/capital/payment-engine";
import { parseEnumValue } from "@/lib/capital/api-validation";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const companyId = await getCapitalCompanyId(session);

    const { id } = await params;
    const dist = await prisma.capitalDistribution.findFirst({
      where: { id, companyId },
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
    const session = await getSession();
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const companyId = await getCapitalCompanyId(session);

    const { id } = await params;
    const body = await request.json();
    let status: "RASCUNHO" | "APROVADA" | "PAGA";
    try {
      status = parseEnumValue(body?.status, ["RASCUNHO", "APROVADA", "PAGA"] as const, "status");
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "status inválido" },
        { status: 400 }
      );
    }

    const current = await prisma.capitalDistribution.findFirst({
      where: { id, companyId },
      include: { items: true },
    });
    if (!current) {
      return NextResponse.json({ error: "Distribuição não encontrada" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.capitalDistribution.update({
        where: { id },
        data: {
          status,
          ...(status === "APROVADA" && { dataAprovacao: new Date() }),
        },
      });

      if (status === "PAGA" && current.status !== "PAGA") {
        for (const item of current.items) {
          const participation = await tx.capitalParticipation.findFirst({
            where: {
              companyId,
              investorProfileId: item.investorProfileId,
              assetConfigId: current.assetConfigId,
              status: { in: ["ATIVO", "PAGO"] },
            },
            select: { id: true },
          });
          if (!participation) {
            throw new Error("Participação ativa não encontrada para item de distribuição");
          }

          await createCapitalPaymentWithSplit({
            companyId,
            investmentId: participation.id,
            amount: Number(item.valorDevido),
            paidAt: new Date(),
            status: "PAGO",
            direction: "OUT",
            referenceId: current.id,
            tx,
          });

          await tx.capitalDistributionItem.update({
            where: { id: item.id },
            data: { status: "PAGO", valorPago: item.valorDevido },
          });
        }
      }
    });

    const dist = await prisma.capitalDistribution.findFirst({
      where: { id, companyId },
      include: { assetConfig: { include: { property: { select: { name: true } } } } },
    });
    if (!dist) return NextResponse.json({ error: "Distribuição não encontrada" }, { status: 404 });

    return NextResponse.json({
      ...dist,
      receitaBruta: Number(dist.receitaBruta),
      custos: Number(dist.custos),
      resultadoDistribuivel: Number(dist.resultadoDistribuivel),
      valorTotalDistribuido: Number(dist.valorTotalDistribuido),
    });
  } catch (e) {
    console.error("Erro ao atualizar distribuição:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro ao atualizar distribuição" }, { status: 500 });
  }
}
