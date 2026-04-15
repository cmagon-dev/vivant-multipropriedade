"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CalendarRange, FileSpreadsheet, Loader2 } from "lucide-react";
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

const base = "/admin/vivant-care/propriedades";

export default function PlanejamentoSemanasPage() {
  const params = useParams();
  const id = params.id as string;
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
  const [publishing, setPublishing] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [tierFilterInclude, setTierFilterInclude] = useState<string[]>(() => [
    ...ALL_PLANNING_TIER_KEYS,
  ]);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/propriedades/${id}/weeks?year=${year}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setWeeks((d?.weeks as AdminCalendarWeek[]) ?? []);
        setCalendarYear(d?.calendarYear ?? null);
      })
      .finally(() => setLoading(false));
  }, [id, year]);

  useEffect(() => {
    load();
  }, [load]);

  const gerarQuinta = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${id}/weeks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generate: { year, pattern: "THU_TO_WED", weightDefault: 1 },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(
          `${data.count ?? 0} semanas geradas (quinta a quarta). Edite nomes e temporadas no calendário.`
        );
        setWeeks((data.weeks as AdminCalendarWeek[]) ?? []);
        if (data.calendarYear) {
          setCalendarYear({
            id: data.calendarYear.id,
            year: data.calendarYear.year,
            status: data.calendarYear.status,
            label: null,
          });
        }
        router.refresh();
      } else {
        toast.error(data.error || "Erro ao gerar");
      }
    } catch {
      toast.error("Erro ao gerar semanas");
    } finally {
      setGenerating(false);
    }
  };

  const abrirSemana = (w: AdminCalendarWeek) => {
    setSelected(w);
    setDialogOpen(true);
  };

  const publicarCalendario = async () => {
    if (!calendarYear?.id) {
      toast.error("Gere as semanas antes de publicar.");
      return;
    }
    setPublishing(true);
    try {
      const res = await fetch(
        `/api/admin/propriedades/${id}/calendar-years/${calendarYear.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "PUBLISHED" }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Calendário publicado. Cotistas passam a ver este ano.");
        setCalendarYear(data.calendarYear ?? { ...calendarYear, status: "PUBLISHED" });
      } else {
        toast.error(data.error || "Erro ao publicar");
      }
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href={`${base}/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold text-vivant-navy">
            <CalendarRange className="h-8 w-8" />
            Planejamento de semanas
          </h1>
          <p className="mt-1 text-gray-600">
            Calendário oficial da casa — semanas pré-definidas (quinta → quarta). Clique em um dia
            para editar tipo, classificação (Gold/Silver/Black), peso e bloqueios. Publique o ano
            para liberar no portal do cotista.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ano e geração</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
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
              {generating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
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
              propertyId={id}
              year={year}
              hasCalendar={!!calendarYear}
              onDeleted={() => {
                load();
                router.refresh();
              }}
            />
          </div>
          <p className="text-sm text-gray-600">
            Semanas cadastradas: <strong>{loading ? "…" : weeks.length}</strong>
            {calendarYear ? (
              <>
                {" "}
                · Status: <strong>{calendarYear.status}</strong>
              </>
            ) : null}
          </p>
          <Button
            type="button"
            variant="secondary"
            disabled={publishing || !calendarYear?.id || calendarYear.status === "PUBLISHED"}
            onClick={() => void publicarCalendario()}
          >
            {publishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Publicar calendário ({year})
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calendário {year}</CardTitle>
          <CalendarWeekLegend
            showFilters
            showStatusSection={false}
            tierFilterInclude={tierFilterInclude}
            onTierFilterIncludeChange={setTierFilterInclude}
          />
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-vivant-green" />
            </div>
          ) : weeks.length === 0 ? (
            <p className="text-center text-gray-600">
              Nenhuma semana para {year}. Gere o grid quinta–quarta ou use &quot;Importar calendário&quot;.
            </p>
          ) : (
            <PropertyYearCalendar
              year={year}
              weeks={weeks}
              onSelectWeek={abrirSemana}
              tierFilterInclude={tierFilterInclude}
              showOperationalStatus={false}
            />
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-gray-500">
        Depois de ajustar o calendário, use{" "}
        <Link
          className="font-medium text-vivant-navy underline"
          href={`${base}/${id}/distribuir-semanas`}
        >
          Distribuir semanas
        </Link>{" "}
        para alocar cotistas (com simulação por peso).
      </p>

      <EditPropertyWeekDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        propertyId={id}
        week={selected}
        onSaved={load}
      />

      <CalendarImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        propertyId={id}
        defaultYear={year}
        onImported={() => {
          load();
          router.refresh();
        }}
      />
    </div>
  );
}
