"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

export type BulletItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type PublicMarketingShellProps = {
  /** Badge opcional acima do título (ex: "Acesso único Vivant") */
  badge?: React.ReactNode;
  /** Título da coluna esquerda */
  titleLeft: string;
  /** Subtítulo/parágrafo da coluna esquerda */
  subtitleLeft: string;
  /** Lista de bullets (ícone + título + descrição) */
  bulletsLeft: BulletItem[];
  /** Ícone do cabeçalho do card direito */
  rightCardIcon: LucideIcon;
  /** Título do card direito */
  rightCardTitle: string;
  /** Subtítulo do card direito */
  rightCardSubtitle: string;
  /** Conteúdo do card (form, wizard, etc.) */
  children: React.ReactNode;
  /** Variante de fundo da página */
  backgroundVariant?: "default" | "green";
  /** Variante do cabeçalho do card de login */
  cardHeaderVariant?: "dark" | "light";
};

/**
 * Layout premium reutilizado: login e captação.
 * Fundo degradê, logo no topo, coluna esquerda (copy + bullets), card à direita.
 */
export function PublicMarketingShell({
  badge,
  titleLeft,
  subtitleLeft,
  bulletsLeft,
  rightCardIcon: RightCardIcon,
  rightCardTitle,
  rightCardSubtitle,
  children,
  backgroundVariant = "default",
  cardHeaderVariant = "dark",
}: PublicMarketingShellProps) {
  const backgroundClass =
    backgroundVariant === "green"
      ? "min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900"
      : "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-vivant-navy";

  const cardHeaderClass =
    cardHeaderVariant === "light"
      ? "bg-white border-b border-gray-200 p-8 text-center"
      : "bg-gradient-to-br from-vivant-navy to-slate-800 p-8 text-center";
  const cardHeaderTitleClass = cardHeaderVariant === "light" ? "text-gray-900" : "text-white";
  const cardHeaderSubtitleClass = cardHeaderVariant === "light" ? "text-gray-600" : "text-white/90";

  return (
    <div className={backgroundClass}>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="py-2">
              <a href="/">
                <img
                  src="/logo-vivant.png"
                  alt="Vivant"
                  className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 text-center md:text-left order-2 md:order-1">
              {badge && <div className="flex justify-center md:justify-start">{badge}</div>}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                  {titleLeft}
                </h1>
                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  {subtitleLeft}
                </p>
              </div>
              <div className="space-y-4 pt-4">
                {bulletsLeft.map((item, i) => {
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
                <div className={cardHeaderClass}>
                  <div className="inline-flex justify-center w-16 h-16 bg-vivant-gold/20 backdrop-blur-sm rounded-full mb-4">
                    <RightCardIcon className="w-8 h-8 text-vivant-gold" />
                  </div>
                  <h2 className={`text-2xl sm:text-3xl font-serif font-bold mb-2 ${cardHeaderTitleClass}`}>
                    {rightCardTitle}
                  </h2>
                  <p className={`text-sm ${cardHeaderSubtitleClass}`}>{rightCardSubtitle}</p>
                </div>
                <CardContent className="p-6 sm:p-8">{children}</CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-vivant-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-vivant-navy/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
