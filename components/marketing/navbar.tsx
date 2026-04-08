"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar(): JSX.Element {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b-2 border-vivant-navy/10 ${
        isScrolled
          ? "shadow-xl"
          : "shadow-md"
      }`}
      style={{ boxShadow: '0 4px 16px rgba(26, 47, 75, 0.08)' }}
    >
      {/* Navbar Principal */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-20">
          {/* Logo Vivant - Esquerda */}
          <Link href="/" className="flex items-center py-2">
            <img 
              src="/logo-vivant.png" 
              alt="Vivant" 
              className="h-10 sm:h-11 lg:h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Menu - Centro */}
          <div className="hidden md:flex items-center justify-center space-x-3 lg:space-x-4 flex-1 mx-auto">
            <Link
              href="/"
              className="text-[#1A2F4B]/90 hover:text-[#1A2F4B] transition-colors font-semibold text-xs lg:text-sm text-center whitespace-nowrap uppercase tracking-[0.12em]"
            >
              Home
            </Link>
            <Link
              href="/modelo"
              className="text-[#1A2F4B]/90 hover:text-[#1A2F4B] transition-colors font-semibold text-xs lg:text-sm text-center whitespace-nowrap uppercase tracking-[0.12em]"
            >
              O Modelo Vivant
            </Link>
            <Link
              href="/destinos"
              className="text-[#1A2F4B]/90 hover:text-[#1A2F4B] transition-colors font-semibold text-xs lg:text-sm text-center whitespace-nowrap uppercase tracking-[0.12em]"
            >
              Destinos
            </Link>
            <Link
              href="/casas"
              className="text-[#1A2F4B]/90 hover:text-[#1A2F4B] transition-colors font-semibold text-xs lg:text-sm text-center whitespace-nowrap uppercase tracking-[0.12em]"
            >
              Nossas Casas
            </Link>
            <Link
              href="/contato"
              className="text-[#1A2F4B]/90 hover:text-[#1A2F4B] transition-colors font-semibold text-xs lg:text-sm text-center whitespace-nowrap uppercase tracking-[0.12em]"
            >
              Contato
            </Link>
          </div>

          {/* Área da Direita: Ecossistema */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            <div className="flex items-center gap-2">
                {/* Logo Vivant Partners */}
                <Link
                  href="/parceiros"
                  className="bg-white px-2 py-1.5 rounded border border-vivant-gold/40 hover:border-vivant-gold hover:shadow-sm transition-all duration-300"
                >
                  <img
                    src="/logo-vivant-partners.png"
                    alt="Vivant Partners"
                    className="h-6 w-auto object-contain"
                  />
                </Link>

                {/* Logo Vivant Capital */}
                <Link 
                  href="/sobre-capital"
                  className="bg-white px-2 py-1.5 rounded border border-vivant-navy/25 hover:border-vivant-navy hover:shadow-sm transition-all duration-300"
                >
                  <img 
                    src="/logo-vivant-capital.png" 
                    alt="Vivant Capital" 
                    className="h-6 w-auto object-contain"
                  />
                </Link>

                {/* Logo Vivant Care */}
                <Link 
                  href="/care"
                  className="bg-white px-2 py-1.5 rounded border border-vivant-green/25 hover:border-vivant-green hover:shadow-sm transition-all duration-300"
                >
                  <img 
                    src="/logo-vivant-care.png" 
                    alt="Vivant Care" 
                    className="h-6 w-auto object-contain"
                  />
                </Link>
            </div>
          </div>

          {/* Mobile Menu Sheet Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden text-[#1A2F4B] p-2 hover:bg-[#1A2F4B]/10 rounded-lg transition-colors"
                aria-label="Abrir menu"
              >
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[400px] bg-gradient-to-b from-white to-slate-50">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-left">
                  <img 
                    src="/logo-vivant.png" 
                    alt="Vivant" 
                    className="h-14 w-auto object-contain"
                  />
                </SheetTitle>
              </SheetHeader>
              
              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1 items-center">
                <Link
                  href="/"
                  className="w-full text-center text-[#1A2F4B]/90 hover:bg-[#1A2F4B]/10 transition-colors font-semibold text-base py-3 px-4 rounded-lg uppercase tracking-[0.12em]"
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
                <Link
                  href="/modelo"
                  className="w-full text-center text-[#1A2F4B]/90 hover:bg-[#1A2F4B]/10 transition-colors font-semibold text-base py-3 px-4 rounded-lg uppercase tracking-[0.12em]"
                  onClick={handleLinkClick}
                >
                  O Modelo Vivant
                </Link>
                <Link
                  href="/destinos"
                  className="w-full text-center text-[#1A2F4B]/90 hover:bg-[#1A2F4B]/10 transition-colors font-semibold text-base py-3 px-4 rounded-lg uppercase tracking-[0.12em]"
                  onClick={handleLinkClick}
                >
                  Destinos
                </Link>
                <Link
                  href="/casas"
                  className="w-full text-center text-[#1A2F4B]/90 hover:bg-[#1A2F4B]/10 transition-colors font-semibold text-base py-3 px-4 rounded-lg uppercase tracking-[0.12em]"
                  onClick={handleLinkClick}
                >
                  Nossas Casas
                </Link>
                <Link
                  href="/contato"
                  className="w-full text-center text-[#1A2F4B]/90 hover:bg-[#1A2F4B]/10 transition-colors font-semibold text-base py-3 px-4 rounded-lg uppercase tracking-[0.12em]"
                  onClick={handleLinkClick}
                >
                  Contato
                </Link>
              </nav>

              {/* Divider */}
              <div className="my-6 border-t border-[#1A2F4B]/10"></div>

              {/* Ecossistema Section */}
              <div className="space-y-4">
                <p className="text-sm font-semibold text-[#1A2F4B]/60 px-4">Conheça também:</p>
                
                {/* Logo Vivant Partners */}
                <Link
                  href="/parceiros"
                  className="flex items-center gap-3 py-3 px-4 bg-white border-2 border-vivant-gold rounded-lg hover:shadow-md transition-all"
                  onClick={handleLinkClick}
                >
                  <img
                    src="/logo-vivant-partners.png"
                    alt="Vivant Partners"
                    className="h-10 w-auto object-contain"
                  />
                  <span className="text-sm text-[#1A2F4B]/70">Cadastre seu Imóvel</span>
                </Link>

                {/* Logo Capital */}
                <Link 
                  href="/sobre-capital"
                  className="flex items-center gap-3 py-3 px-4 bg-white border-2 border-vivant-navy/40 rounded-lg hover:border-vivant-navy hover:shadow-md transition-all"
                  onClick={handleLinkClick}
                >
                  <img 
                    src="/logo-vivant-capital.png" 
                    alt="Vivant Capital" 
                    className="h-10 w-auto object-contain"
                  />
                  <span className="text-sm text-[#1A2F4B]/70">Investimentos</span>
                </Link>

                {/* Logo Care */}
                <Link 
                  href="/care"
                  className="flex items-center gap-3 py-3 px-4 bg-white border-2 border-vivant-green/40 rounded-lg hover:border-vivant-green hover:shadow-md transition-all"
                  onClick={handleLinkClick}
                >
                  <img 
                    src="/logo-vivant-care.png" 
                    alt="Vivant Care" 
                    className="h-10 w-auto object-contain"
                  />
                  <span className="text-sm text-[#1A2F4B]/70">Gestão e Portal Cotista</span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
