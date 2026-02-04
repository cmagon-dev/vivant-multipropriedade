"use client";

import { useState } from "react";
import Link from "next/link";
import { InvestmentForm } from "@/components/investment/investment-form";
import { InvestmentKPIs } from "@/components/investment/investment-kpis";
import { InvestmentChart } from "@/components/investment/investment-chart";
import { CashFlowTable } from "@/components/investment/cash-flow-table";
import { LiquidezSimulator } from "@/components/investment/liquidez-simulator";
import { calculateInvestmentAnalysis } from "@/lib/math/investment-calculator";
import type { InvestmentAnalysis } from "@/lib/math/investment-calculator";
import type { InvestmentInputFormData } from "@/lib/validations/investment";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Info } from "lucide-react";

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
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b-2 border-vivant-navy/10 shadow-xl" style={{ boxShadow: '0 4px 16px rgba(26, 47, 75, 0.08)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-28">
            {/* Logo Vivant Capital */}
            <Link href="/capital" className="flex items-center py-2">
              <img 
                src="/logo-vivant-capital.png" 
                alt="Vivant Capital" 
                className="h-16 w-auto"
              />
            </Link>

            {/* Botão Voltar */}
            <Link href="/capital">
              <Button
                variant="outline"
                className="border-2 border-vivant-navy text-vivant-navy hover:bg-vivant-navy hover:text-white transition-all font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar para Vivant Capital
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-r from-vivant-navy via-[#2A4F6B] to-vivant-navy text-white py-16 shadow-2xl mt-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Simulador de Investimentos
            </h1>
            <p className="text-xl text-white/90 mb-2">
              Ferramenta Profissional de Análise de Viabilidade Financeira
            </p>
            <p className="text-white/80">
              Calcule TIR, ROI e fluxo de caixa completo do seu investimento em
              multipropriedade de alto padrão
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Seção de Formulário */}
        <div className="grid gap-8 lg:grid-cols-3 mb-12">
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
          <div className="space-y-8 animate-in fade-in duration-700">
            <InvestmentChart analysis={analysis} />

            {/* Tabela de Fluxo */}
            <CashFlowTable analysis={analysis} />

            {/* Simulador de Liquidez */}
            <LiquidezSimulator analysis={analysis} />

            {/* Ações e Download */}
            <div className="bg-white border-2 border-vivant-navy/20 rounded-xl shadow-xl p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                  <h3 className="text-2xl font-serif font-bold text-vivant-navy mb-2">
                    Pronto para Investir?
                  </h3>
                  <p className="text-slate-600">
                    Entre em contato com nossa equipe para estruturar sua
                    operação ou baixe uma proposta detalhada em PDF
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-vivant-navy text-vivant-navy hover:bg-vivant-navy hover:text-white transition-all"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Baixar Proposta (PDF)
                  </Button>

                  <Button
                    size="lg"
                    asChild
                    className="bg-vivant-green hover:bg-vivant-green/90 text-white"
                  >
                    <a href="mailto:capital@vivant.com.br">
                      Falar com Especialista
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Metodologia */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200 rounded-xl p-8">
              <div className="flex items-start gap-4">
                <div className="bg-vivant-navy text-white p-3 rounded-lg">
                  <Info className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-vivant-navy mb-4">
                    Metodologia de Cálculo
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-700">
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
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-900">
            <strong>⚠ Aviso Legal:</strong> Este simulador é uma ferramenta de análise
            de viabilidade financeira. Os valores apresentados são projeções baseadas
            nos parâmetros informados e não constituem garantia de rentabilidade.
            Investimentos estão sujeitos a riscos. Consulte um especialista antes de
            tomar decisões financeiras.
          </p>
        </div>
      </div>
    </div>
  );
}
