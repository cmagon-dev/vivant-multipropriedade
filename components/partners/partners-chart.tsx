"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { PartnersAnalysis } from "@/lib/math/partners-calculator";
import { BarChart3 } from "lucide-react";

interface PartnersChartProps {
  analysis: PartnersAnalysis;
}

function formatCurrencyShort(value: number): string {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}K`;
  return `R$ ${value.toFixed(0)}`;
}

function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

interface PartnersChartTooltipPayload {
  payload?: {
    mes: number;
    entradaMes: number;
    parcelasMes: number;
    reforcosMes: number;
    fluxoCliente: number;
    fluxoClienteAcumulado: number;
  };
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: PartnersChartTooltipPayload[]; label?: number }) {
  if (!active || !payload || !payload.length) return null;

  const mes    = payload[0]?.payload?.mes as number;
  const ano    = Math.ceil(mes / 12);
  const mesAno = mes % 12 === 0 ? 12 : mes % 12;

  // Detecta se é mês de fechamento de ano ou mês com reforço
  const isYearEnd   = mes % 12 === 0;
  const temEntrada  = (payload[0]?.payload?.entradaMes ?? 0) > 0;
  const temReforco  = (payload[0]?.payload?.reforcosMes ?? 0) > 0;
  const temParcela  = (payload[0]?.payload?.parcelasMes ?? 0) > 0;

  return (
    <div className="bg-white border-2 border-vivant-gold/30 rounded-xl p-3 shadow-xl text-sm min-w-[220px]">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
        <span className="font-bold text-vivant-navy">
          Mês {mes}
        </span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          isYearEnd
            ? "bg-vivant-navy text-vivant-gold"
            : "bg-slate-100 text-slate-600"
        }`}>
          Ano {ano} · {String(mesAno).padStart(2, "0")}/{ano}
        </span>
      </div>

      {/* Recebimentos do mês */}
      <div className="space-y-1 mb-2">
        {temEntrada && (
          <div className="flex justify-between gap-3">
            <span className="text-vivant-gold-muted text-xs">Entrada:</span>
            <span className="font-semibold text-vivant-gold-muted text-xs">
              {formatCurrencyFull((payload[0]?.payload?.entradaMes ?? 0) * 0.7)}
            </span>
          </div>
        )}
        {temParcela && (
          <div className="flex justify-between gap-3">
            <span className="text-vivant-navy/70 text-xs">Parcela:</span>
            <span className="font-semibold text-vivant-navy/80 text-xs">
              {formatCurrencyFull((payload[0]?.payload?.parcelasMes ?? 0) * 0.7)}
            </span>
          </div>
        )}
        {temReforco && (
          <div className="flex justify-between gap-3">
            <span className="text-[#8B6914] text-xs">Reforço anual:</span>
            <span className="font-semibold text-[#8B6914] text-xs">
              {formatCurrencyFull((payload[0]?.payload?.reforcosMes ?? 0) * 0.7)}
            </span>
          </div>
        )}
      </div>

      {/* Separador */}
      <div className="border-t border-slate-100 pt-2 space-y-1">
        {payload.map((entry: { name: string; value: number; color: string }) => (
          <div key={entry.name} className="flex justify-between gap-3">
            <span style={{ color: entry.color }} className="font-medium text-xs">
              {entry.name}:
            </span>
            <span className="font-bold text-xs">{formatCurrencyFull(entry.value)}</span>
          </div>
        ))}
      </div>

      {/* Badge fechamento de ano */}
      {isYearEnd && (
        <div className="mt-2 bg-vivant-navy rounded-lg px-2 py-1 text-center">
          <span className="text-xs font-bold text-vivant-gold">
            ✦ Fechamento do Ano {ano}
          </span>
        </div>
      )}
    </div>
  );
}

// Tick customizado do eixo X — mostra apenas nos meses múltiplos de 12
function CustomXAxisTick({ x, y, payload }: { x?: number; y?: number; payload?: { value: number } }) {
  const mes = payload?.value as number;
  if (!mes || mes % 12 !== 0) return null;
  const ano = mes / 12;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={14} textAnchor="middle" fill="#64748b" fontSize={11}>
        Ano {ano}
      </text>
    </g>
  );
}

export function PartnersChart({ analysis }: PartnersChartProps): JSX.Element {
  const valorImovelNum = parseFloat(
    analysis.valorImovel
      .replace(/\s/g, "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
  );

  // Dados mensais — inclui campos extras para o tooltip
  const data = analysis.fluxoMensal
    .filter((m) => m.fluxoBruto > 0 || m.fluxoCliente > 0)
    .map((m) => ({
      mes: m.mes,
      "Recebimento Acumulado (seu)": Math.round(m.fluxoClienteAcumulado),
      "Valor do Imóvel": Math.round(valorImovelNum),
      // Campos extras para o tooltip
      entradaMes:   m.entradaMes,
      parcelasMes:  m.parcelasMes,
      reforcosMes:  m.reforcosMes,
      fluxoCliente: m.fluxoCliente,
    }));

  return (
    <Card className="border-2 border-vivant-navy/20 shadow-md">
      <CardHeader className="border-b border-vivant-gold/20">
        <CardTitle className="flex items-center gap-2 text-vivant-navy">
          <BarChart3 className="w-5 h-5 text-vivant-gold-muted" />
          Evolução dos Recebimentos — Sua Parte (70%)
        </CardTitle>
        <p className="text-sm text-slate-500">
          Passe o mouse sobre a linha para ver os detalhes de cada mês
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-72 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradClientePartners" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#1A2F4B" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#1A2F4B" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradImovelPartners" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#C5A059" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#C5A059" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              <XAxis
                dataKey="mes"
                tick={<CustomXAxisTick />}
                axisLine={{ stroke: "#cbd5e1" }}
                tickLine={false}
                interval={0}
              />

              <YAxis
                tickFormatter={formatCurrencyShort}
                tick={{ fill: "#64748b", fontSize: 11 }}
                axisLine={{ stroke: "#cbd5e1" }}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#1A2F4B", strokeWidth: 1.5, strokeDasharray: "4 2" }}
              />

              <Legend wrapperStyle={{ paddingTop: "16px", fontSize: "13px" }} />

              {/* Linha de referência do valor do imóvel */}
              <ReferenceLine
                y={valorImovelNum}
                stroke="#C5A059"
                strokeDasharray="6 3"
                strokeWidth={1.5}
              />

              {/* Linhas de fechamento de ano */}
              {[12, 24, 36, 48, 60, 72].map((mes) => (
                <ReferenceLine
                  key={mes}
                  x={mes}
                  stroke="#1A2F4B"
                  strokeDasharray="3 4"
                  strokeWidth={1}
                  strokeOpacity={0.2}
                />
              ))}

              <Area
                type="monotone"
                dataKey="Valor do Imóvel"
                stroke="#C5A059"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                fill="url(#gradImovelPartners)"
                dot={false}
                activeDot={false}
              />

              <Area
                type="monotone"
                dataKey="Recebimento Acumulado (seu)"
                stroke="#1A2F4B"
                strokeWidth={2}
                fill="url(#gradClientePartners)"
                dot={false}
                activeDot={{ r: 5, fill: "#1A2F4B", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-vivant-navy/5 border border-vivant-navy/20 rounded-lg p-3">
            <p className="font-semibold text-vivant-navy mb-1">Linha Azul — Seus Recebimentos</p>
            <p className="text-vivant-navy/70 text-xs">
              Acumulado mensal dos seus 70% sobre entradas, parcelas e reforços. Passe o mouse para ver o detalhe de cada mês.
            </p>
          </div>
          <div className="bg-vivant-gold/10 border border-vivant-gold/30 rounded-lg p-3">
            <p className="font-semibold text-vivant-navy mb-1">Linha Dourada — Valor do Imóvel</p>
            <p className="text-vivant-navy/70 text-xs">
              Referência do valor original do imóvel. Quando a linha azul ultrapassa este patamar, você superou o valor do imóvel em recebimentos.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
