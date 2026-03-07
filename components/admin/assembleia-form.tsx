"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const TIPOS = [
  { value: "ORDINARIA", label: "Ordinária" },
  { value: "EXTRAORDINARIA", label: "Extraordinária" },
  { value: "VIRTUAL", label: "Virtual" },
];

const STATUS = [
  { value: "AGENDADA", label: "Agendada" },
  { value: "EM_ANDAMENTO", label: "Em andamento" },
  { value: "FINALIZADA", label: "Finalizada" },
  { value: "CANCELADA", label: "Cancelada" },
];

interface AssembleiaFormProps {
  assembleia?: {
    id: string;
    propertyId: string;
    titulo: string;
    descricao: string;
    tipo: string;
    dataRealizacao: string;
    dataInicio: string;
    dataFim: string;
    status: string;
    quorumMinimo: number;
    ataUrl: string | null;
  };
  properties: Array<{ id: string; name: string }>;
  redirectPath: string;
}

export function AssembleiaForm({ assembleia, properties, redirectPath }: AssembleiaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    propertyId: assembleia?.propertyId ?? "",
    titulo: assembleia?.titulo ?? "",
    descricao: assembleia?.descricao ?? "",
    tipo: assembleia?.tipo ?? "ORDINARIA",
    dataRealizacao: assembleia?.dataRealizacao ? assembleia.dataRealizacao.slice(0, 16) : "",
    dataInicio: assembleia?.dataInicio ? assembleia.dataInicio.slice(0, 16) : "",
    dataFim: assembleia?.dataFim ? assembleia.dataFim.slice(0, 16) : "",
    status: assembleia?.status ?? "AGENDADA",
    quorumMinimo: assembleia?.quorumMinimo ?? 50,
    ataUrl: assembleia?.ataUrl ?? "",
  });

  const isEdit = !!assembleia;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.propertyId || !form.titulo || !form.descricao || !form.dataRealizacao) {
      toast.error("Preencha propriedade, título, descrição e data de realização");
      return;
    }
    setLoading(true);
    try {
      const url = isEdit ? "/api/admin/assembleias/" + assembleia.id : "/api/admin/assembleias";
      const method = isEdit ? "PUT" : "POST";
      const body = isEdit
        ? { titulo: form.titulo, descricao: form.descricao, tipo: form.tipo, dataRealizacao: form.dataRealizacao, dataInicio: form.dataInicio || form.dataRealizacao, dataFim: form.dataFim || form.dataRealizacao, status: form.status, quorumMinimo: form.quorumMinimo, ataUrl: form.ataUrl || null }
        : { propertyId: form.propertyId, titulo: form.titulo, descricao: form.descricao, tipo: form.tipo, dataRealizacao: form.dataRealizacao, dataInicio: form.dataInicio || form.dataRealizacao, dataFim: form.dataFim || form.dataRealizacao, status: form.status, quorumMinimo: form.quorumMinimo };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        toast.success(isEdit ? "Assembleia atualizada." : "Assembleia criada.");
        router.push(isEdit ? redirectPath + "/" + assembleia.id : redirectPath);
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao salvar");
      }
    } catch {
      toast.error("Erro ao salvar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Propriedade *</Label>
        <Select value={form.propertyId} onValueChange={(v) => setForm({ ...form, propertyId: v })} disabled={isEdit}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a propriedade" />
          </SelectTrigger>
          <SelectContent>
            {properties.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Título *</Label>
        <Input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título da assembleia" required disabled={loading} />
      </div>
      <div className="space-y-2">
        <Label>Descrição *</Label>
        <Textarea value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição" rows={4} required disabled={loading} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Tipo</Label>
          <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })} disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIPOS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })} disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Data/hora realização *</Label>
          <Input type="datetime-local" value={form.dataRealizacao} onChange={(e) => setForm({ ...form, dataRealizacao: e.target.value })} required disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label>Início votação</Label>
          <Input type="datetime-local" value={form.dataInicio} onChange={(e) => setForm({ ...form, dataInicio: e.target.value })} disabled={loading} />
        </div>
        <div className="space-y-2">
          <Label>Fim votação</Label>
          <Input type="datetime-local" value={form.dataFim} onChange={(e) => setForm({ ...form, dataFim: e.target.value })} disabled={loading} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Quórum mínimo (%)</Label>
        <Input type="number" min={0} max={100} value={form.quorumMinimo} onChange={(e) => setForm({ ...form, quorumMinimo: Number(e.target.value) })} disabled={loading} />
      </div>
      {isEdit && (
        <div className="space-y-2">
          <Label>URL da ata</Label>
          <Input value={form.ataUrl} onChange={(e) => setForm({ ...form, ataUrl: e.target.value })} placeholder="https://..." disabled={loading} />
        </div>
      )}
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="bg-vivant-green hover:bg-vivant-green/90" disabled={loading}>
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar assembleia"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(redirectPath)} disabled={loading}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
