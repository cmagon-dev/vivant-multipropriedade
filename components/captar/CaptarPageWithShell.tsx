"use client";

import { Building2, TrendingUp, PieChart, BookOpen } from "lucide-react";
import { Shield } from "lucide-react";
import { ClipboardList } from "lucide-react";
import { PublicMarketingShell } from "@/components/public/PublicMarketingShell";
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
    <PublicMarketingShell
      badge={
        <div className="inline-flex items-center gap-2 bg-vivant-gold/20 backdrop-blur-sm border border-vivant-gold/30 rounded-full px-4 sm:px-6 py-2 sm:py-3">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-vivant-gold" />
          <span className="text-vivant-gold text-sm sm:text-base font-semibold">
            Cadastro rápido
          </span>
        </div>
      }
      titleLeft="Cadastre seu interesse"
      subtitleLeft="Escolha o tipo e envie seus dados. Nossa equipe retorna no WhatsApp."
      bulletsLeft={CAPTAR_BULLETS}
      rightCardIcon={ClipboardList}
      rightCardTitle="Cadastro rápido"
      rightCardSubtitle="Etapa 1 de 3 — preencha em poucos passos"
    >
      <CaptarWizard presetType={presetType ?? undefined} embedded />
    </PublicMarketingShell>
  );
}
