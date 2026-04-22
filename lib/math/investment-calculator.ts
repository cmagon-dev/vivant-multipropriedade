import Decimal from "decimal.js";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

// ─── Parâmetros fixos do modelo Capital ──────────────────────────────────────
const DESCONTO_AVISTA = 0.20;       // 20% desconto na compra à vista do imóvel
const MARKUP = 0.50;                // 50% markup sobre o valor de mercado
const NUM_COTAS = 6;                // 6 cotas internas (transparente ao usuário)
const ENTRADA_PCT = 0.20;           // 20% de entrada por cota
const SALDO_MENSAL_PCT = 0.40;      // 40% da cota → 60 parcelas mensais
const SALDO_ANUAL_PCT = 0.40;       // 40% da cota → 5 reforços anuais
const TAXA_MENSAL = 0.01;           // 1% a.m.
const PRAZO_PARCELAS = 60;          // 60 meses
const PRAZO_REFORCOS = 5;           // 5 reforços anuais
const SPLIT_CLIENTE = 0.70;         // 70% para o investidor Capital
const CUSTO_IMPLANTACAO_PCT = 0.03; // 3% do valor de mercado do imóvel
const COMISSAO_PCT = 0.05;          // 5% do valor da cota por venda
const TAXA_ESTRUTURACAO_LIQUIDEZ = 0.10; // 10% sobre recebíveis futuros na antecipação

// Cronograma interno: 1 cota por mês (invisível ao usuário)
const CRONOGRAMA_INTERNO: readonly number[] = [1, 2, 3, 4, 5, 6];

// ─── Interfaces internas ─────────────────────────────────────────────────────

interface InternalMonthlyPayment {
  mes: number;
  saldoInicial: number;
  correcaoIPCA: number;
  juros: number;
  amortizacao: number;
  parcela: number;
  saldoFinal: number;
}

interface InternalAnnualPayment {
  ano: number;
  principal: number;
  jurosAcumulados: number;
  correcaoIPCA: number;
  totalBalao: number;
}

// ─── Interfaces públicas ─────────────────────────────────────────────────────

export interface InvestmentMonthlyFlow {
  mes: number;
  fluxoBruto: number;
  reembolso: number;
  fluxoCliente: number;
  fluxoClienteAcumulado: number;
  entradaMes: number;    // bruto (antes do split)
  parcelasMes: number;   // bruto
  reforcosMes: number;   // bruto
}

export interface InvestmentYearlyFlow {
  ano: number;
  entradas: number;      // bruto
  parcelas: number;      // bruto
  reforcos: number;      // bruto
  totalBruto: number;
  reembolso: number;
  totalCliente: number;  // líquido do cliente (70%)
}

export interface ChartDataPoint {
  ano: number;
  investimento: number;
  retornoAcumulado: number;
}

export interface InvestmentAnalysis {
  // Valores de entrada
  valorInvestido: string;

  // Derivados do aporte
  valorMercadoImovel: string;  // aporte / 0.80 (compra à vista com desconto)
  vgv: string;                 // valorMercado × 1.50

  // Custos
  custoImplantacao: string;
  totalComissoes: string;

  // Totais do cliente (70%)
  totalEntradas: string;
  totalParcelas: string;
  totalReforcos: string;
  totalReceber: string;        // totalEntradas + totalParcelas + totalReforcos

  // Médias
  parcelaMensalMedia: string;
  reforcoAnualMedio: string;

  // KPIs financeiros
  lucroLiquido: string;        // totalReceber - valorInvestido
  roi: string;
  tir: string;

  // Prazos
  mesesParaQuitarCusto: number;
  mesUltimoRecebimento: number;

  // Fluxos
  fluxoMensal: InvestmentMonthlyFlow[];
  fluxoAnualAgregado: InvestmentYearlyFlow[];
  chartData: ChartDataPoint[];
}

export interface LiquidezResult {
  valorVendaVista: string;
  descontoAplicado: string;
  taxaEstruturacao: string;
  mesesRestantes: number;
  totalFluxoFuturo: string;
  mesAtual: number;
  percentualConcluido: number;
  recebidoAteOMomento: string;
  totalRecebidoComVenda: string;
  lucroTotalComVenda: string;
  roiTotalComVenda: string;
  tirTotalComVenda: string;
  rentabilidadeTotalComVenda: string;
}

// ─── Funções internas ─────────────────────────────────────────────────────────

function calculatePMT(principal: number, taxa: number, periodos: number): number {
  const p = new Decimal(principal);
  const i = new Decimal(taxa);
  const n = new Decimal(periodos);
  const onePlusI = Decimal.add(1, i);
  const divisor = Decimal.sub(1, onePlusI.pow(n.neg()));
  return p.times(i).dividedBy(divisor).toNumber();
}

function generateMonthlyFlow(
  principal: number,
  taxaJuros: number,
  ipcaMensal: number,
  periodos: number
): InternalMonthlyPayment[] {
  const flows: InternalMonthlyPayment[] = [];
  let saldoDevedor = new Decimal(principal);

  for (let mes = 1; mes <= periodos; mes++) {
    const saldoInicial = saldoDevedor.toNumber();
    const correcaoIPCA = saldoDevedor.times(ipcaMensal).toNumber();
    saldoDevedor = saldoDevedor.times(Decimal.add(1, ipcaMensal));
    const juros = saldoDevedor.times(taxaJuros).toNumber();
    const periodosRestantes = periodos - mes + 1;
    const parcelaAtual = calculatePMT(saldoDevedor.toNumber(), taxaJuros, periodosRestantes);
    const amortizacao = new Decimal(parcelaAtual).minus(juros).toNumber();
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

function generateAnnualFlow(
  principal: number,
  taxaJuros: number,
  ipcaAnual: number,
  anos: number
): InternalAnnualPayment[] {
  const flows: InternalAnnualPayment[] = [];
  const principalPorAno = principal / anos;

  for (let ano = 1; ano <= anos; ano++) {
    const p = new Decimal(principalPorAno);
    const ipcaAcum = Decimal.add(1, ipcaAnual).pow(ano);
    const jurosAcum = Decimal.add(1, taxaJuros * 12).pow(ano);
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

function calculateIRR(cashFlows: number[], guess: number = 0.1): number {
  const maxIterations = 1000;
  const tolerance = 0.00001;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;

    for (let t = 0; t < cashFlows.length; t++) {
      const discount = Math.pow(1 + rate, t);
      npv += cashFlows[t] / discount;
      dnpv -= (t * cashFlows[t]) / (discount * (1 + rate));
    }

    if (Math.abs(npv) < tolerance) return rate;
    rate = rate - npv / dnpv;
    if (rate < -0.99) rate = -0.99;
    if (rate > 10) rate = 10;
  }
  return rate;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function parseCurrencyPtBr(str: string): number {
  const cleaned = str
    .replace(/\s/g, "")
    .replace("R$", "")
    .replace(/\./g, "")
    .replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

// ─── Função principal ─────────────────────────────────────────────────────────

export function calculateInvestmentAnalysis(
  valorInvestido: number,
  ipcaProjetado: number
): InvestmentAnalysis {
  const ipcaMensal = Math.pow(1 + ipcaProjetado, 1 / 12) - 1;

  // O aporte permite comprar um imóvel à vista com 20% de desconto:
  // aporte = preço à vista = valorMercado × (1 - 0.20) → valorMercado = aporte / 0.80
  const valorMercadoImovel = valorInvestido / (1 - DESCONTO_AVISTA);
  const vgv = valorMercadoImovel * (1 + MARKUP);
  const valorCota = vgv / NUM_COTAS;
  const custoImplantacao = valorMercadoImovel * CUSTO_IMPLANTACAO_PCT;
  const comissaoPorCota = valorCota * COMISSAO_PCT;
  const totalComissoes = comissaoPorCota * NUM_COTAS;

  // Gerar pagamentos por cota
  const parcelasMensaisPorCota: {
    cotaIdx: number;
    mesVenda: number;
    pagamentos: InternalMonthlyPayment[];
  }[] = [];
  const reforcosPorCota: {
    cotaIdx: number;
    mesVenda: number;
    pagamentos: InternalAnnualPayment[];
  }[] = [];

  for (let c = 0; c < NUM_COTAS; c++) {
    const mesVenda = CRONOGRAMA_INTERNO[c];
    parcelasMensaisPorCota.push({
      cotaIdx: c,
      mesVenda,
      pagamentos: generateMonthlyFlow(
        valorCota * SALDO_MENSAL_PCT,
        TAXA_MENSAL,
        ipcaMensal,
        PRAZO_PARCELAS
      ),
    });
    reforcosPorCota.push({
      cotaIdx: c,
      mesVenda,
      pagamentos: generateAnnualFlow(
        valorCota * SALDO_ANUAL_PCT,
        TAXA_MENSAL,
        ipcaProjetado,
        PRAZO_REFORCOS
      ),
    });
  }

  const ultimoMesVenda = Math.max(...CRONOGRAMA_INTERNO);
  const tamanhoFluxo = ultimoMesVenda + PRAZO_PARCELAS + 1;

  const fluxoBrutoArr = new Array<number>(tamanhoFluxo + 1).fill(0);
  const entradaArr = new Array<number>(tamanhoFluxo + 1).fill(0);
  const parcelasArr = new Array<number>(tamanhoFluxo + 1).fill(0);
  const reforcosArr = new Array<number>(tamanhoFluxo + 1).fill(0);

  for (let c = 0; c < NUM_COTAS; c++) {
    const mesVenda = CRONOGRAMA_INTERNO[c];
    const entradaLiquida = valorCota * ENTRADA_PCT - comissaoPorCota;

    fluxoBrutoArr[mesVenda] += entradaLiquida;
    entradaArr[mesVenda] += entradaLiquida;

    for (let p = 0; p < parcelasMensaisPorCota[c].pagamentos.length; p++) {
      const mesAbs = mesVenda + p + 1;
      if (mesAbs < fluxoBrutoArr.length) {
        fluxoBrutoArr[mesAbs] += parcelasMensaisPorCota[c].pagamentos[p].parcela;
        parcelasArr[mesAbs] += parcelasMensaisPorCota[c].pagamentos[p].parcela;
      }
    }

    for (let r = 0; r < reforcosPorCota[c].pagamentos.length; r++) {
      const mesAbs = mesVenda + (r + 1) * 12;
      if (mesAbs < fluxoBrutoArr.length) {
        fluxoBrutoArr[mesAbs] += reforcosPorCota[c].pagamentos[r].totalBalao;
        reforcosArr[mesAbs] += reforcosPorCota[c].pagamentos[r].totalBalao;
      }
    }
  }

  // Reembolso do custo de implantação + split 70/30
  const fluxoMensal: InvestmentMonthlyFlow[] = [];
  let reembolsoAcumulado = 0;
  let fluxoClienteAcumulado = 0;
  let mesesParaQuitarCusto = 0;

  for (let t = 1; t < fluxoBrutoArr.length; t++) {
    const bruto = fluxoBrutoArr[t];
    if (bruto === 0 && t > ultimoMesVenda + PRAZO_PARCELAS) break;

    let reembolsoMes = 0;
    if (reembolsoAcumulado < custoImplantacao) {
      reembolsoMes = Math.min(bruto, custoImplantacao - reembolsoAcumulado);
      reembolsoAcumulado += reembolsoMes;
      if (reembolsoAcumulado >= custoImplantacao && mesesParaQuitarCusto === 0) {
        mesesParaQuitarCusto = t;
      }
    }

    const clienteMes = (bruto - reembolsoMes) * SPLIT_CLIENTE;
    fluxoClienteAcumulado += clienteMes;

    fluxoMensal.push({
      mes: t,
      fluxoBruto: bruto,
      reembolso: reembolsoMes,
      fluxoCliente: clienteMes,
      fluxoClienteAcumulado,
      entradaMes: entradaArr[t],
      parcelasMes: parcelasArr[t],
      reforcosMes: reforcosArr[t],
    });
  }

  if (mesesParaQuitarCusto === 0 && custoImplantacao > 0) {
    mesesParaQuitarCusto = fluxoMensal.length;
  }

  // Agregar por ano
  const anoMaximo = Math.ceil((ultimoMesVenda + PRAZO_PARCELAS) / 12);
  const fluxoAnualAgregado: InvestmentYearlyFlow[] = [];

  for (let ano = 1; ano <= anoMaximo; ano++) {
    const inicioMes = (ano - 1) * 12 + 1;
    const fimMes = ano * 12;
    const mesesDoAno = fluxoMensal.filter((m) => m.mes >= inicioMes && m.mes <= fimMes);

    const entradas = mesesDoAno.reduce((s, m) => s + m.entradaMes, 0);
    const parcelas = mesesDoAno.reduce((s, m) => s + m.parcelasMes, 0);
    const reforcos = mesesDoAno.reduce((s, m) => s + m.reforcosMes, 0);
    const totalBruto = mesesDoAno.reduce((s, m) => s + m.fluxoBruto, 0);
    const reembolso = mesesDoAno.reduce((s, m) => s + m.reembolso, 0);
    const totalCliente = mesesDoAno.reduce((s, m) => s + m.fluxoCliente, 0);

    if (totalBruto > 0 || ano <= 6) {
      fluxoAnualAgregado.push({
        ano,
        entradas,
        parcelas,
        reforcos,
        totalBruto,
        reembolso,
        totalCliente,
      });
    }
  }

  // Dados do gráfico (anual)
  let acumulado = 0;
  const chartData: ChartDataPoint[] = fluxoAnualAgregado.map((a) => {
    acumulado += a.totalCliente;
    return { ano: a.ano, investimento: valorInvestido, retornoAcumulado: acumulado };
  });

  // KPI totais
  const totalEntradas = fluxoMensal.reduce((s, m) => s + m.entradaMes * SPLIT_CLIENTE, 0);
  const totalParcelas = fluxoMensal.reduce((s, m) => s + m.parcelasMes * SPLIT_CLIENTE, 0);
  const totalReforcos = fluxoMensal.reduce((s, m) => s + m.reforcosMes * SPLIT_CLIENTE, 0);
  const totalReceberCliente = fluxoMensal.reduce((s, m) => s + m.fluxoCliente, 0);
  const mesUltimoRecebimento =
    fluxoMensal.filter((m) => m.fluxoBruto > 0).slice(-1)[0]?.mes ?? 0;

  const mesesComParcela = fluxoMensal.filter((m) => m.parcelasMes > 0).length;
  const parcelaMensalMedia = mesesComParcela > 0 ? totalParcelas / mesesComParcela : 0;

  const anosComReforco = fluxoAnualAgregado.filter((a) => a.reforcos > 0).length;
  const reforcoAnualMedio = anosComReforco > 0 ? totalReforcos / anosComReforco : 0;

  const lucroLiquido = totalReceberCliente - valorInvestido;
  const roi = valorInvestido > 0 ? (lucroLiquido / valorInvestido) * 100 : 0;

  // TIR: -valorInvestido no mês 0, fluxoCliente em cada mês subsequente
  const cashFlows: number[] = [-valorInvestido];
  for (const m of fluxoMensal) {
    cashFlows.push(m.fluxoCliente);
  }
  const tirMensal = calculateIRR(cashFlows);
  const tirAnual = Math.pow(1 + tirMensal, 12) - 1;

  return {
    valorInvestido: formatCurrency(valorInvestido),
    valorMercadoImovel: formatCurrency(valorMercadoImovel),
    vgv: formatCurrency(vgv),
    custoImplantacao: formatCurrency(custoImplantacao),
    totalComissoes: formatCurrency(totalComissoes),
    totalEntradas: formatCurrency(totalEntradas),
    totalParcelas: formatCurrency(totalParcelas),
    totalReforcos: formatCurrency(totalReforcos),
    totalReceber: formatCurrency(totalReceberCliente),
    parcelaMensalMedia: formatCurrency(parcelaMensalMedia),
    reforcoAnualMedio: formatCurrency(reforcoAnualMedio),
    lucroLiquido: formatCurrency(lucroLiquido),
    roi: roi.toFixed(2) + "%",
    tir: `${(tirAnual * 100).toFixed(2)}% a.a.`,
    mesesParaQuitarCusto,
    mesUltimoRecebimento,
    fluxoMensal,
    fluxoAnualAgregado,
    chartData,
  };
}

// ─── Liquidez Antecipada ──────────────────────────────────────────────────────

export function simulateLiquidez(
  analysis: InvestmentAnalysis,
  mesAtual: number,
  taxaDesconto: number
): LiquidezResult {
  const mesMaximo = analysis.mesUltimoRecebimento;
  const mesesRestantes = mesMaximo - mesAtual;

  const fluxo = analysis.fluxoMensal;

  const fluxosFuturos = fluxo
    .filter((m) => m.mes > mesAtual)
    .map((m) => m.fluxoCliente);

  const totalFluxoFuturoNum = fluxosFuturos.reduce((s, v) => s + v, 0);

  const taxaDescontoMensal = Math.pow(1 + taxaDesconto, 1 / 12) - 1;
  let valorPresente = 0;
  for (let i = 0; i < fluxosFuturos.length; i++) {
    valorPresente += fluxosFuturos[i] / Math.pow(1 + taxaDescontoMensal, i + 1);
  }

  const descontoAplicado = totalFluxoFuturoNum - valorPresente;

  // Taxa de estruturação: 5% fixo sobre o saldo nominal de recebíveis futuros
  const taxaEstruturacaoNum = totalFluxoFuturoNum * TAXA_ESTRUTURACAO_LIQUIDEZ;
  const valorLiquidoNum = valorPresente - taxaEstruturacaoNum;

  const recebidoAteOMomento = fluxo
    .filter((m) => m.mes <= mesAtual)
    .reduce((s, m) => s + m.fluxoCliente, 0);

  const totalRecebidoNum = recebidoAteOMomento + valorLiquidoNum;
  const valorInvestidoNum = parseCurrencyPtBr(analysis.valorInvestido);
  const percentualConcluido = Math.round((mesAtual / mesMaximo) * 100);

  const lucroTotal = valorInvestidoNum > 0 ? totalRecebidoNum - valorInvestidoNum : 0;
  const roiTotal = valorInvestidoNum > 0 ? (lucroTotal / valorInvestidoNum) * 100 : 0;

  // TIR com saída antecipada
  const cashFlowsLiquidez: number[] = [-valorInvestidoNum];
  for (let m = 1; m <= mesAtual; m++) {
    const fluxoMes = fluxo.find((f) => f.mes === m)?.fluxoCliente ?? 0;
    const terminacao = m === mesAtual ? valorLiquidoNum : 0;
    cashFlowsLiquidez.push(fluxoMes + terminacao);
  }

  let tirTotalComVendaStr = "—";
  const tirMensalLiquidez = calculateIRR(cashFlowsLiquidez);
  if (Number.isFinite(tirMensalLiquidez)) {
    const tirAnualLiquidez = Math.pow(1 + tirMensalLiquidez, 12) - 1;
    tirTotalComVendaStr = `${(tirAnualLiquidez * 100).toFixed(2)}% a.a.`;
  }

  return {
    valorVendaVista: formatCurrency(valorLiquidoNum),
    descontoAplicado: formatCurrency(descontoAplicado),
    taxaEstruturacao: formatCurrency(taxaEstruturacaoNum),
    mesesRestantes,
    totalFluxoFuturo: formatCurrency(totalFluxoFuturoNum),
    mesAtual,
    percentualConcluido,
    recebidoAteOMomento: formatCurrency(recebidoAteOMomento),
    totalRecebidoComVenda: formatCurrency(totalRecebidoNum),
    lucroTotalComVenda: formatCurrency(lucroTotal),
    roiTotalComVenda: `${roiTotal.toFixed(2)}%`,
    tirTotalComVenda: tirTotalComVendaStr,
    rentabilidadeTotalComVenda: `${roiTotal.toFixed(2)}%`,
  };
}

export function convertAnnualToMonthly(annualRate: number): number {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

export function convertMonthlyToAnnual(monthlyRate: number): number {
  return Math.pow(1 + monthlyRate, 12) - 1;
}
