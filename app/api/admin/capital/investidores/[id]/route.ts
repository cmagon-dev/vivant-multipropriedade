import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { parseEnumValue } from "@/lib/capital/api-validation";

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
    const { tipoPessoa, documento, status } = body;
    let parsedTipoPessoa: "PF" | "PJ" | "INSTITUCIONAL" | undefined;
    let parsedStatus: "ATIVO" | "INATIVO" | "PENDENTE" | undefined;
    try {
      if (tipoPessoa !== undefined) {
        parsedTipoPessoa = parseEnumValue(tipoPessoa, ["PF", "PJ", "INSTITUCIONAL"] as const, "tipoPessoa");
      }
      if (status !== undefined) {
        parsedStatus = parseEnumValue(status, ["ATIVO", "INATIVO", "PENDENTE"] as const, "status");
      }
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Dados inválidos" }, { status: 400 });
    }

    const existing = await prisma.capitalInvestorProfile.findFirst({ where: { id, companyId }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: "Investidor não encontrado" }, { status: 404 });
    const updated = await prisma.capitalInvestorProfile.update({
      where: { id },
      data: {
        ...(parsedTipoPessoa !== undefined && { tipoPessoa: parsedTipoPessoa }),
        ...(documento !== undefined && { documento }),
        ...(parsedStatus !== undefined && { status: parsedStatus }),
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Erro ao atualizar investidor Capital:", e);
    return NextResponse.json({ error: "Erro ao atualizar investidor" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const companyId = await getCapitalCompanyId(session);
    const { id } = await params;

    const existing = await prisma.capitalInvestorProfile.findFirst({ where: { id, companyId }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: "Investidor não encontrado" }, { status: 404 });
    await prisma.capitalInvestorProfile.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao excluir investidor Capital:", e);
    return NextResponse.json({ error: "Erro ao excluir investidor" }, { status: 500 });
  }
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
    const investidor = await prisma.capitalInvestorProfile.findFirst({
      where: { id, companyId },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    if (!investidor) return NextResponse.json({ error: "Investidor não encontrado" }, { status: 404 });
    return NextResponse.json(investidor);
  } catch (e) {
    console.error("Erro ao buscar investidor Capital:", e);
    return NextResponse.json({ error: "Erro ao buscar investidor" }, { status: 500 });
  }
}
