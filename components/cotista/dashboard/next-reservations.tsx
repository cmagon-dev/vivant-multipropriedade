"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Reservation {
  id: string;
  weekIndex: number;
  dataInicio: string;
  dataFim: string;
  status: string;
  property: {
    name: string;
    location: string;
  };
}

export function NextReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReservations() {
      try {
        const response = await fetch("/api/cotistas/me/reservas?upcoming=true&limit=3");
        if (response.ok) {
          const data = await response.json();
          setReservations(data.reservas || []);
        }
      } catch (error) {
        console.error("Erro ao carregar reservas:", error);
      } finally {
        setLoading(false);
      }
    }

    loadReservations();
  }, []);

  const getStatusBadge = (status: string) => {
    const configs = {
      PENDENTE: { label: "Pendente", color: "bg-orange-100 text-orange-700", icon: AlertCircle },
      CONFIRMADA: { label: "Confirmada", color: "bg-vivant-green/20 text-vivant-green", icon: CheckCircle2 },
      EM_USO: { label: "Em Uso", color: "bg-blue-100 text-blue-700", icon: CheckCircle2 },
    };
    return configs[status as keyof typeof configs] || configs.PENDENTE;
  };

  if (loading) {
    return (
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-[#1A2F4B]">Próximas Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-serif text-[#1A2F4B]">Próximas Reservas</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/calendario">Ver todas</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-[#1A2F4B]/60">Nenhuma reserva próxima</p>
            <Button asChild size="sm" className="mt-4">
              <Link href="/dashboard/calendario">Ver Calendário</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map((reservation) => {
              const statusBadge = getStatusBadge(reservation.status);
              const StatusIcon = statusBadge.icon;

              return (
                <div
                  key={reservation.id}
                  className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <div className="w-10 h-10 bg-vivant-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-vivant-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-[#1A2F4B] text-sm">
                        Semana {reservation.weekIndex}
                      </p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusBadge.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusBadge.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#1A2F4B]/60 mb-1">
                      {format(new Date(reservation.dataInicio), "dd MMM", { locale: ptBR })} - {format(new Date(reservation.dataFim), "dd MMM yyyy", { locale: ptBR })}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-[#1A2F4B]/70">
                      <MapPin className="w-3 h-3" />
                      <span>{reservation.property.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
