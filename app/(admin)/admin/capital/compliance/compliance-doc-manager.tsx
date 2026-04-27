"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type Props = {
  assetId: string;
  defaultType: string;
};

export function ComplianceDocManager({ assetId, defaultType }: Props) {
  const [fileUrl, setFileUrl] = useState("");
  const [status, setStatus] = useState("PENDENTE");
  const [observations, setObservations] = useState("");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/capital/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assetId,
          type: defaultType,
          status,
          fileUrl: fileUrl || null,
          observations: observations || null,
          concludedAt: status === "CONCLUIDO" ? new Date().toISOString() : null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erro ao salvar documento");
        return;
      }
      toast.success("Documento de compliance salvo");
      setFileUrl("");
      setObservations("");
    } catch {
      toast.error("Erro ao salvar documento");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2">
      <Input
        placeholder="URL do documento"
        value={fileUrl}
        onChange={(e) => setFileUrl(e.target.value)}
      />
      <Input
        placeholder="Status (PENDENTE | EM_ANALISE | CONCLUIDO)"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />
      <Input
        placeholder="Observações"
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
      />
      <Button onClick={save} disabled={saving}>
        {saving ? "Salvando..." : "Salvar doc"}
      </Button>
    </div>
  );
}

