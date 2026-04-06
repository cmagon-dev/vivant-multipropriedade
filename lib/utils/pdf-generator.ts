import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { InvestmentAnalysis, LiquidezResult } from "@/lib/math/investment-calculator";

// Cores do tema Vivant
const COLORS = {
  primary: "#1A2F4B", // vivant-navy
  gold: "#D4AF37", // vivant-gold
  green: "#10B981", // vivant-green
  text: "#334155",
  textLight: "#64748B",
  background: "#F8F9FA",
};

/**
 * Gera PDF da proposta de investimento
 */
export function generateInvestmentProposal(
  analysis: InvestmentAnalysis,
  leadData?: {
    nome: string;
    email: string;
    telefone: string;
  },
  liquidezResult?: LiquidezResult
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // ==========================================
  // HEADER / LOGO
  // ==========================================
  doc.setFillColor(COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("VIVANT", pageWidth / 2, 18, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Multipropriedade Inteligente", pageWidth / 2, 28, {
    align: "center",
  });

  yPosition = 50;

  // ==========================================
  // TÍTULO DA PROPOSTA
  // ==========================================
  doc.setTextColor(COLORS.primary);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("PROPOSTA DE INVESTIMENTO", pageWidth / 2, yPosition, {
    align: "center",
  });

  yPosition += 8;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.textLight);
  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(`Data: ${dataAtual}`, pageWidth / 2, yPosition, {
    align: "center",
  });

  yPosition += 15;

  // ==========================================
  // DADOS DO CLIENTE (se fornecidos)
  // ==========================================
  if (leadData) {
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, yPosition, pageWidth - 30, 25, 3, 3, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary);
    doc.text("DADOS DO CLIENTE", 20, yPosition + 7);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text);
    doc.text(`Nome: ${leadData.nome}`, 20, yPosition + 14);
    doc.text(`E-mail: ${leadData.email}`, 20, yPosition + 19);
    doc.text(`Telefone: ${leadData.telefone}`, 120, yPosition + 19);

    yPosition += 35;
  }

  // ==========================================
  // RESUMO EXECUTIVO
  // ==========================================
  doc.setFillColor(16, 185, 129); // green
  doc.roundedRect(15, yPosition, pageWidth - 30, 8, 2, 2, "F");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("RESUMO EXECUTIVO", 20, yPosition + 5.5);

  yPosition += 15;

  // Cards do resumo - centralizados
  const cardWidth = 45;
  const cardHeight = 28;
  const totalCardsWidth = cardWidth * 4 + 6; // 4 cards + 3 espaços de 2mm
  const cardsStartX = (pageWidth - totalCardsWidth) / 2;

  const summaryCards = [
    {
      label: "Investimento",
      value: analysis.valorInvestido,
      color: [26, 47, 75],
    },
    { label: "Total a Receber", value: analysis.totalReceber, color: [16, 185, 129] },
    { label: "Lucro Líquido", value: analysis.lucroLiquido, color: [212, 175, 55] },
    { label: "ROI", value: analysis.roi, color: [147, 51, 234] },
  ];

  summaryCards.forEach((card, index) => {
    const xPos = cardsStartX + index * (cardWidth + 2);

    // Card background
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(xPos, yPosition, cardWidth, cardHeight, 2, 2, "F");

    // Card border
    doc.setDrawColor(card.color[0], card.color[1], card.color[2]);
    doc.setLineWidth(0.5);
    doc.roundedRect(xPos, yPosition, cardWidth, cardHeight, 2, 2, "S");

    // Label
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.textLight);
    doc.text(
      card.label,
      xPos + cardWidth / 2,
      yPosition + 7,
      { align: "center" }
    );

    // Value
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(card.color[0], card.color[1], card.color[2]);
    
    const lines = doc.splitTextToSize(card.value, cardWidth - 4);
    const valueY = yPosition + (lines.length === 1 ? 16 : 14);
    
    lines.forEach((line: string, lineIndex: number) => {
      doc.text(
        line,
        xPos + cardWidth / 2,
        valueY + lineIndex * 4,
        { align: "center" }
      );
    });
  });

  yPosition += cardHeight + 15;

  // ==========================================
  // TIR
  // ==========================================
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(15, yPosition, pageWidth - 30, 12, 2, 2, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary);
  doc.text("TIR (Taxa Interna de Retorno):", 20, yPosition + 5);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(234, 88, 12); // orange
  doc.text(analysis.tir, 80, yPosition + 5);

  doc.setFontSize(8);
  doc.setTextColor(COLORS.textLight);
  doc.text(
    "Rentabilidade anual equivalente do investimento",
    20,
    yPosition + 9
  );

  yPosition += 20;

  // ==========================================
  // FLUXO DE CAIXA ANUAL
  // ==========================================
  doc.setFillColor(26, 47, 75);
  doc.roundedRect(15, yPosition, pageWidth - 30, 8, 2, 2, "F");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("FLUXO DE CAIXA ANUAL", 20, yPosition + 5.5);

  yPosition += 12;

  // Tabela de fluxo de caixa
  const fluxoData = analysis.fluxoAnualAgregado.map((row) => [
    `Ano ${row.ano}`,
    formatCurrency(row.recebimentoMensal),
    formatCurrency(row.balaoAnual),
    formatCurrency(row.totalAno),
  ]);

  // Calcular acumulados
  let acumulado = 0;
  const fluxoDataComAcumulado = analysis.fluxoAnualAgregado.map((row) => {
    acumulado += row.totalAno;
    return [
      `Ano ${row.ano}`,
      formatCurrency(row.recebimentoMensal),
      formatCurrency(row.balaoAnual),
      formatCurrency(row.totalAno),
      formatCurrency(acumulado),
    ];
  });

  const tableWidth = 165;
  const tableStartX = (pageWidth - tableWidth) / 2;

  autoTable(doc, {
    startY: yPosition,
    head: [
      ["Ano", "Mensal", "Balão Anual", "Total no Ano", "Acumulado"],
    ],
    body: fluxoDataComAcumulado,
    theme: "grid",
    headStyles: {
      fillColor: [26, 47, 75],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
    columnStyles: {
      0: { cellWidth: 25, fontStyle: "bold", halign: "center" },
      1: { cellWidth: 35, halign: "right" },
      2: { cellWidth: 35, halign: "right" },
      3: { cellWidth: 35, halign: "right", fontStyle: "bold" },
      4: { cellWidth: 35, halign: "right", fontStyle: "bold", textColor: [212, 175, 55] },
    },
    margin: { left: tableStartX, right: tableStartX },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // ==========================================
  // SIMULAÇÃO DE LIQUIDEZ ANTECIPADA
  // ==========================================
  if (yPosition > pageHeight - 80) {
    doc.addPage();
    yPosition = 20;
  }

  if (liquidezResult) {
    // Header da seção
    doc.setFillColor(234, 88, 12); // orange
    doc.roundedRect(15, yPosition, pageWidth - 30, 8, 2, 2, "F");

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("SIMULAÇÃO DE LIQUIDEZ ANTECIPADA", 20, yPosition + 5.5);

    yPosition += 15;

    // Análise da Venda Antecipada - 3 cards
    doc.setFillColor(250, 240, 230);
    doc.roundedRect(15, yPosition, pageWidth - 30, 32, 2, 2, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary);
    doc.text("Análise da Venda Antecipada", 20, yPosition + 6);

    const cardSmallWidth = 58;
    const totalVendaCardsWidth = cardSmallWidth * 3 + 4; // 3 cards + 2 espaços de 2mm
    const vendaCardsStartX = (pageWidth - totalVendaCardsWidth) / 2;

    const vendaCards = [
      { label: "Valor de Venda", value: liquidezResult.totalFluxoFuturo, color: [59, 130, 246] },
      { label: "Desconto", value: "-" + liquidezResult.descontoAplicado, color: [249, 115, 22] },
      { label: "Líquido à Vista", value: liquidezResult.valorVendaVista, color: [16, 185, 129] },
    ];

    vendaCards.forEach((card, index) => {
      const xPos = vendaCardsStartX + index * (cardSmallWidth + 2);

      // Card border
      doc.setDrawColor(card.color[0], card.color[1], card.color[2]);
      doc.setLineWidth(0.8);
      doc.roundedRect(xPos, yPosition + 10, cardSmallWidth, 18, 2, 2, "S");

      // Label
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.text);
      doc.text(card.label, xPos + cardSmallWidth / 2, yPosition + 15, {
        align: "center",
      });

      // Value
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(card.color[0], card.color[1], card.color[2]);
      const valueLines = doc.splitTextToSize(card.value, cardSmallWidth - 4);
      doc.text(
        valueLines,
        xPos + cardSmallWidth / 2,
        yPosition + 22,
        { align: "center" }
      );
    });

    yPosition += 40;

    // Resultado Total com Venda
    doc.setFillColor(236, 253, 245);
    doc.roundedRect(15, yPosition, pageWidth - 30, 52, 2, 2, "F");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary);
    doc.text("Resultado Total com Venda Antecipada", 20, yPosition + 6);

    yPosition += 12;

    // 4 cards de métricas - centralizados
    const metricsCardWidth = 42;
    const totalMetricsWidth = metricsCardWidth * 4 + 3; // 4 cards + 3 espaços de 1mm
    const metricsStartX = (pageWidth - totalMetricsWidth) / 2;
    
    const metricsData = [
      { label: "Total Recebido", value: liquidezResult.totalRecebidoComVenda, color: [16, 185, 129] },
      { label: "Lucro Total", value: liquidezResult.lucroTotalComVenda, color: [26, 47, 75] },
      { label: "ROI Total", value: liquidezResult.roiTotalComVenda, color: [147, 51, 234] },
      { label: "TIR Total", value: liquidezResult.tirTotalComVenda, color: [234, 88, 12] },
    ];

    metricsData.forEach((metric, index) => {
      const xPos = metricsStartX + index * (metricsCardWidth + 1);

      // Label
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(COLORS.textLight);
      doc.text(metric.label, xPos + metricsCardWidth / 2, yPosition + 3, {
        align: "center",
      });

      // Value
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(metric.color[0], metric.color[1], metric.color[2]);
      doc.text(metric.value, xPos + metricsCardWidth / 2, yPosition + 10, {
        align: "center",
      });
    });

    yPosition += 18;

    // Composição
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(COLORS.primary);
    doc.text("Composição:", 20, yPosition + 3);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(COLORS.text);
    doc.setFontSize(7);
    doc.text(`Já recebido: ${liquidezResult.recebidoAteOMomento}`, 20, yPosition + 7);
    doc.text(`+ Venda à vista: ${liquidezResult.valorVendaVista}`, 20, yPosition + 11);
    
    doc.setFont("helvetica", "bold");
    doc.setTextColor(16, 185, 129);
    doc.text(`= Total: ${liquidezResult.totalRecebidoComVenda}`, 20, yPosition + 15);

    yPosition += 22;
  } else {
    // Mensagem quando não há simulação de liquidez
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(15, yPosition, pageWidth - 30, 15, 2, 2, "F");

    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(COLORS.textLight);
    doc.text(
      "ℹ️  Simulação de Liquidez Antecipada não foi considerada nesta análise.",
      pageWidth / 2,
      yPosition + 8,
      { align: "center" }
    );

    doc.setFontSize(8);
    doc.text(
      "Para simular uma saída antecipada, utilize o Simulador de Liquidez no site.",
      pageWidth / 2,
      yPosition + 12,
      { align: "center" }
    );

    yPosition += 22;
  }

  // ==========================================
  // RODAPÉ - NOVA PÁGINA SE NECESSÁRIO
  // ==========================================
  if (yPosition > pageHeight - 50) {
    doc.addPage();
    yPosition = 20;
  }

  // Parâmetros da Análise
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(15, yPosition, pageWidth - 30, 35, 2, 2, "F");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(COLORS.primary);
  doc.text("PARÂMETROS DA ANÁLISE", 20, yPosition + 6);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text);
  const params = [
    "• Prazo: 60 meses (5 anos)",
    "• Taxa de Juros: 1% a.m. (~12,68% a.a.)",
    "• Split: 50% Carteira Mensal + 50% Carteira Anual",
    "• Correção: IPCA aplicado ao saldo devedor",
    "• Estrutura: CRI-ready com Patrimônio de Afetação",
    "• Garantias: Alienação Fiduciária + Conta Escrow",
  ];

  params.forEach((param, index) => {
    doc.text(param, 20, yPosition + 12 + index * 4);
  });

  yPosition += 45;

  // Aviso Legal
  doc.setFillColor(254, 243, 199); // yellow light
  doc.roundedRect(15, yPosition, pageWidth - 30, 20, 2, 2, "F");

  doc.setFontSize(7);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(146, 64, 14); // yellow dark
  doc.text("⚠ AVISO LEGAL", 20, yPosition + 5);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 53, 15);
  const avisoText =
    "Este documento é uma simulação de análise de viabilidade financeira. Os valores apresentados são " +
    "projeções baseadas nos parâmetros informados e não constituem garantia de rentabilidade. " +
    "Investimentos estão sujeitos a riscos. Consulte um especialista antes de tomar decisões financeiras.";

  const splitAviso = doc.splitTextToSize(avisoText, pageWidth - 50);
  doc.text(splitAviso, 20, yPosition + 10);

  // Rodapé final
  doc.setFontSize(8);
  doc.setTextColor(COLORS.textLight);
  doc.text(
    "Vivant Residences | Maringá, PR | contato@vivantresidences.com.br | (44) 99969-1196",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );

  // Salvar PDF
  const nomeArquivo = leadData
    ? `Proposta_Vivant_${leadData.nome.replace(/\s+/g, "_")}.pdf`
    : `Proposta_Vivant_${Date.now()}.pdf`;

  doc.save(nomeArquivo);
}

/**
 * Formata valor numérico para moeda
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
