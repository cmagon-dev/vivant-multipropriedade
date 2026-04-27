import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { parseDateInput, parseEnumValue } from "@/lib/capital/api-validation";

const CAPITAL_COMPLIANCE_TYPES = ["AFETACAO", "FIDUCIARIA", "CRI", "ESCROW", "AUDITORIA"] as const;
const CAPITAL_COMPLIANCE_STATUS = ["PENDENTE", "EM_ANALISE", "APROVADO", "REPROVADO"] as const;

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const companyId = await getCapitalCompanyId(session);
    const assetId = request.nextUrl.searchParams.get("assetId") ?? undefined;

    const docs = await prisma.capitalComplianceDocument.findMany({
      where: {
        companyId,
        ...(assetId ? { assetId } : {}),
      },
      include: { asset: { include: { property: { select: { id: true, name: true } } } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ documents: docs });
  } catch (e) {
    console.error("Erro ao listar compliance Capital:", e);
    return NextResponse.json({ error: "Erro ao listar compliance" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canManageCapital(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
    const companyId = await getCapitalCompanyId(session);
    const body = await request.json();
    const { assetId, type, status = "PENDENTE", fileUrl, observations, concludedAt } = body;

    if (!assetId || !type) {
      return NextResponse.json({ error: "assetId e type são obrigatórios" }, { status: 400 });
    }

    const asset = await prisma.capitalAssetConfig.findFirst({
      where: { id: assetId, companyId },
      select: { id: true },
    });
    if (!asset) return NextResponse.json({ error: "Ativo não encontrado" }, { status: 404 });

    let parsedType: (typeof CAPITAL_COMPLIANCE_TYPES)[number];
    let parsedStatus: (typeof CAPITAL_COMPLIANCE_STATUS)[number];
    let parsedConcludedAt: Date | null = null;
    try {
      parsedType = parseEnumValue(type, CAPITAL_COMPLIANCE_TYPES, "type");
      parsedStatus = parseEnumValue(status, CAPITAL_COMPLIANCE_STATUS, "status");
      parsedConcludedAt = concludedAt ? parseDateInput(concludedAt, "concludedAt") : null;
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Dados inválidos" }, { status: 400 });
    }

    const existing = await prisma.capitalComplianceDocument.findFirst({
      where: { companyId, assetId, type: parsedType },
      select: { id: true },
    });

    const doc = existing
      ? await prisma.capitalComplianceDocument.update({
          where: { id: existing.id },
          data: {
            status: parsedStatus,
            fileUrl: fileUrl ?? null,
            observations: observations ?? null,
            concludedAt: parsedConcludedAt,
          },
          include: { asset: { include: { property: { select: { id: true, name: true } } } } },
        })
      : await prisma.capitalComplianceDocument.create({
          data: {
            companyId,
            assetId,
            type: parsedType,
            status: parsedStatus,
            fileUrl: fileUrl ?? null,
            observations: observations ?? null,
            concludedAt: parsedConcludedAt,
          },
          include: { asset: { include: { property: { select: { id: true, name: true } } } } },
        });

    return NextResponse.json(doc);
  } catch (e) {
    console.error("Erro ao criar compliance Capital:", e);
    return NextResponse.json({ error: "Erro ao criar compliance" }, { status: 500 });
  }
}

