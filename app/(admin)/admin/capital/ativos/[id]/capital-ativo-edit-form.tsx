"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Initial = {
  enabled: boolean;
  totalCotas: number;
  valorPorCota: number;
  taxaAdministracaoPercent: number;
  reservaPercent: number;
  ativoStatus: string;
  observacoes: string;
};

export function CapitalAtivoEditForm({ ativoId, initial }: { ativoId: string; initial: Initial }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState(initial);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/capital/ativos/${ativoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enabled: form.enabled,
          totalCotas: form.totalCotas,
          valorPorCota: form.valorPorCota,
          taxaAdministracaoPercent: form.taxaAdministracaoPercent,
          reservaPercent: form.reservaPercent,
          ativoStatus: form.ativoStatus,
          observacoes: form.observacoes || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao atualizar");
      }
      router.push("/admin/capital/ativos");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Editar configuração</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex items-center gap-2">
            <Checkbox id="enabled" checked={form.enabled} onCheckedChange={(c) => setForm((f) => ({ ...f, enabled: !!c }))} />
            <Label htmlFor="enabled">Ativo no Capital (habilitado)</Label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Total de cotas</Label>
              <Input
                type="number"
                min={1}
                value={form.totalCotas}
                onChange={(e) => setForm((f) => ({ ...f, totalCotas: Number(e.target.value) || 100 }))}
              />
            </div>
            <div>
              <Label>Valor por cota (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.valorPorCota}
                onChange={(e) => setForm((f) => ({ ...f, valorPorCota: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Taxa de administração (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.taxaAdministracaoPercent}
                onChange={(e) => setForm((f) => ({ ...f, taxaAdministracaoPercent: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>Reserva (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.reservaPercent}
                onChange={(e) => setForm((f) => ({ ...f, reservaPercent: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div>
            <Label>Status do ativo</Label>
            <Select value={form.ativoStatus} onValueChange={(v) => setForm((f) => ({ ...f, ativoStatus: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ATIVO">Ativo</SelectItem>
                <SelectItem value="PAUSADO">Pausado</SelectItem>
                <SelectItem value="ENCERRADO">Encerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Observações</Label>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.observacoes}
              onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando…" : "Salvar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push("/admin/capital/ativos")}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
