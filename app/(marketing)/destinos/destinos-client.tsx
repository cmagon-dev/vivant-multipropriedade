"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle2,
  MapPin,
  Thermometer,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  X,
  Expand,
  Images,
} from "lucide-react";
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

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop";

export function DestinosClient({ destinations }: DestinosClientProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const totalDestinations = destinations.length;
  const safeIndex =
    totalDestinations > 0
      ? ((currentSlide % totalDestinations) + totalDestinations) % totalDestinations
      : 0;
  const prevIndex =
    totalDestinations > 0 ? (safeIndex - 1 + totalDestinations) % totalDestinations : 0;
  const nextIndex =
    totalDestinations > 0 ? (safeIndex + 1) % totalDestinations : 0;

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

  const handlePrev = () =>
    setCurrentSlide((prev) => (prev === 0 ? totalDestinations - 1 : prev - 1));
  const handleNext = () =>
    setCurrentSlide((prev) => (prev === totalDestinations - 1 ? 0 : prev + 1));

  // Imagens do destino selecionado (com fallback)
  const modalImages =
    selectedDestination &&
    Array.isArray(selectedDestination.images) &&
    selectedDestination.images.length > 0
      ? selectedDestination.images
      : [FALLBACK_IMAGE];

  const openLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const lightboxPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === 0 ? modalImages!.length - 1 : prev - 1));
  }, [modalImages]);

  const lightboxNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === modalImages!.length - 1 ? 0 : prev + 1));
  }, [modalImages]);

  // Navegar lightbox com teclado
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") lightboxPrev();
      else if (e.key === "ArrowRight") lightboxNext();
      else if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, lightboxPrev, lightboxNext]);

  // Resetar índice de imagem ao abrir novo destino
  const handleSaberMais = (dest: Destination) => {
    setSelectedDestination(dest);
    setModalImageIndex(0);
  };

  // Hero images
  const heroImages = destinations
    .filter((dest) => Array.isArray(dest.images) && dest.images.length > 0)
    .map((dest) => ({ image: dest.images[0], name: dest.name, emoji: dest.emoji }));

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-20">
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
                backgroundImage: `url('${FALLBACK_IMAGE}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/70 via-[#1A2F4B]/50 via-[#1A2F4B]/25 to-[#F8F9FA]/60" />
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

      {/* Seção de Cards de Destinos */}
      <section className="relative pt-16 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <ScrollReveal className="max-w-[92rem] mx-auto">
            <div className="relative mb-8">
              {totalDestinations > 1 && (
                <>
                  <Button
                    variant="outline"
                    onClick={handlePrev}
                    className="absolute left-2 sm:left-3 lg:left-[15.5%] top-1/2 -translate-y-1/2 z-20 h-14 w-14 lg:h-20 lg:w-20 p-0 rounded-xl border-2 border-white/80 bg-[#1A2F4B]/55 backdrop-blur-sm text-white shadow-2xl hover:bg-[#1A2F4B]/75"
                    aria-label="Ir para trás"
                  >
                    <ChevronLeft className="w-6 h-6 lg:w-8 lg:h-8" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleNext}
                    className="absolute right-2 sm:right-3 lg:right-[15.5%] top-1/2 -translate-y-1/2 z-20 h-14 w-14 lg:h-20 lg:w-20 p-0 rounded-xl border-2 border-white/80 bg-[#1A2F4B]/55 backdrop-blur-sm text-white shadow-2xl hover:bg-[#1A2F4B]/75"
                    aria-label="Ir para frente"
                  >
                    <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8" />
                  </Button>
                </>
              )}

              {totalDestinations === 1 ? (
                <div className="flex justify-center px-4">
                  <DestinoCard
                    destination={destinations[0]}
                    position="center"
                    onSaberMais={handleSaberMais}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-[0.22fr_1.14fr_0.22fr] sm:grid-cols-[0.34fr_1.06fr_0.34fr] lg:grid-cols-[1fr_1.25fr_1fr] gap-2 sm:gap-4 lg:gap-6 px-1 sm:px-12 lg:px-8">
                  {featuredDestinations.map(({ destination, position, index }) => (
                    <DestinoCard
                      key={`${destination.id}-${position}`}
                      destination={destination}
                      position={position}
                      index={index}
                      prevIndex={prevIndex}
                      onSaberMais={handleSaberMais}
                    />
                  ))}
                </div>
              )}

              {totalDestinations > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {destinations.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        idx === safeIndex
                          ? "bg-vivant-gold w-6"
                          : "bg-gray-300 hover:bg-gray-400 w-2"
                      }`}
                      aria-label={`Ir para destino ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
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

      {/* Modal de detalhes do destino */}
      <Dialog
        open={!!selectedDestination}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedDestination(null);
            setModalImageIndex(0);
          }
        }}
      >
        <DialogContent className="max-w-4xl w-full p-0 overflow-hidden animate-in slide-in-from-bottom-8 duration-300 gap-0 flex flex-col max-h-[90vh]">
          {selectedDestination && (
            <>
              {/* Galeria de imagens — fixa no topo, não rola */}
              <div className="relative bg-gray-900 flex-shrink-0" style={{ height: "22rem" }}>
                {/* Imagem principal */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-500"
                  style={{ backgroundImage: `url('${modalImages[modalImageIndex]}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                {/* Botão expandir (lightbox) */}
                <button
                  onClick={() => openLightbox(modalImageIndex)}
                  className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white rounded-lg p-2 transition-colors backdrop-blur-sm"
                  aria-label="Ver em tela cheia"
                >
                  <Expand className="w-4 h-4" />
                </button>

                {/* Contador de fotos */}
                {modalImages.length > 1 && (
                  <div className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <Images className="w-3.5 h-3.5" />
                    {modalImageIndex + 1} / {modalImages.length}
                  </div>
                )}

                {/* Setas da galeria */}
                {modalImages.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setModalImageIndex((prev) =>
                          prev === 0 ? modalImages.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
                      aria-label="Imagem anterior"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() =>
                        setModalImageIndex((prev) =>
                          prev === modalImages.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors backdrop-blur-sm"
                      aria-label="Próxima imagem"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Título sobre a imagem */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <DialogTitle className="text-2xl sm:text-3xl text-white font-serif font-bold flex items-center gap-2 mb-1">
                    <span className="text-3xl">{selectedDestination.emoji}</span>
                    {selectedDestination.name}
                  </DialogTitle>
                  <p className="text-white/90 text-sm flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {selectedDestination.location} — {selectedDestination.state}
                  </p>
                </div>

                {/* Miniaturas */}
                {modalImages.length > 1 && (
                  <div className="absolute bottom-0 right-5 translate-y-1/2 flex gap-2 z-10">
                    {modalImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setModalImageIndex(idx)}
                        className={`w-14 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 shadow-lg ${
                          idx === modalImageIndex
                            ? "border-vivant-gold scale-110"
                            : "border-white/40 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${img}')` }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Espaço para as miniaturas que ficam metade fora da imagem */}
              {modalImages.length > 1 && <div className="h-6 bg-white flex-shrink-0" />}

              {/* Conteúdo do modal — esta parte rola */}
              <div className="overflow-y-auto flex-1">
              <div className="p-5 sm:p-7 space-y-6 bg-white">
                <p className="text-vivant-gold font-semibold text-base">
                  {selectedDestination.subtitle}
                </p>

                {/* Descrição */}
                <div>
                  <h4 className="text-sm font-bold text-vivant-navy uppercase tracking-wide mb-2">
                    Sobre o Destino
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedDestination.description}
                  </p>
                </div>

                {/* Clima e Estilo de vida */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Thermometer className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-bold text-blue-800">Clima</span>
                    </div>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      {selectedDestination.climate}
                    </p>
                  </div>
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span className="text-sm font-bold text-emerald-800">Estilo de vida</span>
                    </div>
                    <p className="text-sm text-emerald-700 leading-relaxed">
                      {selectedDestination.lifestyle}
                    </p>
                  </div>
                </div>

                {/* Destaques completos */}
                {Array.isArray(selectedDestination.features) &&
                  selectedDestination.features.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-vivant-navy uppercase tracking-wide mb-3">
                        Destaques
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedDestination.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 bg-gray-50 rounded-xl p-3"
                          >
                            <span className="text-2xl flex-shrink-0">{feature.icon}</span>
                            <div>
                              <p className="text-sm font-semibold text-vivant-navy">
                                {feature.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                                {feature.desc}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Valorização */}
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-green-700" />
                    <span className="text-sm font-bold text-green-800">Valorização</span>
                  </div>
                  <p className="text-sm text-green-700 leading-relaxed">
                    {selectedDestination.appreciation}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    asChild
                    className="flex-1 bg-vivant-navy hover:bg-vivant-navy/90 text-white font-semibold"
                    size="lg"
                  >
                    <Link href="/casas">
                      Ver Casas neste Destino
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 border-vivant-navy text-vivant-navy hover:bg-vivant-navy hover:text-white font-semibold"
                    size="lg"
                  >
                    <Link href="/contato">Fale com um especialista</Link>
                  </Button>
                </div>
              </div>
              </div>{/* fim overflow-y-auto */}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Lightbox — visualização em tela cheia */}
      {lightboxOpen && selectedDestination && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Imagem */}
          <div
            className="relative max-w-[95vw] max-h-[95vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={modalImages[lightboxIndex]}
              alt={`${selectedDestination.name} — foto ${lightboxIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Botão fechar */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-3 right-3 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors backdrop-blur-sm"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Contador */}
            <div className="absolute top-3 left-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
              {lightboxIndex + 1} / {modalImages.length}
            </div>

            {/* Setas lightbox */}
            {modalImages.length > 1 && (
              <>
                <button
                  onClick={lightboxPrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={lightboxNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Miniaturas no lightbox */}
            {modalImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4">
                {modalImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setLightboxIndex(idx)}
                    className={`w-16 h-11 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      idx === lightboxIndex
                        ? "border-vivant-gold scale-110"
                        : "border-white/30 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${img}')` }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Nome do destino na parte inferior */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/70 text-sm text-center whitespace-nowrap">
            {selectedDestination.emoji} {selectedDestination.name}
            <span className="text-white/40 ml-2 text-xs">ESC para fechar · ← → para navegar</span>
          </div>
        </div>
      )}
    </>
  );
}

// Componente de card resumido
interface DestinoCardProps {
  destination: Destination;
  position: "center" | "side";
  index?: number;
  prevIndex?: number;
  onSaberMais: (dest: Destination) => void;
}

function DestinoCard({ destination, position, index, prevIndex, onSaberMais }: DestinoCardProps) {
  return (
    <Card
      className={`overflow-hidden border-2 transition-all duration-700 ease-out flex flex-col ${
        position === "center"
          ? "h-[30rem] scale-[1.04] border-vivant-gold shadow-2xl z-10 lg:scale-[1.10]"
          : index === prevIndex
            ? "h-[30rem] scale-[0.85] lg:scale-[0.90] lg:-translate-x-4 border-transparent opacity-30 saturate-50 shadow-sm"
            : "h-[30rem] scale-[0.85] lg:scale-[0.90] lg:translate-x-4 border-transparent opacity-30 saturate-50 shadow-sm"
      }`}
    >
      <div className="relative h-48 min-h-48 max-h-48 bg-gray-200 flex-shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${
              destination.images?.[0] || FALLBACK_IMAGE
            }')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="bg-vivant-gold text-white px-2.5 py-0.5 rounded-full text-xs font-bold shadow">
            Destino
          </span>
          {destination.images && destination.images.length > 1 && (
            <span className="bg-black/50 text-white px-2 py-0.5 rounded-full text-xs flex items-center gap-1 backdrop-blur-sm">
              <Images className="w-3 h-3" />
              {destination.images.length}
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg text-white font-serif font-bold leading-tight line-clamp-1">
            {destination.name}
          </h3>
          <p className="text-xs text-white/85 flex items-center gap-1 mt-0.5 line-clamp-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            {destination.location}
          </p>
        </div>
      </div>

      <CardHeader className="pb-2 pt-3 px-4">
        <CardTitle className="text-base text-vivant-navy font-serif flex items-center gap-1.5 line-clamp-1">
          <span className="text-lg">{destination.emoji}</span>
          {destination.name}
        </CardTitle>
        <CardDescription className="text-xs text-vivant-navy/70 line-clamp-2">
          {destination.subtitle}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col px-4 pb-4 pt-0 gap-3">
        <div className="space-y-1.5">
          {(destination.features ?? []).slice(0, 2).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-vivant-gold flex-shrink-0" />
              <span className="text-xs text-vivant-navy/80 line-clamp-1">{feature.title}</span>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5">
          <div className="flex items-center gap-1 text-green-800">
            <TrendingUp className="w-3 h-3 flex-shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wide">Valorização</span>
          </div>
          <p className="text-[11px] text-green-700 mt-0.5 line-clamp-1">
            {destination.appreciation}
          </p>
        </div>

        <Button
          onClick={() => onSaberMais(destination)}
          className="w-full mt-auto bg-vivant-navy hover:bg-vivant-navy/90 text-white text-sm font-semibold h-9"
          size="sm"
        >
          Saber Mais
          <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
        </Button>
      </CardContent>
    </Card>
  );
}
