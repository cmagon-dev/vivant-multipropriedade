"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  weekDisplayName,
  TIER_SHORT_PT,
  officialWeekTypeLabel,
} from "@/lib/vivant/week-ui-labels";

export type SemanaAlocadaItem = {
  description: string | null;
  weekIndex: number;
  startDate: string;
  endDate: string;
  tier?: string;
  officialWeekType?: string;
  exchangeAllowed?: boolean;
};

type Props = {
  items: SemanaAlocadaItem[];
  /** Ano civil do planejamento (ex.: 2026) */
  anoReferencia?: number | null;
  /** Máximo de linhas antes de “e mais N…” */
  maxItems?: number;
  className?: string;
  compact?: boolean;
};

export function CotaWeekDatesLines({
  items,
  anoReferencia,
  maxItems = 6,
  className,
  compact = false,
}: Props) {
  if (!items.length) {
    return (
      <p
        className={cn(
          "text-[#1A2F4B]/55 italic",
          compact ? "text-[10px] leading-tight" : "text-xs"
        )}
      >
        {anoReferencia != null
          ? `Sem datas em ${anoReferencia} — o administrador ainda não distribuiu suas semanas neste calendário.`
          : "Sem datas publicadas — aguardando distribuição das semanas."}
      </p>
    );
  }

  const show = items.slice(0, maxItems);
  const rest = items.length - show.length;

  return (
    <ul className={cn("space-y-0.5", compact ? "text-[10px] leading-snug" : "text-xs", className)}>
      {anoReferencia != null && !compact && (
        <li className="mb-1 font-medium text-[#1A2F4B]/90">Semanas {anoReferencia}</li>
      )}
      {show.map((s) => (
        <li key={`${s.startDate}-${s.endDate}`} className="flex flex-col gap-0.5 text-[#1A2F4B]/80">
          <span className="flex gap-1">
            {!compact && (
              <CalendarRange className="mt-0.5 h-3 w-3 flex-shrink-0 text-vivant-green" />
            )}
            <span>
              <span className="font-medium text-[#1A2F4B]">
                {weekDisplayName(s.description, s.weekIndex)}
              </span>
              {" · "}
              {format(parseISO(s.startDate), "dd/MM/yyyy", { locale: ptBR })} –{" "}
              {format(parseISO(s.endDate), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </span>
          {!compact && (s.tier || s.officialWeekType != null || s.exchangeAllowed != null) && (
            <span className={cn("pl-4 text-[#1A2F4B]/65", compact ? "text-[9px]" : "text-[11px]")}>
              {s.tier ? (
                <span className="mr-2">{TIER_SHORT_PT[s.tier] ?? s.tier}</span>
              ) : null}
              {s.officialWeekType ? (
                <span className="mr-2">{officialWeekTypeLabel(s.officialWeekType)}</span>
              ) : null}
              {s.exchangeAllowed != null && (
                <span className="text-vivant-green/90">
                  Troca: {s.exchangeAllowed ? "sim" : "não"}
                </span>
              )}
            </span>
          )}
        </li>
      ))}
      {rest > 0 && (
        <li className="text-[#1A2F4B]/55">e mais {rest} semana(s)…</li>
      )}
    </ul>
  );
}
