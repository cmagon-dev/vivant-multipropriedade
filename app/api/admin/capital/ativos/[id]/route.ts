import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

    const { id } = await params;
    const ativo = await prisma.capitalAssetConfig.findUnique({
      where: { id },
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
    const session = await getServerSession(authOptions);
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const { enabled, totalCotas, valorPorCota, taxaAdministracaoPercent, reservaPercent, ativoStatus, observacoes } = body;

    const ativo = await prisma.capitalAssetConfig.update({
      where: { id },
      data: {
        ...(enabled !== undefined && { enabled: !!enabled }),
        ...(totalCotas !== undefined && { totalCotas: Number(totalCotas) }),
        ...(valorPorCota !== undefined && { valorPorCota: new Decimal(Number(valorPorCota)) }),
        ...(taxaAdministracaoPercent !== undefined && { taxaAdministracaoPercent: new Decimal(Number(taxaAdministracaoPercent)) }),
        ...(reservaPercent !== undefined && { reservaPercent: new Decimal(Number(reservaPercent)) }),
        ...(ativoStatus && ["ATIVO", "PAUSADO", "ENCERRADO"].includes(ativoStatus) && { ativoStatus }),
        ...(observacoes !== undefined && { observacoes: observacoes || null }),
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
    console.error("Erro ao atualizar ativo Capital:", e);
    return NextResponse.json({ error: "Erro ao atualizar ativo" }, { status: 500 });
  }
}
