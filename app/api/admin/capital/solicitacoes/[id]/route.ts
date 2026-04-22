import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { id } = await params;
    const sol = await prisma.capitalLiquidityRequest.findUnique({
      where: { id },
      include: {
        investorProfile: { include: { user: { select: { id: true, name: true, email: true } } } },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const { status, observacaoAdmin } = body;

    if (!status || !["PENDENTE", "APROVADA", "RECUSADA", "PAGA"].includes(status)) {
      return NextResponse.json({ error: "status inválido (PENDENTE, APROVADA, RECUSADA, PAGA)" }, { status: 400 });
    }

    const sol = await prisma.capitalLiquidityRequest.update({
      where: { id },
      data: {
        status,
        observacaoAdmin: observacaoAdmin ?? undefined,
        ...((status === "APROVADA" || status === "RECUSADA" || status === "PAGA") && { dataDecisao: new Date() }),
      },
      include: {
        investorProfile: { include: { user: { select: { name: true, email: true } } } },
        assetConfig: { include: { property: { select: { name: true } } } },
      },
    });

    return NextResponse.json({ ...sol, valorSolicitado: Number(sol.valorSolicitado) });
  } catch (e) {
    console.error("Erro ao atualizar solicitação:", e);
    return NextResponse.json({ error: "Erro ao atualizar solicitação" }, { status: 500 });
  }
}
