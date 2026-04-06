import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Home,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Sparkles,
  Building2,
  Award,
  CheckCircle2,
  MapPin,
  Bed,
  Target,
  Heart,
  BarChart3,
  Wallet,
  Lock,
  Settings,
  ArrowDownRight,
  Handshake,
  FileText,
  TrendingDown,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import "./print-styles.css";
import { PrintButton } from "@/components/marketing/print-button";

export const metadata: Metadata = {
  title: "Apresentação Vivant - Modelo de Negócio",
  description: "Apresentação completa do modelo de negócio Vivant Multipropriedade para parceiros estratégicos",
};

export default function ApresentacaoPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header Fixo da Apresentação */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="w-32"></div>
            <img 
              src="/logo-vivant.png" 
              alt="Vivant" 
              className="h-10 sm:h-12 w-auto object-contain"
            />
            <div className="w-32 flex justify-end">
              <PrintButton />
            </div>
          </div>
        </div>
      </header>

      {/* Botão Flutuante de Impressão (Mobile) */}
      <div className="fixed bottom-6 right-6 z-50 no-print md:hidden">
        <PrintButton />
      </div>

      {/* Espaçamento do Header */}
      <div className="h-16 sm:h-20" />

      {/* Hero da Apresentação */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/75 via-[#1A2F4B]/55 via-[#1A2F4B]/30 to-[#F8F9FA]/60" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center py-20">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white text-xl font-light italic">
                "A arte de viver bem"
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Vivant Multipropriedade
            </h1>

            <p className="text-2xl sm:text-3xl text-white/95 mb-8 font-light">
              O Futuro do Investimento Imobiliário de Lazer
            </p>

            <div className="bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-8 max-w-3xl mx-auto">
              <p className="text-xl text-white leading-relaxed">
                Apresentação completa do modelo de negócio para <strong>imobiliárias</strong> e <strong>fundos de investimento</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visão Geral do Negócio */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1A2F4B] mb-6">
                Visão Geral do Negócio
              </h2>
              <p className="text-xl text-[#1A2F4B]/70">
                Um ecossistema completo que revoluciona o mercado de segunda residência
              </p>
            </div>

            <div className="space-y-8 mb-12">
              <Card className="border-2 border-[#1A2F4B]/20 shadow-lg">
                <CardHeader className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] text-white">
                  <CardTitle className="text-2xl font-serif flex items-center gap-3">
                    <Target className="w-8 h-8" />
                    O Problema que Resolvemos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-red-700 mb-3">❌ Cenário Tradicional</h4>
                      <div className="space-y-3">
                        {[
                          "Casas de veraneio ficam vazias 80-90% do tempo",
                          "Capital imobilizado de R$ 1,5M a R$ 3M por imóvel",
                          "Custos fixos altos mesmo sem uso (IPTU, condomínio, caseiro)",
                          "Baixo uso real: apenas 30-45 dias/ano em média",
                          "Manutenção e gestão são responsabilidade exclusiva do proprietário",
                          "Liquidez baixa (difícil vender imóvel completo)",
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <TrendingDown className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <span className="text-[#1A2F4B]/75">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-lg text-emerald-700 mb-3">✅ Solução Vivant</h4>
                      <div className="space-y-3">
                        {[
                          "Investimento fracionado: apenas 1/6 do valor total",
                          "Capital liberado para outras aplicações rentáveis",
                          "Custos proporcionais à fração adquirida",
                          "Uso garantido de 8-10 semanas/ano (2x mais que tradicional)",
                          "Gestão hoteleira completa pela Vivant Care",
                          "Liquidez maior (tickets menores atraem mais compradores)",
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span className="text-[#1A2F4B]/75">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Modelo de Negócio: Lei e Jurídico */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1A2F4B] mb-6">
                Base Legal e Segurança Jurídica
              </h2>
            </div>

            <Card className="border-2 border-vivant-gold/30 bg-white shadow-xl mb-8">
              <CardHeader className="bg-gradient-to-r from-vivant-gold/20 to-vivant-gold/10">
                <CardTitle className="text-2xl font-serif text-[#1A2F4B] flex items-center gap-3">
                  <FileText className="w-8 h-8 text-vivant-gold" />
                  Lei nº 13.777/2018 - Multipropriedade Imobiliária
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <p className="text-lg text-[#1A2F4B]/80 leading-relaxed">
                    A multipropriedade é um <strong>regime jurídico</strong> previsto no <strong>Código Civil Brasileiro</strong>, 
                    que permite que múltiplas pessoas sejam coproprietárias de um imóvel, com direitos de uso fracionados 
                    e <strong>registrados em cartório</strong>.
                  </p>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        title: "Propriedade Real",
                        desc: "Cada cotista é dono de uma fração ideal do imóvel, com escritura pública registrada em cartório de imóveis.",
                        icon: Home,
                      },
                      {
                        title: "Direitos Garantidos",
                        desc: "Direito de uso, venda, doação, herança e garantia real sobre a fração de propriedade.",
                        icon: Shield,
                      },
                      {
                        title: "Segurança Total",
                        desc: "Proteção legal equivalente à propriedade integral, com todos os direitos de um proprietário tradicional.",
                        icon: Award,
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="bg-[#F8F9FA] rounded-lg p-6 border border-[#1A2F4B]/10">
                        <item.icon className="w-10 h-10 text-vivant-gold mb-3" />
                        <h4 className="font-bold text-lg text-[#1A2F4B] mb-2">{item.title}</h4>
                        <p className="text-sm text-[#1A2F4B]/70">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Ecossistema Vivant - 4 Verticais */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1A2F4B] mb-6">
                O Ecossistema Vivant
              </h2>
              <p className="text-xl text-[#1A2F4B]/70">
                Quatro verticais integradas que criam valor em toda a cadeia
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Vivant Residences */}
              <Card className="border-2 border-[#1A2F4B]/30 hover:shadow-2xl transition-all">
                <CardHeader className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] text-white pb-8">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Home className="w-9 h-9 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-serif">Vivant Residences</CardTitle>
                  <CardDescription className="text-white/80 text-base">
                    Core do Negócio - Comercialização
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-[#1A2F4B]/75 font-semibold mb-4">
                      Comercialização de frações de propriedades de alto padrão para uso pessoal
                    </p>
                    <div className="space-y-3">
                      {[
                        "Seleção de imóveis premium em destinos estratégicos",
                        "Fracionamento jurídico em até 6 cotas por propriedade",
                        "Sistema de uso garantido: 8-10 semanas/ano",
                        "Calendário rotativo para equidade entre cotistas",
                        "Escritura pública registrada em cartório",
                        "Gestão de vendas e relacionamento com cotistas",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#1A2F4B] flex-shrink-0 mt-1" />
                          <span className="text-sm text-[#1A2F4B]/70">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vivant Care */}
              <Card className="border-2 border-vivant-green/30 hover:shadow-2xl transition-all">
                <CardHeader className="bg-gradient-to-br from-vivant-green to-emerald-600 text-white pb-8">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Heart className="w-9 h-9 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-serif">Vivant Care</CardTitle>
                  <CardDescription className="text-white/80 text-base">
                    Gestão Operacional Hoteleira
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-[#1A2F4B]/75 font-semibold mb-4">
                      Gestão profissional completa das propriedades (modelo hoteleiro)
                    </p>
                    <div className="space-y-3">
                      {[
                        "Manutenção preventiva e corretiva programada",
                        "Limpeza profissional pós-uso obrigatória",
                        "Jardinagem e paisagismo contínuos",
                        "Gestão de seguros e compliance",
                        "Portal do Cotista com sistema de reservas",
                        "Receita recorrente via taxa de condomínio mensal",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-vivant-green flex-shrink-0 mt-1" />
                          <span className="text-sm text-[#1A2F4B]/70">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vivant Partners */}
              <Card className="border-2 border-vivant-gold/30 hover:shadow-2xl transition-all">
                <CardHeader className="bg-gradient-to-br from-vivant-gold to-yellow-600 text-white pb-8">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <Building2 className="w-9 h-9 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-serif">Vivant Partners</CardTitle>
                  <CardDescription className="text-white/80 text-base">
                    Captação e Monetização de Ativos
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-[#1A2F4B]/75 font-semibold mb-4">
                      Plataforma para proprietários cadastrarem e monetizarem imóveis
                    </p>
                    <div className="space-y-3">
                      {[
                        "Captação de proprietários que querem gerar renda",
                        "Análise de viabilidade e due diligence de imóveis",
                        "Estruturação jurídica para multipropriedade",
                        "Marketing e comercialização das cotas",
                        "Gestão de relacionamento com proprietários parceiros",
                        "Expansão contínua do portfólio de destinos",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-vivant-gold flex-shrink-0 mt-1" />
                          <span className="text-sm text-[#1A2F4B]/70">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vivant Capital */}
              <Card className="border-2 border-blue-300 hover:shadow-2xl transition-all">
                <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-700 text-white pb-8">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4">
                    <TrendingUp className="w-9 h-9 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-serif">Vivant Capital</CardTitle>
                  <CardDescription className="text-white/80 text-base">
                    Estruturação de Investimentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-[#1A2F4B]/75 font-semibold mb-4">
                      Boutique de funding e originação de ativos imobiliários fracionados
                    </p>
                    <div className="space-y-3">
                      {[
                        "Estruturação CRI-ready (Certificados de Recebíveis)",
                        "Patrimônio de Afetação e Conta Escrow auditada",
                        "Rentabilidade de IPCA + 12% a.a. para investidores",
                        "Margens operacionais de 35-45%",
                        "Governança padrão FII (Fundos Imobiliários)",
                        "Securitização e liquidez no mercado secundário",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-1" />
                          <span className="text-sm text-[#1A2F4B]/70">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Modelo Financeiro e Fluxos */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1A2F4B] mb-6">
                Modelo Financeiro e Fluxos de Receita
              </h2>
            </div>

            {/* Estrutura de Receitas */}
            <Card className="border-2 border-[#1A2F4B]/20 shadow-xl mb-12">
              <CardHeader className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] text-white">
                <CardTitle className="text-2xl font-serif flex items-center gap-3">
                  <DollarSign className="w-8 h-8" />
                  Estrutura de Receitas
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Home className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-lg text-[#1A2F4B]">Receita Primária</h4>
                    <p className="text-sm text-[#1A2F4B]/70 mb-3">
                      <strong>Venda de Frações</strong> (one-time)
                    </p>
                    <ul className="space-y-2 text-sm text-[#1A2F4B]/70">
                      <li>• Ticket médio: R$ 400.000 a R$ 600.000 por cota</li>
                      <li>• 6 cotas por propriedade</li>
                      <li>• Margem bruta: 35-45%</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-bold text-lg text-[#1A2F4B]">Receita Recorrente</h4>
                    <p className="text-sm text-[#1A2F4B]/70 mb-3">
                      <strong>Taxa de Condomínio</strong> (mensal)
                    </p>
                    <ul className="space-y-2 text-sm text-[#1A2F4B]/70">
                      <li>• Valor médio: R$ 800 a R$ 1.200/mês por cotista</li>
                      <li>• Cobre gestão operacional da Vivant Care</li>
                      <li>• Previsibilidade de caixa</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-amber-600" />
                    </div>
                    <h4 className="font-bold text-lg text-[#1A2F4B]">Serviços Adicionais</h4>
                    <p className="text-sm text-[#1A2F4B]/70 mb-3">
                      <strong>Cobranças Extras</strong> (por uso)
                    </p>
                    <ul className="space-y-2 text-sm text-[#1A2F4B]/70">
                      <li>• Limpeza pós-uso obrigatória</li>
                      <li>• Manutenções corretivas rateadas</li>
                      <li>• Seguros anuais proporcionais</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fluxo de Caixa Vivant Capital */}
            <Card className="border-2 border-vivant-gold/30 shadow-xl">
              <CardHeader className="bg-gradient-to-br from-vivant-gold/20 to-white">
                <CardTitle className="text-2xl font-serif text-[#1A2F4B] flex items-center gap-3">
                  <Wallet className="w-8 h-8 text-vivant-gold" />
                  Fluxo Financeiro Vivant Capital (Investidores)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Diagrama de Fluxo */}
                <div className="space-y-8">
                  {/* Cliente Paga */}
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] rounded-xl p-6 text-white text-center w-80 shadow-lg">
                      <Wallet className="w-12 h-12 mx-auto mb-3" />
                      <h4 className="font-bold text-xl mb-2">Cliente Investe</h4>
                      <p className="text-sm text-white/80">Pagamento da cota adquirida</p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowDownRight className="w-8 h-8 text-[#1A2F4B]/30 rotate-90" />
                  </div>

                  {/* Conta Escrow */}
                  <div className="flex justify-center">
                    <div className="bg-white border-2 border-vivant-gold rounded-xl p-6 text-center w-96 shadow-lg relative">
                      <div className="absolute -top-4 right-4 bg-vivant-green text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        Auditoria Externa
                      </div>
                      <Lock className="w-14 h-14 text-vivant-gold mx-auto mb-3" />
                      <h4 className="font-bold text-xl text-[#1A2F4B] mb-2">Conta Escrow</h4>
                      <p className="text-sm text-[#1A2F4B]/70 mb-1">Conta segregada e auditada</p>
                      <p className="text-xs font-semibold text-vivant-gold">Split Automático 50/50</p>
                    </div>
                  </div>

                  <div className="flex justify-center gap-32">
                    <ArrowDownRight className="w-8 h-8 text-[#1A2F4B]/30 -rotate-45" />
                    <ArrowDownRight className="w-8 h-8 text-[#1A2F4B]/30 rotate-45" />
                  </div>

                  {/* Split 50/50 */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* 50% Garantia */}
                    <div className="bg-gradient-to-br from-vivant-green/10 to-white border-2 border-vivant-green rounded-xl p-6">
                      <Shield className="w-12 h-12 text-vivant-green mx-auto mb-3" />
                      <div className="text-center mb-4">
                        <span className="inline-block bg-vivant-green text-white text-lg font-bold px-4 py-2 rounded-full">
                          50%
                        </span>
                      </div>
                      <h4 className="font-bold text-xl text-[#1A2F4B] text-center mb-3">
                        Bolsão de Garantia
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-vivant-green flex-shrink-0" />
                          <span>Patrimônio de Afetação</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-vivant-green flex-shrink-0" />
                          <span>Alienação Fiduciária</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-vivant-green flex-shrink-0" />
                          <span>Proteção do Investidor</span>
                        </div>
                      </div>
                    </div>

                    {/* 50% Operação */}
                    <div className="bg-gradient-to-br from-[#1A2F4B]/10 to-white border-2 border-[#1A2F4B] rounded-xl p-6">
                      <Settings className="w-12 h-12 text-[#1A2F4B] mx-auto mb-3" />
                      <div className="text-center mb-4">
                        <span className="inline-block bg-[#1A2F4B] text-white text-lg font-bold px-4 py-2 rounded-full">
                          50%
                        </span>
                      </div>
                      <h4 className="font-bold text-xl text-[#1A2F4B] text-center mb-3">
                        Operação Vivant
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#1A2F4B] flex-shrink-0" />
                          <span>Custos de Aquisição</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#1A2F4B] flex-shrink-0" />
                          <span>Gestão e Compliance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#1A2F4B] flex-shrink-0" />
                          <span>Margem Operacional (35-45%)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Sistema de Cotas e Calendário */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1A2F4B] mb-6">
                Sistema de Cotas e Calendário Rotativo
              </h2>
              <p className="text-xl text-[#1A2F4B]/70">
                Distribuição inteligente e equitativa das 52 semanas do ano
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-2 border-[#1A2F4B]/20">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-[#1A2F4B]/10 rounded-full px-4 py-2 mb-4">
                  <Calendar className="w-5 h-5 text-[#1A2F4B]" />
                  <span className="font-semibold text-[#1A2F4B]">
                    1 Casa = 6 Cotas = 52 Semanas
                  </span>
                </div>
                <p className="text-[#1A2F4B]/70">
                  Distribuição: 4 cotas padrão (8 semanas) + 2 cotas premium (10 semanas)
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
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

              <div className="bg-[#F8F9FA] rounded-lg p-6 mb-8">
                <h4 className="font-bold text-lg text-[#1A2F4B] mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-vivant-gold" />
                  Sistema de Rotação Automática
                </h4>
                <p className="text-[#1A2F4B]/70 mb-4">
                  Para garantir equidade, as semanas atribuídas a cada cotista <strong>rotacionam automaticamente</strong> a cada ano:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-[#1A2F4B]/10">
                    <p className="font-semibold text-[#1A2F4B] mb-2">Ano Base (2025)</p>
                    <p className="text-sm text-[#1A2F4B]/70">Cota A: semanas 4, 12, 20, 28, 36, 44, 52</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-[#1A2F4B]/10">
                    <p className="font-semibold text-[#1A2F4B] mb-2">Ano 2 (2026)</p>
                    <p className="text-sm text-[#1A2F4B]/70">Cota A: semanas 5, 13, 21, 29, 37, 45, 1</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-[#1A2F4B]/10">
                    <p className="font-semibold text-[#1A2F4B] mb-2">Ano 3 (2027)</p>
                    <p className="text-sm text-[#1A2F4B]/70">Cota A: semanas 6, 14, 22, 30, 38, 46, 2</p>
                  </div>
                </div>
              </div>

              <div className="bg-vivant-gold/10 border border-vivant-gold/30 rounded-lg p-4 text-center">
                <p className="text-sm text-[#1A2F4B]">
                  💡 <strong>Total perfeito:</strong> (4 × 8) + (2 × 10) = 52 semanas/ano cobertas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparativo Financeiro Real */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1A2F4B] mb-6">
                Comparativo Financeiro: Vivant vs Casa Tradicional
              </h2>
              <p className="text-xl text-[#1A2F4B]/70">
                Análise completa do custo-benefício considerando custo de oportunidade
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              {/* Casa Tradicional */}
              <Card className="border-2 border-red-200 shadow-lg">
                <CardHeader className="bg-red-50 border-b border-red-200">
                  <CardTitle className="text-xl font-serif text-red-900">Casa Veraneio Tradicional</CardTitle>
                  <CardDescription className="text-red-700">Investimento integral em um único imóvel</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Investimento */}
                  <div className="bg-red-100 rounded-xl p-4 mb-6">
                    <p className="text-xs text-red-700 font-semibold mb-1">💰 Investimento Inicial</p>
                    <p className="text-3xl font-bold text-red-900">R$ 2,4M</p>
                    <p className="text-xs text-red-700/70 mt-1">Capital imobilizado (poderia render R$ 288k/ano)</p>
                  </div>

                  {/* Custos */}
                  <p className="text-xs font-semibold text-[#1A2F4B]/50 uppercase mb-3">Custos Anuais</p>
                  <div className="mb-6 space-y-2">
                    {[
                      { label: "IPTU", value: "R$ 16.000" },
                      { label: "Manutenção", value: "R$ 32.000" },
                      { label: "Condomínio/Caseiro", value: "R$ 24.000" },
                      { label: "Custo de oportunidade (12% a.a.)", value: "R$ 288.000" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm border-b border-red-100 pb-2">
                        <span className="text-red-900/65">{item.label}</span>
                        <span className="font-semibold text-red-900">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Uso */}
                  <div className="flex items-center gap-2 text-sm text-red-700 mb-6">
                    <span>📅</span>
                    <span><strong>Uso médio:</strong> 30 dias/ano (ociosidade de 335 dias)</span>
                  </div>

                  {/* Total */}
                  <div className="bg-red-900 rounded-xl p-4 text-center text-white">
                    <p className="text-xs text-red-200 mb-1">Custo Total no 1º Ano</p>
                    <p className="text-3xl font-bold">R$ 2.760.000</p>
                    <p className="text-xs text-red-200 mt-1">Investimento + operacional + oportunidade perdida</p>
                  </div>
                </CardContent>
              </Card>

              {/* Vivant */}
              <Card className="border-2 border-emerald-300 shadow-lg">
                <CardHeader className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
                  <div className="inline-block bg-vivant-gold text-[#1A2F4B] text-xs font-bold px-3 py-1 rounded-full mb-2">
                    MELHOR ESCOLHA
                  </div>
                  <CardTitle className="text-xl font-serif text-white">Vivant Multipropriedade</CardTitle>
                  <CardDescription className="text-white/80">Investimento inteligente em fração ideal (1 cota)</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Investimento */}
                  <div className="bg-[#1A2F4B]/10 rounded-xl p-4 mb-6">
                    <p className="text-xs text-[#1A2F4B] font-semibold mb-1">💎 Investimento Inicial</p>
                    <p className="text-3xl font-bold text-[#1A2F4B]">R$ 500.000</p>
                    <p className="text-xs text-emerald-700 font-semibold mt-1">✓ Sobram R$ 1.900.000 livres para investir!</p>
                  </div>

                  {/* Custos */}
                  <p className="text-xs font-semibold text-[#1A2F4B]/50 uppercase mb-3">Custos Anuais</p>
                  <div className="mb-6 space-y-2">
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

                  {/* Uso */}
                  <div className="flex flex-col gap-1 text-sm text-[#1A2F4B]/65 mb-6">
                    <div className="flex items-center gap-2">
                      <span>🎯</span>
                      <span><strong>Uso garantido:</strong> 8-10 semanas/ano (56-70 dias)</span>
                    </div>
                    <p className="text-xs text-emerald-600 font-semibold pl-6">
                      2x mais uso que a casa tradicional!
                    </p>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] rounded-xl p-4 text-center text-white">
                    <p className="text-xs text-white/65 mb-1">Custo Total no 1º Ano</p>
                    <p className="text-3xl font-bold">R$ 284.200</p>
                    <p className="text-xs text-white/65 mt-1">Investimento + custos - rendimento do saldo</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Vantagem */}
            <div className="bg-gradient-to-r from-[#1A2F4B] to-[#2A4F6B] rounded-2xl p-8 text-white">
              <p className="text-center text-white/70 text-xs font-semibold uppercase tracking-widest mb-4">
                Vantagem Financeira Total Vivant
              </p>
              <p className="text-center text-5xl font-bold mb-2">R$ 2.475.800</p>
              <p className="text-center text-white/60 text-sm mb-8">de economia no primeiro ano</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { value: "90%", label: "de economia total" },
                  { value: "2x", label: "mais dias de uso" },
                  { value: "R$ 1,9M", label: "livres para investir" },
                  { value: "Zero", label: "dor de cabeça" },
                ].map((stat, idx) => (
                  <div key={idx} className="text-center bg-white/10 rounded-xl p-4">
                    <p className="text-2xl font-bold text-vivant-gold">{stat.value}</p>
                    <p className="text-xs text-white/65 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Oportunidades de Parceria */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1A2F4B] mb-6">
                Oportunidades de Parceria
              </h2>
              <p className="text-xl text-[#1A2F4B]/70">
                Como imobiliárias e fundos podem se integrar ao ecossistema Vivant
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Para Imobiliárias */}
              <Card className="border-2 border-vivant-gold/50 shadow-xl hover:shadow-2xl transition-all">
                <CardHeader className="bg-gradient-to-br from-vivant-gold/20 to-white border-b border-vivant-gold/30">
                  <div className="w-16 h-16 rounded-full bg-vivant-gold text-white flex items-center justify-center mb-4">
                    <Building2 className="w-9 h-9" />
                  </div>
                  <CardTitle className="text-2xl font-serif text-[#1A2F4B]">Para Imobiliárias</CardTitle>
                  <CardDescription className="text-lg">
                    Expanda seu portfólio com multipropriedade
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-lg text-[#1A2F4B] mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-vivant-gold" />
                        Modelo de Parceria
                      </h4>
                      <ul className="space-y-3 text-sm text-[#1A2F4B]/70">
                        <li>• <strong>Originação de Imóveis:</strong> Identificação de propriedades de alto padrão para fracionamento</li>
                        <li>• <strong>Comissionamento Diferenciado:</strong> 5-7% sobre VGV de cada cota vendida</li>
                        <li>• <strong>Suporte Completo:</strong> Vivant cuida de toda estruturação jurídica e operacional</li>
                        <li>• <strong>Marketing Compartilhado:</strong> Co-branding em materiais e divulgações</li>
                        <li>• <strong>Expansão de Mercado:</strong> Acesso ao segmento de segunda residência</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#1A2F4B] mb-3 flex items-center gap-2">
                        <Handshake className="w-5 h-5 text-vivant-gold" />
                        Benefícios para Imobiliária
                      </h4>
                      <ul className="space-y-2 text-sm text-[#1A2F4B]/70">
                        <li>✓ Receita recorrente em múltiplas vendas (6 cotas por imóvel)</li>
                        <li>✓ Tickets menores facilitam conversão de leads</li>
                        <li>✓ Posicionamento premium no mercado</li>
                        <li>✓ Portfólio diferenciado da concorrência</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Para Fundos */}
              <Card className="border-2 border-blue-300 shadow-xl hover:shadow-2xl transition-all">
                <CardHeader className="bg-gradient-to-br from-blue-100 to-white border-b border-blue-200">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mb-4">
                    <TrendingUp className="w-9 h-9" />
                  </div>
                  <CardTitle className="text-2xl font-serif text-[#1A2F4B]">Para Fundos de Investimento</CardTitle>
                  <CardDescription className="text-lg">
                    Estruturação de ativos imobiliários fracionados
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-lg text-[#1A2F4B] mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-blue-600" />
                        Modelo de Investimento
                      </h4>
                      <ul className="space-y-3 text-sm text-[#1A2F4B]/70">
                        <li>• <strong>Equity em VGV:</strong> Participação no Valor Geral de Vendas</li>
                        <li>• <strong>Estrutura CRI-ready:</strong> Preparada para securitização</li>
                        <li>• <strong>Rentabilidade:</strong> IPCA + 12% a.a. (~16-18% nominal)</li>
                        <li>• <strong>Proteção:</strong> Patrimônio de Afetação + Alienação Fiduciária</li>
                        <li>• <strong>Liquidez:</strong> Saída via CRI no mercado secundário</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-lg text-[#1A2F4B] mb-3 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Diferenciais do Ativo
                      </h4>
                      <ul className="space-y-2 text-sm text-[#1A2F4B]/70">
                        <li>✓ Margens operacionais de 35-45%</li>
                        <li>✓ Governança padrão FII (auditoria + compliance)</li>
                        <li>✓ Conta Escrow com split automático 50/50</li>
                        <li>✓ Previsibilidade de fluxo de caixa</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Parceria */}
            <div className="bg-gradient-to-r from-vivant-gold/20 to-amber-100 border-2 border-vivant-gold/40 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-[#1A2F4B] mb-4">
                Interessado em uma Parceria Estratégica?
              </h3>
              <p className="text-lg text-[#1A2F4B]/70 mb-6 max-w-2xl mx-auto">
                Entre em contato conosco para agendar uma apresentação completa e discutir as melhores oportunidades de colaboração
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <p className="text-sm text-[#1A2F4B]/60 mb-1">E-mail</p>
                  <p className="font-semibold text-[#1A2F4B]">contato@vivantresidences.com.br</p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md">
                  <p className="text-sm text-[#1A2F4B]/60 mb-1">Telefone</p>
                  <p className="font-semibold text-[#1A2F4B]">(44) 99969-1196</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dados e Métricas */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-serif font-bold text-[#1A2F4B] mb-6">
                Métricas e Validação de Mercado
              </h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { value: "80-90%", label: "Taxa de ociosidade média de casas de veraneio", icon: TrendingDown },
                { value: "30-45", label: "Dias de uso médio anual em casas tradicionais", icon: Calendar },
                { value: "28-42%", label: "Valorização imobiliária média na região (últimos anos)", icon: TrendingUp },
                { value: "R$ 2,4M+", label: "Economia total no 1º ano vs casa tradicional", icon: DollarSign },
              ].map((stat, idx) => (
                <Card key={idx} className="border-none shadow-lg text-center">
                  <CardContent className="p-6">
                    <stat.icon className="w-10 h-10 text-[#1A2F4B] mx-auto mb-3" />
                    <p className="text-3xl font-bold text-[#1A2F4B] mb-2">{stat.value}</p>
                    <p className="text-sm text-[#1A2F4B]/70">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-2 border-[#1A2F4B]/20 shadow-xl">
              <CardHeader className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] text-white">
                <CardTitle className="text-2xl font-serif">Missão, Visão e Valores</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8">
                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#1A2F4B]/10 flex items-center justify-center mb-4">
                      <Target className="w-6 h-6 text-[#1A2F4B]" />
                    </div>
                    <h4 className="font-bold text-lg text-[#1A2F4B] mb-3">Missão</h4>
                    <p className="text-sm text-[#1A2F4B]/70 leading-relaxed">
                      Tornar o investimento em lazer mais inteligente e acessível, oferecendo múltiplos destinos 
                      com gestão completa, segurança jurídica e valorização patrimonial garantida.
                    </p>
                  </div>

                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#1A2F4B]/10 flex items-center justify-center mb-4">
                      <TrendingUp className="w-6 h-6 text-[#1A2F4B]" />
                    </div>
                    <h4 className="font-bold text-lg text-[#1A2F4B] mb-3">Visão</h4>
                    <p className="text-sm text-[#1A2F4B]/70 leading-relaxed">
                      Ser a principal referência em multipropriedade do Brasil, reconhecida por oferecer a melhor 
                      relação custo-benefício e experiência zero estresse para os cotistas.
                    </p>
                  </div>

                  <div>
                    <div className="w-12 h-12 rounded-full bg-[#1A2F4B]/10 flex items-center justify-center mb-4">
                      <Heart className="w-6 h-6 text-[#1A2F4B]" />
                    </div>
                    <h4 className="font-bold text-lg text-[#1A2F4B] mb-3">Valores</h4>
                    <p className="text-sm text-[#1A2F4B]/70 leading-relaxed">
                      <strong>Praticidade</strong>, <strong>economia inteligente</strong>, <strong>liberdade 
                      de escolha</strong>, <strong>excelência</strong> operacional e <strong>tranquilidade</strong> total.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Simples da Apresentação */}
      <footer className="bg-[#1A2F4B] text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <img 
            src="/logo-vivant.png" 
            alt="Vivant" 
            className="h-12 w-auto object-contain brightness-0 invert opacity-90 mx-auto mb-6"
          />
          <p className="text-white/80 mb-2">Vivant Residences - Multipropriedade Inteligente</p>
          <p className="text-white/60 text-sm mb-6">Maringá, PR - Brasil</p>
          <div className="space-y-2 text-white/70 text-sm">
            <p>contato@vivantresidences.com.br</p>
            <p>(44) 99969-1196</p>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-xs text-white/50">
            <p>&copy; 2026 Vivant Residences. Todos os direitos reservados.</p>
            <p className="mt-2">Apresentação Institucional - Uso Interno</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
