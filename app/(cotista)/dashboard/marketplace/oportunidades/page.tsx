"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, HandCoins } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelectedPropertyId } from "@/components/cotista/marketplace/use-selected-property-id";
import { LISTING_TYPE_LABEL } from "@/lib/vivant/week-marketplace-labels";

type Listing = {
  id: string;
  type: string;
  ownedWeek: {
    id: string;
    weekIndex: number;
    description: string | null;
    startDate: string;
    endDate: string;
    tier: string;
  };
  ownerCotista: { name: string };
};

export default function OportunidadesPage() {
  const propertyId = useSelectedPropertyId();
  const year = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<Listing[]>([]);
  const [month, setMonth] = useState<string>("all");
  const [tier, setTier] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [dialogListing, setDialogListing] = useState<Listing | null>(null);
  const [proposalType, setProposalType] = useState<"EXCHANGE" | "SALE">("EXCHANGE");
  const [cotaId, setCotaId] = useState("");
  const [proposerWeekId, setProposerWeekId] = useState("");
  const [weeksPayload, setWeeksPayload] = useState<{
    weeks: Array<{ id: string; weekIndex: number; description: string | null; startDate: string }>;
    myPropertyWeekIds: string[];
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [cotas, setCotas] = useState<Array<{ id: string; numeroCota: string }>>([]);

  const load = useCallback(() => {
    if (!propertyId) return;
    setLoading(true);
    const q = new URLSearchParams({
      propertyId,
      year: String(year),
      excludeMine: "1",
    });
    if (month !== "all") q.set("month", month);
    if (tier !== "all") q.set("tier", tier);
    if (typeFilter !== "all") q.set("type", typeFilter);

    fetch(`/api/cotistas/marketplace/listings?${q}`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { listings: [] }))
      .then((d) => setListings(d.listings ?? []))
      .finally(() => setLoading(false));
  }, [propertyId, year, month, tier, typeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!propertyId || !dialogListing) return;
    fetch("/api/cotistas/me/cotas", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const list = (d.cotas ?? []).filter(
          (c: { property?: { id: string } }) => c.property?.id === propertyId
        );
        const mapped = list.map((c: { id: string; numeroCota: string }) => ({
          id: c.id,
          numeroCota: c.numeroCota,
        }));
        setCotas(mapped);
        if (mapped[0]) setCotaId(mapped[0].id);
      });
  }, [propertyId, dialogListing]);

  useEffect(() => {
    if (!propertyId || !cotaId || !dialogListing) return;
    fetch(
      `/api/cotistas/me/property-weeks?propertyId=${propertyId}&cotaId=${cotaId}&year=${year}`,
      { credentials: "include" }
    )
      .then((r) => r.json())
      .then((d) => {
        setWeeksPayload({
          weeks: d.weeks ?? [],
          myPropertyWeekIds: d.myPropertyWeekIds ?? [],
        });
        setProposerWeekId("");
      });
  }, [propertyId, cotaId, dialogListing, year]);

  useEffect(() => {
    if (!dialogListing) return;
    if (dialogListing.type === "SALE") setProposalType("SALE");
    else if (dialogListing.type === "EXCHANGE") setProposalType("EXCHANGE");
    else setProposalType("EXCHANGE");
  }, [dialogListing]);

  const submitProposal = async () => {
    if (!dialogListing || !cotaId) return;
    if (proposalType === "EXCHANGE" && !proposerWeekId) {
      toast.error("Selecione sua semana para troca.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/cotistas/marketplace/proposals", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId: dialogListing.id,
          proposerCotaId: cotaId,
          type: proposalType,
          proposerWeekId: proposalType === "EXCHANGE" ? proposerWeekId : null,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erro");
        return;
      }
      if (data.aviso) toast.message(data.aviso);
      toast.success("Proposta enviada.");
      setDialogListing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  if (!propertyId) {
    return (
      <p className="text-sm text-[#1A2F4B]/70">
        Selecione uma propriedade no topo da página.
      </p>
    );
  }

  const selectableWeeks =
    weeksPayload?.weeks.filter(
      (w) =>
        weeksPayload.myPropertyWeekIds.includes(w.id) && w.id !== dialogListing?.ownedWeek.id
    ) ?? [];

  const canSale =
    dialogListing &&
    (dialogListing.type === "SALE" || dialogListing.type === "BOTH");
  const canExchange =
    dialogListing &&
    (dialogListing.type === "EXCHANGE" || dialogListing.type === "BOTH");

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <Label className="text-xs text-slate-500">Mês</Label>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {format(new Date(year, i, 1), "MMMM", { locale: ptBR })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-slate-500">Classe</Label>
          <Select value={tier} onValueChange={setTier}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="GOLD">Gold</SelectItem>
              <SelectItem value="SILVER">Silver</SelectItem>
              <SelectItem value="BLACK">Black</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-slate-500">Tipo</Label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="EXCHANGE">Troca</SelectItem>
              <SelectItem value="SALE">Venda</SelectItem>
              <SelectItem value="BOTH">Troca ou venda</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
        </div>
      ) : listings.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-[#1A2F4B]/70">
            Nenhuma oferta publicada por outros cotistas no momento.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {listings.map((l) => (
            <Card key={l.id} className="border-amber-200/50 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-start gap-2 text-[#1A2F4B]">
                  <HandCoins className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    {l.ownedWeek.description ?? `Semana ${l.ownedWeek.weekIndex}`} ·{" "}
                    {LISTING_TYPE_LABEL[l.type] ?? l.type} · {l.ownedWeek.tier}
                  </span>
                </CardTitle>
                <p className="text-xs text-slate-500">
                  {format(new Date(l.ownedWeek.startDate), "dd/MM/yyyy", { locale: ptBR })} –{" "}
                  {format(new Date(l.ownedWeek.endDate), "dd/MM/yyyy", { locale: ptBR })} · Anunciante:{" "}
                  {l.ownerCotista.name}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <Button size="sm" className="bg-vivant-green hover:bg-vivant-green/90" onClick={() => setDialogListing(l)}>
                  Propor negociação
                </Button>
              </CardContent>
            </Card>
          ))}
        </ul>
      )}

      <Dialog open={!!dialogListing} onOpenChange={(o) => !o && setDialogListing(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Proposta</DialogTitle>
          </DialogHeader>
          {dialogListing ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Semana ofertada:{" "}
                <strong>
                  {dialogListing.ownedWeek.description ?? `Semana ${dialogListing.ownedWeek.weekIndex}`}
                </strong>
              </p>
              <div>
                <Label>Sua cota</Label>
                <Select value={cotaId} onValueChange={setCotaId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cotas.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        Cota {c.numeroCota}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {(canExchange ?? canSale) && (
                <div>
                  <Label>Tipo da proposta</Label>
                  <Select
                    value={proposalType}
                    onValueChange={(v) => setProposalType(v as "EXCHANGE" | "SALE")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {canExchange ? <SelectItem value="EXCHANGE">Troca de semanas</SelectItem> : null}
                      {canSale ? <SelectItem value="SALE">Compra (pagamento fora do sistema)</SelectItem> : null}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {proposalType === "EXCHANGE" ? (
                <div>
                  <Label>Sua semana na troca (mesma classe)</Label>
                  <Select value={proposerWeekId} onValueChange={setProposerWeekId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectableWeeks.map((w) => (
                        <SelectItem key={w.id} value={w.id}>
                          {(w.description ?? `Sem. ${w.weekIndex}`) +
                            " · " +
                            format(new Date(w.startDate), "dd/MM", { locale: ptBR })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-md p-2">
                  Pagamento é feito fora da plataforma. Após o acordo, ambos confirmam no sistema.
                </p>
              )}
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogListing(null)}>
              Fechar
            </Button>
            <Button
              className="bg-vivant-green hover:bg-vivant-green/90"
              disabled={saving}
              onClick={() => void submitProposal()}
            >
              Enviar proposta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
