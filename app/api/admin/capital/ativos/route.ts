import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const ativos = await prisma.capitalAssetConfig.findMany({
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
      })),
    });
  } catch (e) {
    console.error("Erro ao listar ativos Capital:", e);
    return NextResponse.json({ error: "Erro ao listar ativos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

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
    } = body;

    if (!propertyId || valorPorCota == null || taxaAdministracaoPercent == null || reservaPercent == null) {
      return NextResponse.json(
        { error: "propertyId, valorPorCota, taxaAdministracaoPercent e reservaPercent são obrigatórios" },
        { status: 400 }
      );
    }

    const existing = await prisma.capitalAssetConfig.findUnique({ where: { propertyId } });
    if (existing) return NextResponse.json({ error: "Este imóvel já possui config de Capital" }, { status: 400 });

    const ativo = await prisma.capitalAssetConfig.create({
      data: {
        propertyId,
        enabled: !!enabled,
        totalCotas: Number(totalCotas) || 100,
        valorPorCota: new Decimal(Number(valorPorCota)),
        taxaAdministracaoPercent: new Decimal(Number(taxaAdministracaoPercent)),
        reservaPercent: new Decimal(Number(reservaPercent)),
        ativoStatus: ativoStatus === "PAUSADO" || ativoStatus === "ENCERRADO" ? ativoStatus : "ATIVO",
        observacoes: observacoes || null,
      },
      include: { property: { select: { id: true, name: true } } },
    });

    return NextResponse.json({
      ...ativo,
      valorPorCota: Number(ativo.valorPorCota),
      taxaAdministracaoPercent: Number(ativo.taxaAdministracaoPercent),
      reservaPercent: Number(ativo.reservaPercent),
    });
  } catch (e) {
    console.error("Erro ao criar ativo Capital:", e);
    return NextResponse.json({ error: "Erro ao criar ativo" }, { status: 500 });
  }
}
