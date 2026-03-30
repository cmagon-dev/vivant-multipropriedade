"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { AdminCalendarWeek } from "./property-year-calendar";

const SEASONS = [
  { value: "BAIXA", label: "Baixa temporada" },
  { value: "MEDIA", label: "Média temporada" },
  { value: "ALTA", label: "Alta temporada" },
  { value: "SUPER_ALTA", label: "Super alta temporada" },
] as const;

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  week: AdminCalendarWeek | null;
  onSaved: () => void;
};

export function EditPropertyWeekDialog({
  open,
  onOpenChange,
  propertyId,
  week,
  onSaved,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [label, setLabel] = useState("");
  const [seasonType, setSeasonType] = useState<string>("MEDIA");
  const [weight, setWeight] = useState("1");
  const [isHoliday, setIsHoliday] = useState(false);
  const [isSchoolVacation, setIsSchoolVacation] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isExchangeAllowed, setIsExchangeAllowed] = useState(true);
  const [color, setColor] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!week) return;
    setLabel(week.label ?? "");
    setSeasonType(week.seasonType);
    setWeight(String(week.weight ?? 1));
    setIsHoliday(week.isHoliday);
    setIsSchoolVacation(week.isSchoolVacation);
    setIsBlocked(week.isBlocked);
    setIsExchangeAllowed(week.isExchangeAllowed);
    setColor(week.color ?? "");
    setNotes(week.notes ?? "");
  }, [week]);

  const salvar = async () => {
    if (!week) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/admin/propriedades/${propertyId}/weeks/${week.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            label: label.trim() || null,
            seasonType,
            weight: parseFloat(weight.replace(",", ".")) || 1,
            isHoliday,
            isSchoolVacation,
            isBlocked,
            isExchangeAllowed,
            color: color.trim() || null,
            notes: notes.trim() || null,
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Semana atualizada.");
        onSaved();
        onOpenChange(false);
      } else {
        toast.error(data.error || "Erro ao salvar");
      }
    } finally {
      setSaving(false);
    }
  };

  const preset = (name: string, st: string, w: string, holiday: boolean) => {
    setLabel(name);
    setSeasonType(st);
    setWeight(w);
    setIsHoliday(holiday);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar semana</DialogTitle>
          {week ? (
            <p className="text-sm text-muted-foreground">
              #{week.weekIndex} · use um nome amigável (ex.: Férias de julho, Natal)
            </p>
          ) : null}
        </DialogHeader>

        {week ? (
          <div className="space-y-4 py-2">
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => preset("Natal", "SUPER_ALTA", "2.5", true)}
              >
                Natal
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => preset("Réveillon", "SUPER_ALTA", "3", true)}
              >
                Réveillon
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => preset("Carnaval", "ALTA", "2", true)}
              >
                Carnaval
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Nome amigável (display)</Label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex.: Férias de julho"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Temporada</Label>
                <Select value={seasonType} onValueChange={setSeasonType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SEASONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Peso (distribuição)</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={isHoliday}
                  onCheckedChange={(c) => setIsHoliday(c === true)}
                />
                Feriado / data especial
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={isSchoolVacation}
                  onCheckedChange={(c) => setIsSchoolVacation(c === true)}
                />
                Férias escolares
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={isBlocked}
                  onCheckedChange={(c) => setIsBlocked(c === true)}
                />
                Bloqueada
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={isExchangeAllowed}
                  onCheckedChange={(c) => setIsExchangeAllowed(c === true)}
                />
                Permite troca
              </label>
            </div>

            <div className="space-y-2">
              <Label>Cor (hex opcional)</Label>
              <Input
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#e0f2fe"
              />
            </div>

            <div className="space-y-2">
              <Label>Observações internas</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button
            className="bg-vivant-green hover:bg-vivant-green/90"
            disabled={!week || saving}
            onClick={() => void salvar()}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
