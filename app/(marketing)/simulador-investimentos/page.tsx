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
import { LeadCaptureDialog } from "@/components/investment/lead-capture-dialog";
import { calculateInvestmentAnalysis } from "@/lib/math/investment-calculator";
import type { InvestmentAnalysis, LiquidezResult } from "@/lib/math/investment-calculator";
import type { InvestmentInputFormData } from "@/lib/validations/investment";
import { generateInvestmentProposal } from "@/lib/utils/pdf-generator";
import { Button } from "@/components/ui/button";
import { Download, Info, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

export default function SimuladorInvestimentosPage(): JSX.Element {
  const [analysis, setAnalysis] = useState<InvestmentAnalysis | null>(null);
  const [isLeadCaptured, setIsLeadCaptured] = useState(false);
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [pendingInvestmentData, setPendingInvestmentData] =
    useState<InvestmentInputFormData | null>(null);
  const [leadData, setLeadData] = useState<{
    nome: string;
    email: string;
    telefone: string;
  } | null>(null);
  const [liquidezResult, setLiquidezResult] = useState<LiquidezResult | null>(null);

  const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);

  const formatPercent = (value: number): string =>
    `${new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}%`;

  const runAnalysis = (data: InvestmentInputFormData): void => {
    const result = calculateInvestmentAnalysis(
      data.valorInvestido,
      data.ipcaProjetado
    );
    setAnalysis(result);
    setLiquidezResult(null);
    setTimeout(() => {
      const el = document.getElementById("investment-results");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleFormSubmit = (data: InvestmentInputFormData): void => {
    // Lead já capturado: recalcula diretamente sem reabrir o dialog
    if (leadData) {
      runAnalysis(data);
      return;
    }
    setPendingInvestmentData(data);
    setShowLeadDialog(true);
  };

  const handleLeadCaptured = async (capturedLeadData: {
    nome: string;
    email: string;
    telefone: string;
  }): Promise<void> => {
    // Marca que o lead foi capturado e armazena os dados
    setIsLeadCaptured(true);
    setLeadData(capturedLeadData);

    // Calcula a análise de investimento com os dados armazenados
    if (pendingInvestmentData) {
      const result = calculateInvestmentAnalysis(
        pendingInvestmentData.valorInvestido,
        pendingInvestmentData.ipcaProjetado
      );
      setAnalysis(result);

      const mensagemLead = [
        "Solicitacao de analise completa - Simulador de Investimentos Capital",
        `Nome: ${capturedLeadData.nome}`,
        `Email: ${capturedLeadData.email}`,
        `Telefone: ${capturedLeadData.telefone}`,
        `Aporte informado: ${formatCurrency(pendingInvestmentData.valorInvestido)}`,
        `IPCA projetado selecionado: ${formatPercent(pendingInvestmentData.ipcaProjetado * 100)} a.a.`,
        "",
        "Resultados calculados no simulador:",
        `Valor aportado: ${result.valorInvestido}`,
        `Valor de mercado do imovel: ${result.valorMercadoImovel}`,
        `VGV da operacao: ${result.vgv}`,
        `Total a receber (70%): ${result.totalReceber}`,
        `Lucro projetado: ${result.lucroLiquido}`,
        `ROI: ${result.roi}`,
        `TIR anual estimada: ${result.tir}`,
      ].join("\n");

      try {
        const createLeadResponse = await fetch("/api/public/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadTypeKey: "INVESTIDOR",
            name: capturedLeadData.nome,
            phone: capturedLeadData.telefone,
            email: capturedLeadData.email,
            city: "Online",
            origin: "Simulador Investimentos",
            message: mensagemLead,
          }),
        });

        if (!createLeadResponse.ok) {
          const errorPayload = await createLeadResponse.json().catch(() => ({}));
          console.error("Falha ao criar lead do simulador:", errorPayload);
        }
      } catch (error) {
        console.error("Falha ao criar lead do simulador:", error);
      }

      // Scroll suave para os resultados
      setTimeout(() => {
        const kpisElement = document.getElementById("investment-results");
        if (kpisElement) {
          kpisElement.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
  };

  const handleDownloadPDF = async (): Promise<void> => {
    if (!analysis) return;
    await generateInvestmentProposal(
      analysis,
      leadData || undefined,
      liquidezResult || undefined
    );
  };

  const handleLiquidezCalculated = (result: LiquidezResult): void => {
    setLiquidezResult(result);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* Modal de Captura de Lead */}
      <LeadCaptureDialog
        open={showLeadDialog}
        onOpenChange={setShowLeadDialog}
        onLeadCaptured={handleLeadCaptured}
      />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=2071&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/85 via-[#1A2F4B]/75 to-[#F8F9FA]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <ScrollReveal className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Simulador de Investimentos
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-3 sm:mb-4 max-w-3xl mx-auto font-light px-2">
              Ferramenta Profissional de Análise de Viabilidade Financeira
            </p>
            <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto px-2">
              Calcule TIR, ROI e fluxo de caixa completo do seu investimento em multipropriedade de alto padrão
            </p>
          </ScrollReveal>
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
            <LiquidezSimulator 
              analysis={analysis} 
              onLiquidezCalculated={handleLiquidezCalculated}
            />

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
                    onClick={handleDownloadPDF}
                    className="border-2 border-[#1A2F4B] text-[#1A2F4B] hover:bg-[#1A2F4B] hover:text-white transition-all min-h-[48px]"
                  >
                    <Download className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Baixar Proposta em PDF
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
                        <li>• Desconto na compra à vista: ~20% sobre valor de mercado</li>
                        <li>• Markup sobre o VGV: 50% sobre o valor de mercado</li>
                        <li>• Taxa de Juros: 1% a.m. (~12,68% a.a.)</li>
                        <li>• Entrada por unidade: 20% (−5% comissão de venda)</li>
                        <li>• 40% em 60 parcelas mensais + 40% em 5 reforços anuais</li>
                        <li>• Correção: IPCA aplicado ao saldo devedor</li>
                        <li>• Split: 70% investidor / 30% Vivant</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold text-vivant-navy mb-2">
                        🔢 Cálculos Realizados:
                      </h4>
                      <ul className="space-y-1">
                        <li>• <strong>Parcelas:</strong> Tabela Price com IPCA sobre saldo devedor</li>
                        <li>• <strong>Reforços:</strong> Balões anuais com juros compostos + IPCA</li>
                        <li>• <strong>TIR:</strong> Método Newton-Raphson (precisão 0,01%)</li>
                        <li>• <strong>Liquidez:</strong> Valor Presente com taxa de mercado</li>
                        <li>• <strong>Taxa de estruturação:</strong> 10% s/ recebíveis futuros (antecipação)</li>
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
              <Link href="/vivant-capital">
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
