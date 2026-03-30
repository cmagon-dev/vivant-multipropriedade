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
import { Calendar, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PropertyWeekBrief {
  id: string;
  label: string | null;
  weekIndex: number;
  startDate: string;
  endDate: string;
  isBlocked: boolean;
  seasonType: string;
}

interface CalendarioEntry {
  semana: number;
  propertyWeek: PropertyWeekBrief | null;
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
  cotasComDireito: Array<{
    id: string;
    numeroCota: string;
    cotista: { id: string; name: string; email: string };
  }>;
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

/** Fallback quando não há PropertyWeek no banco: grade antiga 1–52 (legado). */
const getSemanasDoMesLegacy = (mes: number): number[] => {
  const semanasPorMes = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9],
    [10, 11, 12, 13],
    [14, 15, 16, 17, 18],
    [19, 20, 21, 22],
    [23, 24, 25, 26, 27],
    [28, 29, 30, 31],
    [32, 33, 34, 35],
    [36, 37, 38, 39, 40],
    [41, 42, 43, 44],
    [45, 46, 47, 48],
    [49, 50, 51, 52],
  ];
  return semanasPorMes[mes] || [];
};

const getStatusColor = (entry: CalendarioEntry) => {
  if (entry.reserva) {
    switch (entry.reserva.status) {
      case "CONFIRMADA":
      case "EM_USO":
      case "FINALIZADA":
        return "bg-green-100 hover:bg-green-200 border-green-400 text-green-800";
      case "PENDENTE":
        return "bg-yellow-100 hover:bg-yellow-200 border-yellow-400 text-yellow-800";
      case "DISPONIVEL_TROCA":
        return "bg-blue-100 hover:bg-blue-200 border-blue-400 text-blue-800";
      case "CANCELADA":
      case "NAO_UTILIZADA":
        return "bg-red-100 hover:bg-red-200 border-red-400 text-red-800";
      default:
        return "bg-gray-100 hover:bg-gray-200 border-gray-300";
    }
  }
  if (entry.origemCota === "ALOCACAO" && entry.cota) {
    return "bg-emerald-50 hover:bg-emerald-100 border-emerald-400 text-emerald-900";
  }
  if (entry.propertyWeek?.isBlocked) {
    return "bg-red-50 hover:bg-red-100 border-red-300 text-red-900";
  }
  return "bg-gray-100 hover:bg-gray-200 border-gray-300";
};

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

function agruparPorMes(
  calendario: CalendarioEntry[],
  ano: number
): CalendarioEntry[][] {
  const months: CalendarioEntry[][] = Array.from({ length: 12 }, () => []);
  const temPlanejamento = calendario.some((e) => e.propertyWeek?.startDate);

  if (temPlanejamento) {
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

  for (let mes = 0; mes < 12; mes++) {
    const nums = getSemanasDoMesLegacy(mes);
    for (const n of nums) {
      const e = calendario.find((c) => c.semana === n);
      if (e) months[mes].push(e);
    }
  }
  return months;
}

function tituloCelula(entry: CalendarioEntry): string {
  let base: string;
  if (entry.propertyWeek) {
    const pw = entry.propertyWeek;
    const a = format(parseISO(pw.startDate), "dd/MM/yyyy", { locale: ptBR });
    const b = format(parseISO(pw.endDate), "dd/MM/yyyy", { locale: ptBR });
    base = `${pw.label ?? "Semana " + pw.weekIndex} · ${a} – ${b}`;
  } else {
    base = `Semana ${entry.semana} (sem planejamento de datas)`;
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
  const [semanaHover, setSemanaHover] = useState<number | null>(null);

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

  const getSemanaInfo = (numeroSemana: number) => {
    if (!data) return null;
    return data.calendario.find((s) => s.semana === numeroSemana) ?? null;
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

  const semanaInfo = semanaHover ? getSemanaInfo(semanaHover) : null;

  const nAlocacao = data.calendario.filter((s) => s.origemCota === "ALOCACAO").length;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-vivant-green" />
              Calendário Anual - {data.propriedade.name}
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
              Não há <strong>semanas planejadas</strong> para {data.ano}. Gere o calendário em{" "}
              <strong>Planejamento de semanas</strong> para ver intervalos reais (datas) aqui.
            </p>
          )}
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-100 border-2 border-gray-300 rounded" />
              <span>Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-50 border-2 border-emerald-400 rounded" />
              <span>Alocada (rodízio)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-100 border-2 border-green-400 rounded" />
              <span>Reserva confirmada / uso</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-100 border-2 border-yellow-400 rounded" />
              <span>Pendente</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-100 border-2 border-blue-400 rounded" />
              <span>Disponível p/ Troca</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-100 border-2 border-red-400 rounded" />
              <span>Cancelada / bloqueada</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
                  <p className="text-xs text-gray-500">Nenhuma semana neste mês ({data.ano}).</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {semanasDoMes.map((entry) => (
                      <div
                        key={entry.semana + (entry.propertyWeek?.id ?? "")}
                        className={cn(
                          "relative flex flex-col rounded border-2 p-2 text-left cursor-pointer transition-all min-h-[5.5rem]",
                          getStatusColor(entry)
                        )}
                        onMouseEnter={() => setSemanaHover(entry.semana)}
                        onMouseLeave={() => setSemanaHover(null)}
                        title={tituloCelula(entry)}
                      >
                        {entry.propertyWeek ? (
                          <>
                            <div className="text-[10px] font-bold leading-tight text-current">
                              {format(parseISO(entry.propertyWeek.startDate), "dd/MM", {
                                locale: ptBR,
                              })}{" "}
                              –{" "}
                              {format(parseISO(entry.propertyWeek.endDate), "dd/MM", {
                                locale: ptBR,
                              })}
                            </div>
                            <div className="text-[9px] mt-0.5 line-clamp-1 text-current/80">
                              {entry.propertyWeek.label ?? `Sem. ${entry.propertyWeek.weekIndex}`}
                            </div>
                          </>
                        ) : (
                          <div className="text-xs font-bold">{entry.semana}</div>
                        )}
                        {entry.cota ? (
                          <div className="mt-auto pt-1.5 border-t border-current/15">
                            <p className="text-[10px] font-semibold leading-tight line-clamp-2 text-current">
                              {entry.cota.cotista.name}
                            </p>
                            <p className="text-[9px] mt-0.5 font-medium opacity-90 truncate">
                              {entry.cota.numeroCota}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {semanaInfo && (
        <Card className="border-2 border-vivant-navy">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">
              {semanaInfo.propertyWeek ? (
                <>
                  {semanaInfo.propertyWeek.label ?? `Semana ${semanaInfo.propertyWeek.weekIndex}`}{" "}
                  ·{" "}
                  {format(parseISO(semanaInfo.propertyWeek.startDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}{" "}
                  a{" "}
                  {format(parseISO(semanaInfo.propertyWeek.endDate), "dd/MM/yyyy", {
                    locale: ptBR,
                  })}
                </>
              ) : (
                <>Semana {semanaInfo.semana} · {data.ano}</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {semanaInfo.origemCota === "ALOCACAO" && semanaInfo.cota && !semanaInfo.reserva && (
              <p className="text-sm text-emerald-800 bg-emerald-50 rounded px-2 py-1">
                Semana distribuída no ciclo de rodízio (sem reserva registrada ainda).
              </p>
            )}
            {semanaInfo.reserva ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs font-semibold",
                      semanaInfo.reserva.status === "CONFIRMADA" &&
                        "bg-green-100 text-green-800",
                      semanaInfo.reserva.status === "PENDENTE" &&
                        "bg-yellow-100 text-yellow-800",
                      semanaInfo.reserva.status === "DISPONIVEL_TROCA" &&
                        "bg-blue-100 text-blue-800"
                    )}
                  >
                    {getStatusLabel(semanaInfo.reserva.status)}
                  </span>
                </div>

                {semanaInfo.cota && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Cotista:</span>
                      <span className="text-sm font-semibold">{semanaInfo.cota.cotista.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Cota:</span>
                      <span className="text-sm font-semibold">{semanaInfo.cota.numeroCota}</span>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Check-in:</span>
                  <span className="text-sm">
                    {format(parseISO(semanaInfo.reserva.dataInicio), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Check-out:</span>
                  <span className="text-sm">
                    {format(parseISO(semanaInfo.reserva.dataFim), "dd/MM/yyyy", {
                      locale: ptBR,
                    })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {semanaInfo.cota && semanaInfo.origemCota === "ALOCACAO" && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-600">Cotista (rodízio):</p>
                    <p className="text-sm font-semibold">{semanaInfo.cota.cotista.name}</p>
                    <p className="text-sm">Cota {semanaInfo.cota.numeroCota}</p>
                  </div>
                )}
                {!semanaInfo.cota && (
                  <p className="text-sm text-gray-600">Semana disponível no planejamento.</p>
                )}

                {semanaInfo.cotasComDireito.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Cotas com direito (config. legado):
                    </p>
                    <div className="space-y-1">
                      {semanaInfo.cotasComDireito.map((c) => (
                        <div key={c.id} className="text-xs bg-vivant-green/10 px-2 py-1 rounded">
                          {c.cotista.name} - Cota {c.numeroCota}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

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
              <p className="text-xs text-gray-600">Livres (sem reserva e sem rodízio)</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{nAlocacao}</p>
              <p className="text-xs text-gray-600">Alocadas (rodízio)</p>
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
