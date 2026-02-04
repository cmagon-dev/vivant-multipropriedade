"use client";

import { Lock, Smartphone, Calendar, FileText, Sparkles, Download, Apple } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PortalCotistaPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Login Card */}
        <Card className="border-none shadow-2xl bg-white">
          <div className="p-8 md:p-12">
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-vivant-navy/10 rounded-full mb-4">
                <Lock className="w-8 h-8 text-vivant-navy" />
              </div>
              <h1 className="text-3xl font-serif font-bold text-vivant-navy mb-2">
                Portal do Cotista
              </h1>
              <p className="text-slate-600">
                Acesse sua área exclusiva
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-vivant-navy font-medium">
                  E-mail ou CPF
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="seu@email.com"
                  className="h-12 border-slate-300 focus:border-vivant-navy"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-vivant-navy font-medium">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 border-slate-300 focus:border-vivant-navy"
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
                className="w-full h-12 bg-vivant-navy hover:bg-vivant-navy/90 text-white text-lg"
              >
                Entrar
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-slate-500">ou</span>
              </div>
            </div>

            {/* App Download */}
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-600">
                Baixe nosso aplicativo
              </p>
              <div className="flex gap-3 justify-center">
                <Button
                  variant="outline"
                  className="border-2 border-vivant-navy text-vivant-navy hover:bg-vivant-navy hover:text-white"
                  onClick={() => alert("Em breve disponível!")}
                >
                  <Apple className="w-5 h-5 mr-2" />
                  App Store
                </Button>
                <Button
                  variant="outline"
                  className="border-2 border-vivant-navy text-vivant-navy hover:bg-vivant-navy hover:text-white"
                  onClick={() => alert("Em breve disponível!")}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Google Play
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Info Section */}
        <div className="space-y-6 text-center md:text-left">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-vivant-navy mb-4">
              Gerencie sua Propriedade
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed">
              Acesse ferramentas exclusivas para aproveitar ao máximo sua experiência Vivant
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-4 pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-vivant-navy/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy text-lg mb-1">
                  Calendário de Uso
                </h3>
                <p className="text-slate-600">
                  Agende seus períodos e visualize disponibilidade em tempo real
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-vivant-navy/10 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy text-lg mb-1">
                  Gestão Financeira
                </h3>
                <p className="text-slate-600">
                  Acesse boletos, extratos e histórico de pagamentos
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-vivant-gold/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-vivant-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy text-lg mb-1">
                  Concierge Premium
                </h3>
                <p className="text-slate-600">
                  Serviços exclusivos: transfer, alimentação e experiências únicas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-vivant-navy/10 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy text-lg mb-1">
                  App Mobile
                </h3>
                <p className="text-slate-600">
                  Gerencie tudo pelo celular, disponível para iOS e Android
                </p>
              </div>
            </div>
          </div>

          {/* Support Box */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-lg border-l-4 border-vivant-navy">
            <h4 className="font-semibold text-vivant-navy mb-2">
              Suporte 24/7
            </h4>
            <p className="text-sm text-slate-600">
              Nossa equipe está sempre disponível para garantir que sua experiência seja impecável.
            </p>
            <p className="text-sm text-vivant-navy font-medium mt-3">
              care@vivant.com.br | (11) 9999-9999
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
