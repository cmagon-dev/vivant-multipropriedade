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

    const participations = await prisma.capitalParticipation.findMany({
      where: { investorProfileId: profileId, status: "ATIVO" },
      include: {
        assetConfig: {
          include: {
            property: {
              select: {
                id: true,
                name: true,
                slug: true,
                location: true,
                cidade: true,
                images: true,
                priceValue: true,
              },
            },
          },
        },
      },
      orderBy: { dataEntrada: "desc" },
    });

    return NextResponse.json({
      portfolio: participations.map((p) => ({
        id: p.id,
        assetConfigId: p.assetConfigId,
        property: p.assetConfig.property,
        numeroCotas: p.numeroCotas,
        percentualTotal: Number(p.percentualTotal),
        valorAportado: Number(p.valorAportado),
        dataEntrada: p.dataEntrada,
        valorPorCota: Number(p.assetConfig.valorPorCota),
      })),
    });
  } catch (e) {
    console.error("Erro ao buscar portfólio:", e);
    return NextResponse.json({ error: "Erro ao buscar portfólio" }, { status: 500 });
  }
}
