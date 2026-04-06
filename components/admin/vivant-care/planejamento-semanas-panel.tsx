"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarRange, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  PropertyYearCalendar,
  type AdminCalendarWeek,
} from "@/components/admin/vivant-care/property-year-calendar";
import { EditPropertyWeekDialog } from "@/components/admin/vivant-care/edit-property-week-dialog";

export function PlanejamentoSemanasPanel({ propertyId }: { propertyId: string }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [weeks, setWeeks] = useState<AdminCalendarWeek[]>([]);
  const [selected, setSelected] = useState<AdminCalendarWeek | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/propriedades/${propertyId}/weeks?year=${year}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setWeeks((d?.weeks as AdminCalendarWeek[]) ?? []);
      })
      .finally(() => setLoading(false));
  }, [propertyId, year]);

  useEffect(() => {
    load();
  }, [load]);

  const gerarQuinta = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${propertyId}/weeks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generate: { year, pattern: "THU_TO_WED", weightDefault: 1 },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(`${data.count ?? 0} semanas geradas (quinta a quarta).`);
        setWeeks((data.weeks as AdminCalendarWeek[]) ?? []);
      } else {
        toast.error(data.error || "Erro ao gerar");
      }
    } catch {
      toast.error("Erro ao gerar semanas");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarRange className="h-5 w-5 text-vivant-navy" />
          Planejamento de semanas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-2">
            <Label>Ano</Label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10) || year)}
              className="w-32"
            />
          </div>
          <Button
            type="button"
            className="bg-vivant-green hover:bg-vivant-green/90"
            disabled={generating}
            onClick={() => void gerarQuinta()}
          >
            {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Gerar semanas (quinta → quarta)
          </Button>
          <p className="text-sm text-gray-600">
            Semanas cadastradas: <strong>{loading ? "…" : weeks.length}</strong>
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-vivant-green" />
          </div>
        ) : weeks.length === 0 ? (
          <p className="text-center text-gray-600">Nenhuma semana para {year}. Gere o grid quinta–quarta.</p>
        ) : (
          <PropertyYearCalendar year={year} weeks={weeks} onSelectWeek={(w) => { setSelected(w); setDialogOpen(true); }} />
        )}

        <EditPropertyWeekDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          propertyId={propertyId}
          week={selected}
          onSaved={load}
        />
      </CardContent>
    </Card>
  );
}
