"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarRange, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  PropertyYearCalendar,
  type AdminCalendarWeek,
} from "@/components/admin/vivant-care/property-year-calendar";
import { EditPropertyWeekDialog } from "@/components/admin/vivant-care/edit-property-week-dialog";
import { CalendarImportDialog } from "@/components/admin/vivant-care/calendar-import-dialog";
import { DeleteCalendarYearControl } from "@/components/admin/vivant-care/delete-calendar-year-control";
import { CalendarWeekLegend } from "@/components/admin/vivant-care/calendar-week-legend";
import { ALL_PLANNING_TIER_KEYS } from "@/lib/vivant/admin-week-visual";

export function PlanejamentoSemanasPanel({ propertyId }: { propertyId: string }) {
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [weeks, setWeeks] = useState<AdminCalendarWeek[]>([]);
  const [calendarYear, setCalendarYear] = useState<{
    id: string;
    year: number;
    status: string;
    label: string | null;
  } | null>(null);
  const [selected, setSelected] = useState<AdminCalendarWeek | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [tierFilterInclude, setTierFilterInclude] = useState<string[]>(() => [
    ...ALL_PLANNING_TIER_KEYS,
  ]);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/propriedades/${propertyId}/weeks?year=${year}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setWeeks((d?.weeks as AdminCalendarWeek[]) ?? []);
        setCalendarYear(d?.calendarYear ?? null);
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
        if (data.calendarYear) {
          setCalendarYear({
            id: data.calendarYear.id,
            year: data.calendarYear.year,
            status: data.calendarYear.status,
            label: null,
          });
        }
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
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label>Ano</Label>
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10) || year)}
              className="w-32"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              className="bg-vivant-green hover:bg-vivant-green/90"
              disabled={generating}
              onClick={() => void gerarQuinta()}
            >
              {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Gerar semanas (quinta → quarta)
            </Button>
            <Button
              type="button"
              variant="outline"
              className="shrink-0 border-2 border-vivant-navy bg-white font-semibold text-vivant-navy shadow-sm hover:bg-vivant-navy/5"
              onClick={() => setImportOpen(true)}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4 shrink-0" />
              Importar calendário
            </Button>
            <DeleteCalendarYearControl
              propertyId={propertyId}
              year={year}
              hasCalendar={!!calendarYear}
              onDeleted={() => {
                load();
                router.refresh();
              }}
            />
          </div>
          <p className="text-sm text-gray-600 min-w-[12rem]">
            Semanas cadastradas: <strong>{loading ? "…" : weeks.length}</strong>
            {calendarYear ? (
              <>
                {" "}
                · Status: <strong>{calendarYear.status}</strong>
              </>
            ) : null}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-vivant-green" />
          </div>
        ) : weeks.length === 0 ? (
          <p className="text-center text-gray-600">
            Nenhuma semana para {year}. Gere o grid quinta–quarta ou use &quot;Importar calendário&quot;.
          </p>
        ) : (
          <div className="space-y-4">
            <CalendarWeekLegend
              variant="compact"
              showFilters
              showStatusSection={false}
              tierFilterInclude={tierFilterInclude}
              onTierFilterIncludeChange={setTierFilterInclude}
            />
            <PropertyYearCalendar
              year={year}
              weeks={weeks}
              onSelectWeek={(w) => {
                setSelected(w);
                setDialogOpen(true);
              }}
              tierFilterInclude={tierFilterInclude}
              showOperationalStatus={false}
            />
          </div>
        )}

        <EditPropertyWeekDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          propertyId={propertyId}
          week={selected}
          onSaved={load}
        />

        <CalendarImportDialog
          open={importOpen}
          onOpenChange={setImportOpen}
          propertyId={propertyId}
          defaultYear={year}
          onImported={() => {
            load();
            router.refresh();
          }}
        />
      </CardContent>
    </Card>
  );
}
