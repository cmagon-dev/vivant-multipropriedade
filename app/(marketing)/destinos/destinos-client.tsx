"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MapPin, Thermometer, Users, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";

interface Destination {
  id: string;
  name: string;
  state: string;
  emoji: string;
  color: string;
  subtitle: string;
  location: string;
  description: string;
  climate: string;
  lifestyle: string;
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

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? destinations.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === destinations.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-start justify-center overflow-hidden pt-32 sm:pt-36 lg:pt-40">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#1A2F4B]/80 via-[#1A2F4B]/70 to-[#F8F9FA]" />
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center pt-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Nossos Destinos
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 max-w-3xl mx-auto font-light px-2">
              Conheça os paraísos selecionados pela Vivant. Múltiplas experiências, um único investimento.
            </p>
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
            <div className={`bg-gradient-to-br ${destinations[currentSlide]?.color} p-6 sm:p-8 text-white`}>
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="text-4xl sm:text-5xl">{destinations[currentSlide]?.emoji}</div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-serif font-bold">
                    {destinations[currentSlide]?.name}
                  </h2>
                  <p className="text-sm sm:text-base text-white/90">
                    {destinations[currentSlide]?.state}
                  </p>
                </div>
              </div>
              <p className="text-base sm:text-lg font-light mb-2">
                {destinations[currentSlide]?.subtitle}
              </p>
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{destinations[currentSlide]?.location}</span>
              </div>
            </div>

            <CardContent className="p-6 sm:p-8 space-y-4 sm:space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1A2F4B] mb-2">
                  Sobre o Destino
                </h3>
                <p className="text-[#1A2F4B]/70 leading-relaxed text-sm sm:text-base">
                  {destinations[currentSlide]?.description}
                </p>
              </div>

              {/* Features em Grid Compacto */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1A2F4B] mb-3">
                  Destaques
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {destinations[currentSlide]?.features.map((feature, idx) => (
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
                  {destinations[currentSlide]?.appreciation}
                </p>
              </div>

              {/* CTA Button */}
              <Button
                asChild
                size="lg"
                className="w-full bg-[#1A2F4B] hover:bg-[#1A2F4B]/90 text-white min-h-[48px]"
              >
                <a
                  href={`https://wa.me/5511999999999?text=Olá! Tenho interesse no destino ${encodeURIComponent(
                    destinations[currentSlide]?.name || ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Quero Conhecer Este Destino
                </a>
              </Button>
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
