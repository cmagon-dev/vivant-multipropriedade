import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { createCapitalPaymentWithSplit } from "@/lib/capital/payment-engine";
import { parseDateInput, parseEnumValue, parsePositiveNumber } from "@/lib/capital/api-validation";

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const companyId = await getCapitalCompanyId(session);
    const investmentId = request.nextUrl.searchParams.get("investmentId") ?? undefined;

    const pagamentos = await prisma.capitalPayment.findMany({
      where: {
        companyId,
        ...(investmentId ? { investmentId } : {}),
      },
      include: {
        investment: true,
        investor: { include: { user: { select: { id: true, name: true, email: true } } } },
        asset: { include: { property: { select: { id: true, name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      pagamentos: pagamentos.map((p) => ({
        ...p,
        amount: Number(p.amount),
        guaranteeAmount: Number(p.guaranteeAmount),
        operationAmount: Number(p.operationAmount),
        splitPercentageGuarantee: Number(p.splitPercentageGuarantee),
        splitPercentageOperation: Number(p.splitPercentageOperation),
      })),
    });
  } catch (e) {
    console.error("Erro ao listar pagamentos Capital:", e);
    return NextResponse.json({ error: "Erro ao listar pagamentos" }, { status: 500 });
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
    const { investmentId, amount, paidAt, status } = body;

    if (!investmentId || amount == null) {
      return NextResponse.json({ error: "investmentId e amount são obrigatórios" }, { status: 400 });
    }

    let parsedStatus: "PENDENTE" | "PAGO" | "CANCELADO";
    try {
      parsedStatus = parseEnumValue(status ?? "PAGO", ["PENDENTE", "PAGO", "CANCELADO"] as const, "status");
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "status inválido" }, { status: 400 });
    }

    let parsedAmount: number;
    try {
      parsedAmount = parsePositiveNumber(amount, "amount");
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "amount inválido" }, { status: 400 });
    }

    let parsedPaidAt: Date;
    try {
      parsedPaidAt = paidAt ? parseDateInput(paidAt, "paidAt") : new Date();
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : "paidAt inválida" }, { status: 400 });
    }

    const payment = await createCapitalPaymentWithSplit({
      companyId,
      investmentId,
      amount: parsedAmount,
      paidAt: parsedPaidAt,
      status: parsedStatus,
    });

    return NextResponse.json({
      ...payment,
      amount: Number(payment.amount),
      guaranteeAmount: Number(payment.guaranteeAmount),
      operationAmount: Number(payment.operationAmount),
      splitPercentageGuarantee: Number(payment.splitPercentageGuarantee),
      splitPercentageOperation: Number(payment.splitPercentageOperation),
    });
  } catch (e) {
    console.error("Erro ao criar pagamento Capital:", e);
    return NextResponse.json({ error: e instanceof Error ? e.message : "Erro ao criar pagamento" }, { status: 500 });
  }
}

