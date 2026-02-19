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
import { Footer } from "@/components/marketing/footer";
import { WhatsAppButton } from "@/components/marketing/whatsapp-button";
import {
  Home,
  Users,
  Calendar,
  Shield,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Heart,
  Building2,
  Award,
  CheckCircle2,
  MapPin,
  Bed,
  DollarSign,
  Target,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vivant Residences - Sua Casa de Férias em Multipropriedade",
  description:
    "Desfrute de casas de alto padrão em Porto Rico e Região Chavantes através da multipropriedade inteligente. Gestão profissional, segurança jurídica e valorização garantida.",
  openGraph: {
    title: "Vivant Residences - Multipropriedade Inteligente",
    description:
      "Sua casa de férias dos sonhos sem complicações. Casas de luxo com gestão hoteleira profissional.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <WhatsAppButton />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-32 sm:pt-36 lg:pt-40">
        {/* Background Image with Overlay */}
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
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center pt-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
              <span className="text-white text-base sm:text-xl font-light italic">
                "A arte de viver bem"
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Sua casa de férias dos sonhos, sem complicações
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto font-light px-2">
              Desfrute de casas de alto padrão em destinos exclusivos.
              Multipropriedade com gestão profissional e segurança jurídica.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-[#1A2F4B] hover:bg-white/90 text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
              >
                <Link href="/modelo">
                  Como Funciona
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#1A2F4B] text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
              >
                <Link href="/casas">Ver Casas Disponíveis</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* O que é Multipropriedade - Resumido */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-4 px-2">
              Multipropriedade Inteligente
            </h2>
            <p className="text-base sm:text-lg text-[#1A2F4B]/70 px-2">
              Tenha sua casa de lazer com custo fracionado e gestão profissional
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-8">
            {/* Card 1 */}
            <Card className="border-2 border-[#1A2F4B]/10 hover:border-[#1A2F4B]/30 transition-all shadow-lg">
              <CardContent className="p-6 text-center">
                <Home className="w-12 h-12 text-[#1A2F4B] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Propriedade Real
                </h3>
                <p className="text-sm text-[#1A2F4B]/70">
                  Você é dono de verdade, com escritura registrada em cartório
                </p>
              </CardContent>
            </Card>

            {/* Card 2 */}
            <Card className="border-2 border-[#1A2F4B]/10 hover:border-[#1A2F4B]/30 transition-all shadow-lg">
              <CardContent className="p-6 text-center">
                <Calendar className="w-12 h-12 text-[#1A2F4B] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Uso Garantido
                </h3>
                <p className="text-sm text-[#1A2F4B]/70">
                  8 a 10 semanas por ano em calendário fixo e rotativo
                </p>
              </CardContent>
            </Card>

            {/* Card 3 */}
            <Card className="border-2 border-[#1A2F4B]/10 hover:border-[#1A2F4B]/30 transition-all shadow-lg">
              <CardContent className="p-6 text-center">
                <Sparkles className="w-12 h-12 text-[#1A2F4B] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Gestão Profissional
                </h3>
                <p className="text-sm text-[#1A2F4B]/70">
                  Vivant Care cuida de tudo: manutenção e limpeza
                </p>
              </CardContent>
            </Card>

            {/* Card 4 */}
            <Card className="border-2 border-[#1A2F4B]/10 hover:border-[#1A2F4B]/30 transition-all shadow-lg">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-12 h-12 text-[#1A2F4B] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Custo Acessível
                </h3>
                <p className="text-sm text-[#1A2F4B]/70">
                  Invista apenas na fração que vai usar, sem desperdício
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Destaque - Múltiplos Destinos */}
          <div className="max-w-5xl mx-auto">
            <Card className="border-2 border-vivant-gold/30 bg-gradient-to-br from-amber-50/50 to-white shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-vivant-gold to-yellow-600 flex items-center justify-center">
                    <MapPin className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-bold text-[#1A2F4B] mb-2">
                      Múltiplos Destinos, Mesmo Investimento
                    </h3>
                    <p className="text-sm text-[#1A2F4B]/80 leading-relaxed mb-2">
                      Enquanto uma casa de veraneio tradicional limita você a um único destino, a Vivant 
                      permite que você <strong>diversifique suas experiências</strong> pelo mesmo investimento. 
                      Tenha acesso a <strong>propriedades em múltiplos locais</strong>: praias, lagos, serra e litoral.
                    </p>
                    <p className="text-xs text-[#1A2F4B]/70">
                      Mais variedade, mais liberdade, mais momentos inesquecíveis — tudo com a mesma gestão 
                      profissional e valorização patrimonial.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" className="min-h-[48px]">
              <Link href="/modelo">
                Entenda o Modelo Completo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Destinos Preview */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-4 px-2">
              Nossos Destinos
            </h2>
            <p className="text-base sm:text-lg text-[#1A2F4B]/70 px-2">
              Múltiplos destinos exclusivos para você aproveitar
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Porto Rico Card */}
            <Card className="border-2 border-[#1A2F4B]/20 hover:shadow-2xl transition-all overflow-hidden group">
              <div className="aspect-square bg-gradient-to-br from-blue-500 to-cyan-400 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-50 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">
                    🚤 Porto Rico
                  </h3>
                  <p className="text-white/90 text-sm">
                    Paraná
                  </p>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-[#1A2F4B]/70 mb-3">
                  Praias de água doce e esportes náuticos
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/destinos">Ver Mais</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Chavantes Card */}
            <Card className="border-2 border-[#1A2F4B]/20 hover:shadow-2xl transition-all overflow-hidden group">
              <div className="aspect-square bg-gradient-to-br from-green-500 to-emerald-400 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-50 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">
                    🏞️ Chavantes
                  </h3>
                  <p className="text-white/90 text-sm">
                    Paraná
                  </p>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-[#1A2F4B]/70 mb-3">
                  Lago, natureza e tranquilidade
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/destinos">Ver Mais</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Serra Gaúcha Card */}
            <Card className="border-2 border-[#1A2F4B]/20 hover:shadow-2xl transition-all overflow-hidden group">
              <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-400 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-50 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">
                    🏔️ Serra Gaúcha
                  </h3>
                  <p className="text-white/90 text-sm">
                    Rio Grande do Sul
                  </p>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-[#1A2F4B]/70 mb-3">
                  Clima de montanha e gastronomia
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/destinos">Ver Mais</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Litoral Catarinense Card */}
            <Card className="border-2 border-[#1A2F4B]/20 hover:shadow-2xl transition-all overflow-hidden group">
              <div className="aspect-square bg-gradient-to-br from-cyan-500 to-blue-400 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-50 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-serif font-bold text-white mb-1">
                    🏖️ Litoral SC
                  </h3>
                  <p className="text-white/90 text-sm">
                    Santa Catarina
                  </p>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-xs text-[#1A2F4B]/70 mb-3">
                  Praias paradisíacas e vida litorânea
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/destinos">Ver Mais</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" variant="outline" className="min-h-[48px]">
              <Link href="/destinos">
                Ver Todos os Destinos
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Casas em Destaque Preview */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-white to-[#F8F9FA]">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-4 px-2">
              Casas em Destaque
            </h2>
            <p className="text-base sm:text-lg text-[#1A2F4B]/70 px-2">
              Propriedades exclusivas com infraestrutura completa
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {/* Casa 1 - Porto Rico Marina Premium */}
            <Card className="border-2 border-vivant-gold hover:shadow-2xl transition-all overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="bg-vivant-gold text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    🔥 DESTAQUE
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-serif font-bold text-white mb-1">
                    Casa Porto Rico - Marina Premium
                  </h3>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Porto Rico, PR</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-4 text-sm text-[#1A2F4B]/70 mb-3">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>4 suítes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span>280m²</span>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-2xl font-bold text-[#1A2F4B]">R$ 375.000</p>
                  <p className="text-xs text-[#1A2F4B]/60">Fração 1/8 • +42% valorização</p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/casas">Ver Detalhes</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Casa 2 - Chavantes Sunset */}
            <Card className="border-2 border-[#1A2F4B]/20 hover:shadow-2xl transition-all overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    DISPONÍVEL
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-serif font-bold text-white mb-1">
                    Casa Chavantes - Condomínio Sunset
                  </h3>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">1º de Maio, PR</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-4 text-sm text-[#1A2F4B]/70 mb-3">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>3 suítes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span>220m²</span>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-2xl font-bold text-[#1A2F4B]">R$ 285.000</p>
                  <p className="text-xs text-[#1A2F4B]/60">Fração 1/8 • +28% valorização</p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/casas">Ver Detalhes</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Casa 3 - Lakeside Residence */}
            <Card className="border-2 border-[#1A2F4B]/20 hover:shadow-2xl transition-all overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1600566753151-384129cf4e3e?q=80&w=2070&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    PRÉ-LANÇAMENTO
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-serif font-bold text-white mb-1">
                    Casa Alvorada - Lakeside
                  </h3>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Alvorada do Sul, PR</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-4 text-sm text-[#1A2F4B]/70 mb-3">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>4 suítes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span>250m²</span>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-2xl font-bold text-[#1A2F4B]">R$ 320.000</p>
                  <p className="text-xs text-[#1A2F4B]/60">Fração 1/8 • +35% valorização</p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/casas">Ver Detalhes</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Casa 4 - Porto Rico Sunset */}
            <Card className="border-2 border-[#1A2F4B]/20 hover:shadow-2xl transition-all overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop')",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    DISPONÍVEL
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-serif font-bold text-white mb-1">
                    Casa Porto Rico - Sunset View
                  </h3>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Porto Rico, PR</span>
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex items-center gap-4 text-sm text-[#1A2F4B]/70 mb-3">
                  <div className="flex items-center gap-1">
                    <Bed className="w-4 h-4" />
                    <span>3 suítes</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="w-4 h-4" />
                    <span>240m²</span>
                  </div>
                </div>
                <div className="mb-3">
                  <p className="text-2xl font-bold text-[#1A2F4B]">R$ 350.000</p>
                  <p className="text-xs text-[#1A2F4B]/60">Fração 1/8 • +38% valorização</p>
                </div>
                <Button asChild className="w-full">
                  <Link href="/casas">Ver Detalhes</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button asChild size="lg" className="min-h-[48px]">
              <Link href="/casas">
                Ver Todas as Casas
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Sobre a Vivant */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-8 text-center">
              Sobre a Vivant
            </h2>
            
            <div className="space-y-6 text-[#1A2F4B]/80 mb-12">
              <p className="text-base sm:text-lg leading-relaxed">
                A <strong>Vivant</strong> nasceu da percepção de que investir em uma casa de veraneio 
                tradicional não faz mais sentido no mundo moderno. Por que comprometer centenas de milhares 
                de reais em uma única propriedade que fica ociosa a maior parte do ano, enquanto você ainda 
                precisa se preocupar com manutenção, limpeza, reformas e toda a burocracia?
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                Nossa proposta é simples e revolucionária: <strong>investimento inteligente em lazer</strong>. 
                Com a <strong>multipropriedade</strong> (Lei 13.777/2018), você investe uma <strong>fração 
                do valor</strong> de uma casa tradicional e tem acesso a <strong>múltiplas propriedades</strong> em 
                diferentes destinos — praia, lago, serra, litoral. Cada destino com sua personalidade única, 
                todas com o mesmo padrão de excelência.
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                Mas não paramos por aí. Criamos um <strong>ecossistema completo</strong> para você ter 
                tranquilidade total: <strong>Vivant Residences</strong> seleciona e administra as propriedades, 
                <strong> Vivant Care</strong> cuida de toda a gestão (manutenção preventiva, limpeza, jardinagem, 
                seguros), <strong>Vivant Capital</strong> oferece soluções de investimento para multiplicar 
                seu patrimônio, e <strong>Vivant Partners</strong> expande continuamente nosso portfólio ao 
                conectar proprietários que querem monetizar seus imóveis. Você é <strong>proprietário de verdade</strong>, 
                com escritura registrada, mas sem nenhuma preocupação operacional.
              </p>

              <p className="text-base sm:text-lg leading-relaxed">
                O resultado? <strong>Mais economia</strong> (invista menos, aproveite mais), <strong>mais 
                variedade</strong> (múltiplos destinos ao seu alcance), <strong>zero estresse</strong> (sem 
                manutenção ou burocracias) e <strong>valorização garantida</strong> (seus ativos crescem 
                enquanto você relaxa). Esse é o futuro do lazer inteligente.
              </p>
            </div>

            {/* Missão, Visão e Valores */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Missão */}
              <Card className="border-2 border-[#1A2F4B]/20 shadow-lg">
                <CardHeader className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] text-white p-6">
                  <Target className="w-10 h-10 mb-3" />
                  <CardTitle className="text-xl font-serif">Missão</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-[#1A2F4B]/80 text-sm leading-relaxed">
                    Tornar o investimento em lazer mais inteligente e acessível, 
                    oferecendo múltiplos destinos com gestão completa, segurança 
                    jurídica e valorização patrimonial garantida.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Visão */}
              <Card className="border-2 border-[#1A2F4B]/20 shadow-lg">
                <CardHeader className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] text-white p-6">
                  <TrendingUp className="w-10 h-10 mb-3" />
                  <CardTitle className="text-xl font-serif">Visão</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-[#1A2F4B]/80 text-sm leading-relaxed">
                    Ser a principal referência em multipropriedade do Brasil, 
                    reconhecida por oferecer a melhor relação custo-benefício 
                    e experiência zero estresse para os cotistas.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Valores */}
              <Card className="border-2 border-[#1A2F4B]/20 shadow-lg">
                <CardHeader className="bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] text-white p-6">
                  <Heart className="w-10 h-10 mb-3" />
                  <CardTitle className="text-xl font-serif">Valores</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <CardDescription className="text-[#1A2F4B]/80 text-sm leading-relaxed">
                    <strong>Praticidade</strong>, <strong>economia inteligente</strong>,{" "}
                    <strong>liberdade de escolha</strong>,{" "}
                    <strong>excelência</strong> operacional e{" "}
                    <strong>tranquilidade</strong> total para você.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Ecossistema Vivant */}
      <section className="pt-8 pb-16 lg:pb-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-4 px-2">
              O Ecossistema Vivant
            </h2>
            <p className="text-base sm:text-lg text-[#1A2F4B]/70 px-2">
              Mais do que multipropriedade: um sistema completo para você viver,
              cuidar e investir
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Vivant Residences */}
            <Card className="border-2 border-[#1A2F4B]/20 hover:border-[#1A2F4B] hover:shadow-xl transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Vivant Residences
                </h3>
                <p className="text-sm text-[#1A2F4B]/70 mb-4">
                  Sua casa de lazer com multipropriedade inteligente
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/modelo">Saiba Mais</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Vivant Partners */}
            <Card className="border-2 border-vivant-gold/30 hover:border-vivant-gold hover:shadow-xl transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vivant-gold to-yellow-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Vivant Partners
                </h3>
                <p className="text-sm text-[#1A2F4B]/70 mb-4">
                  Tem uma casa? Cadastre e monetize seu ativo
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full border-vivant-gold text-vivant-gold hover:bg-vivant-gold/10"
                >
                  <Link href="/parceiros">Cadastrar Imóvel</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Vivant Capital */}
            <Card className="border-2 border-blue-200 hover:border-blue-500 hover:shadow-xl transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Vivant Capital
                </h3>
                <p className="text-sm text-[#1A2F4B]/70 mb-4">
                  Invista com inteligência e multiplique seu patrimônio
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/capital">Acessar</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Vivant Care */}
            <Card className="border-2 border-vivant-green/30 hover:border-vivant-green hover:shadow-xl transition-all group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-vivant-green to-emerald-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Vivant Care
                </h3>
                <p className="text-sm text-[#1A2F4B]/70 mb-4">
                  Gestão hoteleira profissional para sua propriedade
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/care">Conhecer</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Por que Vivant? - Diferenciais */}
      <section className="py-16 lg:py-20 bg-gradient-to-b from-[#F8F9FA] to-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-4 px-2">
              Por que escolher a Vivant?
            </h2>
            <p className="text-base sm:text-lg text-[#1A2F4B]/70 px-2">
              Diferenciais que fazem toda a diferença na sua experiência
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Diferencial 1 */}
            <Card className="border-2 border-[#1A2F4B]/10 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-[#1A2F4B] mb-4" />
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Segurança Jurídica Total
                </h3>
                <p className="text-sm text-[#1A2F4B]/70">
                  Escritura pública registrada em cartório conforme Lei
                  13.777/2018. Você é dono de verdade, com todos os direitos
                  garantidos.
                </p>
              </CardContent>
            </Card>

            {/* Diferencial 2 */}
            <Card className="border-2 border-[#1A2F4B]/10 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <Sparkles className="w-12 h-12 text-[#1A2F4B] mb-4" />
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Gestão Hoteleira Premium
                </h3>
                <p className="text-sm text-[#1A2F4B]/70">
                  Vivant Care cuida de manutenção, limpeza, seguros e
                  experiência premium. Zero dor de cabeça para você.
                </p>
              </CardContent>
            </Card>

            {/* Diferencial 3 */}
            <Card className="border-2 border-[#1A2F4B]/10 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <TrendingUp className="w-12 h-12 text-[#1A2F4B] mb-4" />
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Valorização Patrimonial
                </h3>
                <p className="text-sm text-[#1A2F4B]/70">
                  Imóveis em regiões de alta demanda e crescimento acelerado.
                  Média de 28-42% de valorização nos últimos anos.
                </p>
              </CardContent>
            </Card>

            {/* Diferencial 4 */}
            <Card className="border-2 border-[#1A2F4B]/10 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <Users className="w-12 h-12 text-[#1A2F4B] mb-4" />
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Comunidade Exclusiva
                </h3>
                <p className="text-sm text-[#1A2F4B]/70">
                  Conecte-se com outros cotistas através do Portal do Cotista e
                  eventos exclusivos da comunidade Vivant.
                </p>
              </CardContent>
            </Card>

            {/* Diferencial 5 */}
            <Card className="border-2 border-[#1A2F4B]/10 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <Award className="w-12 h-12 text-[#1A2F4B] mb-4" />
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Alto Padrão Garantido
                </h3>
                <p className="text-sm text-[#1A2F4B]/70">
                  Propriedades selecionadas com infraestrutura completa,
                  mobiliadas e prontas para uso imediato.
                </p>
              </CardContent>
            </Card>

            {/* Diferencial 6 */}
            <Card className="border-2 border-[#1A2F4B]/10 hover:shadow-xl transition-all">
              <CardContent className="p-6">
                <CheckCircle2 className="w-12 h-12 text-[#1A2F4B] mb-4" />
                <h3 className="text-lg font-bold text-[#1A2F4B] mb-2">
                  Transparência Total
                </h3>
                <p className="text-sm text-[#1A2F4B]/70">
                  Custos claros, sem taxas escondidas. Você sabe exatamente o
                  que está pagando e recebendo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6 px-2">
            Pronto para realizar o sonho da casa de férias?
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto px-4">
            Fale com nossos especialistas e descubra como ter sua propriedade com
            inteligência e segurança
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
