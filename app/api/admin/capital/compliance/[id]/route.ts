import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { parseDateInput, parseEnumValue } from "@/lib/capital/api-validation";

const CAPITAL_COMPLIANCE_STATUS = ["PENDENTE", "EM_ANALISE", "APROVADO", "REPROVADO"] as const;

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canManageCapital(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
    const companyId = await getCapitalCompanyId(session);
    const { id } = await params;
    const body = await request.json();
    const { status, fileUrl, observations, concludedAt } = body;
    let parsedStatus: (typeof CAPITAL_COMPLIANCE_STATUS)[number] | undefined;
    let parsedConcludedAt: Date | null | undefined;
    try {
      if (status !== undefined) {
        parsedStatus = parseEnumValue(status, CAPITAL_COMPLIANCE_STATUS, "status");
      }
      if (concludedAt !== undefined) {
        parsedConcludedAt = concludedAt ? parseDateInput(concludedAt, "concludedAt") : null;
      }
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Dados inválidos" }, { status: 400 });
    }

    const existing = await prisma.capitalComplianceDocument.findFirst({
      where: { id, companyId },
      select: { id: true },
    });
    if (!existing) return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });

    const updated = await prisma.capitalComplianceDocument.update({
      where: { id },
      data: {
        ...(parsedStatus !== undefined && { status: parsedStatus }),
        ...(fileUrl !== undefined && { fileUrl: fileUrl || null }),
        ...(observations !== undefined && { observations: observations || null }),
        ...(parsedConcludedAt !== undefined && { concludedAt: parsedConcludedAt }),
      },
    });

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Erro ao atualizar compliance Capital:", e);
    return NextResponse.json({ error: "Erro ao atualizar compliance" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canManageCapital(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
    const companyId = await getCapitalCompanyId(session);
    const { id } = await params;
    const existing = await prisma.capitalComplianceDocument.findFirst({
      where: { id, companyId },
      select: { id: true },
    });
    if (!existing) return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
    await prisma.capitalComplianceDocument.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao excluir compliance Capital:", e);
    return NextResponse.json({ error: "Erro ao excluir compliance" }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const companyId = await getCapitalCompanyId(session);
    const { id } = await params;
    const document = await prisma.capitalComplianceDocument.findFirst({
      where: { id, companyId },
      include: { asset: { include: { property: { select: { id: true, name: true } } } } },
    });
    if (!document) return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
    return NextResponse.json(document);
  } catch (e) {
    console.error("Erro ao buscar compliance Capital:", e);
    return NextResponse.json({ error: "Erro ao buscar compliance" }, { status: 500 });
  }
}

