import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";
import { TipoVoto } from "@prisma/client";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const { id } = await ctx.params;
    const cotista = await prisma.cotista.findUnique({
      where: { id: cotistaId },
      include: { cotas: { select: { propertyId: true } } },
    });
    if (!cotista) return NextResponse.json({ error: "Cotista não encontrado" }, { status: 404 });
    const propertyIds = cotista.cotas.map((c) => c.propertyId);
    const a = await prisma.assembleia.findFirst({
      where: { id, propertyId: { in: propertyIds } },
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
      const meuVoto = pauta.votos.find((voto) => voto.cotistaId === cotistaId)?.voto ?? null;
      return {
        ...pauta,
        meuVoto,
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

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;
    const { id } = await ctx.params;

    const body = (await req.json().catch(() => null)) as
      | { pautaId?: string; voto?: TipoVoto }
      | null;
    const pautaId = body?.pautaId;
    const voto = body?.voto;
    if (!pautaId || !voto || !["FAVOR", "CONTRA", "ABSTENCAO"].includes(voto)) {
      return NextResponse.json({ error: "Pauta e voto são obrigatórios." }, { status: 400 });
    }

    const cotista = await prisma.cotista.findUnique({
      where: { id: cotistaId },
      include: { cotas: { where: { ativo: true }, select: { propertyId: true } } },
    });
    if (!cotista) return NextResponse.json({ error: "Cotista não encontrado" }, { status: 404 });

    const propertyIds = cotista.cotas.map((c) => c.propertyId);
    const assembleia = await prisma.assembleia.findFirst({
      where: { id, propertyId: { in: propertyIds }, status: { in: ["AGENDADA", "EM_ANDAMENTO"] } },
      include: { pautas: { select: { id: true, requererVotacao: true, votacaoAberta: true } } },
    });
    if (!assembleia) {
      return NextResponse.json({ error: "Assembleia não disponível para votação." }, { status: 404 });
    }

    const pauta = assembleia.pautas.find((p) => p.id === pautaId);
    if (!pauta) return NextResponse.json({ error: "Pauta não encontrada nesta assembleia." }, { status: 404 });
    if (!pauta.requererVotacao || !pauta.votacaoAberta) {
      return NextResponse.json({ error: "Votação indisponível para esta pauta." }, { status: 400 });
    }

    const votoExistente = await prisma.votoAssembleia.findUnique({
      where: { pautaId_cotistaId: { pautaId, cotistaId } },
      select: { id: true, voto: true },
    });
    if (votoExistente) {
      if (votoExistente.voto === voto) {
        return NextResponse.json({ success: true });
      }
      return NextResponse.json(
        { error: "Você já registrou seu voto nesta pauta." },
        { status: 409 }
      );
    }

    await prisma.votoAssembleia.create({
      data: { pautaId, cotistaId, voto },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao votar em assembleia:", error);
    return NextResponse.json({ error: "Erro ao registrar voto" }, { status: 500 });
  }
}
