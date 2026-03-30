"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CalendarDays, ArrowRightLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CotaWeekDatesLines,
  type SemanaAlocadaItem,
} from "@/components/cotista/cota-week-dates";

type Row = {
  cotaId: string;
  propertyId: string;
  propertyName: string;
  numeroCota: string;
  semanasAlocadas: SemanaAlocadaItem[];
};

export default function MinhasSemanasPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);
  const [anoSemanas, setAnoSemanas] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/cotistas/me/cotas", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { cotas: [] }))
      .then((d) => {
        setAnoSemanas(
          typeof d.anoSemanasAlocadas === "number"
            ? d.anoSemanasAlocadas
            : new Date().getFullYear()
        );
        const list = (d.cotas ?? []) as Array<{
          id: string;
          numeroCota: string;
          semanasAlocadas?: SemanaAlocadaItem[];
          property?: { id: string; name: string };
        }>;
        setRows(
          list
            .filter((c) => c.property?.id)
            .map((c) => ({
              cotaId: c.id,
              propertyId: c.property!.id,
              propertyName: c.property!.name,
              numeroCota: c.numeroCota,
              semanasAlocadas: c.semanasAlocadas ?? [],
            }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B]">
            Minhas semanas
          </h1>
          <p className="text-[#1A2F4B]/70">
            Por cota: nome da semana e intervalo de datas (calendário oficial da casa).{" "}
            {anoSemanas != null && (
              <span className="text-[#1A2F4B]/85">
                Referência: ano <strong>{anoSemanas}</strong>.
              </span>
            )}
          </p>
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
          <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-[#1A2F4B]/70">
            Nenhuma cota ativa.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-1">
          {rows.map((row) => (
            <Card key={row.cotaId} className="border border-slate-200 shadow-md">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="w-8 h-8 text-vivant-green flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1A2F4B]">{row.propertyName}</p>
                      <p className="text-sm font-medium text-vivant-green">{row.numeroCota}</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-2">
                  <CotaWeekDatesLines
                    items={row.semanasAlocadas}
                    anoReferencia={anoSemanas}
                    maxItems={8}
                  />
                </div>
                <div className="pt-1 border-t border-slate-100">
                  <Button asChild className="w-full sm:w-auto bg-vivant-green hover:bg-vivant-green/90">
                    <Link href={`/dashboard/minhas-semanas/${row.propertyId}`}>
                      Ver completo
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
