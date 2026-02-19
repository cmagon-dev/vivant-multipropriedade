import Link from "next/link";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Sparkles,
  Building2,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O Modelo Vivant - Multipropriedade Inteligente",
  description:
    "Entenda como a multipropriedade Vivant transforma o sonho da casa de lazer em realidade, com custo acessível, liquidez garantida e valorização patrimonial.",
  openGraph: {
    title: "O Modelo Vivant - Multipropriedade Inteligente",
    description:
      "Entenda como funciona a multipropriedade Vivant: acesso democrático a casas de alto padrão, custo fracionado e liquidez garantida.",
    type: "website",
  },
};

export default function ModeloPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-start justify-center overflow-hidden pt-28 sm:pt-32 lg:pt-40">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/75 via-[#1A2F4B]/60 to-[#F8F9FA]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center pt-8 sm:pt-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 px-2">
            O Modelo Vivant
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto px-4">
            Invista de forma inteligente e tenha acesso a múltiplas casas de veraneio em destinos exclusivos
          </p>
        </div>
      </section>

      {/* O que é Multipropriedade */}
      <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto mb-14 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-6">
              O que é Multipropriedade?
            </h2>
            <p className="text-base sm:text-lg text-[#1A2F4B]/75 leading-relaxed">
              A multipropriedade é um <strong>modelo jurídico</strong> previsto na{" "}
              <strong>Lei nº 13.777/2018</strong>, que permite que várias pessoas sejam{" "}
              <strong>coproprietárias de um imóvel</strong>, com direitos de uso
              fracionados e registrados em cartório.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Home,
                title: "Propriedade Fracionada",
                desc: (
                  <>
                    Você compra uma <strong>fração ideal</strong> da casa (ex: 1/8), que
                    equivale a um número específico de semanas de uso por ano. Cada fração
                    é <strong>registrada em cartório</strong> como propriedade individual.
                  </>
                ),
              },
              {
                icon: Calendar,
                title: "Períodos Personalizados",
                desc: (
                  <>
                    Seu calendário de uso é <strong>fixo e rotativo</strong>, garantindo
                    acesso em diferentes épocas do ano. Você agenda suas estadias através
                    do Portal do Cotista com antecedência.
                  </>
                ),
              },
              {
                icon: DollarSign,
                title: "Custo Compartilhado",
                desc: (
                  <>
                    Todas as despesas (manutenção, seguros, IPTU, gestão) são{" "}
                    <strong>divididas proporcionalmente</strong> entre os cotistas. Taxa
                    de condomínio fixa mensal, sem surpresas.
                  </>
                ),
              },
              {
                icon: Shield,
                title: "Segurança Jurídica",
                desc: (
                  <>
                    A multipropriedade está{" "}
                    <strong>prevista no Código Civil</strong> (Lei 13.777/2018). Você é
                    dono de verdade, com escritura pública e matrícula no cartório de
                    imóveis.
                  </>
                ),
              },
            ].map((item, idx) => (
              <Card key={idx} className="border-2 border-[#1A2F4B]/10 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-br from-[#1A2F4B]/5 to-[#1A2F4B]/10 pb-4">
                  <item.icon className="w-10 h-10 text-[#1A2F4B] mb-3" />
                  <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-5">
                  <CardDescription className="text-sm sm:text-base text-[#1A2F4B]/75 leading-relaxed">
                    {item.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Por que funciona */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-14 text-center">
              Por que a Multipropriedade Funciona?
            </h2>

            <div className="space-y-10">
              {[
                {
                  icon: Users,
                  title: "Uso Inteligente de Ativos Ociosos",
                  desc: (
                    <>
                      Uma casa de lazer tradicional fica ociosa{" "}
                      <strong>80-90% do ano</strong>. Com multipropriedade, o imóvel é
                      utilizado de forma otimizada por vários cotistas, cada um tendo
                      acesso quando realmente precisa.
                    </>
                  ),
                },
                {
                  icon: DollarSign,
                  title: "Acessibilidade Financeira",
                  desc: (
                    <>
                      Uma casa de R$ 3 milhões se torna acessível: com 6 cotistas, cada
                      um investe <strong>apenas R$ 500 mil</strong>. Você tem acesso a
                      uma propriedade de alto padrão sem imobilizar grande capital.
                    </>
                  ),
                },
                {
                  icon: Sparkles,
                  title: "Zero Dor de Cabeça",
                  desc: (
                    <>
                      A <strong>Vivant Care</strong> cuida de tudo: manutenção, limpeza,
                      jardinagem, seguros, IPTU. Você só precisa chegar, aproveitar e ir
                      embora. Gestão hoteleira profissional para sua tranquilidade.
                    </>
                  ),
                },
                {
                  icon: TrendingUp,
                  title: "Liquidez e Valorização",
                  desc: (
                    <>
                      Diferente de um imóvel inteiro, sua fração pode ser{" "}
                      <strong>vendida mais facilmente</strong> (ticket menor atrai mais
                      compradores). E você ainda se beneficia da valorização imobiliária
                      da região.
                    </>
                  ),
                },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] flex items-center justify-center shadow-md">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1A2F4B] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#1A2F4B]/75 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sistema de Cotas */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
              Como Funciona o Sistema de Cotas
            </h2>
            <p className="text-xl text-[#1A2F4B]/70 max-w-2xl mx-auto">
              Simples, transparente e flexível para sua necessidade
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-[#1A2F4B]/10 rounded-full px-4 py-2 mb-4">
                  <Calendar className="w-5 h-5 text-[#1A2F4B]" />
                  <span className="font-semibold text-[#1A2F4B]">
                    1 Casa = Até 6 Cotas = 52 Semanas
                  </span>
                </div>
                <p className="text-[#1A2F4B]/70">
                  Distribuição inteligente: 4 cotas padrão + 2 cotas premium
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* 4 Cotas Padrão */}
                {[1, 2, 3, 4].map((cota) => (
                  <div
                    key={cota}
                    className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] rounded-lg p-6 text-white text-center border-2 border-white/20"
                  >
                    <div className="text-3xl font-bold mb-2">Cota {cota}</div>
                    <div className="text-sm opacity-90 mb-1">8 semanas/ano</div>
                    <div className="text-xs opacity-75">(56 dias)</div>
                    <div className="mt-2 text-xs bg-white/20 rounded px-2 py-1 inline-block">
                      Padrão
                    </div>
                  </div>
                ))}

                {/* 2 Cotas Premium */}
                {[5, 6].map((cota) => (
                  <div
                    key={cota}
                    className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg p-6 text-white text-center border-2 border-amber-300 relative overflow-hidden"
                  >
                    <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      PREMIUM
                    </div>
                    <div className="text-3xl font-bold mb-2">Cota {cota}</div>
                    <div className="text-sm opacity-90 mb-1">10 semanas/ano</div>
                    <div className="text-xs opacity-75">(70 dias)</div>
                    <div className="mt-2 text-xs bg-white/30 rounded px-2 py-1 inline-block font-semibold">
                      +2 semanas
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-[#F8F9FA] rounded-lg p-4 text-center">
                <p className="text-sm text-[#1A2F4B]/70">
                  💡 <strong>Total perfeito:</strong> 4 cotas × 8 semanas + 2 cotas × 10 semanas = 52 semanas/ano
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por que é a Escolha Inteligente + Comparativo Financeiro Real */}
      <section className="py-20 lg:py-24 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">

            {/* Cabeçalho */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-4 text-center">
              Por que a Multipropriedade é a Escolha Inteligente?
            </h2>
            <p className="text-base sm:text-lg text-[#1A2F4B]/65 text-center mb-14 max-w-3xl mx-auto">
              Dados do mercado revelam que casas de veraneio tradicionais ficam vazias até 90%
              do tempo. Veja como a Vivant resolve esse problema:
            </p>

            {/* Comparativo de modelo */}
            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-10">
              <Card className="border-2 border-red-200 shadow-md">
                <CardHeader className="bg-red-50 border-b border-red-200 pb-4 h-[95px] flex flex-col justify-end">
                  <p className="text-xs font-semibold text-red-500 uppercase tracking-wide mb-1">Único proprietário</p>
                  <CardTitle className="text-xl sm:text-2xl font-serif text-red-900">
                    Casa de Veraneio Tradicional
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { emoji: "⏰", title: "Baixo Uso Real", desc: "Média de apenas 30-45 dias/ano de uso efetivo, mesmo com todo o investimento feito" },
                      { emoji: "🏚️", title: "Ociosidade Crítica", desc: "A casa fica vazia 80-90% do tempo, deteriorando e gerando custos sem retorno" },
                      { emoji: "💸", title: "Custos Fixos Altos", desc: "IPTU, condomínio, manutenção e caseiro continuam mesmo quando ninguém está usando" },
                      { emoji: "🔒", title: "Capital Imobilizado", desc: "Milhões de reais parados que poderiam estar rendendo no mercado financeiro" },
                      { emoji: "🚗", title: "Dependência da Distância", desc: "Uso frequente só funciona se estiver a 2-3h. Locais mais distantes viram peso financeiro" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start h-[64px]">
                        <span className="text-xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-red-900 mb-1">{item.title}</p>
                          <p className="text-xs text-red-900/65 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-emerald-300 shadow-md">
                <CardHeader className="bg-emerald-50 border-b border-emerald-200 pb-4 h-[95px] flex flex-col justify-end">
                  <div className="inline-block bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2 self-start">SOLUÇÃO INTELIGENTE</div>
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Modelo otimizado</p>
                  <CardTitle className="text-xl sm:text-2xl font-serif text-emerald-900">
                    Vivant Multipropriedade
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { emoji: "✅", title: "Uso Maximizado", desc: "8 a 10 semanas/ano garantidas com 1 cota (2x mais que a média tradicional de 4-6 semanas!)" },
                      { emoji: "🏡", title: "Zero Ociosidade", desc: "Casa sempre cuidada e ocupada pelos cotistas, com manutenção preventiva contínua" },
                      { emoji: "💰", title: "Custos Proporcionais", desc: "Você paga apenas sua fração dos custos (IPTU, condomínio, manutenção)" },
                      { emoji: "📈", title: "Capital Liberado", desc: "Sobram até R$ 1,9M livres para investir e gerar renda passiva mensal" },
                      { emoji: "🌎", title: "Múltiplos Destinos", desc: "Com o mesmo investimento, você pode ter cotas em diferentes locais (praia, lago, serra)" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex gap-3 items-start h-[64px]">
                        <span className="text-xl flex-shrink-0 mt-0.5">{item.emoji}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-emerald-900 mb-1">{item.title}</p>
                          <p className="text-xs text-emerald-900/65 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Dados do Mercado */}
            <div className="bg-white rounded-2xl shadow-md p-6 lg:p-8 mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1A2F4B] text-center mb-1">
                📊 Dados do Mercado de Segunda Residência
              </h3>
              <p className="text-sm text-[#1A2F4B]/50 text-center mb-8">
                Pesquisas consolidadas do setor imobiliário de lazer
              </p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { value: "30-45", unit: "Dias", desc: "de uso médio anual em casas tradicionais" },
                  { value: "80-90%", unit: "", desc: "Do tempo a casa fica completamente vazia" },
                  { value: "150km", unit: "", desc: "Distância ideal para uso frequente (finais de semana)" },
                  { value: "+250%", unit: "", desc: "Crescimento do home office aumentou permanência" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-2xl sm:text-3xl font-bold text-[#1A2F4B]">{stat.value}</p>
                    {stat.unit && <p className="text-sm font-medium text-[#1A2F4B]/55">{stat.unit}</p>}
                    <p className="text-xs text-[#1A2F4B]/55 mt-1 leading-relaxed">{stat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-vivant-gold/10 border-2 border-vivant-gold/30 rounded-xl p-5 mb-16">
              <p className="text-sm sm:text-base text-[#1A2F4B] leading-relaxed text-center">
                💡 <strong>Insight:</strong> A Vivant transforma esses 80-90% de ociosidade em
                economia real, garantindo que você pague apenas pelo que usa e ainda tenha mais
                dias de lazer!
              </p>
            </div>

            {/* ── Comparativo Financeiro Real ── */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-4 text-center">
              Comparativo Financeiro Real
            </h2>
            <p className="text-base sm:text-lg text-[#1A2F4B]/65 text-center mb-14 max-w-3xl mx-auto">
              Entenda o impacto financeiro real de cada opção e o custo do patrimônio imobilizado
            </p>

            <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-10">
              {/* Casa Tradicional */}
              <Card className="border-2 border-red-200 shadow-md">
                <CardHeader className="bg-red-50 border-b border-red-200 h-[110px] flex flex-col justify-end pb-4">
                  <p className="text-xs text-red-500 font-semibold uppercase tracking-wide mb-1">
                    Investimento integral em um único imóvel
                  </p>
                  <CardTitle className="text-xl font-serif text-red-900">Casa Veraneio Tradicional</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Box Investimento */}
                  <div className="bg-red-100 rounded-xl p-4 mb-6 h-[110px] flex flex-col justify-center">
                    <p className="text-xs text-red-700 font-semibold mb-1">💰 Investimento Inicial (Patrimônio Imobilizado)</p>
                    <p className="text-3xl font-bold text-red-900">R$ 2,4M</p>
                    <p className="text-xs text-red-700/70 mt-1">Capital parado que poderia render 12% a.a. = R$ 288.000/ano</p>
                  </div>

                  {/* Título Custos */}
                  <p className="text-xs font-semibold text-[#1A2F4B]/50 uppercase tracking-wide mb-3 h-[16px]">
                    Custos Operacionais Anuais
                  </p>

                  {/* Lista de Custos */}
                  <div className="mb-6 h-[128px] flex flex-col justify-between">
                    {[
                      { label: "IPTU", value: "R$ 16.000" },
                      { label: "Manutenção", value: "R$ 32.000" },
                      { label: "Condomínio", value: "R$ 24.000" },
                      { label: "Custo de oportunidade (12% a.a.)", value: "R$ 288.000" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm border-b border-red-100 pb-2">
                        <span className="text-red-900/65">{item.label}</span>
                        <span className="font-semibold text-red-900">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Uso Médio */}
                  <div className="flex items-center gap-2 text-sm text-red-700 mb-6 h-[48px]">
                    <span>📅</span>
                    <span><strong>Uso médio real:</strong> 30 dias/ano</span>
                  </div>

                  {/* Box Total */}
                  <div className="bg-red-900 rounded-xl p-4 text-center text-white h-[110px] flex flex-col justify-center">
                    <p className="text-xs text-red-200 mb-1">Custo Total no 1º Ano</p>
                    <p className="text-2xl sm:text-3xl font-bold">R$ 2.760.000</p>
                    <p className="text-xs text-red-200 mt-1">Investimento inicial + custos operacionais + oportunidade perdida</p>
                  </div>
                </CardContent>
              </Card>

              {/* Vivant */}
              <Card className="border-2 border-emerald-300 shadow-md">
                <CardHeader className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] border-b border-emerald-300 h-[110px] flex flex-col justify-end pb-4">
                  <div className="inline-block bg-vivant-gold text-[#1A2F4B] text-xs font-bold px-3 py-1 rounded-full mb-2 self-start">
                    MELHOR ESCOLHA
                  </div>
                  <p className="text-xs text-white/65 font-semibold uppercase tracking-wide mb-1">
                    Investimento inteligente em fração ideal
                  </p>
                  <CardTitle className="text-xl font-serif text-white">Vivant Multipropriedade</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Box Investimento */}
                  <div className="bg-[#1A2F4B]/10 rounded-xl p-4 mb-6 h-[110px] flex flex-col justify-center">
                    <p className="text-xs text-[#1A2F4B] font-semibold mb-1">💎 Investimento Inicial (1 cota)</p>
                    <p className="text-3xl font-bold text-[#1A2F4B]">R$ 500.000</p>
                    <p className="text-xs text-emerald-700 font-semibold mt-1">✓ Sobram R$ 1.900.000 livres para investir e render!</p>
                  </div>

                  {/* Título Custos */}
                  <p className="text-xs font-semibold text-[#1A2F4B]/50 uppercase tracking-wide mb-3 h-[16px]">
                    Custos Operacionais Anuais
                  </p>

                  {/* Lista de Custos */}
                  <div className="mb-6 h-[128px] flex flex-col justify-between">
                    {[
                      { label: "IPTU", value: "R$ 2.700", positive: false },
                      { label: "Manutenção", value: "R$ 5.500", positive: false },
                      { label: "Condomínio", value: "R$ 4.000", positive: false },
                      { label: "Rendimento do saldo (12% a.a.)", value: "+ R$ 228.000", positive: true },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm border-b border-[#1A2F4B]/10 pb-2">
                        <span className="text-[#1A2F4B]/65">{item.label}</span>
                        <span className={`font-semibold ${item.positive ? "text-emerald-600" : "text-[#1A2F4B]"}`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Uso Garantido */}
                  <div className="flex flex-col gap-1 text-sm text-[#1A2F4B]/65 mb-6 h-[48px] justify-center">
                    <div className="flex items-center gap-2">
                      <span>🎯</span>
                      <span><strong>Uso garantido:</strong> 8-10 semanas/ano</span>
                    </div>
                    <p className="text-xs text-emerald-600 font-semibold pl-6">
                      2x mais uso que a casa veraneio tradicional!
                    </p>
                  </div>

                  {/* Box Total */}
                  <div className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] rounded-xl p-4 text-center text-white h-[110px] flex flex-col justify-center">
                    <p className="text-xs text-white/65 mb-1">Custo Total no 1º Ano</p>
                    <p className="text-2xl sm:text-3xl font-bold">R$ 284.200</p>
                    <p className="text-xs text-white/65 mt-1">Investimento + custos - rendimento do saldo livre</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vantagem */}
            <div className="bg-gradient-to-r from-[#1A2F4B] to-[#2A4F6B] rounded-2xl p-6 lg:p-8 text-white mb-6">
              <p className="text-center text-white/70 text-xs font-semibold uppercase tracking-widest mb-4">
                Vantagem Financeira Total
              </p>
              <p className="text-center text-4xl sm:text-5xl font-bold mb-2">R$ 2.475.800</p>
              <p className="text-center text-white/60 text-sm mb-8">de economia no primeiro ano</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { value: "90%", label: "de economia total" },
                  { value: "2x", label: "mais dias de uso" },
                  { value: "R$ 1,9M", label: "livres para investir" },
                  { value: "8-10", label: "semanas/ano garantidas" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center bg-white/10 rounded-xl p-4">
                    <p className="text-xl sm:text-2xl font-bold text-vivant-gold">{stat.value}</p>
                    <p className="text-xs text-white/65 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-vivant-gold/10 border border-vivant-gold/30 rounded-xl p-4 sm:p-5">
              <p className="text-xs sm:text-sm text-[#1A2F4B]/75 leading-relaxed text-center">
                💡 <strong>Importante:</strong> O custo de oportunidade do capital parado é
                calculado considerando rendimento conservador de 12% a.a. (CDI médio histórico)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Diferencial Vivant */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-5 text-center">
              O Diferencial da Vivant
            </h2>
            <p className="text-base sm:text-lg text-[#1A2F4B]/75 text-center mb-14 max-w-3xl mx-auto">
              Não somos apenas uma multipropriedade. Somos um{" "}
              <strong>ecossistema completo</strong> para você viver, investir e prosperar.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Vivant Residences",
                  desc: "Multipropriedade com segurança jurídica e casas de alto padrão",
                },
                {
                  icon: Sparkles,
                  title: "Vivant Care",
                  desc: "Gestão hoteleira profissional, você só aproveita",
                },
                {
                  icon: TrendingUp,
                  title: "Vivant Capital",
                  desc: "Plataforma de investimentos para multiplicar seu patrimônio",
                },
                {
                  icon: Building2,
                  title: "Vivant Partners",
                  desc: "Cadastre seu imóvel e monetize seu ativo com inteligência",
                },
              ].map((item, idx) => (
                <Card
                  key={idx}
                  className="border-2 border-[#1A2F4B]/10 hover:border-[#1A2F4B]/25 transition-all shadow-md hover:shadow-lg"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1A2F4B]/10 to-[#1A2F4B]/20 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="w-7 h-7 text-[#1A2F4B]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">{item.title}</h3>
                    <p className="text-sm text-[#1A2F4B]/65 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 lg:py-24 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 px-2">
            Pronto para conhecer o modelo Vivant?
          </h2>
          <p className="text-base sm:text-lg text-white/85 mb-10 max-w-2xl mx-auto px-4">
            Fale com nossos especialistas e descubra como ter sua casa de lazer com inteligência
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#1A2F4B] hover:bg-white/90 text-base sm:text-lg min-h-[52px] py-4 px-10 font-semibold"
            >
              <Link href="/casas">Ver Casas Disponíveis</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-base sm:text-lg min-h-[52px] py-4 px-10 font-semibold"
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
