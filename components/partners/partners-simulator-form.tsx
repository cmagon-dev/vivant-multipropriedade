"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  partnersSimulatorInputSchema,
  type PartnersSimulatorInputData,
} from "@/lib/validations/partners-simulator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Calculator, Home, TrendingUp, Zap, BarChart3 } from "lucide-react";
import type { CenarioVendas } from "@/lib/math/partners-calculator";

interface PartnersSimulatorFormProps {
  onSubmit: (data: PartnersSimulatorInputData) => void;
}

const CENARIOS: { key: CenarioVendas; label: string; desc: string; ritmo: string; icon: React.ReactNode }[] = [
  {
    key: "otimista",
    label: "Otimista",
    desc: "2 cotas por mês",
    ritmo: "6 cotas em 3 meses",
    icon: <Zap className="w-4 h-4" />,
  },
  {
    key: "realista",
    label: "Realista",
    desc: "1 cota por mês",
    ritmo: "6 cotas em 6 meses",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    key: "pessimista",
    label: "Conservador",
    desc: "1 cota a cada 1,5 meses",
    ritmo: "6 cotas em 9 meses",
    icon: <BarChart3 className="w-4 h-4" />,
  },
];

export function PartnersSimulatorForm({ onSubmit }: PartnersSimulatorFormProps): JSX.Element {
  const [ipcaValue, setIpcaValue] = useState(5);
  const [displayValue, setDisplayValue] = useState("1.000.000");
  const [cenarioSelecionado, setCenarioSelecionado] = useState<CenarioVendas>("realista");

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PartnersSimulatorInputData>({
    resolver: zodResolver(partnersSimulatorInputSchema),
    defaultValues: {
      valorImovel: 1000000,
      ipcaProjetado: 0.05,
      cenario: "realista",
    },
  });

  const handleIpcaChange = (values: number[]) => {
    const pct = values[0];
    setIpcaValue(pct);
    setValue("ipcaProjetado", pct / 100);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw) {
      const num = parseInt(raw, 10);
      setDisplayValue(num.toLocaleString("pt-BR"));
      setValue("valorImovel", num);
    } else {
      setDisplayValue("");
      setValue("valorImovel", 0);
    }
  };

  const handleCenarioChange = (key: CenarioVendas) => {
    setCenarioSelecionado(key);
    setValue("cenario", key);
  };

  return (
    <Card className="border-2 border-vivant-navy/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-vivant-navy to-[#2A4F6B] text-white">
        <CardTitle className="text-xl sm:text-2xl font-serif flex items-center gap-2 sm:gap-3">
          <Calculator className="w-6 h-6 sm:w-7 sm:h-7" />
          Simulador Partners
        </CardTitle>
        <p className="text-white/70 text-sm mt-1 font-light">
          Calcule seus recebíveis como parceiro Vivant
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">

          {/* Valor do Imóvel */}
          <div className="space-y-3">
            <Label
              htmlFor="valorImovel"
              className="text-base sm:text-lg font-semibold text-vivant-navy flex items-center gap-2"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              Valor do seu Imóvel
            </Label>
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl font-bold text-vivant-navy">
                R$
              </span>
              <Input
                id="valorImovel"
                type="text"
                placeholder="1.000.000"
                value={displayValue}
                onChange={handleValueChange}
                className={`text-xl sm:text-2xl font-bold h-14 sm:h-16 pl-12 sm:pl-14 pr-3 sm:pr-4 text-vivant-navy border-2 ${
                  errors.valorImovel
                    ? "border-red-500 focus:border-red-500"
                    : "border-vivant-navy/30 focus:border-vivant-navy"
                }`}
              />
            </div>
            {errors.valorImovel && (
              <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                ⚠ {errors.valorImovel.message}
              </p>
            )}
            <p className="text-xs text-slate-500">
              Valor mínimo: R$ 100.000 | Máximo: R$ 50.000.000
            </p>
          </div>

          {/* IPCA */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <Label className="text-base sm:text-lg font-semibold text-vivant-navy">
                Projeção de IPCA
              </Label>
              <div className="flex items-center gap-2 bg-vivant-gold/10 px-3 sm:px-4 py-2 rounded-lg border border-vivant-gold/40 w-fit">
                <span className="text-xl sm:text-2xl font-bold text-vivant-gold-muted">
                  {ipcaValue}%
                </span>
                <span className="text-xs sm:text-sm text-vivant-gold-muted/70">a.a.</span>
              </div>
            </div>
            <div className="px-2 py-4 sm:py-6">
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
              <p className="text-xs sm:text-sm text-red-500">{errors.ipcaProjetado.message}</p>
            )}
          </div>

          {/* Cenário de Vendas */}
          <div className="space-y-3">
            <Label className="text-base sm:text-lg font-semibold text-vivant-navy">
              Cenário de Velocidade de Vendas
            </Label>
            <p className="text-xs text-slate-500">
              Selecione o ritmo esperado para a venda das 6 cotas da multipropriedade
            </p>
            <div className="grid grid-cols-3 gap-2">
              {CENARIOS.map((c) => {
                const ativo = cenarioSelecionado === c.key;
                return (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => handleCenarioChange(c.key)}
                    className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all w-full min-w-0 ${
                      ativo
                        ? "border-vivant-gold bg-vivant-gold/10 shadow-md"
                        : "border-slate-200 bg-white hover:border-vivant-gold/40 hover:bg-vivant-gold/5"
                    }`}
                  >
                    <span className={`mb-0.5 ${ativo ? "text-vivant-gold-muted" : "text-slate-400"}`}>
                      {c.icon}
                    </span>
                    <span className={`font-semibold text-xs leading-tight break-words w-full ${ativo ? "text-vivant-navy" : "text-slate-700"}`}>
                      {c.label}
                    </span>
                    <span className={`text-xs font-medium leading-tight ${ativo ? "text-vivant-gold-muted" : "text-slate-500"}`}>
                      {c.desc}
                    </span>
                    <span className={`text-xs leading-tight ${ativo ? "text-vivant-navy/60" : "text-slate-400"}`}>
                      {c.ritmo}
                    </span>
                  </button>
                );
              })}
            </div>
            {errors.cenario && (
              <p className="text-xs sm:text-sm text-red-500">{errors.cenario.message}</p>
            )}
          </div>

          {/* Botão */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-vivant-navy hover:bg-vivant-navy/90 transition-all"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Calculando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Simular Meus Recebíveis</span>
                <span className="sm:hidden">Simular</span>
              </span>
            )}
          </Button>
        </form>

        {/* Parâmetros */}
        <div className="mt-6 space-y-3">
          <div className="p-3 sm:p-4 bg-vivant-gold/10 rounded-lg border border-vivant-gold/30">
            <p className="text-xs sm:text-sm text-vivant-navy font-medium">
              🔓 <strong>Acesso à Simulação Completa:</strong> Após calcular, você precisará fornecer seus dados de contato para visualizar os resultados detalhados.
            </p>
          </div>
          <div className="p-3 sm:p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-semibold text-xs sm:text-sm text-slate-700 mb-2">
              📊 Parâmetros da Simulação:
            </h4>
            <ul className="text-xs text-slate-600 space-y-1">
              <li>• Markup: 50% sobre o valor do imóvel</li>
              <li>• 6 cotas do imóvel estruturado em SPE</li>
              <li>• Entrada: 20% por cota | Parcelas: 60× | Reforços: 5×</li>
              <li>• Taxa: 1% a.m. + IPCA | Split: 70% para você</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
