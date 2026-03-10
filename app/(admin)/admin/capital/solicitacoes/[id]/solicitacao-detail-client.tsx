"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

type Sol = {
  id: string;
  tipoSolicitacao: string;
  valorSolicitado: number;
  motivo: string | null;
  status: string;
  observacaoAdmin: string | null;
  dataSolicitacao: Date;
  dataDecisao: Date | null;
  investorName: string;
  propertyName: string;
};

export function SolicitacaoDetailClient({ sol }: { sol: Sol }) {
  const router = useRouter();
  const [status, setStatus] = useState(sol.status);
  const [observacaoAdmin, setObservacaoAdmin] = useState(sol.observacaoAdmin ?? "");
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/capital/solicitacoes/${sol.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, observacaoAdmin: observacaoAdmin || undefined }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Detalhes</h2>
      </CardHeader>
      <CardContent className="space-y-4">
        <p><strong>Investidor:</strong> {sol.investorName}</p>
        <p><strong>Imóvel:</strong> {sol.propertyName}</p>
        <p><strong>Tipo:</strong> {sol.tipoSolicitacao}</p>
        <p><strong>Valor solicitado:</strong> {fmt(sol.valorSolicitado)}</p>
        <p><strong>Data:</strong> {format(new Date(sol.dataSolicitacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
        {sol.motivo && <p><strong>Motivo:</strong> {sol.motivo}</p>}
        <p><strong>Status:</strong> <span className="font-medium">{status}</span></p>

        {status === "PENDENTE" && (
          <>
            <div>
              <Label>Observação (admin)</Label>
              <textarea
                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                value={observacaoAdmin}
                onChange={(e) => setObservacaoAdmin(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" disabled={loading} onClick={() => updateStatus("APROVADA")}>
                Aprovar
              </Button>
              <Button size="sm" variant="destructive" disabled={loading} onClick={() => updateStatus("RECUSADA")}>
                Recusar
              </Button>
            </div>
          </>
        )}
        {status === "APROVADA" && (
          <Button size="sm" disabled={loading} onClick={() => updateStatus("PAGA")}>
            Marcar como paga
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
