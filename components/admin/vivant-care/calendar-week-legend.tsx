"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  OPERATIONAL_STATUS_LABEL,
  OPERATIONAL_STATUS_SHORT,
  tierGridCellClass,
  operationalStatusBadgeClass,
  ALL_PLANNING_TIER_KEYS,
  ALL_OPERATIONAL_STATUS_KEYS,
  type OperationalStatusUiKey,
} from "@/lib/vivant/admin-week-visual";

/** O que representa cada classe (tooltip). */
const TIER_LEGEND_HELP: Record<(typeof ALL_PLANNING_TIER_KEYS)[number], string> = {
  GOLD:
    "Gold — temporada alta (ou maior peso no rateio). Vem da planilha ou do campo tier. É a cor de fundo da caixa, não o status operacional.",
  SILVER:
    "Silver — temporada intermediária. Define a paleta da caixa, separada de reservas e distribuição.",
  BLACK:
    "Black — temporada baixa (ou menor peso). Também vem da planilha/cadastro.",
};

/** O que representa cada status (tooltip). */
const STATUS_LEGEND_HELP: Record<OperationalStatusUiKey, string> = {
  DISPONIVEL:
    "Sem reserva ativa, sem vínculo na distribuição e semana não bloqueada — livre no fluxo operacional.",
  ATRIBUIDA:
    "Semana alocada a uma cota na distribuição (pode ainda não haver reserva formal).",
  RESERVA_USO:
    "Reserva confirmada, em uso ou já finalizada para esta semana.",
  PENDENTE:
    "Reserva aguardando confirmação ou próximo passo.",
  DISPONIVEL_TROCA:
    "Semana ou reserva no fluxo de troca entre cotistas.",
  CANCELADA_BLOQUEADA:
    "Semana bloqueada no calendário ou reserva cancelada / não utilizada.",
};

/** Textos mais longos para a legenda “Ver calendário” (operador). */
const STATUS_HELP_PORTAL: Record<OperationalStatusUiKey, string> = {
  DISPONIVEL:
    "Semana ainda não distribuída e sem reserva. É a situação “livre” antes de alguém usar ou reservar.",
  ATRIBUIDA:
    "A semana já foi vinculada a uma cota na rodada de distribuição. Pode ainda não existir reserva de hospedagem registrada.",
  RESERVA_USO:
    "Existe reserva confirmada, período em uso ou estadia já encerrada — ou seja, a semana já entrou no fluxo de uso do cotista.",
  PENDENTE:
    "Há reserva iniciada, mas ainda não está confirmada ou falta algum passo (pagamento, aceite etc.).",
  DISPONIVEL_TROCA:
    "A semana ou a reserva foi oferecida para troca entre cotistas (troca de períodos).",
  CANCELADA_BLOQUEADA:
    "Semana bloqueada no planejamento (não disponível) ou reserva cancelada / marcada como não utilizada.",
};

export type CalendarWeekLegendProps = {
  variant?: "default" | "compact";
  /**
   * Quando true, os chips funcionam como filtro (clique para incluir/excluir).
   * Requer `tierFilterInclude`, `statusFilterInclude` e callbacks do pai.
   */
  showFilters?: boolean;
  /** Em planejamento de semanas use só classes (Gold/Silver/Black), sem bloco de status. */
  showStatusSection?: boolean;
  /** Lista com explicação de cada status (recomendado em “Ver calendário”). */
  showStatusHelpList?: boolean;
  tierFilterInclude?: readonly string[];
  statusFilterInclude?: readonly OperationalStatusUiKey[];
  onTierFilterIncludeChange?: (next: string[]) => void;
  onStatusFilterIncludeChange?: (next: OperationalStatusUiKey[]) => void;
};

function toggleTier(current: readonly string[], tier: string): string[] {
  const has = current.includes(tier);
  if (has && current.length <= 1) return [...current];
  if (has) return current.filter((t) => t !== tier);
  return [...current, tier];
}

function toggleStatus(
  current: readonly OperationalStatusUiKey[],
  key: OperationalStatusUiKey
): OperationalStatusUiKey[] {
  const has = current.includes(key);
  if (has && current.length <= 1) return [...current];
  if (has) return current.filter((k) => k !== key);
  return [...current, key];
}

export function CalendarWeekLegend({
  variant = "default",
  showFilters = false,
  showStatusSection = true,
  showStatusHelpList = false,
  tierFilterInclude = [...ALL_PLANNING_TIER_KEYS],
  statusFilterInclude = [...ALL_OPERATIONAL_STATUS_KEYS],
  onTierFilterIncludeChange,
  onStatusFilterIncludeChange,
}: CalendarWeekLegendProps) {
  const compact = variant === "compact";
  const textMuted = compact ? "text-[11px]" : "text-xs";
  const [statusHelpOpen, setStatusHelpOpen] = useState(false);

  const tierActive = (t: string) => tierFilterInclude.includes(t);
  const statusActive = (k: OperationalStatusUiKey) => statusFilterInclude.includes(k);

  const resetFilters = () => {
    onTierFilterIncludeChange?.([...ALL_PLANNING_TIER_KEYS]);
    if (showStatusSection) {
      onStatusFilterIncludeChange?.([...ALL_OPERATIONAL_STATUS_KEYS]);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", compact ? "gap-3" : "gap-5")}>
      {/* A — Classe (bloco único, rótulo + chips em linha) */}
      <div
        className={cn(
          "rounded-xl border border-slate-200/90 bg-gradient-to-b from-slate-50/90 to-white p-4 shadow-sm",
          compact && "p-3"
        )}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4">
          <div className="flex shrink-0 flex-col justify-center lg:w-44">
            <span className="text-sm font-semibold text-vivant-navy">Classe da semana</span>
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Cor de fundo
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {ALL_PLANNING_TIER_KEYS.map((tier) => {
              const active = tierActive(tier);
              const label = tier === "GOLD" ? "Gold" : tier === "SILVER" ? "Silver" : "Black";
              const chipClass = cn(
                "inline-flex min-w-[4.25rem] select-none justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                tierGridCellClass(tier),
                showFilters && !active && "opacity-40 grayscale",
                showFilters && active && "ring-2 ring-vivant-navy ring-offset-2",
                showFilters && "cursor-pointer hover:opacity-100"
              );
              if (showFilters && onTierFilterIncludeChange) {
                return (
                  <button
                    key={tier}
                    type="button"
                    aria-label={TIER_LEGEND_HELP[tier]}
                    aria-pressed={active}
                    onClick={() => onTierFilterIncludeChange(toggleTier(tierFilterInclude, tier))}
                    className={cn(
                      "rounded-lg border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-vivant-green",
                      "cursor-pointer select-none [&_*]:select-none"
                    )}
                  >
                    <span className={cn(chipClass, "pointer-events-none")}>{label}</span>
                  </button>
                );
              }
              return (
                <span
                  key={tier}
                  className={cn(chipClass, "inline-flex cursor-default")}
                  aria-label={TIER_LEGEND_HELP[tier]}
                >
                  {label}
                </span>
              );
            })}
          </div>
        </div>
        <p className={cn("mt-3 border-t border-slate-100 pt-3 text-slate-600", textMuted)}>
          Origem: planilha importada ou campo <strong>tier</strong>. Ponto roxo no calendário = semana{" "}
          <strong>extra</strong>.
        </p>
        {showFilters && onTierFilterIncludeChange && !showStatusSection ? (
          <div className="mt-3 flex flex-wrap justify-end border-t border-slate-100 pt-3">
            <button
              type="button"
              onClick={resetFilters}
              className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-vivant-navy hover:bg-slate-100"
            >
              Mostrar todas as classes
            </button>
          </div>
        ) : null}
      </div>

      {/* B — Status (bloco embaixo, rótulo + selos em linha) */}
      {showStatusSection ? (
      <div
        className={cn(
          "rounded-xl border border-slate-200/90 bg-white p-4 shadow-sm",
          compact && "p-3"
        )}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-4">
          <div className="flex shrink-0 flex-col justify-center lg:w-44">
            <span className="text-sm font-semibold text-vivant-navy">Status operacional</span>
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Selo na caixa
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {ALL_OPERATIONAL_STATUS_KEYS.map((key) => {
              const active = statusActive(key);
              const short = OPERATIONAL_STATUS_SHORT[key];
              const full = OPERATIONAL_STATUS_LABEL[key];
              const aria = `${full}. ${STATUS_LEGEND_HELP[key]}`;
              const chipClass = cn(
                "inline-flex max-w-[11rem] select-none truncate rounded-md px-2 py-1 text-[10px] font-semibold leading-tight transition",
                operationalStatusBadgeClass(key),
                showFilters && !active && "opacity-40 grayscale",
                showFilters && active && "ring-2 ring-vivant-navy ring-offset-1",
                showFilters && "cursor-pointer hover:opacity-100",
                !showFilters && compact && "max-w-[9rem]"
              );
              if (showFilters && onStatusFilterIncludeChange) {
                return (
                  <button
                    key={key}
                    type="button"
                    aria-label={aria}
                    aria-pressed={active}
                    onClick={() =>
                      onStatusFilterIncludeChange(toggleStatus(statusFilterInclude, key))
                    }
                    className={cn(
                      "rounded-md border-0 bg-transparent p-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-vivant-green",
                      "cursor-pointer select-none [&_*]:select-none"
                    )}
                  >
                    <span className={cn(chipClass, "pointer-events-none")}>
                      {compact ? short : full}
                    </span>
                  </button>
                );
              }
              return (
                <span
                  key={key}
                  className={cn(chipClass, "inline-flex cursor-default")}
                  aria-label={aria}
                >
                  {compact ? short : full}
                </span>
              );
            })}
          </div>
        </div>
        {showStatusHelpList ? (
          <div
            className={cn(
              "mt-3 rounded-lg border border-slate-200 bg-slate-50/95",
              compact ? "p-2.5" : "p-3"
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-2 gap-y-1">
              <p
                className={cn(
                  "min-w-0 flex-1 font-semibold text-vivant-navy",
                  compact ? "text-xs" : "text-sm"
                )}
                id="calendar-legend-status-help-heading"
              >
                O que significa cada status no selo
              </p>
              <button
                type="button"
                onClick={() => setStatusHelpOpen((v) => !v)}
                aria-expanded={statusHelpOpen}
                aria-controls="calendar-legend-status-help-details"
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-medium text-vivant-navy shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-vivant-green",
                  compact && "py-0.5"
                )}
              >
                {statusHelpOpen ? (
                  <>
                    Ocultar
                    <ChevronUp className="h-3.5 w-3.5 opacity-80" aria-hidden />
                  </>
                ) : (
                  <>
                    Mostrar explicações
                    <ChevronDown className="h-3.5 w-3.5 opacity-80" aria-hidden />
                  </>
                )}
              </button>
            </div>
            {statusHelpOpen ? (
              <ul
                id="calendar-legend-status-help-details"
                className="mt-3 space-y-2.5 border-t border-slate-200/90 pt-3"
                aria-labelledby="calendar-legend-status-help-heading"
              >
                {ALL_OPERATIONAL_STATUS_KEYS.map((key) => (
                  <li
                    key={key}
                    className="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-3"
                  >
                    <span
                      className={cn(
                        "inline-flex w-fit shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold leading-tight",
                        operationalStatusBadgeClass(key)
                      )}
                    >
                      {OPERATIONAL_STATUS_LABEL[key]}
                    </span>
                    <span
                      className={cn(
                        "min-w-0 flex-1 text-slate-700 leading-snug",
                        compact ? "text-[11px]" : "text-xs"
                      )}
                    >
                      {STATUS_HELP_PORTAL[key]}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={cn("mt-2 text-slate-500", compact ? "text-[10px]" : "text-[11px]")}>
                Toque em <strong className="font-medium text-slate-600">Mostrar explicações</strong>{" "}
                para ver o detalhe de cada selo.
              </p>
            )}
          </div>
        ) : null}
        <div
          className={cn(
            "mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-slate-600",
            textMuted
          )}
        >
          <p>
            {showFilters ? (
              <>
                <strong>Filtro:</strong> toque nos chips para esconder ou mostrar tipos no calendário
                (esmaece o que está fora). Distribuição e reservas <strong>não mudam</strong> a classe
                Gold/Silver/Black.
              </>
            ) : (
              <>
                Distribuição, reservas e bloqueios — <strong>não troca</strong> a classe Gold/Silver/Black.
              </>
            )}
          </p>
          {showFilters && onTierFilterIncludeChange && onStatusFilterIncludeChange ? (
            <button
              type="button"
              onClick={resetFilters}
              className="shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-vivant-navy hover:bg-slate-100"
            >
              Mostrar todas
            </button>
          ) : null}
        </div>
      </div>
      ) : null}
    </div>
  );
}
