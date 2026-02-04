"use client";

import { Lock, Smartphone, Calendar, FileText, Sparkles, Download, Apple } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PortalCotistaPage(): JSX.Element {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-2xl" style={{ boxShadow: '0 8px 32px rgba(26, 47, 75, 0.15)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-28">
            {/* Logo Vivant Care - Esquerda */}
            <div className="flex items-center py-2">
              <img 
                src="/logo-vivant-care.png" 
                alt="Vivant Care" 
                className="h-16 w-auto"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Content com padding reduzido pela metade */}
      <div className="pt-32 h-full flex items-center justify-center px-4">
      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-6 items-center">
        {/* Login Card */}
        <Card className="border-none shadow-2xl bg-white">
          <div className="p-6 md:p-8">
            {/* Logo/Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-vivant-navy/10 rounded-full mb-3">
                <Lock className="w-7 h-7 text-vivant-navy" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-vivant-navy mb-1">
                Portal do Cotista
              </h1>
              <p className="text-sm text-slate-600">
                Acesse sua área exclusiva
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-vivant-navy font-medium text-sm">
                  E-mail ou CPF
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="seu@email.com"
                  className="h-10 border-slate-300 focus:border-vivant-navy"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="password" className="text-vivant-navy font-medium text-sm">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-10 border-slate-300 focus:border-vivant-navy"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-slate-300" />
                  <span className="text-slate-600">Lembrar-me</span>
                </label>
                <a href="#" className="text-vivant-navy hover:underline">
                  Esqueci minha senha
                </a>
              </div>

              <Button
                type="submit"
                className="w-full h-10 bg-vivant-navy hover:bg-vivant-navy/90 text-white"
              >
                Entrar
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-500">ou</span>
              </div>
            </div>

            {/* App Download */}
            <div className="text-center space-y-3">
              <p className="text-xs text-slate-600">
                Baixe nosso aplicativo
              </p>
              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  className="border-2 border-vivant-navy text-vivant-navy hover:bg-vivant-navy hover:text-white text-xs h-8 px-3"
                  onClick={() => alert("Em breve disponível!")}
                >
                  <Apple className="w-4 h-4 mr-1" />
                  App Store
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-vivant-navy text-vivant-navy hover:bg-vivant-navy hover:text-white text-xs h-8 px-3"
                  onClick={() => alert("Em breve disponível!")}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Google Play
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Section */}
        <div className="space-y-4 text-center md:text-left">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-vivant-navy mb-3">
              Gerencie sua Propriedade
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Acesse ferramentas exclusivas para aproveitar ao máximo sua experiência Vivant
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-vivant-navy/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy text-base mb-0.5">
                  Calendário de Uso
                </h3>
                <p className="text-slate-600 text-sm">
                  Agende seus períodos e visualize disponibilidade em tempo real
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-vivant-navy/10 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy text-base mb-0.5">
                  Gestão Financeira
                </h3>
                <p className="text-slate-600 text-sm">
                  Acesse boletos, extratos e histórico de pagamentos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-vivant-gold/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-vivant-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy text-base mb-0.5">
                  Concierge Premium
                </h3>
                <p className="text-slate-600 text-sm">
                  Serviços exclusivos: transfer, alimentação e experiências únicas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-vivant-navy/10 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy text-base mb-0.5">
                  App Mobile
                </h3>
                <p className="text-slate-600 text-sm">
                  Gerencie tudo pelo celular, disponível para iOS e Android
                </p>
              </div>
            </div>
          </div>

          {/* Support Box */}
          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border-l-4 border-vivant-navy">
            <h4 className="font-semibold text-vivant-navy mb-1 text-sm">
              Suporte 24/7
            </h4>
            <p className="text-xs text-slate-600">
              Nossa equipe está sempre disponível para garantir que sua experiência seja impecável.
            </p>
            <p className="text-xs text-vivant-navy font-medium mt-2">
              care@vivant.com.br | (11) 9999-9999
            </p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
