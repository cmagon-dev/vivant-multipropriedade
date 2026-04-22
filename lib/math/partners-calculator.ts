import Decimal from "decimal.js";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

// ─── Parâmetros fixos do modelo Partners ────────────────────────────────────
const MARKUP = 0.5;            // 50% sobre o valor do imóvel
const NUM_COTAS = 6;
const ENTRADA_PCT = 0.2;       // 20% do valor da cota
const SALDO_MENSAL_PCT = 0.4;  // 40% da cota → 60 parcelas mensais
const SALDO_ANUAL_PCT = 0.4;   // 40% da cota → 5 reforços anuais
const TAXA_MENSAL = 0.01;      // 1% a.m.
const PRAZO_PARCELAS = 60;
const PRAZO_REFORCOS = 5;
const SPLIT_CLIENTE = 0.7;     // 70% para o cliente
const CUSTO_IMPLANTACAO_PCT = 0.03; // 3% do valor do imóvel
const COMISSAO_PCT = 0.05;     // 5% do valor da cota

// ─── Cronogramas de venda (índice base-1 = mês do contrato) ─────────────────
export const CRONOGRAMAS = {
  otimista:   [1, 1, 2, 2, 3, 3],
  realista:   [1, 2, 3, 4, 5, 6],
  pessimista: [1, 3, 4, 6, 7, 9],
} as const;

export type CenarioVendas = keyof typeof CRONOGRAMAS;

// ─── Interfaces de retorno ────────────────────────────────────────────────────

export interface PartnersMonthlyPayment {
  mes: number;
  saldoInicial: number;
  correcaoIPCA: number;
  juros: number;
  amortizacao: number;
  parcela: number;
  saldoFinal: number;
}

export interface PartnersAnnualPayment {
  ano: number;
  principal: number;
  jurosAcumulados: number;
  correcaoIPCA: number;
  totalBalao: number;
}

export interface PartnersMonthlyFlow {
  mes: number;
  fluxoBruto: number;
  reembolso: number;       // parcela do custo de implantação reembolsada neste mês
  fluxoCliente: number;    // (fluxoBruto - reembolso) × 70%
  fluxoClienteAcumulado: number;
  entradaMes: number;      // só as entradas das cotas (sem parcelas/reforços)
  parcelasMes: number;
  reforcosMes: number;
}

export interface PartnersYearlyFlow {
  ano: number;
  entradas: number;
  parcelas: number;
  reforcos: number;
  totalBruto: number;
  reembolso: number;
  totalCliente: number;
}

export interface PartnersChartDataPoint {
  ano: number;
  recebimentoAcumulado: number;
  valorImovel: number;
}

export interface PartnersAnalysis {
  // Valores de entrada
  valorImovel: string;
  cenario: CenarioVendas;

  // VGV
  vgv: string;
  valorPorCota: string;

  // Custos
  custoImplantacao: string;
  totalComissoes: string;

  // Totais do cliente (70%)
  totalEntradaCliente: string;
  totalParcelasCliente: string;
  totalReforcosCliente: string;
  totalReceberCliente: string;

  // Médias
  parcelaMensalMedia: string;
  reforcoAnualMedio: string;

  // Prazos
  mesesParaQuitarCusto: number;
  mesUltimoRecebimento: number;

  // Fluxos detalhados
  fluxoMensal: PartnersMonthlyFlow[];
  fluxoAnual: PartnersYearlyFlow[];
  chartData: PartnersChartDataPoint[];

  // Dados brutos por cota (para liquidez antecipada)
  parcelasMensaisPorCota: { cotaIdx: number; mesVenda: number; pagamentos: PartnersMonthlyPayment[] }[];
  reforcosPorCota: { cotaIdx: number; mesVenda: number; pagamentos: PartnersAnnualPayment[] }[];
}

export interface PartnersLiquidezResult {
  mesAtual: number;
  percentualConcluido: number;
  recebidoAteOMomento: string;
  totalFluxoFuturo: string;
  descontoAplicado: string;
  taxaEstruturacao: string;
  valorVendaVista: string;         // VP - taxaEstruturacao (líquido das duas deduções)
  totalRecebidoComVenda: string;
  mesesRestantes: number;
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
): PartnersMonthlyPayment[] {
  const flows: PartnersMonthlyPayment[] = [];
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
): PartnersAnnualPayment[] {
  const flows: PartnersAnnualPayment[] = [];
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

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function parseCurrencyPtBr(str: string): number {
  const cleaned = str.replace(/\s/g, "").replace("R$", "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isNaN(n) ? 0 : n;
}

// ─── Função principal ─────────────────────────────────────────────────────────

export function calculatePartnersAnalysis(
  valorImovel: number,
  ipcaProjetado: number,
  cenario: CenarioVendas
): PartnersAnalysis {
  const ipcaMensal = Math.pow(1 + ipcaProjetado, 1 / 12) - 1;

  const vgv = valorImovel * (1 + MARKUP);
  const valorCota = vgv / NUM_COTAS;
  const custoImplantacao = valorImovel * CUSTO_IMPLANTACAO_PCT;
  const comissaoPorCota = valorCota * COMISSAO_PCT;
  const totalComissoes = comissaoPorCota * NUM_COTAS;

  const cronograma = CRONOGRAMAS[cenario];

  // Gerar pagamentos por cota
  const parcelasMensaisPorCota: PartnersAnalysis["parcelasMensaisPorCota"] = [];
  const reforcosPorCota: PartnersAnalysis["reforcosPorCota"] = [];

  for (let c = 0; c < NUM_COTAS; c++) {
    const mesVenda = cronograma[c];
    const principalMensal = valorCota * SALDO_MENSAL_PCT;
    const principalAnual = valorCota * SALDO_ANUAL_PCT;

    parcelasMensaisPorCota.push({
      cotaIdx: c,
      mesVenda,
      pagamentos: generateMonthlyFlow(principalMensal, TAXA_MENSAL, ipcaMensal, PRAZO_PARCELAS),
    });

    reforcosPorCota.push({
      cotaIdx: c,
      mesVenda,
      pagamentos: generateAnnualFlow(principalAnual, TAXA_MENSAL, ipcaProjetado, PRAZO_REFORCOS),
    });
  }

  // Determinar tamanho do array de fluxo (mês máximo = último mês de venda + 60)
  const ultimoMesVenda = Math.max(...cronograma);
  const tamanhoFluxo = ultimoMesVenda + PRAZO_PARCELAS + 1; // +1 para índice base-1

  // Construir fluxo bruto mês a mês
  const fluxoBrutoArr = new Array<number>(tamanhoFluxo + 1).fill(0);
  const entradaArr = new Array<number>(tamanhoFluxo + 1).fill(0);
  const parcelasArr = new Array<number>(tamanhoFluxo + 1).fill(0);
  const reforcosArr = new Array<number>(tamanhoFluxo + 1).fill(0);

  for (let c = 0; c < NUM_COTAS; c++) {
    const mesVenda = cronograma[c];
    const entradaBruta = valorCota * ENTRADA_PCT;
    const entradaLiquida = entradaBruta - comissaoPorCota; // deduz comissão

    fluxoBrutoArr[mesVenda] += entradaLiquida;
    entradaArr[mesVenda] += entradaLiquida;

    // Parcelas mensais: começam no mês seguinte à venda
    const pagMensais = parcelasMensaisPorCota[c].pagamentos;
    for (let p = 0; p < pagMensais.length; p++) {
      const mesAbsoluto = mesVenda + p + 1;
      if (mesAbsoluto < fluxoBrutoArr.length) {
        fluxoBrutoArr[mesAbsoluto] += pagMensais[p].parcela;
        parcelasArr[mesAbsoluto] += pagMensais[p].parcela;
      }
    }

    // Reforços anuais: meses mesVenda+12, mesVenda+24, ...
    const pagAnuais = reforcosPorCota[c].pagamentos;
    for (let r = 0; r < pagAnuais.length; r++) {
      const mesAbsoluto = mesVenda + (r + 1) * 12;
      if (mesAbsoluto < fluxoBrutoArr.length) {
        fluxoBrutoArr[mesAbsoluto] += pagAnuais[r].totalBalao;
        reforcosArr[mesAbsoluto] += pagAnuais[r].totalBalao;
      }
    }
  }

  // Aplicar reembolso do custo de implantação (antes do split)
  const fluxoMensal: PartnersMonthlyFlow[] = [];
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

  // Se o custo não foi quitado (caso extremo), marcar como último mês
  if (mesesParaQuitarCusto === 0 && custoImplantacao > 0) {
    mesesParaQuitarCusto = fluxoMensal.length;
  }

  // Agregar por ano
  const anoMaximo = Math.ceil((ultimoMesVenda + PRAZO_PARCELAS) / 12);
  const fluxoAnual: PartnersYearlyFlow[] = [];

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

    if (totalBruto > 0 || ano <= 5) {
      fluxoAnual.push({ ano, entradas, parcelas, reforcos, totalBruto, reembolso, totalCliente });
    }
  }

  // Dados do gráfico
  let acumulado = 0;
  const chartData: PartnersChartDataPoint[] = fluxoAnual.map((a) => {
    acumulado += a.totalCliente;
    return { ano: a.ano, recebimentoAcumulado: acumulado, valorImovel };
  });

  // KPIs totais
  const totalEntradaCliente = fluxoMensal.reduce((s, m) => s + m.entradaMes * SPLIT_CLIENTE, 0);
  const totalParcelasCliente = fluxoMensal.reduce((s, m) => s + m.parcelasMes * SPLIT_CLIENTE, 0);
  const totalReforcosCliente = fluxoMensal.reduce((s, m) => s + m.reforcosMes * SPLIT_CLIENTE, 0);
  const totalReceberCliente = fluxoMensal.reduce((s, m) => s + m.fluxoCliente, 0);
  const mesUltimoRecebimento = fluxoMensal.filter((m) => m.fluxoBruto > 0).slice(-1)[0]?.mes ?? 0;

  const parcelaMensalMedia =
    fluxoMensal.filter((m) => m.parcelasMes > 0).length > 0
      ? totalParcelasCliente / fluxoMensal.filter((m) => m.parcelasMes > 0).length
      : 0;

  const reforcoAnualMedio =
    fluxoAnual.filter((a) => a.reforcos > 0).length > 0
      ? totalReforcosCliente / fluxoAnual.filter((a) => a.reforcos > 0).length
      : 0;

  return {
    valorImovel: formatCurrency(valorImovel),
    cenario,
    vgv: formatCurrency(vgv),
    valorPorCota: formatCurrency(valorCota),
    custoImplantacao: formatCurrency(custoImplantacao),
    totalComissoes: formatCurrency(totalComissoes),
    totalEntradaCliente: formatCurrency(totalEntradaCliente),
    totalParcelasCliente: formatCurrency(totalParcelasCliente),
    totalReforcosCliente: formatCurrency(totalReforcosCliente),
    totalReceberCliente: formatCurrency(totalReceberCliente),
    parcelaMensalMedia: formatCurrency(parcelaMensalMedia),
    reforcoAnualMedio: formatCurrency(reforcoAnualMedio),
    mesesParaQuitarCusto,
    mesUltimoRecebimento,
    fluxoMensal,
    fluxoAnual,
    chartData,
    parcelasMensaisPorCota,
    reforcosPorCota,
  };
}

// ─── Taxa de estruturação da Vivant sobre antecipação de recebíveis ──────────
const TAXA_ESTRUTURACAO = 0.10; // 10% fixo sobre o saldo de recebíveis futuros

// ─── Liquidez Antecipada ──────────────────────────────────────────────────────

export function simulateLiquidezPartners(
  analysis: PartnersAnalysis,
  mesAtual: number,
  taxaDesconto: number // decimal, ex: 0.15 para 15% a.a.
): PartnersLiquidezResult {
  const fluxo = analysis.fluxoMensal;
  const mesMaximo = analysis.mesUltimoRecebimento;
  const mesesRestantes = mesMaximo - mesAtual;

  // Fluxos futuros do cliente (a partir do mês seguinte ao mesAtual)
  const fluxosFuturos = fluxo
    .filter((m) => m.mes > mesAtual)
    .map((m) => m.fluxoCliente);

  const totalFluxoFuturoNum = fluxosFuturos.reduce((s, v) => s + v, 0);

  // Desconto financeiro (valor presente com taxa de mercado)
  const taxaDescontoMensal = Math.pow(1 + taxaDesconto, 1 / 12) - 1;
  let valorPresente = 0;
  for (let i = 0; i < fluxosFuturos.length; i++) {
    valorPresente += fluxosFuturos[i] / Math.pow(1 + taxaDescontoMensal, i + 1);
  }

  const descontoAplicado = totalFluxoFuturoNum - valorPresente;

  // Taxa de estruturação: 10% fixo sobre o saldo nominal de recebíveis futuros
  const taxaEstruturacaoNum = totalFluxoFuturoNum * TAXA_ESTRUTURACAO;

  // Valor líquido antecipado = VP - taxa de estruturação
  const valorLiquidoNum = valorPresente - taxaEstruturacaoNum;

  const recebidoAteOMomento = fluxo
    .filter((m) => m.mes <= mesAtual)
    .reduce((s, m) => s + m.fluxoCliente, 0);

  const totalRecebidoNum = recebidoAteOMomento + valorLiquidoNum;
  const percentualConcluido = Math.round((mesAtual / mesMaximo) * 100);

  return {
    mesAtual,
    percentualConcluido,
    recebidoAteOMomento: formatCurrency(recebidoAteOMomento),
    totalFluxoFuturo: formatCurrency(totalFluxoFuturoNum),
    descontoAplicado: formatCurrency(descontoAplicado),
    taxaEstruturacao: formatCurrency(taxaEstruturacaoNum),
    valorVendaVista: formatCurrency(valorLiquidoNum),
    totalRecebidoComVenda: formatCurrency(totalRecebidoNum),
    mesesRestantes,
  };
}

export { parseCurrencyPtBr as parseCurrencyPartners };
