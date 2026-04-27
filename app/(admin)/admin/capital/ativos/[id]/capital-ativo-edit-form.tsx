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
  nomeAtivo: string;
  localizacao: string;
  descricao: string;
  vgv: string | number;
  valorAquisicao: string | number;
  valorTotalEstruturado: string | number;
  capRateProjetado: string | number;
  rentabilidadeProjetada: string | number;
  margemOperacionalPrevista: string | number;
  statusAtivo: string;
  documentosRelacionados: string;
  observacoesInternas: string;
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
          nomeAtivo: form.nomeAtivo || undefined,
          localizacao: form.localizacao || undefined,
          descricao: form.descricao || undefined,
          vgv: form.vgv !== "" ? Number(form.vgv) : undefined,
          valorAquisicao: form.valorAquisicao !== "" ? Number(form.valorAquisicao) : undefined,
          valorTotalEstruturado:
            form.valorTotalEstruturado !== "" ? Number(form.valorTotalEstruturado) : undefined,
          capRateProjetado: form.capRateProjetado !== "" ? Number(form.capRateProjetado) : undefined,
          rentabilidadeProjetada:
            form.rentabilidadeProjetada !== "" ? Number(form.rentabilidadeProjetada) : undefined,
          margemOperacionalPrevista:
            form.margemOperacionalPrevista !== ""
              ? Number(form.margemOperacionalPrevista)
              : undefined,
          statusAtivo: form.statusAtivo,
          documentosRelacionados: form.documentosRelacionados
            ? form.documentosRelacionados.split(",").map((x) => x.trim()).filter(Boolean)
            : [],
          observacoesInternas: form.observacoesInternas || undefined,
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
              <Label>Nome do ativo</Label>
              <Input value={form.nomeAtivo} onChange={(e) => setForm((f) => ({ ...f, nomeAtivo: e.target.value }))} />
            </div>
            <div>
              <Label>Localização</Label>
              <Input value={form.localizacao} onChange={(e) => setForm((f) => ({ ...f, localizacao: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label>Descrição</Label>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.descricao}
              onChange={(e) => setForm((f) => ({ ...f, descricao: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>VGV</Label>
              <Input type="number" step="0.01" value={form.vgv} onChange={(e) => setForm((f) => ({ ...f, vgv: e.target.value }))} />
            </div>
            <div>
              <Label>Valor de aquisição</Label>
              <Input type="number" step="0.01" value={form.valorAquisicao} onChange={(e) => setForm((f) => ({ ...f, valorAquisicao: e.target.value }))} />
            </div>
            <div>
              <Label>Valor total estruturado</Label>
              <Input type="number" step="0.01" value={form.valorTotalEstruturado} onChange={(e) => setForm((f) => ({ ...f, valorTotalEstruturado: e.target.value }))} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Cap rate projetado (%)</Label>
              <Input type="number" step="0.01" value={form.capRateProjetado} onChange={(e) => setForm((f) => ({ ...f, capRateProjetado: e.target.value }))} />
            </div>
            <div>
              <Label>Rentabilidade projetada (%)</Label>
              <Input type="number" step="0.01" value={form.rentabilidadeProjetada} onChange={(e) => setForm((f) => ({ ...f, rentabilidadeProjetada: e.target.value }))} />
            </div>
            <div>
              <Label>Margem operacional prevista (%)</Label>
              <Input type="number" step="0.01" value={form.margemOperacionalPrevista} onChange={(e) => setForm((f) => ({ ...f, margemOperacionalPrevista: e.target.value }))} />
            </div>
          </div>
          <div>
            <Label>Status do ativo (ciclo Capital)</Label>
            <Select value={form.statusAtivo} onValueChange={(v) => setForm((f) => ({ ...f, statusAtivo: v }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EM_ESTRUTURACAO">EM_ESTRUTURACAO</SelectItem>
                <SelectItem value="EM_CAPTACAO">EM_CAPTACAO</SelectItem>
                <SelectItem value="CAPTADO">CAPTADO</SelectItem>
                <SelectItem value="EM_OPERACAO">EM_OPERACAO</SelectItem>
                <SelectItem value="ENCERRADO">ENCERRADO</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Documentos relacionados (separados por vírgula)</Label>
            <Input
              value={form.documentosRelacionados}
              onChange={(e) => setForm((f) => ({ ...f, documentosRelacionados: e.target.value }))}
              placeholder="Prospecto, Contrato, Escritura..."
            />
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
            <Label>Observações internas</Label>
            <textarea
              className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={form.observacoesInternas}
              onChange={(e) => setForm((f) => ({ ...f, observacoesInternas: e.target.value }))}
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
