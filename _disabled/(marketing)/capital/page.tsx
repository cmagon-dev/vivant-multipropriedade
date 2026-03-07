import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/marketing/footer";
import { Navbar } from "@/components/marketing/navbar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Building2,
  Wallet,
  Lock,
  Settings,
  ArrowDownRight,
  ChevronDown,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vivant Capital - Investimentos em Multipropriedade",
  description: "Oportunidades exclusivas de investimento em imóveis fracionados com alta rentabilidade, segurança jurídica e estrutura CRI-ready.",
  openGraph: {
    title: "Vivant Capital - Investimentos de Alto Padrão",
    description: "Invista em multipropriedade com rentabilidade de IPCA + 12% a.a. e segurança total.",
    type: "website",
  },
};

export default function CapitalHomePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-32 sm:pt-36 lg:pt-40">
        {/* Background Image com Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/80 via-[#1A2F4B]/70 to-[#F8F9FA]" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#1A2F4B]/20 backdrop-blur-sm border border-[#1A2F4B]/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="text-white text-base sm:text-xl font-semibold">
                Vivant Capital
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Invista em Multipropriedade de Alto Padrão
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto font-light px-2">
              Oportunidades exclusivas de investimento em imóveis fracionados com alta rentabilidade e segurança jurídica
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-[#1A2F4B] hover:bg-white/90 text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
              >
                <a href="#como-funciona">
                  Como Funciona
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1A2F4B] text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
              >
                <Link href="/simulador-investimentos">Ver Simulador</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Vivant Capital */}
      <section id="sobre" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
                Vivant Capital
              </h2>
              <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">
                Boutique de Estruturação de Ativos Imobiliários
              </p>
            </div>

            <div className="space-y-4 text-[#1A2F4B]/80 mb-8 sm:mb-12">
              <p className="text-base sm:text-lg leading-relaxed">
                A <strong>Vivant Capital</strong> é nossa boutique especializada em 
                <strong> estruturação de funding</strong> e <strong>originação de ativos</strong> no 
                mercado de multipropriedade. Enquanto a Vivant Residences atende o segmento de uso 
                pessoal, a Vivant Capital desenvolve oportunidades de <strong>equity real estate</strong> com 
                foco em investidores institucionais e qualificados.
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                Nosso modelo de negócio combina <strong>aquisição estratégica de VGV</strong>, 
                fracionamento jurídico com <strong>Patrimônio de Afetação</strong> e gestão de 
                <strong> Conta Escrow</strong> com split automático de pagamentos. Operamos com 
                <strong> Cap Rate</strong> competitivo e <strong>margens operacionais de 35% a 45%</strong>, 
                oferecendo aos investidores rentabilidade de <strong>IPCA + 12% a.a.</strong> (~16-18% a.a.).
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                Nossa estrutura é <strong>CRI-ready</strong>, preparada para securitização via 
                Certificados de Recebíveis Imobiliários, com governança e compliance de padrão FII 
                (Fundo de Investimento Imobiliário).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modelo de Investimento */}
      <section id="como-funciona" className="py-12 sm:py-16 lg:py-20 bg-[#F8F9FA] scroll-mt-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              Como Funciona o Investimento
            </h2>
            <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">
              Processo transparente do início ao retorno
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="relative">
              <Card className="border-2 border-[#1A2F4B]/20 shadow-lg h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#1A2F4B] rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-center text-xl font-serif text-[#1A2F4B]">
                    1. Aquisição
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-[#1A2F4B]/70">
                    Identificamos e adquirimos propriedades de alto padrão em
                    localizações premium com alto potencial de valorização.
                  </p>
                </CardContent>
              </Card>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-[#1A2F4B]/30" />
              </div>
            </div>

            <div className="relative">
              <Card className="border-2 border-[#1A2F4B]/20 shadow-lg h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#1A2F4B] rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-center text-xl font-serif text-[#1A2F4B]">
                    2. Fracionamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-[#1A2F4B]/70">
                    Fracionamos a propriedade em até 6 cotas com escritura
                    pública, democratizando o acesso a imóveis de luxo.
                  </p>
                </CardContent>
              </Card>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-6 h-6 text-[#1A2F4B]/30" />
              </div>
            </div>

            <div>
              <Card className="border-2 border-[#1A2F4B]/20 shadow-lg h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#1A2F4B] rounded-full flex items-center justify-center mb-4 mx-auto">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-center text-xl font-serif text-[#1A2F4B]">
                    3. Rentabilidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-[#1A2F4B]/70">
                    Gestão profissional com renda de locação, valorização
                    imobiliária e transparência total nos resultados.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </section>

      {/* Fluxo do Dinheiro - Estrutura Financeira */}
      <section id="estrutura" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              Estrutura Financeira
            </h2>
            <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">
              Fluxo transparente e auditado dos recursos
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Fluxo Visual */}
            <div className="relative">
              {/* Cliente Paga */}
              <div className="flex justify-center mb-6">
                <Card className="border-2 border-[#1A2F4B] bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] shadow-lg w-72">
                  <CardContent className="p-6 text-center">
                    <Wallet className="w-12 h-12 text-white mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-white mb-1">Cliente Investe</h3>
                    <p className="text-sm text-white/90">Pagamento da cota</p>
                  </CardContent>
                </Card>
              </div>

              {/* Seta para baixo */}
              <div className="flex justify-center mb-6">
                <ArrowDownRight className="w-8 h-8 text-[#1A2F4B]/30 rotate-90" />
              </div>

              {/* Conta Escrow */}
              <div className="flex justify-center mb-6">
                <Card className="border-2 border-vivant-gold-muted bg-white shadow-lg w-80">
                  <CardContent className="p-6 text-center relative">
                    <div className="absolute -top-3 right-4">
                      <span className="inline-flex items-center bg-vivant-green text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Auditoria Externa
                      </span>
                    </div>
                    <Lock className="w-14 h-14 text-vivant-gold-muted mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-[#1A2F4B] mb-1">Conta Escrow</h3>
                    <p className="text-sm text-[#1A2F4B]/70 mb-1">Conta segregada e auditada</p>
                    <p className="text-xs font-semibold text-vivant-gold-muted">Split Automático</p>
                  </CardContent>
                </Card>
              </div>

              {/* Setas de divisão */}
              <div className="flex justify-center gap-24 mb-6">
                <ArrowDownRight className="w-8 h-8 text-[#1A2F4B]/30 -rotate-45" />
                <ArrowDownRight className="w-8 h-8 text-[#1A2F4B]/30 rotate-45" />
              </div>

              {/* Split 50/50 */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* 50% Bolsão Garantia */}
                <Card className="border-2 border-vivant-green bg-gradient-to-br from-vivant-green/10 to-white shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-12 h-12 text-vivant-green mx-auto mb-3" />
                    <div className="inline-block bg-vivant-green text-white text-base font-bold px-4 py-1.5 rounded-full mb-3">
                      50%
                    </div>
                    <h3 className="text-xl font-bold text-[#1A2F4B] mb-2">Bolsão de Garantia</h3>
                    <p className="text-sm text-[#1A2F4B]/70 mb-3">
                      Recursos segregados para proteção do investidor
                    </p>
                    <div className="text-xs space-y-2 text-left bg-white/80 p-3 rounded-lg">
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

                {/* 50% Operação Vivant */}
                <Card className="border-2 border-[#1A2F4B] bg-gradient-to-br from-[#1A2F4B]/10 to-white shadow-lg">
                  <CardContent className="p-6 text-center">
                    <Settings className="w-12 h-12 text-[#1A2F4B] mx-auto mb-3" />
                    <div className="inline-block bg-[#1A2F4B] text-white text-base font-bold px-4 py-1.5 rounded-full mb-3">
                      50%
                    </div>
                    <h3 className="text-xl font-bold text-[#1A2F4B] mb-2">Operação Vivant</h3>
                    <p className="text-sm text-[#1A2F4B]/70 mb-3">
                      Custos operacionais e margem da estruturadora
                    </p>
                    <div className="text-xs space-y-2 text-left bg-white/80 p-3 rounded-lg">
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
          </div>
        </div>
      </section>

      {/* Gráfico Comparativo de Rentabilidade */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              Rentabilidade Comparativa
            </h2>
            <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">
              Veja como a Vivant Capital se compara a outras opções de investimento
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="border-none shadow-lg bg-white">
              <CardContent className="p-6 sm:p-8">
                <div className="space-y-6">
                  {/* Poupança */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-[#1A2F4B]">Poupança</span>
                      <span className="text-lg font-bold text-gray-500">~6% a.a.</span>
                    </div>
                    <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-end pr-4 transition-all duration-1000"
                        style={{ width: '25%' }}
                      >
                        <span className="text-white font-semibold text-sm">6%</span>
                      </div>
                    </div>
                  </div>

                  {/* CDI */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-[#1A2F4B]">CDI / Tesouro Direto</span>
                      <span className="text-lg font-bold text-blue-600">~10% a.a.</span>
                    </div>
                    <div className="relative h-12 bg-blue-50 rounded-lg overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-end pr-4 transition-all duration-1000"
                        style={{ width: '42%' }}
                      >
                        <span className="text-white font-semibold text-sm">10%</span>
                      </div>
                    </div>
                  </div>

                  {/* Vivant Capital */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-semibold text-[#1A2F4B] flex items-center gap-2">
                        Vivant Capital
                        <span className="text-xs bg-vivant-gold-muted text-white px-2 py-1 rounded">DESTAQUE</span>
                      </span>
                      <span className="text-lg font-bold text-vivant-green">IPCA + 12% (~16-18% a.a.)</span>
                    </div>
                    <div className="relative h-14 bg-vivant-green/10 rounded-lg overflow-hidden border-2 border-vivant-green">
                      <div 
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-vivant-green to-emerald-600 flex items-center justify-end pr-4 transition-all duration-1000"
                        style={{ width: '75%' }}
                      >
                        <span className="text-white font-bold">16-18%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-center text-sm text-[#1A2F4B]/60 mt-8">
                  * Rentabilidades estimadas. Investimentos estão sujeitos a riscos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section id="diferenciais" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              Por que Investir com a Vivant Capital?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-[#1A2F4B]/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-[#1A2F4B]" />
                </div>
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Segurança Jurídica
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70 mb-4">
                  Modelo 100% regulamentado com escritura pública e registro em
                  cartório. Seu investimento protegido por lei.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#1A2F4B]/60">
                    <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                    <span className="font-semibold">Patrimônio de Afetação</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#1A2F4B]/60">
                    <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                    <span className="font-semibold">Alienação Fiduciária</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#1A2F4B]/60">
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
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Alta Rentabilidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70 mb-4">
                  Margens operacionais de <span className="font-bold text-vivant-green">35-45%</span> com 
                  valorização imobiliária e modelo de negócio comprovado.
                </p>
                <div className="bg-vivant-green/10 border-l-4 border-vivant-green p-4 rounded">
                  <p className="text-sm font-semibold text-[#1A2F4B]">
                    Rentabilidade para investidores:
                  </p>
                  <p className="text-2xl font-bold text-vivant-green mt-1">
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
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Transparência Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70 mb-4">
                  Simulador financeiro completo, relatórios detalhados e
                  acompanhamento em tempo real dos seus investimentos.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-[#1A2F4B]/60">
                    <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                    <span className="font-semibold">Governança FII</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#1A2F4B]/60">
                    <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                    <span className="font-semibold">Auditoria Externa</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#1A2F4B]/60">
                    <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                    <span className="font-semibold">Relatórios Trimestrais</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              Perguntas Frequentes
            </h2>
            <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">
              Entenda os aspectos técnicos e jurídicos do investimento
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white border-none shadow-md rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-[#1A2F4B]">
                    O que acontece se a Vivant quebrar?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[#1A2F4B]/70 pb-6">
                  <p className="mb-3">
                    Seu investimento está protegido por <strong>Patrimônio de Afetação</strong>, 
                    que segrega juridicamente os recursos de cada empreendimento. Isso significa 
                    que os ativos não se misturam com o patrimônio da Vivant.
                  </p>
                  <p>
                    Além disso, 50% dos pagamentos ficam em um <strong>Bolsão de Garantia</strong> em 
                    conta Escrow auditada externamente, sem possibilidade de acesso pela operadora.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white border-none shadow-md rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-[#1A2F4B]">
                    Como recebo meu pagamento?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[#1A2F4B]/70 pb-6">
                  <p className="mb-3">
                    Todos os pagamentos dos clientes finais vão para uma <strong>Conta Escrow</strong> auditada 
                    externamente. O sistema realiza um <strong>split automático</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>50% vai para o Bolsão de Garantia (protege o investidor)</li>
                    <li>50% vai para operação da Vivant</li>
                  </ul>
                  <p className="mt-3">
                    Você recebe seus retornos conforme cronograma acordado, com total rastreabilidade.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white border-none shadow-md rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-[#1A2F4B]">
                    O imóvel fica no meu nome?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[#1A2F4B]/70 pb-6">
                  <p className="mb-3">
                    Sim, mas com proteções. O modelo utiliza:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <strong>Alienação Fiduciária das Cotas:</strong> garante que o comprador final 
                      paga corretamente até quitar
                    </li>
                    <li>
                      <strong>Cláusula Resolutiva:</strong> permite retomada do imóvel em caso de 
                      inadimplência grave
                    </li>
                  </ul>
                  <p className="mt-3">
                    Após quitação total, o comprador fica com propriedade plena e sem ônus.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white border-none shadow-md rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-[#1A2F4B]">
                    Qual a estrutura de securitização?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[#1A2F4B]/70 pb-6">
                  <p className="mb-3">
                    Nossa estrutura é <strong>CRI-ready</strong>, ou seja, preparada para emissão de 
                    <strong> Certificados de Recebíveis Imobiliários</strong> (CRI).
                  </p>
                  <p className="mb-3">
                    Isso significa que os fluxos de pagamento podem ser securitizados e negociados 
                    no mercado secundário, oferecendo liquidez adicional aos investidores qualificados.
                  </p>
                  <p>
                    A estrutura segue as melhores práticas do mercado de renda fixa imobiliária.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white border-none shadow-md rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-[#1A2F4B]">
                    Como funciona a governança?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[#1A2F4B]/70 pb-6">
                  <p className="mb-3">
                    Seguimos padrões de <strong>Governança FII</strong> (Fundos de Investimento Imobiliário):
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Auditoria externa independente dos recursos</li>
                    <li>Relatórios gerenciais trimestrais</li>
                    <li>Compliance e due diligence de todos os ativos</li>
                    <li>Rastreabilidade completa dos fluxos financeiros</li>
                  </ul>
                  <p className="mt-3">
                    Transparência e prestação de contas são pilares do nosso modelo.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Simulador */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 sm:mb-6 px-2">
            Simule sua Oportunidade de Investimento
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
            Use nosso simulador de viabilidade e descubra o potencial de retorno do seu investimento em minutos
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#1A2F4B] hover:bg-white/90 text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
            >
              <Link href="/simulador-investimentos">
                Acessar Simulador
                <Calculator className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
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
