"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { PartnersAnalysis, PartnersLiquidezResult } from "@/lib/math/partners-calculator";
import { simulateLiquidezPartners } from "@/lib/math/partners-calculator";
import {
  Zap,
  TrendingDown,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Building2,
} from "lucide-react";

interface PartnersLiquidezSimulatorProps {
  analysis: PartnersAnalysis | null;
  onLiquidezCalculated?: (result: PartnersLiquidezResult) => void;
}

export function PartnersLiquidezSimulator({
  analysis,
  onLiquidezCalculated,
}: PartnersLiquidezSimulatorProps): JSX.Element {
  const [isEnabled, setIsEnabled] = useState(false);
  const [mesAtual, setMesAtual] = useState<number | "">(24);
  const [taxaDesconto, setTaxaDesconto] = useState<number | "">(15);
  const [result, setResult] = useState<PartnersLiquidezResult | null>(null);
  const [mesError, setMesError] = useState<string | null>(null);
  const [taxaError, setTaxaError] = useState<string | null>(null);

  const mesMaximo = analysis?.mesUltimoRecebimento ?? 69;

  const handleCalculate = () => {
    if (!analysis) return;

    setMesError(null);
    setTaxaError(null);

    if (mesAtual === "" || taxaDesconto === "") {
      if (mesAtual === "") setMesError("Campo obrigatório");
      if (taxaDesconto === "") setTaxaError("Campo obrigatório");
      return;
    }

    const mes = mesAtual as number;
    const taxa = taxaDesconto as number;
    let hasError = false;

    if (mes < 1 || mes > mesMaximo) {
      setMesError(mes < 1 ? "Mês mínimo é 1" : `Mês máximo é ${mesMaximo}`);
      hasError = true;
    }

    if (taxa < 5 || taxa > 30) {
      setTaxaError(taxa < 5 ? "Taxa mínima é 5%" : "Taxa máxima é 30%");
      hasError = true;
    }

    if (hasError) return;

    const liquidezResult = simulateLiquidezPartners(analysis, mes, taxa / 100);
    setResult(liquidezResult);
    if (onLiquidezCalculated) onLiquidezCalculated(liquidezResult);
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
            <p>Disponível após calcular a simulação</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-vivant-gold/30 bg-gradient-to-br from-white to-vivant-gold/5">
      <CardHeader className="bg-gradient-to-r from-vivant-gold/10 to-vivant-gold-muted/10 border-b border-vivant-gold/20">
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
            <span className="text-sm font-medium text-slate-600">
              {isEnabled ? "Ativado" : "Desativado"}
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={isEnabled}
              onClick={() => setIsEnabled((v) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled ? "bg-vivant-navy" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  isEnabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {!isEnabled ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-vivant-gold/10 rounded-full mb-4">
              <Zap className="w-10 h-10 text-vivant-gold-muted" />
            </div>
            <h3 className="text-lg font-semibold text-vivant-navy mb-2">
              Simular Antecipação dos Recebíveis?
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto mb-4">
              Ative esta opção para calcular quanto você receberia à vista se vender seus
              recebíveis futuros (securitização) antes do prazo final.
            </p>
            <p className="text-xs text-slate-500 italic">
              Útil para avaliar liquidez e oportunidades de antecipação via CRI
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">Como funciona:</p>
                <p>
                  Você pode vender seus recebíveis futuros (sua parte de 70%) aplicando uma{" "}
                  <strong>taxa de desconto</strong> sobre o valor presente dos fluxos restantes.
                  Quanto maior a taxa, menor o valor recebido, mas maior a liquidez imediata.
                </p>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mesAtualPartners" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Mês da Saída (1–{mesMaximo})
                </Label>
                <Input
                  id="mesAtualPartners"
                  type="number"
                  min="1"
                  max={mesMaximo}
                  value={mesAtual}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    const value = e.target.value;
                    setMesError(null);
                    if (value === "") { setMesAtual(""); return; }
                    const num = parseInt(value, 10);
                    if (isNaN(num)) return;
                    setMesAtual(num);
                    if (num < 1) setMesError("Mês mínimo é 1");
                    else if (num > mesMaximo) setMesError(`Mês máximo é ${mesMaximo}`);
                  }}
                  className={`text-lg font-semibold border-2 ${
                    mesError ? "border-red-500" : "border-vivant-navy/30"
                  }`}
                />
                {mesError ? (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {mesError}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Em qual mês você deseja vender os recebíveis?
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxaDescontoPartners" className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Taxa de Desconto (% a.a.)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="taxaDescontoPartners"
                    type="number"
                    min="5"
                    max="30"
                    step="0.5"
                    value={taxaDesconto}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const value = e.target.value;
                      setTaxaError(null);
                      if (value === "") { setTaxaDesconto(""); return; }
                      const num = parseFloat(value);
                      if (isNaN(num)) return;
                      setTaxaDesconto(num);
                      if (num < 5) setTaxaError("Taxa mínima é 5%");
                      else if (num > 30) setTaxaError("Taxa máxima é 30%");
                    }}
                    className={`text-lg font-semibold border-2 ${
                      taxaError ? "border-red-500" : "border-vivant-navy/30"
                    }`}
                  />
                  <span className="text-lg font-bold text-vivant-navy">%</span>
                </div>
                {taxaError ? (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {taxaError}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    Taxa típica de mercado: 12–18% a.a.
                  </p>
                )}
              </div>
            </div>

            {/* Botão */}
            <Button
              onClick={handleCalculate}
              size="lg"
              className="w-full bg-vivant-gold-muted hover:bg-vivant-gold-muted/90 text-white font-semibold"
            >
              <Zap className="w-5 h-5 mr-2" />
              Calcular Antecipação dos Recebíveis
            </Button>

            {/* Resultado */}
            {result && (
              <div className="space-y-6 pt-4 border-t-2 border-vivant-gold/30">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-vivant-navy flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-vivant-gold-muted" />
                    Resultado da Antecipação
                  </h3>
                  <div className="flex items-center gap-2 bg-vivant-gold/10 px-4 py-2 rounded-lg">
                    <Clock className="w-4 h-4 text-vivant-gold-muted" />
                    <span className="text-sm font-semibold text-vivant-navy">
                      {result.percentualConcluido}% concluído
                    </span>
                  </div>
                </div>

                {/* Cards da antecipação */}
                <div className="bg-gradient-to-br from-vivant-gold/10 to-vivant-gold-muted/10 border-2 border-vivant-gold/30 rounded-xl p-6">
                  <h4 className="text-lg font-bold text-vivant-navy mb-4 flex items-center gap-2">
                    💰 Análise da Venda Antecipada (Liquidez)
                  </h4>

                  {/* Linha 1: Recebíveis + duas deduções */}
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    {/* Total Recebíveis Futuros */}
                    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                      <CardContent className="pt-5 pb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-5 h-5 text-blue-600" />
                          <span className="text-sm font-medium text-slate-700">
                            Recebíveis Futuros (seu)
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {result.totalFluxoFuturo}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Valor nominal total dos seus 70%
                        </p>
                      </CardContent>
                    </Card>

                    {/* Desconto financeiro */}
                    <Card className="border-2 border-vivant-gold/30 bg-gradient-to-br from-vivant-gold/10 to-vivant-gold/20">
                      <CardContent className="pt-5 pb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingDown className="w-5 h-5 text-vivant-gold-muted" />
                          <span className="text-sm font-medium text-slate-700">
                            Desconto Financeiro
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-vivant-gold-muted">
                          -{result.descontoAplicado}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          Taxa de mercado: {taxaDesconto}% a.a.
                        </p>
                      </CardContent>
                    </Card>

                    {/* Taxa de Estruturação */}
                    <Card className="border-2 border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100">
                      <CardContent className="pt-5 pb-5">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-5 h-5 text-slate-600" />
                          <span className="text-sm font-medium text-slate-700">
                            Taxa de Estruturação
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-slate-700">
                          -{result.taxaEstruturacao}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          10% fixo sobre os recebíveis futuros (Vivant)
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Valor Antecipado Líquido — destaque */}
                  <Card className="border-2 border-vivant-navy bg-gradient-to-br from-vivant-navy to-[#2A4F6B]">
                    <CardContent className="pt-5 pb-5">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-vivant-gold flex-shrink-0" />
                          <div>
                            <p className="text-white font-semibold text-base">
                              Valor Antecipado Líquido
                            </p>
                            <p className="text-white/60 text-xs">
                              Recebíveis futuros − desconto financeiro − taxa de estruturação
                            </p>
                          </div>
                        </div>
                        <div className="text-3xl sm:text-4xl font-bold text-vivant-gold">
                          {result.valorVendaVista}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Composição total */}
                <div className="bg-vivant-gold/10 border-2 border-vivant-gold/30 rounded-xl p-5">
                  <h4 className="text-base font-bold text-vivant-navy mb-4">
                    📋 Composição do Resultado Final
                  </h4>
                  <div className="space-y-0 text-sm">
                    <div className="flex justify-between items-center py-2.5 border-b border-vivant-gold/20">
                      <span className="text-slate-600">💵 Já recebido até o mês {result.mesAtual}:</span>
                      <span className="font-semibold text-vivant-navy">{result.recebidoAteOMomento}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-vivant-gold/20">
                      <span className="text-slate-500 text-xs">↳ Recebíveis futuros nominais:</span>
                      <span className="font-medium text-blue-600">{result.totalFluxoFuturo}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-vivant-gold/20">
                      <span className="text-slate-500 text-xs pl-3">− Desconto financeiro ({taxaDesconto}% a.a.):</span>
                      <span className="font-medium text-vivant-gold-muted">-{result.descontoAplicado}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b-2 border-vivant-gold/30">
                      <span className="text-slate-500 text-xs pl-3">− Taxa de estruturação (10%):</span>
                      <span className="font-medium text-slate-600">-{result.taxaEstruturacao}</span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 border-b border-vivant-gold/20">
                      <span className="text-slate-600">➕ Valor antecipado líquido:</span>
                      <span className="font-semibold text-vivant-navy">{result.valorVendaVista}</span>
                    </div>
                    <div className="flex justify-between items-center py-3 bg-vivant-navy -mx-5 px-5 mt-1 rounded-b-lg">
                      <span className="font-bold text-white text-base">Total Final Recebido:</span>
                      <span className="font-bold text-2xl text-vivant-gold">{result.totalRecebidoComVenda}</span>
                    </div>
                  </div>
                </div>

                {/* Interpretação */}
                <div className="bg-vivant-gold/10 border-2 border-vivant-gold/30 rounded-lg p-5">
                  <h4 className="text-base font-bold text-vivant-navy mb-3 flex items-center gap-2">
                    💡 Interpretação da Simulação
                  </h4>
                  <div className="text-sm text-slate-700 leading-relaxed space-y-3">
                    <p>
                      <strong>Contexto:</strong> Você está no mês{" "}
                      <strong>{result.mesAtual}</strong> de {mesMaximo} ({result.percentualConcluido}%
                      do período concluído).
                    </p>
                    <p>
                      <strong>Operação:</strong> Ao antecipar seus recebíveis futuros, são aplicadas
                      duas deduções sobre o saldo nominal de{" "}
                      <strong className="text-blue-600">{result.totalFluxoFuturo}</strong>:{" "}
                      o desconto financeiro de mercado de{" "}
                      <strong className="text-vivant-gold-muted">{taxaDesconto}% a.a.</strong>{" "}
                      (−{result.descontoAplicado}) e a taxa de estruturação da Vivant de{" "}
                      <strong>10%</strong> (−{result.taxaEstruturacao}). O valor líquido que você
                      recebe à vista é de{" "}
                      <strong className="text-vivant-navy">{result.valorVendaVista}</strong>.
                    </p>
                    <p>
                      <strong>Resultado Total:</strong> Somando o que você já recebeu com o valor
                      antecipado líquido, o total é de{" "}
                      <strong className="text-vivant-navy">{result.totalRecebidoComVenda}</strong>.
                    </p>
                    <p className="text-xs text-slate-500 italic">
                      {result.mesesRestantes} meses de recebíveis restantes foram antecipados.
                    </p>
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
