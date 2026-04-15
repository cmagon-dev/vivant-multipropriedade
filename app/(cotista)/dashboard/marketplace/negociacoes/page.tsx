"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelectedPropertyId } from "@/components/cotista/marketplace/use-selected-property-id";
import { PROPOSAL_STATUS_LABEL, PROPOSAL_TYPE_LABEL } from "@/lib/vivant/week-marketplace-labels";

type Proposal = {
  id: string;
  status: string;
  type: string;
  listingId: string;
  proposerCotista?: { name: string };
  listing: {
    ownedWeek: {
      description: string | null;
      weekIndex: number;
      startDate: string;
      endDate: string;
    };
  };
  proposerWeek: { description: string | null; weekIndex: number; startDate: string } | null;
};

async function patchProposal(id: string, action: string) {
  const res = await fetch(`/api/cotistas/marketplace/proposals/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
  const data = await res.json();
  if (!res.ok) {
    toast.error(data.error ?? "Erro");
    return false;
  }
  toast.success("Atualizado.");
  return true;
}

export default function NegociacoesPage() {
  const propertyId = useSelectedPropertyId();
  const [loading, setLoading] = useState(true);
  const [sent, setSent] = useState<Proposal[]>([]);
  const [received, setReceived] = useState<Proposal[]>([]);

  const load = useCallback(() => {
    if (!propertyId) return;
    setLoading(true);
    fetch(`/api/cotistas/marketplace/negotiations?propertyId=${propertyId}`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : { sent: [], received: [] }))
      .then((d) => {
        setSent(d.sent ?? []);
        setReceived(d.received ?? []);
      })
      .finally(() => setLoading(false));
  }, [propertyId]);

  useEffect(() => {
    load();
  }, [load]);

  if (!propertyId) {
    return (
      <p className="text-sm text-[#1A2F4B]/70">
        Selecione uma propriedade no topo da página.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-[#1A2F4B]/80">
        Propostas que você enviou e propostas recebidas sobre seus anúncios. O sistema só aplica a troca ou a
        venda após os passos de confirmação.
      </p>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
        </div>
      ) : (
        <>
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#1A2F4B]">Enviadas</h2>
            {sent.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma proposta enviada.</p>
            ) : (
              <ul className="space-y-3">
                {sent.map((p) => (
                  <ProposalCard
                    key={p.id}
                    proposal={p}
                    role="sent"
                    onAction={async (action) => {
                      if (await patchProposal(p.id, action)) load();
                    }}
                  />
                ))}
              </ul>
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-[#1A2F4B]">Recebidas (sobre seu anúncio)</h2>
            {received.length === 0 ? (
              <p className="text-sm text-slate-500">Nenhuma proposta recebida.</p>
            ) : (
              <ul className="space-y-3">
                {received.map((p) => (
                  <ProposalCard
                    key={p.id}
                    proposal={p}
                    role="received"
                    onAction={async (action) => {
                      if (await patchProposal(p.id, action)) load();
                    }}
                  />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function ProposalCard({
  proposal,
  role,
  onAction,
}: {
  proposal: Proposal;
  role: "sent" | "received";
  onAction: (action: string) => Promise<void>;
}) {
  const w = proposal.listing.ownedWeek;
  const label =
    w.description ??
    `Semana ${w.weekIndex} · ${format(new Date(w.startDate), "dd/MM", { locale: ptBR })}`;

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[#1A2F4B]">
          {PROPOSAL_TYPE_LABEL[proposal.type] ?? proposal.type} · {PROPOSAL_STATUS_LABEL[proposal.status] ?? proposal.status}
        </CardTitle>
        <p className="text-xs text-slate-600">
          Semana do anúncio: {label}
          {proposal.type === "EXCHANGE" && proposal.proposerWeek ? (
            <>
              {" "}
              · Sua semana na troca:{" "}
              {proposal.proposerWeek.description ??
                `Sem. ${proposal.proposerWeek.weekIndex} · ${format(new Date(proposal.proposerWeek.startDate), "dd/MM", { locale: ptBR })}`}
            </>
          ) : null}
        </p>
        {role === "received" && proposal.proposerCotista ? (
          <p className="text-xs text-slate-500">De: {proposal.proposerCotista.name}</p>
        ) : null}
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2 pt-0">
        {proposal.status === "PENDING" && role === "received" ? (
          <>
            <Button size="sm" className="bg-vivant-green hover:bg-vivant-green/90" onClick={() => onAction("owner_accept")}>
              Aceitar proposta
            </Button>
            <Button size="sm" variant="outline" onClick={() => onAction("reject")}>
              Recusar
            </Button>
          </>
        ) : null}
        {proposal.status === "PENDING" && role === "sent" ? (
          <Button size="sm" variant="outline" onClick={() => onAction("cancel")}>
            Cancelar envio
          </Button>
        ) : null}
        {proposal.status === "ACCEPTED_BY_OWNER" && proposal.type === "EXCHANGE" && role === "sent" ? (
          <Button size="sm" className="bg-vivant-green hover:bg-vivant-green/90" onClick={() => onAction("proposer_confirm_exchange")}>
            Confirmar troca
          </Button>
        ) : null}
        {proposal.status === "ACCEPTED_BY_OWNER" && proposal.type === "SALE" && role === "received" ? (
          <Button size="sm" className="bg-vivant-green hover:bg-vivant-green/90" onClick={() => onAction("seller_confirm_sale")}>
            Confirmo venda (pagamento fora do sistema)
          </Button>
        ) : null}
        {proposal.status === "ACCEPTED_BY_OWNER" && proposal.type === "SALE" && role === "sent" ? (
          <Button size="sm" className="bg-vivant-green hover:bg-vivant-green/90" onClick={() => onAction("buyer_confirm_sale")}>
            Confirmo compra
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
