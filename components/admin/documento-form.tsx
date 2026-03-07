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
  { value: "ESTATUTO", label: "Estatuto" },
  { value: "REGIMENTO_INTERNO", label: "Regimento Interno" },
  { value: "ATA", label: "Ata" },
  { value: "CONTRATO", label: "Contrato" },
  { value: "MANUAL", label: "Manual" },
  { value: "PLANTA", label: "Planta" },
  { value: "LAUDO", label: "Laudo" },
  { value: "OUTROS", label: "Outros" },
];

interface DocumentoFormProps {
  documento?: {
    id: string;
    propertyId: string;
    titulo: string;
    descricao: string | null;
    tipo: string;
    categoria: string | null;
    ativo: boolean;
  };
  properties: Array<{ id: string; name: string }>;
  redirectPath: string;
}

export function DocumentoForm({ documento, properties, redirectPath }: DocumentoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    propertyId: documento?.propertyId ?? "",
    titulo: documento?.titulo ?? "",
    descricao: documento?.descricao ?? "",
    tipo: documento?.tipo ?? "OUTROS",
    categoria: documento?.categoria ?? "",
    ativo: documento?.ativo ?? true,
  });

  const isEdit = !!documento;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.propertyId || !form.titulo.trim()) {
      toast.error("Preencha propriedade e título");
      return;
    }
    if (!isEdit && !file) {
      toast.error("Selecione um arquivo");
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        const res = await fetch("/api/admin/documentos/" + documento.id, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: form.titulo,
            descricao: form.descricao || null,
            tipo: form.tipo,
            categoria: form.categoria || null,
            ativo: form.ativo,
          }),
        });
        if (res.ok) {
          toast.success("Documento atualizado.");
          router.push(redirectPath + "/" + documento.id);
        } else {
          const data = await res.json();
          toast.error(data.error || "Erro ao salvar");
        }
      } else {
        const fd = new FormData();
        fd.append("file", file!);
        fd.append("propertyId", form.propertyId);
        fd.append("titulo", form.titulo);
        if (form.descricao) fd.append("descricao", form.descricao);
        fd.append("tipo", form.tipo);
        if (form.categoria) fd.append("categoria", form.categoria);
        const res = await fetch("/api/admin/documentos", { method: "POST", body: fd });
        if (res.ok) {
          toast.success("Documento criado.");
          router.push(redirectPath);
        } else {
          const data = await res.json();
          toast.error(data.error || "Erro ao criar");
        }
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
          disabled={isEdit}
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
          placeholder="Título do documento"
          required
          disabled={loading}
        />
      </div>
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          placeholder="Descrição opcional"
          rows={2}
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
          <Label>Categoria</Label>
          <Input
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            placeholder="Ex: Assembleia 2024"
            disabled={loading}
          />
        </div>
      </div>
      {!isEdit && (
        <div className="space-y-2">
          <Label>Arquivo * (PDF, Word ou imagem, máx 10MB)</Label>
          <Input
            type="file"
            accept=".pdf,.doc,.docx,image/*,.txt"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            disabled={loading}
          />
        </div>
      )}
      {isEdit && (
        <div className="flex items-center gap-2">
          <Switch
            id="ativo"
            checked={form.ativo}
            onCheckedChange={(v) => setForm({ ...form, ativo: v })}
            disabled={loading}
          />
          <Label htmlFor="ativo">Publicado (visível para cotistas)</Label>
        </div>
      )}
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="bg-vivant-green hover:bg-vivant-green/90" disabled={loading}>
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Criar documento"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.push(redirectPath)} disabled={loading}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
