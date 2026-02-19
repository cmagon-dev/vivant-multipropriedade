"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { InvestmentForm } from "@/components/investment/investment-form";
import { InvestmentKPIs } from "@/components/investment/investment-kpis";
import { InvestmentChart } from "@/components/investment/investment-chart";
import { CashFlowTable } from "@/components/investment/cash-flow-table";
import { LiquidezSimulator } from "@/components/investment/liquidez-simulator";
import { calculateInvestmentAnalysis } from "@/lib/math/investment-calculator";
import type { InvestmentAnalysis } from "@/lib/math/investment-calculator";
import type { InvestmentInputFormData } from "@/lib/validations/investment";
import { Button } from "@/components/ui/button";
import { Download, Info, ArrowRight } from "lucide-react";

export default function SimuladorInvestimentosPage(): JSX.Element {
  const [analysis, setAnalysis] = useState<InvestmentAnalysis | null>(null);

  const handleFormSubmit = (data: InvestmentInputFormData): void => {
    const result = calculateInvestmentAnalysis(
      data.valorInvestido,
      data.ipcaProjetado
    );
    setAnalysis(result);

    // Scroll suave para os resultados
    setTimeout(() => {
      const kpisElement = document.getElementById("investment-results");
      if (kpisElement) {
        kpisElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-32 sm:pt-36 lg:pt-40 bg-gradient-to-br from-[#1A2F4B] via-[#2A4F6B] to-[#1A2F4B]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight">
              Simulador de Investimentos
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-3 sm:mb-4 max-w-3xl mx-auto">
              Ferramenta Profissional de Análise de Viabilidade Financeira
            </p>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
              Calcule TIR, ROI e fluxo de caixa completo do seu investimento em multipropriedade de alto padrão
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        {/* Seção de Formulário */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3 mb-8 sm:mb-12">
          <div className="lg:col-span-1">
            <InvestmentForm onSubmit={handleFormSubmit} />
          </div>

          {/* Seção de KPIs */}
          <div id="investment-results" className="lg:col-span-2">
            <InvestmentKPIs analysis={analysis} />
          </div>
        </div>

        {/* Gráfico */}
        {analysis && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">
            <InvestmentChart analysis={analysis} />

            {/* Tabela de Fluxo */}
            <CashFlowTable analysis={analysis} />

            {/* Simulador de Liquidez */}
            <LiquidezSimulator analysis={analysis} />

            {/* Ações e Download */}
            <div className="bg-white border-2 border-[#1A2F4B]/20 rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1A2F4B] mb-2">
                    Pronto para Investir?
                  </h3>
                  <p className="text-sm sm:text-base text-[#1A2F4B]/70">
                    Entre em contato com nossa equipe para estruturar sua operação
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-[#1A2F4B] text-[#1A2F4B] hover:bg-[#1A2F4B] hover:text-white transition-all min-h-[48px]"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Baixar Proposta
                  </Button>

                  <Button
                    size="lg"
                    asChild
                    className="bg-vivant-green hover:bg-vivant-green/90 text-white min-h-[48px]"
                  >
                    <a href="mailto:capital@vivantresidences.com.br">
                      Falar com Especialista
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Metodologia */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200 rounded-xl p-6 sm:p-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-[#1A2F4B] text-white p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                  <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-[#1A2F4B] mb-3 sm:mb-4">
                    Metodologia de Cálculo
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6 text-sm text-slate-700">
                    <div>
                      <h4 className="font-semibold text-vivant-navy mb-2">
                        📊 Parâmetros Utilizados:
                      </h4>
                      <ul className="space-y-1">
                        <li>• Prazo: 60 meses (5 anos)</li>
                        <li>• Taxa de Juros: 1% a.m. (~12,68% a.a.)</li>
                        <li>• Split: 50% Mensal + 50% Anual</li>
                        <li>• Correção: IPCA aplicado ao saldo devedor</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-vivant-navy mb-2">
                        🔢 Cálculos Realizados:
                      </h4>
                      <ul className="space-y-1">
                        <li>• <strong>Carteira Mensal:</strong> Tabela Price com IPCA</li>
                        <li>• <strong>Carteira Anual:</strong> Balões com juros compostos</li>
                        <li>• <strong>TIR:</strong> Método Newton-Raphson (precisão 0,01%)</li>
                        <li>• <strong>Liquidez:</strong> Valor Presente com taxa de mercado</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-300">
                    <h4 className="font-semibold text-vivant-navy mb-2">
                      ⚖️ Estrutura de Garantias:
                    </h4>
                    <p className="text-sm text-slate-700">
                      Todos os recebíveis são <strong>lastreados em garantia real</strong> (imóveis),
                      com <strong>Alienação Fiduciária</strong> das cotas e estrutura preparada para
                      <strong> Securitização via CRI</strong> (Certificado de Recebíveis Imobiliários).
                      A estrutura segue padrões de <strong>Governança FII</strong> com auditoria externa
                      e relatórios trimestrais.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aviso Legal */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs sm:text-sm text-yellow-900">
            <strong>⚠ Aviso Legal:</strong> Este simulador é uma ferramenta de análise
            de viabilidade financeira. Os valores apresentados são projeções baseadas
            nos parâmetros informados e não constituem garantia de rentabilidade.
            Investimentos estão sujeitos a riscos. Consulte um especialista antes de
            tomar decisões financeiras.
          </p>
        </div>
      </div>

      {/* CTA Final */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 sm:mb-6 px-2">
            Quer saber mais sobre investimentos?
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto px-4">
            Conheça todas as oportunidades da Vivant Capital
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#1A2F4B] hover:bg-white/90 text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
            >
              <Link href="/capital">
                Conhecer Vivant Capital
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
            >
              <Link href="/contato">Fale Conosco</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
