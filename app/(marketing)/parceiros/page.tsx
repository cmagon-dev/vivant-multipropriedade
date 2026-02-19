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
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { ValidationTimeline } from "@/components/marketing/validation-timeline";
import { PartnerLeadForm } from "@/components/marketing/partner-lead-form";
import {
  Building2,
  TrendingUp,
  Shield,
  Zap,
  XCircle,
  CheckCircle2,
  ArrowRight,
  Clock,
  DollarSign,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastre seu Imóvel - Vivant Partners",
  description: "Transforme sua casa de férias em ativo líquido. Teste de mercado sem risco em 60 dias. Zero custos iniciais. Validação garantida.",
  openGraph: {
    title: "Vivant Partners - Monetize seu Imóvel",
    description: "Modelo de validação sem custos iniciais. Opção de Prioridade de 60 dias.",
    type: "website",
  },
};

export default function ParceirosPage(): JSX.Element {
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
              "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/80 via-[#1A2F4B]/70 to-[#F8F9FA]" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-vivant-gold/20 backdrop-blur-sm border border-vivant-gold/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
              <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-vivant-gold" />
              <span className="text-vivant-gold text-base sm:text-xl font-semibold">
                Vivant Partners
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Transforme sua Casa de Férias em um Ativo Líquido
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto font-light px-2">
              Teste de mercado sem risco. Zero custos iniciais. Validação em 60 dias.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                asChild
                size="lg"
                className="bg-vivant-gold text-vivant-navy hover:bg-vivant-gold/90 text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
              >
                <a href="#formulario">
                  Avaliar meu Imóvel Agora
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1A2F4B] text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
              >
                <a href="#como-funciona">Como Funciona</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problema vs Solução */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              O Problema que Todo Proprietário Enfrenta
            </h2>
            <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">
              Casa de férias parada, custos altos e capital imobilizado
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 max-w-6xl mx-auto">
            {/* Coluna Esquerda: Problemas */}
            <div className="bg-red-50 rounded-2xl p-6 sm:p-8 border-2 border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1A2F4B]">
                  Modelo Tradicional
                </h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-700 text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A2F4B]">Casa parada 90% do tempo</p>
                    <p className="text-sm text-[#1A2F4B]/70">Você usa 1-2 meses/ano, mas paga 12 meses de custos</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-700 text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A2F4B]">Custos fixos altíssimos</p>
                    <p className="text-sm text-[#1A2F4B]/70">IPTU, condomínio, manutenção, segurança, caseiro...</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-700 text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A2F4B]">Capital imobilizado</p>
                    <p className="text-sm text-[#1A2F4B]/70">R$ 2-5MM parados que poderiam render 12% a.a.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-700 text-xs font-bold">✕</span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A2F4B]">Venda tradicional demorada</p>
                    <p className="text-sm text-[#1A2F4B]/70">6-12 meses para vender, sem garantia de sucesso</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Coluna Direita: Solução Vivant */}
            <div className="bg-gradient-to-br from-vivant-gold/10 to-yellow-50 rounded-2xl p-6 sm:p-8 border-2 border-vivant-gold relative">
              <div className="absolute -top-4 right-8 bg-vivant-gold text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                SOLUÇÃO VIVANT
              </div>

              <div className="flex items-center gap-3 mb-6 mt-2">
                <div className="w-12 h-12 rounded-full bg-vivant-gold flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1A2F4B]">
                  Vivant Partners
                </h3>
              </div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vivant-gold flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A2F4B]">Teste de mercado sem compromisso</p>
                    <p className="text-sm text-[#1A2F4B]/70">Validamos demanda ANTES de qualquer contrato</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vivant-gold flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A2F4B]">Zero custos iniciais</p>
                    <p className="text-sm text-[#1A2F4B]/70">Sem investimento jurídico, marketing ou cartório até validar</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vivant-gold flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A2F4B]">Liquidez imediata</p>
                    <p className="text-sm text-[#1A2F4B]/70">Receba aporte das 2 primeiras cotas em 30 dias (se validar)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-vivant-gold flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A2F4B]">Validação em 60 dias</p>
                    <p className="text-sm text-[#1A2F4B]/70">Resposta rápida: vendeu = continua | não vendeu = sem custos</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona - Timeline */}
      <section id="como-funciona" className="py-12 sm:py-16 lg:py-20 bg-[#F8F9FA] scroll-mt-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              Como Funciona o Modelo de Validação
            </h2>
            <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">
              Processo transparente de 60 dias para testar a demanda do seu imóvel
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <ValidationTimeline />
          </div>
        </div>
      </section>

      {/* Benefícios para o Proprietário */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              Benefícios para o Proprietário
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-vivant-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-vivant-gold" />
                </div>
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Teste de Mercado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Valide a demanda antes de qualquer compromisso. Sem risco jurídico ou financeiro.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-vivant-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-vivant-gold" />
                </div>
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Sem Custos Iniciais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Zero investimento em jurídico, marketing ou cartório até a validação ser confirmada.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-vivant-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-vivant-gold" />
                </div>
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Liquidez Imediata
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Receba aporte das 2 primeiras cotas em até 30 dias após validação positiva.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-vivant-gold/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-vivant-gold" />
                </div>
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Gestão Completa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Vivant cuida de tudo: jurídico, marketing, vendas, incorporação e gestão hoteleira.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Diferencial: Opção de Prioridade vs Exclusividade */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              Por que Opção de Prioridade e não Exclusividade?
            </h2>
            <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">
              Transparência e risco zero para ambos os lados
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <thead>
                  <tr className="bg-gradient-to-r from-vivant-gold to-yellow-600">
                    <th className="py-4 px-6 text-left text-white font-serif text-lg">Aspecto</th>
                    <th className="py-4 px-6 text-center text-white font-serif text-lg">Vivant (Prioridade 60d)</th>
                    <th className="py-4 px-6 text-center text-white font-serif text-lg">Modelo Tradicional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-6 font-semibold text-[#1A2F4B]">Custos iniciais</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-block bg-vivant-green/10 text-vivant-green font-bold px-4 py-2 rounded-full">
                        R$ 0
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-block bg-red-50 text-red-600 font-bold px-4 py-2 rounded-full">
                        R$ 50-100k (jurídico)
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-4 px-6 font-semibold text-[#1A2F4B]">Risco</td>
                    <td className="py-4 px-6 text-center font-bold text-vivant-green">Zero</td>
                    <td className="py-4 px-6 text-center font-bold text-red-600">Alto</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-[#1A2F4B]">Prazo validação</td>
                    <td className="py-4 px-6 text-center font-bold text-vivant-green">60 dias</td>
                    <td className="py-4 px-6 text-center font-bold text-red-600">6-12 meses</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="py-4 px-6 font-semibold text-[#1A2F4B]">Exclusividade</td>
                    <td className="py-4 px-6 text-center">Não (só prioridade)</td>
                    <td className="py-4 px-6 text-center">Sim (lock)</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 font-semibold text-[#1A2F4B]">Aporte imediato</td>
                    <td className="py-4 px-6 text-center font-bold text-vivant-green">Se validar</td>
                    <td className="py-4 px-6 text-center">Após venda total</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 bg-vivant-gold/10 border-l-4 border-vivant-gold rounded-lg p-6">
              <p className="text-[#1A2F4B]">
                <strong>💡 Diferencial:</strong> Com a Opção de Prioridade, você não fica "preso" ao contrato. 
                Se não vendermos as 2 cotas em 60 dias, o acordo expira automaticamente e você fica livre para 
                buscar outras alternativas. <strong>Sem multas, sem custos, sem burocracia.</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formulário de Lead */}
      <section id="formulario" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              Avalie seu Imóvel Gratuitamente
            </h2>
            <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">
              Preencha o formulário e receba uma proposta personalizada em até 48 horas
            </p>
          </div>

          <PartnerLeadForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white border-none shadow-md rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-[#1A2F4B]">
                    O que acontece se não vender em 60 dias?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[#1A2F4B]/70 pb-6">
                  <p>
                    A <strong>Opção de Prioridade expira automaticamente</strong> após 60 dias. Você fica 
                    totalmente livre para buscar outras alternativas, sem qualquer custo, multa ou burocracia. 
                    É um teste de mercado sem risco para ambas as partes.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white border-none shadow-md rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-[#1A2F4B]">
                    Quanto custa o processo jurídico de fracionamento?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[#1A2F4B]/70 pb-6">
                  <p className="mb-3">
                    O custo de <strong>estruturação jurídica (SPE, incorporação, escrituras)</strong> varia 
                    entre R$ 50.000 e R$ 100.000, dependendo da complexidade do imóvel.
                  </p>
                  <p>
                    No modelo Vivant, você <strong>NÃO paga nada disso antecipadamente</strong>. Os custos 
                    jurídicos só são iniciados APÓS a validação positiva (venda das 2 cotas). E fazem parte 
                    do acordo de repasse financeiro entre Vivant e proprietário.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white border-none shadow-md rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-[#1A2F4B]">
                    Posso vender por fora durante os 60 dias?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[#1A2F4B]/70 pb-6">
                  <p className="mb-3">
                    <strong>Sim!</strong> A Opção de Prioridade NÃO é uma exclusividade total. Você mantém 
                    a liberdade de receber outras propostas e negociar paralelamente.
                  </p>
                  <p>
                    A única regra é: <strong>se a Vivant vender as 2 cotas dentro dos 60 dias</strong>, você 
                    nos dá preferência para prosseguir com a incorporação. Caso contrário, você está livre.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white border-none shadow-md rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-[#1A2F4B]">
                    Qual o critério de precificação das Founder Quotas?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[#1A2F4B]/70 pb-6">
                  <p className="mb-3">
                    As <strong>Founder Quotas</strong> são as 2 primeiras cotas lançadas com preço promocional 
                    para testar a demanda. O preço é definido com base em:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Avaliação de mercado do imóvel</li>
                    <li>Localização e infraestrutura</li>
                    <li>Demanda histórica da região</li>
                    <li>Análise comparativa de VGV (Valor Geral de Vendas)</li>
                  </ul>
                  <p className="mt-3">
                    O preço das Founder Quotas é geralmente <strong>10-15% abaixo</strong> do valor das 
                    cotas regulares, para acelerar a validação.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white border-none shadow-md rounded-lg px-6">
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="text-lg font-semibold text-[#1A2F4B]">
                    Como funciona o repasse financeiro após validação?
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-[#1A2F4B]/70 pb-6">
                  <p className="mb-3">
                    Se as 2 cotas forem vendidas em 60 dias, iniciamos a <strong>estruturação jurídica (SPE)</strong> 
                    e você recebe o aporte proporcional às 2 cotas vendidas.
                  </p>
                  <p className="mb-3">
                    Exemplo: Imóvel de R$ 3MM fracionado em 6 cotas = R$ 500k por cota. Se vendermos 2 cotas:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Você recebe R$ 1MM (2/6 do VGV)</li>
                    <li>Vivant continua vendendo as 4 cotas restantes</li>
                    <li>À medida que novas cotas são vendidas, você recebe proporcionalmente</li>
                  </ul>
                  <p className="mt-3">
                    O cronograma de repasse é negociado caso a caso, com transparência total.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Proof Social */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              Números que Comprovam
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-lg text-center">
              <CardContent className="pt-8">
                <p className="text-4xl sm:text-5xl font-bold text-vivant-gold mb-2">50+</p>
                <p className="text-[#1A2F4B]/70">Imóveis avaliados</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg text-center">
              <CardContent className="pt-8">
                <p className="text-4xl sm:text-5xl font-bold text-vivant-gold mb-2">73%</p>
                <p className="text-[#1A2F4B]/70">Taxa de validação</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg text-center">
              <CardContent className="pt-8">
                <p className="text-4xl sm:text-5xl font-bold text-vivant-gold mb-2">42</p>
                <p className="text-[#1A2F4B]/70">Dias médios de venda</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg text-center">
              <CardContent className="pt-8">
                <p className="text-4xl sm:text-5xl font-bold text-vivant-gold mb-2">R$ 8M</p>
                <p className="text-[#1A2F4B]/70">Captados em 2025</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 px-2">
            Conheça nossas propriedades disponíveis
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto px-4">
            Explore nossos destinos exclusivos e encontre a casa de férias ideal para você
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#1A2F4B] hover:bg-white/90 text-base sm:text-lg min-h-[48px] py-4 px-8 font-semibold"
            >
              <Link href="/casas">Ver Casas Disponíveis</Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-base sm:text-lg min-h-[48px] py-4 px-8 font-semibold"
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
