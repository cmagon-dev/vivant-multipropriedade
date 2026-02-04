"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export function Navbar(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white shadow-2xl ${
        isScrolled
          ? "shadow-2xl"
          : "shadow-xl"
      }`}
      style={{ boxShadow: '0 8px 32px rgba(26, 47, 75, 0.15)' }}
    >
      {/* Navbar Principal */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-28">
          {/* Logo Vivant - Esquerda */}
          <Link href="/" className="flex items-center py-2">
            <img 
              src="/logo-vivant.png" 
              alt="Vivant" 
              className="h-64 w-auto"
            />
          </Link>

          {/* Desktop Menu - Centro */}
          <div className="hidden md:flex items-center justify-center space-x-8 flex-1 mx-8">
            <Link
              href="#porto-rico"
              className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-lg text-center"
            >
              Locais de Atuação
            </Link>
            <Link
              href="#multipropriedade"
              className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-lg text-center"
            >
              Multipropriedade
            </Link>
            <Link
              href="#como-funciona"
              className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-lg text-center"
            >
              Como Funciona
            </Link>
            <Link
              href="#casas"
              className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-lg text-center"
            >
              Casas
            </Link>
            <Link
              href="#sobre"
              className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-lg text-center"
            >
              Sobre
            </Link>
          </div>

          {/* Logos Vivant Capital e Care - Direita */}
          <div className="hidden md:flex items-center gap-6">
            <a 
              href="https://vivantcapital.com.br"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src="/logo-vivant-capital.png" 
                alt="Vivant Capital" 
                className="h-40 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </a>
            <a 
              href="https://vivantcare.com.br"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src="/logo-vivant-care.png" 
                alt="Vivant Care" 
                className="h-40 w-auto cursor-pointer hover:opacity-80 transition-opacity"
              />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#1A2F4B]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 bg-white border-t border-[#1A2F4B]/10">
            <Link
              href="#porto-rico"
              className="block text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Locais de Atuação
            </Link>
            <Link
              href="#multipropriedade"
              className="block text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Multipropriedade
            </Link>
            <Link
              href="#como-funciona"
              className="block text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Como Funciona
            </Link>
            <Link
              href="#casas"
              className="block text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Casas
            </Link>
            <Link
              href="#sobre"
              className="block text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <a 
              href="https://vivantcapital.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-4"
            >
              <img 
                src="/logo-vivant-capital.png" 
                alt="Vivant Capital" 
                className="h-32 w-auto mx-auto cursor-pointer"
              />
            </a>
            <a 
              href="https://vivantcare.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-4"
            >
              <img 
                src="/logo-vivant-care.png" 
                alt="Vivant Care" 
                className="h-32 w-auto mx-auto cursor-pointer"
              />
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
