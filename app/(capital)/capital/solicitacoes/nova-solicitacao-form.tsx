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

type AssetOption = { assetConfigId: string; propertyName: string };

export function NovaSolicitacaoForm({ assetOptions }: { assetOptions: AssetOption[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    assetConfigId: "",
    tipoSolicitacao: "ANTECIPACAO",
    valorSolicitado: "",
    motivo: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.assetConfigId || !form.valorSolicitado) {
      setError("Selecione o ativo e informe o valor.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/capital/me/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetConfigId: form.assetConfigId,
          tipoSolicitacao: form.tipoSolicitacao,
          valorSolicitado: Number(form.valorSolicitado.replace(/\D/g, "")) / 100 || 0,
          motivo: form.motivo || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erro ao criar solicitação");
      }
      setOpen(false);
      setForm({ assetConfigId: "", tipoSolicitacao: "ANTECIPACAO", valorSolicitado: "", motivo: "" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao enviar");
    } finally {
      setLoading(false);
    }
  }

  if (assetOptions.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <h2 className="text-lg font-semibold">Nova solicitação</h2>
        <p className="text-sm text-gray-500">Antecipação ou resgate em um ativo em que você participa</p>
      </CardHeader>
      <CardContent>
        {!open ? (
          <Button onClick={() => setOpen(true)}>Solicitar antecipação / resgate</Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <Label>Ativo</Label>
              <Select value={form.assetConfigId} onValueChange={(v) => setForm((f) => ({ ...f, assetConfigId: v }))} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o ativo" />
                </SelectTrigger>
                <SelectContent>
                  {assetOptions.map((a) => (
                    <SelectItem key={a.assetConfigId} value={a.assetConfigId}>
                      {a.propertyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo</Label>
              <Select value={form.tipoSolicitacao} onValueChange={(v) => setForm((f) => ({ ...f, tipoSolicitacao: v }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ANTECIPACAO">Antecipação</SelectItem>
                  <SelectItem value="RESGATE">Resgate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Valor solicitado (R$)</Label>
              <Input
                type="text"
                placeholder="0,00"
                value={form.valorSolicitado}
                onChange={(e) => setForm((f) => ({ ...f, valorSolicitado: e.target.value }))}
              />
            </div>
            <div>
              <Label>Motivo (opcional)</Label>
              <textarea
                className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.motivo}
                onChange={(e) => setForm((f) => ({ ...f, motivo: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Enviando…" : "Enviar solicitação"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
