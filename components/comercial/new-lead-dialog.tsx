"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HelpTip } from "@/components/help/HelpTip";
import { toast } from "sonner";

type LeadType = { id: string; key: string; name: string };

export function NewLeadDialog({
  open,
  onOpenChange,
  leadTypes,
  defaultTypeId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadTypes: LeadType[];
  defaultTypeId?: string;
  onSuccess: () => void;
}) {
  const [leadTypeId, setLeadTypeId] = useState(defaultTypeId ?? leadTypes[0]?.id ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setLeadTypeId(defaultTypeId ?? leadTypes[0]?.id ?? "");
    setName("");
    setPhone("");
    setEmail("");
    setSource("");
    setNotes("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      toast.error("Nome e telefone são obrigatórios.");
      return;
    }
    if (!leadTypeId) {
      toast.error("Selecione um tipo de lead.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/crm/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadTypeId,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || undefined,
          source: source.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? "Erro ao criar lead");
        return;
      }
      toast.success("Lead criado com sucesso.");
      reset();
      onOpenChange(false);
      onSuccess();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Novo Lead
            <HelpTip helpKey="crm.activity" fallbackTitle="Novo lead" fallbackText="Preencha nome e telefone. O lead entrará na primeira etapa do funil selecionado." />
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tipo de funil</Label>
            <Select value={leadTypeId} onValueChange={setLeadTypeId} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {leadTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Nome *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do contato" required />
          </div>
          <div>
            <Label>Telefone *</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" required />
          </div>
          <div>
            <Label>E-mail</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" />
          </div>
          <div>
            <Label>Origem</Label>
            <Input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Ex: Instagram, WhatsApp" />
          </div>
          <div>
            <Label>Observações</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full min-h-[80px] px-3 py-2 border rounded-md text-sm"
              placeholder="Notas iniciais"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Criar lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
