"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  Home
} from "lucide-react";
import { WeekInfo } from "@/lib/calendar-rotation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { ReservationModal } from "./reservation-modal";

interface WeekCardProps {
  week: WeekInfo;
  status: "available" | "reserved" | "confirmed" | "in-use" | "past" | "not-yours";
  reservation?: any;
  cotaId: string;
}

const statusConfig = {
  available: {
    label: "Disponível",
    color: "bg-vivant-green/10 border-vivant-green/30",
    textColor: "text-vivant-green",
    icon: CheckCircle2,
    iconColor: "text-vivant-green"
  },
  reserved: {
    label: "Reservada",
    color: "bg-orange-100 border-orange-300",
    textColor: "text-orange-700",
    icon: Clock,
    iconColor: "text-orange-600"
  },
  confirmed: {
    label: "Confirmada",
    color: "bg-blue-100 border-blue-300",
    textColor: "text-blue-700",
    icon: CheckCircle2,
    iconColor: "text-blue-600"
  },
  "in-use": {
    label: "Em Uso",
    color: "bg-purple-100 border-purple-300",
    textColor: "text-purple-700",
    icon: Home,
    iconColor: "text-purple-600"
  },
  past: {
    label: "Finalizada",
    color: "bg-slate-100 border-slate-300",
    textColor: "text-slate-600",
    icon: CheckCircle2,
    iconColor: "text-slate-500"
  },
  "not-yours": {
    label: "Indisponível",
    color: "bg-slate-50 border-slate-200",
    textColor: "text-slate-400",
    icon: XCircle,
    iconColor: "text-slate-400"
  }
};

export function WeekCard({ week, status, reservation, cotaId }: WeekCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <>
      <Card 
        className={`border-2 ${config.color} hover:shadow-lg transition-all cursor-pointer`}
        onClick={() => (status === "available" || status === "reserved") && setModalOpen(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${config.color} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} ${config.textColor}`}>
              {config.label}
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className={`w-4 h-4 ${config.iconColor}`} />
              <span className={`text-sm font-bold ${config.textColor}`}>
                Semana {week.number}
              </span>
            </div>
            
            <p className="text-xs text-[#1A2F4B]/70">
              {format(week.startDate, "dd MMM", { locale: ptBR })} - {format(week.endDate, "dd MMM", { locale: ptBR })}
            </p>

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
          cotaId={cotaId}
          reservation={reservation}
        />
      )}
    </>
  );
}
