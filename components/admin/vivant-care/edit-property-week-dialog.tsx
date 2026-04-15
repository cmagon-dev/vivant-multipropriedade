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

const TIERS = [
  { value: "GOLD", label: "Gold" },
  { value: "SILVER", label: "Silver" },
  { value: "BLACK", label: "Black" },
] as const;

const TYPES = [
  { value: "TYPE_1", label: "Tipo 1" },
  { value: "TYPE_2", label: "Tipo 2" },
  { value: "TYPE_3", label: "Tipo 3" },
  { value: "TYPE_4", label: "Tipo 4" },
  { value: "TYPE_5", label: "Tipo 5" },
  { value: "TYPE_6", label: "Tipo 6" },
  { value: "EXTRA", label: "Extra" },
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
  const [description, setDescription] = useState("");
  const [officialWeekType, setOfficialWeekType] = useState<string>("TYPE_1");
  const [tier, setTier] = useState<string>("SILVER");
  const [isExtra, setIsExtra] = useState(false);
  const [weight, setWeight] = useState("1");
  const [isBlocked, setIsBlocked] = useState(false);
  const [exchangeAllowed, setExchangeAllowed] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!week) return;
    setDescription(week.description ?? "");
    setOfficialWeekType(week.officialWeekType);
    setTier(week.tier);
    setIsExtra(week.isExtra);
    setWeight(String(week.weight ?? 1));
    setIsBlocked(week.isBlocked);
    setExchangeAllowed(week.exchangeAllowed);
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
            description: description.trim() || null,
            officialWeekType,
            tier,
            isExtra,
            weight: parseFloat(weight.replace(",", ".")) || 1,
            isBlocked,
            exchangeAllowed,
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

  const preset = (
    name: string,
    t: string,
    typ: string,
    w: string,
    extra: boolean
  ) => {
    setDescription(name);
    setTier(t);
    setOfficialWeekType(typ);
    setWeight(w);
    setIsExtra(extra);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar semana oficial</DialogTitle>
          {week ? (
            <p className="text-sm text-muted-foreground">
              #{week.weekIndex} · período fixo (quinta–quarta); ajuste tipo, classificação e peso.
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
                onClick={() => preset("Natal", "GOLD", "EXTRA", "2.5", true)}
              >
                Natal
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => preset("Réveillon", "GOLD", "EXTRA", "3", true)}
              >
                Réveillon
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => preset("Carnaval", "GOLD", "TYPE_3", "2", false)}
              >
                Carnaval
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Descrição (exibição)</Label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex.: Férias de julho"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Tipo de semana</Label>
                <Select value={officialWeekType} onValueChange={setOfficialWeekType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Classificação</Label>
                <Select value={tier} onValueChange={setTier}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIERS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Peso (distribuição)</Label>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
              <label className="flex items-center gap-2 text-sm pt-8">
                <Checkbox
                  checked={isExtra}
                  onCheckedChange={(c) => setIsExtra(c === true)}
                />
                Semana extra
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={isBlocked}
                  onCheckedChange={(c) => setIsBlocked(c === true)}
                />
                Bloqueada
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={exchangeAllowed}
                  onCheckedChange={(c) => setExchangeAllowed(c === true)}
                />
                Permite troca
              </label>
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
