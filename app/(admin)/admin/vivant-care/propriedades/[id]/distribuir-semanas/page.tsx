"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Loader2, Users, Link2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const base = "/admin/vivant-care/propriedades";

type Cota = {
  id: string;
  numeroCota: string;
  cotista: { name: string; email: string };
};

type Week = {
  id: string;
  weekIndex: number;
  label: string | null;
  startDate: string;
  endDate: string;
  weight?: string | number;
  isBlocked?: boolean;
};

type Cycle = {
  id: string;
  label: string;
  yearRef: number | null;
  status: string;
  allocations: Array<{
    id: string;
    cotaId: string;
    propertyWeekId: string;
    cota: { numeroCota: string; cotista: { name: string } };
    propertyWeek: {
      weekIndex: number;
      label: string | null;
      startDate: string;
      endDate: string;
    };
  }>;
};

export default function DistribuirSemanasPage() {
  const params = useParams();
  const id = params.id as string;
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [cotas, setCotas] = useState<Cota[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [cycleId, setCycleId] = useState<string>("");
  const [newCycleLabel, setNewCycleLabel] = useState("");
  const [pickWeekId, setPickWeekId] = useState<string>("");
  const [pickCotaId, setPickCotaId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewMetrics, setPreviewMetrics] = useState<{
    totalWeight: number;
    idealAverage: number;
    maxDelta: number;
    byCota: Array<{
      cotaId: string;
      weekCount: number;
      weightSum: number;
      deltaFromIdeal: number;
    }>;
  } | null>(null);
  const [previewNewCount, setPreviewNewCount] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(
        `/api/admin/propriedades/${id}/allocations?year=${year}`,
        { cache: "no-store" }
      );
      const d = r.ok ? await r.json() : null;
      if (!d) {
        toast.error("Erro ao carregar");
        return;
      }
      setCotas(d.cotas ?? []);
      setWeeks(d.weeks ?? []);
      const list = (d.cycles ?? []) as Cycle[];
      setCycles(list);
      setCycleId((prev) => {
        if (prev && list.some((c) => c.id === prev)) return prev;
        return list[0]?.id ?? "";
      });
      setPreviewMetrics(null);
      setPreviewNewCount(null);
    } finally {
      setLoading(false);
    }
  }, [id, year]);

  const simularDistribuicao = async () => {
    if (!cycleId) {
      toast.error("Selecione um ciclo");
      return;
    }
    setPreviewLoading(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${id}/allocations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "autoDistributePreview",
          cycleId,
          year,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPreviewMetrics(data.metrics ?? null);
        setPreviewNewCount(typeof data.newCount === "number" ? data.newCount : null);
        toast.success(
          data.newCount > 0
            ? `Simulação: ${data.newCount} semana(s) nova(s) atribuída(s) (equilíbrio por peso).`
            : "Nada a distribuir — todas as semanas disponíveis já estão alocadas."
        );
      } else {
        toast.error(data.error || "Erro na simulação");
      }
    } finally {
      setPreviewLoading(false);
    }
  };

  const aplicarDistribuicao = async () => {
    if (!cycleId) {
      toast.error("Selecione um ciclo");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${id}/allocations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "autoDistributeApply",
          cycleId,
          year,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(
          data.applied > 0
            ? `${data.applied} alocação(ões) gravada(s). Revise a lista abaixo.`
            : "Nenhuma alteração — já estava equilibrado."
        );
        setPreviewMetrics(null);
        setPreviewNewCount(null);
        await load();
      } else {
        toast.error(data.error || "Erro ao aplicar");
      }
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    void load();
  }, [load]);

  const criarCiclo = async () => {
    if (!newCycleLabel.trim()) {
      toast.error("Digite um nome para o ciclo (ex: Rodízio 2026)");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${id}/allocations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createCycle",
          label: newCycleLabel.trim(),
          yearRef: year,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Ciclo criado.");
        setNewCycleLabel("");
        setCycleId(data.cycle.id);
        await load();
      } else {
        toast.error(data.error || "Erro");
      }
    } finally {
      setSaving(false);
    }
  };

  const alocar = async () => {
    if (!cycleId) {
      toast.error("Selecione ou crie um ciclo de alocação");
      return;
    }
    if (!pickWeekId || !pickCotaId) {
      toast.error("Escolha a semana e a cota (cotista)");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${id}/allocations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "allocate",
          cycleId,
          cotaId: pickCotaId,
          propertyWeekId: pickWeekId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Semana atribuída ao cotista.");
        setPickWeekId("");
        setPickCotaId("");
        await load();
      } else {
        toast.error(data.error || "Erro");
      }
    } finally {
      setSaving(false);
    }
  };

  const remover = async (allocationId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${id}/allocations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "removeAllocation", allocationId }),
      });
      if (res.ok) {
        toast.success("Alocação removida");
        await load();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro");
      }
    } finally {
      setSaving(false);
    }
  };

  const currentCycle = cycles.find((c) => c.id === cycleId);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href={`${base}/${id}`}>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy flex items-center gap-2">
            <Users className="w-8 h-8" />
            Distribuir semanas aos cotistas
          </h1>
          <p className="text-gray-600 mt-1">
            Escolha um <strong>ciclo</strong>, depois vincule cada <strong>semana</strong> à{" "}
            <strong>cota</strong> (cotista). Isso libera a semana para o cotista no portal e nas
            trocas.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">1. Ano e ciclo</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label>Ano das semanas</Label>
            <Input
              type="number"
              className="w-28"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10) || year)}
            />
          </div>
          <div className="space-y-2 min-w-[220px]">
            <Label>Ciclo de alocação</Label>
            <Select
              value={cycleId ? cycleId : undefined}
              onValueChange={(v) => setCycleId(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {cycles.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                    {c.yearRef ? ` (${c.yearRef})` : ""} — {c.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2 items-end">
            <div className="space-y-2">
              <Label>Novo ciclo</Label>
              <Input
                placeholder="Ex: Rodízio 2026"
                value={newCycleLabel}
                onChange={(e) => setNewCycleLabel(e.target.value)}
                className="w-56"
              />
            </div>
            <Button type="button" variant="secondary" disabled={saving} onClick={() => void criarCiclo()}>
              Criar ciclo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribuição automática (por peso)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Atribui semanas <strong>ainda não alocadas</strong> neste ciclo, priorizando equilíbrio
            do <strong>soma de pesos</strong> entre cotistas (rodízio simples — não substitui
            ajuste manual). Semanas bloqueadas no planejamento são ignoradas.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="secondary"
              disabled={previewLoading || !cycleId}
              onClick={() => void simularDistribuicao()}
            >
              {previewLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Simular distribuição
            </Button>
            <Button
              type="button"
              className="bg-vivant-navy hover:bg-vivant-navy/90"
              disabled={saving || !cycleId}
              onClick={() => void aplicarDistribuicao()}
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Aplicar ao ciclo
            </Button>
          </div>
          {previewNewCount !== null && (
            <p className="text-sm text-gray-700">
              Última simulação: <strong>{previewNewCount}</strong> nova(s) alocação(ões) proposta(s).
            </p>
          )}
          {previewMetrics && cotas.length > 0 && (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2">Cota</th>
                    <th className="px-3 py-2">Semanas</th>
                    <th className="px-3 py-2">Peso total</th>
                    <th className="px-3 py-2">Δ média ideal</th>
                  </tr>
                </thead>
                <tbody>
                  {previewMetrics.byCota.map((row) => {
                    const c = cotas.find((x) => x.id === row.cotaId);
                    return (
                      <tr key={row.cotaId} className="border-t">
                        <td className="px-3 py-2">
                          {c ? `${c.numeroCota} — ${c.cotista.name}` : row.cotaId}
                        </td>
                        <td className="px-3 py-2">{row.weekCount}</td>
                        <td className="px-3 py-2">{row.weightSum}</td>
                        <td className="px-3 py-2">{row.deltaFromIdeal}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="border-t bg-slate-50/80 px-3 py-2 text-xs text-gray-600">
                Peso total (após simulação): {previewMetrics.totalWeight} · Média ideal:{" "}
                {previewMetrics.idealAverage} · Maior desvio: {previewMetrics.maxDelta}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Atribuir semana ao cotista (cota) — manual
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Primeiro cadastre as semanas em{" "}
            <Link className="text-vivant-navy underline" href={`${base}/${id}/planejamento-semanas`}>
              Planejamento de semanas
            </Link>
            .
          </p>
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin text-vivant-green" />
          ) : (
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
              <div className="space-y-2 min-w-[200px] flex-1">
                <Label>Semana</Label>
                <Select
                  value={pickWeekId ? pickWeekId : undefined}
                  onValueChange={(v) => setPickWeekId(v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha a semana" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {weeks.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.label ?? `Semana ${w.weekIndex}`} —{" "}
                        {format(new Date(w.startDate), "dd/MM", { locale: ptBR })} a{" "}
                        {format(new Date(w.endDate), "dd/MM/yyyy", { locale: ptBR })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 min-w-[220px] flex-1">
                <Label>Cota / cotista</Label>
                <Select
                  value={pickCotaId ? pickCotaId : undefined}
                  onValueChange={(v) => setPickCotaId(v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha a cota" />
                  </SelectTrigger>
                  <SelectContent>
                    {cotas.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.numeroCota} — {c.cotista.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="button"
                className="bg-vivant-green hover:bg-vivant-green/90"
                disabled={saving || !cycleId}
                onClick={() => void alocar()}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atribuir"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alocações neste ciclo</CardTitle>
        </CardHeader>
        <CardContent>
          {!currentCycle?.allocations?.length ? (
            <p className="text-sm text-gray-500">Nenhuma semana atribuída ainda neste ciclo.</p>
          ) : (
            <ul className="divide-y border rounded-md">
              {currentCycle.allocations.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
                >
                  <span>
                    <strong>{a.propertyWeek.label ?? `Semana ${a.propertyWeek.weekIndex}`}</strong>
                    {" · "}
                    {a.cota.numeroCota} — {a.cota.cotista.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600"
                    disabled={saving}
                    onClick={() => void remover(a.id)}
                  >
                    Remover
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
