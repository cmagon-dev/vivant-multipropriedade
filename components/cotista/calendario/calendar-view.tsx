"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { WeekCard } from "./week-card";
import type {
  CotistaOfficialWeek,
  CotistaWeekReservation,
} from "@/lib/vivant/cotista-calendar-types";
import { getOfficialWeekStatus } from "@/lib/vivant/cotista-calendar-types";

interface CalendarViewProps {
  cotaId: string;
  propertyId: string;
}

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export function CalendarView({ cotaId, propertyId }: CalendarViewProps) {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [myWeeks, setMyWeeks] = useState<CotistaOfficialWeek[]>([]);
  const [reservations, setReservations] = useState<CotistaWeekReservation[]>([]);
  const [calendarPublished, setCalendarPublished] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCalendarData() {
      setLoading(true);
      try {
        const [pwRes, reservasRes] = await Promise.all([
          fetch(
            `/api/cotistas/me/property-weeks?propertyId=${encodeURIComponent(propertyId)}&cotaId=${encodeURIComponent(cotaId)}&year=${currentYear}`
          ),
          fetch(`/api/cotistas/me/reservas?ano=${currentYear}`),
        ]);

        if (!pwRes.ok || !reservasRes.ok) {
          setMyWeeks([]);
          setReservations([]);
          setCalendarPublished(false);
          return;
        }

        const pwData = await pwRes.json();
        const reservasData = await reservasRes.json();

        setCalendarPublished(!!pwData.calendarPublished);

        const allWeeks = (pwData.weeks ?? []) as CotistaOfficialWeek[];
        const mine = new Set<string>((pwData.myPropertyWeekIds ?? []) as string[]);
        const allocated = allWeeks.filter((w) => mine.has(w.id));

        setMyWeeks(allocated);
        setReservations((reservasData.reservas ?? []) as CotistaWeekReservation[]);
      } catch (error) {
        console.error("Erro ao carregar calendário:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadCalendarData();
  }, [cotaId, propertyId, currentYear]);

  const resByWeekId = useMemo(() => {
    const m = new Map<string, CotistaWeekReservation>();
    for (const r of reservations) {
      m.set(r.propertyCalendarWeekId, r);
    }
    return m;
  }, [reservations]);

  const weeksByMonth = useMemo(() => {
    const sorted = [...myWeeks].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    return MONTHS.map((month, monthIndex) => ({
      month,
      weeks: sorted.filter((w) => new Date(w.startDate).getMonth() === monthIndex),
    }));
  }, [myWeeks]);

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

  if (!calendarPublished) {
    return (
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="py-8 text-center text-amber-900">
          <p className="font-medium">Calendário {currentYear} ainda não publicado</p>
          <p className="text-sm mt-1 text-amber-800">
            Quando a administração publicar o calendário oficial, suas semanas aparecerão aqui.
          </p>
        </CardContent>
      </Card>
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
              <p className="font-semibold text-[#1A2F4B] mb-1">Suas semanas em {currentYear}</p>
              {myWeeks.length === 0 ? (
                <p className="text-sm text-gray-600">
                  Nenhuma semana oficial atribuída à sua cota neste ano. Entre em contato com a
                  administração.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(myWeeks.map((w) => w.weekIndex)))
                    .sort((a, b) => a - b)
                    .map((idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-vivant-green text-white rounded-full text-sm font-medium"
                      >
                        {idx}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {weeksByMonth.map(({ month, weeks }) => {
        if (weeks.length === 0) return null;

        return (
          <div key={month} className="space-y-3">
            <h3 className="text-lg font-semibold text-[#1A2F4B] px-2">{month}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {weeks.map((week) => {
                const res = resByWeekId.get(week.id);
                const status = getOfficialWeekStatus(week, true, res);
                return (
                  <WeekCard
                    key={week.id}
                    week={week}
                    year={currentYear}
                    status={status}
                    reservation={res}
                    cotaId={cotaId}
                  />
                );
              })}
            </div>
          </div>
        );
      })}

      {myWeeks.length === 0 ? null : weeksByMonth.every((m) => m.weeks.length === 0) ? (
        <p className="text-center text-gray-600 py-8">Nenhuma semana com data neste ano.</p>
      ) : null}
    </div>
  );
}
