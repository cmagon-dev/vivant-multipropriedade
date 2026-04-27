import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { parseDateInput, parseEnumValue, parsePositiveNumber } from "@/lib/capital/api-validation";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const companyId = await getCapitalCompanyId(session);

    const sp = request.nextUrl.searchParams;
    const assetConfigId = sp.get("assetConfigId") ?? undefined;
    const investorProfileId = sp.get("investorProfileId") ?? undefined;

    const participations = await prisma.capitalParticipation.findMany({
      where: {
        ...(assetConfigId && { assetConfigId }),
        ...(investorProfileId && { investorProfileId }),
        companyId,
      },
      include: {
        investorProfile: { include: { user: { select: { id: true, name: true, email: true } } } },
        assetConfig: { include: { property: { select: { id: true, name: true } } } },
      },
      orderBy: { dataEntrada: "desc" },
    });

    return NextResponse.json({
      participations: participations.map((p) => ({
        ...p,
        percentualTotal: Number(p.percentualTotal),
        valorAportado: Number(p.valorAportado),
        totalInvested: Number((p as any).totalInvested ?? 0),
        expectedReturn: Number((p as any).expectedReturn ?? 0),
        roiPercent: Number((p as any).roiPercent ?? 0),
      })),
    });
  } catch (e) {
    console.error("Erro ao listar participações Capital:", e);
    return NextResponse.json({ error: "Erro ao listar participações" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const companyId = await getCapitalCompanyId(session);

    const body = await request.json();
    const { investorProfileId, assetConfigId, numeroCotas, valorAportado, dataEntrada, status = "INTERESSE" } = body;

    if (!investorProfileId || !assetConfigId || numeroCotas == null) {
      return NextResponse.json({ error: "investorProfileId, assetConfigId e numeroCotas são obrigatórios" }, { status: 400 });
    }

    const asset = await prisma.capitalAssetConfig.findUnique({
      where: { id: assetConfigId },
      select: { totalCotas: true, valorPorCota: true, companyId: true },
    });
    if (!asset) return NextResponse.json({ error: "Ativo não encontrado" }, { status: 404 });
    if (asset.companyId !== companyId) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

    const investor = await prisma.capitalInvestorProfile.findFirst({
      where: { id: investorProfileId, companyId },
      select: { id: true },
    });
    if (!investor) return NextResponse.json({ error: "Investidor não encontrado" }, { status: 404 });
    const settings = await prisma.capitalSettings.findUnique({ where: { companyId } });

    let numCotas: number;
    let parsedStatus:
      | "INTERESSE"
      | "RESERVADO"
      | "CONTRATO_ENVIADO"
      | "PAGO"
      | "CANCELADO"
      | "ATIVO"
      | "RESGATADO";
    let parsedDataEntrada: Date;
    try {
      numCotas = parsePositiveNumber(numeroCotas, "numeroCotas");
      parsedStatus = parseEnumValue(
        status,
        ["INTERESSE", "RESERVADO", "CONTRATO_ENVIADO", "PAGO", "CANCELADO", "ATIVO", "RESGATADO"] as const,
        "status"
      );
      parsedDataEntrada = dataEntrada ? parseDateInput(dataEntrada, "dataEntrada") : new Date();
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Dados inválidos" }, { status: 400 });
    }

    const existingQuotas = await prisma.capitalParticipation.aggregate({
      where: {
        companyId,
        assetConfigId,
        status: { notIn: ["CANCELADO", "RESGATADO"] },
      },
      _sum: { numeroCotas: true },
    });
    const usedQuotas = Number(existingQuotas._sum.numeroCotas ?? 0);
    if (usedQuotas + numCotas > asset.totalCotas) {
      return NextResponse.json({ error: "Número de cotas excede a capacidade total do ativo" }, { status: 400 });
    }

    const valorPorCota = Number(asset.valorPorCota);
    const valorAport = valorAportado != null ? Number(valorAportado) : numCotas * valorPorCota;
    if (!Number.isFinite(valorAport) || valorAport <= 0) {
      return NextResponse.json({ error: "valorAportado inválido" }, { status: 400 });
    }
    const percentualTotal = (numCotas / asset.totalCotas) * 100;
    const defaultReturnRate = Number(settings?.defaultReturnRate ?? 12);
    const expectedReturn = (valorAport * defaultReturnRate) / 100;
    const roiPercent = valorAport > 0 ? (expectedReturn / valorAport) * 100 : 0;

    const participation = await prisma.capitalParticipation.create({
      data: {
        investorProfileId,
        assetConfigId,
        companyId,
        investorId: investorProfileId,
        assetId: assetConfigId,
        numeroCotas: numCotas,
        quotas: numCotas,
        percentualTotal: new Decimal(percentualTotal),
        valorAportado: new Decimal(valorAport),
        totalInvested: new Decimal(valorAport),
        expectedReturn: new Decimal(expectedReturn),
        roiPercent: new Decimal(roiPercent),
        dataEntrada: parsedDataEntrada,
        status: parsedStatus,
        reserveDate: parsedStatus === "RESERVADO" ? new Date() : null,
        paymentDate: parsedStatus === "PAGO" || parsedStatus === "ATIVO" ? new Date() : null,
      },
      include: {
        investorProfile: { include: { user: { select: { name: true, email: true } } } },
        assetConfig: { include: { property: { select: { name: true } } } },
      },
    });

    return NextResponse.json({
      ...participation,
      percentualTotal: Number(participation.percentualTotal),
      valorAportado: Number(participation.valorAportado),
    });
  } catch (e) {
    console.error("Erro ao criar participação:", e);
    return NextResponse.json({ error: "Erro ao criar participação" }, { status: 500 });
  }
}
