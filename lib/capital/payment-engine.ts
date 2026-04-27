import { Decimal } from "@prisma/client/runtime/library";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calculateCapitalSplit } from "@/lib/capital/split-engine";

export type CreateCapitalPaymentInput = {
  companyId: string;
  investmentId: string;
  amount: number;
  paidAt?: Date | null;
  status?: string;
  direction?: "IN" | "OUT";
  referenceId?: string | null;
  tx?: Prisma.TransactionClient;
};

export async function createCapitalPaymentWithSplit(input: CreateCapitalPaymentInput) {
  const { companyId, investmentId } = input;
  const amount = Number(input.amount || 0);
  if (amount <= 0) throw new Error("Valor de pagamento inválido");
  const direction = input.direction ?? "IN";
  const shouldSettleFinancial = (input.status ?? "PAGO") === "PAGO";

  const run = async (tx: Prisma.TransactionClient) => {
    const [settings, investment] = await Promise.all([
      tx.capitalSettings.findUnique({ where: { companyId } }),
      tx.capitalParticipation.findFirst({
        where: { id: investmentId, companyId },
        select: {
          id: true,
          investorProfileId: true,
          assetConfigId: true,
        },
      }),
    ]);

    if (!investment) throw new Error("Investimento não encontrado");

    const guaranteePercentage = Number(settings?.guaranteePercentage ?? 50);
    const operationPercentage = Number(settings?.operationPercentage ?? 50);
    const { guaranteeAmount, operationAmount } = calculateCapitalSplit({
      amount,
      guaranteePercentage,
      operationPercentage,
    });

    const payment = await tx.capitalPayment.create({
      data: {
        companyId,
        investmentId: investment.id,
        investorId: investment.investorProfileId,
        assetId: investment.assetConfigId,
        amount: new Decimal(amount),
        guaranteeAmount: new Decimal(guaranteeAmount),
        operationAmount: new Decimal(operationAmount),
        splitPercentageGuarantee: new Decimal(guaranteePercentage),
        splitPercentageOperation: new Decimal(operationPercentage),
        paidAt: input.paidAt ?? new Date(),
        status: input.status ?? "PAGO",
      },
    });

    if (!shouldSettleFinancial) {
      return payment;
    }

    const currentWallet = await tx.capitalWallet.findUnique({
      where: { companyId },
      select: {
        id: true,
        totalGuaranteeBalance: true,
        totalOperationBalance: true,
      },
    });

    if (direction === "OUT") {
      if (!currentWallet) {
        throw new Error("Wallet não encontrada para liquidar distribuição");
      }
      const guaranteeBalance = Number(currentWallet.totalGuaranteeBalance);
      const operationBalance = Number(currentWallet.totalOperationBalance);
      if (guaranteeBalance < guaranteeAmount || operationBalance < operationAmount) {
        throw new Error("Saldo insuficiente na wallet para liquidar distribuição");
      }
    }

    const wallet = await tx.capitalWallet.upsert({
      where: { companyId },
      create: {
        companyId,
        totalGuaranteeBalance: new Decimal(direction === "IN" ? guaranteeAmount : -guaranteeAmount),
        totalOperationBalance: new Decimal(direction === "IN" ? operationAmount : -operationAmount),
        totalReceived: new Decimal(direction === "IN" ? amount : 0),
        totalDistributed: new Decimal(direction === "OUT" ? amount : 0),
      },
      update: {
        totalGuaranteeBalance:
          direction === "IN"
            ? { increment: new Decimal(guaranteeAmount) }
            : { decrement: new Decimal(guaranteeAmount) },
        totalOperationBalance:
          direction === "IN"
            ? { increment: new Decimal(operationAmount) }
            : { decrement: new Decimal(operationAmount) },
        ...(direction === "IN"
          ? { totalReceived: { increment: new Decimal(amount) } }
          : { totalDistributed: { increment: new Decimal(amount) } }),
      },
    });

    await tx.capitalTransaction.createMany({
      data: [
        {
          companyId,
          walletId: wallet.id,
          type: direction,
          category: "GUARANTEE",
          amount: new Decimal(guaranteeAmount),
          referenceId: input.referenceId ?? payment.id,
        },
        {
          companyId,
          walletId: wallet.id,
          type: direction,
          category: "OPERATION",
          amount: new Decimal(operationAmount),
          referenceId: input.referenceId ?? payment.id,
        },
      ],
    });

    return payment;
  };

  if (input.tx) {
    return run(input.tx);
  }

  return prisma.$transaction(async (tx) => run(tx));
}

