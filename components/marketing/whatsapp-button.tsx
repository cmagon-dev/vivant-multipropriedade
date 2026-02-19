"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppButton(): JSX.Element {
  const phoneNumber = "5511999999999"; // Substitua pelo número real
  const message = encodeURIComponent("Olá! Gostaria de saber mais sobre a Vivant Multipropriedade.");
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 lg:hidden group"
      aria-label="Falar no WhatsApp"
    >
      {/* Círculo de pulsação externo */}
      <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse-slow"></div>
      
      {/* Botão principal */}
      <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
      </div>

      {/* Tooltip (opcional) */}
      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
        <div className="bg-gray-900 text-white text-xs sm:text-sm px-3 py-2 rounded-lg whitespace-nowrap shadow-lg">
          Fale conosco
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>
    </a>
  );
}
