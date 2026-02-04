"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { InvestmentAnalysis } from "@/lib/math/investment-calculator";
import { 
  TrendingUp, 
  DollarSign, 
  PiggyBank, 
  BarChart3,
  Shield,
  CheckCircle2,
} from "lucide-react";

interface InvestmentKPIsProps {
  analysis: InvestmentAnalysis | null;
}

export function InvestmentKPIs({ analysis }: InvestmentKPIsProps): JSX.Element {
  if (!analysis) {
    return (
      <div className="space-y-6">
        {/* Badge de Segurança - Sempre Visível */}
        <div className="bg-gradient-to-r from-vivant-green to-emerald-600 text-white p-6 rounded-xl shadow-xl border-2 border-vivant-green">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">
                Capital 100% Lastreado em Garantia Real
              </h3>
              <div className="space-y-1 text-sm text-white/90">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Garantia Real: Imóveis de Alto Padrão</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Alienação Fiduciária das Cotas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Estrutura Preparada para Securitização (CRI)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mensagem de Aguardo */}
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
            <BarChart3 className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">
            Aguardando Simulação
          </h3>
          <p className="text-slate-500">
            Preencha o formulário ao lado para visualizar a análise financeira completa
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Badge de Segurança */}
      <div className="bg-gradient-to-r from-vivant-green to-emerald-600 text-white p-6 rounded-xl shadow-xl border-2 border-vivant-green">
        <div className="flex items-start gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">
              Capital 100% Lastreado em Garantia Real
            </h3>
            <div className="space-y-1 text-sm text-white/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Garantia Real: Imóveis de Alto Padrão</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Alienação Fiduciária das Cotas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Estrutura Preparada para Securitização (CRI)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Total Investido */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              Valor Investido
            </CardTitle>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">
              {analysis.valorInvestido}
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Capital inicial aportado
            </p>
          </CardContent>
        </Card>

        {/* Total a Receber */}
        <Card className="border-2 border-vivant-green/30 bg-gradient-to-br from-vivant-green/10 to-vivant-green/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-vivant-green">
              Total a Receber
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-vivant-green" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-vivant-green">
              {analysis.totalReceber}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs bg-vivant-green/20 text-vivant-green px-2 py-0.5 rounded font-semibold">
                BRUTO
              </span>
              <p className="text-xs text-slate-600">
                Receita total em 5 anos
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lucro Líquido */}
        <Card className="border-2 border-vivant-gold-muted/30 bg-gradient-to-br from-vivant-gold-muted/10 to-vivant-gold-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-vivant-gold-muted">
              Lucro Líquido
            </CardTitle>
            <PiggyBank className="h-5 w-5 text-vivant-gold-muted" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-vivant-gold-muted">
              {analysis.lucroLiquido}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Total - Investido
            </p>
          </CardContent>
        </Card>

        {/* ROI */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">
              ROI (Retorno Total)
            </CardTitle>
            <BarChart3 className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">
              {analysis.roi}
            </div>
            <p className="text-xs text-purple-700 mt-1">
              Percentual de ganho total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TIR - Destaque Especial */}
      <Card className="border-2 border-vivant-green bg-gradient-to-r from-vivant-green/5 to-emerald-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-6 h-6 text-vivant-green" />
                <h3 className="text-lg font-semibold text-vivant-navy">
                  TIR - Taxa Interna de Retorno
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                Rentabilidade anualizada considerando todo o fluxo de caixa
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-vivant-green">
                {analysis.tir}
              </div>
              <p className="text-xs text-vivant-green/70 mt-1">
                Anualizada
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informação Adicional */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <h4 className="font-semibold text-sm text-slate-700 mb-2 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-vivant-green" />
          Estrutura do Recebimento:
        </h4>
        <div className="grid md:grid-cols-2 gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>50% em <strong>60 parcelas mensais</strong> (Tabela Price + IPCA)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span>50% em <strong>5 balões anuais</strong> (Reforços + Juros)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
