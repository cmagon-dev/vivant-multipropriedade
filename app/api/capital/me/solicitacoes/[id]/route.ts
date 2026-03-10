import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCapitalInvestorProfileId, isCapitalInvestor } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!isCapitalInvestor(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const profileId = await getCapitalInvestorProfileId(session);
    if (!profileId) return NextResponse.json({ error: "Perfil de investidor não encontrado" }, { status: 403 });

    const { id } = await params;
    const sol = await prisma.capitalLiquidityRequest.findFirst({
      where: { id, investorProfileId: profileId },
      include: {
        assetConfig: { include: { property: { select: { id: true, name: true } } } },
      },
    });
    if (!sol) return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });

    return NextResponse.json({ ...sol, valorSolicitado: Number(sol.valorSolicitado) });
  } catch (e) {
    console.error("Erro ao buscar solicitação:", e);
    return NextResponse.json({ error: "Erro ao buscar solicitação" }, { status: 500 });
  }
}
