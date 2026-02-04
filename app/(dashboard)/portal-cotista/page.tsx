"use client";

import { Calendar, FileText, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PortalCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  iconColor: string;
}

const PORTAL_CARDS: PortalCard[] = [
  {
    id: "calendario",
    title: "Calendário de Uso",
    description: "Agende seus períodos de permanência e visualize disponibilidade em tempo real.",
    icon: <Calendar className="h-8 w-8" />,
    href: "/portal-cotista/calendario",
    iconColor: "text-vivant-navy",
  },
  {
    id: "extrato",
    title: "Meus Boletos/Extrato",
    description: "Acompanhe pagamentos, taxas de manutenção e histórico financeiro completo.",
    icon: <FileText className="h-8 w-8" />,
    href: "/portal-cotista/extrato",
    iconColor: "text-vivant-navy",
  },
  {
    id: "concierge",
    title: "Solicitar Concierge",
    description: "Serviços premium sob demanda: transfer, alimentação, experiências exclusivas.",
    icon: <Sparkles className="h-8 w-8" />,
    href: "/portal-cotista/concierge",
    iconColor: "text-vivant-gold",
  },
];

export default function PortalCotistaPage(): JSX.Element {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-vivant-navy mb-4">
          Portal do Cotista
        </h1>
        <p className="text-lg text-slate-600">
          Bem-vindo ao seu espaço exclusivo. Gerencie sua propriedade fracionada com elegância e simplicidade.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {PORTAL_CARDS.map((card) => (
          <Card
            key={card.id}
            className="group relative overflow-hidden border-slate-200 hover:border-vivant-navy transition-all duration-300 hover:shadow-lg"
          >
            <div className="p-8 space-y-4">
              {/* Icon */}
              <div className={`${card.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                {card.icon}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-vivant-navy">
                  {card.title}
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {card.description}
                </p>
              </div>

              {/* Action Button */}
              <Button
                className="w-full bg-vivant-navy hover:bg-vivant-navy/90 text-white transition-colors duration-300"
                onClick={() => {
                  // TODO: Implementar navegação real quando as rotas estiverem prontas
                  console.log(`Navegando para: ${card.href}`);
                }}
              >
                Acessar
              </Button>
            </div>

            {/* Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-vivant-navy/5 rounded-full -mr-16 -mt-16 group-hover:bg-vivant-navy/10 transition-colors duration-300" />
          </Card>
        ))}
      </div>

      {/* Info Footer */}
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-1 h-16 bg-vivant-navy rounded-full" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-vivant-navy">
              Suporte Premium
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Nossa equipe está disponível 24/7 para garantir que sua experiência seja impecável. 
              Entre em contato através do nosso atendimento exclusivo para cotistas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
