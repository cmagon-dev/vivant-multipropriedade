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
  onLiquidezCalculated?: (result: LiquidezResult) => void;
}

export function LiquidezSimulator({ analysis, onLiquidezCalculated }: LiquidezSimulatorProps): JSX.Element {
  const [isEnabled, setIsEnabled] = useState(false);
  const [mesAtual, setMesAtual] = useState<number | "">(24); // Default: meio do prazo
  const [taxaDesconto, setTaxaDesconto] = useState<number | "">(15); // 15% a.a.
  const [result, setResult] = useState<LiquidezResult | null>(null);
  const [mesError, setMesError] = useState<string | null>(null);
  const [taxaError, setTaxaError] = useState<string | null>(null);

  const handleCalculate = () => {
    if (!analysis) return;

    // Limpar erros anteriores
    setMesError(null);
    setTaxaError(null);

    // Validar campos vazios
    if (mesAtual === "" || taxaDesconto === "") {
      if (mesAtual === "") setMesError("Campo obrigatório");
      if (taxaDesconto === "") setTaxaError("Campo obrigatório");
      return;
    }

    // Validar limites
    const mes = mesAtual as number;
    const taxa = taxaDesconto as number;

    let hasError = false;

    if (mes < 1 || mes > 60) {
      setMesError(mes < 1 ? "Mês mínimo é 1" : "Mês máximo é 60");
      hasError = true;
    }

    if (taxa < 5 || taxa > 30) {
      setTaxaError(taxa < 5 ? "Taxa mínima é 5%" : "Taxa máxima é 30%");
      hasError = true;
    }

    if (hasError) return;

    // Calcular se tudo estiver válido
    const liquidezResult = simulateLiquidez(
      analysis,
      mes,
      taxa / 100
    );
    setResult(liquidezResult);
    
    // Notificar o componente pai
    if (onLiquidezCalculated) {
      onLiquidezCalculated(liquidezResult);
    }
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
                  onFocus={(e) => {
                    e.target.select();
                  }}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMesError(null);
                    
                    // Permite campo vazio
                    if (value === "") {
                      setMesAtual("");
                      return;
                    }
                    
                    const num = parseInt(value, 10);
                    
                    // Se não for número válido, não atualiza
                    if (isNaN(num)) {
                      return;
                    }
                    
                    // Atualiza o valor e valida
                    setMesAtual(num);
                    
                    // Mostra avisos mas permite digitar
                    if (num < 1) {
                      setMesError("Mês mínimo é 1");
                    } else if (num > 60) {
                      setMesError("Mês máximo é 60");
                    }
                  }}
                  className={`text-lg font-semibold border-2 ${
                    mesError ? "border-red-500" : "border-vivant-navy/30"
                  }`}
                />
                {mesError ? (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {mesError}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Em qual mês você deseja vender os recebíveis?
                  </p>
                )}
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
                    onFocus={(e) => {
                      e.target.select();
                    }}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTaxaError(null);
                      
                      // Permite campo vazio
                      if (value === "") {
                        setTaxaDesconto("");
                        return;
                      }
                      
                      const num = parseFloat(value);
                      
                      // Se não for número válido, não atualiza
                      if (isNaN(num)) {
                        return;
                      }
                      
                      // Atualiza o valor e valida
                      setTaxaDesconto(num);
                      
                      // Mostra avisos mas permite digitar
                      if (num < 5) {
                        setTaxaError("Taxa mínima é 5%");
                      } else if (num > 30) {
                        setTaxaError("Taxa máxima é 30%");
                      }
                    }}
                    className={`text-lg font-semibold border-2 ${
                      taxaError ? "border-red-500" : "border-vivant-navy/30"
                    }`}
                  />
                  <span className="text-lg font-bold text-vivant-navy">%</span>
                </div>
                {taxaError ? (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {taxaError}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Taxa típica de mercado: 12-18% a.a.
                  </p>
                )}
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
              <div className="space-y-6 pt-4 border-t-2 border-vivant-gold-muted/30">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-vivant-navy flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-vivant-green" />
                    Resultado da Simulação
                  </h3>
                  <div className="flex items-center gap-2 bg-vivant-navy/10 px-4 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-vivant-navy" />
                    <span className="text-sm font-semibold text-vivant-navy">
                      {result.percentualConcluido} concluído
                    </span>
                  </div>
                </div>

                {/* Análise da Venda Antecipada - MOVIDO PARA CIMA */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-vivant-navy mb-4 flex items-center gap-2">
                    💰 Análise da Venda Antecipada (Liquidez)
                  </h4>

                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Total de Recebíveis Futuros */}
                    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-slate-700">
                            Total de Recebíveis Futuros
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-blue-600">
                          {result.totalFluxoFuturo}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Valor total dos recebíveis
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
                          -{result.descontoAplicado}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Taxa de {taxaDesconto}% a.a.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Valor Antecipado Líquido */}
                    <Card className="border-2 border-vivant-green bg-gradient-to-br from-vivant-green/10 to-emerald-50">
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="w-5 h-5 text-vivant-green" />
                          <span className="text-sm font-medium text-slate-700">
                            Valor Antecipado Líquido
                          </span>
                        </div>
                        <div className="text-3xl font-bold text-vivant-green">
                          {result.valorVendaVista}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Você recebe à vista agora
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Análise TOTAL após Venda Antecipada */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-vivant-navy mb-2 flex items-center gap-2">
                    📊 Resultado Total com Venda Antecipada
                  </h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Recebido até o mês da simulação (parcelas + balões) + valor antecipado líquido
                  </p>
                  
                  <div className="grid md:grid-cols-4 gap-4">
                    <Card className="border-none shadow-md bg-white">
                      <CardContent className="pt-4">
                        <span className="text-xs text-slate-600">Total Recebido</span>
                        <p className="text-xl font-bold text-vivant-green mt-1">
                          {result.totalRecebidoComVenda}
                        </p>
                        <span className="text-xs text-slate-500">Até o mês + antecipado</span>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white">
                      <CardContent className="pt-4">
                        <span className="text-xs text-slate-600">Lucro Total</span>
                        <p className="text-xl font-bold text-vivant-navy mt-1">
                          {result.lucroTotalComVenda}
                        </p>
                        <span className="text-xs text-slate-500">Ganho líquido</span>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white">
                      <CardContent className="pt-4">
                        <span className="text-xs text-slate-600">ROI Total</span>
                        <p className="text-xl font-bold text-purple-600 mt-1">
                          {result.roiTotalComVenda}
                        </p>
                        <span className="text-xs text-slate-500">Retorno sobre investimento</span>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-md bg-white">
                      <CardContent className="pt-4">
                        <span className="text-xs text-slate-600">TIR Total</span>
                        <p className="text-xl font-bold text-orange-600 mt-1">
                          {result.tirTotalComVenda}
                        </p>
                        <span className="text-xs text-slate-500">Taxa interna retorno</span>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-4 bg-white/70 rounded-lg p-3">
                    <p className="text-sm text-slate-700">
                      <strong>Rentabilidade Total:</strong> {result.rentabilidadeTotalComVenda} sobre o investimento inicial
                    </p>
                  </div>
                </div>


                {/* Breakdown Detalhado */}
                <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-5">
                  <h4 className="text-base font-bold text-vivant-navy mb-3">
                    📋 Composição do Resultado Final
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                      <span className="text-slate-600">💵 Já recebido até o mês {result.mesAtual}:</span>
                      <span className="font-semibold text-vivant-navy">{result.recebidoAteOMomento}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b-2 border-slate-300">
                      <span className="text-slate-600">➕ Valor antecipado líquido:</span>
                      <span className="font-semibold text-vivant-green">{result.valorVendaVista}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-emerald-50 -mx-5 px-5 mt-2">
                      <span className="font-bold text-slate-700 text-base">Total Final:</span>
                      <span className="font-bold text-2xl text-vivant-green">{result.totalRecebidoComVenda}</span>
                    </div>
                  </div>
                </div>

                {/* Explicação Detalhada */}
                <div className="bg-vivant-gold-muted/10 border-2 border-vivant-gold-muted/30 rounded-lg p-5">
                  <h4 className="text-base font-bold text-vivant-navy mb-3 flex items-center gap-2">
                    💡 Interpretação da Simulação
                  </h4>
                  <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                    <p>
                      <strong>Contexto:</strong> Você está no mês <strong>{result.mesAtual}</strong> de 60 
                      ({result.percentualConcluido} do investimento concluído).
                    </p>
                    
                    <p>
                      <strong>Operação:</strong> Ao vender seus recebíveis futuros com taxa de desconto de 
                      <strong> {taxaDesconto}% a.a.</strong>, você receberá <strong className="text-vivant-green">{result.valorVendaVista}</strong> à vista, 
                      abrindo mão de <strong className="text-orange-600">{result.descontoAplicado}</strong> em 
                      troca da liquidez imediata.
                    </p>
                    
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 mt-3">
                      <p className="font-semibold text-emerald-900 mb-2">Resultado Final da Operação:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-600">Lucro:</span>
                          <span className="font-bold text-vivant-navy ml-2">{result.lucroTotalComVenda}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">ROI:</span>
                          <span className="font-bold text-purple-600 ml-2">{result.roiTotalComVenda}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">TIR:</span>
                          <span className="font-bold text-orange-600 ml-2">{result.tirTotalComVenda}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Rentabilidade:</span>
                          <span className="font-bold text-vivant-green ml-2">{result.rentabilidadeTotalComVenda}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
