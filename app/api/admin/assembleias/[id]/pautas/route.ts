import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

function canManage(session: any) {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return hasPermission(session, "vivantCare.assembleias.manage");
}

export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const { id } = await ctx.params;
    const body = await request.json();
    const { ordem, titulo, descricao, tipo, requererVotacao } = body;
    if (!titulo || !descricao) {
      return NextResponse.json({ error: "Título e descrição da pauta são obrigatórios" }, { status: 400 });
    }
    const maxOrdem = await prisma.pautaAssembleia.findFirst({
      where: { assembleiaId: id },
      orderBy: { ordem: "desc" },
      select: { ordem: true },
    });
    const ordemFinal = ordem != null ? Number(ordem) : (maxOrdem?.ordem ?? 0) + 1;
    const pauta = await prisma.pautaAssembleia.create({
      data: {
        assembleiaId: id,
        ordem: ordemFinal,
        titulo,
        descricao,
        tipo: (tipo as any) || "INFORMATIVA",
        requererVotacao: !!requererVotacao,
      },
    });
    return NextResponse.json(pauta);
  } catch (e) {
    console.error("Erro ao criar pauta:", e);
    return NextResponse.json({ error: "Erro ao criar pauta" }, { status: 500 });
  }
}
