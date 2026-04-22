import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const [totalCaptado, totalDistribuido, investidoresAtivos, ativosVinculados, solicitacoesPendentes] = await Promise.all([
      prisma.capitalParticipation.aggregate({
        where: { status: "ATIVO" },
        _sum: { valorAportado: true },
      }),
      prisma.capitalDistributionItem.aggregate({
        where: { status: "PAGO" },
        _sum: { valorPago: true },
      }),
      prisma.capitalInvestorProfile.count({ where: { status: "ATIVO" } }),
      prisma.capitalAssetConfig.count({ where: { enabled: true } }),
      prisma.capitalLiquidityRequest.count({ where: { status: "PENDENTE" } }),
    ]);

    return NextResponse.json({
      totalCaptado: Number(totalCaptado._sum.valorAportado ?? 0),
      totalDistribuido: Number(totalDistribuido._sum.valorPago ?? 0),
      investidoresAtivos,
      ativosVinculados,
      solicitacoesPendentes,
    });
  } catch (e) {
    console.error("Erro ao buscar stats Capital:", e);
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
