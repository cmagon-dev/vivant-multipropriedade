import jsPDF from "jspdf";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface DestinoFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface PropertyPDFData {
  name: string;
  slug: string;
  location: string;
  cidade: string;
  description: string;
  status: string;
  price: string;
  monthlyFee: string;
  weeks: string;
  fraction: string;
  appreciation: string | null;
  bedrooms: number;
  bathrooms: number;
  area: number;
  condominio: string | null;
  type: string;
  features: string[];
  images: string[];
  destino: {
    name: string;
    emoji: string;
    description: string | null;
    climate: string | null;
    features: DestinoFeature[] | null;
  } | null;
}

// ─── Paleta Vivant ────────────────────────────────────────────────────────────

const C = {
  navy:      [26, 47, 75]    as [number, number, number],
  gold:      [180, 148, 40]  as [number, number, number],
  green:     [16, 185, 129]  as [number, number, number],
  text:      [51, 65, 85]    as [number, number, number],
  textLight: [100, 116, 139] as [number, number, number],
  bg:        [248, 249, 250] as [number, number, number],
  white:     [255, 255, 255] as [number, number, number],
  blue:      [37, 99, 235]   as [number, number, number],
};

// ─── Helpers gerais ───────────────────────────────────────────────────────────

/** Remove emoji e caracteres fora de Latin-1 de uma string */
function safe(str: string | null | undefined): string {
  if (!str) return "";
  return str
    .replace(/[\uD800-\uDFFF]/g, "") // surrogate pairs (emojis)
    .replace(/[\u2600-\u27FF]/g, "")
    .replace(/[^\x00-\xFF]/g, "")
    .trim();
}

/** Strip HTML → texto puro */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Garante espaço na página atual; adiciona nova página se necessário */
function checkPage(doc: jsPDF, y: number, needed: number, pageH: number, topMargin = 20): number {
  if (y + needed > pageH - 18) {
    doc.addPage();
    return topMargin;
  }
  return y;
}

/** Status → label legível */
function statusLabel(status: string): string {
  const map: Record<string, string> = {
    DISPONIVEL:     "Disponivel",
    ULTIMAS_COTAS:  "Ultimas Cotas",
    PRE_LANCAMENTO: "Pre-Lancamento",
    VENDIDO:        "Vendido",
  };
  return map[status] ?? status;
}

/** Status → cor */
function statusColor(status: string): [number, number, number] {
  const map: Record<string, [number, number, number]> = {
    DISPONIVEL:     [16, 185, 129],
    ULTIMAS_COTAS:  [234, 88, 12],
    PRE_LANCAMENTO: [59, 130, 246],
    VENDIDO:        [100, 116, 139],
  };
  return map[status] ?? C.green;
}

// ─── Helpers de imagem ────────────────────────────────────────────────────────

async function loadImageBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("canvas indisponivel")); return; }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

async function loadLogoWhite(url: string): Promise<string> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(blob);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("canvas indisponivel")); return; }
      ctx.drawImage(img, 0, 0);
      const d = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < d.data.length; i += 4) {
        if (d.data[i + 3] > 0) {
          d.data[i] = 255; d.data[i + 1] = 255; d.data[i + 2] = 255;
        }
      }
      ctx.putImageData(d, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = reject;
    img.src = objectUrl;
  });
}

// ─── Helpers visuais (substitutos de emoji/ícone) ─────────────────────────────

/** Pequeno quadrado colorido como marcador de bullet */
function drawBulletSquare(doc: jsPDF, x: number, y: number, color: [number,number,number] = C.gold): void {
  doc.setFillColor(...color);
  doc.rect(x, y - 2.2, 2.2, 2.2, "F");
}

/** Círculo colorido como indicador */
function drawDot(doc: jsPDF, x: number, y: number, r: number, color: [number,number,number]): void {
  doc.setFillColor(...color);
  doc.circle(x, y, r, "F");
}

/** Ícone de pin de localização (triângulo + círculo) em miniatura */
function drawPinIcon(doc: jsPDF, x: number, y: number, color: [number,number,number] = C.gold): void {
  doc.setFillColor(...color);
  doc.circle(x + 1.5, y - 1.5, 1.5, "F");
  doc.setFillColor(...color);
  // "ponta" do pin como triângulo simples
  doc.triangle(x + 0.2, y - 0.5, x + 2.8, y - 0.5, x + 1.5, y + 1.2, "F");
}

/** Linha decorativa dourada */
function drawGoldLine(doc: jsPDF, x1: number, y: number, x2: number): void {
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.line(x1, y, x2, y);
}

/** Header de seção com fundo navy */
function drawSectionHeader(doc: jsPDF, y: number, label: string, pw: number, color: [number,number,number] = C.navy): number {
  doc.setFillColor(...color);
  doc.roundedRect(14, y, pw - 28, 8, 1.5, 1.5, "F");
  doc.setFontSize(10.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.white);
  doc.text(label, 20, y + 5.5);
  return y + 13;
}

/** Rodapé de todas as páginas */
function addPageNumbers(doc: jsPDF): void {
  const total = (doc as any).internal.getNumberOfPages();
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFillColor(...C.navy);
    doc.rect(0, ph - 10, pw, 10, "F");
    doc.setFillColor(...C.gold);
    doc.rect(0, ph - 10, 3, 10, "F");
    doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.white);
    doc.text("Vivant Residences  |  vivantresidences.com.br", 8, ph - 3.5);
    doc.text(`${i} / ${total}`, pw - 8, ph - 3.5, { align: "right" });
  }
}

// ─── Função principal ─────────────────────────────────────────────────────────

export async function generatePropertyPresentation(data: PropertyPDFData): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();

  // ── Pré-carrega recursos assíncronos ──────────────────────────────────────
  let logoBase64 = "";
  let heroBase64 = "";
  const galleryBase64: string[] = [];

  const validImages = data.images.filter(
    (u) => u && !u.endsWith("/placeholder-house.jpg") && !u.endsWith("/placeholder-apt.jpg")
  );

  try {
    logoBase64 = await loadLogoWhite("/logo-vivant.png");
  } catch {
    try { logoBase64 = await loadLogoWhite("/logo-vivant-capital.png"); } catch { /* texto fallback */ }
  }

  if (validImages.length > 0) {
    try { heroBase64 = await loadImageBase64(validImages[0]); } catch { /* sem hero */ }
    for (const url of validImages.slice(1, 7)) {
      try { galleryBase64.push(await loadImageBase64(url)); } catch { /* pula */ }
    }
  }

  let y = 0;

  // ════════════════════════════════════════════════════════════════════════════
  // SEÇÃO 1 — CAPA
  // ════════════════════════════════════════════════════════════════════════════

  // Fundo navy + faixa dourada
  doc.setFillColor(...C.navy);
  doc.rect(0, 0, pw, 44, "F");
  doc.setFillColor(...C.gold);
  doc.rect(0, 42, pw, 2, "F");

  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", (pw - 58) / 2, 11, 58, 20);
  } else {
    doc.setTextColor(...C.white);
    doc.setFontSize(20); doc.setFont("helvetica", "bold");
    doc.text("VIVANT RESIDENCES", pw / 2, 20, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "normal");
    doc.text("Multipropriedade Inteligente", pw / 2, 30, { align: "center" });
  }

  // Hero image
  if (heroBase64) {
    const heroH = 62;
    doc.addImage(heroBase64, "JPEG", 0, 44, pw, heroH);
    // Overlay escuro na base da imagem para contraste do texto
    doc.setFillColor(0, 0, 0);
    doc.setGState(new (doc as any).GState({ opacity: 0.35 }));
    doc.rect(0, 44 + heroH - 24, pw, 24, "F");
    doc.setGState(new (doc as any).GState({ opacity: 1 }));
    y = 44 + heroH + 5;
  } else {
    doc.setFillColor(...C.bg);
    doc.rect(0, 44, pw, 28, "F");
    y = 78;
  }

  // Badge de status
  const badgeColor = statusColor(data.status);
  const badgeLabel = statusLabel(data.status);
  const badgeW = doc.getTextWidth(badgeLabel) + 8;
  doc.setFillColor(...badgeColor);
  doc.roundedRect(pw - badgeW - 14, y, badgeW, 6.5, 1.5, 1.5, "F");
  doc.setFontSize(7.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.white);
  doc.text(badgeLabel, pw - badgeW / 2 - 14, y + 4.5, { align: "center" });

  // Nome
  doc.setFontSize(20); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.navy);
  const nameLines = doc.splitTextToSize(safe(data.name), pw - 40);
  doc.text(nameLines, 14, y + 13);
  y += nameLines.length * 8 + 14;

  // Localização com pin visual
  drawPinIcon(doc, 14, y, C.gold);
  doc.setFontSize(9.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textLight);
  doc.text(`${safe(data.location)}  -  ${safe(data.cidade)}`, 20, y);
  y += 6;

  // Destino
  if (data.destino) {
    drawDot(doc, 15.5, y - 1, 1.5, C.gold);
    doc.setFontSize(9); doc.setFont("helvetica", "italic"); doc.setTextColor(...C.gold);
    doc.text(`Destino: ${safe(data.destino.name)}`, 20, y);
    y += 6;
  }

  // Data de geração
  doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textLight);
  const dataGeracao = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  doc.text(`Apresentacao gerada em ${dataGeracao}`, pw - 14, y, { align: "right" });
  y += 6;

  drawGoldLine(doc, 14, y, pw - 14);
  y += 8;

  // ════════════════════════════════════════════════════════════════════════════
  // SEÇÃO 2 — FICHA TÉCNICA
  // ════════════════════════════════════════════════════════════════════════════

  y = checkPage(doc, y, 55, ph);
  y = drawSectionHeader(doc, y, "FICHA TECNICA DA PROPRIEDADE", pw);

  // 4 cards principais
  const cards4 = [
    { label: "Suites",    value: String(data.bedrooms)  },
    { label: "Banheiros", value: String(data.bathrooms) },
    { label: "Area",      value: `${data.area} m2`      },
    { label: "Fracao",    value: safe(data.fraction)    },
  ];
  const c4w = (pw - 28 - 9) / 4;
  cards4.forEach((card, i) => {
    const cx = 14 + i * (c4w + 3);
    doc.setFillColor(...C.bg);
    doc.roundedRect(cx, y, c4w, 22, 2, 2, "F");
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.4);
    doc.roundedRect(cx, y, c4w, 22, 2, 2, "S");
    doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.navy);
    doc.text(card.value, cx + c4w / 2, y + 10, { align: "center" });
    doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textLight);
    doc.text(card.label, cx + c4w / 2, y + 17, { align: "center" });
  });
  y += 27;

  // 3 dados secundários
  const sec3 = [
    { label: "Semanas/Ano", value: `${safe(data.weeks)} semanas` },
    { label: "Tipo",        value: safe(data.type)               },
    { label: "Condominio",  value: safe(data.condominio) || "-"  },
  ];
  const s3w = (pw - 28 - 6) / 3;
  sec3.forEach((item, i) => {
    const sx = 14 + i * (s3w + 3);
    doc.setFillColor(238, 241, 246);
    doc.roundedRect(sx, y, s3w, 14, 2, 2, "F");
    doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textLight);
    doc.text(item.label, sx + s3w / 2, y + 4.5, { align: "center" });
    doc.setFontSize(9); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.navy);
    const sl = doc.splitTextToSize(item.value, s3w - 4);
    doc.text(sl[0], sx + s3w / 2, y + 10.5, { align: "center" });
  });
  y += 20;

  // ════════════════════════════════════════════════════════════════════════════
  // SEÇÃO 3 — GALERIA DE FOTOS
  // ════════════════════════════════════════════════════════════════════════════

  if (galleryBase64.length > 0) {
    y = checkPage(doc, y, 20, ph);
    y = drawSectionHeader(doc, y, "GALERIA DE FOTOS", pw);

    const colW = (pw - 28 - 4) / 2;
    const imgH = 42;
    const totalRows = Math.ceil(galleryBase64.length / 2);

    for (let row = 0; row < totalRows; row++) {
      y = checkPage(doc, y, imgH + 4, ph);
      for (let col = 0; col < 2; col++) {
        const idx = row * 2 + col;
        if (idx >= galleryBase64.length) break;
        const ix = 14 + col * (colW + 4);
        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.3);
        doc.roundedRect(ix, y, colW, imgH, 1.5, 1.5, "S");
        try {
          doc.addImage(galleryBase64[idx], "JPEG", ix, y, colW, imgH);
        } catch { /* imagem invalida */ }
      }
      y += imgH + 4;
    }
    y += 2;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SEÇÃO 4 — SOBRE A PROPRIEDADE
  // ════════════════════════════════════════════════════════════════════════════

  const descText = safe(stripHtml(data.description));
  if (descText) {
    y = checkPage(doc, y, 30, ph);
    y = drawSectionHeader(doc, y, "SOBRE A PROPRIEDADE", pw);

    const descLines = doc.splitTextToSize(descText, pw - 44);
    const descBlockH = descLines.length * 4.5 + 10;

    y = checkPage(doc, y, Math.min(descBlockH, 60), ph);
    doc.setFillColor(...C.bg);
    doc.roundedRect(14, y, pw - 28, descBlockH, 2, 2, "F");
    doc.setFillColor(...C.gold);
    doc.rect(14, y, 3, descBlockH, "F");

    doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.text);
    let dy = y + 6;
    for (const line of descLines) {
      dy = checkPage(doc, dy, 5, ph);
      doc.text(line, 22, dy);
      dy += 4.5;
    }
    y = dy + 8;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SEÇÃO 5 — COMODIDADES E DIFERENCIAIS
  // ════════════════════════════════════════════════════════════════════════════

  if (data.features && data.features.length > 0) {
    y = checkPage(doc, y, 20, ph);
    y = drawSectionHeader(doc, y, "COMODIDADES E DIFERENCIAIS", pw);

    const colW2 = (pw - 28 - 4) / 2;
    const rowH = 7.5;
    const rows = Math.ceil(data.features.length / 2);
    const blockH = rows * rowH + 8;

    y = checkPage(doc, y, blockH, ph);
    doc.setFillColor(...C.bg);
    doc.roundedRect(14, y, pw - 28, blockH, 2, 2, "F");

    data.features.forEach((feat, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const fx = 14 + col * (colW2 + 4) + 6;
      const fy = y + 5 + row * rowH;

      drawBulletSquare(doc, fx, fy, C.gold);
      doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.text);
      const fLines = doc.splitTextToSize(safe(feat), colW2 - 12);
      doc.text(fLines[0], fx + 4, fy);
    });
    y += blockH + 8;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SEÇÃO 6 — INVESTIMENTO — A SUA COTA
  // ════════════════════════════════════════════════════════════════════════════

  y = checkPage(doc, y, 56, ph);
  y = drawSectionHeader(doc, y, "INVESTIMENTO  -  A SUA COTA", pw, C.gold);

  // Card preço
  doc.setFillColor(...C.navy);
  doc.roundedRect(14, y, pw - 28, 22, 3, 3, "F");
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.8);
  doc.roundedRect(14, y, pw - 28, 22, 3, 3, "S");
  doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(190, 200, 215);
  doc.text("Investimento total da cota", pw / 2, y + 7, { align: "center" });
  doc.setFontSize(22); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.gold);
  doc.text(safe(data.price), pw / 2, y + 17, { align: "center" });
  y += 27;

  // 3 métricas
  const metrics = [
    { label: "Taxa Mensal",       value: safe(data.monthlyFee)           },
    { label: "Semanas Incluidas", value: `${safe(data.weeks)} sem/ano`   },
    { label: "Valorizacao",       value: safe(data.appreciation) || "-"  },
  ];
  const mW = (pw - 28 - 6) / 3;
  metrics.forEach((m, i) => {
    const mx = 14 + i * (mW + 3);
    doc.setFillColor(...C.bg);
    doc.roundedRect(mx, y, mW, 16, 2, 2, "F");
    doc.setDrawColor(...C.gold);
    doc.setLineWidth(0.3);
    doc.roundedRect(mx, y, mW, 16, 2, 2, "S");
    doc.setFontSize(7); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textLight);
    doc.text(m.label, mx + mW / 2, y + 5, { align: "center" });
    doc.setFontSize(9.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.navy);
    const ml = doc.splitTextToSize(m.value, mW - 4);
    doc.text(ml[0], mx + mW / 2, y + 12, { align: "center" });
  });
  y += 22;

  // ── Condições de pagamento (destaque visual) ─────────────────────────────
  y = checkPage(doc, y, 38, ph);

  // Título da seção de pagamento
  doc.setFillColor(26, 47, 75);
  doc.roundedRect(14, y, pw - 28, 7, 1.5, 1.5, "F");
  doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.white);
  doc.text("CONDICOES DE PAGAMENTO", pw / 2, y + 5, { align: "center" });
  y += 10;

  // 2 pilares lado a lado
  const payW = (pw - 28 - 4) / 2;

  // Pilar 1 — Entrada
  doc.setFillColor(255, 251, 235);
  doc.roundedRect(14, y, payW, 22, 2, 2, "F");
  doc.setDrawColor(...C.gold);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, payW, 22, 2, 2, "S");
  doc.setFillColor(...C.gold);
  doc.roundedRect(14, y, payW, 7, 2, 2, "F");
  doc.rect(14, y + 5, payW, 2, "F"); // quadrado no fundo arredondado
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.white);
  doc.text("ENTRADA FACILITADA", 14 + payW / 2, y + 5, { align: "center" });
  doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(120, 80, 0);
  const pay1Lines = [
    "Permuta de imoveis",
    "Cartao de credito",
    "Parcelamento negociavel",
  ];
  pay1Lines.forEach((line, i) => {
    drawBulletSquare(doc, 18, y + 11 + i * 4.5, C.gold);
    doc.text(line, 23, y + 11 + i * 4.5);
  });

  // Pilar 2 — Saldo
  const p2x = 14 + payW + 4;
  doc.setFillColor(235, 245, 255);
  doc.roundedRect(p2x, y, payW, 22, 2, 2, "F");
  doc.setDrawColor(...C.navy);
  doc.setLineWidth(0.5);
  doc.roundedRect(p2x, y, payW, 22, 2, 2, "S");
  doc.setFillColor(...C.navy);
  doc.roundedRect(p2x, y, payW, 7, 2, 2, "F");
  doc.rect(p2x, y + 5, payW, 2, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.white);
  doc.text("SALDO PARCELADO", p2x + payW / 2, y + 5, { align: "center" });
  doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(30, 50, 90);
  const pay2Lines = [
    "Saldo em ate 60 parcelas",
    "Reforcos anuais ou semestrais",
    "Condicoes sob consulta",
  ];
  pay2Lines.forEach((line, i) => {
    drawBulletSquare(doc, p2x + 4, y + 11 + i * 4.5, C.navy);
    doc.text(line, p2x + 9, y + 11 + i * 4.5);
  });

  y += 26;

  // Frase âncora com bullet visual
  y = checkPage(doc, y, 13, ph);
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(14, y, pw - 28, 10, 2, 2, "F");
  doc.setFillColor(...C.green);
  doc.rect(14, y, 3, 10, "F");
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(10, 130, 95);
  doc.text(
    "Propriedade premium com fracao garantida em escritura  |  Registrado em cartorio  |  Escritura em seu nome.",
    pw / 2, y + 6.5, { align: "center", maxWidth: pw - 40 }
  );
  y += 16;

  // ════════════════════════════════════════════════════════════════════════════
  // SEÇÃO 7 — O DESTINO
  // ════════════════════════════════════════════════════════════════════════════

  if (data.destino) {
    y = checkPage(doc, y, 35, ph);
    y = drawSectionHeader(doc, y, `O DESTINO  |  ${safe(data.destino.name).toUpperCase()}`, pw);

    // Descrição do destino
    if (data.destino.description) {
      const dText = safe(data.destino.description);
      const dLines = doc.splitTextToSize(dText, pw - 36);
      const dH = dLines.length * 4.5 + 10;
      y = checkPage(doc, y, dH, ph);
      doc.setFillColor(245, 247, 252);
      doc.roundedRect(14, y, pw - 28, dH, 2, 2, "F");
      doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.text);
      let dy2 = y + 6;
      for (const line of dLines) { doc.text(line, 20, dy2); dy2 += 4.5; }
      y += dH + 6;
    }

    // Clima
    if (data.destino.climate) {
      y = checkPage(doc, y, 16, ph);
      doc.setFillColor(232, 244, 253);
      doc.roundedRect(14, y, pw - 28, 13, 2, 2, "F");
      // Ícone visual de clima: pequeno sol desenhado
      doc.setFillColor(234, 179, 8);
      doc.circle(21, y + 6.5, 2.5, "F");

      doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.navy);
      doc.text("Clima:", 26, y + 5.5);
      doc.setFont("helvetica", "normal"); doc.setTextColor(...C.text);
      const climaLines = doc.splitTextToSize(safe(data.destino.climate), pw - 55);
      doc.text(climaLines[0], 42, y + 5.5);
      if (climaLines.length > 1) doc.text(climaLines[1], 26, y + 10);
      y += 17;
    }

    // Features do destino (até 2)
    if (data.destino.features && data.destino.features.length > 0) {
      const feats = data.destino.features.slice(0, 2);
      const fBlockW = feats.length === 2 ? (pw - 28 - 4) / 2 : pw - 28;
      y = checkPage(doc, y, 26, ph);

      feats.forEach((feat, i) => {
        const fx = 14 + i * (fBlockW + 4);
        doc.setFillColor(...C.bg);
        doc.roundedRect(fx, y, fBlockW, 22, 2, 2, "F");
        doc.setDrawColor(...C.gold);
        doc.setLineWidth(0.3);
        doc.roundedRect(fx, y, fBlockW, 22, 2, 2, "S");
        // Dot indicador
        drawDot(doc, fx + 5, y + 6, 2, C.gold);
        doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.navy);
        doc.text(safe(feat.title), fx + 10, y + 7);
        doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textLight);
        const descLines = doc.splitTextToSize(safe(feat.desc), fBlockW - 14);
        descLines.slice(0, 2).forEach((line: string, li: number) => {
          doc.text(line, fx + 10, y + 13 + li * 4.5);
        });
      });
      y += 28;
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SEÇÃO 8 — SOBRE A VIVANT — O MODELO
  // ════════════════════════════════════════════════════════════════════════════

  y = checkPage(doc, y, 15, ph);
  y = drawSectionHeader(doc, y, "SOBRE A VIVANT  |  MULTIPROPRIEDADE INTELIGENTE", pw, C.gold);

  // Parágrafo de apresentação
  y = checkPage(doc, y, 22, ph);
  const vivantDesc = "A Vivant e uma gestora de multipropriedade de alto padrao que seleciona, estrutura e administra residencias em destinos exclusivos pelo Brasil. Com gestao profissional e seguranca juridica, ela transforma o sonho da segunda residencia em um investimento acessivel e valorizado.";
  const vivantLines = doc.splitTextToSize(vivantDesc, pw - 36);
  const vivantH = vivantLines.length * 4.5 + 10;
  doc.setFillColor(245, 247, 252);
  doc.roundedRect(14, y, pw - 28, vivantH, 2, 2, "F");
  doc.setFontSize(8.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.text);
  let vy = y + 6;
  for (const line of vivantLines) { doc.text(line, 20, vy); vy += 4.5; }
  y += vivantH + 6;

  // Como funciona — 4 cards em grid 2x2
  const bullets = [
    { label: "Cota de Propriedade",    desc: `Voce adquire ${safe(data.fraction)} do imovel - registrado em cartorio em seu nome, com todas as garantias juridicas.` },
    { label: "Semanas Garantidas",      desc: `${safe(data.weeks)} semanas por ano de uso exclusivo, com calendario flexivel gerenciado pela Vivant Care.`             },
    { label: "Gestao Profissional",     desc: "A Vivant cuida de toda a manutencao, limpeza, reforma e administracao do imovel. Voce so aproveita."                   },
    { label: "Valorizacao Patrimonial", desc: "Imoveis em destinos turisticos selecionados com alto potencial de apreciacao ao longo do tempo."                       },
  ];

  const bW = (pw - 28 - 4) / 2;
  const bH = 20;
  const bColors: [number,number,number][] = [C.navy, C.gold, C.green, [147, 51, 234]];

  y = checkPage(doc, y, bH * 2 + 7, ph);

  bullets.forEach((b, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const bx = 14 + col * (bW + 4);
    const by = y + row * (bH + 3);

    doc.setFillColor(...C.bg);
    doc.roundedRect(bx, by, bW, bH, 2, 2, "F");
    doc.setFillColor(...bColors[i]);
    doc.rect(bx, by, 3, bH, "F");


    doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...bColors[i]);
    doc.text(b.label, bx + 7, by + 7);
    doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textLight);
    const bLines = doc.splitTextToSize(b.desc, bW - 12);
    bLines.slice(0, 2).forEach((line: string, li: number) => {
      doc.text(line, bx + 7, by + 12.5 + li * 4.5);
    });
  });

  y += 2 * (bH + 3) + 6;

  // 2 boxes: "O que está incluso" e "Por que a Vivant"
  y = checkPage(doc, y, 42, ph);
  const box1Items = ["Concierge e suporte 24h", "Manutencao e limpeza incluidas", "Calendario de uso flexivel", "Comunidade de cotistas exclusiva"];
  const box2Items = ["Mais de 10 destinos exclusivos no Brasil", "Seguranca juridica e escritura publica", "Equipe especializada em multipropriedade", "Historico comprovado de valorizacao"];
  const boxW = (pw - 28 - 4) / 2;

  const boxes = [
    { items: box1Items, title: "O QUE ESTA INCLUSO", bg: [236, 253, 245] as [number,number,number], border: C.green },
    { items: box2Items, title: "POR QUE A VIVANT",   bg: [232, 239, 255] as [number,number,number], border: C.navy },
  ];

  boxes.forEach((box, bi) => {
    const bx2 = 14 + bi * (boxW + 4);
    const bH2 = box.items.length * 6.5 + 14;
    doc.setFillColor(...box.bg);
    doc.roundedRect(bx2, y, boxW, bH2, 2, 2, "F");
    doc.setDrawColor(...box.border);
    doc.setLineWidth(0.4);
    doc.roundedRect(bx2, y, boxW, bH2, 2, 2, "S");
    doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(...box.border);
    doc.text(box.title, bx2 + boxW / 2, y + 7, { align: "center" });
    box.items.forEach((item, ii) => {
      drawBulletSquare(doc, bx2 + 6, y + 13 + ii * 6.5, box.border);
      doc.setFontSize(7.5); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.text);
      doc.text(item, bx2 + 11, y + 13 + ii * 6.5);
    });
  });

  y += box1Items.length * 6.5 + 14 + 8;

  // ════════════════════════════════════════════════════════════════════════════
  // SEÇÃO 9 — CONTATO E PRÓXIMOS PASSOS
  // ════════════════════════════════════════════════════════════════════════════

  y = checkPage(doc, y, 58, ph);
  y = drawSectionHeader(doc, y, "PRONTO PARA GARANTIR SUA COTA?", pw);

  doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(...C.textLight);
  doc.text(
    "Nossos especialistas estao prontos para esclarecer todas as suas duvidas e apresentar as condicoes completas.",
    pw / 2, y, { align: "center", maxWidth: pw - 36 }
  );
  y += 12;

  // Card de contato
  y = checkPage(doc, y, 36, ph);
  doc.setFillColor(245, 248, 252);
  doc.roundedRect(14, y, pw - 28, 32, 3, 3, "F");
  doc.setDrawColor(...C.navy);
  doc.setLineWidth(0.5);
  doc.roundedRect(14, y, pw - 28, 32, 3, 3, "S");

  // Linha dourada decorativa esquerda
  doc.setFillColor(...C.gold);
  doc.rect(14, y, 3, 32, "F");

  const contactRows = [
    { label: "Telefone / WhatsApp:", value: "(44) 99969-1196",                    dotColor: C.green },
    { label: "E-mail:",              value: "contato@vivantresidences.com.br",    dotColor: C.navy  },
    { label: "WhatsApp link:",       value: "wa.me/5544999691196",                dotColor: [37, 99, 235] as [number,number,number] },
    { label: "Site:",                value: `vivantresidences.com.br/casas/${safe(data.slug)}`, dotColor: C.textLight },
  ];

  contactRows.forEach((row, i) => {
    const cy = y + 7 + i * 7;
    drawDot(doc, 21, cy - 0.5, 1.2, row.dotColor);
    doc.setFontSize(8.5); doc.setFont("helvetica", "bold"); doc.setTextColor(...C.navy);
    doc.text(row.label, 26, cy);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(i === 2 || i === 3 ? C.blue[0] : C.text[0], i === 2 || i === 3 ? C.blue[1] : C.text[1], i === 2 || i === 3 ? C.blue[2] : C.text[2]);
    doc.text(row.value, 26 + doc.getTextWidth(row.label) + 2, cy);
  });

  y += 40;

  // ── Numeração e rodapé ──────────────────────────────────────────────────────
  addPageNumbers(doc);

  doc.save(`Vivant_Apresentacao_${safe(data.slug)}.pdf`);
}
