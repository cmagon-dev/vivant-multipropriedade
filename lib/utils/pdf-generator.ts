import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { InvestmentAnalysis, LiquidezResult } from "@/lib/math/investment-calculator";
import type { PartnersAnalysis, PartnersLiquidezResult } from "@/lib/math/partners-calculator";

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
 * Converte um SVG string para PNG base64 via canvas — usado para ícones no PDF
 */
async function svgToBase64(svgContent: string, size = 32): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) { reject(new Error("canvas indisponível")); return; }

    const img = new Image();
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = url;
  });
}

const PHONE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1A2F4B">
  <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.32.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1C10.29 21 3 13.71 3 4.5c0-.55.45-1 1-1H8c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.36.03.74-.24 1.01L6.6 10.8z"/>
</svg>`;

const EMAIL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#1A2F4B">
  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
</svg>`;

/**
 * Carrega imagem de uma URL, converte todos os pixels não-transparentes para branco
 * e retorna base64 — necessário para logos sobre fundo escuro no jsPDF
 */
async function loadImageAsWhiteBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("canvas não disponível")); return; }

      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 0) {   // pixel não-transparente → branco
          d[i] = 255;
          d[i + 1] = 255;
          d[i + 2] = 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = reject;
    img.src = objectUrl;
  });
}

/**
 * Garante que há espaço suficiente na página atual para um bloco de `needed` mm.
 * Se não houver, adiciona nova página e retorna y = topMargin.
 * Sempre reserva 18mm de rodapé para numeração de páginas.
 */
function checkPage(doc: jsPDF, y: number, needed: number, pageHeight: number, topMargin = 20): number {
  if (y + needed > pageHeight - 18) {
    doc.addPage();
    return topMargin;
  }
  return y;
}

/**
 * Adiciona numeração de páginas em todas as páginas do documento
 */
function addPageNumbers(doc: jsPDF): void {
  const pageCount = (doc as any).internal.getNumberOfPages();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - 15,
      pageHeight - 5,
      { align: "right" }
    );
  }
}

/**
 * Gera PDF da proposta de investimento
 */
export async function generateInvestmentProposal(
  analysis: InvestmentAnalysis,
  leadData?: {
    nome: string;
    email: string;
    telefone: string;
  },
  liquidezResult?: LiquidezResult
): Promise<void> {
  // Pré-carrega ícones SVG como PNG base64 para uso na seção de contato
  let phoneIconBase64 = "";
  let emailIconBase64 = "";
  try {
    [phoneIconBase64, emailIconBase64] = await Promise.all([
      svgToBase64(PHONE_SVG, 48),
      svgToBase64(EMAIL_SVG, 48),
    ]);
  } catch { /* silencia — usa fallback de texto */ }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // ==========================================
  // HEADER / LOGO
  // ==========================================
  doc.setFillColor(COLORS.primary);
  doc.rect(0, 0, pageWidth, 44, "F");

  // Tenta inserir a logo em branco; se falhar, usa texto
  try {
    const logoBase64 = await loadImageAsWhiteBase64("/logo-vivant-capital.png");
    const logoW = 62;
    const logoH = 22;
    doc.addImage(logoBase64, "PNG", (pageWidth - logoW) / 2, 9, logoW, logoH);
  } catch {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("VIVANT CAPITAL", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Multipropriedade Inteligente", pageWidth / 2, 30, { align: "center" });
  }

  yPosition = 54;

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
    yPosition = checkPage(doc, yPosition, 35, pageHeight);
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
  yPosition = checkPage(doc, yPosition, 66, pageHeight);
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
  yPosition = checkPage(doc, yPosition, 22, pageHeight);
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
  // FLUXO DE CAIXA MENSAL
  // ==========================================
  yPosition = checkPage(doc, yPosition, 30, pageHeight);
  doc.setFillColor(26, 47, 75);
  doc.roundedRect(15, yPosition, pageWidth - 30, 8, 2, 2, "F");

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("FLUXO DE CAIXA MENSAL — SUA PARTE (70%)", 20, yPosition + 5.5);

  yPosition += 12;

  // Apenas meses com movimento
  const mesesComMovimento = analysis.fluxoMensal.filter(
    (m) => m.fluxoBruto > 0 || m.fluxoCliente > 0
  );

  const fluxoMensalData = mesesComMovimento.map((m) => {
    const isYearEnd = m.mes % 12 === 0;
    const ano = Math.ceil(m.mes / 12);
    const label = isYearEnd ? `Mês ${m.mes}\n(Ano ${ano})` : `Mês ${m.mes}`;
    return [
      label,
      m.entradaMes * 0.7 > 0 ? formatCurrency(m.entradaMes * 0.7) : "—",
      m.parcelasMes * 0.7 > 0 ? formatCurrency(m.parcelasMes * 0.7) : "—",
      m.reforcosMes * 0.7 > 0 ? formatCurrency(m.reforcosMes * 0.7) : "—",
      formatCurrency(m.fluxoCliente),
      formatCurrency(m.fluxoClienteAcumulado),
    ];
  });

  autoTable(doc, {
    startY: yPosition,
    head: [["Mês", "Entradas (70%)", "Parcelas (70%)", "Reforços (70%)", "Total Recebido", "Acumulado"]],
    body: fluxoMensalData,
    theme: "grid",
    headStyles: {
      fillColor: [26, 47, 75],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
      halign: "center",
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [51, 65, 85],
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: [248, 249, 250],
    },
    columnStyles: {
      0: { cellWidth: 22, fontStyle: "bold", halign: "center" },
      1: { cellWidth: 32, halign: "right" },
      2: { cellWidth: 32, halign: "right" },
      3: { cellWidth: 32, halign: "right" },
      4: { cellWidth: 32, halign: "right", fontStyle: "bold" },
      5: { cellWidth: 32, halign: "right", fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
    // Destaca linhas de fechamento de ano com fundo navy
    didParseCell: (data) => {
      if (data.section === "body") {
        const m = mesesComMovimento[data.row.index];
        if (m && m.mes % 12 === 0) {
          data.cell.styles.fillColor = [26, 47, 75];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // ==========================================
  // SIMULAÇÃO DE LIQUIDEZ ANTECIPADA
  // ==========================================
  if (liquidezResult) {
    // Header + Bloco 1 juntos (evita header orphan)
    yPosition = checkPage(doc, yPosition, 46, pageHeight);

    // ── Header
    doc.setFillColor(234, 88, 12);
    doc.roundedRect(15, yPosition, pageWidth - 30, 8, 2, 2, "F");
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.text("SIMULAÇÃO DE LIQUIDEZ ANTECIPADA", 20, yPosition + 5.5);
    yPosition += 12;

    // ── Bloco 1: Situação no Momento da Saída
    yPosition = checkPage(doc, yPosition, 26, pageHeight);
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, yPosition, pageWidth - 30, 22, 2, 2, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(COLORS.primary);
    doc.text("Situacao no Momento da Saida", 20, yPosition + 5);

    const situacaoItems = [
      { label: "Mes de Saida", value: `Mes ${liquidezResult.mesAtual}` },
      { label: "Prazo Concluido", value: `${liquidezResult.percentualConcluido.toFixed(1)}%` },
      { label: "Meses Restantes", value: `${liquidezResult.mesesRestantes} meses` },
      { label: "Ja Recebido", value: liquidezResult.recebidoAteOMomento },
    ];
    const sitW = (pageWidth - 30) / situacaoItems.length;
    situacaoItems.forEach((item, i) => {
      const sx = 15 + i * sitW;
      doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(COLORS.textLight);
      doc.text(item.label, sx + sitW / 2, yPosition + 11, { align: "center" });
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(COLORS.primary);
      doc.text(item.value, sx + sitW / 2, yPosition + 18, { align: "center" });
      if (i < situacaoItems.length - 1) {
        doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
        doc.line(sx + sitW, yPosition + 7, sx + sitW, yPosition + 20);
      }
    });
    yPosition += 26;

    // ── Bloco 2: Composição Detalhada (tabela passo a passo)
    yPosition = checkPage(doc, yPosition, 52, pageHeight);
    doc.setFillColor(255, 247, 237);
    doc.roundedRect(15, yPosition, pageWidth - 30, 46, 2, 2, "F");
    doc.setDrawColor(234, 88, 12); doc.setLineWidth(0.4);
    doc.roundedRect(15, yPosition, pageWidth - 30, 46, 2, 2, "S");

    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(COLORS.primary);
    doc.text("Composicao do Valor Antecipado", 20, yPosition + 6);

    const compLines = [
      { label: "Total de Recebiveis Futuros (a receber do mes " + liquidezResult.mesAtual + " em diante)", value: liquidezResult.totalFluxoFuturo, prefix: "", color: [59, 130, 246] as [number,number,number] },
      { label: "(-) Desconto financeiro aplicado (taxa de desconto sobre o VP)", value: "-" + liquidezResult.descontoAplicado, prefix: "", color: [234, 88, 12] as [number,number,number] },
      { label: "(-) Taxa de Estruturacao Vivant (10% sobre recebiveis futuros)", value: "-" + liquidezResult.taxaEstruturacao, prefix: "", color: [234, 88, 12] as [number,number,number] },
      { label: "(=) VALOR ANTECIPADO LIQUIDO", value: liquidezResult.valorVendaVista, prefix: "", color: [16, 185, 129] as [number,number,number] },
    ];

    const labelX = 20; const valueX = pageWidth - 18;
    compLines.forEach((line, i) => {
      const ly = yPosition + 13 + i * 8;
      const isLast = i === compLines.length - 1;
      if (isLast) {
        doc.setFillColor(220, 252, 231);
        doc.rect(15, ly - 3.5, pageWidth - 30, 8, "F");
        doc.setDrawColor(16, 185, 129); doc.setLineWidth(0.3);
        doc.line(15, ly - 3.5, pageWidth - 15, ly - 3.5);
        doc.line(15, ly + 4.5, pageWidth - 15, ly + 4.5);
      }
      doc.setFontSize(isLast ? 8.5 : 7.5);
      doc.setFont("helvetica", isLast ? "bold" : "normal");
      doc.setTextColor(...line.color);
      doc.text(line.label, labelX, ly);
      doc.setFont("helvetica", "bold");
      doc.text(line.value, valueX, ly, { align: "right" });
    });
    yPosition += 52;

    // ── Bloco 3: Resultado Final (3 colunas)
    yPosition = checkPage(doc, yPosition, 33, pageHeight);
    doc.setFillColor(236, 253, 245);
    doc.roundedRect(15, yPosition, pageWidth - 30, 28, 2, 2, "F");
    doc.setDrawColor(16, 185, 129); doc.setLineWidth(0.4);
    doc.roundedRect(15, yPosition, pageWidth - 30, 28, 2, 2, "S");

    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(COLORS.primary);
    doc.text("Resultado Final com Saida Antecipada", 20, yPosition + 6);

    const resItems = [
      { label: "Ja Recebido (ate mes " + liquidezResult.mesAtual + ")", value: liquidezResult.recebidoAteOMomento, color: [26, 47, 75] as [number,number,number] },
      { label: "(+) Valor Antecipado Liquido", value: liquidezResult.valorVendaVista, color: [234, 88, 12] as [number,number,number] },
      { label: "(=) TOTAL RECEBIDO", value: liquidezResult.totalRecebidoComVenda, color: [16, 185, 129] as [number,number,number] },
    ];
    const resW = (pageWidth - 30) / 3;
    resItems.forEach((item, i) => {
      const rx = 15 + i * resW;
      doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(COLORS.textLight);
      doc.text(item.label, rx + resW / 2, yPosition + 12, { align: "center", maxWidth: resW - 4 });
      doc.setFontSize(i === 2 ? 11 : 9.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...item.color);
      doc.text(item.value, rx + resW / 2, yPosition + 22, { align: "center" });
      if (i < resItems.length - 1) {
        doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
        doc.line(rx + resW, yPosition + 8, rx + resW, yPosition + 26);
      }
    });
    yPosition += 33;

    // ── Bloco 4: Indicadores de Retorno
    yPosition = checkPage(doc, yPosition, 33, pageHeight);
    doc.setFillColor(245, 243, 255);
    doc.roundedRect(15, yPosition, pageWidth - 30, 28, 2, 2, "F");

    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(COLORS.primary);
    doc.text("Indicadores de Retorno (com saida antecipada)", 20, yPosition + 6);

    const retItems = [
      { label: "Lucro Liquido Total", value: liquidezResult.lucroTotalComVenda, color: [26, 47, 75] as [number,number,number] },
      { label: "ROI Total", value: liquidezResult.roiTotalComVenda, color: [147, 51, 234] as [number,number,number] },
      { label: "TIR (Anualizada)", value: liquidezResult.tirTotalComVenda, color: [234, 88, 12] as [number,number,number] },
      { label: "Rentabilidade Total", value: liquidezResult.rentabilidadeTotalComVenda, color: [16, 185, 129] as [number,number,number] },
    ];
    const retW = (pageWidth - 30) / 4;
    retItems.forEach((item, i) => {
      const rx = 15 + i * retW;
      doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(COLORS.textLight);
      doc.text(item.label, rx + retW / 2, yPosition + 12, { align: "center" });
      doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...item.color);
      doc.text(item.value, rx + retW / 2, yPosition + 21, { align: "center" });
      if (i < retItems.length - 1) {
        doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
        doc.line(rx + retW, yPosition + 8, rx + retW, yPosition + 26);
      }
    });
    yPosition += 33;

  } else {
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(15, yPosition, pageWidth - 30, 18, 2, 2, "F");
    doc.setFontSize(9); doc.setFont("helvetica", "italic"); doc.setTextColor(COLORS.textLight);
    doc.text("Simulacao de Liquidez Antecipada nao foi considerada nesta analise.", pageWidth / 2, yPosition + 7, { align: "center" });
    doc.setFontSize(8);
    doc.text("Para simular uma saida antecipada, utilize o Simulador de Liquidez no site.", pageWidth / 2, yPosition + 13, { align: "center" });
    yPosition += 24;
  }

  // Parâmetros da Análise
  yPosition = checkPage(doc, yPosition, 45, pageHeight);
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
    "• Desconto na compra à vista: ~20% sobre o valor de mercado do imóvel",
    "• Markup VGV: 50% sobre o valor de mercado",
    "• Entrada por unidade: 20% (-5% comissao de venda)",
    "• 40% em parcelas mensais (Tabela Price + IPCA) + 40% em 5 reforços anuais",
    "• Taxa de Juros: 1% a.m. (~12,68% a.a.) | Split: 70% investidor / 30% Vivant",
    "• Custo de implantação: 3% (adiantado pela Vivant, reembolsado nos 1ºs recebimentos)",
  ];

  params.forEach((param, index) => {
    doc.text(param, 20, yPosition + 12 + index * 4);
  });

  yPosition += 45;

  // Aviso Legal
  yPosition = checkPage(doc, yPosition, 30, pageHeight);
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

  yPosition += 28;

  // ==========================================
  // FALE COM UM ESPECIALISTA
  // ==========================================
  yPosition = checkPage(doc, yPosition, 52, pageHeight);

  doc.setFillColor(26, 47, 75); // navy
  doc.roundedRect(15, yPosition, pageWidth - 30, 8, 2, 2, "F");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("FALE COM UM ESPECIALISTA VIVANT CAPITAL", 20, yPosition + 5.5);

  yPosition += 12;

  doc.setFillColor(245, 248, 252);
  doc.roundedRect(15, yPosition, pageWidth - 30, 28, 2, 2, "F");

  doc.setDrawColor(26, 47, 75);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, yPosition, pageWidth - 30, 28, 2, 2, "S");

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text);
  doc.text(
    "Nossa equipe está pronta para apresentar sua proposta personalizada e tirar todas as suas dúvidas.",
    pageWidth / 2,
    yPosition + 7,
    { align: "center", maxWidth: pageWidth - 40 }
  );

  // Dados de contato com ícones SVG renderizados como imagem
  const contactX = pageWidth / 2 - 52;
  const navy: [number, number, number] = [26, 47, 75];
  const iconSize = 5; // mm no PDF

  // Linha 1 — telefone
  const ty = yPosition + 12;
  if (phoneIconBase64) {
    doc.addImage(phoneIconBase64, "PNG", contactX, ty - 0.5, iconSize, iconSize);
  }
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text("Tel:", contactX + iconSize + 2, ty + 3.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text);
  doc.text("(44) 99969-1196", contactX + iconSize + 13, ty + 3.5);

  // Linha 2 — e-mail
  const ey = yPosition + 20;
  if (emailIconBase64) {
    doc.addImage(emailIconBase64, "PNG", contactX, ey - 0.5, iconSize, iconSize);
  }
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text("E-mail:", contactX + iconSize + 2, ey + 3.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(COLORS.text);
  doc.text("contato@vivantresidences.com.br", contactX + iconSize + 18, ey + 3.5);

  yPosition += 35;

  // ==========================================
  // RODAPÉ — numeração é inserida depois no loop
  // ==========================================
  // Linha decorativa no rodapé de cada página é adicionada via addPageNumbers
  addPageNumbers(doc);

  // Salvar PDF
  const nomeArquivo = leadData
    ? `Proposta_Vivant_${leadData.nome.replace(/\s+/g, "_")}.pdf`
    : `Proposta_Vivant_${Date.now()}.pdf`;

  doc.save(nomeArquivo);
}

// ─────────────────────────────────────────────────────────────────────────────
// GERADOR DE PDF — SIMULADOR PARTNERS
// ─────────────────────────────────────────────────────────────────────────────

export async function generatePartnersProposal(
  analysis: PartnersAnalysis,
  leadData?: { nome: string; email: string; telefone: string },
  liquidezResult?: PartnersLiquidezResult
): Promise<void> {
  const gold: [number, number, number] = [180, 148, 40];   // vivant-gold escuro (mais visível no PDF)
  const navy: [number, number, number] = [26, 47, 75];
  const textColor: [number, number, number] = [51, 65, 85];
  const lightText: [number, number, number] = [100, 116, 139];

  // Pré-carrega ícones e logo
  let phoneIconBase64 = "";
  let emailIconBase64 = "";
  let logoBase64 = "";
  try {
    [phoneIconBase64, emailIconBase64, logoBase64] = await Promise.all([
      svgToBase64(PHONE_SVG, 48),
      svgToBase64(EMAIL_SVG, 48),
      loadImageAsWhiteBase64("/logo-vivant-partners.png"),
    ]);
  } catch { /* usa fallback de texto */ }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = 20;

  // ── HEADER ──────────────────────────────────────────────────────────────────
  doc.setFillColor(...navy);
  doc.rect(0, 0, pageWidth, 44, "F");

  // Faixa dourada decorativa
  doc.setFillColor(...gold);
  doc.rect(0, 42, pageWidth, 2, "F");

  if (logoBase64) {
    const lw = 62; const lh = 22;
    doc.addImage(logoBase64, "PNG", (pageWidth - lw) / 2, 9, lw, lh);
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22); doc.setFont("helvetica", "bold");
    doc.text("VIVANT PARTNERS", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text("Multipropriedade Inteligente", pageWidth / 2, 30, { align: "center" });
  }

  y = 54;

  // ── TÍTULO ──────────────────────────────────────────────────────────────────
  doc.setTextColor(...navy);
  doc.setFontSize(17); doc.setFont("helvetica", "bold");
  doc.text("PROPOSTA PARTNERS — RECEBÍVEIS DO IMÓVEL", pageWidth / 2, y, { align: "center" });

  y += 7;
  doc.setFontSize(9); doc.setFont("helvetica", "normal");
  doc.setTextColor(...lightText);
  doc.text(`Data: ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}`, pageWidth / 2, y, { align: "center" });

  y += 12;

  // ── DADOS DO CLIENTE ────────────────────────────────────────────────────────
  if (leadData) {
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, y, pageWidth - 30, 25, 3, 3, "F");
    doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(...navy);
    doc.text("DADOS DO PROPRIETÁRIO", 20, y + 7);
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(...textColor);
    doc.text(`Nome: ${leadData.nome}`, 20, y + 14);
    doc.text(`E-mail: ${leadData.email}`, 20, y + 19);
    doc.text(`Telefone: ${leadData.telefone}`, 120, y + 19);
    y += 33;
  }

  // ── RESUMO EXECUTIVO ────────────────────────────────────────────────────────
  doc.setFillColor(...gold);
  doc.roundedRect(15, y, pageWidth - 30, 8, 2, 2, "F");
  doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
  doc.text("RESUMO EXECUTIVO", 20, y + 5.5);
  y += 14;

  const cardW = 45; const cardH = 28;
  const totalW = cardW * 4 + 6;
  const startX = (pageWidth - totalW) / 2;

  const summaryCards = [
    { label: "Valor do Imóvel",    value: analysis.valorImovel,         color: navy },
    { label: "VGV da Operação",    value: analysis.vgv,                  color: gold },
    { label: "Total a Receber (70%)", value: analysis.totalReceberCliente, color: [16, 185, 129] as [number,number,number] },
    { label: "Valor por Cota",     value: analysis.valorPorCota,         color: [147, 51, 234] as [number,number,number] },
  ];

  summaryCards.forEach((card, i) => {
    const x = startX + i * (cardW + 2);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(x, y, cardW, cardH, 2, 2, "F");
    doc.setDrawColor(...card.color);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, y, cardW, cardH, 2, 2, "S");
    doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...lightText);
    doc.text(card.label, x + cardW / 2, y + 7, { align: "center" });
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...card.color);
    const lines = doc.splitTextToSize(card.value, cardW - 4);
    lines.forEach((line: string, li: number) => {
      doc.text(line, x + cardW / 2, y + (lines.length === 1 ? 16 : 14) + li * 4, { align: "center" });
    });
  });

  y += cardH + 10;

  // ── KPIs SECUNDÁRIOS ────────────────────────────────────────────────────────
  doc.setFillColor(248, 245, 230);
  doc.roundedRect(15, y, pageWidth - 30, 28, 2, 2, "F");
  doc.setDrawColor(...gold);
  doc.setLineWidth(0.4);
  doc.roundedRect(15, y, pageWidth - 30, 28, 2, 2, "S");

  const kpis = [
    { label: "Parcela Mensal Média", value: analysis.parcelaMensalMedia },
    { label: "Reforço Anual Médio",  value: analysis.reforcoAnualMedio },
    { label: "Entradas (70%)",       value: analysis.totalEntradaCliente },
    { label: "Total Parcelas (70%)", value: analysis.totalParcelasCliente },
    { label: "Total Reforços (70%)", value: analysis.totalReforcosCliente },
  ];
  const kpiW = (pageWidth - 30) / kpis.length;
  kpis.forEach((k, i) => {
    const kx = 15 + i * kpiW;
    doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...lightText);
    doc.text(k.label, kx + kpiW / 2, y + 8, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...navy);
    doc.text(k.value, kx + kpiW / 2, y + 17, { align: "center" });
    if (i < kpis.length - 1) {
      doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
      doc.line(kx + kpiW, y + 4, kx + kpiW, y + 24);
    }
  });

  y += 36;

  // ── CENÁRIO DE VENDAS ────────────────────────────────────────────────────────
  y = checkPage(doc, y, 20, pageHeight);
  const LABEL_CENARIO: Record<string, string> = {
    otimista:   "Otimista — 2 cotas/mês",
    realista:   "Realista — 1 cota/mês",
    pessimista: "Conservador — 1 cota a cada 1,5 meses",
  };
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(15, y, pageWidth - 30, 11, 2, 2, "F");
  doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...navy);
  doc.text("Cenário de Vendas:", 20, y + 5);
  doc.setFont("helvetica", "normal"); doc.setTextColor(...gold);
  doc.text(LABEL_CENARIO[analysis.cenario] ?? analysis.cenario, 62, y + 5);
  doc.setTextColor(...lightText); doc.setFontSize(8);
  doc.text(`Prazo até último recebimento: ${analysis.mesUltimoRecebimento} meses`, 20, y + 9);

  y += 18;

  // ── FLUXO DE CAIXA MENSAL ───────────────────────────────────────────────────
  y = checkPage(doc, y, 30, pageHeight);
  doc.setFillColor(...navy);
  doc.roundedRect(15, y, pageWidth - 30, 8, 2, 2, "F");
  doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
  doc.text("FLUXO DE CAIXA MENSAL — SUA PARTE (70%)", 20, y + 5.5);
  y += 12;

  const mesesComMov = analysis.fluxoMensal.filter(m => m.fluxoBruto > 0 || m.fluxoCliente > 0);
  const fluxoData = mesesComMov.map(m => {
    const isYearEnd = m.mes % 12 === 0;
    return [
      isYearEnd ? `Mes ${m.mes}\n(Ano ${m.mes / 12})` : `Mes ${m.mes}`,
      m.entradaMes * 0.7 > 0 ? formatCurrencyPDF(m.entradaMes * 0.7) : "-",
      m.parcelasMes * 0.7 > 0 ? formatCurrencyPDF(m.parcelasMes * 0.7) : "-",
      m.reforcosMes * 0.7 > 0 ? formatCurrencyPDF(m.reforcosMes * 0.7) : "-",
      formatCurrencyPDF(m.fluxoCliente),
      formatCurrencyPDF(m.fluxoClienteAcumulado),
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [["Mes", "Entradas (70%)", "Parcelas (70%)", "Reforcos (70%)", "Total Recebido", "Acumulado"]],
    body: fluxoData,
    theme: "grid",
    headStyles: { fillColor: navy, textColor: [255, 255, 255], fontStyle: "bold", fontSize: 8, halign: "center" },
    bodyStyles: { fontSize: 7, textColor: textColor, cellPadding: 2 },
    alternateRowStyles: { fillColor: [252, 249, 240] },
    columnStyles: {
      0: { cellWidth: 22, fontStyle: "bold", halign: "center" },
      1: { cellWidth: 32, halign: "right" },
      2: { cellWidth: 32, halign: "right" },
      3: { cellWidth: 32, halign: "right" },
      4: { cellWidth: 32, halign: "right", fontStyle: "bold" },
      5: { cellWidth: 32, halign: "right", fontStyle: "bold" },
    },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (data.section === "body") {
        const m = mesesComMov[data.row.index];
        if (m && m.mes % 12 === 0) {
          data.cell.styles.fillColor = navy;
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = "bold";
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  // ── SIMULAÇÃO DE LIQUIDEZ ───────────────────────────────────────────────────
  if (liquidezResult) {
    // Header + bloco 1 juntos (evita header orphan)
    y = checkPage(doc, y, 46, pageHeight);

    // Header
    doc.setFillColor(...gold);
    doc.roundedRect(15, y, pageWidth - 30, 8, 2, 2, "F");
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
    doc.text("SIMULACAO DE LIQUIDEZ ANTECIPADA", 20, y + 5.5);
    y += 12;

    // Bloco 1: Situacao no Momento da Saida
    y = checkPage(doc, y, 26, pageHeight);
    doc.setFillColor(240, 240, 240);
    doc.roundedRect(15, y, pageWidth - 30, 22, 2, 2, "F");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...navy);
    doc.text("Situacao no Momento da Saida", 20, y + 5);

    const sitItems = [
      { label: "Mes de Saida",      value: `Mes ${liquidezResult.mesAtual}` },
      { label: "Prazo Concluido",   value: `${liquidezResult.percentualConcluido.toFixed(1)}%` },
      { label: "Meses Restantes",   value: `${liquidezResult.mesesRestantes} meses` },
      { label: "Ja Recebido",       value: liquidezResult.recebidoAteOMomento },
    ];
    const sitW = (pageWidth - 30) / sitItems.length;
    sitItems.forEach((item, i) => {
      const sx = 15 + i * sitW;
      doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...lightText);
      doc.text(item.label, sx + sitW / 2, y + 11, { align: "center" });
      doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...navy);
      doc.text(item.value, sx + sitW / 2, y + 18, { align: "center" });
      if (i < sitItems.length - 1) {
        doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
        doc.line(sx + sitW, y + 7, sx + sitW, y + 20);
      }
    });
    y += 26;

    // Bloco 2: Composicao Detalhada
    y = checkPage(doc, y, 44, pageHeight);
    doc.setFillColor(252, 249, 240);
    doc.roundedRect(15, y, pageWidth - 30, 38, 2, 2, "F");
    doc.setDrawColor(...gold); doc.setLineWidth(0.4);
    doc.roundedRect(15, y, pageWidth - 30, 38, 2, 2, "S");

    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...navy);
    doc.text("Composicao do Valor Antecipado", 20, y + 6);

    const liqCompLines = [
      { label: "Total de Recebiveis Futuros (a receber do mes " + liquidezResult.mesAtual + " em diante)", value: liquidezResult.totalFluxoFuturo, color: [59, 130, 246] as [number,number,number] },
      { label: "(-) Desconto financeiro aplicado (taxa de desconto sobre o VP)", value: "-" + liquidezResult.descontoAplicado, color: [234, 88, 12] as [number,number,number] },
      { label: "(-) Taxa de Estruturacao Vivant (10% sobre recebiveis futuros)", value: "-" + liquidezResult.taxaEstruturacao, color: [180, 148, 40] as [number,number,number] },
      { label: "(=) VALOR ANTECIPADO LIQUIDO", value: liquidezResult.valorVendaVista, color: [16, 185, 129] as [number,number,number] },
    ];
    const lblX = 20; const valX = pageWidth - 18;
    liqCompLines.forEach((line, i) => {
      const ly = y + 13 + i * 7;
      const isLast = i === liqCompLines.length - 1;
      if (isLast) {
        doc.setFillColor(220, 252, 231);
        doc.rect(15, ly - 3, pageWidth - 30, 7, "F");
        doc.setDrawColor(16, 185, 129); doc.setLineWidth(0.3);
        doc.line(15, ly - 3, pageWidth - 15, ly - 3);
        doc.line(15, ly + 4, pageWidth - 15, ly + 4);
      }
      doc.setFontSize(isLast ? 8.5 : 7.5);
      doc.setFont("helvetica", isLast ? "bold" : "normal");
      doc.setTextColor(...line.color);
      doc.text(line.label, lblX, ly);
      doc.setFont("helvetica", "bold");
      doc.text(line.value, valX, ly, { align: "right" });
    });
    y += 44;

    // Bloco 3: Resultado Final (3 colunas)
    y = checkPage(doc, y, 33, pageHeight);
    doc.setFillColor(236, 253, 245);
    doc.roundedRect(15, y, pageWidth - 30, 28, 2, 2, "F");
    doc.setDrawColor(16, 185, 129); doc.setLineWidth(0.4);
    doc.roundedRect(15, y, pageWidth - 30, 28, 2, 2, "S");

    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...navy);
    doc.text("Resultado Final com Saida Antecipada", 20, y + 6);

    const resItems = [
      { label: "Ja Recebido (ate mes " + liquidezResult.mesAtual + ")", value: liquidezResult.recebidoAteOMomento, color: navy },
      { label: "(+) Valor Antecipado Liquido",                          value: liquidezResult.valorVendaVista,     color: [180, 148, 40] as [number,number,number] },
      { label: "(=) TOTAL RECEBIDO",                                     value: liquidezResult.totalRecebidoComVenda, color: [16, 185, 129] as [number,number,number] },
    ];
    const resW = (pageWidth - 30) / 3;
    resItems.forEach((item, i) => {
      const rx = 15 + i * resW;
      doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...lightText);
      doc.text(item.label, rx + resW / 2, y + 12, { align: "center", maxWidth: resW - 4 });
      doc.setFontSize(i === 2 ? 11 : 9.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...item.color);
      doc.text(item.value, rx + resW / 2, y + 22, { align: "center" });
      if (i < resItems.length - 1) {
        doc.setDrawColor(200, 200, 200); doc.setLineWidth(0.3);
        doc.line(rx + resW, y + 8, rx + resW, y + 26);
      }
    });
    y += 33;
  }

  // ── PARÂMETROS DA ANÁLISE ───────────────────────────────────────────────────
  y = checkPage(doc, y, 45, pageHeight);
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(15, y, pageWidth - 30, 34, 2, 2, "F");
  doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(...navy);
  doc.text("PARÂMETROS DA ANÁLISE", 20, y + 6);
  doc.setFontSize(8); doc.setFont("helvetica", "normal"); doc.setTextColor(...textColor);
  const params = [
    "• Markup: 50% sobre o valor do imovel avaliado pela Vivant",
    "• 6 cotas por imóvel | Entrada: 20% por cota (-5% comissao de venda)",
    "• 40% parcelas mensais (Tabela Price + IPCA) + 40% em 5 reforcos anuais",
    "• Taxa: 1% a.m. (~12,68% a.a.) | Split: 70% proprietario / 30% Vivant",
    "• Custo implantacao: 3% do imovel (adiantado pela Vivant, reembolsado nos 1os recebimentos)",
    "• Valor do imovel condicionado a avaliacao presencial pela equipe Vivant",
  ];
  params.forEach((p, i) => doc.text(p, 20, y + 12 + i * 4));
  y += 43;

  // ── AVISO LEGAL ─────────────────────────────────────────────────────────────
  y = checkPage(doc, y, 30, pageHeight);
  doc.setFillColor(254, 243, 199);
  doc.roundedRect(15, y, pageWidth - 30, 20, 2, 2, "F");
  doc.setFontSize(7); doc.setFont("helvetica", "bold"); doc.setTextColor(146, 64, 14);
  doc.text("AVISO LEGAL", 20, y + 5);
  doc.setFont("helvetica", "normal"); doc.setTextColor(120, 53, 15);
  const aviso = doc.splitTextToSize(
    "Este documento é uma simulação de análise de viabilidade financeira. Os valores são projeções baseadas nos parâmetros informados e no cenário de vendas selecionado, não constituindo garantia de rentabilidade ou velocidade de vendas. O valor do imóvel está sujeito a avaliação pela equipe Vivant.",
    pageWidth - 50
  );
  doc.text(aviso, 20, y + 10);
  y += 28;

  // ── FALE COM UM ESPECIALISTA ────────────────────────────────────────────────
  y = checkPage(doc, y, 52, pageHeight);
  doc.setFillColor(...navy);
  doc.roundedRect(15, y, pageWidth - 30, 8, 2, 2, "F");
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(255, 255, 255);
  doc.text("FALE COM UM ESPECIALISTA VIVANT PARTNERS", 20, y + 5.5);
  y += 12;

  doc.setFillColor(245, 248, 252);
  doc.roundedRect(15, y, pageWidth - 30, 28, 2, 2, "F");
  doc.setDrawColor(...navy); doc.setLineWidth(0.4);
  doc.roundedRect(15, y, pageWidth - 30, 28, 2, 2, "S");

  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(...textColor);
  doc.text(
    "Nossa equipe está pronta para apresentar sua proposta personalizada e tirar todas as suas dúvidas.",
    pageWidth / 2, y + 7, { align: "center", maxWidth: pageWidth - 40 }
  );

  const cx = pageWidth / 2 - 52;
  const iconSz = 5;
  const ty2 = y + 12;
  const ey2 = y + 20;

  if (phoneIconBase64) doc.addImage(phoneIconBase64, "PNG", cx, ty2 - 0.5, iconSz, iconSz);
  doc.setFontSize(9.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...navy);
  doc.text("Tel:", cx + iconSz + 2, ty2 + 3.5);
  doc.setFont("helvetica", "normal"); doc.setTextColor(...textColor);
  doc.text("(44) 99969-1196", cx + iconSz + 13, ty2 + 3.5);

  if (emailIconBase64) doc.addImage(emailIconBase64, "PNG", cx, ey2 - 0.5, iconSz, iconSz);
  doc.setFontSize(9.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...navy);
  doc.text("E-mail:", cx + iconSz + 2, ey2 + 3.5);
  doc.setFont("helvetica", "normal"); doc.setTextColor(...textColor);
  doc.text("parceiros@vivantresidences.com.br", cx + iconSz + 18, ey2 + 3.5);

  // ── NUMERAÇÃO DE PÁGINAS ────────────────────────────────────────────────────
  addPageNumbers(doc);

  const nome = leadData
    ? `Proposta_Partners_${leadData.nome.replace(/\s+/g, "_")}.pdf`
    : `Proposta_Partners_${Date.now()}.pdf`;
  doc.save(nome);
}

/**
 * Formata valor numérico para moeda (uso interno dos PDFs)
 */
function formatCurrencyPDF(value: number): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
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
