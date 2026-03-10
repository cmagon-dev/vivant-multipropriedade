import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCapitalInvestorProfileId, isCapitalInvestor } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!isCapitalInvestor(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const profileId = await getCapitalInvestorProfileId(session);
    if (!profileId) return NextResponse.json({ error: "Perfil de investidor não encontrado" }, { status: 403 });

    const solicitacoes = await prisma.capitalLiquidityRequest.findMany({
      where: { investorProfileId: profileId },
      include: {
        assetConfig: { include: { property: { select: { id: true, name: true } } } },
      },
      orderBy: { dataSolicitacao: "desc" },
    });

    return NextResponse.json({
      solicitacoes: solicitacoes.map((s) => ({
        ...s,
        valorSolicitado: Number(s.valorSolicitado),
      })),
    });
  } catch (e) {
    console.error("Erro ao listar solicitações investidor:", e);
    return NextResponse.json({ error: "Erro ao listar solicitações" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!isCapitalInvestor(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const profileId = await getCapitalInvestorProfileId(session);
    if (!profileId) return NextResponse.json({ error: "Perfil de investidor não encontrado" }, { status: 403 });

    const body = await request.json();
    const { assetConfigId, tipoSolicitacao, valorSolicitado, motivo } = body;

    if (!assetConfigId || !tipoSolicitacao || valorSolicitado == null) {
      return NextResponse.json({ error: "assetConfigId, tipoSolicitacao e valorSolicitado são obrigatórios" }, { status: 400 });
    }

    const hasParticipation = await prisma.capitalParticipation.findUnique({
      where: {
        investorProfileId_assetConfigId: { investorProfileId: profileId, assetConfigId },
        status: "ATIVO",
      },
    });
    if (!hasParticipation) return NextResponse.json({ error: "Você não possui participação neste ativo" }, { status: 400 });

    const sol = await prisma.capitalLiquidityRequest.create({
      data: {
        investorProfileId: profileId,
        assetConfigId,
        tipoSolicitacao: tipoSolicitacao === "RESGATE" ? "RESGATE" : "ANTECIPACAO",
        valorSolicitado: new Decimal(Number(valorSolicitado)),
        motivo: motivo ?? null,
        status: "PENDENTE",
      },
      include: {
        assetConfig: { include: { property: { select: { name: true } } } },
      },
    });

    return NextResponse.json({ ...sol, valorSolicitado: Number(sol.valorSolicitado) });
  } catch (e) {
    console.error("Erro ao criar solicitação:", e);
    return NextResponse.json({ error: "Erro ao criar solicitação" }, { status: 500 });
  }
}
