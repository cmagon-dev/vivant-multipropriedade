"use client";

import { useState } from "react";
import { PropertyForm } from "@/components/dashboard/property-form";
import { AnalysisCards } from "@/components/dashboard/analysis-cards";
import {
  calculateVivantFlow,
  type PropertyAnalysis,
} from "@/lib/math/calculator";
import type { PropertyInputFormData } from "@/lib/validations/property";

export default function SimuladorPage(): JSX.Element {
  const [analysis, setAnalysis] = useState<PropertyAnalysis | null>(null);

  const handleFormSubmit = (data: PropertyInputFormData): void => {
    const result = calculateVivantFlow({
      precoCota: data.precoCota,
      quantidadeCotas: data.quantidadeCotas,
      custoMobilia: data.custoMobilia,
    });
    setAnalysis(result);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Simulador de Análise Financeira
        </h1>
        <p className="text-slate-600">
          Calcule o fluxo financeiro completo da operação de multipropriedade
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PropertyForm onSubmit={handleFormSubmit} />
        </div>

        <div className="lg:col-span-2">
          <AnalysisCards analysis={analysis} />
        </div>
      </div>

      {analysis && (
        <div className="mt-8 p-6 bg-slate-100 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            Resumo da Metodologia
          </h3>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <strong>1.</strong> VGV Total = Preço da Cota × Quantidade de
              Cotas
            </p>
            <p>
              <strong>2.</strong> Imposto RET = 4% do VGV Total
            </p>
            <p>
              <strong>3.</strong> VGV Líquido = VGV Total - Imposto RET
            </p>
            <p>
              <strong>4.</strong> Split 50/50 do VGV Líquido:
            </p>
            <p className="ml-6">• 50% → Conta Escrow (Bolsão de Garantia)</p>
            <p className="ml-6">• 50% → Operacional Vivant</p>
            <p>
              <strong>5.</strong> Saldo Final = Operacional Vivant - CAPEX
              Mobília
            </p>
            <p>
              <strong>6.</strong> Margem Operacional = (Saldo Final / VGV
              Total) × 100%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
