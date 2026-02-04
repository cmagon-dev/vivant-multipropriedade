"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InvestmentAnalysis } from "@/lib/math/investment-calculator";
import { FileText, Calendar } from "lucide-react";

interface CashFlowTableProps {
  analysis: InvestmentAnalysis | null;
}

export function CashFlowTable({ analysis }: CashFlowTableProps): JSX.Element {
  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-vivant-navy">
            <FileText className="w-6 h-6" />
            Tabela de Fluxo de Caixa Anual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-400">
            <p>Aguardando dados da simulação...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calcular totais
  const totalMensal = analysis.fluxoAnualAgregado.reduce(
    (sum, item) => sum + item.recebimentoMensal,
    0
  );
  const totalBaloes = analysis.fluxoAnualAgregado.reduce(
    (sum, item) => sum + item.balaoAnual,
    0
  );
  const totalGeral = analysis.fluxoAnualAgregado.reduce(
    (sum, item) => sum + item.totalAno,
    0
  );

  return (
    <Card className="border-2 border-vivant-navy/10">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-purple-50">
        <CardTitle className="flex items-center gap-2 text-vivant-navy">
          <FileText className="w-6 h-6" />
          Fluxo de Caixa Anual Detalhado
        </CardTitle>
        <p className="text-sm text-slate-600 mt-1">
          Recebimentos mensais e balões anuais consolidados por ano
        </p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-vivant-navy text-white">
                <th className="py-4 px-4 text-left font-semibold rounded-tl-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Ano
                  </div>
                </th>
                <th className="py-4 px-4 text-right font-semibold">
                  <div className="flex flex-col items-end">
                    <span>Recebimento Mensal</span>
                    <span className="text-xs text-white/70 font-normal">
                      (Soma das 12 parcelas)
                    </span>
                  </div>
                </th>
                <th className="py-4 px-4 text-right font-semibold">
                  <div className="flex flex-col items-end">
                    <span>Balão Anual</span>
                    <span className="text-xs text-white/70 font-normal">
                      (Reforço do ano)
                    </span>
                  </div>
                </th>
                <th className="py-4 px-4 text-right font-semibold rounded-tr-lg">
                  <div className="flex flex-col items-end">
                    <span>Total no Ano</span>
                    <span className="text-xs text-white/70 font-normal">
                      (Mensal + Balão)
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {analysis.fluxoAnualAgregado.map((row, index) => (
                <tr
                  key={row.ano}
                  className={`
                    border-b border-slate-200 transition-colors hover:bg-slate-50
                    ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                  `}
                >
                  <td className="py-4 px-4 font-semibold text-vivant-navy">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-vivant-navy rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {row.ano}
                      </div>
                      <span>Ano {row.ano}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(row.recebimentoMensal)}
                      </span>
                      <span className="text-xs text-slate-500">
                        ~{formatCurrency(row.recebimentoMensal / 12)}/mês
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-semibold text-purple-600">
                      {formatCurrency(row.balaoAnual)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-vivant-green text-lg">
                        {formatCurrency(row.totalAno)}
                      </span>
                      <span className="text-xs text-slate-500">
                        no ano {row.ano}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-vivant-gold-muted/20 to-vivant-gold-muted/10 font-bold border-t-2 border-vivant-gold-muted">
                <td className="py-5 px-4 text-vivant-navy rounded-bl-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-vivant-gold-muted rounded-full flex items-center justify-center text-white text-lg">
                      Σ
                    </div>
                    <span className="text-lg">TOTAIS</span>
                  </div>
                </td>
                <td className="py-5 px-4 text-right text-blue-700 text-lg">
                  {formatCurrency(totalMensal)}
                </td>
                <td className="py-5 px-4 text-right text-purple-700 text-lg">
                  {formatCurrency(totalBaloes)}
                </td>
                <td className="py-5 px-4 text-right rounded-br-lg">
                  <div className="flex flex-col items-end">
                    <span className="text-vivant-green text-2xl">
                      {formatCurrency(totalGeral)}
                    </span>
                    <span className="text-xs text-slate-600 font-normal">
                      Total a receber
                    </span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full" />
              Carteira Mensal (50%)
            </h4>
            <p className="text-sm text-blue-800">
              Parcelas mensais calculadas pela <strong>Tabela Price</strong> com
              correção de IPCA aplicada ao saldo devedor antes dos juros.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-600 rounded-full" />
              Carteira Anual (50%)
            </h4>
            <p className="text-sm text-purple-800">
              Balões anuais calculados com <strong>juros compostos</strong> e
              correção de IPCA acumulada ano a ano.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
