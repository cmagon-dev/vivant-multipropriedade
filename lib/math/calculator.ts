import Decimal from "decimal.js";

// Configuração global do Decimal.js para precisão financeira
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

/**
 * Interface que representa os dados de entrada para análise de propriedade
 */
export interface PropertyInput {
  /** Preço unitário de cada cota */
  precoCota: number;
  /** Quantidade total de cotas */
  quantidadeCotas: number;
  /** Custo de mobília e equipamentos (CAPEX) */
  custoMobilia: number;
}

/**
 * Interface que representa a análise financeira completa da propriedade
 */
export interface PropertyAnalysis {
  /** Valor Geral de Vendas (VGV) - receita bruta total */
  vgvTotal: string;
  /** Valor do imposto RET (4% sobre VGV) */
  impostoRET: string;
  /** VGV após dedução do RET */
  vgvLiquido: string;
  /** 50% do VGV líquido destinado à Conta Escrow (garantia) */
  contaEscrow: string;
  /** 50% do VGV líquido destinado à operação Vivant */
  operacionalVivant: string;
  /** Custo de mobília e equipamentos */
  capexMobilia: string;
  /** Saldo final após dedução do CAPEX da parte operacional */
  saldoFinal: string;
  /** Margem operacional percentual (saldo final / VGV total) */
  margemOperacional: string;
}

/**
 * Calcula o fluxo financeiro completo da Vivant Multipropriedade
 * 
 * Estrutura de cálculo:
 * 1. VGV Total = Preço da Cota × Quantidade de Cotas
 * 2. Imposto RET = 4% do VGV Total
 * 3. VGV Líquido = VGV Total - Imposto RET
 * 4. Split 50/50:
 *    - Conta Escrow (Bolsão de Garantia) = 50% do VGV Líquido
 *    - Operacional Vivant = 50% do VGV Líquido
 * 5. Saldo Final = Operacional Vivant - CAPEX Mobília
 * 6. Margem Operacional = (Saldo Final / VGV Total) × 100
 * 
 * @param input - Dados de entrada da propriedade
 * @returns Análise financeira completa com todos os valores formatados
 */
export function calculateVivantFlow(input: PropertyInput): PropertyAnalysis {
  // Converter inputs para Decimal para garantir precisão
  const precoCota = new Decimal(input.precoCota);
  const quantidadeCotas = new Decimal(input.quantidadeCotas);
  const custoMobilia = new Decimal(input.custoMobilia);

  // 1. Calcular VGV Total
  const vgvTotal = precoCota.times(quantidadeCotas);

  // 2. Calcular Imposto RET (4%)
  const taxaRET = new Decimal(0.04);
  const impostoRET = vgvTotal.times(taxaRET);

  // 3. Calcular VGV Líquido (após RET)
  const vgvLiquido = vgvTotal.minus(impostoRET);

  // 4. Split 50/50
  const percentualSplit = new Decimal(0.5);
  const contaEscrow = vgvLiquido.times(percentualSplit);
  const operacionalVivant = vgvLiquido.times(percentualSplit);

  // 5. Saldo Final após CAPEX
  const saldoFinal = operacionalVivant.minus(custoMobilia);

  // 6. Margem Operacional (%)
  const margemOperacional = saldoFinal.dividedBy(vgvTotal).times(100);

  // Retornar análise com valores formatados
  return {
    vgvTotal: formatCurrency(vgvTotal),
    impostoRET: formatCurrency(impostoRET),
    vgvLiquido: formatCurrency(vgvLiquido),
    contaEscrow: formatCurrency(contaEscrow),
    operacionalVivant: formatCurrency(operacionalVivant),
    capexMobilia: formatCurrency(custoMobilia),
    saldoFinal: formatCurrency(saldoFinal),
    margemOperacional: margemOperacional.toFixed(2) + "%",
  };
}

/**
 * Formata um valor Decimal para moeda brasileira
 * @param value - Valor a ser formatado
 * @returns String formatada como moeda (ex: "R$ 1.234.567,89")
 */
function formatCurrency(value: Decimal): string {
  const numericValue = value.toNumber();
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

/**
 * Valida se os inputs são válidos para cálculo
 * @param input - Dados de entrada a serem validados
 * @returns true se válido, false caso contrário
 */
export function validatePropertyInput(input: PropertyInput): boolean {
  return (
    input.precoCota > 0 &&
    input.quantidadeCotas > 0 &&
    input.custoMobilia >= 0
  );
}
