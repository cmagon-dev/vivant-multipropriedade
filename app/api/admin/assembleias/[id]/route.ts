import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

function canAccess(session: any) {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return hasPermission(session, "vivantCare.assembleias.view") || hasPermission(session, "vivantCare.assembleias.manage");
}

function canManage(session: any) {
  return canAccess(session) && hasPermission(session, "vivantCare.assembleias.manage");
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!canAccess(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const { id } = await ctx.params;
    const a = await prisma.assembleia.findUnique({
      where: { id },
      include: {
        property: { select: { id: true, name: true } },
        pautas: {
          orderBy: { ordem: "asc" },
          include: {
            votos: { select: { cotistaId: true, voto: true } },
            _count: { select: { votos: true } },
          },
        },
      },
    });
    if (!a) return NextResponse.json({ error: "Assembleia não encontrada" }, { status: 404 });
    const totalCotistasElegiveis = await prisma.cotaPropriedade.count({
      where: { propertyId: a.propertyId, ativo: true },
    });
    const cotistasQueVotaram = new Set(
      a.pautas.flatMap((pauta) => pauta.votos.map((voto) => voto.cotistaId))
    ).size;
    const pautas = a.pautas.map((pauta) => {
      const resumo = pauta.votos.reduce(
        (acc, voto) => {
          if (voto.voto === "FAVOR") acc.favor += 1;
          if (voto.voto === "CONTRA") acc.contra += 1;
          if (voto.voto === "ABSTENCAO") acc.abstencao += 1;
          return acc;
        },
        { favor: 0, contra: 0, abstencao: 0 }
      );
      return {
        ...pauta,
        resumoVotos: resumo,
      };
    });
    return NextResponse.json({
      ...a,
      pautas,
      participacao: {
        totalCotistasElegiveis,
        cotistasQueVotaram,
        percentual:
          totalCotistasElegiveis > 0
            ? Number(((cotistasQueVotaram / totalCotistasElegiveis) * 100).toFixed(2))
            : 0,
      },
    });
  } catch (e) {
    console.error("Erro ao buscar assembleia:", e);
    return NextResponse.json({ error: "Erro ao buscar assembleia" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const { id } = await ctx.params;
    const body = await req.json();
    const { titulo, descricao, tipo, dataRealizacao, dataInicio, dataFim, status, quorumMinimo, quorumAlcancado, ataUrl } = body;
    const a = await prisma.assembleia.update({
      where: { id },
      data: {
        ...(titulo != null && { titulo }),
        ...(descricao != null && { descricao }),
        ...(tipo != null && { tipo }),
        ...(dataRealizacao != null && { dataRealizacao: new Date(dataRealizacao) }),
        ...(dataInicio != null && { dataInicio: new Date(dataInicio) }),
        ...(dataFim != null && { dataFim: new Date(dataFim) }),
        ...(status != null && { status }),
        ...(quorumMinimo != null && { quorumMinimo: Number(quorumMinimo) }),
        ...(quorumAlcancado != null && { quorumAlcancado: Number(quorumAlcancado) }),
        ...(ataUrl !== undefined && { ataUrl: ataUrl || null }),
      },
      include: { property: { select: { id: true, name: true } }, pautas: { orderBy: { ordem: "asc" } } },
    });
    return NextResponse.json(a);
  } catch (e) {
    console.error("Erro ao atualizar assembleia:", e);
    return NextResponse.json({ error: "Erro ao atualizar assembleia" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const { id } = await ctx.params;
    await prisma.assembleia.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Erro ao excluir assembleia:", e);
    return NextResponse.json({ error: "Erro ao excluir assembleia" }, { status: 500 });
  }
}
