"use client";

import { useEffect, useMemo, useState } from "react";
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
  addMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  weekDisplayName,
  TIER_SHORT_PT,
  officialWeekTypeLabel,
} from "@/lib/vivant/week-ui-labels";

export type CalendarWeekPickerWeek = {
  id: string;
  weekIndex: number;
  description: string | null;
  startDate: string;
  endDate: string;
  tier: string;
  officialWeekType: string;
  isBlocked: boolean;
  exchangeAllowed: boolean;
};

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function weekForDate(
  weeks: CalendarWeekPickerWeek[],
  d: Date
): CalendarWeekPickerWeek | null {
  const day = startOfDay(d);
  for (const w of weeks) {
    const s = startOfDay(new Date(w.startDate));
    const e = startOfDay(new Date(w.endDate));
    if (isWithinInterval(day, { start: s, end: e })) return w;
  }
  return null;
}

type DayVariant =
  | "empty"
  | "blocked"
  | "mine"
  | "opportunity"
  | "tierGold"
  | "tierSilver"
  | "tierBlack"
  | "neutral";

function tierDayVariant(w: CalendarWeekPickerWeek): "tierGold" | "tierSilver" | "tierBlack" | "neutral" {
  switch (w.tier) {
    case "GOLD":
      return "tierGold";
    case "SILVER":
      return "tierSilver";
    case "BLACK":
      return "tierBlack";
    default:
      return "neutral";
  }
}

function dayVariant(
  w: CalendarWeekPickerWeek | null,
  myIds: Set<string>,
  oppIds: Set<string>
): DayVariant {
  if (!w) return "empty";
  if (w.isBlocked) return "blocked";
  if (myIds.has(w.id)) return "mine";
  if (oppIds.has(w.id)) return "opportunity";
  return tierDayVariant(w);
}

function variantClasses(v: DayVariant, selected: boolean): string {
  const base =
    "relative min-h-[2.5rem] rounded-md border text-sm transition focus:outline-none focus:ring-2 focus:ring-vivant-green/50";
  const sel = selected ? "ring-2 ring-vivant-green z-10" : "";
  switch (v) {
    case "empty":
      return cn(base, "border-transparent bg-slate-50 text-slate-300 cursor-default", sel);
    case "blocked":
      return cn(
        base,
        "border-red-300 bg-red-50 text-red-900 cursor-not-allowed",
        sel
      );
    case "mine":
      return cn(
        base,
        "border-blue-400 bg-blue-50 text-blue-950 cursor-pointer hover:bg-blue-100",
        sel
      );
    case "opportunity":
      return cn(
        base,
        "border-emerald-400 bg-emerald-50 text-emerald-950 cursor-pointer hover:bg-emerald-100",
        sel
      );
    case "tierGold":
      return cn(
        base,
        "border-amber-400 bg-amber-50 text-amber-950 cursor-pointer hover:bg-amber-100",
        sel
      );
    case "tierSilver":
      return cn(
        base,
        "border-slate-300 bg-slate-50 text-slate-900 cursor-pointer hover:bg-slate-100",
        sel
      );
    case "tierBlack":
      return cn(
        base,
        "border-zinc-500 bg-zinc-100 text-zinc-900 cursor-pointer hover:bg-zinc-200",
        sel
      );
    case "neutral":
      return cn(
        base,
        "border-slate-200 bg-white text-slate-800 cursor-pointer hover:bg-slate-50",
        sel
      );
    default:
      return base;
  }
}

export type CalendarWeekPickerProps = {
  year: number;
  weeks: CalendarWeekPickerWeek[];
  myWeekIds: string[];
  opportunityWeekIds?: string[];
  propertyName: string;
  /** Controlled selection — uma semana por vez (clique no dia seleciona o intervalo inteiro). */
  selectedWeekId: string | null;
  onSelectWeek: (weekId: string) => void;
};

export function CalendarWeekPicker({
  year,
  weeks,
  myWeekIds,
  opportunityWeekIds = [],
  propertyName,
  selectedWeekId,
  onSelectWeek,
}: CalendarWeekPickerProps) {
  const [cursor, setCursor] = useState(() => new Date(year, new Date().getMonth(), 1));

  useEffect(() => {
    setCursor(new Date(year, new Date().getMonth(), 1));
  }, [year]);

  const mySet = useMemo(() => new Set(myWeekIds), [myWeekIds]);
  const oppSet = useMemo(
    () => new Set(opportunityWeekIds.filter(Boolean)),
    [opportunityWeekIds]
  );

  const monthGrid = useMemo(() => {
    const monthStart = startOfMonth(cursor);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(endOfMonth(monthStart), { weekStartsOn: 0 });
    return eachDayOfInterval({ start: gridStart, end: gridEnd });
  }, [cursor]);

  const selectedWeek = useMemo(
    () => weeks.find((w) => w.id === selectedWeekId) ?? null,
    [weeks, selectedWeekId]
  );

  const handleDayClick = (d: Date) => {
    const w = weekForDate(weeks, d);
    if (!w || w.isBlocked) return;
    onSelectWeek(w.id);
  };

  const isSelectedDay = (d: Date) => {
    if (!selectedWeek) return false;
    const w = weekForDate(weeks, d);
    return w?.id === selectedWeek.id;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setCursor((c) => addMonths(c, -1))}
          aria-label="Mês anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold capitalize text-[#1A2F4B]">
          {format(cursor, "MMMM yyyy", { locale: ptBR })}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => setCursor((c) => addMonths(c, 1))}
          aria-label="Próximo mês"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-[#1A2F4B]/60">
        {WEEKDAYS.map((d) => (
          <div key={d} className="py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {monthGrid.map((d) => {
          const w = weekForDate(weeks, d);
          const inMonth = isSameMonth(d, cursor);
          const v = dayVariant(w, mySet, oppSet);
          const canClick = w && !w.isBlocked;
          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={!canClick}
              onClick={() => handleDayClick(d)}
              className={cn(
                variantClasses(v, isSelectedDay(d)),
                !inMonth && "opacity-40"
              )}
            >
              {format(d, "d")}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-[#1A2F4B]/80">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-blue-400 bg-blue-50" /> Sua semana
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-slate-200 bg-white" /> Demais semanas
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-amber-400 bg-amber-50" /> Gold (alta)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-slate-300 bg-slate-50" /> Silver (média)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-zinc-500 bg-zinc-100" /> Black (baixa)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-emerald-400 bg-emerald-50" /> Oportunidade de troca
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-red-300 bg-red-50" /> Bloqueada
        </span>
      </div>

      {selectedWeek ? (
        <Card className="border-vivant-green/30 bg-white shadow-md">
          <CardContent className="space-y-2 p-4 text-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-vivant-green">
              {propertyName}
            </p>
            <p className="text-lg font-semibold text-[#1A2F4B]">
              {weekDisplayName(selectedWeek.description, selectedWeek.weekIndex)}
            </p>
            <p className="text-[#1A2F4B]/80">
              {format(new Date(selectedWeek.startDate), "dd/MM/yyyy", { locale: ptBR })} —{" "}
              {format(new Date(selectedWeek.endDate), "dd/MM/yyyy", { locale: ptBR })}
            </p>
            <p className="text-xs text-[#1A2F4B]/75">
              <span className="font-medium">Classificação:</span>{" "}
              {TIER_SHORT_PT[selectedWeek.tier] ?? selectedWeek.tier}
            </p>
            <p className="text-xs text-[#1A2F4B]/75">
              <span className="font-medium">Tipo:</span>{" "}
              {officialWeekTypeLabel(selectedWeek.officialWeekType)}
            </p>
            <p className="text-xs text-[#1A2F4B]/75">
              <span className="font-medium">Aceita troca:</span>{" "}
              {selectedWeek.exchangeAllowed ? "sim" : "não"}
            </p>
            {mySet.has(selectedWeek.id) ? (
              <p className="text-xs font-medium text-blue-800">· Sua alocação neste calendário</p>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-[#1A2F4B]/60">
          Toque em um dia para ver a descrição da semana, período, classificação (Gold/Silver/Black) e
          se aceita troca. A seleção é sempre a semana inteira (quinta a quarta), sem datas soltas.
        </p>
      )}
    </div>
  );
}
