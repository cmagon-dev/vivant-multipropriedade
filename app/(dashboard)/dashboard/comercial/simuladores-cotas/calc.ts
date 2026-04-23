/**
 * Engine de cálculo para o Simulador de Vendas de Cotas.
 * Módulo puro TypeScript — sem dependências React.
 */

// ─── Tipos ─────────────────────────────────────────────────────────────────────

export type TipoReforco = "anual" | "semestral";

export type SimuladorInputs = {
  custoAquisicaoTotal: number;
  /** Markup % sobre custo → VGV = custo × (1 + markup/100) */
  markup: number;
  /** Semanas por cota */
  numSemanas: number;

  pctEntrada: number;
  pctParcelas: number;
  nParcelas: number;
  tipoReforco: TipoReforco;
  nReforcos: number;

  /** Taxa Vivant mensal (%) */
  taxaVivantMensal: number;
  /** IPCA anual (%) — somado à taxa Vivant para parcelas e reforços */
  ipcaAnual: number;

  /** Habilita o cálculo de antecipação de recebíveis */
  temAntecipacao: boolean;
  /** Mês em que ocorre a antecipação */
  mesAntecipacao: number;
  /** Taxa de desconto da antecipação (% a.a.) */
  taxaAntecipacaoAnual: number;

  pctSetup: number;
  pctImpostos: number;
  pctComissoes: number;
  pctPlataforma: number;
};

export type LinhaAmortizacao = {
  periodo: number;
  prestacao: number;
  juros: number;
  amortizacao: number;
  saldoDevedor: number;
};

export type ResultadoCota = {
  // Estrutura de pagamento
  valorEntrada: number;
  pvParcelas: number;
  pvReforcos: number;
  prestacaoMensal: number;
  reforcoValor: number;
  taxaCombinadadMensal: number;   // taxa mensal efetiva (Vivant + IPCA) usada em parcelas
  taxaReforcoEfetiva: number;     // taxa efetiva por período dos reforços

  // Totais brutos
  totalEntrada: number;
  totalParcelas: number;
  totalReforcos: number;
  totalRecebidoCota: number;
  jurosTotaisCota: number;

  // Antecipação
  temAntecipacao: boolean;
  mesAntecipacao: number;
  taxaAntecipacaoMensal: number;
  periodoReforcoMeses: number;

  parcelasRecebidas: number;
  jurosParcelasRecebidas: number;
  reforcosRecebidos: number;
  jurosReforcosRecebidos: number;
  totalJurosRecebidos: number;

  parcelasRestantes: number;
  faceParcelasRestantes: number;
  pvParcelasRestantes: number;
  desagioParcelasRestantes: number;

  reforcosRestantes: number;
  faceReforcosRestantes: number;
  pvReforcosRestantes: number;
  desagioReforcosRestantes: number;

  totalFaceRestante: number;
  totalPvRestante: number;
  totalDesagioAntecipacao: number;

  // DRE
  receitaVendaSimples: number;
  totalJurosRecebidosDRE: number;
  receitaTotalBruta: number;
  custoAquisicaoPorCota: number;
  custoSetup: number;
  lucroBruto: number;
  impostos: number;
  comissoes: number;
  taxaPlataforma: number;
  totalDespesasOp: number;
  ebitda: number;
  totalDesagioAntecipacaoDRE: number;
  lucroLiquido: number;
  margemLiquida: number;

  tabelaParcelas: LinhaAmortizacao[];
  tabelaReforcos: LinhaAmortizacao[];
};

export type ResultadoConsolidado = {
  vgvTotal: number;
  valorPorSemana: number;
  numSemanas: number;
  numCotas: number;
  valorCotaVenda: number;
  tipoReforco: TipoReforco;
  taxaCombinadadMensal: number;
  taxaReforcoEfetiva: number;
  temAntecipacao: boolean;

  // DRE Consolidada (× numCotas)
  receitaVendaSimples: number;
  totalJurosRecebidos: number;
  receitaTotalBruta: number;
  custoAquisicaoTotal: number;
  custoSetupTotal: number;
  lucroBrutoTotal: number;
  impostosTotal: number;
  comissoesTotal: number;
  taxaPlataformaTotal: number;
  totalDespesasOpTotal: number;
  ebitdaTotal: number;
  desagioParcelasTotal: number;
  desagioReforcosTotal: number;
  desagioTotal: number;
  lucroLiquidoTotal: number;
  margemLiquida: number;

  vgvFinanciado: number;
  jurosTotais: number;
  prestacaoMensal: number;
  reforcoValor: number;

  porCota: ResultadoCota;
};

// ─── PMT (Tabela Price) ────────────────────────────────────────────────────────

export function pmt(taxa: number, n: number, pv: number): number {
  if (taxa === 0) return pv / n;
  return (pv * taxa) / (1 - Math.pow(1 + taxa, -n));
}

export function gerarTabelaAmortizacao(taxa: number, n: number, pv: number): LinhaAmortizacao[] {
  const prestacao = pmt(taxa, n, pv);
  const tabela: LinhaAmortizacao[] = [];
  let saldo = pv;
  for (let i = 1; i <= n; i++) {
    const juros = saldo * taxa;
    const amortizacao = prestacao - juros;
    saldo -= amortizacao;
    tabela.push({ periodo: i, prestacao, juros, amortizacao, saldoDevedor: Math.max(0, saldo) });
  }
  return tabela;
}

// ─── Função principal ──────────────────────────────────────────────────────────

export function calcularSimulacao(inputs: SimuladorInputs): ResultadoConsolidado {
  const {
    custoAquisicaoTotal, markup, numSemanas,
    pctEntrada, pctParcelas, nParcelas, tipoReforco, nReforcos,
    taxaVivantMensal, ipcaAnual,
    temAntecipacao, mesAntecipacao, taxaAntecipacaoAnual,
    pctSetup, pctImpostos, pctComissoes, pctPlataforma,
  } = inputs;

  // ── Modelo de semanas ────────────────────────────────────────────────────────
  const vgvTotal       = custoAquisicaoTotal * (1 + markup / 100);
  const valorPorSemana = vgvTotal / 52;
  const valorCotaVenda = numSemanas * valorPorSemana;
  const numCotas       = 52 / numSemanas;

  // ── Taxas combinadas (Vivant + IPCA) ─────────────────────────────────────────
  const taxaVivantAnual      = Math.pow(1 + taxaVivantMensal / 100, 12) - 1;
  const taxaCombinadadAnual  = (1 + taxaVivantAnual) * (1 + ipcaAnual / 100) - 1;
  // Taxa mensal equivalente à combinada — aplicada nas PARCELAS e nos REFORÇOS
  const taxaCombinadadMensal = Math.pow(1 + taxaCombinadadAnual, 1 / 12) - 1;

  // Taxa efetiva dos reforços (período semestral ou anual)
  const taxaReforcoEfetiva =
    tipoReforco === "semestral"
      ? Math.pow(1 + taxaCombinadadAnual, 0.5) - 1
      : taxaCombinadadAnual;

  // ── Taxa de antecipação mensal equivalente ───────────────────────────────────
  const taxaAntecipacaoMensal =
    taxaAntecipacaoAnual > 0
      ? Math.pow(1 + taxaAntecipacaoAnual / 100, 1 / 12) - 1
      : 0;

  // ── Estrutura de valores por cota ────────────────────────────────────────────
  const pctReforcos  = Math.max(0, 100 - pctEntrada - pctParcelas);
  const valorEntrada = valorCotaVenda * (pctEntrada  / 100);
  const pvParcelas   = valorCotaVenda * (pctParcelas / 100);
  const pvReforcos   = valorCotaVenda * (pctReforcos / 100);

  // ── PMT — ambos usam a taxa combinada ────────────────────────────────────────
  const prestacaoMensal = nParcelas > 0 && pvParcelas > 0
    ? pmt(taxaCombinadadMensal, nParcelas, pvParcelas) : 0;

  const reforcoValor = nReforcos > 0 && pvReforcos > 0
    ? pmt(taxaReforcoEfetiva, nReforcos, pvReforcos) : 0;

  // ── Tabelas de amortização ───────────────────────────────────────────────────
  const tabelaParcelas = nParcelas > 0 && pvParcelas > 0
    ? gerarTabelaAmortizacao(taxaCombinadadMensal, nParcelas, pvParcelas) : [];

  const tabelaReforcos = nReforcos > 0 && pvReforcos > 0
    ? gerarTabelaAmortizacao(taxaReforcoEfetiva, nReforcos, pvReforcos) : [];

  // ── Totais brutos por cota ───────────────────────────────────────────────────
  const totalEntrada      = valorEntrada;
  const totalParcelas     = prestacaoMensal * nParcelas;
  const totalReforcos     = reforcoValor * nReforcos;
  const totalRecebidoCota = totalEntrada + totalParcelas + totalReforcos;
  const jurosTotaisCota   = totalRecebidoCota - valorCotaVenda;

  // ── Análise de antecipação ───────────────────────────────────────────────────
  const periodoReforcoMeses = tipoReforco === "semestral" ? 6 : 12;

  let parcelasRecebidas: number;
  let jurosParcelasRecebidas: number;
  let reforcosRecebidos: number;
  let jurosReforcosRecebidos: number;
  let parcelasRestantes: number;
  let faceParcelasRestantes: number;
  let pvParcelasRestantes: number;
  let desagioParcelasRestantes: number;
  let reforcosRestantes: number;
  let faceReforcosRestantes: number;
  let pvReforcosRestantes: number;
  let desagioReforcosRestantes: number;

  if (!temAntecipacao) {
    // Sem antecipação: desenvolvedor recebe tudo incluindo todos os juros
    parcelasRecebidas        = nParcelas;
    jurosParcelasRecebidas   = tabelaParcelas.reduce((s, r) => s + r.juros, 0);
    reforcosRecebidos        = nReforcos;
    jurosReforcosRecebidos   = tabelaReforcos.reduce((s, r) => s + r.juros, 0);
    parcelasRestantes        = 0;
    faceParcelasRestantes    = 0;
    pvParcelasRestantes      = 0;
    desagioParcelasRestantes = 0;
    reforcosRestantes        = 0;
    faceReforcosRestantes    = 0;
    pvReforcosRestantes      = 0;
    desagioReforcosRestantes = 0;
  } else {
    // Com antecipação no mês M_ant
    parcelasRecebidas      = Math.min(mesAntecipacao, nParcelas);
    jurosParcelasRecebidas = tabelaParcelas.slice(0, parcelasRecebidas).reduce((s, r) => s + r.juros, 0);

    reforcosRecebidos      = Math.min(Math.floor(mesAntecipacao / periodoReforcoMeses), nReforcos);
    jurosReforcosRecebidos = tabelaReforcos.slice(0, reforcosRecebidos).reduce((s, r) => s + r.juros, 0);

    // Parcelas restantes
    parcelasRestantes    = Math.max(0, nParcelas - mesAntecipacao);
    faceParcelasRestantes = prestacaoMensal * parcelasRestantes;
    pvParcelasRestantes   = 0;
    if (parcelasRestantes > 0 && prestacaoMensal > 0) {
      pvParcelasRestantes =
        taxaAntecipacaoMensal === 0
          ? faceParcelasRestantes
          : prestacaoMensal *
            (1 - Math.pow(1 + taxaAntecipacaoMensal, -parcelasRestantes)) /
            taxaAntecipacaoMensal;
    }
    desagioParcelasRestantes = Math.max(0, faceParcelasRestantes - pvParcelasRestantes);

    // Reforços restantes
    reforcosRestantes    = nReforcos - reforcosRecebidos;
    faceReforcosRestantes = reforcoValor * reforcosRestantes;
    pvReforcosRestantes   = 0;
    if (reforcosRestantes > 0 && reforcoValor > 0) {
      for (let j = 1; j <= reforcosRestantes; j++) {
        const meses = (reforcosRecebidos + j) * periodoReforcoMeses - mesAntecipacao;
        pvReforcosRestantes += reforcoValor / Math.pow(1 + taxaAntecipacaoMensal, Math.max(0, meses));
      }
    }
    desagioReforcosRestantes = Math.max(0, faceReforcosRestantes - pvReforcosRestantes);
  }

  const totalJurosRecebidos     = jurosParcelasRecebidas + jurosReforcosRecebidos;
  const totalFaceRestante       = faceParcelasRestantes + faceReforcosRestantes;
  const totalPvRestante         = pvParcelasRestantes + pvReforcosRestantes;
  const totalDesagioAntecipacao = desagioParcelasRestantes + desagioReforcosRestantes;

  // ── DRE por cota ─────────────────────────────────────────────────────────────
  const receitaVendaSimples = valorCotaVenda;
  const receitaTotalBruta   = receitaVendaSimples + totalJurosRecebidos;

  const custoAquisicaoPorCota = custoAquisicaoTotal / numCotas;
  const custoSetup            = custoAquisicaoPorCota * (pctSetup / 100);
  const lucroBruto            = receitaTotalBruta - custoAquisicaoPorCota - custoSetup;

  const impostos       = receitaVendaSimples * (pctImpostos   / 100);
  const comissoes      = receitaVendaSimples * (pctComissoes  / 100);
  const taxaPlataforma = receitaVendaSimples * (pctPlataforma / 100);
  const totalDespesasOp = impostos + comissoes + taxaPlataforma;
  const ebitda          = lucroBruto - totalDespesasOp;

  const lucroLiquido  = ebitda - totalDesagioAntecipacao;
  const margemLiquida = receitaVendaSimples > 0
    ? (lucroLiquido / receitaVendaSimples) * 100 : 0;

  const porCota: ResultadoCota = {
    valorEntrada, pvParcelas, pvReforcos,
    prestacaoMensal, reforcoValor,
    taxaCombinadadMensal, taxaReforcoEfetiva,
    totalEntrada, totalParcelas, totalReforcos,
    totalRecebidoCota, jurosTotaisCota,
    temAntecipacao, mesAntecipacao, taxaAntecipacaoMensal, periodoReforcoMeses,
    parcelasRecebidas, jurosParcelasRecebidas,
    reforcosRecebidos, jurosReforcosRecebidos, totalJurosRecebidos,
    parcelasRestantes, faceParcelasRestantes, pvParcelasRestantes, desagioParcelasRestantes,
    reforcosRestantes, faceReforcosRestantes, pvReforcosRestantes, desagioReforcosRestantes,
    totalFaceRestante, totalPvRestante, totalDesagioAntecipacao,
    receitaVendaSimples, totalJurosRecebidosDRE: totalJurosRecebidos,
    receitaTotalBruta, custoAquisicaoPorCota, custoSetup, lucroBruto,
    impostos, comissoes, taxaPlataforma, totalDespesasOp,
    ebitda, totalDesagioAntecipacaoDRE: totalDesagioAntecipacao,
    lucroLiquido, margemLiquida,
    tabelaParcelas, tabelaReforcos,
  };

  const n = numCotas;

  return {
    vgvTotal, valorPorSemana, numSemanas, numCotas, valorCotaVenda,
    tipoReforco, taxaCombinadadMensal, taxaReforcoEfetiva, temAntecipacao,
    receitaVendaSimples:   receitaVendaSimples * n,
    totalJurosRecebidos:   totalJurosRecebidos * n,
    receitaTotalBruta:     receitaTotalBruta * n,
    custoAquisicaoTotal:   custoAquisicaoPorCota * n,
    custoSetupTotal:       custoSetup * n,
    lucroBrutoTotal:       lucroBruto * n,
    impostosTotal:         impostos * n,
    comissoesTotal:        comissoes * n,
    taxaPlataformaTotal:   taxaPlataforma * n,
    totalDespesasOpTotal:  totalDespesasOp * n,
    ebitdaTotal:           ebitda * n,
    desagioParcelasTotal:  desagioParcelasRestantes * n,
    desagioReforcosTotal:  desagioReforcosRestantes * n,
    desagioTotal:          totalDesagioAntecipacao * n,
    lucroLiquidoTotal:     lucroLiquido * n,
    margemLiquida,
    vgvFinanciado:         totalRecebidoCota * n,
    jurosTotais:           jurosTotaisCota * n,
    prestacaoMensal, reforcoValor,
    porCota,
  };
}
