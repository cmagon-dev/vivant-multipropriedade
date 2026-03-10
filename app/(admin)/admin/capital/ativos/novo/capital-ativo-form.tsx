"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Property = { id: string; name: string; location: string; priceValue: number };

export function CapitalAtivoForm({ properties }: { properties: Property[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    propertyId: "",
    totalCotas: 100,
    valorPorCota: "",
    taxaAdministracaoPercent: "2",
    reservaPercent: "5",
    ativoStatus: "ATIVO",
    observacoes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.propertyId || !form.valorPorCota) {
      setError("Selecione o imóvel e informe o valor por cota.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/capital/ativos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: form.propertyId,
          enabled: true,
          totalCotas: form.totalCotas,
          valorPorCota: Number(form.valorPorCota.replace(/\D/g, "")) / 100 || 0,
          taxaAdministracaoPercent: Number(form.taxaAdministracaoPercent) || 0,
          reservaPercent: Number(form.reservaPercent) || 0,
          ativoStatus: form.ativoStatus,
          observacoes: form.observacoes || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao vincular ativo");
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
        <h2 className="text-lg font-semibold">Configuração do ativo</h2>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <Label>Imóvel</Label>
            <Select value={form.propertyId} onValueChange={(v) => setForm((f) => ({ ...f, propertyId: v }))} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o imóvel" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} — {p.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                type="text"
                placeholder="0,00"
                value={form.valorPorCota}
                onChange={(e) => setForm((f) => ({ ...f, valorPorCota: e.target.value }))}
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
                onChange={(e) => setForm((f) => ({ ...f, taxaAdministracaoPercent: e.target.value }))}
              />
            </div>
            <div>
              <Label>Reserva (%)</Label>
              <Input
                type="number"
                step="0.01"
                value={form.reservaPercent}
                onChange={(e) => setForm((f) => ({ ...f, reservaPercent: e.target.value }))}
              />
            </div>
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
              {loading ? "Salvando…" : "Vincular ativo"}
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
