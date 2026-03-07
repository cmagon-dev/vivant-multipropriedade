/**
 * SLA por etapa: cálculo de status (GREEN/YELLOW/ORANGE/RED/GRAY) para o Kanban.
 * Tempo corrido (24/7). Thresholds por "horas restantes" (hoursLeft).
 */

export type SlaStatus = "GREEN" | "YELLOW" | "ORANGE" | "RED" | "NEUTRAL";

export type SlaThresholdEntry = { color: "YELLOW" | "ORANGE"; hoursLeft: number };

export type SlaStatusResult = {
  status: SlaStatus;
  hoursLeft: number | null;
  overdueHours: number | null;
};

/**
 * Ordena thresholds por hoursLeft do menor para o maior (ex: 3 antes de 12).
 * Ao avaliar: se hoursLeft <= 3 => ORANGE; else if hoursLeft <= 12 => YELLOW; else => GREEN.
 */
export function sortThresholds(thresholds: SlaThresholdEntry[]): SlaThresholdEntry[] {
  return [...thresholds].sort((a, b) => a.hoursLeft - b.hoursLeft);
}

/**
 * Parse e valida slaThresholds do stage (JSON). Retorna array ordenado ou [].
 */
export function parseStageThresholds(raw: unknown): SlaThresholdEntry[] {
  if (!Array.isArray(raw)) return [];
  const list: SlaThresholdEntry[] = [];
  for (const t of raw) {
    if (t && typeof t === "object" && typeof (t as any).hoursLeft === "number" && ((t as any).color === "YELLOW" || (t as any).color === "ORANGE")) {
      const hoursLeft = Math.max(0, (t as any).hoursLeft);
      list.push({ color: (t as any).color, hoursLeft });
    }
  }
  return sortThresholds(list);
}

/**
 * Calcula o status de SLA para exibição no Kanban.
 * - NEUTRAL (cinza): SLA desligado, ou stageDueAt/stageEnteredAt nulos.
 * - RED: hoursLeft <= 0 (atrasado).
 * - YELLOW/ORANGE: conforme thresholds (hoursLeft <= X).
 * - GREEN: dentro do prazo e acima dos thresholds.
 */
export function getSlaStatus(params: {
  stageDueAt: Date | string | null;
  stageEnteredAt: Date | string | null;
  slaEnabled: boolean;
  slaHours: number | null;
  thresholds: SlaThresholdEntry[];
  now?: Date;
}): SlaStatusResult {
  const now = params.now ?? new Date();
  const dueAt = params.stageDueAt ? new Date(params.stageDueAt) : null;
  const enteredAt = params.stageEnteredAt ? new Date(params.stageEnteredAt) : null;

  if (!params.slaEnabled || params.slaHours == null || params.slaHours <= 0 || dueAt == null || enteredAt == null) {
    return { status: "NEUTRAL", hoursLeft: null, overdueHours: null };
  }

  const hoursLeft = (dueAt.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursLeft <= 0) {
    return {
      status: "RED",
      hoursLeft: 0,
      overdueHours: Math.abs(hoursLeft),
    };
  }

  const sorted = sortThresholds(params.thresholds);
  for (let i = 0; i < sorted.length; i++) {
    if (hoursLeft <= sorted[i].hoursLeft) {
      return { status: sorted[i].color, hoursLeft, overdueHours: null };
    }
  }
  return { status: "GREEN", hoursLeft, overdueHours: null };
}

/**
 * Classe CSS de borda para o card (borda colorida, não fundo).
 */
export function getSlaBorderClass(status: SlaStatus): string {
  switch (status) {
    case "GREEN":
      return "border-l-4 border-l-green-500";
    case "YELLOW":
      return "border-l-4 border-l-yellow-500";
    case "ORANGE":
      return "border-l-4 border-l-orange-500";
    case "RED":
      return "border-l-4 border-l-red-500";
    default:
      return "border-l-4 border-l-gray-400";
  }
}
