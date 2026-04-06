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
    propertyId: string | null;
    targetType?: "CASA" | "COTISTA" | "CONDOMINIO" | "DESTINO";
    targetCotistaId?: string | null;
    targetCondominio?: string | null;
    targetDestinoId?: string | null;
    titulo: string;
    conteudo: string;
    tipo: string;
    prioridade: string;
    fixada: boolean;
    ativa: boolean;
  };
  properties: Array<{ id: string; name: string }>;
  cotistas: Array<{ id: string; name: string; email: string }>;
  destinos: Array<{ id: string; name: string }>;
  condominios: string[];
  redirectPath: string;
}

const TARGET_TYPES = [
  { value: "CASA", label: "Casa" },
  { value: "COTISTA", label: "Cotista" },
  { value: "CONDOMINIO", label: "Condomínio" },
  { value: "DESTINO", label: "Destino" },
];

export function AvisoForm({ aviso, properties, cotistas, destinos, condominios, redirectPath }: AvisoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    targetType: aviso?.targetType ?? "CASA",
    propertyId: aviso?.propertyId ?? "",
    targetCotistaId: aviso?.targetCotistaId ?? "",
    targetCondominio: aviso?.targetCondominio ?? "",
    targetDestinoId: aviso?.targetDestinoId ?? "",
    titulo: aviso?.titulo ?? "",
    conteudo: aviso?.conteudo ?? "",
    tipo: aviso?.tipo ?? "AVISO",
    prioridade: aviso?.prioridade ?? "NORMAL",
    fixada: aviso?.fixada ?? false,
    ativa: aviso?.ativa ?? true,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo || !form.conteudo) {
      toast.error("Preencha título e conteúdo");
      return;
    }
    if (form.targetType === "CASA" && !form.propertyId) {
      toast.error("Selecione a casa.");
      return;
    }
    if (form.targetType === "COTISTA" && !form.targetCotistaId) {
      toast.error("Selecione o cotista.");
      return;
    }
    if (form.targetType === "CONDOMINIO" && !form.targetCondominio) {
      toast.error("Selecione o condomínio.");
      return;
    }
    if (form.targetType === "DESTINO" && !form.targetDestinoId) {
      toast.error("Selecione o destino.");
      return;
    }
    setLoading(true);
    try {
      const url = aviso ? `/api/admin/avisos/${aviso.id}` : "/api/admin/avisos";
      const method = aviso ? "PUT" : "POST";
      const payload = {
        targetType: form.targetType,
        propertyId: form.targetType === "CASA" ? form.propertyId : null,
        targetCotistaId: form.targetType === "COTISTA" ? form.targetCotistaId : null,
        targetCondominio: form.targetType === "CONDOMINIO" ? form.targetCondominio : null,
        targetDestinoId: form.targetType === "DESTINO" ? form.targetDestinoId : null,
        titulo: form.titulo,
        conteudo: form.conteudo,
        tipo: form.tipo,
        prioridade: form.prioridade,
        fixada: form.fixada,
        ativa: form.ativa,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        <Label>Tipo de segmentação *</Label>
        <Select
          value={form.targetType}
          onValueChange={(v) =>
            setForm((prev) => ({
              ...prev,
              targetType: v as "CASA" | "COTISTA" | "CONDOMINIO" | "DESTINO",
            }))
          }
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a segmentação" />
          </SelectTrigger>
          <SelectContent>
            {TARGET_TYPES.map((target) => (
              <SelectItem key={target.value} value={target.value}>
                {target.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {form.targetType === "CASA" ? (
        <div className="space-y-2">
          <Label>Casa *</Label>
          <Select
            value={form.propertyId}
            onValueChange={(v) => setForm({ ...form, propertyId: v })}
            disabled={false}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a casa" />
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
      ) : null}
      {form.targetType === "COTISTA" ? (
        <div className="space-y-2">
          <Label>Cotista *</Label>
          <Select
            value={form.targetCotistaId}
            onValueChange={(v) => setForm({ ...form, targetCotistaId: v })}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o cotista" />
            </SelectTrigger>
            <SelectContent>
              {cotistas.map((cotista) => (
                <SelectItem key={cotista.id} value={cotista.id}>
                  {cotista.name} ({cotista.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      {form.targetType === "CONDOMINIO" ? (
        <div className="space-y-2">
          <Label>Condomínio *</Label>
          <Select
            value={form.targetCondominio}
            onValueChange={(v) => setForm({ ...form, targetCondominio: v })}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o condomínio" />
            </SelectTrigger>
            <SelectContent>
              {condominios.map((condominio) => (
                <SelectItem key={condominio} value={condominio}>
                  {condominio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
      {form.targetType === "DESTINO" ? (
        <div className="space-y-2">
          <Label>Destino *</Label>
          <Select
            value={form.targetDestinoId}
            onValueChange={(v) => setForm({ ...form, targetDestinoId: v })}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o destino" />
            </SelectTrigger>
            <SelectContent>
              {destinos.map((destino) => (
                <SelectItem key={destino.id} value={destino.id}>
                  {destino.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}
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
