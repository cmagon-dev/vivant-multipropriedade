import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getCapitalInvestorContext, isCapitalInvestor } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!isCapitalInvestor(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const context = await getCapitalInvestorContext(session);
    if (!context) return NextResponse.json({ error: "Perfil de investidor não encontrado" }, { status: 403 });

    const items = await prisma.capitalDistributionItem.findMany({
      where: {
        investorProfileId: context.investorProfileId,
        companyId: context.companyId,
      },
      include: {
        distribution: {
          include: {
            assetConfig: { include: { property: { select: { id: true, name: true } } } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      rendimentos: items.map((i) => ({
        id: i.id,
        competencia: i.distribution.competencia,
        propertyName: i.distribution.assetConfig.property.name,
        percentualAplicado: Number(i.percentualAplicado),
        valorDevido: Number(i.valorDevido),
        valorPago: Number(i.valorPago),
        status: i.status,
        createdAt: i.createdAt,
      })),
    });
  } catch (e) {
    console.error("Erro ao buscar rendimentos:", e);
    return NextResponse.json({ error: "Erro ao buscar rendimentos" }, { status: 500 });
  }
}
