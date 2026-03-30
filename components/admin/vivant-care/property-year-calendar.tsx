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

export type AdminCalendarWeek = {
  id: string;
  weekIndex: number;
  label: string | null;
  startDate: string;
  endDate: string;
  seasonType: string;
  weight: string | number;
  isBlocked: boolean;
  isHoliday: boolean;
  isSchoolVacation: boolean;
  isExchangeAllowed: boolean;
  color: string | null;
  notes?: string | null;
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

function seasonBg(w: AdminCalendarWeek | null): string {
  if (!w) return "bg-slate-100 text-slate-500";
  if (w.isBlocked) return "bg-red-200/90 text-red-950 border border-red-300";
  switch (w.seasonType) {
    case "BAIXA":
      return "bg-slate-50 text-slate-800 border border-slate-200";
    case "MEDIA":
      return "bg-white text-[#1A2F4B] border border-slate-200";
    case "ALTA":
      return "bg-amber-100 text-amber-950 border border-amber-200";
    case "SUPER_ALTA":
      return "bg-orange-200/90 text-orange-950 border border-orange-300";
    default:
      return "bg-white border border-slate-200";
  }
}

type Props = {
  year: number;
  weeks: AdminCalendarWeek[];
  onSelectWeek: (week: AdminCalendarWeek) => void;
};

export function PropertyYearCalendar({ year, weeks, onSelectWeek }: Props) {
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
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  disabled={!w}
                  onClick={() => w && onSelectWeek(w)}
                  className={cn(
                    "relative min-h-[2rem] p-0.5 text-[11px] transition hover:ring-2 hover:ring-vivant-green/40 focus:outline-none focus:ring-2 focus:ring-vivant-green",
                    !inMonth && "opacity-40",
                    seasonBg(w),
                    w && "cursor-pointer",
                    !w && "cursor-default"
                  )}
                  title={
                    w
                      ? `${w.label ?? "Semana " + w.weekIndex} · ${format(new Date(w.startDate), "dd/MM")}–${format(new Date(w.endDate), "dd/MM")}`
                      : undefined
                  }
                >
                  <span className="font-medium">{format(d, "d")}</span>
                  {w?.isHoliday ? (
                    <span className="absolute right-0.5 top-0.5 h-1.5 w-1.5 rounded-full bg-red-500" />
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
