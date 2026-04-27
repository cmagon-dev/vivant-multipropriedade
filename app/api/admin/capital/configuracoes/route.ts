import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { Decimal } from "@prisma/client/runtime/library";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { parseNonNegativeNumber, parsePercentage } from "@/lib/capital/api-validation";

export async function GET() {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const companyId = await getCapitalCompanyId(session);
    const settings = await prisma.capitalSettings.upsert({
      where: { companyId },
      create: { companyId },
      update: {},
    });
    return NextResponse.json({
      ...settings,
      guaranteePercentage: Number(settings.guaranteePercentage),
      operationPercentage: Number(settings.operationPercentage),
      defaultReturnRate: Number(settings.defaultReturnRate),
      marginMin: Number(settings.marginMin),
      marginMax: Number(settings.marginMax),
    });
  } catch (e) {
    console.error("Erro ao carregar configurações Capital:", e);
    return NextResponse.json({ error: "Erro ao carregar configurações" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canManageCapital(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
    const companyId = await getCapitalCompanyId(session);
    const body = await request.json();
    const {
      guaranteePercentage,
      operationPercentage,
      defaultReturnRate,
      marginMin,
      marginMax,
      disclaimer,
    } = body;

    let gp: number;
    let op: number;
    let dr: number;
    let mmn: number;
    let mmx: number;
    try {
      gp = parsePercentage(guaranteePercentage ?? 50, "guaranteePercentage");
      op = parsePercentage(operationPercentage ?? 50, "operationPercentage");
      dr = parseNonNegativeNumber(defaultReturnRate ?? 12, "defaultReturnRate");
      mmn = parseNonNegativeNumber(marginMin ?? 18, "marginMin");
      mmx = parseNonNegativeNumber(marginMax ?? 35, "marginMax");
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "Parâmetros inválidos" }, { status: 400 });
    }

    if (Math.abs(gp + op - 100) > 0.0001) {
      return NextResponse.json({ error: "Percentuais devem somar 100%" }, { status: 400 });
    }
    if (mmn > mmx) {
      return NextResponse.json({ error: "marginMin não pode ser maior que marginMax" }, { status: 400 });
    }

    const settings = await prisma.capitalSettings.upsert({
      where: { companyId },
      create: {
        companyId,
        guaranteePercentage: new Decimal(gp),
        operationPercentage: new Decimal(op),
        defaultReturnRate: new Decimal(dr),
        marginMin: new Decimal(mmn),
        marginMax: new Decimal(mmx),
        disclaimer: disclaimer ?? null,
      },
      update: {
        guaranteePercentage: new Decimal(gp),
        operationPercentage: new Decimal(op),
        defaultReturnRate: new Decimal(dr),
        marginMin: new Decimal(mmn),
        marginMax: new Decimal(mmx),
        disclaimer: disclaimer ?? null,
      },
    });

    return NextResponse.json({
      ...settings,
      guaranteePercentage: Number(settings.guaranteePercentage),
      operationPercentage: Number(settings.operationPercentage),
      defaultReturnRate: Number(settings.defaultReturnRate),
      marginMin: Number(settings.marginMin),
      marginMax: Number(settings.marginMax),
    });
  } catch (e) {
    console.error("Erro ao salvar configurações Capital:", e);
    return NextResponse.json({ error: "Erro ao salvar configurações" }, { status: 500 });
  }
}

