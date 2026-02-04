import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  Shield,
  Target,
  BarChart3,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Building2,
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
                href="https://vivantresidences.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-lg"
              >
                Vivant Residences
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
                Vivant Capital
              </h2>
              <p className="text-xl text-[#1A2F4B]/70">
                A divisão de investimentos da Vivant
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-[#1A2F4B]/80 mb-12">
              <p className="text-lg leading-relaxed mb-6">
                A <strong>Vivant Capital</strong> é a nossa divisão
                especializada em oportunidades de investimento no mercado de
                multipropriedade. Enquanto a Vivant oferece casas de férias para
                uso pessoal, a Vivant Capital foca em{" "}
                <strong>investidores</strong> que buscam rentabilidade através
                do modelo de propriedade fracionada.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                Identificamos, adquirimos e fracionamos propriedades de alto
                padrão em localizações estratégicas, oferecendo aos investidores
                a oportunidade de participar deste mercado em crescimento com{" "}
                <strong>margens operacionais de 35% a 45%</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modelo de Investimento */}
      <section className="py-20 bg-[#F8F9FA]">
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

          {/* Estrutura Financeira */}
          <div className="max-w-3xl mx-auto">
            <Card className="border-2 border-[#1A2F4B]/10 bg-white shadow-xl">
              <CardHeader>
                <CardTitle className="text-center text-3xl font-serif text-[#1A2F4B]">
                  Estrutura Financeira
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-[#1A2F4B]">
                      VGV Total (Vendas)
                    </span>
                  </div>
                  <span className="text-[#1A2F4B]/70">
                    Preço × Quantidade de Cotas
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-[#1A2F4B]">
                      Imposto RET (4%)
                    </span>
                  </div>
                  <span className="text-[#1A2F4B]/70">Deduzido do VGV</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-[#1A2F4B]">
                      Split 50/50
                    </span>
                  </div>
                  <span className="text-[#1A2F4B]/70">
                    Garantia + Operacional
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-[#1A2F4B]">
                      Margem Final
                    </span>
                  </div>
                  <span className="font-bold text-green-600 text-lg">
                    35-45%
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 bg-white">
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
                <p className="text-[#1A2F4B]/70">
                  Modelo 100% regulamentado com escritura pública e registro em
                  cartório. Seu investimento protegido por lei.
                </p>
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
                <p className="text-[#1A2F4B]/70">
                  Margens operacionais de 35-45% com valorização imobiliária e
                  modelo de negócio comprovado.
                </p>
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
                <p className="text-[#1A2F4B]/70">
                  Simulador financeiro completo, relatórios detalhados e
                  acompanhamento em tempo real dos seus investimentos.
                </p>
              </CardContent>
            </Card>
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
