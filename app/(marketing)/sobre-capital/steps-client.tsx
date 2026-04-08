"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  Calculator,
  CheckCircle2,
  Building2,
  Wallet,
  Lock,
  Settings,
  ArrowDownRight,
} from "lucide-react";

const TOTAL_STEPS = 6;

export function SobreCapitalStepsClient(): JSX.Element {
  const [step, setStep] = useState(0);
  const router = useRouter();
  const progress = useMemo(() => ((step + 1) / TOTAL_STEPS) * 100, [step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
      if (e.key === "ArrowLeft") setStep((s) => Math.max(0, s - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">
      <Navbar />

      <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-28 sm:pt-32 lg:pt-36 pb-10 sm:pb-12 lg:pb-16">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            className="absolute -inset-[2.5%] z-0"
            style={{
              backgroundImage: "url('/images/sobre-capital-banner.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/70 via-[#1A2F4B]/50 via-[#1A2F4B]/25 to-[#F8F9FA]/60" />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center pt-2 sm:pt-4">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#1A2F4B]/20 backdrop-blur-sm border border-[#1A2F4B]/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-4 sm:mb-6">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="text-white text-base sm:text-xl font-semibold">Vivant Capital</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-3 sm:mb-4 leading-tight px-2">
              Invista em Multipropriedade de Alto Padrão
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-2 sm:mb-3 max-w-3xl mx-auto font-light px-2">
              Oportunidades exclusivas de investimento em imóveis fracionados com alta rentabilidade e segurança jurídica
            </p>

            <p className="text-lg sm:text-xl md:text-2xl text-white font-semibold mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
              Faça uma simulação:
            </p>

            <div className="flex justify-center px-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-[#1A2F4B] hover:bg-white/95 shadow-xl shadow-black/25 ring-2 ring-white/30 text-base sm:text-lg md:text-xl min-h-[52px] sm:min-h-[56px] h-auto py-4 sm:py-5 px-8 sm:px-12 font-bold"
              >
                <Link href="/simulador-investimentos">Simulador de Investimentos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-1 overflow-hidden pt-6 sm:pt-8 lg:pt-10">
        <div className="h-full max-w-6xl mx-auto px-4 sm:px-6 pb-6 flex flex-col">
          <header className="shrink-0 border-b border-[#1A2F4B]/10 bg-white/90 rounded-t-xl">
            <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
              <Link href="/" className="text-[#1A2F4B] font-serif font-bold text-xl">
                Vivant
              </Link>
              <div className="flex-1 max-w-md">
                <div className="flex items-center justify-between text-xs text-[#1A2F4B]/70 mb-1">
                  <span>Etapa {step + 1} de {TOTAL_STEPS}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-2 rounded-full bg-[#1A2F4B]/10 overflow-hidden">
                  <div className="h-full bg-[#1A2F4B] transition-all duration-500" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-hidden bg-white">
            <div className="h-full overflow-y-auto px-4 sm:px-6 py-8 sm:py-10">
              {step === 0 && (
                <section className="py-2">
                  <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
                      Vivant Capital
                    </h2>
                    <p className="text-lg sm:text-xl text-[#1A2F4B]/65 max-w-4xl mx-auto px-4">
                      Boutique de Estruturação de Ativos Imobiliários
                    </p>
                  </div>
                  <div className="max-w-5xl mx-auto space-y-6 text-[#1A2F4B]/80 px-2 sm:px-0">
                    <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
                      A <strong>Vivant Capital</strong> é nossa boutique especializada em <strong>estruturação de funding</strong> e <strong>originação de ativos</strong> no
                      mercado de multipropriedade. Enquanto a Vivant Residences atende o segmento de uso pessoal, a Vivant Capital desenvolve
                      oportunidades de <strong>equity real estate</strong> com foco em investidores institucionais e qualificados.
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
                      Nosso modelo de negócio combina <strong>aquisição estratégica de VGV</strong>, fracionamento jurídico com <strong>Patrimônio de Afetação</strong> e gestão
                      de <strong>Conta Escrow</strong> com split automático de pagamentos. Operamos com <strong>Cap Rate</strong> competitivo e <strong>margens operacionais de 35% a 45%</strong>,
                      oferecendo aos investidores rentabilidade de <strong>IPCA + 12% a.a.</strong> (~16-18% a.a.).
                    </p>
                    <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
                      Nossa estrutura é <strong>CRI-ready</strong>, preparada para securitização via Certificados de Recebíveis Imobiliários, com governança e compliance de padrão FII
                      (Fundo de Investimento Imobiliário).
                    </p>
                  </div>
                </section>
              )}

              {step === 1 && (
                <section className="py-2">
                  <div className="text-center mb-10 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
                      Como Funciona o Investimento
                    </h2>
                    <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">Processo transparente do início ao retorno</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
                    <Card className="border-2 border-[#1A2F4B]/20 shadow-lg h-full">
                      <CardHeader>
                        <div className="w-12 h-12 bg-[#1A2F4B] rounded-full flex items-center justify-center mb-4 mx-auto"><Building2 className="w-6 h-6 text-white" /></div>
                        <CardTitle className="text-center text-xl font-serif text-[#1A2F4B]">1. Aquisição</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center text-sm text-[#1A2F4B]/70">Identificamos e adquirimos propriedades de alto padrão em localizações premium com alto potencial de valorização.</CardContent>
                    </Card>
                    <Card className="border-2 border-[#1A2F4B]/20 shadow-lg h-full">
                      <CardHeader>
                        <div className="w-12 h-12 bg-[#1A2F4B] rounded-full flex items-center justify-center mb-4 mx-auto"><Target className="w-6 h-6 text-white" /></div>
                        <CardTitle className="text-center text-xl font-serif text-[#1A2F4B]">2. Fracionamento</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center text-sm text-[#1A2F4B]/70">Fracionamos a propriedade em até 6 cotas com escritura pública, democratizando o acesso a imóveis de luxo.</CardContent>
                    </Card>
                    <Card className="border-2 border-[#1A2F4B]/20 shadow-lg h-full">
                      <CardHeader>
                        <div className="w-12 h-12 bg-[#1A2F4B] rounded-full flex items-center justify-center mb-4 mx-auto"><TrendingUp className="w-6 h-6 text-white" /></div>
                        <CardTitle className="text-center text-xl font-serif text-[#1A2F4B]">3. Rentabilidade</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center text-sm text-[#1A2F4B]/70">Gestão profissional com renda de locação, valorização imobiliária e transparência total nos resultados.</CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section className="py-2">
                  <div className="text-center mb-10 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">Estrutura Financeira</h2>
                    <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">Fluxo transparente e auditado dos recursos</p>
                  </div>
                  <div className="max-w-6xl mx-auto">
                    <div className="flex justify-center mb-4">
                      <Card className="border-2 border-[#1A2F4B] bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] shadow-lg w-64 sm:w-72">
                        <CardContent className="p-4 sm:p-5 text-center">
                          <Wallet className="w-9 h-9 sm:w-10 sm:h-10 text-white mx-auto mb-2" />
                          <h3 className="text-lg sm:text-xl font-bold text-white mb-0.5">Cliente Investe</h3>
                          <p className="text-xs sm:text-sm text-white/90">Pagamento da cota</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="flex justify-center mb-4"><ArrowDownRight className="w-6 h-6 text-[#1A2F4B]/30 rotate-90" /></div>
                    <div className="flex justify-center mb-4">
                      <Card className="relative border-2 border-vivant-gold-muted bg-white shadow-lg w-72 sm:w-80">
                        <CardContent className="p-4 sm:p-5 text-center">
                          <div className="absolute -top-3 right-4">
                            <span className="inline-flex items-center bg-vivant-green text-white text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-lg">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Auditoria Externa
                            </span>
                          </div>
                          <Lock className="w-10 h-10 sm:w-11 sm:h-11 text-vivant-gold-muted mx-auto mb-2" />
                          <h3 className="text-lg sm:text-xl font-bold text-[#1A2F4B] mb-0.5">Conta Escrow</h3>
                          <p className="text-xs sm:text-sm text-[#1A2F4B]/70 mb-1">Conta segregada e auditada</p>
                          <p className="text-[11px] font-semibold text-vivant-gold-muted">Split Automático</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="flex justify-center gap-24 mb-4">
                      <ArrowDownRight className="w-6 h-6 text-[#1A2F4B]/30 -rotate-45" />
                      <ArrowDownRight className="w-6 h-6 text-[#1A2F4B]/30 rotate-45" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
                      <Card className="border-2 border-vivant-green bg-gradient-to-br from-vivant-green/10 to-white shadow-lg">
                        <CardContent className="p-4 sm:p-5 text-center">
                          <Shield className="w-9 h-9 sm:w-10 sm:h-10 text-vivant-green mx-auto mb-2" />
                          <div className="inline-block bg-vivant-green text-white text-sm sm:text-base font-bold px-3 py-1 rounded-full mb-2">50%</div>
                          <h3 className="text-lg sm:text-xl font-bold text-[#1A2F4B] mb-1">Bolsão de Garantia</h3>
                          <p className="text-xs sm:text-sm text-[#1A2F4B]/70 mb-2">
                            Recursos segregados para proteção do investidor
                          </p>
                          <div className="text-xs space-y-1.5 text-left bg-white/80 p-2.5 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-vivant-green flex-shrink-0" />
                              <span>Patrimônio de Afetação</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-vivant-green flex-shrink-0" />
                              <span>Alienação Fiduciária</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-vivant-green flex-shrink-0" />
                              <span>Cláusula Resolutiva</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card className="border-2 border-[#1A2F4B] bg-gradient-to-br from-[#1A2F4B]/10 to-white shadow-lg">
                        <CardContent className="p-4 sm:p-5 text-center">
                          <Settings className="w-9 h-9 sm:w-10 sm:h-10 text-[#1A2F4B] mx-auto mb-2" />
                          <div className="inline-block bg-[#1A2F4B] text-white text-sm sm:text-base font-bold px-3 py-1 rounded-full mb-2">50%</div>
                          <h3 className="text-lg sm:text-xl font-bold text-[#1A2F4B] mb-1">Operação Vivant</h3>
                          <p className="text-xs sm:text-sm text-[#1A2F4B]/70 mb-2">
                            Custos operacionais e margem da estruturadora
                          </p>
                          <div className="text-xs space-y-1.5 text-left bg-white/80 p-2.5 rounded-lg">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A2F4B] flex-shrink-0" />
                              <span>Gestão e Compliance</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A2F4B] flex-shrink-0" />
                              <span>Custos de Aquisição</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A2F4B] flex-shrink-0" />
                              <span>Margem Operacional (35-45%)</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </section>
              )}

              {step === 3 && (
                <section className="py-2">
                  <div className="text-center mb-10 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">Rentabilidade Comparativa</h2>
                    <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">Veja como a Vivant Capital se compara a outras opções de investimento</p>
                  </div>
                  <div className="max-w-5xl mx-auto">
                    <Card className="border-none shadow-lg bg-white">
                      <CardContent className="p-6 sm:p-8 space-y-7">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl font-semibold text-[#1A2F4B]">Poupança</span>
                            <span className="text-2xl font-bold text-gray-500">~6% a.a.</span>
                          </div>
                          <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-end pr-4"
                              style={{ width: "25%" }}
                            >
                              <span className="text-white font-semibold text-base">6%</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl font-semibold text-[#1A2F4B]">CDI / Tesouro Direto</span>
                            <span className="text-2xl font-bold text-blue-600">~10% a.a.</span>
                          </div>
                          <div className="relative h-12 bg-blue-50 rounded-lg overflow-hidden">
                            <div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-end pr-4"
                              style={{ width: "42%" }}
                            >
                              <span className="text-white font-semibold text-base">10%</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xl font-semibold text-[#1A2F4B] flex items-center gap-2">
                              Vivant Capital
                              <span className="text-xs bg-vivant-gold-muted text-white px-2 py-1 rounded">DESTAQUE</span>
                            </span>
                            <span className="text-2xl font-bold text-vivant-green">IPCA + 12% (~16-18% a.a.)</span>
                          </div>
                          <div className="relative h-14 bg-vivant-green/10 rounded-lg overflow-hidden border-2 border-vivant-green">
                            <div
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-vivant-green to-emerald-600 flex items-center justify-end pr-4"
                              style={{ width: "75%" }}
                            >
                              <span className="text-white font-bold text-lg">16-18%</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-center text-sm text-[#1A2F4B]/60 pt-2">
                          * Rentabilidades estimadas. Investimentos estão sujeitos a riscos.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {step === 4 && (
                <section className="py-2">
                  <div className="text-center mb-10 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">Por que Investir com a Vivant Capital?</h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
                    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 bg-[#1A2F4B]/10 rounded-lg flex items-center justify-center mb-4">
                          <Shield className="w-6 h-6 text-[#1A2F4B]" />
                        </div>
                        <CardTitle className="text-2xl font-serif text-[#1A2F4B]">
                          Segurança Jurídica
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#1A2F4B]/70 mb-4 text-lg">
                          Modelo 100% regulamentado com escritura pública e registro em cartório.
                          Seu investimento protegido por lei.
                        </p>
                        <div className="space-y-2 text-base">
                          <div className="flex items-center gap-2 text-[#1A2F4B]/70">
                            <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                            <span className="font-semibold">Patrimônio de Afetação</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#1A2F4B]/70">
                            <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                            <span className="font-semibold">Alienação Fiduciária</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#1A2F4B]/70">
                            <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                            <span className="font-semibold">Estrutura CRI-ready</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 bg-[#1A2F4B]/10 rounded-lg flex items-center justify-center mb-4">
                          <TrendingUp className="w-6 h-6 text-[#1A2F4B]" />
                        </div>
                        <CardTitle className="text-2xl font-serif text-[#1A2F4B]">
                          Alta Rentabilidade
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#1A2F4B]/70 mb-4 text-lg">
                          Margens operacionais de <span className="font-bold text-vivant-green">35-45%</span> com
                          valorização imobiliária e modelo de negócio comprovado.
                        </p>
                        <div className="bg-vivant-green/10 border-l-4 border-vivant-green p-4 rounded">
                          <p className="text-sm font-semibold text-[#1A2F4B]">
                            Rentabilidade para investidores:
                          </p>
                          <p className="text-4xl font-bold text-vivant-green mt-1">
                            IPCA + 12% a.a.
                          </p>
                          <p className="text-xs text-[#1A2F4B]/60 mt-1">
                            (~16-18% a.a. nominal)
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                      <CardHeader>
                        <div className="w-12 h-12 bg-[#1A2F4B]/10 rounded-lg flex items-center justify-center mb-4">
                          <BarChart3 className="w-6 h-6 text-[#1A2F4B]" />
                        </div>
                        <CardTitle className="text-2xl font-serif text-[#1A2F4B]">
                          Transparência Total
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-[#1A2F4B]/70 mb-4 text-lg">
                          Simulador financeiro completo, relatórios detalhados e
                          acompanhamento em tempo real dos seus investimentos.
                        </p>
                        <div className="space-y-2 text-base">
                          <div className="flex items-center gap-2 text-[#1A2F4B]/70">
                            <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                            <span className="font-semibold">Governança FII</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#1A2F4B]/70">
                            <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                            <span className="font-semibold">Auditoria Externa</span>
                          </div>
                          <div className="flex items-center gap-2 text-[#1A2F4B]/70">
                            <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                            <span className="font-semibold">Relatórios Trimestrais</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {step === 5 && (
                <section className="py-2">
                  <div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2 text-center">Perguntas Frequentes</h2>
                    <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4 text-center mb-8">Entenda os aspectos técnicos e jurídicos do investimento</p>
                    <div className="max-w-3xl mx-auto">
                      <Accordion type="single" collapsible className="space-y-4">
                        <AccordionItem value="item-1" className="bg-white border-none shadow-md rounded-lg px-6">
                          <AccordionTrigger className="text-left hover:no-underline py-6"><span className="text-lg font-semibold text-[#1A2F4B]">O que acontece se a Vivant quebrar?</span></AccordionTrigger>
                          <AccordionContent className="text-[#1A2F4B]/70 pb-6">Seu investimento está protegido por Patrimônio de Afetação e por bolsão de garantia em conta Escrow auditada externamente.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2" className="bg-white border-none shadow-md rounded-lg px-6">
                          <AccordionTrigger className="text-left hover:no-underline py-6"><span className="text-lg font-semibold text-[#1A2F4B]">Como recebo meu pagamento?</span></AccordionTrigger>
                          <AccordionContent className="text-[#1A2F4B]/70 pb-6">Os pagamentos são realizados via Conta Escrow com split automático e rastreabilidade.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3" className="bg-white border-none shadow-md rounded-lg px-6">
                          <AccordionTrigger className="text-left hover:no-underline py-6"><span className="text-lg font-semibold text-[#1A2F4B]">O imóvel fica no meu nome?</span></AccordionTrigger>
                          <AccordionContent className="text-[#1A2F4B]/70 pb-6">Sim, com proteções como Alienação Fiduciária das Cotas e Cláusula Resolutiva para garantir segurança da operação.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-4" className="bg-white border-none shadow-md rounded-lg px-6">
                          <AccordionTrigger className="text-left hover:no-underline py-6"><span className="text-lg font-semibold text-[#1A2F4B]">Qual a estrutura de securitização?</span></AccordionTrigger>
                          <AccordionContent className="text-[#1A2F4B]/70 pb-6">A estrutura é CRI-ready, preparada para emissão de Certificados de Recebíveis Imobiliários.</AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-5" className="bg-white border-none shadow-md rounded-lg px-6">
                          <AccordionTrigger className="text-left hover:no-underline py-6"><span className="text-lg font-semibold text-[#1A2F4B]">Como funciona a governança?</span></AccordionTrigger>
                          <AccordionContent className="text-[#1A2F4B]/70 pb-6">Seguimos padrões de Governança FII, com auditoria externa, relatórios trimestrais e rastreabilidade completa dos fluxos financeiros.</AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </main>

          <footer className="shrink-0 border-t border-[#1A2F4B]/10 bg-white rounded-b-xl">
            <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
              <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} className="min-h-[48px] px-6">
                Voltar
              </Button>
              <Button
                onClick={() => {
                  if (step === TOTAL_STEPS - 1) {
                    router.push("/");
                    return;
                  }
                  setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
                }}
                className="min-h-[48px] px-8 bg-[#1A2F4B] hover:bg-[#1A2F4B]/90"
              >
                {step === TOTAL_STEPS - 1 ? "Finalizar" : "Continuar"}
              </Button>
            </div>
          </footer>
        </div>
      </div>

      <Footer />
    </div>
  );
}

