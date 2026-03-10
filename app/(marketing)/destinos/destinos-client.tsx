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
      <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-32 sm:pt-36 lg:pt-40">
        {/* Background Image Carousel with Overlay */}
        <div className="absolute inset-0 z-0">
          {heroImages.length > 0 ? (
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
              style={{
                backgroundImage: `url('${heroImages[heroImageIndex]?.image}')`,
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
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center pt-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Nossos Destinos
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-16 sm:mb-24 lg:mb-32 max-w-3xl mx-auto font-light px-2">
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
          </div>
        </div>
      </section>

      {/* Seleção de Destinos + Conteúdo */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
          {/* Abas de Seleção */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 sm:mb-12">
            {destinations.map((dest, idx) => (
              <button
                key={dest.id}
                onClick={() => setCurrentSlide(idx)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                  idx === currentSlide
                    ? `bg-gradient-to-br ${dest.color} text-white shadow-lg scale-105`
                    : "bg-white text-vivant-navy border-2 border-gray-200 hover:border-vivant-gold"
                }`}
              >
                <span className="text-2xl">{dest.emoji}</span>
                <span>{dest.name}</span>
              </button>
            ))}
          </div>

          {/* Card do Destino Selecionado */}
          <Card className="overflow-hidden border-2 border-gray-200 shadow-lg max-w-4xl mx-auto">
            {/* Carrossel de Imagens (se houver) */}
            {hasImages ? (
              <div className="relative aspect-[21/9] overflow-hidden group/carousel">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 cursor-pointer"
                  style={{
                    backgroundImage: `url('${images[currentImageIndex]}')`,
                  }}
                  onClick={toggleCarouselPause}
                  title={isCarouselPaused ? "Clique para retomar" : "Clique para pausar"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                
                {/* Indicador de pausa */}
                {isCarouselPaused && images.length > 1 && (
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 z-10">
                    <div className="flex gap-0.5">
                      <div className="w-1 h-3 bg-white rounded-sm" />
                      <div className="w-1 h-3 bg-white rounded-sm" />
                    </div>
                    Pausado
                  </div>
                )}
                
                {/* Controles de navegação do carrossel */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="w-4 h-4 text-vivant-navy" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity z-10"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="w-4 h-4 text-vivant-navy" />
                    </button>
                    
                    {/* Indicadores */}
                    <div className="absolute bottom-24 sm:bottom-28 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`h-2 rounded-full transition-all ${
                            idx === currentImageIndex
                              ? "w-8 bg-white"
                              : "w-2 bg-white/60 hover:bg-white/80"
                          }`}
                          aria-label={`Ir para imagem ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="text-4xl sm:text-5xl">{currentDestination?.emoji}</div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-serif font-bold">
                        {currentDestination?.name}
                      </h2>
                      <p className="text-sm sm:text-base text-white/90">
                        {currentDestination?.state}
                      </p>
                    </div>
                  </div>
                  <p className="text-base sm:text-lg font-light mb-2">
                    {currentDestination?.subtitle}
                  </p>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{currentDestination?.location}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`bg-gradient-to-br ${currentDestination?.color} p-6 sm:p-8 text-white`}>
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="text-4xl sm:text-5xl">{currentDestination?.emoji}</div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-bold">
                      {currentDestination?.name}
                    </h2>
                    <p className="text-sm sm:text-base text-white/90">
                      {currentDestination?.state}
                    </p>
                  </div>
                </div>
                <p className="text-base sm:text-lg font-light mb-2">
                  {currentDestination?.subtitle}
                </p>
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{currentDestination?.location}</span>
                </div>
              </div>
            )}

            <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1A2F4B] mb-2">
                  Sobre o Destino
                </h3>
                <p className="text-[#1A2F4B]/70 leading-relaxed text-sm sm:text-base">
                  {currentDestination?.description}
                </p>
              </div>

              {/* Features em Grid Compacto */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1A2F4B] mb-3">
                  Destaques
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {currentDestination?.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="text-xl sm:text-2xl">{feature.icon}</div>
                      <div>
                        <h4 className="font-semibold text-[#1A2F4B] text-sm mb-0.5">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appreciation */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-green-800">
                    Valorização
                  </h3>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  {currentDestination?.appreciation}
                </p>
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-[#1A2F4B] to-[#2A4F6B]">
        <div className="container mx-auto px-4 sm:px-6 text-center">
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
        </div>
      </section>
    </>
  );
}
