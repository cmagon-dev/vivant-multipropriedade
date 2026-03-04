"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DestinationCardProps {
  destination: {
    id: string;
    name: string;
    state: string;
    emoji: string;
    color: string;
    subtitle: string;
    slug: string;
    images: string[];
  };
}

export function DestinationCard({ destination }: DestinationCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const images = Array.isArray(destination.images) ? destination.images : [];
  const hasImages = images.length > 0;

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  useEffect(() => {
    if (!hasImages || images.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [hasImages, images.length, isPaused]);

  return (
    <Card className="border-2 border-[#1A2F4B]/20 hover:shadow-2xl transition-all overflow-hidden group w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]">
      <div className="aspect-square relative overflow-hidden">
        {hasImages ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700 cursor-pointer"
            style={{
              backgroundImage: `url('${images[currentImageIndex]}')`,
            }}
            onClick={togglePause}
            title={isPaused ? "Clique para retomar" : "Clique para pausar"}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: destination.color || 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(34, 211, 238))',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
        
        {/* Indicador de pausa */}
        {isPaused && hasImages && images.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-10">
            <div className="flex gap-0.5">
              <div className="w-0.5 h-2.5 bg-white rounded-sm" />
              <div className="w-0.5 h-2.5 bg-white rounded-sm" />
            </div>
            Pausado
          </div>
        )}
        
        {/* Indicadores de carrossel (se houver múltiplas imagens) */}
        {hasImages && images.length > 1 && (
          <div className="absolute top-3 right-3 flex gap-1 z-10">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentImageIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
        
        <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
          <h3 className="text-2xl font-serif font-bold text-white mb-1">
            {destination.emoji} {destination.name}
          </h3>
          <p className="text-white/90 text-sm">
            {destination.state}
          </p>
        </div>
      </div>
      <CardContent className="p-4">
        <p className="text-xs text-[#1A2F4B]/70 mb-3">
          {destination.subtitle}
        </p>
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/destinos#${destination.slug}`}>Ver Mais</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
