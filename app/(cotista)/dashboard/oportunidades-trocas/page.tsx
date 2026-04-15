"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { weekDisplayName } from "@/lib/vivant/week-ui-labels";

export default function OportunidadesTrocasPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<
    Array<{
      id: string;
      createdAt: string;
      property: { name: string };
      cotista: { name: string };
      ownedWeek: {
        description: string | null;
        weekIndex: number;
        startDate: string;
        endDate: string;
      };
    }>
  >([]);

  useEffect(() => {
    fetch("/api/cotistas/me/trocas-oportunidades", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { oportunidades: [] }))
      .then((d) => setRows(d.oportunidades ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2 flex items-center gap-2">
          <Sparkles className="w-8 h-8 text-amber-500" />
          Oportunidades
        </h1>
        <p className="text-[#1A2F4B]/70">
          Trocas publicadas pela administração na sua casa — apenas cotistas do mesmo imóvel veem estas oportunidades.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-[#1A2F4B]/70">
            Nenhuma oportunidade publicada no momento.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id} className="border border-amber-200/60 bg-amber-50/40">
              <CardContent className="py-4 px-5">
                <p className="font-semibold text-[#1A2F4B]">{r.property.name}</p>
                <p className="text-sm text-[#1A2F4B]/80 mt-1">
                  Oferta de {r.cotista.name}:{" "}
                  {weekDisplayName(r.ownedWeek.description, r.ownedWeek.weekIndex)}
                </p>
                <p className="text-xs text-[#1A2F4B]/60 mt-0.5">
                  {format(new Date(r.ownedWeek.startDate), "dd/MM/yyyy", { locale: ptBR })} —{" "}
                  {format(new Date(r.ownedWeek.endDate), "dd/MM/yyyy", { locale: ptBR })}
                </p>
                <p className="text-xs text-[#1A2F4B]/50 mt-2">
                  Publicado em{" "}
                  {format(new Date(r.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </p>
              </CardContent>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
