"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
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
          <div className="hidden md:flex items-center justify-center space-x-4 lg:space-x-6 flex-1 mx-4 lg:mx-8">
            <Link
              href="/"
              className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-base lg:text-lg text-center whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              href="/modelo"
              className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-base lg:text-lg text-center whitespace-nowrap"
            >
              O Modelo Vivant
            </Link>
            <Link
              href="/destinos"
              className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-base lg:text-lg text-center whitespace-nowrap"
            >
              Destinos
            </Link>
            <Link
              href="/casas"
              className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-base lg:text-lg text-center whitespace-nowrap"
            >
              Nossas Casas
            </Link>
            <Link
              href="/contato"
              className="text-[#1A2F4B] hover:text-[#1A2F4B]/70 transition-colors font-medium text-base lg:text-lg text-center whitespace-nowrap"
            >
              Contato
            </Link>
          </div>

          {/* Área da Direita: Redes Sociais + Ecossistema */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {/* Redes Sociais */}
            <div className="flex items-center gap-2 mr-1">
              <a
                href="https://facebook.com/vivantresidences"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A2F4B]/40 hover:text-[#1A2F4B] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/vivantresidences"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A2F4B]/40 hover:text-[#1A2F4B] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/vivantresidences"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A2F4B]/40 hover:text-[#1A2F4B] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com/@vivantresidences"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1A2F4B]/40 hover:text-[#1A2F4B] transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>

            {/* Separador vertical */}
            <div className="h-12 w-px bg-[#1A2F4B]/10"></div>

            {/* Ecossistema */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-[#1A2F4B]/50 font-medium mb-1">Ecossistema</span>
              <div className="flex items-center gap-1.5">
                {/* Logo Vivant Partners */}
                <Link
                  href="/parceiros"
                  className="bg-white px-1.5 py-1 rounded border border-vivant-gold/30 hover:border-vivant-gold hover:shadow-sm transition-all duration-300"
                >
                  <img
                    src="/logo-vivant-partners.png"
                    alt="Vivant Partners"
                    className="h-5 w-auto object-contain"
                  />
                </Link>

                {/* Logo Vivant Capital */}
                <Link 
                  href="/capital"
                  className="bg-white px-1.5 py-1 rounded border border-vivant-navy/20 hover:border-vivant-navy hover:shadow-sm transition-all duration-300"
                >
                  <img 
                    src="/logo-vivant-capital.png" 
                    alt="Vivant Capital" 
                    className="h-5 w-auto object-contain"
                  />
                </Link>

                {/* Logo Vivant Care */}
                <Link 
                  href="/care"
                  className="bg-white px-1.5 py-1 rounded border border-vivant-green/20 hover:border-vivant-green hover:shadow-sm transition-all duration-300"
                >
                  <img 
                    src="/logo-vivant-care.png" 
                    alt="Vivant Care" 
                    className="h-5 w-auto object-contain"
                  />
                </Link>
              </div>
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
              <nav className="flex flex-col space-y-1">
                <Link
                  href="/"
                  className="text-[#1A2F4B] hover:bg-[#1A2F4B]/10 transition-colors font-medium text-lg py-4 px-4 rounded-lg"
                  onClick={handleLinkClick}
                >
                  Home
                </Link>
                <Link
                  href="/modelo"
                  className="text-[#1A2F4B] hover:bg-[#1A2F4B]/10 transition-colors font-medium text-lg py-4 px-4 rounded-lg"
                  onClick={handleLinkClick}
                >
                  O Modelo Vivant
                </Link>
                <Link
                  href="/destinos"
                  className="text-[#1A2F4B] hover:bg-[#1A2F4B]/10 transition-colors font-medium text-lg py-4 px-4 rounded-lg"
                  onClick={handleLinkClick}
                >
                  Destinos
                </Link>
                <Link
                  href="/casas"
                  className="text-[#1A2F4B] hover:bg-[#1A2F4B]/10 transition-colors font-medium text-lg py-4 px-4 rounded-lg"
                  onClick={handleLinkClick}
                >
                  Nossas Casas
                </Link>
                <Link
                  href="/contato"
                  className="text-[#1A2F4B] hover:bg-[#1A2F4B]/10 transition-colors font-medium text-lg py-4 px-4 rounded-lg"
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
                  href="/capital"
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

              {/* Divider */}
              <div className="my-6 border-t border-[#1A2F4B]/10"></div>

              {/* Redes Sociais */}
              <div className="px-4">
                <p className="text-sm font-semibold text-[#1A2F4B]/60 mb-4">Siga-nos:</p>
                <div className="flex items-center gap-4">
                  <a
                    href="https://facebook.com/vivantresidences"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1A2F4B]/40 hover:text-[#1A2F4B] transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                  <a
                    href="https://instagram.com/vivantresidences"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1A2F4B]/40 hover:text-[#1A2F4B] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href="https://linkedin.com/company/vivantresidences"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1A2F4B]/40 hover:text-[#1A2F4B] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a
                    href="https://youtube.com/@vivantresidences"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1A2F4B]/40 hover:text-[#1A2F4B] transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
