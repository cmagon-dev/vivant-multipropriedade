"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PropertyAnalysis } from "@/lib/math/calculator";
import { TrendingUp, Shield, DollarSign, PiggyBank } from "lucide-react";

interface AnalysisCardsProps {
  analysis: PropertyAnalysis | null;
}

export function AnalysisCards({ analysis }: AnalysisCardsProps): JSX.Element {
  if (!analysis) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">
          Preencha o formulário acima para visualizar a análise financeira.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Linha 1: VGV Total e Margem Operacional */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              VGV Total
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {analysis.vgvTotal}
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Valor Geral de Vendas (Receita Bruta)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">
              Margem Operacional
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              {analysis.margemOperacional}
            </div>
            <p className="text-xs text-green-700 mt-1">
              Lucro Final / VGV Total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Linha 2: Detalhamento Financeiro */}
      <Card>
        <CardHeader>
          <CardTitle>Detalhamento Financeiro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium text-slate-700">
              Imposto RET (4%)
            </span>
            <span className="text-sm font-bold text-red-600">
              - {analysis.impostoRET}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium text-slate-700">
              VGV Líquido (após RET)
            </span>
            <span className="text-sm font-bold text-slate-900">
              {analysis.vgvLiquido}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-sm font-medium text-slate-700">
              CAPEX Mobília
            </span>
            <span className="text-sm font-bold text-red-600">
              - {analysis.capexMobilia}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Linha 3: Split 50/50 e Saldo Final */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">
              Bolsão de Garantia
            </CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {analysis.contaEscrow}
            </div>
            <p className="text-xs text-purple-700 mt-1">
              50% do VGV Líquido - Conta Escrow
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">
              Saldo Final
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">
              {analysis.saldoFinal}
            </div>
            <p className="text-xs text-orange-700 mt-1">
              Operacional Vivant (50%) - CAPEX
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
