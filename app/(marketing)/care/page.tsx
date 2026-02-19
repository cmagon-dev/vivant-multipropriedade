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
  Heart,
  Calendar,
  Shield,
  Sparkles,
  CheckCircle2,
  User,
  Clock,
  Home as HomeIcon,
  Settings,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vivant Care - Gestão Hoteleira de Excelência",
  description: "Hospitalidade premium, manutenção preventiva e experiência inesquecível para cotistas Vivant. Gestão hoteleira de alto padrão para multipropriedades.",
  openGraph: {
    title: "Vivant Care - Gestão Hoteleira Premium",
    description: "Serviços de gestão hoteleira de excelência para multipropriedades Vivant.",
    type: "website",
  },
};

export default function CarePage(): JSX.Element {
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
              "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-vivant-green/80 via-teal-600/70 to-[#F8F9FA]" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-vivant-green/20 backdrop-blur-sm border border-vivant-green/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="text-white text-base sm:text-xl font-semibold">
                Vivant Care
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Gestão Hoteleira de Excelência para Multipropriedades
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto font-light px-2">
              Hospitalidade premium, manutenção preventiva e experiência inesquecível para cotistas Vivant
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-vivant-green hover:bg-white/90 text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
              >
                <a href="#servicos">
                  Conheça nossos Serviços
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-vivant-green text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
              >
                <Link href="/portal-cotista">Área do Cotista</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre Vivant Care */}
      <section id="sobre" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
                Sobre a Vivant Care
              </h2>
              <p className="text-lg sm:text-xl text-[#1A2F4B]/70 max-w-3xl mx-auto px-4">
                Gestão profissional que transforma sua casa em um lar acolhedor
              </p>
            </div>

            <div className="prose prose-lg max-w-none text-[#1A2F4B]/80 mb-8 sm:mb-12">
              <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                A <strong>Vivant Care</strong> é o braço de <strong>gestão hoteleira e hospitalidade</strong> do 
                ecossistema Vivant. Enquanto você desfruta da sua cota de multipropriedade, nós cuidamos de 
                <strong> tudo que você precisa</strong> para ter uma experiência impecável.
              </p>

              <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                Nossa equipe é treinada em <strong>hospitalidade de alto padrão</strong>, garantindo que cada 
                estadia seja memorável. Gerenciamos <strong>ocupação, reservas, limpeza, manutenção preventiva 
                e concierge premium</strong>, para que você e sua família cheguem e encontrem tudo pronto.
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                Com tecnologia proprietária e governança transparente, você acompanha tudo em tempo real: 
                <strong> agendamentos, manutenções, relatórios de ocupação</strong> e muito mais.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Serviços Oferecidos */}
      <section id="servicos" className="py-12 sm:py-16 lg:py-20 bg-[#F8F9FA] scroll-mt-28">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-3 sm:mb-4 px-2">
              Nossos Serviços
            </h2>
            <p className="text-lg sm:text-xl text-[#1A2F4B]/70 px-4">
              Gestão completa para sua tranquilidade
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-vivant-green/10 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-vivant-green" />
                </div>
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Gestão de Reservas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Sistema digital com calendário compartilhado. Agende suas estadias com facilidade e transparência.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-vivant-green/10 rounded-lg flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-vivant-green" />
                </div>
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Manutenção Preventiva
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Inspeções mensais, relatórios detalhados e manutenção proativa para preservar o imóvel.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-vivant-green/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-vivant-green" />
                </div>
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Limpeza Premium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Check-out e check-in profissional. Casa impecável e pronta para receber você.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-vivant-green/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-vivant-green" />
                </div>
                <CardTitle className="text-xl font-serif text-[#1A2F4B]">
                  Relatórios aos Cotistas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#1A2F4B]/70">
                  Dashboard com métricas de ocupação, manutenções realizadas e histórico completo.
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
              Nossos Diferenciais
            </h2>
            <p className="text-lg sm:text-xl text-[#1A2F4B]/70 px-4">
              O que torna a Vivant Care única
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-vivant-green/20 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-vivant-green rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-center text-2xl font-serif text-[#1A2F4B]">
                  Tecnologia Própria
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-[#1A2F4B]/70">
                  Plataforma proprietária de gestão com app mobile. Tudo na palma da sua mão.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-vivant-green/20 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-vivant-green rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-center text-2xl font-serif text-[#1A2F4B]">
                  Equipe Local
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-[#1A2F4B]/70">
                  Profissionais contratados e treinados pela Vivant. Padrão de hospitalidade de luxo.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-vivant-green/20 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-vivant-green rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-center text-2xl font-serif text-[#1A2F4B]">
                  SLA Garantido
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-[#1A2F4B]/70">
                  Tempo de resposta e qualidade garantidos por contrato. Excelência mensurável.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 sm:mb-6 px-2">
            Conheça nossas propriedades disponíveis
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto px-4">
            Explore nossos destinos exclusivos e encontre a casa de férias ideal para você
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#1A2F4B] hover:bg-white/90 text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
            >
              <Link href="/casas">Ver Casas Disponíveis</Link>
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
