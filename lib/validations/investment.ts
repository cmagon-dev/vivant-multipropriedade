import { z } from "zod";

/**
 * Schema de validação para os dados de entrada do simulador de investimentos
 */
export const investmentInputSchema = z.object({
  valorInvestido: z
    .number({
      required_error: "O valor do investimento é obrigatório",
      invalid_type_error: "O valor deve ser um número",
    })
    .positive("O valor deve ser positivo")
    .min(100000, "Valor mínimo: R$ 100.000,00")
    .max(50000000, "Valor máximo: R$ 50.000.000,00"),
  
  ipcaProjetado: z
    .number({
      required_error: "A projeção de IPCA é obrigatória",
      invalid_type_error: "O IPCA deve ser um número",
    })
    .min(0.03, "IPCA mínimo: 3%")
    .max(0.10, "IPCA máximo: 10%")
    .default(0.05),
});

/**
 * Tipo inferido do schema de validação de investimento
 */
export type InvestmentInputFormData = z.infer<typeof investmentInputSchema>;

/**
 * Schema de validação para simulação de liquidez antecipada
 */
export const liquidezInputSchema = z.object({
  mesAtual: z
    .number()
    .int("O mês deve ser um número inteiro")
    .min(1, "Mês mínimo: 1")
    .max(60, "Mês máximo: 60"),
  
  taxaDesconto: z
    .number()
    .min(0.05, "Taxa mínima: 5%")
    .max(0.30, "Taxa máxima: 30%")
    .default(0.15),
});

/**
 * Tipo inferido do schema de validação de liquidez
 */
export type LiquidezInputData = z.infer<typeof liquidezInputSchema>;
