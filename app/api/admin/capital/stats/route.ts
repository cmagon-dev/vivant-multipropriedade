import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";

export async function GET() {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const companyId = await getCapitalCompanyId(session);

    const [
      totalCaptado,
      totalDistribuidoPago,
      investidoresAtivos,
      ativosVinculados,
      solicitacoesPendentes,
      wallet,
      paidPayments,
      pendingPayments,
      assetsReturnRate,
    ] = await Promise.all([
      prisma.capitalParticipation.aggregate({
        where: { companyId, status: { in: ["ATIVO", "PAGO", "RESERVADO"] } },
        _sum: { valorAportado: true },
      }),
      prisma.capitalDistributionItem.aggregate({
        where: { companyId, status: "PAGO" },
        _sum: { valorPago: true },
      }),
      prisma.capitalInvestorProfile.count({ where: { companyId, status: "ATIVO" } }),
      prisma.capitalAssetConfig.count({ where: { companyId, enabled: true } }),
      prisma.capitalLiquidityRequest.count({ where: { companyId, status: "PENDENTE" } }),
      prisma.capitalWallet.findUnique({ where: { companyId } }),
      prisma.capitalPayment.aggregate({
        where: { companyId, status: "PAGO" },
        _sum: { amount: true },
      }),
      prisma.capitalPayment.aggregate({
        where: { companyId, status: { not: "PAGO" } },
        _sum: { amount: true },
      }),
      prisma.capitalAssetConfig.aggregate({
        where: { companyId, enabled: true },
        _avg: { expectedReturnRate: true },
      }),
    ]);

    const totalDistribuidoFromItems = Number(totalDistribuidoPago._sum.valorPago ?? 0);
    const totalDistributedWallet = Number(wallet?.totalDistributed ?? 0);
    const reconciliationGap = Number((totalDistributedWallet - totalDistribuidoFromItems).toFixed(2));

    return NextResponse.json({
      totalCaptado: Number(totalCaptado._sum.valorAportado ?? 0),
      totalDistribuido: totalDistribuidoFromItems,
      investidoresAtivos,
      ativosVinculados,
      solicitacoesPendentes,
      totalPago: Number(paidPayments._sum.amount ?? 0),
      totalPendente: Number(pendingPayments._sum.amount ?? 0),
      rentabilidadeProjetadaMedia: Number(assetsReturnRate._avg.expectedReturnRate ?? 0),
      totalGuaranteeBalance: Number(wallet?.totalGuaranteeBalance ?? 0),
      totalOperationBalance: Number(wallet?.totalOperationBalance ?? 0),
      totalReceived: Number(wallet?.totalReceived ?? 0),
      totalDistributedWallet,
      reconciliationGap,
    });
  } catch (e) {
    console.error("Erro ao buscar stats Capital:", e);
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
