import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { parseNonNegativeNumber, parsePositiveNumber, parsePercentage } from "@/lib/capital/api-validation";

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

export async function GET() {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const companyId = await getCapitalCompanyId(session);

    const ativos = await prisma.capitalAssetConfig.findMany({
      where: { companyId },
      include: {
        property: { select: { id: true, name: true, slug: true, location: true, priceValue: true } },
        _count: { select: { participations: true, distributions: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      ativos: ativos.map((a) => ({
        ...a,
        valorPorCota: Number(a.valorPorCota),
        taxaAdministracaoPercent: Number(a.taxaAdministracaoPercent),
        reservaPercent: Number(a.reservaPercent),
        meta: parseAssetMeta(a.observacoes),
      })),
    });
  } catch (e) {
    console.error("Erro ao listar ativos Capital:", e);
    return NextResponse.json({ error: "Erro ao listar ativos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const companyId = await getCapitalCompanyId(session);

    const body = await request.json();
    const {
      propertyId,
      enabled = true,
      totalCotas = 100,
      valorPorCota,
      taxaAdministracaoPercent,
      reservaPercent,
      ativoStatus = "ATIVO",
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

    if (!propertyId || valorPorCota == null || taxaAdministracaoPercent == null || reservaPercent == null) {
      return NextResponse.json(
        { error: "propertyId, valorPorCota, taxaAdministracaoPercent e reservaPercent são obrigatórios" },
        { status: 400 }
      );
    }

    const existing = await prisma.capitalAssetConfig.findFirst({ where: { companyId, propertyId } });
    if (existing) return NextResponse.json({ error: "Este imóvel já possui config de Capital" }, { status: 400 });

    let parsedTotalCotas: number;
    let parsedValorPorCota: number;
    let parsedTaxaAdm: number;
    let parsedReserva: number;
    let metaPayload: CapitalAssetMeta;
    try {
      parsedTotalCotas = Math.trunc(parsePositiveNumber(totalCotas ?? 100, "totalCotas"));
      parsedValorPorCota = parsePositiveNumber(valorPorCota, "valorPorCota");
      parsedTaxaAdm = parsePercentage(taxaAdministracaoPercent, "taxaAdministracaoPercent");
      parsedReserva = parsePercentage(reservaPercent, "reservaPercent");
      metaPayload = {
        nomeAtivo,
        localizacao,
        descricao,
        vgv: vgv != null ? parseNonNegativeNumber(vgv, "vgv") : undefined,
        valorAquisicao: valorAquisicao != null ? parseNonNegativeNumber(valorAquisicao, "valorAquisicao") : undefined,
        valorTotalEstruturado:
          valorTotalEstruturado != null ? parseNonNegativeNumber(valorTotalEstruturado, "valorTotalEstruturado") : undefined,
        capRateProjetado: capRateProjetado != null ? parseNonNegativeNumber(capRateProjetado, "capRateProjetado") : undefined,
        rentabilidadeProjetada:
          rentabilidadeProjetada != null ? parseNonNegativeNumber(rentabilidadeProjetada, "rentabilidadeProjetada") : undefined,
        margemOperacionalPrevista:
          margemOperacionalPrevista != null
            ? parseNonNegativeNumber(margemOperacionalPrevista, "margemOperacionalPrevista")
            : undefined,
        statusAtivo,
        documentosRelacionados: Array.isArray(documentosRelacionados) ? documentosRelacionados : undefined,
        observacoesInternas,
      };
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Dados inválidos" }, { status: 400 });
    }

    const ativo = await prisma.capitalAssetConfig.create({
      data: {
        propertyId,
        companyId,
        enabled: !!enabled,
        totalCotas: parsedTotalCotas,
        valorPorCota: new Decimal(parsedValorPorCota),
        taxaAdministracaoPercent: new Decimal(parsedTaxaAdm),
        reservaPercent: new Decimal(parsedReserva),
        ativoStatus: ativoStatus === "PAUSADO" || ativoStatus === "ENCERRADO" ? ativoStatus : "ATIVO",
        observacoes: buildAssetMeta({
          ...metaPayload,
          observacoesInternas: observacoesInternas ?? observacoes ?? "",
        }),
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
    console.error("Erro ao criar ativo Capital:", e);
    return NextResponse.json({ error: "Erro ao criar ativo" }, { status: 500 });
  }
}
