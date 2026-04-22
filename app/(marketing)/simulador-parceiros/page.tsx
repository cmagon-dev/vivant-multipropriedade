"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { PartnersSimulatorForm } from "@/components/partners/partners-simulator-form";
import { PartnersKPIs } from "@/components/partners/partners-kpis";
import { PartnersChart } from "@/components/partners/partners-chart";
import { PartnersCashFlowTable } from "@/components/partners/partners-cash-flow-table";
import { PartnersLiquidezSimulator } from "@/components/partners/partners-liquidez-simulator";
import { LeadCaptureDialog } from "@/components/investment/lead-capture-dialog";
import { calculatePartnersAnalysis } from "@/lib/math/partners-calculator";
import type { PartnersAnalysis, PartnersLiquidezResult } from "@/lib/math/partners-calculator";
import type { PartnersSimulatorInputData } from "@/lib/validations/partners-simulator";
import { Button } from "@/components/ui/button";
import { Info, ArrowRight, Home, Users, TrendingUp, Shield, AlertTriangle, Download } from "lucide-react";
import { generatePartnersProposal } from "@/lib/utils/pdf-generator";

export default function SimuladorParceirosPage(): JSX.Element {
  const [analysis, setAnalysis] = useState<PartnersAnalysis | null>(null);
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [pendingData, setPendingData] = useState<PartnersSimulatorInputData | null>(null);
  const [leadData, setLeadData] = useState<{
    nome: string;
    email: string;
    telefone: string;
  } | null>(null);
  const [liquidezResult, setLiquidezResult] = useState<PartnersLiquidezResult | null>(null);

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

  const runAnalysis = (data: PartnersSimulatorInputData): void => {
    const result = calculatePartnersAnalysis(
      data.valorImovel,
      data.ipcaProjetado,
      data.cenario
    );
    setAnalysis(result);
    setLiquidezResult(null);
    setTimeout(() => {
      const el = document.getElementById("partners-results");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleFormSubmit = (data: PartnersSimulatorInputData): void => {
    // Lead já capturado: recalcula diretamente sem abrir o dialog
    if (leadData) {
      runAnalysis(data);
      return;
    }
    setPendingData(data);
    setShowLeadDialog(true);
  };

  const handleLeadCaptured = async (capturedLeadData: {
    nome: string;
    email: string;
    telefone: string;
  }): Promise<void> => {
    setLeadData(capturedLeadData);

    if (pendingData) {
      const result = calculatePartnersAnalysis(
        pendingData.valorImovel,
        pendingData.ipcaProjetado,
        pendingData.cenario
      );
      setAnalysis(result);
      setLiquidezResult(null);

      const LABEL_CENARIO: Record<string, string> = {
        otimista: "Otimista (2 cotas/mês)",
        realista: "Realista (1 cota/mês)",
        pessimista: "Conservador (1 cota a cada 1,5 meses)",
      };

      const mensagemLead = [
        "Solicitacao de simulacao - Simulador Partners Vivant",
        `Nome: ${capturedLeadData.nome}`,
        `Email: ${capturedLeadData.email}`,
        `Telefone: ${capturedLeadData.telefone}`,
        `Valor do imóvel informado: ${formatCurrency(pendingData.valorImovel)}`,
        `IPCA projetado: ${formatPercent(pendingData.ipcaProjetado * 100)} a.a.`,
        `Cenário de vendas: ${LABEL_CENARIO[pendingData.cenario]}`,
        "",
        "Resultados calculados no simulador:",
        `VGV da operação: ${result.vgv}`,
        `Total a receber (cliente): ${result.totalReceberCliente}`,
        `Custo de implantação: ${result.custoImplantacao}`,
      ].join("\n");

      try {
        const createLeadResponse = await fetch("/api/public/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            leadTypeKey: "PARCEIRO",
            name: capturedLeadData.nome,
            phone: capturedLeadData.telefone,
            email: capturedLeadData.email,
            city: "Online",
            origin: "Simulador Partners",
            message: mensagemLead,
          }),
        });

        if (!createLeadResponse.ok) {
          const errorPayload = await createLeadResponse.json().catch(() => ({}));
          console.error("Falha ao criar lead do simulador Partners:", errorPayload);
        }
      } catch (error) {
        console.error("Falha ao criar lead do simulador Partners:", error);
      }

      setTimeout(() => {
        const el = document.getElementById("partners-results");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  };

  const handleLiquidezCalculated = (result: PartnersLiquidezResult): void => {
    setLiquidezResult(result);
  };

  const handleDownloadPDF = async (): Promise<void> => {
    if (!analysis) return;
    await generatePartnersProposal(
      analysis,
      leadData || undefined,
      liquidezResult || undefined
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* Lead Capture Dialog */}
      <LeadCaptureDialog
        open={showLeadDialog}
        onOpenChange={setShowLeadDialog}
        onLeadCaptured={handleLeadCaptured}
      />

      {/* Hero */}
      <section className="relative min-h-[50vh] sm:min-h-[55vh] flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-vivant-navy/85 via-vivant-navy/75 to-[#F8F9FA]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <ScrollReveal className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-vivant-gold/20 backdrop-blur-sm border border-vivant-gold/40 rounded-full px-4 py-2 mb-4 text-vivant-gold text-sm font-medium">
              <Home className="w-4 h-4" />
              Vivant Partners
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Simulador de Recebíveis Partners
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-3 sm:mb-4 max-w-3xl mx-auto font-light px-2">
              Transforme seu imóvel em multipropriedade e projete seus recebíveis
            </p>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto px-2">
              Calcule quanto você recebe ao fracionar seu imóvel em 6 cotas com a estrutura Vivant
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Modelo Partners — contexto rápido */}
      <div className="container mx-auto px-4 sm:px-6 mt-6 mb-4">
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            {
              icon: <Home className="w-6 h-6 text-vivant-gold-muted" />,
              title: "Você entra com o imóvel",
              desc: "Sem vender. Você mantém a propriedade enquanto recebe os recebíveis das cotas.",
            },
            {
              icon: <Users className="w-6 h-6 text-vivant-gold-muted" />,
              title: "Vivant estrutura a SPE",
              desc: "A Vivant incorpora a multipropriedade, realiza as vendas das cotas e garante a operação.",
            },
            {
              icon: <TrendingUp className="w-6 h-6 text-vivant-gold-muted" />,
              title: "Você recebe 70%",
              desc: "70% de todas as entradas, parcelas mensais e reforços anuais vão direto para você.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white border border-vivant-gold/20 rounded-xl p-4 sm:p-5 flex items-start gap-3 shadow-sm"
            >
              <div className="bg-vivant-gold/10 p-2.5 rounded-lg flex-shrink-0">{item.icon}</div>
              <div>
                <p className="font-semibold text-vivant-navy text-sm">{item.title}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">

        {/* Formulário + KPIs */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3 mb-8 sm:mb-12">
          <div className="lg:col-span-1">
            <PartnersSimulatorForm onSubmit={handleFormSubmit} />
          </div>
          <div id="partners-results" className="lg:col-span-2">
            <PartnersKPIs analysis={analysis} />
          </div>
        </div>

        {/* Resultados detalhados */}
        {analysis && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-700">

            <PartnersChart analysis={analysis} />

            <PartnersCashFlowTable analysis={analysis} />

            <PartnersLiquidezSimulator
              analysis={analysis}
              onLiquidezCalculated={handleLiquidezCalculated}
            />

            {/* CTA contato */}
            <div className="bg-white border-2 border-vivant-gold/20 rounded-xl shadow-lg p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-vivant-navy mb-2">
                    Pronto para estruturar sua operação?
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600">
                    Fale com nossos especialistas e inicie o processo de estruturação da multipropriedade
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-vivant-navy text-vivant-navy hover:bg-vivant-navy hover:text-white transition-all min-h-[48px] gap-2"
                    onClick={handleDownloadPDF}
                  >
                    <Download className="w-4 h-4" />
                    Baixar Proposta em PDF
                  </Button>
                  <Button
                    size="lg"
                    className="bg-vivant-gold text-vivant-navy hover:bg-vivant-gold/90 font-semibold min-h-[48px]"
                    asChild
                  >
                    <a
                      href="https://wa.me/5544999691196?text=Ol%C3%A1,%20simulei%20no%20Simulador%20Partners%20e%20gostaria%20de%20saber%20mais"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Falar com Especialista
                    </a>
                  </Button>
                </div>
              </div>
            </div>

            {/* Metodologia */}
            <div className="bg-gradient-to-r from-slate-50 to-vivant-gold/5 border-2 border-vivant-gold/20 rounded-xl p-6 sm:p-8">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-vivant-navy text-white p-2.5 sm:p-3 rounded-lg flex-shrink-0">
                  <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-vivant-navy mb-3 sm:mb-4">
                    Metodologia de Cálculo
                  </h3>

                  {/* Aviso sobre avaliação do imóvel */}
                  <div className="mb-5 flex items-start gap-3 bg-vivant-gold/10 border border-vivant-gold/30 rounded-lg p-4">
                    <AlertTriangle className="w-5 h-5 text-vivant-gold-muted mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-vivant-navy leading-relaxed">
                      <strong>Importante:</strong> O valor do imóvel informado nesta simulação é meramente
                      indicativo e está condicionado à <strong>avaliação presencial pela equipe da Vivant</strong>.
                      O valor real utilizado para estruturação da operação poderá ser diferente, conforme
                      laudo técnico de avaliação do imóvel, análise de mercado regional e validação jurídica.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 sm:gap-6 text-sm text-slate-700">
                    <div>
                      <h4 className="font-semibold text-vivant-navy mb-2">
                        📊 Parâmetros Utilizados:
                      </h4>
                      <ul className="space-y-1">
                        <li>• Markup: 50% sobre o valor do imóvel</li>
                        <li>• Cotas: 6 por imóvel estruturado</li>
                        <li>• Entrada: 20% por cota | Comissão: 5% por cota</li>
                        <li>• Parcelas: 60× (40% da cota) | Reforços: 5× (40%)</li>
                        <li>• Taxa: 1% a.m. + IPCA | Split: 70% cliente</li>
                        <li>• Custo implantação: 3% do imóvel (reembolsado)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-vivant-navy mb-2">
                        🔢 Cálculos Realizados:
                      </h4>
                      <ul className="space-y-1">
                        <li>• <strong>Parcelas:</strong> Tabela Price com IPCA no saldo</li>
                        <li>• <strong>Reforços:</strong> Balões com juros compostos + IPCA</li>
                        <li>• <strong>Reembolso:</strong> Deduzido dos primeiros recebimentos brutos</li>
                        <li>• <strong>Liquidez:</strong> Valor Presente com taxa de mercado</li>
                        <li>• <strong>Precisão:</strong> Decimal.js (20 casas)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-300">
                    <h4 className="font-semibold text-vivant-navy mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Estrutura Jurídica:
                    </h4>
                    <p className="text-sm text-slate-700">
                      O imóvel é incorporado em uma <strong>SPE (Sociedade de Propósito Específico)</strong>,
                      onde o cliente Partners é sócio. A Vivant realiza a gestão comercial e operacional,
                      e os recebimentos das cotas são distribuídos na proporção{" "}
                      <strong>70% proprietário / 30% Vivant</strong>, conforme cronograma de vendas e
                      pagamentos dos compradores.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aviso legal */}
        <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs sm:text-sm text-yellow-900">
            <strong>⚠ Aviso Legal:</strong> Este simulador é uma ferramenta de análise de viabilidade
            financeira. Os valores apresentados são projeções baseadas nos parâmetros informados e no
            cronograma de vendas selecionado, não constituindo garantia de rentabilidade ou velocidade
            de vendas. O valor do imóvel está sujeito à avaliação pela equipe Vivant. A estruturação
            da operação está sujeita à análise de viabilidade e aprovação. Consulte nossa equipe antes
            de tomar decisões.
          </p>
        </div>
      </div>

      {/* CTA final */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-vivant-navy to-[#2A4F6B]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 sm:mb-6 px-2">
            Quer saber mais sobre o modelo Partners?
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto px-4">
            Conheça todos os detalhes do programa de parceria da Vivant
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              asChild
              size="lg"
              className="bg-vivant-gold text-vivant-navy hover:bg-vivant-gold/90 text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
            >
              <Link href="/parceiros">
                Conhecer Vivant Partners
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
