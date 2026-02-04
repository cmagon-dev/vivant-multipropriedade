import Link from "next/link";
import { Button } from "@/components/ui/button";
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

export default function CapitalHomePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b-2 border-vivant-navy/10 shadow-xl" style={{ boxShadow: '0 4px 16px rgba(26, 47, 75, 0.08)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-28">
            {/* Logo Vivant Capital */}
            <Link href="/" className="flex items-center py-2">
              <img 
                src="/logo-vivant-capital.png" 
                alt="Vivant Capital" 
                className="h-16 w-auto"
              />
            </Link>

            {/* Menu Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#sobre"
                className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-lg"
              >
                Sobre
              </a>
              <a
                href="#como-funciona"
                className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-lg"
              >
                Como Funciona
              </a>
              <a
                href="#estrutura"
                className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-lg"
              >
                Estrutura Financeira
              </a>
              <a
                href="#diferenciais"
                className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-lg"
              >
                Diferenciais
              </a>
              <Link
                href="/dashboard/simulador"
                className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-lg"
              >
                Simulador
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1A2F4B] via-[#2A4F6B] to-[#1A2F4B] pt-28">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full" 
            style={{
              backgroundImage: `
                linear-gradient(30deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
                linear-gradient(150deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
                linear-gradient(30deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
                linear-gradient(150deg, rgba(255,255,255,0.1) 12%, transparent 12.5%, transparent 87%, rgba(255,255,255,0.1) 87.5%, rgba(255,255,255,0.1)),
                linear-gradient(60deg, rgba(255,255,255,0.05) 25%, transparent 25.5%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05)),
                linear-gradient(60deg, rgba(255,255,255,0.05) 25%, transparent 25.5%, transparent 75%, rgba(255,255,255,0.05) 75%, rgba(255,255,255,0.05))
              `,
              backgroundSize: '80px 140px',
              backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center pt-20">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-6">
              <Building2 className="w-5 h-5 text-white" />
              <span className="text-white text-xl font-light">
                Vivant Capital
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Invista em Multipropriedade de Alto Padrão
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light">
              Oportunidades exclusivas de investimento em imóveis fracionados
              com alta rentabilidade e segurança jurídica
            </p>
          </div>
        </div>
      </section>

      {/* Sobre Vivant Capital */}
      <section id="sobre" className="py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
                Vivant Capital
              </h2>
              <p className="text-xl text-[#1A2F4B]/70">
                Boutique de Estruturação de Ativos Imobiliários
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-[#1A2F4B]/80 mb-12">
              <p className="text-lg leading-relaxed mb-6">
                A <strong>Vivant Capital</strong> é nossa boutique especializada em 
                <strong> estruturação de funding</strong> e <strong>originação de ativos</strong> no 
                mercado de multipropriedade. Enquanto a Vivant Residences atende o segmento de uso 
                pessoal, a Vivant Capital desenvolve oportunidades de <strong>equity real estate</strong> com 
                foco em investidores institucionais e qualificados.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                Nosso modelo de negócio combina <strong>aquisição estratégica de VGV</strong>, 
                fracionamento jurídico com <strong>Patrimônio de Afetação</strong> e gestão de 
                <strong> Conta Escrow</strong> com split automático de pagamentos. Operamos com 
                <strong> Cap Rate</strong> competitivo e <strong>margens operacionais de 35% a 45%</strong>, 
                oferecendo aos investidores rentabilidade de <strong>IPCA + 12% a.a.</strong> (~16-18% a.a.).
              </p>

              <p className="text-lg leading-relaxed">
                Nossa estrutura é <strong>CRI-ready</strong>, preparada para securitização via 
                Certificados de Recebíveis Imobiliários, com governança e compliance de padrão FII 
                (Fundo de Investimento Imobiliário).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modelo de Investimento */}
      <section id="como-funciona" className="py-20 bg-[#F8F9FA] scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
              Como Funciona o Investimento
            </h2>
            <p className="text-xl text-[#1A2F4B]/70 max-w-2xl mx-auto">
              Processo transparente do início ao retorno
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
            <div className="relative">
              <Card className="border-2 border-[#1A2F4B]/20 shadow-lg h-full">
                <CardHeader>
                  <div className="w-16 h-16 bg-[#1A2F4B] rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-center text-2xl font-serif text-[#1A2F4B]">
                    1. Aquisição
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#1A2F4B]/70">
                    Identificamos e adquirimos propriedades de alto padrão em
                    localizações premium com alto potencial de valorização.
                  </p>
                </CardContent>
              </Card>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-[#1A2F4B]/30" />
              </div>
            </div>

            <div className="relative">
              <Card className="border-2 border-[#1A2F4B]/20 shadow-lg h-full">
                <CardHeader>
                  <div className="w-16 h-16 bg-[#1A2F4B] rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-center text-2xl font-serif text-[#1A2F4B]">
                    2. Fracionamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#1A2F4B]/70">
                    Fracionamos a propriedade em até 6 cotas com escritura
                    pública, democratizando o acesso a imóveis de luxo.
                  </p>
                </CardContent>
              </Card>
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-[#1A2F4B]/30" />
              </div>
            </div>

            <div>
              <Card className="border-2 border-[#1A2F4B]/20 shadow-lg h-full">
                <CardHeader>
                  <div className="w-16 h-16 bg-[#1A2F4B] rounded-full flex items-center justify-center mb-4 mx-auto">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-center text-2xl font-serif text-[#1A2F4B]">
                    3. Rentabilidade
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-[#1A2F4B]/70">
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
      <section id="estrutura" className="py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
              Estrutura Financeira
            </h2>
            <p className="text-xl text-[#1A2F4B]/70 max-w-2xl mx-auto">
              Fluxo transparente e auditado dos recursos
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Fluxo Visual */}
            <div className="relative">
              {/* Cliente Paga */}
              <div className="flex justify-center mb-8">
                <Card className="border-2 border-[#1A2F4B] bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] shadow-xl w-80">
                  <CardContent className="p-8 text-center">
                    <Wallet className="w-16 h-16 text-white mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Cliente Investe</h3>
                    <p className="text-white/90">Pagamento da cota</p>
                  </CardContent>
                </Card>
              </div>

              {/* Seta para baixo */}
              <div className="flex justify-center mb-8">
                <ArrowDownRight className="w-12 h-12 text-[#1A2F4B]/30 rotate-90" />
              </div>

              {/* Conta Escrow */}
              <div className="flex justify-center mb-8">
                <Card className="border-2 border-vivant-gold-muted bg-white shadow-2xl w-96">
                  <CardContent className="p-8 text-center relative">
                    <div className="absolute -top-4 right-4">
                      <span className="inline-flex items-center bg-vivant-green text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Auditoria Externa
                      </span>
                    </div>
                    <Lock className="w-20 h-20 text-vivant-gold-muted mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-[#1A2F4B] mb-2">Conta Escrow</h3>
                    <p className="text-[#1A2F4B]/70 mb-1">Conta segregada e auditada</p>
                    <p className="text-sm font-semibold text-vivant-gold-muted">Split Automático</p>
                  </CardContent>
                </Card>
              </div>

              {/* Setas de divisão */}
              <div className="flex justify-center gap-32 mb-8">
                <ArrowDownRight className="w-12 h-12 text-[#1A2F4B]/30 -rotate-45" />
                <ArrowDownRight className="w-12 h-12 text-[#1A2F4B]/30 rotate-45" />
              </div>

              {/* Split 50/50 */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* 50% Bolsão Garantia */}
                <Card className="border-2 border-vivant-green bg-gradient-to-br from-vivant-green/10 to-white shadow-xl">
                  <CardContent className="p-8 text-center">
                    <Shield className="w-16 h-16 text-vivant-green mx-auto mb-4" />
                    <div className="inline-block bg-vivant-green text-white text-lg font-bold px-6 py-2 rounded-full mb-4">
                      50%
                    </div>
                    <h3 className="text-2xl font-bold text-[#1A2F4B] mb-2">Bolsão de Garantia</h3>
                    <p className="text-[#1A2F4B]/70 mb-4">
                      Recursos segregados para proteção do investidor
                    </p>
                    <div className="text-sm space-y-2 text-left bg-white/80 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                        <span>Patrimônio de Afetação</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                        <span>Alienação Fiduciária</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-vivant-green" />
                        <span>Cláusula Resolutiva</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 50% Operação Vivant */}
                <Card className="border-2 border-[#1A2F4B] bg-gradient-to-br from-[#1A2F4B]/10 to-white shadow-xl">
                  <CardContent className="p-8 text-center">
                    <Settings className="w-16 h-16 text-[#1A2F4B] mx-auto mb-4" />
                    <div className="inline-block bg-[#1A2F4B] text-white text-lg font-bold px-6 py-2 rounded-full mb-4">
                      50%
                    </div>
                    <h3 className="text-2xl font-bold text-[#1A2F4B] mb-2">Operação Vivant</h3>
                    <p className="text-[#1A2F4B]/70 mb-4">
                      Custos operacionais e margem da estruturadora
                    </p>
                    <div className="text-sm space-y-2 text-left bg-white/80 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#1A2F4B]" />
                        <span>Gestão e Compliance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#1A2F4B]" />
                        <span>Custos de Aquisição</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#1A2F4B]" />
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
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
              Rentabilidade Comparativa
            </h2>
            <p className="text-xl text-[#1A2F4B]/70 max-w-2xl mx-auto">
              Veja como a Vivant Capital se compara a outras opções de investimento
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-none shadow-2xl bg-white">
              <CardContent className="p-12">
                <div className="space-y-8">
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
      <section id="diferenciais" className="py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
              Por que Investir com a Vivant Capital?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                <CardTitle className="text-2xl font-serif text-[#1A2F4B]">
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
                <CardTitle className="text-2xl font-serif text-[#1A2F4B]">
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
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-[#1A2F4B]/70 max-w-2xl mx-auto">
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
      <section className="py-20 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Simule sua Oportunidade de Investimento
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Use nosso simulador de viabilidade e descubra o potencial de retorno
            do seu investimento em minutos
          </p>

          <Button
            asChild
            size="lg"
            className="bg-white text-[#1A2F4B] hover:bg-white/90 text-lg h-16 px-10"
          >
            <Link href="/dashboard/simulador">
              Acessar Simulador de Viabilidade
              <Calculator className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2F4B] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <img
                  src="/logo-vivant-capital.png"
                  alt="Vivant Capital"
                  className="h-20 w-auto brightness-0 invert opacity-70"
                />
              </div>
              <h3 className="text-2xl font-serif font-bold mb-2">
                Vivant Capital
              </h3>
              <p className="text-sm text-white/90 italic mb-2">
                Investimentos em Multipropriedade
              </p>
              <p className="text-white/70">
                Oportunidades exclusivas com alta rentabilidade e segurança
                jurídica.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link
                    href="/dashboard/simulador"
                    className="hover:text-white transition"
                  >
                    Simulador de Viabilidade
                  </Link>
                </li>
                <li>
                  <a
                    href="https://vivantresidences.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    Vivant Residences
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contato Investidores</h4>
              <p className="text-white/70">capital@vivant.com.br</p>
              <p className="text-white/70 mt-2">+55 (11) 9999-9999</p>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/50 text-sm">
            © 2026 Vivant Capital. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
