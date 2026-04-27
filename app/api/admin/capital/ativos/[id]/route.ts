import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { deleteCapitalAssetConfigCascade } from "@/lib/capital/delete-asset-config-cascade";
import { getCapitalCompanyId } from "@/lib/capital/company-context";

type CapitalAssetMeta = {
  nomeAtivo?: string;
  localizacao?: string;
  descricao?: string;
  vgv?: number;
  valorAquisicao?: number;
  valorTotalEstruturado?: number;
  capRateProjetado?: number;
  rentabilidadeProjetada?: number;
  margemOperacionalPrevista?: number;
  statusAtivo?: string;
  documentosRelacionados?: string[];
  observacoesInternas?: string;
};

function parseAssetMeta(observacoes?: string | null): CapitalAssetMeta {
  if (!observacoes) return {};
  try {
    if (!observacoes.startsWith("__CAPITAL_META__:")) return {};
    const payload = observacoes.replace("__CAPITAL_META__:", "");
    const parsed = JSON.parse(payload) as CapitalAssetMeta;
    return parsed ?? {};
  } catch {
    return {};
  }
}

function buildAssetMeta(input: CapitalAssetMeta): string {
  return `__CAPITAL_META__:${JSON.stringify(input)}`;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const companyId = await getCapitalCompanyId(session);

    const { id } = await params;
    const ativo = await prisma.capitalAssetConfig.findFirst({
      where: { id, companyId },
      include: {
        property: true,
        _count: { select: { participations: true, distributions: true } },
      },
    });
    if (!ativo) return NextResponse.json({ error: "Ativo não encontrado" }, { status: 404 });

    return NextResponse.json({
      ...ativo,
      valorPorCota: Number(ativo.valorPorCota),
      taxaAdministracaoPercent: Number(ativo.taxaAdministracaoPercent),
      reservaPercent: Number(ativo.reservaPercent),
      meta: parseAssetMeta(ativo.observacoes),
    });
  } catch (e) {
    console.error("Erro ao buscar ativo Capital:", e);
    return NextResponse.json({ error: "Erro ao buscar ativo" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const companyId = await getCapitalCompanyId(session);

    const { id } = await params;
    const body = await request.json();
    const {
      enabled,
      totalCotas,
      valorPorCota,
      taxaAdministracaoPercent,
      reservaPercent,
      ativoStatus,
      observacoes,
      nomeAtivo,
      localizacao,
      descricao,
      vgv,
      valorAquisicao,
      valorTotalEstruturado,
      capRateProjetado,
      rentabilidadeProjetada,
      margemOperacionalPrevista,
      statusAtivo,
      documentosRelacionados,
      observacoesInternas,
    } = body;

    const atual = await prisma.capitalAssetConfig.findFirst({
      where: { id, companyId },
      select: { observacoes: true, companyId: true },
    });
    if (!atual) return NextResponse.json({ error: "Ativo não encontrado" }, { status: 404 });
    const metaAtual = parseAssetMeta(atual?.observacoes);

    const mergedMeta: CapitalAssetMeta = {
      ...metaAtual,
      ...(nomeAtivo !== undefined && { nomeAtivo }),
      ...(localizacao !== undefined && { localizacao }),
      ...(descricao !== undefined && { descricao }),
      ...(vgv !== undefined && { vgv: Number(vgv) }),
      ...(valorAquisicao !== undefined && { valorAquisicao: Number(valorAquisicao) }),
      ...(valorTotalEstruturado !== undefined && { valorTotalEstruturado: Number(valorTotalEstruturado) }),
      ...(capRateProjetado !== undefined && { capRateProjetado: Number(capRateProjetado) }),
      ...(rentabilidadeProjetada !== undefined && { rentabilidadeProjetada: Number(rentabilidadeProjetada) }),
      ...(margemOperacionalPrevista !== undefined && { margemOperacionalPrevista: Number(margemOperacionalPrevista) }),
      ...(statusAtivo !== undefined && { statusAtivo }),
      ...(documentosRelacionados !== undefined && { documentosRelacionados: Array.isArray(documentosRelacionados) ? documentosRelacionados : [] }),
      ...(observacoesInternas !== undefined && { observacoesInternas }),
      ...(observacoes !== undefined && { observacoesInternas: observacoes || "" }),
    };

    const ativo = await prisma.capitalAssetConfig.update({
      where: { id },
      data: {
        ...(enabled !== undefined && { enabled: !!enabled }),
        ...(totalCotas !== undefined && { totalCotas: Number(totalCotas) }),
        ...(valorPorCota !== undefined && { valorPorCota: new Decimal(Number(valorPorCota)) }),
        ...(taxaAdministracaoPercent !== undefined && { taxaAdministracaoPercent: new Decimal(Number(taxaAdministracaoPercent)) }),
        ...(reservaPercent !== undefined && { reservaPercent: new Decimal(Number(reservaPercent)) }),
        ...(ativoStatus && ["ATIVO", "PAUSADO", "ENCERRADO"].includes(ativoStatus) && { ativoStatus }),
        observacoes: buildAssetMeta(mergedMeta),
      },
      include: { property: { select: { id: true, name: true } } },
    });

    return NextResponse.json({
      ...ativo,
      valorPorCota: Number(ativo.valorPorCota),
      taxaAdministracaoPercent: Number(ativo.taxaAdministracaoPercent),
      reservaPercent: Number(ativo.reservaPercent),
      meta: parseAssetMeta(ativo.observacoes),
    });
  } catch (e) {
    console.error("Erro ao atualizar ativo Capital:", e);
    return NextResponse.json({ error: "Erro ao atualizar ativo" }, { status: 500 });
  }
}

/** Exclui ativo e dados vinculados (participações, distribuições, etc.). Exige capital.manage. */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const companyId = await getCapitalCompanyId(session);

    const { id } = await params;
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

    const ativo = await prisma.capitalAssetConfig.findFirst({ where: { id, companyId }, select: { id: true, companyId: true } });
    if (!ativo) return NextResponse.json({ error: "Ativo não encontrado" }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      await deleteCapitalAssetConfigCascade(tx, id);
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao excluir ativo Capital:", e);
    return NextResponse.json({ error: "Erro ao excluir ativo" }, { status: 500 });
  }
}
