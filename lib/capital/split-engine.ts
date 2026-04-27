export type CapitalSplitInput = {
  amount: number;
  guaranteePercentage: number;
  operationPercentage: number;
};

export type CapitalSplitOutput = {
  guaranteeAmount: number;
  operationAmount: number;
};

export function calculateCapitalSplit(input: CapitalSplitInput): CapitalSplitOutput {
  const amount = Number(input.amount || 0);
  const guaranteePct = Number(input.guaranteePercentage || 0);
  const operationPct = Number(input.operationPercentage || 0);

  if (amount < 0) throw new Error("Valor de split não pode ser negativo");
  if (guaranteePct < 0 || operationPct < 0) throw new Error("Percentuais inválidos");
  if (Math.abs(guaranteePct + operationPct - 100) > 0.0001) {
    throw new Error("Percentuais de split devem somar 100%");
  }

  const guaranteeAmount = Number(((amount * guaranteePct) / 100).toFixed(2));
  const operationAmount = Number((amount - guaranteeAmount).toFixed(2));

  return { guaranteeAmount, operationAmount };
}

