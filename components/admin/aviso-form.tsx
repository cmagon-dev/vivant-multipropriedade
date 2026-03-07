"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const TIPOS = [
  { value: "AVISO", label: "Aviso" },
  { value: "COMUNICADO", label: "Comunicado" },
  { value: "URGENTE", label: "Urgente" },
  { value: "MANUTENCAO", label: "Manutenção" },
  { value: "EVENTO", label: "Evento" },
  { value: "LEMBRETE", label: "Lembrete" },
];

const PRIORIDADES = [
  { value: "BAIXA", label: "Baixa" },
  { value: "NORMAL", label: "Normal" },
  { value: "ALTA", label: "Alta" },
  { value: "URGENTE", label: "Urgente" },
];

interface AvisoFormProps {
  aviso?: {
    id: string;
    propertyId: string;
    titulo: string;
    conteudo: string;
    tipo: string;
    prioridade: string;
    fixada: boolean;
    ativa: boolean;
  };
  properties: Array<{ id: string; name: string }>;
  redirectPath: string;
}

export function AvisoForm({ aviso, properties, redirectPath }: AvisoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    propertyId: aviso?.propertyId ?? "",
    titulo: aviso?.titulo ?? "",
    conteudo: aviso?.conteudo ?? "",
    tipo: aviso?.tipo ?? "AVISO",
    prioridade: aviso?.prioridade ?? "NORMAL",
    fixada: aviso?.fixada ?? false,
    ativa: aviso?.ativa ?? true,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.propertyId || !form.titulo || !form.conteudo) {
      toast.error("Preencha propriedade, título e conteúdo");
      return;
    }
    setLoading(true);
    try {
      const url = aviso ? `/api/admin/avisos/${aviso.id}` : "/api/admin/avisos";
      const method = aviso ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(aviso ? "Aviso atualizado." : "Aviso criado.");
        router.push(aviso ? `${redirectPath}/${aviso.id}` : redirectPath);
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
        <Select
          value={form.propertyId}
          onValueChange={(v) => setForm({ ...form, propertyId: v })}
          disabled={!!aviso}
        >
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
        <Input
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          placeholder="Título do aviso"
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label>Conteúdo *</Label>
        <Textarea
          value={form.conteudo}
          onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
          placeholder="Conteúdo do aviso"
          rows={6}
          required
          disabled={loading}
        />
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
          <Label>Prioridade</Label>
          <Select value={form.prioridade} onValueChange={(v) => setForm({ ...form, prioridade: v })} disabled={loading}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORIDADES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="fixada"
            checked={form.fixada}
            onCheckedChange={(v) => setForm({ ...form, fixada: v })}
            disabled={loading}
          />
          <Label htmlFor="fixada">Fixada no topo</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="ativa"
            checked={form.ativa}
            onCheckedChange={(v) => setForm({ ...form, ativa: v })}
            disabled={loading}
          />
          <Label htmlFor="ativa">Publicado (visível para cotistas)</Label>
        </div>
      </div>
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="bg-vivant-green hover:bg-vivant-green/90" disabled={loading}>
          {loading ? "Salvando..." : aviso ? "Salvar alterações" : "Criar aviso"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(redirectPath)} disabled={loading}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
