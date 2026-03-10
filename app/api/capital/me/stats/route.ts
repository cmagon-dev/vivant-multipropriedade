import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCapitalInvestorProfileId, isCapitalInvestor } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!isCapitalInvestor(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const profileId = await getCapitalInvestorProfileId(session);
    if (!profileId) return NextResponse.json({ error: "Perfil de investidor não encontrado" }, { status: 403 });

    const [participations, lastDistribution, liquidityOpen] = await Promise.all([
      prisma.capitalParticipation.findMany({
        where: { investorProfileId: profileId, status: "ATIVO" },
        include: { assetConfig: { select: { valorPorCota: true } } },
      }),
      prisma.capitalDistributionItem.findFirst({
        where: { investorProfileId: profileId, status: "PAGO" },
        orderBy: { createdAt: "desc" },
        select: { valorPago: true, createdAt: true, distribution: { select: { competencia: true } } },
      }),
      prisma.capitalLiquidityRequest.count({
        where: { investorProfileId: profileId, status: "PENDENTE" },
      }),
    ]);

    const patrimonioInvestido = participations.reduce((s, p) => s + Number(p.valorAportado), 0);
    const valorEstimado = participations.reduce((s, p) => {
      const cotas = p.numeroCotas;
      const valorCota = Number(p.assetConfig.valorPorCota);
      return s + cotas * valorCota;
    }, 0);

    const rendimentoItems = await prisma.capitalDistributionItem.findMany({
      where: { investorProfileId: profileId },
      select: { valorPago: true },
    });
    const rendimentoAcumulado = rendimentoItems.reduce((s, i) => s + Number(i.valorPago), 0);

    return NextResponse.json({
      patrimonioInvestido,
      valorEstimadoAtual: valorEstimado,
      rendimentoAcumulado,
      ultimoRecebimento: lastDistribution
        ? { valor: Number(lastDistribution.valorPago), competencia: lastDistribution.distribution.competencia }
        : null,
      quantidadeAtivos: participations.length,
      solicitacoesEmAberto: liquidityOpen,
    });
  } catch (e) {
    console.error("Erro ao buscar stats investidor:", e);
    return NextResponse.json({ error: "Erro ao buscar estatísticas" }, { status: 500 });
  }
}
