/**
 * Representação visual admin: classe da semana (tier) vs status operacional.
 * Tier = cor principal; status = selo/badge (não substitui a classe).
 */

/** Chave estável para UI (legenda + badge). */
export type OperationalStatusUiKey =
  | "DISPONIVEL"
  | "ATRIBUIDA"
  | "RESERVA_USO"
  | "PENDENTE"
  | "DISPONIVEL_TROCA"
  | "CANCELADA_BLOQUEADA";

export const OPERATIONAL_STATUS_LABEL: Record<OperationalStatusUiKey, string> = {
  DISPONIVEL: "Disponível",
  ATRIBUIDA: "Atribuída",
  RESERVA_USO: "Reserva confirmada / uso",
  PENDENTE: "Pendente",
  DISPONIVEL_TROCA: "Disponível p/ troca",
  CANCELADA_BLOQUEADA: "Cancelada / bloqueada",
};

/** Texto curto para células pequenas do grid. */
export const OPERATIONAL_STATUS_SHORT: Record<OperationalStatusUiKey, string> = {
  DISPONIVEL: "Disp.",
  ATRIBUIDA: "Atrib.",
  RESERVA_USO: "Uso",
  PENDENTE: "Pend.",
  DISPONIVEL_TROCA: "Troca",
  CANCELADA_BLOQUEADA: "Bloq.",
};

/** Tiers usados no planejamento (filtros + legenda). */
export const ALL_PLANNING_TIER_KEYS = ["GOLD", "SILVER", "BLACK"] as const;
export type PlanningTierKey = (typeof ALL_PLANNING_TIER_KEYS)[number];

/** Lista fixa de status para filtros (mesma ordem da legenda). */
export const ALL_OPERATIONAL_STATUS_KEYS: OperationalStatusUiKey[] = [
  "DISPONIVEL",
  "ATRIBUIDA",
  "RESERVA_USO",
  "PENDENTE",
  "DISPONIVEL_TROCA",
  "CANCELADA_BLOQUEADA",
];

/**
 * Calendário da propriedade (portal admin): prioridade reserva → distribuição → bloqueio → livre.
 * Alinhado a `components/admin-portal/calendario-propriedade.tsx` (CalendarioEntry).
 */
export function operationalKeyFromCalendarioPortalEntry(entry: {
  propertyWeek: { isBlocked?: boolean; tier?: string | null } | null;
  reserva: { status: string } | null;
  origemCota: string | null;
  cota: unknown;
}): OperationalStatusUiKey {
  if (entry.reserva) {
    return deriveOperationalStatusKey({
      isBlocked: false,
      hasAssignment: false,
      latestReservationStatus: entry.reserva.status,
    });
  }
  if (entry.origemCota === "ALOCACAO" && entry.cota) return "ATRIBUIDA";
  if (entry.propertyWeek?.isBlocked) return "CANCELADA_BLOQUEADA";
  return "DISPONIVEL";
}

export function deriveOperationalStatusKey(input: {
  isBlocked: boolean;
  hasAssignment: boolean;
  latestReservationStatus: string | null | undefined;
}): OperationalStatusUiKey {
  if (input.isBlocked) return "CANCELADA_BLOQUEADA";

  const rs = input.latestReservationStatus;
  if (rs) {
    switch (rs) {
      case "CONFIRMADA":
      case "EM_USO":
      case "FINALIZADA":
        return "RESERVA_USO";
      case "PENDENTE":
        return "PENDENTE";
      case "DISPONIVEL_TROCA":
        return "DISPONIVEL_TROCA";
      case "CANCELADA":
      case "NAO_UTILIZADA":
        return "CANCELADA_BLOQUEADA";
      default:
        return "PENDENTE";
    }
  }

  if (input.hasAssignment) return "ATRIBUIDA";
  return "DISPONIVEL";
}

/** Fundo/borda por classe (Gold / Silver / Black) — células do calendário mensal. */
export function tierGridCellClass(tier: string | undefined | null): string {
  switch (tier) {
    case "GOLD":
      return "bg-amber-100 text-amber-950 border border-amber-300";
    case "BLACK":
      return "bg-slate-800 text-white border border-slate-600";
    case "SILVER":
    default:
      return "bg-white text-[#1A2F4B] border border-slate-300";
  }
}

/** Cartões maiores (ex.: calendário por mês no portal admin). */
export function tierCardSurfaceClass(tier: string | undefined | null): string {
  switch (tier) {
    case "GOLD":
      return "bg-amber-50 border-amber-300 text-amber-950";
    case "BLACK":
      return "bg-slate-800 border-slate-600 text-white";
    case "SILVER":
    default:
      return "bg-white border-slate-300 text-slate-900";
  }
}

/**
 * Selo do status operacional — cada status com cor própria (fundo claro + texto escuro + borda).
 * Não confundir com tier (Gold/Silver/Black).
 */
export function operationalStatusBadgeClass(key: OperationalStatusUiKey): string {
  switch (key) {
    case "DISPONIVEL":
      return "bg-slate-200 text-slate-900 border-2 border-slate-500 shadow-sm";
    case "ATRIBUIDA":
      return "bg-emerald-200 text-emerald-950 border-2 border-emerald-600 shadow-sm";
    case "RESERVA_USO":
      return "bg-green-100 text-green-950 border-2 border-green-600 shadow-sm";
    case "PENDENTE":
      return "bg-amber-200 text-amber-950 border-2 border-amber-500 shadow-sm";
    case "DISPONIVEL_TROCA":
      return "bg-sky-200 text-sky-950 border-2 border-blue-600 shadow-sm";
    case "CANCELADA_BLOQUEADA":
      return "bg-red-200 text-red-950 border-2 border-red-600 shadow-sm";
    default:
      return "bg-gray-200 text-gray-900 border-2 border-gray-500";
  }
}

export function tierLabelPt(tier: string | undefined | null): string {
  switch (tier) {
    case "GOLD":
      return "Gold";
    case "SILVER":
      return "Silver";
    case "BLACK":
      return "Black";
    default:
      return tier ?? "—";
  }
}

/** Normaliza semana Prisma → JSON admin com status operacional derivado. */
export function toAdminWeekJson(w: {
  id: string;
  propertyCalendarYearId?: string;
  weekIndex: number;
  description: string | null;
  startDate: Date | string;
  endDate: Date | string;
  officialWeekType: string;
  tier: string;
  isExtra: boolean;
  exchangeAllowed: boolean;
  isBlocked: boolean;
  weight: unknown;
  notes?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  assignments?: { id?: string }[];
  weekReservations?: { status: string }[];
}): {
  id: string;
  propertyCalendarYearId?: string;
  weekIndex: number;
  description: string | null;
  startDate: string;
  endDate: string;
  officialWeekType: string;
  tier: string;
  isExtra: boolean;
  exchangeAllowed: boolean;
  isBlocked: boolean;
  weight: number;
  notes: string | null;
  createdAt?: string;
  updatedAt?: string;
  operationalStatus: OperationalStatusUiKey;
  operationalStatusLabel: string;
} {
  const hasAssignment = (w.assignments?.length ?? 0) > 0;
  const latestReservationStatus = w.weekReservations?.[0]?.status ?? null;
  const operationalStatus = deriveOperationalStatusKey({
    isBlocked: w.isBlocked,
    hasAssignment,
    latestReservationStatus,
  });

  const iso = (d: Date | string) =>
    typeof d === "string" ? d : d.toISOString();

  return {
    id: w.id,
    ...(w.propertyCalendarYearId !== undefined
      ? { propertyCalendarYearId: w.propertyCalendarYearId }
      : {}),
    weekIndex: w.weekIndex,
    description: w.description,
    startDate: iso(w.startDate),
    endDate: iso(w.endDate),
    officialWeekType: w.officialWeekType,
    tier: w.tier,
    isExtra: w.isExtra,
    exchangeAllowed: w.exchangeAllowed,
    isBlocked: w.isBlocked,
    weight: typeof w.weight === "number" ? w.weight : Number(w.weight),
    notes: w.notes ?? null,
    ...(w.createdAt !== undefined ? { createdAt: iso(w.createdAt) } : {}),
    ...(w.updatedAt !== undefined ? { updatedAt: iso(w.updatedAt) } : {}),
    operationalStatus,
    operationalStatusLabel: OPERATIONAL_STATUS_LABEL[operationalStatus],
  };
}
