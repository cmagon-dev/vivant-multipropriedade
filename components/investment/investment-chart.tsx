"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InvestmentAnalysis } from "@/lib/math/investment-calculator";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface InvestmentChartProps {
  analysis: InvestmentAnalysis | null;
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

  // Formatar valores para o tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border-2 border-slate-200 rounded-lg shadow-xl p-4">
          <p className="font-semibold text-vivant-navy mb-2">
            Ano {payload[0].payload.ano}
          </p>
          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-400 rounded-full" />
              <span className="text-slate-600">Investimento:</span>
              <span className="font-semibold">
                {formatCurrency(payload[0].payload.investimento)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-vivant-green rounded-full" />
              <span className="text-slate-600">Retorno Acumulado:</span>
              <span className="font-semibold text-vivant-green">
                {formatCurrency(payload[0].payload.retornoAcumulado)}
              </span>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-200">
              <span className="text-slate-600">Lucro até aqui:</span>
              <span className="font-bold text-vivant-gold-muted ml-2">
                {formatCurrency(
                  payload[0].payload.retornoAcumulado -
                    payload[0].payload.investimento
                )}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-2 border-vivant-navy/10">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50">
        <CardTitle className="flex items-center gap-2 text-vivant-navy">
          <TrendingUp className="w-6 h-6" />
          Evolução do Retorno Acumulado (5 Anos)
        </CardTitle>
        <p className="text-sm text-slate-600 mt-1">
          Comparação entre investimento inicial e receita acumulada ao longo do tempo
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={analysis.chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorRetorno" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              
              <XAxis
                dataKey="ano"
                label={{
                  value: "Anos",
                  position: "insideBottom",
                  offset: -5,
                  style: { fontSize: 14, fill: "#475569" },
                }}
                tick={{ fill: "#64748b" }}
              />
              
              <YAxis
                tickFormatter={(value) => {
                  if (value >= 1000000) {
                    return `R$ ${(value / 1000000).toFixed(1)}M`;
                  }
                  return `R$ ${(value / 1000).toFixed(0)}K`;
                }}
                tick={{ fill: "#64748b" }}
                width={80}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              <Legend
                wrapperStyle={{
                  paddingTop: "20px",
                }}
                iconType="circle"
              />
              
              {/* Linha do Investimento (reta) */}
              <Line
                type="monotone"
                dataKey="investimento"
                stroke="#94a3b8"
                strokeWidth={3}
                dot={false}
                name="Investimento Inicial"
                strokeDasharray="5 5"
              />
              
              {/* Área do Retorno Acumulado */}
              <Area
                type="monotone"
                dataKey="retornoAcumulado"
                stroke="#10B981"
                strokeWidth={3}
                fill="url(#colorRetorno)"
                name="Retorno Acumulado"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legenda Adicional */}
        <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-4 h-4 bg-slate-400 rounded-full mt-0.5" />
            <div>
              <p className="font-semibold text-slate-700">Linha de Investimento</p>
              <p className="text-xs text-slate-600">
                Representa o capital inicial aportado (constante)
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-vivant-green/5 rounded-lg">
            <div className="w-4 h-4 bg-vivant-green rounded-full mt-0.5" />
            <div>
              <p className="font-semibold text-vivant-green">Curva de Retorno</p>
              <p className="text-xs text-slate-600">
                Mostra o total recebido acumulado (crescente com juros + IPCA)
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
