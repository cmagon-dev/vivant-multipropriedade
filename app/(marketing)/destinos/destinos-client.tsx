"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Thermometer, Users, TrendingUp, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

interface Destination {
  id: string;
  name: string;
  slug: string;
  state: string;
  emoji: string;
  color: string;
  subtitle: string;
  location: string;
  description: string;
  climate: string;
  lifestyle: string;
  images: string[];
  features: Array<{
    icon: string;
    title: string;
    desc: string;
  }>;
  appreciation: string;
}

interface DestinosClientProps {
  destinations: Destination[];
}

export function DestinosClient({ destinations }: DestinosClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const currentDestination = destinations[currentSlide];
  const images = Array.isArray(currentDestination?.images) ? currentDestination.images : [];
  const hasImages = images.length > 0;

  // Preparar array de imagens hero (primeira imagem de cada destino)
  const heroImages = destinations
    .filter(dest => Array.isArray(dest.images) && dest.images.length > 0)
    .map(dest => ({
      image: dest.images[0],
      name: dest.name,
      emoji: dest.emoji,
    }));

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? destinations.length - 1 : prev - 1));
    setCurrentImageIndex(0);
    setIsCarouselPaused(false);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === destinations.length - 1 ? 0 : prev + 1));
    setCurrentImageIndex(0);
    setIsCarouselPaused(false);
  };

  const totalDestinations = destinations.length;
  const safeIndex = totalDestinations > 0 ? ((currentSlide % totalDestinations) + totalDestinations) % totalDestinations : 0;
  const prevIndex = totalDestinations > 0 ? (safeIndex - 1 + totalDestinations) % totalDestinations : 0;
  const nextIndex = totalDestinations > 0 ? (safeIndex + 1) % totalDestinations : 0;

  const featuredDestinations =
    totalDestinations >= 3
      ? [
          { destination: destinations[prevIndex], position: "side" as const, index: prevIndex },
          { destination: destinations[safeIndex], position: "center" as const, index: safeIndex },
          { destination: destinations[nextIndex], position: "side" as const, index: nextIndex },
        ]
      : destinations.map((destination, idx) => ({
          destination,
          position: idx === safeIndex ? ("center" as const) : ("side" as const),
          index: idx,
        }));

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleCarouselPause = () => {
    setIsCarouselPaused((prev) => !prev);
  };

  // Auto-play do carrossel de imagens do hero
  useEffect(() => {
    if (heroImages.length <= 1) return;

    const interval = setInterval(() => {
      setHeroImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Auto-play do carrossel de imagens do card
  useEffect(() => {
    if (!hasImages || images.length <= 1 || isCarouselPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [hasImages, images.length, currentSlide, isCarouselPaused]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
        {/* Background Image Carousel with Overlay */}
        <div className="absolute inset-0 z-0">
          {heroImages.length > 0 ? (
            <div
              className="absolute inset-0 transition-all duration-1000"
              style={{
                backgroundImage: `url('${heroImages[heroImageIndex]?.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/70 via-[#1A2F4B]/50 via-[#1A2F4B]/25 to-[#F8F9FA]/60" />
          
          {/* Badge com nome do destino - canto superior direito */}
          {heroImages.length > 0 && (
            <div className="absolute top-20 sm:top-24 right-4 sm:right-6 lg:right-8 z-10">
              <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-md">
                <span className="text-base sm:text-lg">{heroImages[heroImageIndex]?.emoji}</span>
                <span className="text-white text-xs sm:text-sm font-medium">
                  {heroImages[heroImageIndex]?.name}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center">
          <ScrollReveal className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Nossos Destinos
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-8 sm:mb-12 lg:mb-16 max-w-3xl mx-auto font-light px-2">
              Conheça os paraísos selecionados pela Vivant. Múltiplas experiências, um único investimento.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                asChild
                size="lg"
                className="bg-white text-[#1A2F4B] hover:bg-white/90 text-base sm:text-lg min-h-[48px] h-auto py-3 sm:py-4 px-6 sm:px-8 font-semibold"
              >
                <Link href="/contato">
                  Agende sua visita
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
          </ScrollReveal>
        </div>
      </section>

      {/* Seleção de Destinos + Conteúdo */}
      <section className="relative pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal className="max-w-[92rem] mx-auto">
          {/* Faixa estilo Nossas Casas */}
          <div className="relative mb-8">
            {totalDestinations > 1 && (
              <>
                <Button
                  variant="outline"
                  onClick={handlePrev}
                  className="absolute left-2 sm:left-3 lg:left-[15.5%] top-1/2 -translate-y-1/2 z-20 h-14 w-14 lg:h-20 lg:w-20 p-0 rounded-xl border-2 border-white/80 bg-[#1A2F4B]/55 backdrop-blur-sm text-white shadow-2xl hover:bg-[#1A2F4B]/75"
                  aria-label="Ir para trás"
                >
                  <span className="text-3xl lg:text-5xl leading-none font-light -mt-0.5">{"<"}</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleNext}
                  className="absolute right-2 sm:right-3 lg:right-[15.5%] top-1/2 -translate-y-1/2 z-20 h-14 w-14 lg:h-20 lg:w-20 p-0 rounded-xl border-2 border-white/80 bg-[#1A2F4B]/55 backdrop-blur-sm text-white shadow-2xl hover:bg-[#1A2F4B]/75"
                  aria-label="Ir para frente"
                >
                  <span className="text-3xl lg:text-5xl leading-none font-light -mt-0.5">{">"}</span>
                </Button>
              </>
            )}

            <div className="grid grid-cols-[0.22fr_1.14fr_0.22fr] sm:grid-cols-[0.34fr_1.06fr_0.34fr] lg:grid-cols-[1fr_1.25fr_1fr] gap-2 sm:gap-4 lg:gap-6 px-1 sm:px-12 lg:px-8">
              {featuredDestinations.map(({ destination, position, index }) => (
                <Card
                  key={`${destination.id}-${position}`}
                  className={`h-[44rem] overflow-hidden border-2 transition-all duration-700 ease-out flex flex-col ${
                    position === "center"
                      ? "scale-[1.04] border-vivant-gold shadow-2xl z-10 lg:scale-[1.14] lg:translate-x-0"
                      : index === prevIndex
                        ? "scale-[0.8] lg:scale-[0.88] lg:-translate-x-6 border-transparent opacity-30 saturate-50 shadow-sm"
                        : "scale-[0.8] lg:scale-[0.88] lg:translate-x-6 border-transparent opacity-30 saturate-50 shadow-sm"
                  }`}
                >
                  <div className="relative h-64 min-h-64 max-h-64 bg-gray-200">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${destination.images?.[0] || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop"}')`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
                    <div className="absolute top-4 left-4 bg-vivant-gold text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      Destino
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl text-white font-serif font-bold line-clamp-1">
                        {destination.name}
                      </h3>
                      <p className="text-sm text-white/90 flex items-center gap-2 line-clamp-1">
                        <MapPin className="w-4 h-4" />
                        {destination.location}
                      </p>
                    </div>
                  </div>

                  <CardHeader className="h-24">
                    <CardTitle className="text-2xl text-vivant-navy font-serif flex items-center gap-2 line-clamp-1">
                      <span className="text-2xl">{destination.emoji}</span>
                      {destination.name}
                    </CardTitle>
                    <CardDescription className="text-base text-vivant-navy/70 line-clamp-2 min-h-[48px]">
                      {destination.subtitle}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4 flex flex-col">
                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200 min-h-[96px]">
                      <div className="flex flex-col items-center">
                        <Thermometer className="w-5 h-5 text-vivant-gold mb-1" />
                        <span className="text-sm font-semibold text-vivant-navy text-center">
                          {destination.climate}
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <Users className="w-5 h-5 text-vivant-gold mb-1" />
                        <span className="text-sm font-semibold text-vivant-navy text-center">
                          {destination.lifestyle}
                        </span>
                      </div>
                    </div>

                    <div className="min-h-[84px]">
                      <span className="text-gray-600 text-sm">Destaques</span>
                      <div className="mt-2 space-y-1 min-h-[52px]">
                        {(destination.features ?? []).slice(0, 2).map((feature, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-vivant-gold mt-0.5" />
                            <span className="text-sm text-vivant-navy/80 line-clamp-1">{feature.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-green-200 bg-green-50 p-2 mt-auto">
                      <div className="flex items-center gap-1.5 text-green-800">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold">Valorização</span>
                      </div>
                      <p className="text-xs text-green-700 mt-1">{destination.appreciation}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <ScrollReveal className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 sm:mb-6 px-2">
            Pronto para conhecer nossos destinos?
          </h2>
          <p className="text-base sm:text-lg text-white/90 mb-8 max-w-2xl mx-auto px-4">
            Fale com nossos especialistas e descubra qual destino é perfeito para você
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
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
        </ScrollReveal>
      </section>
    </>
  );
}
