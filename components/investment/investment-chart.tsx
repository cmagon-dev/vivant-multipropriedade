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
import type { InvestmentAnalysis } from "@/lib/math/investment-calculator";
import { TrendingUp } from "lucide-react";

interface InvestmentChartProps {
  analysis: InvestmentAnalysis | null;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;

  const mes = payload[0]?.payload?.mes as number;
  const ano = Math.ceil(mes / 12);
  const mesAno = mes % 12 === 0 ? 12 : mes % 12;

  const isYearEnd = mes % 12 === 0;
  const temEntrada = (payload[0]?.payload?.entradaMes ?? 0) > 0;
  const temReforco = (payload[0]?.payload?.reforcosMes ?? 0) > 0;
  const temParcela = (payload[0]?.payload?.parcelasMes ?? 0) > 0;

  return (
    <div className="bg-white border-2 border-vivant-green/30 rounded-xl p-3 shadow-xl text-sm min-w-[220px]">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
        <span className="font-bold text-vivant-navy">Mês {mes}</span>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isYearEnd
              ? "bg-vivant-navy text-white"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          Ano {ano} · {String(mesAno).padStart(2, "0")}/{ano}
        </span>
      </div>

      {/* Recebimentos do mês */}
      <div className="space-y-1 mb-2">
        {temEntrada && (
          <div className="flex justify-between gap-3">
            <span className="text-vivant-green text-xs">Entrada:</span>
            <span className="font-semibold text-vivant-green text-xs">
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
            <span className="text-purple-600 text-xs">Reforço anual:</span>
            <span className="font-semibold text-purple-600 text-xs">
              {formatCurrencyFull((payload[0]?.payload?.reforcosMes ?? 0) * 0.7)}
            </span>
          </div>
        )}
      </div>

      {/* Acumulado e aporte */}
      <div className="border-t border-slate-100 pt-2 space-y-1">
        {payload.map(
          (entry: { name: string; value: number; color: string }) => (
            <div key={entry.name} className="flex justify-between gap-3">
              <span style={{ color: entry.color }} className="font-medium text-xs">
                {entry.name}:
              </span>
              <span className="font-bold text-xs">
                {formatCurrencyFull(entry.value)}
              </span>
            </div>
          )
        )}
      </div>

      {/* Badge fechamento de ano */}
      {isYearEnd && (
        <div className="mt-2 bg-vivant-navy rounded-lg px-2 py-1 text-center">
          <span className="text-xs font-bold text-white">
            ✦ Fechamento do Ano {ano}
          </span>
        </div>
      )}
    </div>
  );
}

// Tick customizado do eixo X — exibe apenas nos múltiplos de 12 (fechamento de ano)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomXAxisTick({ x, y, payload }: any) {
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

export function InvestmentChart({ analysis }: InvestmentChartProps): JSX.Element {
  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-vivant-navy">
            <TrendingUp className="w-6 h-6" />
            Evolução do Retorno Acumulado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center text-slate-400">
            <p>Aguardando dados da simulação...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const valorInvestidoNum = parseFloat(
    analysis.valorInvestido
      .replace(/\s/g, "")
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
  );

  // Dados mensais para o gráfico
  const data = analysis.fluxoMensal
    .filter((m) => m.fluxoBruto > 0 || m.fluxoCliente > 0)
    .map((m) => ({
      mes: m.mes,
      "Retorno Acumulado (seu)": Math.round(m.fluxoClienteAcumulado),
      "Valor Aportado": Math.round(valorInvestidoNum),
      // campos extras para o tooltip
      entradaMes: m.entradaMes,
      parcelasMes: m.parcelasMes,
      reforcosMes: m.reforcosMes,
      fluxoCliente: m.fluxoCliente,
    }));

  // Linhas de fechamento de ano presentes nos dados
  const anosPresentes = Array.from(
    new Set(data.map((d) => d.mes).filter((m) => m % 12 === 0))
  );

  return (
    <Card className="border-2 border-vivant-navy/10 shadow-md">
      <CardHeader className="border-b border-vivant-green/20">
        <CardTitle className="flex items-center gap-2 text-vivant-navy">
          <TrendingUp className="w-6 h-6 text-vivant-green" />
          Evolução do Retorno Acumulado — Sua Parte (70%)
        </CardTitle>
        <p className="text-sm text-slate-500 mt-0.5">
          Passe o mouse sobre a linha para ver os detalhes de cada mês
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-72 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRetornoCapital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradAporteCapital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.02} />
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
                width={80}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#10B981", strokeWidth: 1.5, strokeDasharray: "4 2" }}
              />

              <Legend wrapperStyle={{ paddingTop: "16px", fontSize: "13px" }} />

              {/* Linha de referência do valor aportado */}
              <ReferenceLine
                y={valorInvestidoNum}
                stroke="#94a3b8"
                strokeDasharray="6 3"
                strokeWidth={1.5}
              />

              {/* Linhas verticais de fechamento de ano */}
              {anosPresentes.map((mes) => (
                <ReferenceLine
                  key={mes}
                  x={mes}
                  stroke="#1A2F4B"
                  strokeDasharray="3 4"
                  strokeWidth={1}
                  strokeOpacity={0.2}
                />
              ))}

              {/* Linha do aporte inicial (tracejada) */}
              <Area
                type="monotone"
                dataKey="Valor Aportado"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="6 3"
                fill="url(#gradAporteCapital)"
                dot={false}
                activeDot={false}
              />

              {/* Área do retorno acumulado */}
              <Area
                type="monotone"
                dataKey="Retorno Acumulado (seu)"
                stroke="#10B981"
                strokeWidth={2}
                fill="url(#gradRetornoCapital)"
                dot={false}
                activeDot={{ r: 5, fill: "#10B981", stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
          <div className="bg-vivant-green/5 border border-vivant-green/20 rounded-lg p-3">
            <p className="font-semibold text-vivant-green mb-1">
              Linha Verde — Seus Recebimentos
            </p>
            <p className="text-slate-600 text-xs">
              Acumulado mensal dos seus 70% sobre entradas, parcelas e reforços.
              Passe o mouse para ver o detalhe de cada mês.
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="font-semibold text-slate-700 mb-1">
              Linha Cinza — Valor Aportado
            </p>
            <p className="text-slate-600 text-xs">
              Referência do capital inicial investido. Quando a linha verde ultrapassa
              esse patamar, seu retorno já superou o aporte original.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
