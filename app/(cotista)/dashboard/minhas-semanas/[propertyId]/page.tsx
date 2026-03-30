"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarWeekPicker } from "@/components/cotista/calendar-week-picker";

type Week = {
  id: string;
  weekIndex: number;
  label: string | null;
  startDate: string;
  endDate: string;
  seasonType: string;
  weight: string;
  isBlocked: boolean;
  isExchangeAllowed: boolean;
  color: string | null;
};

export default function MinhasSemanasPropertyPage() {
  const params = useParams();
  const propertyId = params.propertyId as string;
  const year = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [propertyName, setPropertyName] = useState("");
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [mine, setMine] = useState<string[]>([]);
  const [oppWeekIds, setOppWeekIds] = useState<string[]>([]);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyId) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const [rCotas, rOp] = await Promise.all([
          fetch("/api/cotistas/me/cotas", { credentials: "include" }),
          fetch("/api/cotistas/me/trocas-oportunidades", {
            credentials: "include",
          }),
        ]);
        const jCotas = rCotas.ok ? await rCotas.json() : { cotas: [] };
        const jOp = rOp.ok ? await rOp.json() : { oportunidades: [] };

        const cotas = (jCotas.cotas ?? []) as Array<{
          id: string;
          property?: { id: string; name: string };
        }>;
        const matches = cotas.filter((c) => c.property?.id === propertyId);
        if (cancelled) return;
        if (matches.length === 0 || !matches[0].property) {
          setPropertyName("");
          setWeeks([]);
          setMine([]);
          return;
        }
        setPropertyName(matches[0].property.name);

        const oppRows = (jOp.oportunidades ?? []) as Array<{
          property?: { id: string };
          ownedWeek?: { id: string };
        }>;
        setOppWeekIds(
          oppRows
            .filter((o) => o.property?.id === propertyId)
            .map((o) => o.ownedWeek?.id)
            .filter((id): id is string => !!id)
        );

        const results = await Promise.all(
          matches.map((c) =>
            fetch(
              `/api/cotistas/me/property-weeks?propertyId=${encodeURIComponent(propertyId)}&cotaId=${encodeURIComponent(c.id)}&year=${year}`,
              { credentials: "include" }
            ).then((r) => (r.ok ? r.json() : null))
          )
        );
        if (cancelled) return;
        const first = results.find((x) => x?.weeks?.length);
        setWeeks(first?.weeks ?? results[0]?.weeks ?? []);
        const mineSet = new Set<string>();
        for (const j of results) {
          for (const id of j?.myPropertyWeekIds ?? []) mineSet.add(id);
        }
        setMine(Array.from(mineSet));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [propertyId, year]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <Button asChild variant="ghost" size="icon" className="shrink-0">
            <Link href="/dashboard/minhas-semanas">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1A2F4B] sm:text-2xl">
              {propertyName || "Minhas semanas"} · {year}
            </h1>
            <p className="text-sm text-[#1A2F4B]/70">
              Toque em um dia: a seleção é sempre a <strong>semana inteira</strong>, com nome e
              temporada — não há escolha de datas soltas.
            </p>
          </div>
        </div>
        <Button
          asChild
          className="shrink-0 w-full sm:w-auto bg-vivant-green hover:bg-vivant-green/90 gap-2"
        >
          <Link href="/dashboard/trocas">
            <ArrowRightLeft className="h-4 w-4" />
            Troca de semanas
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-vivant-green" />
        </div>
      ) : !propertyName ? (
        <Card>
          <CardContent className="py-10 text-center text-[#1A2F4B]/70">
            Propriedade não encontrada nas suas cotas.
          </CardContent>
        </Card>
      ) : weeks.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-[#1A2F4B]/70">
            O administrador ainda não publicou o planejamento de semanas para este imóvel.
          </CardContent>
        </Card>
      ) : (
        <Card className="border-slate-200 shadow-md">
          <CardContent className="p-4 sm:p-6">
            <CalendarWeekPicker
              year={year}
              weeks={weeks}
              myWeekIds={mine}
              opportunityWeekIds={oppWeekIds}
              propertyName={propertyName}
              selectedWeekId={selectedWeekId}
              onSelectWeek={setSelectedWeekId}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
