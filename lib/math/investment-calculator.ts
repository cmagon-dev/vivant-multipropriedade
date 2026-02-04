import Decimal from "decimal.js";

// Configuração global do Decimal.js para precisão financeira
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

/**
 * Interface para pagamento mensal da carteira
 */
export interface MonthlyPayment {
  mes: number;
  saldoInicial: number;
  correcaoIPCA: number;
  juros: number;
  amortizacao: number;
  parcela: number;
  saldoFinal: number;
}

/**
 * Interface para pagamento anual (balão)
 */
export interface AnnualPayment {
  ano: number;
  principal: number;
  jurosAcumulados: number;
  correcaoIPCA: number;
  totalBalao: number;
}

/**
 * Interface para fluxo agregado anual
 */
export interface YearlyFlow {
  ano: number;
  recebimentoMensal: number;
  balaoAnual: number;
  totalAno: number;
}

/**
 * Interface para dados do gráfico
 */
export interface ChartDataPoint {
  ano: number;
  investimento: number;
  retornoAcumulado: number;
}

/**
 * Interface para análise de investimento completa
 */
export interface InvestmentAnalysis {
  valorInvestido: string;
  totalReceber: string;
  lucroLiquido: string;
  roi: string;
  tir: string;
  carteirasMensais: MonthlyPayment[];
  carteirasAnuais: AnnualPayment[];
  fluxoAnualAgregado: YearlyFlow[];
  chartData: ChartDataPoint[];
}

/**
 * Interface para resultado de simulação de liquidez
 */
export interface LiquidezResult {
  valorVendaVista: string;
  descontoAplicado: string;
  mesesRestantes: number;
  totalFluxoFuturo: string;
}

/**
 * Calcula o PMT (parcela fixa) usando Tabela Price
 * PMT = PV * i / (1 - (1 + i)^-n)
 */
function calculatePMT(
  principal: number,
  taxa: number,
  periodos: number
): number {
  const p = new Decimal(principal);
  const i = new Decimal(taxa);
  const n = new Decimal(periodos);
  
  // PMT = PV * i / (1 - (1 + i)^-n)
  const onePlusI = Decimal.add(1, i);
  const divisor = Decimal.sub(1, onePlusI.pow(n.neg()));
  const pmt = p.times(i).dividedBy(divisor);
  
  return pmt.toNumber();
}

/**
 * Gera o fluxo de caixa mensal com correção IPCA e juros
 */
function generateMonthlyFlow(
  principal: number,
  taxaJuros: number,
  ipcaMensal: number,
  periodos: number
): MonthlyPayment[] {
  const flows: MonthlyPayment[] = [];
  let saldoDevedor = new Decimal(principal);
  
  // Calcular PMT base (sem IPCA ainda)
  const pmt = calculatePMT(principal, taxaJuros, periodos);
  
  for (let mes = 1; mes <= periodos; mes++) {
    const saldoInicial = saldoDevedor.toNumber();
    
    // Aplicar correção IPCA no saldo devedor
    const correcaoIPCA = saldoDevedor.times(ipcaMensal).toNumber();
    saldoDevedor = saldoDevedor.times(Decimal.add(1, ipcaMensal));
    
    // Calcular juros sobre o saldo corrigido
    const juros = saldoDevedor.times(taxaJuros).toNumber();
    
    // Recalcular parcela considerando novo saldo
    const periodosRestantes = periodos - mes + 1;
    const parcelaAtual = calculatePMT(
      saldoDevedor.toNumber(),
      taxaJuros,
      periodosRestantes
    );
    
    // Amortização = Parcela - Juros
    const amortizacao = new Decimal(parcelaAtual).minus(juros).toNumber();
    
    // Atualizar saldo devedor
    saldoDevedor = saldoDevedor.minus(amortizacao);
    
    flows.push({
      mes,
      saldoInicial,
      correcaoIPCA,
      juros,
      amortizacao,
      parcela: parcelaAtual,
      saldoFinal: saldoDevedor.toNumber(),
    });
  }
  
  return flows;
}

/**
 * Gera o fluxo de caixa anual (balões) com correção IPCA e juros compostos
 */
function generateAnnualFlow(
  principal: number,
  taxaJuros: number,
  ipcaAnual: number,
  anos: number
): AnnualPayment[] {
  const flows: AnnualPayment[] = [];
  const principalPorAno = principal / anos;
  
  for (let ano = 1; ano <= anos; ano++) {
    const p = new Decimal(principalPorAno);
    const ipcaAcum = Decimal.add(1, ipcaAnual).pow(ano);
    const jurosAcum = Decimal.add(1, taxaJuros * 12).pow(ano); // Taxa mensal para anual
    
    const principalCorrigido = p.times(ipcaAcum);
    const jurosAcumulados = principalCorrigido.times(jurosAcum.minus(1));
    const totalBalao = principalCorrigido.plus(jurosAcumulados);
    
    flows.push({
      ano,
      principal: principalPorAno,
      jurosAcumulados: jurosAcumulados.toNumber(),
      correcaoIPCA: principalCorrigido.minus(p).toNumber(),
      totalBalao: totalBalao.toNumber(),
    });
  }
  
  return flows;
}

/**
 * Calcula a TIR (Taxa Interna de Retorno) usando método Newton-Raphson
 * Encontra a taxa que zera o NPV (Valor Presente Líquido)
 */
function calculateIRR(cashFlows: number[], guess: number = 0.1): number {
  const maxIterations = 1000;
  const tolerance = 0.00001;
  let rate = guess;
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;
    
    // Calcular NPV e sua derivada
    for (let t = 0; t < cashFlows.length; t++) {
      const discount = Math.pow(1 + rate, t);
      npv += cashFlows[t] / discount;
      dnpv -= (t * cashFlows[t]) / (discount * (1 + rate));
    }
    
    // Verificar convergência
    if (Math.abs(npv) < tolerance) {
      return rate;
    }
    
    // Atualização Newton-Raphson
    rate = rate - npv / dnpv;
    
    // Evitar taxas negativas ou muito altas
    if (rate < -0.99) rate = -0.99;
    if (rate > 10) rate = 10;
  }
  
  return rate;
}

/**
 * Calcula a análise completa de investimento
 */
export function calculateInvestmentAnalysis(
  valorInvestido: number,
  ipcaProjetado: number
): InvestmentAnalysis {
  // Parâmetros fixos
  const PRAZO_MESES = 60;
  const PRAZO_ANOS = 5;
  const TAXA_JUROS_MENSAL = 0.01; // 1% a.m.
  const SPLIT = 0.5; // 50/50
  
  // Converter IPCA anual para mensal (aproximação)
  const ipcaMensal = Math.pow(1 + ipcaProjetado, 1/12) - 1;
  
  // Dividir capital em duas carteiras
  const carteiraMensal = valorInvestido * SPLIT;
  const carteiraAnual = valorInvestido * SPLIT;
  
  // Gerar fluxos
  const fluxosMensais = generateMonthlyFlow(
    carteiraMensal,
    TAXA_JUROS_MENSAL,
    ipcaMensal,
    PRAZO_MESES
  );
  
  const fluxosAnuais = generateAnnualFlow(
    carteiraAnual,
    TAXA_JUROS_MENSAL,
    ipcaProjetado,
    PRAZO_ANOS
  );
  
  // Calcular totais
  const totalMensal = fluxosMensais.reduce((sum, f) => sum + f.parcela, 0);
  const totalAnual = fluxosAnuais.reduce((sum, f) => sum + f.totalBalao, 0);
  const totalReceber = totalMensal + totalAnual;
  const lucroLiquido = totalReceber - valorInvestido;
  const roi = (lucroLiquido / valorInvestido) * 100;
  
  // Preparar fluxo de caixa para TIR
  const cashFlows: number[] = [-valorInvestido]; // Investimento inicial negativo
  
  for (let mes = 1; mes <= PRAZO_MESES; mes++) {
    const parcelaMensal = fluxosMensais[mes - 1].parcela;
    let fluxoMes = parcelaMensal;
    
    // Adicionar balão anual se for o último mês do ano
    if (mes % 12 === 0) {
      const ano = mes / 12;
      const balao = fluxosAnuais[ano - 1].totalBalao;
      fluxoMes += balao;
    }
    
    cashFlows.push(fluxoMes);
  }
  
  // Calcular TIR
  const tirMensal = calculateIRR(cashFlows);
  const tirAnual = Math.pow(1 + tirMensal, 12) - 1;
  
  // Agregar fluxo por ano
  const fluxoAnualAgregado: YearlyFlow[] = [];
  for (let ano = 1; ano <= PRAZO_ANOS; ano++) {
    const inicioMes = (ano - 1) * 12;
    const fimMes = ano * 12;
    
    const recebimentoMensal = fluxosMensais
      .slice(inicioMes, fimMes)
      .reduce((sum, f) => sum + f.parcela, 0);
    
    const balaoAnual = fluxosAnuais[ano - 1].totalBalao;
    const totalAno = recebimentoMensal + balaoAnual;
    
    fluxoAnualAgregado.push({
      ano,
      recebimentoMensal,
      balaoAnual,
      totalAno,
    });
  }
  
  // Preparar dados para o gráfico
  const chartData: ChartDataPoint[] = [];
  let retornoAcumulado = 0;
  
  for (let ano = 1; ano <= PRAZO_ANOS; ano++) {
    retornoAcumulado += fluxoAnualAgregado[ano - 1].totalAno;
    
    chartData.push({
      ano,
      investimento: valorInvestido,
      retornoAcumulado,
    });
  }
  
  return {
    valorInvestido: formatCurrency(valorInvestido),
    totalReceber: formatCurrency(totalReceber),
    lucroLiquido: formatCurrency(lucroLiquido),
    roi: roi.toFixed(2) + "%",
    tir: (tirAnual * 100).toFixed(2) + "% a.a.",
    carteirasMensais: fluxosMensais,
    carteirasAnuais: fluxosAnuais,
    fluxoAnualAgregado,
    chartData,
  };
}

/**
 * Simula a liquidez antecipada (venda de recebíveis)
 */
export function simulateLiquidez(
  analysis: InvestmentAnalysis,
  mesAtual: number,
  taxaDesconto: number
): LiquidezResult {
  const mesesRestantes = 60 - mesAtual;
  
  // Coletar fluxos futuros
  const fluxosFuturos: number[] = [];
  
  // Adicionar parcelas mensais futuras
  for (let mes = mesAtual; mes < analysis.carteirasMensais.length; mes++) {
    const parcela = analysis.carteirasMensais[mes].parcela;
    fluxosFuturos.push(parcela);
  }
  
  // Adicionar balões anuais futuros
  const anoAtual = Math.ceil(mesAtual / 12);
  for (let ano = anoAtual; ano <= 5; ano++) {
    const balao = analysis.carteirasAnuais[ano - 1].totalBalao;
    // Adicionar no mês correspondente
    const mesBalao = ano * 12 - mesAtual;
    if (mesBalao > 0 && mesBalao <= fluxosFuturos.length) {
      fluxosFuturos[mesBalao - 1] += balao;
    }
  }
  
  // Calcular valor presente com taxa de desconto
  const taxaDescontoMensal = Math.pow(1 + taxaDesconto, 1/12) - 1;
  let valorPresente = 0;
  let totalFluxoFuturo = 0;
  
  for (let i = 0; i < fluxosFuturos.length; i++) {
    totalFluxoFuturo += fluxosFuturos[i];
    const vp = fluxosFuturos[i] / Math.pow(1 + taxaDescontoMensal, i + 1);
    valorPresente += vp;
  }
  
  const descontoAplicado = totalFluxoFuturo - valorPresente;
  
  return {
    valorVendaVista: formatCurrency(valorPresente),
    descontoAplicado: formatCurrency(descontoAplicado),
    mesesRestantes,
    totalFluxoFuturo: formatCurrency(totalFluxoFuturo),
  };
}

/**
 * Formata um valor numérico para moeda brasileira
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Converte taxa anual para mensal
 */
export function convertAnnualToMonthly(annualRate: number): number {
  return Math.pow(1 + annualRate, 1/12) - 1;
}

/**
 * Converte taxa mensal para anual
 */
export function convertMonthlyToAnnual(monthlyRate: number): number {
  return Math.pow(1 + monthlyRate, 12) - 1;
}
