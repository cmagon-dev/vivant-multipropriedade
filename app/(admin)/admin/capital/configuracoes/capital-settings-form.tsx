"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  initial: {
    guaranteePercentage: number;
    operationPercentage: number;
    defaultReturnRate: number;
    marginMin: number;
    marginMax: number;
    disclaimer: string;
  };
};

export function CapitalSettingsForm({ initial }: Props) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/capital/configuracoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erro ao salvar configurações");
        return;
      }
      toast.success("Configurações salvas.");
      setForm({
        guaranteePercentage: Number(data.guaranteePercentage),
        operationPercentage: Number(data.operationPercentage),
        defaultReturnRate: Number(data.defaultReturnRate),
        marginMin: Number(data.marginMin),
        marginMax: Number(data.marginMax),
        disclaimer: data.disclaimer ?? "",
      });
    } catch {
      toast.error("Erro ao salvar configurações");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-vivant-navy">Parâmetros funcionais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>% bolsão garantia</Label>
            <Input type="number" step="0.01" value={form.guaranteePercentage} onChange={(e) => setForm((f) => ({ ...f, guaranteePercentage: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>% operação Vivant</Label>
            <Input type="number" step="0.01" value={form.operationPercentage} onChange={(e) => setForm((f) => ({ ...f, operationPercentage: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Rentabilidade padrão (%)</Label>
            <Input type="number" step="0.01" value={form.defaultReturnRate} onChange={(e) => setForm((f) => ({ ...f, defaultReturnRate: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Margem mínima (%)</Label>
            <Input type="number" step="0.01" value={form.marginMin} onChange={(e) => setForm((f) => ({ ...f, marginMin: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Margem máxima (%)</Label>
            <Input type="number" step="0.01" value={form.marginMax} onChange={(e) => setForm((f) => ({ ...f, marginMax: Number(e.target.value) }))} />
          </div>
        </div>
        <div>
          <Label>Disclaimer padrão</Label>
          <textarea
            className="w-full min-h-[90px] rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.disclaimer}
            onChange={(e) => setForm((f) => ({ ...f, disclaimer: e.target.value }))}
          />
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Salvando..." : "Salvar configurações"}
        </Button>
      </CardContent>
    </Card>
  );
}

