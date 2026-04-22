import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const investidores = await prisma.capitalInvestorProfile.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { participations: true, liquidityRequests: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ investidores });
  } catch (e) {
    console.error("Erro ao listar investidores Capital:", e);
    return NextResponse.json({ error: "Erro ao listar investidores" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

    const body = await request.json();
    const { userId, tipoPessoa = "PF", documento, status = "ATIVO" } = body;

    if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });

    const existing = await prisma.capitalInvestorProfile.findUnique({ where: { userId } });
    if (existing) return NextResponse.json({ error: "Este usuário já possui perfil de investidor" }, { status: 400 });

    const investidor = await prisma.capitalInvestorProfile.create({
      data: {
        userId,
        tipoPessoa: tipoPessoa === "PJ" ? "PJ" : "PF",
        documento: documento ?? null,
        status: status === "INATIVO" || status === "PENDENTE" ? status : "ATIVO",
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json(investidor);
  } catch (e) {
    console.error("Erro ao criar perfil investidor:", e);
    return NextResponse.json({ error: "Erro ao criar investidor" }, { status: 500 });
  }
}
