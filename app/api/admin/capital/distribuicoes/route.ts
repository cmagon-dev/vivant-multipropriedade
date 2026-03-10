import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const sp = request.nextUrl.searchParams;
    const assetConfigId = sp.get("assetConfigId") ?? undefined;

    const distributions = await prisma.capitalDistribution.findMany({
      where: assetConfigId ? { assetConfigId } : undefined,
      include: {
        assetConfig: { include: { property: { select: { id: true, name: true } } } },
        _count: { select: { items: true } },
      },
      orderBy: { competencia: "desc" },
    });

    return NextResponse.json({
      distributions: distributions.map((d) => ({
        ...d,
        receitaBruta: Number(d.receitaBruta),
        custos: Number(d.custos),
        taxaAdministracaoValor: Number(d.taxaAdministracaoValor),
        reservaValor: Number(d.reservaValor),
        resultadoDistribuivel: Number(d.resultadoDistribuivel),
        valorTotalDistribuido: Number(d.valorTotalDistribuido),
      })),
    });
  } catch (e) {
    console.error("Erro ao listar distribuições:", e);
    return NextResponse.json({ error: "Erro ao listar distribuições" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

    const body = await request.json();
    const {
      assetConfigId,
      competencia,
      receitaBruta,
      custos,
      taxaAdministracaoValor,
      reservaValor,
      resultadoDistribuivel,
      status = "RASCUNHO",
    } = body;

    if (!assetConfigId || !competencia || receitaBruta == null || custos == null) {
      return NextResponse.json({ error: "assetConfigId, competencia, receitaBruta e custos são obrigatórios" }, { status: 400 });
    }

    const taxAdm = Number(taxaAdministracaoValor ?? 0);
    const resVal = Number(reservaValor ?? 0);
    const recBruta = Number(receitaBruta);
    const cust = Number(custos);
    const resultDist = resultadoDistribuivel != null ? Number(resultadoDistribuivel) : recBruta - cust - taxAdm - resVal;

    const existing = await prisma.capitalDistribution.findUnique({
      where: { assetConfigId_competencia: { assetConfigId, competencia: String(competencia) } },
    });
    if (existing) return NextResponse.json({ error: "Já existe distribuição para este ativo e competência" }, { status: 400 });

    const participations = await prisma.capitalParticipation.findMany({
      where: { assetConfigId, status: "ATIVO" },
      select: { id: true, investorProfileId: true, percentualTotal: true },
    });

    const dist = await prisma.capitalDistribution.create({
      data: {
        assetConfigId,
        competencia: String(competencia),
        receitaBruta: new Decimal(recBruta),
        custos: new Decimal(cust),
        taxaAdministracaoValor: new Decimal(taxAdm),
        reservaValor: new Decimal(resVal),
        resultadoDistribuivel: new Decimal(resultDist),
        valorTotalDistribuido: new Decimal(0),
        status: status === "APROVADA" || status === "PAGA" ? status : "RASCUNHO",
      },
    });

    for (const p of participations) {
      const pct = Number(p.percentualTotal);
      const valorDevido = (resultDist * pct) / 100;
      await prisma.capitalDistributionItem.create({
        data: {
          distributionId: dist.id,
          investorProfileId: p.investorProfileId,
          percentualAplicado: new Decimal(pct),
          valorDevido: new Decimal(valorDevido),
          valorPago: new Decimal(0),
          status: "PENDENTE",
        },
      });
    }

    const totalDistribuido = resultDist;
    await prisma.capitalDistribution.update({
      where: { id: dist.id },
      data: { valorTotalDistribuido: new Decimal(totalDistribuido) },
    });

    const updated = await prisma.capitalDistribution.findUnique({
      where: { id: dist.id },
      include: { assetConfig: { include: { property: { select: { name: true } } } }, _count: { select: { items: true } } },
    });

    return NextResponse.json({
      ...updated,
      receitaBruta: Number(updated!.receitaBruta),
      custos: Number(updated!.custos),
      taxaAdministracaoValor: Number(updated!.taxaAdministracaoValor),
      reservaValor: Number(updated!.reservaValor),
      resultadoDistribuivel: Number(updated!.resultadoDistribuivel),
      valorTotalDistribuido: Number(updated!.valorTotalDistribuido),
    });
  } catch (e) {
    console.error("Erro ao criar distribuição:", e);
    return NextResponse.json({ error: "Erro ao criar distribuição" }, { status: 500 });
  }
}
