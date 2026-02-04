"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  investmentInputSchema,
  type InvestmentInputFormData,
} from "@/lib/validations/investment";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp } from "lucide-react";

interface InvestmentFormProps {
  onSubmit: (data: InvestmentInputFormData) => void;
}

export function InvestmentForm({ onSubmit }: InvestmentFormProps): JSX.Element {
  const [ipcaValue, setIpcaValue] = useState(5);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvestmentInputFormData>({
    resolver: zodResolver(investmentInputSchema),
    defaultValues: {
      valorInvestido: 1000000,
      ipcaProjetado: 0.05,
    },
  });

  const handleIpcaChange = (values: number[]) => {
    const percentage = values[0];
    setIpcaValue(percentage);
    setValue("ipcaProjetado", percentage / 100);
  };

  const handleFormSubmit = (data: InvestmentInputFormData) => {
    onSubmit(data);
  };

  return (
    <Card className="border-2 border-vivant-navy/20 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-vivant-navy to-[#2A4F6B] text-white">
        <CardTitle className="text-2xl font-serif flex items-center gap-3">
          <Calculator className="w-7 h-7" />
          Simulador de Investimento
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          {/* Valor Investido */}
          <div className="space-y-3">
            <Label 
              htmlFor="valorInvestido" 
              className="text-lg font-semibold text-vivant-navy flex items-center gap-2"
            >
              <TrendingUp className="w-5 h-5" />
              Valor do Aporte / Carteira
            </Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-vivant-navy">
                R$
              </span>
              <Input
                id="valorInvestido"
                type="number"
                step="10000"
                placeholder="1.000.000"
                {...register("valorInvestido", { valueAsNumber: true })}
                className={`text-2xl font-bold h-16 pl-14 pr-4 text-vivant-navy border-2 ${
                  errors.valorInvestido
                    ? "border-red-500 focus:border-red-500"
                    : "border-vivant-navy/30 focus:border-vivant-navy"
                }`}
              />
            </div>
            {errors.valorInvestido && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                ⚠ {errors.valorInvestido.message}
              </p>
            )}
            <p className="text-xs text-slate-500">
              Valor mínimo: R$ 100.000 | Máximo: R$ 50.000.000
            </p>
          </div>

          {/* IPCA Projetado */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold text-vivant-navy">
                Projeção de IPCA (Correção Monetária)
              </Label>
              <div className="flex items-center gap-2 bg-vivant-green/10 px-4 py-2 rounded-lg border border-vivant-green/30">
                <span className="text-2xl font-bold text-vivant-green">
                  {ipcaValue}%
                </span>
                <span className="text-sm text-vivant-green/70">a.a.</span>
              </div>
            </div>

            <div className="px-2 py-6">
              <Slider
                value={[ipcaValue]}
                onValueChange={handleIpcaChange}
                min={3}
                max={10}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>3% (Conservador)</span>
                <span>10% (Pessimista)</span>
              </div>
            </div>

            {errors.ipcaProjetado && (
              <p className="text-sm text-red-500">
                {errors.ipcaProjetado.message}
              </p>
            )}
          </div>

          {/* Botão */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-vivant-navy hover:bg-vivant-navy/90 transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Calculando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Calcular Análise de Investimento
              </span>
            )}
          </Button>
        </form>

        {/* Informações */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <h4 className="font-semibold text-sm text-slate-700 mb-2">
            📊 Parâmetros da Análise:
          </h4>
          <ul className="text-xs text-slate-600 space-y-1">
            <li>• Prazo: 60 meses (5 anos)</li>
            <li>• Taxa de Juros: 1% a.m. (~12,68% a.a.)</li>
            <li>• Split: 50% Mensal + 50% Anual (Balões)</li>
            <li>• Correção: IPCA projetado aplicado ao saldo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
