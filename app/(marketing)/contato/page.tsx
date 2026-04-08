import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import {
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
  Users,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato - Vivant Residences",
  description:
    "Fale com nossos especialistas em multipropriedade. Atendimento gratuito e personalizado para ajudá-lo a realizar o sonho da sua casa de férias.",
  openGraph: {
    title: "Contato - Vivant Residences",
    description:
      "Nossa equipe está pronta para tirar suas dúvidas sobre multipropriedade e investimentos em lazer.",
    type: "website",
  },
};

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2074&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/75 via-[#1A2F4B]/50 via-[#1A2F4B]/25 to-[#F8F9FA]/60" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <ScrollReveal className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
              <span className="text-white text-base sm:text-xl font-light italic">
                Estamos aqui para você
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Fale com a Vivant
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto font-light px-2">
              Nossa equipe de especialistas está pronta para tirar todas as suas
              dúvidas e ajudá-lo a dar o primeiro passo rumo à sua casa de
              férias.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                asChild
                size="lg"
                className="bg-vivant-green hover:bg-vivant-green/90 text-white text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
              >
                <Link href="/captar">
                  <Phone className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Ligamos para você
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1A2F4B] text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
              >
                <a
                  href="https://wa.me/5544999691196?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Vivant."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Canais de Contato */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
              Como nos encontrar
            </h2>
            <p className="text-base sm:text-lg text-[#1A2F4B]/70">
              Escolha o canal de atendimento mais conveniente para você
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="border-2 border-[#1A2F4B]/10 hover:border-vivant-green hover:shadow-xl transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vivant-green to-emerald-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  WhatsApp
                </h3>
                <p className="text-sm text-[#1A2F4B]/60 mb-4">
                  Resposta rápida e direta com nossos especialistas
                </p>
                <a
                  href="https://wa.me/5544999691196?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20a%20Vivant."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-vivant-green font-semibold text-sm hover:underline"
                >
                  (44) 99969-1196
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#1A2F4B]/10 hover:border-vivant-gold hover:shadow-xl transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vivant-gold to-yellow-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  E-mail
                </h3>
                <p className="text-sm text-[#1A2F4B]/60 mb-4">
                  Envie sua mensagem e respondemos em até 24h
                </p>
                <a
                  href="mailto:contato@vivantresidences.com.br"
                  className="text-vivant-gold font-semibold text-sm hover:underline break-all"
                >
                  contato@vivantresidences.com.br
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#1A2F4B]/10 hover:border-[#1A2F4B] hover:shadow-xl transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Telefone
                </h3>
                <p className="text-sm text-[#1A2F4B]/60 mb-4">
                  Fale diretamente com um especialista Vivant
                </p>
                <a
                  href="tel:+5544999691196"
                  className="text-[#1A2F4B] font-semibold text-sm hover:underline"
                >
                  (44) 99969-1196
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 border-[#1A2F4B]/10 hover:border-[#1A2F4B]/40 hover:shadow-xl transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Localização
                </h3>
                <p className="text-sm text-[#1A2F4B]/60 mb-4">
                  Nossa sede fica no coração do Paraná
                </p>
                <span className="text-[#1A2F4B]/70 font-semibold text-sm">
                  Maringá, PR — Brasil
                </span>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Por que falar conosco */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-[#F8F9FA] to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A2F4B] mb-6">
                  Atendimento personalizado para realizar seu sonho
                </h2>
                <p className="text-base sm:text-lg text-[#1A2F4B]/70 mb-8 leading-relaxed">
                  Nossa equipe de consultores especializados em multipropriedade
                  está pronta para entender seu perfil e indicar a melhor opção
                  de investimento para você e sua família.
                </p>

                <div className="space-y-4">
                  {[
                    "Consultoria gratuita e sem compromisso",
                    "Especialistas em multipropriedade e direito imobiliário",
                    "Atendimento humanizado e sem pressão de venda",
                    "Respostas claras sobre investimento, documentação e uso",
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-vivant-green mt-0.5 flex-shrink-0" />
                      <span className="text-[#1A2F4B]/80 text-sm sm:text-base">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Button asChild size="lg" className="min-h-[48px]">
                    <Link href="/captar">
                      Quero ser contactado
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="border-2 border-[#1A2F4B]/10 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-vivant-green/10 flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-vivant-green" />
                    </div>
                    <div className="text-3xl font-bold text-[#1A2F4B] font-serif mb-1">
                      &lt;24h
                    </div>
                    <p className="text-xs text-[#1A2F4B]/60">
                      Tempo de resposta
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#1A2F4B]/10 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-vivant-gold/10 flex items-center justify-center mx-auto mb-3">
                      <HeartHandshake className="w-6 h-6 text-vivant-gold" />
                    </div>
                    <div className="text-3xl font-bold text-[#1A2F4B] font-serif mb-1">
                      100%
                    </div>
                    <p className="text-xs text-[#1A2F4B]/60">
                      Satisfação garantida
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#1A2F4B]/10 shadow-lg col-span-2">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#1A2F4B]/10 flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-[#1A2F4B]" />
                    </div>
                    <div className="text-3xl font-bold text-[#1A2F4B] font-serif mb-1">
                      Gratuito
                    </div>
                    <p className="text-xs text-[#1A2F4B]/60">
                      Consultoria sem custo e sem compromisso
                    </p>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="bg-white pb-0">
        <div className="container mx-auto px-4 sm:px-6 pt-8 pb-8">
          <ScrollReveal className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A2F4B] mb-2">
              Nossa Localização
            </h2>
            <p className="text-[#1A2F4B]/60 text-base">
              Maringá, PR — no coração do Paraná
            </p>
          </ScrollReveal>
        </div>

        <div className="relative w-full h-[55vh] min-h-[420px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29582.096789434486!2d-51.95827604999999!3d-23.425269599999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ecd0a40bc00f43%3A0x8cb91a5b371bd7b4!2zTWFyaW5nw6EsIFBSLCBCcmFzaWw!5e0!3m2!1sen!2sus!4v1676543210123!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização Vivant Residences"
            className="w-full h-full"
          />
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <ScrollReveal className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 px-2">
            Prefere que a gente entre em contato?
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto px-4">
            Deixe seu número e um especialista Vivant liga para você no melhor
            horário — sem custo e sem compromisso
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-[#1A2F4B] hover:bg-white/90 text-base sm:text-lg min-h-[48px] py-4 px-8 font-semibold"
            >
              <Link href="/captar">
                <Phone className="mr-2 w-5 h-5" />
                Solicitar Ligação
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-base sm:text-lg min-h-[48px] py-4 px-8 font-semibold"
            >
              <Link href="/casas">Ver Casas Disponíveis</Link>
            </Button>
          </div>
        </ScrollReveal>
      </section>

      <Footer />
    </div>
  );
}
