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
  description: string | null;
  startDate: string;
  endDate: string;
};

type DistributionSlot = {
  id: string;
  label: string;
  status: string;
  assignments: Array<{
    id: string;
    cota: { numeroCota: string; cotista: { name: string } };
    calendarWeek: {
      weekIndex: number;
      description: string | null;
    };
  }>;
};

export function DistribuirSemanasPanel({ propertyId }: { propertyId: string }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [cotas, setCotas] = useState<Cota[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [slots, setSlots] = useState<DistributionSlot[]>([]);
  const [calendarYearId, setCalendarYearId] = useState<string | null>(null);
  const [distributionSlotId, setDistributionSlotId] = useState<string>("");
  const [newSlotLabel, setNewSlotLabel] = useState("");
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
      setCalendarYearId(d.calendarYear?.id ?? null);
      const list = (d.distributionSlots ?? []) as DistributionSlot[];
      setSlots(list);
      setDistributionSlotId((prev) =>
        prev && list.some((c) => c.id === prev) ? prev : list[0]?.id ?? ""
      );
    } finally {
      setLoading(false);
    }
  }, [propertyId, year]);

  useEffect(() => {
    void load();
  }, [load]);

  const criarSlot = async () => {
    if (!newSlotLabel.trim()) {
      toast.error("Digite um nome para o slot");
      return;
    }
    if (!calendarYearId) {
      toast.error("Gere o calendário do ano em Planejamento antes.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${propertyId}/allocations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createSlot",
          label: newSlotLabel.trim(),
          propertyCalendarYearId: calendarYearId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Slot criado.");
        setNewSlotLabel("");
        setDistributionSlotId(data.distributionSlot.id);
        await load();
      } else {
        toast.error(data.error || "Erro");
      }
    } finally {
      setSaving(false);
    }
  };

  const alocar = async () => {
    if (!distributionSlotId || !pickWeekId || !pickCotaId) {
      toast.error("Escolha slot, semana e cota");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/propriedades/${propertyId}/allocations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "allocate",
          distributionSlotId,
          cotaId: pickCotaId,
          propertyCalendarWeekId: pickWeekId,
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

  const currentSlot = slots.find((c) => c.id === distributionSlotId);

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
            <Label>Slot de distribuição</Label>
            <Select value={distributionSlotId || undefined} onValueChange={(v) => setDistributionSlotId(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {slots.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap gap-2 items-end">
            <div className="space-y-2">
              <Label>Novo slot</Label>
              <Input
                placeholder="Ex: Rodízio 2026"
                value={newSlotLabel}
                onChange={(e) => setNewSlotLabel(e.target.value)}
                className="w-56"
              />
            </div>
            <Button type="button" variant="secondary" disabled={saving} onClick={() => void criarSlot()}>
              Criar slot
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
                      {w.description ?? `Semana ${w.weekIndex}`} -{" "}
                      {format(new Date(w.startDate), "dd/MM", { locale: ptBR })} a{" "}
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
            <Button
              type="button"
              className="bg-vivant-green hover:bg-vivant-green/90"
              disabled={saving || !distributionSlotId}
              onClick={() => void alocar()}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Atribuir"}
            </Button>
          </div>
        )}

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              Alocações do slot atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!currentSlot?.assignments?.length ? (
              <p className="text-sm text-gray-500">Nenhuma semana atribuída ainda neste slot.</p>
            ) : (
              <ul className="divide-y border rounded-md">
                {currentSlot.assignments.map((a) => (
                  <li key={a.id} className="px-4 py-3 text-sm">
                    <strong>
                      {a.calendarWeek.description ?? `Semana ${a.calendarWeek.weekIndex}`}
                    </strong>{" "}
                    - {a.cota.numeroCota} — {a.cota.cotista.name}
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
