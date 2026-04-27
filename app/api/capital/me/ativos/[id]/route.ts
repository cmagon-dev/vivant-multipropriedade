import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCapitalInvestorContext, isCapitalInvestor } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";

/** id = assetConfigId. Só retorna se o investidor tiver participação nesse ativo. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!isCapitalInvestor(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const context = await getCapitalInvestorContext(session);
    if (!context) return NextResponse.json({ error: "Perfil de investidor não encontrado" }, { status: 403 });

    const { id: assetConfigId } = await params;

    const participation = await prisma.capitalParticipation.findFirst({
      where: {
        investorProfileId: context.investorProfileId,
        companyId: context.companyId,
        assetConfigId,
        status: "ATIVO",
      },
      include: {
        assetConfig: {
          include: {
            property: true,
            _count: { select: { participations: true } },
          },
        },
      },
    });

    if (!participation) return NextResponse.json({ error: "Ativo não encontrado ou sem participação" }, { status: 404 });

    const latestValuation = await prisma.capitalValuation.findFirst({
      where: { assetConfigId, companyId: context.companyId },
      orderBy: { dataReferencia: "desc" },
      select: { valorImovel: true, dataReferencia: true },
    });

    return NextResponse.json({
      ativo: {
        ...participation.assetConfig,
        property: participation.assetConfig.property,
        valorPorCota: Number(participation.assetConfig.valorPorCota),
        taxaAdministracaoPercent: Number(participation.assetConfig.taxaAdministracaoPercent),
        reservaPercent: Number(participation.assetConfig.reservaPercent),
      },
      minhaParticipacao: {
        numeroCotas: participation.numeroCotas,
        percentualTotal: Number(participation.percentualTotal),
        valorAportado: Number(participation.valorAportado),
        dataEntrada: participation.dataEntrada,
      },
      ultimaAvaliacao: latestValuation
        ? { valorImovel: Number(latestValuation.valorImovel), dataReferencia: latestValuation.dataReferencia }
        : null,
    });
  } catch (e) {
    console.error("Erro ao buscar ativo investidor:", e);
    return NextResponse.json({ error: "Erro ao buscar ativo" }, { status: 500 });
  }
}
