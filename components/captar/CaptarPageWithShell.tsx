"use client";

import { Building2, TrendingUp, PieChart, BookOpen, Shield, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { CaptarWizard } from "./CaptarWizard";

const CAPTAR_BULLETS = [
  { icon: Building2, title: "Quero fracionar meu imóvel", description: "Transforme seu imóvel em cotas" },
  { icon: TrendingUp, title: "Quero ser um Investidor Vivant", description: "Aporte ou empréstimo para obra" },
  { icon: PieChart, title: "Quero ser um Cliente Cotista", description: "Renda, férias ou investimento" },
  { icon: BookOpen, title: "Quero conhecer o modelo melhor", description: "Entenda como funciona o modelo Vivant" },
];

type Props = { presetType?: "IMOVEL" | "INVESTIDOR" | "COTISTA" | "MODELO" | null };

export function CaptarPageWithShell({ presetType }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-vivant-navy flex flex-col">
      <Navbar />

      <div className="min-h-screen flex flex-col pt-16 sm:pt-20">
        <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-10 items-center">

            <div className="space-y-6 text-center md:text-left order-2 md:order-1">
              <div className="flex justify-center md:justify-start">
                <div className="inline-flex items-center gap-2 bg-vivant-gold/20 backdrop-blur-sm border border-vivant-gold/30 rounded-full px-4 sm:px-6 py-2 sm:py-3">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-vivant-gold" />
                  <span className="text-vivant-gold text-sm sm:text-base font-semibold">Cadastro rápido</span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                  Cadastre seu interesse
                </h1>
                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  Escolha o tipo e envie seus dados. Nossa equipe retorna no WhatsApp.
                </p>
              </div>
              <div className="space-y-4 pt-2">
                {CAPTAR_BULLETS.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-vivant-gold/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-vivant-gold" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-white text-base mb-0.5">{item.title}</h3>
                        <p className="text-white/70 text-sm">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="order-1 md:order-2 w-full">
              <Card className="border-none shadow-2xl bg-white overflow-hidden w-full">
                <div className="bg-gradient-to-br from-vivant-navy to-slate-800 p-4 text-center">
                  <div className="inline-flex justify-center w-10 h-10 bg-vivant-gold/20 backdrop-blur-sm rounded-full mb-2">
                    <ClipboardList className="w-5 h-5 text-vivant-gold" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-serif font-bold mb-1 text-white">Cadastro rápido</h2>
                  <p className="text-xs text-white/90">Etapa 1 de 3 — preencha em poucos passos</p>
                </div>
                <CardContent className="p-4 sm:p-5">
                  <CaptarWizard presetType={presetType ?? undefined} embedded />
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
        </div>
      </div>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-vivant-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-vivant-navy/20 rounded-full blur-3xl" />
      </div>

      <Footer />
    </div>
  );
}
