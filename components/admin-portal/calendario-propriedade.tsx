"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarWeekLegend } from "@/components/admin/vivant-care/calendar-week-legend";
import {
  tierCardSurfaceClass,
  operationalStatusBadgeClass,
  OPERATIONAL_STATUS_LABEL,
  operationalKeyFromCalendarioPortalEntry,
  tierLabelPt,
  ALL_PLANNING_TIER_KEYS,
  ALL_OPERATIONAL_STATUS_KEYS,
  type OperationalStatusUiKey,
} from "@/lib/vivant/admin-week-visual";

/** Semana oficial (PropertyCalendarWeek) — resposta da API admin. */
interface OfficialWeekBrief {
  id: string;
  description: string | null;
  weekIndex: number;
  startDate: string;
  endDate: string;
  isBlocked: boolean;
  officialWeekType?: string;
  tier?: string;
  isExtra?: boolean;
}

interface CalendarioEntry {
  semana: number;
  propertyWeek: OfficialWeekBrief | null;
  reserva: {
    id: string;
    status: string;
    dataInicio: string;
    dataFim: string;
    confirmadoEm: string | null;
  } | null;
  cota: {
    id: string;
    numeroCota: string;
    cotista: { id: string; name: string; email: string };
  } | null;
  origemCota: "RESERVA" | "ALOCACAO" | null;
  disponivel: boolean;
}

interface CalendarioData {
  propriedade: {
    id: string;
    name: string;
    totalCotas: number;
    cotasAlocadas: number;
  };
  ano: number;
  semanasPlanejadas?: number;
  calendario: CalendarioEntry[];
}

interface CalendarioPropriedadeProps {
  propriedadeId: string;
}

const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    CONFIRMADA: "Confirmada",
    PENDENTE: "Pendente",
    EM_USO: "Em Uso",
    FINALIZADA: "Finalizada",
    CANCELADA: "Cancelada",
    NAO_UTILIZADA: "Não Utilizada",
    DISPONIVEL_TROCA: "Disponível p/ Troca",
  };
  return labels[status] || status;
};

/** Agrupa entradas do calendário oficial por mês (data de início da semana). */
function agruparPorMes(
  calendario: CalendarioEntry[],
  ano: number
): CalendarioEntry[][] {
  const months: CalendarioEntry[][] = Array.from({ length: 12 }, () => []);

  for (const e of calendario) {
    if (e.propertyWeek?.startDate) {
      const d = parseISO(e.propertyWeek.startDate);
      if (d.getFullYear() !== ano) continue;
      months[d.getMonth()].push(e);
    }
  }
  for (const m of months) {
    m.sort(
      (a, b) =>
        parseISO(a.propertyWeek!.startDate).getTime() -
        parseISO(b.propertyWeek!.startDate).getTime()
    );
  }
  return months;
}

function calendarioEntryMatchesFilters(
  entry: CalendarioEntry,
  tierInclude: readonly string[],
  statusInclude: readonly OperationalStatusUiKey[]
): boolean {
  const tiers =
    tierInclude.length > 0 ? tierInclude : [...ALL_PLANNING_TIER_KEYS];
  const statuses =
    statusInclude.length > 0 ? statusInclude : [...ALL_OPERATIONAL_STATUS_KEYS];
  const tier = entry.propertyWeek?.tier ?? "SILVER";
  const opKey = operationalKeyFromCalendarioPortalEntry(entry);
  return tiers.includes(tier) && statuses.includes(opKey);
}

function tituloCelula(entry: CalendarioEntry, anoCalendario: number): string {
  let base: string;
  if (entry.propertyWeek) {
    const pw = entry.propertyWeek;
    const a = format(parseISO(pw.startDate), "dd/MM/yyyy", { locale: ptBR });
    const b = format(parseISO(pw.endDate), "dd/MM/yyyy", { locale: ptBR });
    base = `${pw.description ?? "Semana " + pw.weekIndex} · ${a} – ${b}`;
  } else {
    base = `Semana ${entry.semana} (${anoCalendario})`;
  }
  if (entry.cota) {
    return `${base} · Cotista: ${entry.cota.cotista.name} · ${entry.cota.numeroCota}`;
  }
  return base;
}

export function CalendarioPropriedade({ propriedadeId }: CalendarioPropriedadeProps) {
  const [data, setData] = useState<CalendarioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [ano, setAno] = useState(new Date().getFullYear());
  /** Semana cujo detalhe está aberto no modal (clique no card — não mais hover no fim da página). */
  const [detailSemana, setDetailSemana] = useState<number | null>(null);
  const [tierFilterInclude, setTierFilterInclude] = useState<string[]>(() => [
    ...ALL_PLANNING_TIER_KEYS,
  ]);
  const [statusFilterInclude, setStatusFilterInclude] = useState<OperationalStatusUiKey[]>(() => [
    ...ALL_OPERATIONAL_STATUS_KEYS,
  ]);
  /** Painel de filtros + legenda: oculto por padrão para deixar a página mais limpa. */
  const [filtrosLegendaAberto, setFiltrosLegendaAberto] = useState(false);

  const fetchCalendario = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/propriedades/${propriedadeId}/calendario?ano=${ano}`
      );
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else {
        setData(null);
      }
    } catch (error) {
      console.error("Erro ao buscar calendário:", error);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [propriedadeId, ano]);

  useEffect(() => {
    void fetchCalendario();
  }, [fetchCalendario]);

  const porMes = useMemo(() => {
    if (!data?.calendario) return null;
    return agruparPorMes(data.calendario, data.ano);
  }, [data]);

  const getSemanaInfo = (weekIndex: number) => {
    if (!data) return null;
    return data.calendario.find((s) => s.semana === weekIndex) ?? null;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-vivant-navy" />
        </CardContent>
      </Card>
    );
  }

  if (!data || !porMes) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-gray-600">Erro ao carregar calendário</p>
        </CardContent>
      </Card>
    );
  }

  const semanaDetail = detailSemana != null ? getSemanaInfo(detailSemana) : null;

  const nAlocacao = data.calendario.filter((s) => s.origemCota === "ALOCACAO").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-vivant-green" />
              Calendário oficial — {data.propriedade.name}
            </CardTitle>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setAno(ano - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <Select value={ano.toString()} onValueChange={(v) => setAno(parseInt(v, 10))}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - 1 + i;
                    return (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => setAno(ano + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {(data.semanasPlanejadas ?? 0) === 0 && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
              Não há <strong>semanas oficiais</strong> cadastradas para {data.ano}. Use{" "}
              <strong>Planejamento de semanas</strong> no Vivant Care para gerar o calendário (datas
              quinta–quarta) e publique o ano.
            </p>
          )}
        </CardHeader>
      </Card>

      <Card className="overflow-hidden">
        <button
          type="button"
          onClick={() => setFiltrosLegendaAberto((v) => !v)}
          aria-expanded={filtrosLegendaAberto}
          aria-controls={
            filtrosLegendaAberto ? "calendario-filtros-legenda-conteudo" : undefined
          }
          className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-slate-50/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-vivant-green focus-visible:ring-offset-2"
        >
          <div className="min-w-0">
            <p className="font-semibold text-vivant-navy">Filtros e legenda</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Classe da semana, status no selo e explicações — toque para{" "}
              {filtrosLegendaAberto ? "recolher" : "expandir"}
            </p>
          </div>
          {filtrosLegendaAberto ? (
            <ChevronUp className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />
          ) : (
            <ChevronDown className="h-5 w-5 shrink-0 text-slate-500" aria-hidden />
          )}
        </button>
        {filtrosLegendaAberto ? (
          <CardContent
            id="calendario-filtros-legenda-conteudo"
            className="border-t border-slate-100 pt-4 pb-4"
          >
            <CalendarWeekLegend
              variant="compact"
              showFilters
              showStatusHelpList
              tierFilterInclude={tierFilterInclude}
              statusFilterInclude={statusFilterInclude}
              onTierFilterIncludeChange={setTierFilterInclude}
              onStatusFilterIncludeChange={setStatusFilterInclude}
            />
          </CardContent>
        ) : null}
      </Card>

      <p className="text-sm text-gray-600">
        <strong>Dica:</strong> abra <strong>Filtros e legenda</strong> para ajustar classe e status (o que
        ficar fora do filtro aparece esmaecido). Clique em uma semana para ver cotista, cota e reserva.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MESES.map((nomeMes, mesIndex) => {
          const semanasDoMes = porMes[mesIndex];

          return (
            <Card key={mesIndex}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-vivant-navy">
                  {nomeMes}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {semanasDoMes.length === 0 ? (
                  <p className="text-xs text-gray-500">Nenhuma semana oficial neste mês ({data.ano}).</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {semanasDoMes.map((entry) => {
                      const opKey = operationalKeyFromCalendarioPortalEntry(entry);
                      const tier = entry.propertyWeek?.tier;
                      const filteredOut = !calendarioEntryMatchesFilters(
                        entry,
                        tierFilterInclude,
                        statusFilterInclude
                      );
                      return (
                        <div
                          key={entry.propertyWeek?.id ?? `w-${entry.semana}`}
                          role="button"
                          tabIndex={0}
                          aria-label={`${tituloCelula(entry, data.ano)}${filteredOut ? " · (fora do filtro atual)" : ""}. Clique para ver detalhes.`}
                          className={cn(
                            "relative flex flex-col rounded border-2 p-2 text-left cursor-pointer transition-all min-h-[6.25rem] hover:brightness-[1.02] select-none [&_*]:select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-vivant-navy focus-visible:ring-offset-2",
                            entry.propertyWeek
                              ? tierCardSurfaceClass(tier)
                              : "bg-slate-50 border-slate-200 text-slate-800",
                            filteredOut && "opacity-[0.28] saturate-[0.35]"
                          )}
                          onClick={() => setDetailSemana(entry.semana)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              setDetailSemana(entry.semana);
                            }
                          }}
                        >
                          <span
                            className={cn(
                              "pointer-events-none absolute right-1 top-1 z-10 max-w-[min(100%,7.5rem)] truncate rounded px-1 py-0.5 text-[8px] font-semibold leading-tight shadow-sm",
                              operationalStatusBadgeClass(opKey)
                            )}
                          >
                            {OPERATIONAL_STATUS_LABEL[opKey]}
                          </span>
                          {entry.propertyWeek ? (
                            <>
                              <div className="pr-1 pt-5 text-[10px] font-bold leading-tight">
                                {format(parseISO(entry.propertyWeek.startDate), "dd/MM", {
                                  locale: ptBR,
                                })}{" "}
                                –{" "}
                                {format(parseISO(entry.propertyWeek.endDate), "dd/MM", {
                                  locale: ptBR,
                                })}
                              </div>
                              <div
                                className={cn(
                                  "text-[9px] mt-0.5 line-clamp-2",
                                  tier === "BLACK" ? "text-white/90" : "text-current/90"
                                )}
                              >
                                {entry.propertyWeek.description ?? `Sem. ${entry.propertyWeek.weekIndex}`}
                              </div>
                              <div
                                className={cn(
                                  "mt-0.5 text-[8px] font-medium",
                                  tier === "BLACK" ? "text-amber-200/95" : "text-vivant-navy/80"
                                )}
                              >
                                Classe: {tierLabelPt(tier)}
                              </div>
                            </>
                          ) : (
                            <div className="text-xs font-bold pt-5">{entry.semana}</div>
                          )}
                          {entry.cota ? (
                            <div
                              className={cn(
                                "mt-auto pt-1.5 border-t",
                                tier === "BLACK" ? "border-white/20" : "border-current/15"
                              )}
                            >
                              <p
                                className={cn(
                                  "text-[10px] font-semibold leading-tight line-clamp-2",
                                  tier === "BLACK" ? "text-white" : "text-current"
                                )}
                              >
                                {entry.cota.cotista.name}
                              </p>
                              <p
                                className={cn(
                                  "text-[9px] mt-0.5 font-medium truncate",
                                  tier === "BLACK" ? "text-white/85" : "opacity-90"
                                )}
                              >
                                Cota {entry.cota.numeroCota}
                              </p>
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog
        open={detailSemana !== null}
        onOpenChange={(open) => {
          if (!open) setDetailSemana(null);
        }}
      >
        <DialogContent className="max-h-[min(90vh,720px)] max-w-lg overflow-y-auto sm:max-w-lg">
          {!semanaDetail && detailSemana !== null ? (
            <p className="text-sm text-gray-600">Semana não encontrada nos dados carregados.</p>
          ) : null}
          {semanaDetail ? (
            <>
              <DialogHeader>
                <DialogTitle>
                  {semanaDetail.propertyWeek ? (
                    <>
                      {semanaDetail.propertyWeek.description ??
                        `Semana ${semanaDetail.propertyWeek.weekIndex}`}{" "}
                      ·{" "}
                      {format(parseISO(semanaDetail.propertyWeek.startDate), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}{" "}
                      a{" "}
                      {format(parseISO(semanaDetail.propertyWeek.endDate), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </>
                  ) : (
                    <>Semana {semanaDetail.semana} · {data.ano}</>
                  )}
                </DialogTitle>
                <DialogDescription>
                  Detalhes da cota, do cotista e da reserva para a semana selecionada.
                </DialogDescription>
              </DialogHeader>
              {(() => {
                const detailOpKey = semanaDetail.propertyWeek
                  ? operationalKeyFromCalendarioPortalEntry(semanaDetail)
                  : null;
                return (
                  <div className="space-y-3 text-left">
                    {semanaDetail.propertyWeek && detailOpKey ? (
                      <div className="flex flex-wrap items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                        <div>
                          <span className="text-gray-600">Classe: </span>
                          <span className="font-semibold text-vivant-navy">
                            {tierLabelPt(semanaDetail.propertyWeek.tier)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600">Status: </span>
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-xs font-semibold shadow-sm",
                              operationalStatusBadgeClass(detailOpKey)
                            )}
                          >
                            {OPERATIONAL_STATUS_LABEL[detailOpKey]}
                          </span>
                        </div>
                      </div>
                    ) : null}
                    {semanaDetail.origemCota === "ALOCACAO" &&
                      semanaDetail.cota &&
                      !semanaDetail.reserva && (
                        <p className="text-sm text-emerald-800 bg-emerald-50 rounded px-2 py-1">
                          Semana atribuída à cota no planejamento de distribuição (sem reserva
                          registrada ainda).
                        </p>
                      )}
                    {semanaDetail.reserva ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-gray-600">Status da reserva:</span>
                          <span
                            className={cn(
                              "shrink-0 px-2 py-1 rounded text-xs font-semibold",
                              semanaDetail.reserva.status === "CONFIRMADA" &&
                                "bg-green-100 text-green-800",
                              semanaDetail.reserva.status === "PENDENTE" &&
                                "bg-yellow-100 text-yellow-800",
                              semanaDetail.reserva.status === "DISPONIVEL_TROCA" &&
                                "bg-blue-100 text-blue-800"
                            )}
                          >
                            {getStatusLabel(semanaDetail.reserva.status)}
                          </span>
                        </div>

                        {semanaDetail.cota && (
                          <>
                            <div className="flex items-center justify-between gap-2 border-b border-slate-100 py-1">
                              <span className="text-sm font-medium text-gray-600">Cotista</span>
                              <span className="text-sm font-semibold text-right">
                                {semanaDetail.cota.cotista.name}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-2 border-b border-slate-100 py-1">
                              <span className="text-sm font-medium text-gray-600">Cota</span>
                              <span className="text-sm font-semibold">{semanaDetail.cota.numeroCota}</span>
                            </div>
                          </>
                        )}

                        <div className="flex items-center justify-between gap-2 py-1">
                          <span className="text-sm font-medium text-gray-600">Check-in</span>
                          <span className="text-sm">
                            {format(parseISO(semanaDetail.reserva.dataInicio), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2 py-1">
                          <span className="text-sm font-medium text-gray-600">Check-out</span>
                          <span className="text-sm">
                            {format(parseISO(semanaDetail.reserva.dataFim), "dd/MM/yyyy", {
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {semanaDetail.cota && semanaDetail.origemCota === "ALOCACAO" && (
                          <div className="space-y-2 rounded-md border border-slate-100 bg-slate-50/80 p-3">
                            <p className="text-sm font-medium text-gray-700">Cotista (distribuição)</p>
                            <p className="text-base font-semibold text-vivant-navy">
                              {semanaDetail.cota.cotista.name}
                            </p>
                            <p className="text-sm text-gray-700">
                              Cota <strong>{semanaDetail.cota.numeroCota}</strong>
                            </p>
                          </div>
                        )}
                        {!semanaDetail.cota && (
                          <p className="text-sm text-gray-600">
                            Semana disponível no calendário oficial (sem cota associada nesta visão).
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-vivant-navy">
                {data.calendario.filter((s) => s.reserva?.status === "CONFIRMADA").length}
              </p>
              <p className="text-xs text-gray-600">Reservas confirmadas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">
                {data.calendario.filter((s) => s.reserva?.status === "PENDENTE").length}
              </p>
              <p className="text-xs text-gray-600">Pendentes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">
                {data.calendario.filter((s) => s.disponivel).length}
              </p>
              <p className="text-xs text-gray-600">Livres (sem reserva e sem atribuição)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{nAlocacao}</p>
              <p className="text-xs text-gray-600">Atribuídas (distribuição)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {data.calendario.filter((s) => s.reserva?.status === "DISPONIVEL_TROCA").length}
              </p>
              <p className="text-xs text-gray-600">Em troca</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
