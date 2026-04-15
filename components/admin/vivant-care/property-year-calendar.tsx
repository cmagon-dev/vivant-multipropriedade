"use client";

import { useMemo } from "react";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { OperationalStatusUiKey } from "@/lib/vivant/admin-week-visual";
import {
  tierGridCellClass,
  operationalStatusBadgeClass,
  OPERATIONAL_STATUS_SHORT,
  OPERATIONAL_STATUS_LABEL,
  tierLabelPt,
  ALL_PLANNING_TIER_KEYS,
  ALL_OPERATIONAL_STATUS_KEYS,
} from "@/lib/vivant/admin-week-visual";

export type AdminCalendarWeek = {
  id: string;
  weekIndex: number;
  description: string | null;
  startDate: string;
  endDate: string;
  officialWeekType: string;
  tier: string;
  isExtra: boolean;
  weight: string | number;
  isBlocked: boolean;
  exchangeAllowed: boolean;
  notes?: string | null;
  /** Status operacional derivado (distribuição, reserva, bloqueio) — não confundir com tier. */
  operationalStatus?: OperationalStatusUiKey;
  operationalStatusLabel?: string;
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function weekForDate(weeks: AdminCalendarWeek[], d: Date): AdminCalendarWeek | null {
  const day = startOfDay(d);
  for (const w of weeks) {
    const s = startOfDay(new Date(w.startDate));
    const e = startOfDay(new Date(w.endDate));
    if (isWithinInterval(day, { start: s, end: e })) return w;
  }
  return null;
}

export function effectiveOperationalKey(w: AdminCalendarWeek | null): OperationalStatusUiKey {
  if (!w) return "DISPONIVEL";
  if (w.operationalStatus) return w.operationalStatus;
  if (w.isBlocked) return "CANCELADA_BLOQUEADA";
  return "DISPONIVEL";
}

function weekMatchesPlanningFilters(
  w: AdminCalendarWeek,
  tierFilterInclude: readonly string[] | undefined,
  statusFilterInclude: readonly OperationalStatusUiKey[] | undefined,
  useStatusInFilter: boolean
): boolean {
  const tiers =
    tierFilterInclude && tierFilterInclude.length > 0
      ? tierFilterInclude
      : [...ALL_PLANNING_TIER_KEYS];
  if (!useStatusInFilter) {
    return tiers.includes(w.tier);
  }
  const statuses =
    statusFilterInclude && statusFilterInclude.length > 0
      ? statusFilterInclude
      : [...ALL_OPERATIONAL_STATUS_KEYS];
  const op = effectiveOperationalKey(w);
  return tiers.includes(w.tier) && statuses.includes(op);
}

type Props = {
  year: number;
  weeks: AdminCalendarWeek[];
  onSelectWeek: (week: AdminCalendarWeek) => void;
  /** Filtros da legenda: semanas fora ficam esmaecidas. Omitir = mostrar todas. */
  tierFilterInclude?: readonly string[];
  statusFilterInclude?: readonly OperationalStatusUiKey[];
  /** Planejamento de semanas: só classes (Gold/Silver/Black), sem selo de status na célula. */
  showOperationalStatus?: boolean;
};

export function PropertyYearCalendar({
  year,
  weeks,
  onSelectWeek,
  tierFilterInclude,
  statusFilterInclude,
  showOperationalStatus = true,
}: Props) {
  const useStatusInFilter = showOperationalStatus;
  const months = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const monthStart = new Date(year, i, 1);
      const gridStart = startOfWeek(startOfMonth(monthStart), { weekStartsOn: 0 });
      const gridEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 0 });
      const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
      return { monthIndex: i, days };
    });
  }, [year]);

  return (
    <div className="grid gap-6 xl:grid-cols-2 2xl:grid-cols-3">
      {months.map(({ monthIndex, days }) => (
        <div
          key={monthIndex}
          className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
        >
          <h3 className="mb-2 text-center text-sm font-semibold capitalize text-vivant-navy">
            {format(new Date(year, monthIndex, 1), "MMMM yyyy", { locale: ptBR })}
          </h3>
          <div className="grid grid-cols-7 gap-px text-center text-[10px] font-medium text-slate-500">
            {WEEKDAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px">
            {days.map((d) => {
              const w = weekForDate(weeks, d);
              const inMonth = isSameMonth(d, new Date(year, monthIndex, 1));
              const opKey = effectiveOperationalKey(w);
              const statusFull =
                w?.operationalStatusLabel ?? OPERATIONAL_STATUS_LABEL[opKey];
              const filteredOut =
                w &&
                !weekMatchesPlanningFilters(
                  w,
                  tierFilterInclude,
                  statusFilterInclude,
                  useStatusInFilter
                );
              const titleBase = w
                ? showOperationalStatus
                  ? `${w.description ?? "Semana " + w.weekIndex} · ${format(new Date(w.startDate), "dd/MM")}–${format(new Date(w.endDate), "dd/MM")} · Classe: ${tierLabelPt(w.tier)} · Status: ${statusFull}${filteredOut ? " · (fora do filtro atual)" : ""}`
                  : `${w.description ?? "Semana " + w.weekIndex} · ${format(new Date(w.startDate), "dd/MM")}–${format(new Date(w.endDate), "dd/MM")} · Classe: ${tierLabelPt(w.tier)}${filteredOut ? " · (fora do filtro atual)" : ""}`
                : undefined;
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  disabled={!w}
                  onClick={() => w && onSelectWeek(w)}
                  aria-label={w ? titleBase : undefined}
                  className={cn(
                    "relative flex min-h-[2.85rem] flex-col justify-between gap-0.5 p-0.5 text-left text-[11px] transition hover:ring-2 hover:ring-vivant-green/40 focus:outline-none focus:ring-2 focus:ring-vivant-green",
                    "select-none [&_*]:select-none",
                    !inMonth && "opacity-40",
                    w ? tierGridCellClass(w.tier) : "bg-slate-100 text-slate-500",
                    w && "cursor-pointer",
                    !w && "cursor-default",
                    filteredOut && "opacity-[0.28] saturate-[0.35]"
                  )}
                >
                  <span className="pointer-events-none shrink-0 font-medium leading-none">
                    {format(d, "d")}
                  </span>
                  {w && showOperationalStatus ? (
                    <span
                      className={cn(
                        "pointer-events-none w-full truncate rounded px-0.5 py-px text-center text-[8px] font-semibold leading-tight shadow-sm",
                        operationalStatusBadgeClass(opKey)
                      )}
                    >
                      {OPERATIONAL_STATUS_SHORT[opKey]}
                    </span>
                  ) : null}
                  {w?.isExtra ? (
                    <span
                      className="pointer-events-none absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-violet-500 ring-1 ring-white"
                      aria-hidden
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
