'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Navbar } from "@/components/marketing/navbar";
import {
  Home,
  Users,
  Calendar,
  Key,
  Heart,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function HomePage(): JSX.Element {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-40">
        {/* Background Image with Overlay - Casa Luxuosa ao Pôr do Sol */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/70 via-[#1A2F4B]/50 to-[#F8F9FA]" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10 text-center pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white text-xl font-light italic">
                "A arte de viver bem"
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              Sua casa de férias dos sonhos, sem complicações
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto font-light">
              Desfrute de Porto Rico, Paraná: lanchas, praias paradisíacas e lazer
              completo. Sua casa de férias com toda infraestrutura náutica.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-[#1A2F4B] hover:bg-white/90 text-lg h-14 px-8 font-semibold"
              >
                <Link href="#como-funciona">
                  Como Funciona
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1A2F4B] text-lg h-14 px-8 font-semibold"
              >
                <Link href="#casas">Ver Casas Disponíveis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Locais de Atuação - Carrossel */}
      <section id="porto-rico" className="py-20 bg-gradient-to-b from-[#F8F9FA] to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
              Nossos Destinos
            </h2>
            <p className="text-xl text-[#1A2F4B]/70">
              Casas de alto padrão em localizações estratégicas no Paraná
            </p>
          </div>

          <div className="relative">
            <div id="carousel-locais" className="flex gap-0 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth -mx-4 scrollbar-hide">
            {/* Porto Rico */}
            <div className="min-w-full snap-center px-4">
              <Card className="border-2 border-[#1A2F4B]/20 shadow-xl h-full w-full">
                <CardHeader className="bg-gradient-to-r from-[#1A2F4B] to-[#2A4F6B] text-white py-6">
                  <CardTitle className="text-3xl font-serif">
                    Porto Rico, Paraná
                  </CardTitle>
                  <CardDescription className="text-white/90 text-base">
                    Seu refúgio de lazer às margens do Rio Paraná
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#1A2F4B] mb-3">
                        Paraíso Náutico no Noroeste do Paraná
                      </h3>
                      <p className="text-sm text-[#1A2F4B]/80 mb-2 leading-relaxed">
                        <strong>Localização Estratégica:</strong> Porto Rico está localizada no extremo noroeste do Paraná, 
                        a 580 km de Curitiba e 120 km de Maringá. Às margens do majestoso Rio Paraná, a cidade é conhecida 
                        como o "Caribe Paranaense" por suas praias de água doce com areia branca e fina.
                      </p>
                      <p className="text-sm text-[#1A2F4B]/80 mb-2 leading-relaxed">
                        <strong>Clima e Temporada:</strong> Com temperatura média de 28°C no verão, a região oferece clima 
                        perfeito para atividades aquáticas durante o ano todo. A alta temporada (dezembro a março) concentra 
                        festivais náuticos, campeonatos de jet-ski e eventos familiares.
                      </p>
                      <p className="text-sm text-[#1A2F4B]/80 leading-relaxed">
                        <strong>Estilo de Vida:</strong> Porto Rico é sinônimo de vida tranquila junto à natureza. Durante o 
                        dia, os proprietários aproveitam esportes aquáticos, pesca esportiva e passeios de lancha. À noite, 
                        o charme local se revela em restaurantes à beira-rio e no famoso pôr do sol sobre o Paraná.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="text-center p-3 bg-[#F8F9FA] rounded-lg">
                        <div className="text-3xl mb-1">🚤</div>
                        <h4 className="font-semibold text-[#1A2F4B] text-xs mb-1">
                          Esportes Náuticos
                        </h4>
                        <p className="text-[10px] text-[#1A2F4B]/70">
                          Lanchas e jet-ski
                        </p>
                      </div>

                      <div className="text-center p-3 bg-[#F8F9FA] rounded-lg">
                        <div className="text-3xl mb-1">🏖️</div>
                        <h4 className="font-semibold text-[#1A2F4B] text-xs mb-1">
                          Praias de Água Doce
                        </h4>
                        <p className="text-[10px] text-[#1A2F4B]/70">
                          Areia branca
                        </p>
                      </div>

                      <div className="text-center p-3 bg-[#F8F9FA] rounded-lg">
                        <div className="text-3xl mb-1">🎣</div>
                        <h4 className="font-semibold text-[#1A2F4B] text-xs mb-1">
                          Pesca Esportiva
                        </h4>
                        <p className="text-[10px] text-[#1A2F4B]/70">
                          Dourado e pintado
                        </p>
                      </div>

                      <div className="text-center p-3 bg-[#F8F9FA] rounded-lg">
                        <div className="text-3xl mb-1">🌅</div>
                        <h4 className="font-semibold text-[#1A2F4B] text-xs mb-1">
                          Pôr do Sol Único
                        </h4>
                        <p className="text-[10px] text-[#1A2F4B]/70">
                          Vista panorâmica
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#1A2F4B]/5 rounded-xl p-5 border-l-4 border-[#1A2F4B]">
                      <h4 className="font-bold text-[#1A2F4B] mb-3 text-base">
                        🏡 Infraestrutura das Casas Vivant
                      </h4>
                      <ul className="grid md:grid-cols-2 gap-2 text-xs text-[#1A2F4B]/80">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Marina privativa com 12 vagas náuticas</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Área gourmet 60m² com vista rio</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Piscina infinita aquecida e deck 80m²</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>4 suítes, 280m² de área construída</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Segurança 24h e portaria inteligente</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Sistema de energia solar e gerador</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Equipamentos náuticos: jet-ski e caiaque</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Mobiliada e decorada (pronta para uso)</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <p className="text-xs text-[#1A2F4B]/80">
                        <strong className="text-[#1A2F4B]">💡 Valorização:</strong> Porto Rico teve valorização imobiliária 
                        de 42% nos últimos 3 anos. A demanda por imóveis de lazer cresce 18% ao ano, impulsionada pelo turismo 
                        náutico e pela proximidade com Maringá e Campo Mourão.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Região Chavantes - Norte Paranaense */}
            <div className="min-w-full snap-center px-4">
              <Card className="border-2 border-[#1A2F4B]/20 shadow-xl h-full w-full">
                <CardHeader className="bg-gradient-to-r from-[#2A4F6B] to-[#3A5F8B] text-white py-6">
                  <CardTitle className="text-3xl font-serif">
                    Região Chavantes - Norte Paranaense
                  </CardTitle>
                  <CardDescription className="text-white/90 text-base">
                    Condomínios exclusivos em 1º de Maio, Alvorada do Sul e Porecatu
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#1A2F4B] mb-3">
                        Lazer Inteligente Próximo aos Grandes Centros
                      </h3>
                      <p className="text-sm text-[#1A2F4B]/80 mb-2 leading-relaxed">
                        <strong>Localização Estratégica:</strong> A Região Chavantes engloba condomínios de alto padrão em 
                        três municípios do norte do Paraná: 1º de Maio, Alvorada do Sul e Porecatu. Localizados a 
                        aproximadamente 380 km de Curitiba, 120 km de Londrina e 140 km de Maringá, oferecem acesso facilitado 
                        às margens da Represa de Chavantes, um dos maiores lagos artificiais do Brasil.
                      </p>
                      <p className="text-sm text-[#1A2F4B]/80 mb-2 leading-relaxed">
                        <strong>A Represa de Chavantes:</strong> Com 400 km² de espelho d'água, é destino consolidado para turismo 
                        náutico e pesca esportiva. As águas calmas e a paisagem preservada atraem famílias que buscam lazer em 
                        ambiente tranquilo e seguro. A região tem crescimento acelerado de condomínios fechados com infraestrutura 
                        completa para temporadas de descanso.
                      </p>
                      <p className="text-sm text-[#1A2F4B]/80 leading-relaxed">
                        <strong>Perfil dos Condomínios:</strong> Nossas casas estão em condomínios planejados com foco em segurança, 
                        lazer familiar e contato com a natureza. Ideal para quem busca casa de fim de semana acessível (3-4h de carro 
                        de São Paulo), sem abrir mão de estrutura de qualidade. Predominam proprietários de Londrina, Maringá, 
                        São Paulo interior e empresários que valorizam custo-benefício.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <div className="text-center p-3 bg-[#F8F9FA] rounded-lg">
                        <div className="text-3xl mb-1">🛥️</div>
                        <h4 className="font-semibold text-[#1A2F4B] text-xs mb-1">
                          Lago Chavantes
                        </h4>
                        <p className="text-[10px] text-[#1A2F4B]/70">
                          400 km² de água
                        </p>
                      </div>

                      <div className="text-center p-3 bg-[#F8F9FA] rounded-lg">
                        <div className="text-3xl mb-1">🏊</div>
                        <h4 className="font-semibold text-[#1A2F4B] text-xs mb-1">
                          Lazer Completo
                        </h4>
                        <p className="text-[10px] text-[#1A2F4B]/70">
                          Piscinas e quadras
                        </p>
                      </div>

                      <div className="text-center p-3 bg-[#F8F9FA] rounded-lg">
                        <div className="text-3xl mb-1">🎣</div>
                        <h4 className="font-semibold text-[#1A2F4B] text-xs mb-1">
                          Pesca Abundante
                        </h4>
                        <p className="text-[10px] text-[#1A2F4B]/70">
                          Tucunaré e traíra
                        </p>
                      </div>

                      <div className="text-center p-3 bg-[#F8F9FA] rounded-lg">
                        <div className="text-3xl mb-1">🌳</div>
                        <h4 className="font-semibold text-[#1A2F4B] text-xs mb-1">
                          Ambiente Familiar
                        </h4>
                        <p className="text-[10px] text-[#1A2F4B]/70">
                          Seguro e tranquilo
                        </p>
                      </div>
                    </div>

                    <div className="bg-[#2A4F6B]/5 rounded-xl p-5 border-l-4 border-[#2A4F6B]">
                      <h4 className="font-bold text-[#1A2F4B] mb-3 text-base">
                        🏡 Infraestrutura dos Condomínios Vivant
                      </h4>
                      <ul className="grid md:grid-cols-2 gap-2 text-xs text-[#1A2F4B]/80">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Condomínio fechado com portaria 24h</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Acesso direto à represa com píer privativo</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>3 suítes, 220m² área construída</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Piscina aquecida e área gourmet 50m²</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Churrasqueira, forno de pizza e deck</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Quadra poliesportiva e playground</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Garagem náutica para barco até 22 pés</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600 flex-shrink-0" />
                          <span>Mobiliada com padrão de qualidade Vivant</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
                      <p className="text-xs text-[#1A2F4B]/80">
                        <strong className="text-[#1A2F4B]">📍 Acessibilidade:</strong> Rodovias em excelente estado conectam 
                        a região a Londrina (120 km), Maringá (140 km) e São Paulo capital (450 km via Ourinhos). Proximidade 
                        com dois grandes polos urbanos garante serviços de qualidade (hospitais, supermercados, restaurantes) 
                        a 15-20 minutos dos condomínios. Valorização média de 28% nos últimos 3 anos.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            </div>

            {/* Botões de Navegação */}
            <button
              onClick={() => {
                const carousel = document.getElementById('carousel-locais');
                if (carousel) carousel.scrollBy({ left: -carousel.offsetWidth, behavior: 'smooth' });
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#1A2F4B] hover:bg-[#2A4F6B] flex items-center justify-center text-white transition-all shadow-2xl z-10 border-2 border-white"
              aria-label="Local anterior"
            >
              <ChevronLeft className="w-8 h-8 stroke-[3]" />
            </button>
            
            <button
              onClick={() => {
                const carousel = document.getElementById('carousel-locais');
                if (carousel) carousel.scrollBy({ left: carousel.offsetWidth, behavior: 'smooth' });
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-[#1A2F4B] hover:bg-[#2A4F6B] flex items-center justify-center text-white transition-all shadow-2xl z-10 border-2 border-white"
              aria-label="Próximo local"
            >
              <ChevronRight className="w-8 h-8 stroke-[3]" />
            </button>
          </div>
        </div>
      </section>

      {/* O que é Multipropriedade */}
      <section id="multipropriedade" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
                O que é Multipropriedade?
              </h2>
              <p className="text-xl text-[#1A2F4B]/70">
                Uma forma inteligente e acessível de ter sua casa de férias
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-[#1A2F4B]/80 mb-12">
              <p className="text-lg leading-relaxed mb-6">
                A <strong>multipropriedade</strong> é um modelo de propriedade
                compartilhada onde você adquire o direito de usar uma casa de
                alto padrão por períodos específicos do ano. Em vez de comprar
                uma casa inteira que ficaria vazia a maior parte do tempo, você
                investe apenas no tempo que realmente vai usar.
              </p>

              <p className="text-lg leading-relaxed mb-6">
                Na <strong>Vivant</strong>, trabalhamos com o{" "}
                <strong>sistema de cotas</strong>: cada propriedade é dividida
                em <strong>até 6 cotas</strong>, garantindo uso otimizado durante
                todo o ano. Você escolhe a quantidade de cotas que deseja adquirir 
                de acordo com suas necessidades.
              </p>

              <div className="bg-[#F8F9FA] p-6 rounded-lg border-l-4 border-[#1A2F4B] my-8">
                <p className="text-lg font-medium text-[#1A2F4B] mb-2">
                  💡 Como Funciona a Distribuição
                </p>
                <div className="text-base text-[#1A2F4B]/80 space-y-2">
                  <p>
                    <strong>4 cotas padrão:</strong> 8 semanas (56 dias) de uso por ano cada
                  </p>
                  <p>
                    <strong>2 cotas premium:</strong> 10 semanas (70 dias) de uso por ano cada
                  </p>
                  <p className="text-sm pt-2 text-[#1A2F4B]/60">
                    ✨ Total: 52 semanas por ano perfeitamente distribuídas entre os cotistas
                  </p>
                </div>
              </div>
            </div>

            {/* Comparativo: Tradicional vs Vivant */}
            <div className="my-16">
              <h3 className="text-3xl font-serif font-bold text-[#1A2F4B] text-center mb-4">
                Por que a Multipropriedade é a Escolha Inteligente?
              </h3>
              <p className="text-center text-[#1A2F4B]/70 mb-12 max-w-3xl mx-auto">
                Dados do mercado revelam que casas de veraneio tradicionais ficam vazias até 90% do tempo. 
                Veja como a Vivant resolve esse problema:
              </p>

              <div className="grid lg:grid-cols-2 gap-8 mb-12">
                {/* Casa Tradicional - Problemas */}
                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-red-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Home className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h4 className="text-xl font-serif font-bold text-[#1A2F4B]">
                        Casa de Veraneio Tradicional
                      </h4>
                      <p className="text-sm text-[#1A2F4B]/60">Único proprietário</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">⏰</div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1A2F4B] mb-1">Baixo Uso Real</p>
                          <p className="text-sm text-[#1A2F4B]/70">
                            Média de apenas <strong>30-45 dias/ano</strong> de uso efetivo, 
                            mesmo com todo o investimento feito
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🏚️</div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1A2F4B] mb-1">Ociosidade Crítica</p>
                          <p className="text-sm text-[#1A2F4B]/70">
                            A casa fica <strong>vazia 80-90% do tempo</strong>, 
                            deteriorando e gerando custos sem retorno
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">💸</div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1A2F4B] mb-1">Custos Fixos Altos</p>
                          <p className="text-sm text-[#1A2F4B]/70">
                            IPTU, condomínio, manutenção e caseiro continuam 
                            mesmo quando ninguém está usando
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🔒</div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1A2F4B] mb-1">Capital Imobilizado</p>
                          <p className="text-sm text-[#1A2F4B]/70">
                            Milhões de reais "parados" que poderiam estar 
                            rendendo no mercado financeiro
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🚗</div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1A2F4B] mb-1">Dependência da Distância</p>
                          <p className="text-sm text-[#1A2F4B]/70">
                            Uso frequente só funciona se estiver a 2-3h de distância. 
                            Locais mais distantes viram "peso" financeiro
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vivant - Soluções */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-emerald-200 relative">
                  <div className="absolute -top-3 right-8 bg-emerald-500 text-white text-xs font-bold px-4 py-1 rounded-full">
                    SOLUÇÃO INTELIGENTE
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-serif font-bold text-[#1A2F4B]">
                        Vivant Multipropriedade
                      </h4>
                      <p className="text-sm text-[#1A2F4B]/60">Modelo otimizado</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                        <div className="flex items-start gap-3">
                        <div className="text-2xl">✅</div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1A2F4B] mb-1">Uso Maximizado</p>
                          <p className="text-sm text-[#1A2F4B]/70">
                            <strong>8 a 10 semanas/ano garantidas</strong> com 1 cota 
                            (2x mais que a média tradicional de 4-6 semanas!)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🏡</div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1A2F4B] mb-1">Zero Ociosidade</p>
                          <p className="text-sm text-[#1A2F4B]/70">
                            Casa sempre cuidada e ocupada pelos cotistas, 
                            com manutenção preventiva contínua
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">💰</div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1A2F4B] mb-1">Custos Proporcionais</p>
                          <p className="text-sm text-[#1A2F4B]/70">
                            Você paga apenas <strong>sua fração dos custos</strong> 
                            (IPTU, condomínio, manutenção)
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">📈</div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1A2F4B] mb-1">Capital Liberado</p>
                          <p className="text-sm text-[#1A2F4B]/70">
                            Sobram até <strong>R$ 1,9M livres</strong> para investir 
                            e gerar renda passiva mensal
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                      <div className="flex items-start gap-3">
                        <div className="text-2xl">🌎</div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1A2F4B] mb-1">Múltiplos Destinos</p>
                          <p className="text-sm text-[#1A2F4B]/70">
                            Com o mesmo investimento, você pode ter cotas em 
                            diferentes locais (praia, lago, serra)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados de Mercado */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-200">
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-serif font-bold text-[#1A2F4B] mb-2">
                    📊 Dados do Mercado de Segunda Residência
                  </h4>
                  <p className="text-sm text-[#1A2F4B]/60">
                    Pesquisas consolidadas do setor imobiliário de lazer
                  </p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center bg-white rounded-xl p-4">
                    <p className="text-3xl font-bold text-blue-600 mb-1">30-45</p>
                    <p className="text-xs text-[#1A2F4B]/70">
                      Dias de uso médio anual em casas tradicionais
                    </p>
                  </div>
                  
                  <div className="text-center bg-white rounded-xl p-4">
                    <p className="text-3xl font-bold text-blue-600 mb-1">80-90%</p>
                    <p className="text-xs text-[#1A2F4B]/70">
                      Do tempo a casa fica completamente vazia
                    </p>
                  </div>
                  
                  <div className="text-center bg-white rounded-xl p-4">
                    <p className="text-3xl font-bold text-blue-600 mb-1">150km</p>
                    <p className="text-xs text-[#1A2F4B]/70">
                      Distância ideal para uso frequente (finais de semana)
                    </p>
                  </div>
                  
                  <div className="text-center bg-white rounded-xl p-4">
                    <p className="text-3xl font-bold text-blue-600 mb-1">+250%</p>
                    <p className="text-xs text-[#1A2F4B]/70">
                      Crescimento do home office aumentou permanência
                    </p>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-sm text-[#1A2F4B]/60">
                    💡 <strong>Insight:</strong> A Vivant transforma esses 80-90% de ociosidade em 
                    economia real, garantindo que você pague apenas pelo que usa e ainda tenha mais dias de lazer!
                  </p>
                </div>
              </div>
            </div>

            {/* Comparativo Financeiro Real */}
            <div className="bg-gradient-to-br from-white to-[#F8F9FA] rounded-3xl p-8 md:p-12 my-16 shadow-sm">
              <div className="text-center mb-12">
                <h3 className="text-4xl font-serif font-bold text-[#1A2F4B] mb-4">
                  Comparativo Financeiro Real
                </h3>
                <p className="text-lg text-[#1A2F4B]/60 max-w-2xl mx-auto">
                  Entenda o impacto financeiro real de cada opção e o custo do patrimônio imobilizado
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
                {/* Casa Veraneio Tradicional */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#1A2F4B]/10">
                  <div className="bg-gradient-to-br from-[#1A2F4B]/5 to-[#1A2F4B]/10 px-6 py-6 border-b border-[#1A2F4B]/10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-[#1A2F4B]/10 flex items-center justify-center">
                        <Home className="w-6 h-6 text-[#1A2F4B]" />
                      </div>
                      <h4 className="text-2xl font-serif font-bold text-[#1A2F4B]">
                        Casa Veraneio Tradicional
                      </h4>
                    </div>
                    <p className="text-sm text-[#1A2F4B]/60 ml-15">
                      Investimento integral em um único imóvel
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-1">
                    {/* Investimento Inicial */}
                    <div className="bg-amber-50 rounded-xl p-4 mb-4 border border-amber-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-[#1A2F4B]">
                          💰 Investimento Inicial (Patrimônio Imobilizado)
                        </span>
                        <span className="text-xl font-bold text-amber-700">
                          R$ 2,4M
                        </span>
                      </div>
                      <p className="text-xs text-[#1A2F4B]/60 mt-2">
                        Capital parado que poderia render 12% a.a. = R$ 288.000/ano
                      </p>
                    </div>

                    {/* Custos Anuais */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-[#1A2F4B]/50 uppercase tracking-wide mb-3">
                        Custos Operacionais Anuais
                      </p>
                      
                      <div className="flex justify-between items-center py-2 border-b border-[#1A2F4B]/5">
                        <span className="text-sm text-[#1A2F4B]/70">IPTU</span>
                        <span className="font-semibold text-[#1A2F4B]">R$ 16.000</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-[#1A2F4B]/5">
                        <span className="text-sm text-[#1A2F4B]/70">Manutenção</span>
                        <span className="font-semibold text-[#1A2F4B]">R$ 32.000</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-[#1A2F4B]/5">
                        <span className="text-sm text-[#1A2F4B]/70">Condomínio</span>
                        <span className="font-semibold text-[#1A2F4B]">R$ 24.000</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-[#1A2F4B]/5">
                        <span className="text-sm text-[#1A2F4B]/70">Custo de oportunidade (12% a.a.)</span>
                        <span className="font-semibold text-[#1A2F4B]">R$ 288.000</span>
                      </div>
                    </div>

                    {/* Uso */}
                    <div className="bg-[#1A2F4B]/5 rounded-xl p-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#1A2F4B]/70">📅 Uso médio real</span>
                        <span className="font-bold text-[#1A2F4B]">30 dias/ano</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-[#1A2F4B] to-[#2A4F6B] rounded-xl p-5 mt-6">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/90 font-semibold">
                          Custo Total no 1º Ano
                        </span>
                        <span className="text-2xl font-bold text-white">
                          R$ 2.760.000
                        </span>
                      </div>
                      <p className="text-xs text-white/70">
                        Investimento inicial + custos operacionais + oportunidade perdida
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vivant Multipropriedade */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-emerald-200 relative">
                  {/* Badge Destaque */}
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    MELHOR ESCOLHA
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-6 py-6 border-b border-emerald-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-2xl font-serif font-bold text-[#1A2F4B]">
                        Vivant Multipropriedade
                      </h4>
                    </div>
                    <p className="text-sm text-[#1A2F4B]/60 ml-15">
                      Investimento inteligente em fração ideal
                    </p>
                  </div>
                  
                  <div className="p-6 space-y-1">
                    {/* Investimento Inicial */}
                    <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-[#1A2F4B]">
                          💎 Investimento Inicial (1 cota)
                        </span>
                        <span className="text-xl font-bold text-emerald-700">
                          R$ 500.000
                        </span>
                      </div>
                      <p className="text-xs text-emerald-700 mt-2 font-medium">
                        ✓ Sobram R$ 1.900.000 livres para investir e render!
                      </p>
                    </div>

                    {/* Custos Anuais */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-[#1A2F4B]/50 uppercase tracking-wide mb-3">
                        Custos Operacionais Anuais
                      </p>
                      
                      <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                        <span className="text-sm text-[#1A2F4B]/70">IPTU</span>
                        <span className="font-semibold text-emerald-600">R$ 2.700</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                        <span className="text-sm text-[#1A2F4B]/70">Manutenção</span>
                        <span className="font-semibold text-emerald-600">R$ 5.500</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                        <span className="text-sm text-[#1A2F4B]/70">Condomínio</span>
                        <span className="font-semibold text-emerald-600">R$ 4.000</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-emerald-100">
                        <span className="text-sm text-[#1A2F4B]/70">Rendimento do saldo (12% a.a.)</span>
                        <span className="font-semibold text-emerald-600">+ R$ 228.000</span>
                      </div>
                    </div>

                    {/* Uso */}
                    <div className="bg-emerald-50 rounded-xl p-4 mt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#1A2F4B]/70">🎯 Uso garantido</span>
                        <span className="font-bold text-emerald-700">8-10 semanas/ano</span>
                      </div>
                      <p className="text-xs text-emerald-600 mt-2">
                        2x mais uso que a casa veraneio tradicional!
                      </p>
                    </div>

                    {/* Total */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-5 mt-6">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white/90 font-semibold">
                          Custo Total no 1º Ano
                        </span>
                        <span className="text-2xl font-bold text-white">
                          R$ 284.200
                        </span>
                      </div>
                      <p className="text-xs text-white/80">
                        Investimento + custos - rendimento do saldo livre
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resultado Final */}
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-lg">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-4">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm font-semibold text-[#1A2F4B]">
                        Vantagem Financeira Total
                      </span>
                    </div>
                    <p className="text-6xl font-bold text-emerald-600 mb-2">
                      R$ 2.475.800
                    </p>
                    <p className="text-xl text-[#1A2F4B]/70">
                      de economia no primeiro ano
                    </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 pt-6 border-t border-emerald-200">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-emerald-600 mb-1">90%</p>
                      <p className="text-sm text-[#1A2F4B]/70">de economia total</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-emerald-600 mb-1">2x</p>
                      <p className="text-sm text-[#1A2F4B]/70">mais dias de uso</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-emerald-600 mb-1">R$ 1.9M</p>
                      <p className="text-sm text-[#1A2F4B]/70">livres para investir</p>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-[#1A2F4B]/60">
                      💡 <strong>Importante:</strong> O custo de oportunidade do capital parado é calculado 
                      considerando rendimento conservador de 12% a.a. (CDI médio histórico)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-none shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#1A2F4B]/10 rounded-lg flex items-center justify-center mb-4">
                    <Home className="w-6 h-6 text-[#1A2F4B]" />
                  </div>
                  <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                    Propriedade Real
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#1A2F4B]/70">
                    Você é proprietário registrado em cartório, com escritura
                    pública e todos os direitos legais.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#1A2F4B]/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-[#1A2F4B]" />
                  </div>
                  <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                    Custos Compartilhados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#1A2F4B]/70">
                    Manutenção, IPTU e condomínio são divididos entre os
                    coproprietários proporcionalmente.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 bg-[#1A2F4B]/10 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="w-6 h-6 text-[#1A2F4B]" />
                  </div>
                  <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                    Uso Garantido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#1A2F4B]/70">
                    Suas datas são garantidas e você pode agendar com
                    antecedência através do nosso sistema.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona o Sistema de Cotas */}
      <section id="como-funciona" className="py-20 bg-[#F8F9FA]">
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
            {/* Visual do Sistema de Cotas */}
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
                    <div className="text-3xl font-bold mb-2">
                      Cota {cota}
                    </div>
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
                    <div className="text-3xl font-bold mb-2">
                      Cota {cota}
                    </div>
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

            {/* Passos */}
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <Card className="border-2 border-[#1A2F4B]/20 shadow-lg h-full">
                  <CardHeader>
                    <div className="w-16 h-16 bg-[#1A2F4B] rounded-full flex items-center justify-center mb-4 mx-auto">
                      <span className="text-3xl font-bold text-white">1</span>
                    </div>
                    <CardTitle className="text-center text-2xl font-serif text-[#1A2F4B]">
                      Escolha sua Casa
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-[#1A2F4B]/70">
                      Navegue pelo nosso portfólio de casas de alto padrão em
                      destinos paradisíacos.
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
                      <span className="text-3xl font-bold text-white">2</span>
                    </div>
                    <CardTitle className="text-center text-2xl font-serif text-[#1A2F4B]">
                      Defina suas Cotas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-[#1A2F4B]/70">
                      Escolha entre cotas padrão (8 semanas) ou premium (10 semanas). 
                      Adquira até 6 cotas conforme seu tempo de uso ideal.
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
                      <span className="text-3xl font-bold text-white">3</span>
                    </div>
                    <CardTitle className="text-center text-2xl font-serif text-[#1A2F4B]">
                      Aproveite!
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-[#1A2F4B]/70">
                      Agende suas estadias pelo app e aproveite sua casa de
                      férias quando quiser.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
              Por que escolher a Vivant?
            </h2>
            <p className="text-xl text-[#1A2F4B]/70">
              Mais do que uma casa, uma experiência completa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="w-10 h-10 text-[#1A2F4B] mb-4" />
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Segurança Jurídica Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Escritura pública registrada em cartório. Você é proprietário
                  de verdade, com todos os direitos garantidos por lei.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Key className="w-10 h-10 text-[#1A2F4B] mb-4" />
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Gestão Completa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Cuidamos de tudo: manutenção, limpeza, jardinagem e
                  segurança. Você só precisa chegar e aproveitar.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Calendar className="w-10 h-10 text-[#1A2F4B] mb-4" />
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Agendamento Fácil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Sistema digital intuitivo para reservar suas datas com
                  antecedência e gerenciar suas estadias.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Clock className="w-10 h-10 text-[#1A2F4B] mb-4" />
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Flexibilidade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Adquira até 6 cotas conforme sua necessidade. Cotas padrão (8 semanas) 
                  ou premium (10 semanas) com mais dias de uso.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <MapPin className="w-10 h-10 text-[#1A2F4B] mb-4" />
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Localizações Premium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Casas em destinos paradisíacos: praias, montanhas e cidades
                  históricas. Sempre em localizações privilegiadas.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Heart className="w-10 h-10 text-[#1A2F4B] mb-4" />
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Custo-Benefício
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Pague apenas pelo que usar. Sem desperdício, sem casa vazia,
                  sem preocupações. Economia inteligente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Casas (Preview) */}
      <section id="casas" className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
              Nossas Casas
            </h2>
            <p className="text-xl text-[#1A2F4B]/70">
              Propriedades selecionadas em destinos incríveis
            </p>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-xl p-12">
              <Home className="w-16 h-16 text-[#1A2F4B] mx-auto mb-6" />
              <h3 className="text-2xl font-serif font-bold text-[#1A2F4B] mb-4">
                Em breve: Nosso Portfólio Completo
              </h3>
              <p className="text-lg text-[#1A2F4B]/70 mb-8">
                Estamos finalizando a curadoria de casas exclusivas em praias
                paradisíacas, montanhas e destinos históricos. Entre em contato
                para conhecer as oportunidades disponíveis.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-[#1A2F4B] text-white hover:bg-[#1A2F4B]/90"
              >
                <Link href="#sobre">Fale Conosco</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre a Vivant */}
      <section id="sobre" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
                Sobre a Vivant
              </h2>
              <p className="text-xl text-[#1A2F4B]/70 italic">
                "A arte de viver bem"
              </p>
            </div>

            {/* Missão e Propósito */}
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div>
                <h3 className="text-3xl font-serif font-bold text-[#1A2F4B] mb-6">
                  Por que existimos
                </h3>
                <div className="space-y-4 text-lg text-[#1A2F4B]/80 leading-relaxed">
                  <p>
                    A <strong>Vivant</strong> nasceu de uma observação simples:{" "}
                    <strong>casas de férias ficam vazias 90% do tempo</strong>.
                    Famílias investem milhões em propriedades que são usadas
                    apenas algumas semanas por ano, enquanto arcam com custos
                    integrais de manutenção, IPTU, segurança e depreciação.
                  </p>
                  <p>
                    Criamos a Vivant para <strong>democratizar o acesso</strong>{" "}
                    a casas de alto padrão e tornar o sonho da casa de férias{" "}
                    <strong>economicamente inteligente</strong>. Por que pagar
                    100% quando você usa apenas 10%?
                  </p>
                  <p>
                    Nossa missão é simples:{" "}
                    <strong>
                      transformar o mercado de casas de lazer através da
                      multipropriedade
                    </strong>
                    , oferecendo uma solução justa, transparente e acessível
                    para quem valoriza experiências, não posses.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-3xl font-serif font-bold text-[#1A2F4B] mb-6">
                  Uso Inteligente
                </h3>
                <div className="space-y-4 text-lg text-[#1A2F4B]/80 leading-relaxed">
                  <p>
                    A multipropriedade é o <strong>uso inteligente</strong> de
                    ativos imobiliários. Em vez de uma casa vazia 80-90% do tempo, 
                    <strong>até 6 famílias</strong> podem desfrutar do mesmo
                    imóvel, cada uma aproveitando de 8 a 10 semanas por ano.
                  </p>
                  <p>
                    O resultado? <strong>Todos ganham</strong>:
                  </p>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>
                        Você paga apenas pela sua fração (proporcional às cotas)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>
                        Custos de manutenção divididos por 6 proprietários
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>
                        A casa está sempre bem cuidada (uso constante)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                      <span>
                        Tempo suficiente para aproveitar (8 a 10 semanas/ano por cota)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Facilidade de Compra */}
            <div className="mb-16">
              <h3 className="text-3xl font-serif font-bold text-[#1A2F4B] mb-8 text-center">
                Processo de Aquisição Simples e Transparente
              </h3>

              <div className="grid md:grid-cols-4 gap-6">
                <Card className="border-none shadow-lg text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-[#1A2F4B] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-white">1</span>
                    </div>
                    <h4 className="font-bold text-[#1A2F4B] mb-2 text-lg">
                      Escolha sua Cota
                    </h4>
                    <p className="text-sm text-[#1A2F4B]/70">
                      Defina quantas cotas deseja (1 a 6) e o período de uso
                      preferido
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-[#1A2F4B] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-white">2</span>
                    </div>
                    <h4 className="font-bold text-[#1A2F4B] mb-2 text-lg">
                      Documentação
                    </h4>
                    <p className="text-sm text-[#1A2F4B]/70">
                      Análise rápida de documentos e aprovação em até 48h
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-[#1A2F4B] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-white">3</span>
                    </div>
                    <h4 className="font-bold text-[#1A2F4B] mb-2 text-lg">
                      Escritura Pública
                    </h4>
                    <p className="text-sm text-[#1A2F4B]/70">
                      Registro em cartório com toda segurança jurídica
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-lg text-center">
                  <CardContent className="pt-8">
                    <div className="w-16 h-16 bg-[#1A2F4B] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl font-bold text-white">4</span>
                    </div>
                    <h4 className="font-bold text-[#1A2F4B] mb-2 text-lg">
                      Aproveite!
                    </h4>
                    <p className="text-sm text-[#1A2F4B]/70">
                      Agende suas datas pelo app e comece a desfrutar
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-12 bg-[#1A2F4B]/5 rounded-xl p-6 border-l-4 border-[#1A2F4B]">
                <h4 className="font-bold text-[#1A2F4B] mb-4 text-xl">
                  💰 Opções de Pagamento Flexíveis
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="font-semibold text-[#1A2F4B] mb-2">
                      À Vista
                    </p>
                    <p className="text-sm text-[#1A2F4B]/70">
                      Desconto especial de até 10% no valor total
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A2F4B] mb-2">
                      Parcelado
                    </p>
                    <p className="text-sm text-[#1A2F4B]/70">
                      Até 120x com entrada facilitada e taxas competitivas
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A2F4B] mb-2">
                      Financiamento
                    </p>
                    <p className="text-sm text-[#1A2F4B]/70">
                      Parcerias com principais bancos para facilitar sua compra
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Valores e Diferenciais */}
            <div className="text-center">
              <h3 className="text-3xl font-serif font-bold text-[#1A2F4B] mb-6">
                Nossos Valores
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl mb-3">🤝</div>
                  <h4 className="font-bold text-[#1A2F4B] mb-2">
                    Transparência Total
                  </h4>
                  <p className="text-[#1A2F4B]/70">
                    Todos os custos, documentos e processos são 100%
                    transparentes. Sem letras miúdas.
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-3">🏆</div>
                  <h4 className="font-bold text-[#1A2F4B] mb-2">
                    Qualidade Premium
                  </h4>
                  <p className="text-[#1A2F4B]/70">
                    Selecionamos apenas propriedades de alto padrão em
                    localizações privilegiadas.
                  </p>
                </div>
                <div>
                  <div className="text-4xl mb-3">💚</div>
                  <h4 className="font-bold text-[#1A2F4B] mb-2">
                    Sustentabilidade
                  </h4>
                  <p className="text-[#1A2F4B]/70">
                    Uso compartilhado significa menos recursos desperdiçados e
                    menor impacto ambiental.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Pronto para viver essa experiência?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Descubra como a multipropriedade pode transformar suas férias e
            proporcionar momentos inesquecíveis com quem você ama.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#1A2F4B] hover:bg-white/90 text-lg h-16 px-10 font-semibold"
            >
              <Link href="#sobre">
                Fale com um Especialista
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1A2F4B] text-lg h-16 px-10 font-semibold"
            >
              <a
                href="https://vivantcapital.com.br"
                target="_blank"
                rel="noopener noreferrer"
              >
                Conheça a Vivant Capital
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A2F4B] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="mb-4">
                <img
                  src="/logo-vivant.png"
                  alt="Vivant"
                  className="h-24 w-auto brightness-0 invert"
                />
              </div>
              <p className="text-base text-white/90 italic mb-2 font-light">
                "A arte de viver bem"
              </p>
              <p className="text-white/70 text-sm">
                Multipropriedade de alto padrão com transparência e segurança
                jurídica.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link
                    href="#multipropriedade"
                    className="hover:text-white transition"
                  >
                    O que é Multipropriedade
                  </Link>
                </li>
                <li>
                  <Link
                    href="#como-funciona"
                    className="hover:text-white transition"
                  >
                    Como Funciona
                  </Link>
                </li>
                <li>
                  <Link href="#casas" className="hover:text-white transition">
                    Casas
                  </Link>
                </li>
                <li>
                  <a
                    href="https://vivantcapital.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition"
                  >
                    Vivant Capital (Investimentos)
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <p className="text-white/70">contato@vivant.com.br</p>
              <p className="text-white/70 mt-2">+55 (11) 9999-9999</p>
              <div className="mt-4">
                <p className="text-sm text-white/50">
                  Horário de atendimento:
                </p>
                <p className="text-sm text-white/70">
                  Segunda a Sexta, 9h às 18h
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/50 text-sm">
            <p>© 2026 Vivant Multipropriedade. Todos os direitos reservados.</p>
            <p className="mt-2">
              Multipropriedade regulamentada pela Lei 13.777/2018
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
