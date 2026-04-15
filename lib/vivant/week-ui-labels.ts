/** Rótulos de UI para semanas oficiais (alinhado ao Prisma, sem alterar API). */

export function weekDisplayName(
  description: string | null | undefined,
  weekIndex: number
): string {
  const d = description?.trim();
  return d ? d : `Semana ${weekIndex}`;
}

/** Classificação → texto curto (calendário cotista). */
export const TIER_SHORT_PT: Record<string, string> = {
  GOLD: "Gold · alta temporada",
  SILVER: "Silver · média",
  BLACK: "Black · baixa",
};

/** Tipo oficial da semana (1–6, extra). */
export const OFFICIAL_WEEK_TYPE_LABEL_PT: Record<string, string> = {
  TYPE_1: "Tipo 1",
  TYPE_2: "Tipo 2",
  TYPE_3: "Tipo 3",
  TYPE_4: "Tipo 4",
  TYPE_5: "Tipo 5",
  TYPE_6: "Tipo 6",
  EXTRA: "Extra",
};

export function officialWeekTypeLabel(value: string | undefined): string {
  if (!value) return "—";
  return OFFICIAL_WEEK_TYPE_LABEL_PT[value] ?? value;
}
