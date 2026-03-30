"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const STATUS: Record<string, string> = {
  REQUESTED: "Enviada",
  UNDER_ADMIN_REVIEW: "Em análise (admin)",
  ADMIN_OPTION_FOUND: "Alternativa sugerida",
  PUBLISHED_TO_PEERS: "Publicada aos cotistas",
  PEER_INTEREST_FOUND: "Interesse de cotista",
  NEGOTIATION_IN_PROGRESS: "Em negociação",
  PENDING_ADMIN_APPROVAL: "Aguardando aprovação final",
  APPROVED: "Aprovada",
  REJECTED: "Recusada",
  EXPIRED: "Expirada",
  CANCELLED: "Cancelada",
};

export default function SolicitacoesTrocasPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<
    Array<{
      id: string;
      status: string;
      createdAt: string;
      property: { name: string };
      ownedWeek: { label: string | null; weekIndex: number };
    }>
  >([]);

  useEffect(() => {
    fetch("/api/cotistas/me/week-exchange-requests", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { requests: [] }))
      .then((d) => setRows(d.requests ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2 flex items-center gap-2">
          <ClipboardList className="w-8 h-8 text-vivant-green" />
          Minhas solicitações
        </h1>
        <p className="text-[#1A2F4B]/70">
          Nenhuma troca é automática — a administração aprova cada etapa.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-[#1A2F4B]/70">
            Você ainda não enviou solicitações de troca.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <Card key={r.id} className="border border-slate-200">
              <CardContent className="py-4 px-5">
                <p className="font-semibold text-[#1A2F4B]">{r.property.name}</p>
                <p className="text-sm text-[#1A2F4B]/80 mt-1">
                  Semana: {r.ownedWeek.label ?? `Semana ${r.ownedWeek.weekIndex}`}
                </p>
                <p className="text-xs text-vivant-green font-medium mt-2">
                  {STATUS[r.status] ?? r.status}
                </p>
                <p className="text-xs text-[#1A2F4B]/50 mt-1">
                  {format(new Date(r.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </p>
              </CardContent>
            </Card>
          ))}
        </ul>
      )}
    </div>
  );
}
