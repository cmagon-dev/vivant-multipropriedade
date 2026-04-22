import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const sp = request.nextUrl.searchParams;
    const assetConfigId = sp.get("assetConfigId") ?? undefined;
    const investorProfileId = sp.get("investorProfileId") ?? undefined;

    const participations = await prisma.capitalParticipation.findMany({
      where: {
        ...(assetConfigId && { assetConfigId }),
        ...(investorProfileId && { investorProfileId }),
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

    const body = await request.json();
    const { investorProfileId, assetConfigId, numeroCotas, valorAportado, dataEntrada, status = "ATIVO" } = body;

    if (!investorProfileId || !assetConfigId || numeroCotas == null) {
      return NextResponse.json({ error: "investorProfileId, assetConfigId e numeroCotas são obrigatórios" }, { status: 400 });
    }

    const asset = await prisma.capitalAssetConfig.findUnique({
      where: { id: assetConfigId },
      select: { totalCotas: true, valorPorCota: true },
    });
    if (!asset) return NextResponse.json({ error: "Ativo não encontrado" }, { status: 404 });

    const numCotas = Number(numeroCotas);
    const valorPorCota = Number(asset.valorPorCota);
    const valorAport = valorAportado != null ? Number(valorAportado) : numCotas * valorPorCota;
    const percentualTotal = (numCotas / asset.totalCotas) * 100;

    const participation = await prisma.capitalParticipation.create({
      data: {
        investorProfileId,
        assetConfigId,
        numeroCotas: numCotas,
        percentualTotal: new Decimal(percentualTotal),
        valorAportado: new Decimal(valorAport),
        dataEntrada: dataEntrada ? new Date(dataEntrada) : new Date(),
        status: status === "RESGATADO" || status === "CANCELADO" ? status : "ATIVO",
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
