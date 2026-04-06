"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Loader2, Users, Link2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
};

type Cycle = {
  id: string;
  label: string;
  yearRef: number | null;
  status: string;
  allocations: Array<{
    id: string;
    cota: { numeroCota: string; cotista: { name: string } };
    propertyWeek: {
      weekIndex: number;
      label: string | null;
    };
  }>;
};

export function DistribuirSemanasPanel({ propertyId }: { propertyId: string }) {
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

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/admin/propriedades/${propertyId}/allocations?year=${year}`, {
        cache: "no-store",
      });
      const d = r.ok ? await r.json() : null;
      if (!d) return;
      setCotas(d.cotas ?? []);
      setWeeks(d.weeks ?? []);
      const list = (d.cycles ?? []) as Cycle[];
      setCycles(list);
      setCycleId((prev) => (prev && list.some((c) => c.id === prev) ? prev : list[0]?.id ?? ""));
    } finally {
      setLoading(false);
    }
  }, [propertyId, year]);

  useEffect(() => {
    void load();
  }, [load]);

  const criarCiclo = async () => {
    if (!newCycleLabel.trim()) {
      toast.error("Digite um nome para o ciclo");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${propertyId}/allocations`, {
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
    if (!cycleId || !pickWeekId || !pickCotaId) {
      toast.error("Escolha ciclo, semana e cota");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${propertyId}/allocations`, {
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

  const currentCycle = cycles.find((c) => c.id === cycleId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="w-5 h-5 text-vivant-navy" />
          Distribuir semanas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <Label>Ano</Label>
            <Input
              type="number"
              className="w-28"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value, 10) || year)}
            />
          </div>
          <div className="space-y-2 min-w-[220px]">
            <Label>Ciclo de alocação</Label>
            <Select value={cycleId || undefined} onValueChange={(v) => setCycleId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {cycles.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                    {c.yearRef ? ` (${c.yearRef})` : ""}
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
        </div>

        {loading ? (
          <Loader2 className="w-8 h-8 animate-spin text-vivant-green" />
        ) : (
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-end">
            <div className="space-y-2 min-w-[200px] flex-1">
              <Label>Semana</Label>
              <Select value={pickWeekId || undefined} onValueChange={(v) => setPickWeekId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha a semana" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  {weeks.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.label ?? `Semana ${w.weekIndex}`} - {format(new Date(w.startDate), "dd/MM", { locale: ptBR })} a{" "}
                      {format(new Date(w.endDate), "dd/MM/yyyy", { locale: ptBR })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 min-w-[220px] flex-1">
              <Label>Cota / cotista</Label>
              <Select value={pickCotaId || undefined} onValueChange={(v) => setPickCotaId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha a cota" />
                </SelectTrigger>
                <SelectContent>
                  {cotas.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.numeroCota} - {c.cotista.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="button" className="bg-vivant-green hover:bg-vivant-green/90" disabled={saving || !cycleId} onClick={() => void alocar()}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atribuir"}
            </Button>
          </div>
        )}

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Alocações do ciclo atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!currentCycle?.allocations?.length ? (
              <p className="text-sm text-gray-500">Nenhuma semana atribuída ainda neste ciclo.</p>
            ) : (
              <ul className="divide-y border rounded-md">
                {currentCycle.allocations.map((a) => (
                  <li key={a.id} className="px-4 py-3 text-sm">
                    <strong>{a.propertyWeek.label ?? `Semana ${a.propertyWeek.weekIndex}`}</strong> - {a.cota.numeroCota} — {a.cota.cotista.name}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
