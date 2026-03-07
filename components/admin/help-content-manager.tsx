"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Loader2, Plus, Pencil, Trash2, HelpCircle } from "lucide-react";
import { toast } from "sonner";

type HelpItem = {
  id: string;
  key: string;
  title: string;
  description: string | null;
  shortText: string | null;
  videoUrl: string | null;
  audienceRole: string | null;
  updatedAt: string;
};

export function HelpContentManager() {
  const [items, setItems] = useState<HelpItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<HelpItem | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ key: "", title: "", description: "", shortText: "", videoUrl: "", audienceRole: "" });

  const load = () => {
    const url = filter ? `/api/admin/help?key=${encodeURIComponent(filter)}` : "/api/admin/help";
    fetch(url)
      .then((r) => r.json())
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => toast.error("Erro ao carregar"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    load();
  }, [filter]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
    setForm({ key: "", title: "", description: "", shortText: "", videoUrl: "", audienceRole: "" });
  };

  const openEdit = (item: HelpItem) => {
    setEditing(item);
    setFormOpen(true);
    setForm({
      key: item.key,
      title: item.title,
      description: item.description ?? "",
      shortText: item.shortText ?? "",
      videoUrl: item.videoUrl ?? "",
      audienceRole: item.audienceRole ?? "",
    });
  };

  const submit = async () => {
    if (!form.key.trim() || !form.title.trim()) {
      toast.error("Key e título são obrigatórios");
      return;
    }
    try {
      if (editing) {
        const res = await fetch(`/api/admin/help/${editing.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: form.key,
            title: form.title,
            description: form.description || null,
            shortText: form.shortText || null,
            videoUrl: form.videoUrl || null,
            audienceRole: form.audienceRole || null,
          }),
        });
        if (res.ok) {
          toast.success("Atualizado");
          setEditing(null);
          setFormOpen(false);
          load();
        } else {
          const e = await res.json();
          toast.error(e.error || "Erro");
        }
      } else {
        const res = await fetch("/api/admin/help", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: form.key,
            title: form.title,
            description: form.description || null,
            shortText: form.shortText || null,
            videoUrl: form.videoUrl || null,
            audienceRole: form.audienceRole || null,
          }),
        });
        if (res.ok) {
          toast.success("Criado");
          setForm({ key: "", title: "", description: "", shortText: "", videoUrl: "", audienceRole: "" });
          setFormOpen(false);
          load();
        } else {
          const e = await res.json();
          toast.error(e.error || "Erro");
        }
      }
    } catch {
      toast.error("Erro ao salvar");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Remover este conteúdo de ajuda?")) return;
    try {
      const res = await fetch(`/api/admin/help/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Removido");
        load();
        if (editing?.id === id) setEditing(null);
      } else toast.error("Erro ao remover");
    } catch {
      toast.error("Erro ao remover");
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Conteúdos por key (ícone ? nas telas). Expanda um item para ver o texto e editar.</p>
      <div className="flex flex-wrap items-center gap-4">
        <Input
          placeholder="Filtrar por key..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Novo conteúdo
        </Button>
      </div>

      {(formOpen || editing) && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid gap-2">
              <Label>Key (única)</Label>
              <Input
                value={form.key}
                onChange={(e) => setForm((f) => ({ ...f, key: e.target.value }))}
                placeholder="ex: properties.name"
                disabled={!!editing}
              />
            </div>
            <div className="grid gap-2">
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Título da dica"
              />
            </div>
            <div className="grid gap-2">
              <Label>Descrição (opcional)</Label>
              <textarea
                className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Texto completo da ajuda"
              />
            </div>
            <div className="grid gap-2">
              <Label>Texto curto / tooltip</Label>
              <Input
                value={form.shortText}
                onChange={(e) => setForm((f) => ({ ...f, shortText: e.target.value }))}
                placeholder="Resumo para tooltip"
              />
            </div>
            <div className="grid gap-2">
              <Label>URL do vídeo (opcional)</Label>
              <Input
                value={form.videoUrl}
                onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={submit}>{editing ? "Salvar" : "Criar"}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(false);
                }}
              >
                Cancelar
              </Button>
              {editing && (
                <Button variant="destructive" onClick={() => remove(editing.id)}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Remover
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-vivant-navy" />
        </div>
      ) : (
        <div className="space-y-2">
          {items.length > 0 && (
            <Accordion type="multiple" className="w-full">
              {items.map((item) => (
                <AccordionItem key={item.id} value={item.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3 text-left">
                      <HelpCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.key}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      {(item.shortText || item.description) && (
                        <div className="text-sm text-gray-700 whitespace-pre-wrap">
                          {item.description || item.shortText}
                        </div>
                      )}
                      {item.videoUrl && (
                        <p className="text-xs text-vivant-navy break-all">
                          Vídeo: <a href={item.videoUrl} target="_blank" rel="noreferrer" className="underline">{item.videoUrl}</a>
                        </p>
                      )}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(item)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => remove(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
          {items.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Nenhum conteúdo de ajuda. Crie um com a key usada no componente HelpTip.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
