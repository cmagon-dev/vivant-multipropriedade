import * as XLSX from "xlsx";
import type { OfficialWeekType, WeekTier } from "@prisma/client";

/** Rótulo fixo do slot de distribuição criado pela importação da planilha. */
export const CALENDAR_IMPORT_SLOT_LABEL = "Importação planilha";

export type ParsedCalendarRow = {
  weekIndex: number;
  startDate: string;
  endDate: string;
  tier: WeekTier;
  officialWeekType: OfficialWeekType;
  description: string | null;
  cotaCode: "A" | "B" | "C" | "D" | "E" | "F" | "EXTRA";
  isExtra: boolean;
  lastUseNote: string | null;
};

export type CalendarImportPreview = {
  totalWeeks: number;
  extraCount: number;
  byCota: Record<string, number>;
  yearsInSheet: number[];
  cotaLettersNeeded: string[];
};

export type CalendarValidationResult =
  | {
      ok: true;
      rows: ParsedCalendarRow[];
      preview: CalendarImportPreview;
      warnings: string[];
    }
  | {
      ok: false;
      errors: string[];
      warnings: string[];
      preview?: Partial<CalendarImportPreview>;
    };

function stripAccents(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function normalizeHeader(h: string): string {
  return stripAccents(h.trim().toLowerCase()).replace(/\s+/g, " ");
}

/** Encontra índice da coluna pelo primeiro header que casa com qualquer alias. */
function pickColumnIndex(
  headers: string[],
  aliases: string[]
): number {
  const norm = headers.map((h) => normalizeHeader(String(h ?? "")));
  for (const a of aliases) {
    const na = normalizeHeader(a);
    const i = norm.findIndex((h) => h === na || h.includes(na) || na.includes(h));
    if (i >= 0) return i;
  }
  return -1;
}

function parseTier(raw: string): WeekTier | null {
  const s = stripAccents(raw.trim().toLowerCase());
  if (s === "gold" || s === "ouro") return "GOLD";
  if (s === "silver" || s === "prata") return "SILVER";
  if (s === "black" || s === "preto") return "BLACK";
  return null;
}

function parseCotaCode(raw: string): ParsedCalendarRow["cotaCode"] | null {
  const s = stripAccents(raw.trim());
  const u = s.toUpperCase();
  if (u === "EXTRA" || u === "EXTRA ") return "EXTRA";
  if (/^[A-F]$/.test(u)) return u as ParsedCalendarRow["cotaCode"];
  return null;
}

function excelCellToDate(value: unknown): Date | null {
  if (value == null || value === "") return null;
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  if (typeof value === "number") {
    const d = XLSX.SSF.parse_date_code(value);
    if (!d) return null;
    return new Date(Date.UTC(d.y, d.m - 1, d.d));
  }
  if (typeof value === "string") {
    const t = Date.parse(value);
    if (!isNaN(t)) return new Date(t);
  }
  return null;
}

function startOfDayUtc(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0));
}

function endOfDayUtc(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999));
}

/**
 * Extrai letra A–F de `numeroCota` da propriedade (ex.: "A", "Cota A", "cota b").
 */
export function letterFromNumeroCota(numeroCota: string): string | null {
  const u = stripAccents(numeroCota.trim()).toUpperCase();
  const direct = u.match(/^([A-F])$/);
  if (direct) return direct[1];
  const cotaWord = u.match(/COTA\s*[:\s]?\s*([A-F])\b/);
  if (cotaWord) return cotaWord[1];
  return null;
}

/**
 * Lê buffer Excel (.xlsx) e devolve linhas brutas (array de células por linha).
 */
export function readExcelSheetRows(buffer: ArrayBuffer): string[][] {
  const wb = XLSX.read(buffer, { type: "array", cellDates: true, cellNF: false, cellText: false });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return [];
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<(string | number | boolean | Date | null | undefined)[]>(
    sheet,
    { header: 1, defval: "", raw: true }
  ) as unknown[][];
  return rows.map((r) => (Array.isArray(r) ? r.map((c) => (c == null ? "" : String(c))) : []));
}

/**
 * Valida e transforma linhas da planilha em `ParsedCalendarRow[]`.
 */
export function validateCalendarRows(
  table: string[][],
  expectedYear: number
): CalendarValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!table.length) {
    return { ok: false, errors: ["Planilha vazia."], warnings };
  }

  const headerRowIdx = table.findIndex((row) =>
    row.some((c) => /semana|categoria|evento|início|inicio|fim|cotas/i.test(String(c)))
  );
  if (headerRowIdx < 0) {
    return {
      ok: false,
      errors: [
        "Cabeçalho não encontrado. Inclua colunas: Semana, Início, Fim, Categoria, Evento, Cotas.",
      ],
      warnings,
    };
  }

  const headers = table[headerRowIdx] ?? [];
  const ix = {
    week: pickColumnIndex(headers, ["Semana", "Nº semana", "Semana "]),
    start: pickColumnIndex(headers, [
      "Início (quinta)",
      "Início",
      "Inicio (quinta)",
      "Inicio",
    ]),
    end: pickColumnIndex(headers, ["Fim (quarta)", "Fim"]),
    category: pickColumnIndex(headers, ["Categoria"]),
    event: pickColumnIndex(headers, ["Evento"]),
    cotas: pickColumnIndex(headers, ["Cotas", "Cota"]),
    lastUse: pickColumnIndex(headers, ["Tempo do último Uso", "Tempo do ultimo uso"]),
  };

  if (ix.week < 0) errors.push("Coluna obrigatória ausente: Semana.");
  if (ix.start < 0) errors.push("Coluna obrigatória ausente: Início (quinta).");
  if (ix.end < 0) errors.push("Coluna obrigatória ausente: Fim (quarta).");
  if (ix.category < 0) errors.push("Coluna obrigatória ausente: Categoria.");
  if (ix.event < 0) errors.push("Coluna obrigatória ausente: Evento.");
  if (ix.cotas < 0) errors.push("Coluna obrigatória ausente: Cotas.");
  if (errors.length) return { ok: false, errors, warnings };

  const rows: ParsedCalendarRow[] = [];
  const yearsSet = new Set<number>();
  const cotaNeed = new Set<string>();

  for (let r = headerRowIdx + 1; r < table.length; r++) {
    const line = table[r];
    if (!line || !line.some((c) => String(c).trim())) continue;

    const rawWeek = line[ix.week];
    const weekNum = parseInt(String(rawWeek).replace(/\D/g, ""), 10);
    if (!Number.isFinite(weekNum) || weekNum < 1 || weekNum > 53) {
      errors.push(`Linha ${r + 1}: Semana inválida (${rawWeek}).`);
      continue;
    }

    const startRaw = line[ix.start];
    const endRaw = line[ix.end];
    const startD =
      excelCellToDate(
        typeof startRaw === "string" && /^\d+(\.\d+)?$/.test(startRaw.trim())
          ? parseFloat(startRaw.trim())
          : startRaw
      ) ?? excelCellToDate(startRaw);
    const endD =
      excelCellToDate(
        typeof endRaw === "string" && /^\d+(\.\d+)?$/.test(endRaw.trim())
          ? parseFloat(endRaw.trim())
          : endRaw
      ) ?? excelCellToDate(endRaw);

    if (!startD || !endD) {
      errors.push(`Linha ${r + 1}: datas Início/Fim inválidas.`);
      continue;
    }

    const start = startOfDayUtc(startD);
    const end = endOfDayUtc(endD);
    if (end < start) {
      errors.push(`Linha ${r + 1}: Fim anterior ao Início.`);
      continue;
    }

    yearsSet.add(start.getFullYear());
    yearsSet.add(end.getFullYear());

    const tier = parseTier(String(line[ix.category] ?? ""));
    if (!tier) {
      errors.push(`Linha ${r + 1}: Categoria inválida (use Gold, Silver ou Black).`);
      continue;
    }

    const cotaRaw = String(line[ix.cotas] ?? "").trim();
    const cotaCode = parseCotaCode(cotaRaw);
    if (!cotaCode) {
      errors.push(`Linha ${r + 1}: Cotas inválido (use A–F ou Extra).`);
      continue;
    }

    const isExtra = cotaCode === "EXTRA";
    if (isExtra) cotaNeed.add("EXTRA");
    else cotaNeed.add(cotaCode);

    const eventText = String(line[ix.event] ?? "").trim();
    const lastUse =
      ix.lastUse >= 0 && line[ix.lastUse] != null && String(line[ix.lastUse]).trim()
        ? String(line[ix.lastUse]).trim()
        : null;

    let description = eventText || null;
    if (lastUse) {
      description = description
        ? `${description} · Último uso: ${lastUse}`
        : `Último uso: ${lastUse}`;
    }

    const officialWeekType: OfficialWeekType = isExtra ? "EXTRA" : "TYPE_1";

    rows.push({
      weekIndex: weekNum,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      tier,
      officialWeekType,
      description,
      cotaCode,
      isExtra,
      lastUseNote: lastUse,
    });
  }

  if (errors.length) {
    return { ok: false, errors, warnings };
  }

  if (!rows.length) {
    return { ok: false, errors: ["Nenhuma linha de dados encontrada abaixo do cabeçalho."], warnings };
  }

  const byIndex = new Map<number, ParsedCalendarRow>();
  for (const row of rows) {
    if (byIndex.has(row.weekIndex)) {
      errors.push(`Semana ${row.weekIndex} duplicada na planilha.`);
    }
    byIndex.set(row.weekIndex, row);
  }
  if (errors.length) return { ok: false, errors, warnings };

  const yearsArr = Array.from(yearsSet).sort((a, b) => a - b);
  if (yearsArr.length === 1 && yearsArr[0] !== expectedYear) {
    errors.push(
      `Ano nas datas (${yearsArr[0]}) não confere com o ano informado (${expectedYear}). Ajuste o campo Ano ou a planilha.`
    );
  }
  if (yearsArr.length > 1) {
    warnings.push(
      `As datas cobrem mais de um ano civil (${yearsArr.join(", ")}). Confira se a planilha está correta.`
    );
  }
  if (errors.length) return { ok: false, errors, warnings };

  const extraCount = rows.filter((x) => x.isExtra).length;
  const byCota: Record<string, number> = {};
  for (const row of rows) {
    const k = row.cotaCode;
    byCota[k] = (byCota[k] ?? 0) + 1;
  }

  const cotaLettersNeeded = Array.from(cotaNeed)
    .filter((c) => c !== "EXTRA")
    .sort();

  return {
    ok: true,
    rows,
    preview: {
      totalWeeks: rows.length,
      extraCount,
      byCota,
      yearsInSheet: yearsArr,
      cotaLettersNeeded,
    },
    warnings,
  };
}

export function parseExcelBuffer(buffer: ArrayBuffer, expectedYear: number): CalendarValidationResult {
  const table = readExcelSheetRows(buffer);
  return validateCalendarRows(table, expectedYear);
}
