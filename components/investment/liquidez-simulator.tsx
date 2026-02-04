"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import type { InvestmentAnalysis, LiquidezResult } from "@/lib/math/investment-calculator";
import { simulateLiquidez } from "@/lib/math/investment-calculator";
import { 
  Zap, 
  TrendingDown, 
  Clock, 
  DollarSign,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface LiquidezSimulatorProps {
  analysis: InvestmentAnalysis | null;
}

export function LiquidezSimulator({ analysis }: LiquidezSimulatorProps): JSX.Element {
  const [isEnabled, setIsEnabled] = useState(false);
  const [mesAtual, setMesAtual] = useState(24); // Default: meio do prazo
  const [taxaDesconto, setTaxaDesconto] = useState(15); // 15% a.a.
  const [result, setResult] = useState<LiquidezResult | null>(null);

  const handleCalculate = () => {
    if (!analysis) return;

    const liquidezResult = simulateLiquidez(
      analysis,
      mesAtual,
      taxaDesconto / 100
    );
    setResult(liquidezResult);
  };

  if (!analysis) {
    return (
      <Card className="border-2 border-slate-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-400">
            <Zap className="w-6 h-6" />
            Simulador de Liquidez Antecipada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-400">
            <p>Disponível após calcular o investimento</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-vivant-gold-muted/30 bg-gradient-to-br from-white to-vivant-gold-muted/5">
      <CardHeader className="bg-gradient-to-r from-vivant-gold-muted/10 to-orange-50">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-vivant-navy mb-2">
              <Zap className="w-6 h-6 text-vivant-gold-muted" />
              Simulador de Liquidez Antecipada (Securitização)
            </CardTitle>
            <p className="text-sm text-slate-600">
              Calcule o valor de venda à vista dos seus recebíveis futuros
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="liquidez-toggle" className="text-sm font-medium">
              {isEnabled ? "Ativado" : "Desativado"}
            </Label>
            <Switch
              id="liquidez-toggle"
              checked={isEnabled}
              onCheckedChange={setIsEnabled}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {!isEnabled ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-vivant-gold-muted/10 rounded-full mb-4">
              <Zap className="w-10 h-10 text-vivant-gold-muted" />
            </div>
            <h3 className="text-lg font-semibold text-vivant-navy mb-2">
              Simular Saída Antecipada?
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">
              Ative esta opção para calcular quanto você receberia se vendesse
              seus recebíveis futuros a qualquer momento antes do prazo final.
            </p>
            <p className="text-xs text-slate-500 italic">
              Útil para avaliar liquidez e oportunidades de securitização (CRI)
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Como funciona:</p>
                <p>
                  Você pode vender seus recebíveis futuros aplicando uma{" "}
                  <strong>taxa de desconto</strong> sobre o valor presente dos
                  fluxos restantes. Quanto maior o desconto, menor o valor recebido,
                  mas maior a liquidez imediata.
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mesAtual" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Mês da Saída (1-60)
                </Label>
                <Input
                  id="mesAtual"
                  type="number"
                  min="1"
                  max="60"
                  value={mesAtual}
                  onChange={(e) => setMesAtual(parseInt(e.target.value) || 1)}
                  className="text-lg font-semibold border-2 border-vivant-navy/30"
                />
                <p className="text-xs text-slate-500">
                  Em qual mês você deseja vender os recebíveis?
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxaDesconto" className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Taxa de Desconto (% a.a.)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="taxaDesconto"
                    type="number"
                    min="5"
                    max="30"
                    step="0.5"
                    value={taxaDesconto}
                    onChange={(e) => setTaxaDesconto(parseFloat(e.target.value) || 15)}
                    className="text-lg font-semibold border-2 border-vivant-navy/30"
                  />
                  <span className="text-lg font-bold text-vivant-navy">%</span>
                </div>
                <p className="text-xs text-slate-500">
                  Taxa típica de mercado: 12-18% a.a.
                </p>
              </div>
            </div>

            {/* Botão Calcular */}
            <Button
              onClick={handleCalculate}
              size="lg"
              className="w-full bg-vivant-gold-muted hover:bg-vivant-gold-muted/90 text-white font-semibold"
            >
              <Zap className="w-5 h-5 mr-2" />
              Calcular Valor de Venda à Vista
            </Button>

            {/* Resultado */}
            {result && (
              <div className="space-y-4 pt-4 border-t-2 border-vivant-gold-muted/30">
                <h3 className="text-lg font-bold text-vivant-navy flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-vivant-green" />
                  Resultado da Simulação:
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* Valor à Vista */}
                  <Card className="border-2 border-vivant-green bg-gradient-to-br from-vivant-green/10 to-emerald-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-vivant-green" />
                        <span className="text-sm font-medium text-slate-700">
                          Valor de Venda à Vista
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-vivant-green">
                        {result.valorVendaVista}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Você recebe agora
                      </p>
                    </CardContent>
                  </Card>

                  {/* Desconto Aplicado */}
                  <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingDown className="w-5 h-5 text-orange-600" />
                        <span className="text-sm font-medium text-slate-700">
                          Desconto Aplicado
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-orange-600">
                        {result.descontoAplicado}
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Diferença do valor futuro
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Info Adicional */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-slate-600">Mês da Saída:</span>
                      <p className="font-semibold text-vivant-navy">
                        Mês {mesAtual}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600">Meses Restantes:</span>
                      <p className="font-semibold text-vivant-navy">
                        {result.mesesRestantes} meses
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600">Total Fluxo Futuro:</span>
                      <p className="font-semibold text-vivant-navy">
                        {result.totalFluxoFuturo}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Explicação */}
                <div className="bg-vivant-gold-muted/10 border border-vivant-gold-muted/30 rounded-lg p-4">
                  <p className="text-sm text-slate-700">
                    <strong>Interpretação:</strong> Se você vender seus recebíveis
                    no mês <strong>{mesAtual}</strong>, com uma taxa de desconto de{" "}
                    <strong>{taxaDesconto}% a.a.</strong>, você receberá{" "}
                    <strong className="text-vivant-green">{result.valorVendaVista}</strong>{" "}
                    à vista, abrindo mão de{" "}
                    <strong className="text-orange-600">{result.descontoAplicado}</strong>{" "}
                    em troca da liquidez imediata.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
