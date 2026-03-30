"use client";

import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";

export type SemanaAlocadaItem = {
  label: string | null;
  startDate: string;
  endDate: string;
  weekIndex: number;
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
        <li key={`${s.startDate}-${s.endDate}`} className="flex gap-1 text-[#1A2F4B]/80">
          {!compact && (
            <CalendarRange className="mt-0.5 h-3 w-3 flex-shrink-0 text-vivant-green" />
          )}
          <span>
            <span className="font-medium text-[#1A2F4B]">
              {s.label ?? `Semana ${s.weekIndex}`}
            </span>
            {" · "}
            {format(parseISO(s.startDate), "dd/MM/yyyy", { locale: ptBR })} –{" "}
            {format(parseISO(s.endDate), "dd/MM/yyyy", { locale: ptBR })}
          </span>
        </li>
      ))}
      {rest > 0 && (
        <li className="text-[#1A2F4B]/55">e mais {rest} semana(s)…</li>
      )}
    </ul>
  );
}
