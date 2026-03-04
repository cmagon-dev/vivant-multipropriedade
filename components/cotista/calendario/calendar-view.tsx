"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { WeekCard } from "./week-card";
import { calculateWeeksForYear, getAllWeeksForYear, getWeekStatus } from "@/lib/calendar-rotation";

interface CalendarViewProps {
  cotaId: string;
  propertyId: string;
}

export function CalendarView({ cotaId, propertyId }: CalendarViewProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [cotaWeeks, setCotaWeeks] = useState<number[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCalendarData() {
      setLoading(true);
      try {
        const [cotaResponse, reservasResponse] = await Promise.all([
          fetch(`/api/cotistas/cotas/${cotaId}`),
          fetch(`/api/cotistas/me/reservas?ano=${currentYear}`)
        ]);

        if (cotaResponse.ok && reservasResponse.ok) {
          const cotaData = await cotaResponse.json();
          const reservasData = await reservasResponse.json();

          const weeks = calculateWeeksForYear(
            cotaData.semanasConfig,
            currentYear
          );

          setCotaWeeks(weeks);
          setReservations(reservasData.reservas || []);
        }
      } catch (error) {
        console.error("Erro ao carregar calendário:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCalendarData();
  }, [cotaId, currentYear]);

  const allWeeks = getAllWeeksForYear(currentYear);
  
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  const weeksByMonth = months.map((month, monthIndex) => {
    const monthWeeks = allWeeks.filter(week => {
      const weekMonth = week.startDate.getMonth();
      return weekMonth === monthIndex;
    });
    return { month, weeks: monthWeeks };
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-slate-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-[#1A2F4B]">
          Calendário {currentYear}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentYear(currentYear - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="px-4 py-2 bg-vivant-green/10 text-vivant-green font-semibold rounded-lg">
            {currentYear}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentYear(currentYear + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6">
        <Card className="border-none shadow-lg p-4 bg-gradient-to-r from-vivant-green/10 to-teal-50">
          <div className="flex items-start gap-3">
            <CalendarIcon className="w-6 h-6 text-vivant-green flex-shrink-0" />
            <div>
              <p className="font-semibold text-[#1A2F4B] mb-1">Suas Semanas em {currentYear}</p>
              <div className="flex flex-wrap gap-2">
                {cotaWeeks.sort((a, b) => a - b).map(week => (
                  <span key={week} className="px-3 py-1 bg-vivant-green text-white rounded-full text-sm font-medium">
                    {week}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {weeksByMonth.map(({ month, weeks }) => {
        const cotaWeeksInMonth = weeks.filter(w => cotaWeeks.includes(w.number));
        
        if (cotaWeeksInMonth.length === 0) {
          return null;
        }

        return (
          <div key={month} className="space-y-3">
            <h3 className="text-lg font-semibold text-[#1A2F4B] px-2">{month}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cotaWeeksInMonth.map(week => (
                <WeekCard
                  key={week.number}
                  week={week}
                  status={getWeekStatus(week.number, cotaWeeks, reservations)}
                  reservation={reservations.find(r => r.numeroSemana === week.number)}
                  cotaId={cotaId}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
