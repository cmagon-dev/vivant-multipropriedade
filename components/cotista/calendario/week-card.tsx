"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Clock, XCircle, Home } from "lucide-react";
import type {
  CotistaOfficialWeek,
  CotistaWeekReservation,
  WeekCardStatus,
} from "@/lib/vivant/cotista-calendar-types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { ReservationModal } from "./reservation-modal";
import { weekDisplayName, TIER_SHORT_PT } from "@/lib/vivant/week-ui-labels";
import { tierCardSurfaceClass } from "@/lib/vivant/admin-week-visual";

interface WeekCardProps {
  week: CotistaOfficialWeek;
  year: number;
  status: WeekCardStatus;
  reservation?: CotistaWeekReservation;
  cotaId: string;
}

const statusConfig: Record<
  WeekCardStatus,
  {
    badgeText: string;
    color: string;
    textColor: string;
    icon: typeof CheckCircle2;
    iconColor: string;
  }
> = {
  available: {
    badgeText: "Disponível",
    color: "bg-vivant-green/10 border-vivant-green/30",
    textColor: "text-vivant-green",
    icon: CheckCircle2,
    iconColor: "text-vivant-green",
  },
  reserved: {
    badgeText: "Reservada",
    color: "bg-orange-100 border-orange-300",
    textColor: "text-orange-700",
    icon: Clock,
    iconColor: "text-orange-600",
  },
  confirmed: {
    badgeText: "Confirmada",
    color: "bg-blue-100 border-blue-300",
    textColor: "text-blue-700",
    icon: CheckCircle2,
    iconColor: "text-blue-600",
  },
  "in-use": {
    badgeText: "Em Uso",
    color: "bg-purple-100 border-purple-300",
    textColor: "text-purple-700",
    icon: Home,
    iconColor: "text-purple-600",
  },
  past: {
    badgeText: "Finalizada",
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-600",
    icon: CheckCircle2,
    iconColor: "text-slate-500",
  },
  "not-yours": {
    badgeText: "Indisponível",
    color: "bg-slate-50 border-slate-200",
    textColor: "text-slate-400",
    icon: XCircle,
    iconColor: "text-slate-400",
  },
};

export function WeekCard({ week, year, status, reservation, cotaId }: WeekCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const config = statusConfig[status];
  const Icon = config.icon;
  const start = new Date(week.startDate);
  const end = new Date(week.endDate);

  return (
    <>
      <Card
        className={`border-2 ${tierCardSurfaceClass(week.tier)} hover:shadow-lg transition-all cursor-pointer`}
        onClick={() =>
          (status === "available" || status === "reserved") && setModalOpen(true)
        }
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center border border-black/10 bg-black/5 dark:bg-white/10`}
            >
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium border shadow-sm ${config.color} ${config.textColor}`}
            >
              {config.badgeText}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 shrink-0 ${config.iconColor}`} />
              <span
                className={`text-sm font-bold line-clamp-2 ${
                  week.tier === "BLACK" ? "text-white" : "text-[#1A2F4B]"
                }`}
              >
                {weekDisplayName(week.description, week.weekIndex)}
              </span>
            </div>

            <p
              className={`text-xs ${
                week.tier === "BLACK" ? "text-white/80" : "text-[#1A2F4B]/70"
              }`}
            >
              {format(start, "dd MMM", { locale: ptBR })} - {format(end, "dd MMM", { locale: ptBR })}
            </p>
            {week.tier ? (
              <p
                className={`text-[10px] font-semibold ${
                  week.tier === "BLACK" ? "text-amber-200/90" : "text-[#1A2F4B]/80"
                }`}
              >
                Classe: {TIER_SHORT_PT[week.tier] ?? week.tier}
              </p>
            ) : null}
            {week.exchangeAllowed != null ? (
              <p className="text-[10px] text-[#1A2F4B]/60">
                Troca: {week.exchangeAllowed ? "sim" : "não"}
              </p>
            ) : null}

            {(status === "available" || status === "reserved") && (
              <Button
                size="sm"
                className="w-full mt-2 h-8 text-xs"
                variant={status === "available" ? "default" : "outline"}
              >
                {status === "available" ? "Reservar" : "Confirmar"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {modalOpen && (
        <ReservationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          week={week}
          year={year}
          cotaId={cotaId}
          reservation={reservation}
        />
      )}
    </>
  );
}
