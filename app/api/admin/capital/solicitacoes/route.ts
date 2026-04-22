import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const sp = request.nextUrl.searchParams;
    const status = sp.get("status") ?? undefined;

    const solicitacoes = await prisma.capitalLiquidityRequest.findMany({
      where: status && ["PENDENTE", "APROVADA", "RECUSADA", "PAGA"].includes(status) ? { status } : undefined,
      include: {
        investorProfile: { include: { user: { select: { id: true, name: true, email: true } } } },
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
    console.error("Erro ao listar solicitações Capital:", e);
    return NextResponse.json({ error: "Erro ao listar solicitações" }, { status: 500 });
  }
}
