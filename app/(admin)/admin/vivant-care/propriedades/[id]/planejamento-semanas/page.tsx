"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CalendarRange, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  PropertyYearCalendar,
  type AdminCalendarWeek,
} from "@/components/admin/vivant-care/property-year-calendar";
import { EditPropertyWeekDialog } from "@/components/admin/vivant-care/edit-property-week-dialog";

const base = "/admin/vivant-care/propriedades";

export default function PlanejamentoSemanasPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [weeks, setWeeks] = useState<AdminCalendarWeek[]>([]);
  const [selected, setSelected] = useState<AdminCalendarWeek | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/propriedades/${id}/weeks?year=${year}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setWeeks((d?.weeks as AdminCalendarWeek[]) ?? []);
      })
      .finally(() => setLoading(false));
  }, [id, year]);

  useEffect(() => {
    load();
  }, [load]);

  const gerarSabado = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${id}/weeks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          generate: { year, pattern: "SAT_TO_SAT", weightDefault: 1 },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success(
          `${data.count ?? 0} semanas geradas (sábado a sábado). Edite nomes e temporadas no calendário.`
        );
        setWeeks((data.weeks as AdminCalendarWeek[]) ?? []);
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
            Calendário oficial da casa — semanas pré-definidas (não há datas livres). Clique em um
            dia para editar nome, temporada, peso e bloqueios.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ano e geração</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
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
            onClick={() => void gerarSabado()}
          >
            {generating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Gerar semanas (sábado → sábado)
          </Button>
          <p className="text-sm text-gray-600">
            Semanas cadastradas: <strong>{loading ? "…" : weeks.length}</strong>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Calendário {year}</CardTitle>
          <p className="text-sm text-gray-500">
            Cores: cinza = baixa · branco = média · âmbar = alta · laranja = super alta · vermelho =
            bloqueada. Ponto vermelho no canto = feriado/data especial.
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-vivant-green" />
            </div>
          ) : weeks.length === 0 ? (
            <p className="text-center text-gray-600">
              Nenhuma semana para {year}. Gere o grid sábado–sábado ou importe via API.
            </p>
          ) : (
            <PropertyYearCalendar
              year={year}
              weeks={weeks}
              onSelectWeek={abrirSemana}
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
    </div>
  );
}
