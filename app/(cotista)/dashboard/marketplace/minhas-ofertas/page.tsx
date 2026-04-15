"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus } from "lucide-react";
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
import { LISTING_STATUS_LABEL, LISTING_TYPE_LABEL } from "@/lib/vivant/week-marketplace-labels";

type ListingRow = {
  id: string;
  status: string;
  type: string;
  ownedWeek: {
    id: string;
    weekIndex: number;
    description: string | null;
    startDate: string;
    endDate: string;
    tier: string;
  };
};

export default function MinhasOfertasPage() {
  const propertyId = useSelectedPropertyId();
  const year = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cotas, setCotas] = useState<Array<{ id: string; numeroCota: string }>>([]);
  const [cotaId, setCotaId] = useState<string>("");
  const [weeksPayload, setWeeksPayload] = useState<{
    weeks: Array<{ id: string; weekIndex: number; description: string | null; startDate: string; endDate: string }>;
    myPropertyWeekIds: string[];
  } | null>(null);
  const [weekId, setWeekId] = useState<string>("");
  const [listingType, setListingType] = useState<"EXCHANGE" | "SALE" | "BOTH">("BOTH");
  const [publishNow, setPublishNow] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadListings = useCallback(() => {
    if (!propertyId) return;
    setLoading(true);
    fetch(`/api/cotistas/marketplace/listings/mine?propertyId=${propertyId}`, {
      credentials: "include",
    })
      .then((r) => (r.ok ? r.json() : { listings: [] }))
      .then((d) => setListings(d.listings ?? []))
      .finally(() => setLoading(false));
  }, [propertyId]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  useEffect(() => {
    if (!propertyId || !dialogOpen) return;
    fetch("/api/cotistas/me/cotas", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const list = (d.cotas ?? []).filter(
          (c: { property?: { id: string } }) => c.property?.id === propertyId
        );
        setCotas(list.map((c: { id: string; numeroCota: string }) => ({ id: c.id, numeroCota: c.numeroCota })));
        if (list[0]) setCotaId(list[0].id);
      });
  }, [propertyId, dialogOpen]);

  useEffect(() => {
    if (!propertyId || !cotaId || !dialogOpen) return;
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
        setWeekId("");
      });
  }, [propertyId, cotaId, dialogOpen, year]);

  const submitCreate = async () => {
    if (!propertyId || !weekId || !cotaId) {
      toast.error("Selecione semana e cota.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/cotistas/marketplace/listings", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId,
          year,
          ownedCalendarWeekId: weekId,
          ownerCotaId: cotaId,
          type: listingType,
          publish: publishNow,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao criar");
        return;
      }
      toast.success(publishNow ? "Anúncio publicado." : "Rascunho salvo.");
      setDialogOpen(false);
      loadListings();
    } finally {
      setSaving(false);
    }
  };

  const publishDraft = async (id: string) => {
    const res = await fetch(`/api/cotistas/marketplace/listings/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "publish" }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Erro");
      return;
    }
    toast.success("Publicado.");
    loadListings();
  };

  const cancelListing = async (id: string) => {
    if (!confirm("Cancelar este anúncio e propostas ativas?")) return;
    const res = await fetch(`/api/cotistas/marketplace/listings/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    if (!res.ok) {
      const data = await res.json();
      toast.error(data.error ?? "Erro");
      return;
    }
    toast.success("Anúncio cancelado.");
    loadListings();
  };

  if (!propertyId) {
    return (
      <p className="text-sm text-[#1A2F4B]/70">
        Selecione uma propriedade no topo da página para usar o marketplace.
      </p>
    );
  }

  const selectableWeeks =
    weeksPayload?.weeks.filter((w) => weeksPayload.myPropertyWeekIds.includes(w.id)) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#1A2F4B]/80">
          Semanas que você disponibilizou para troca ou venda nesta propriedade.
        </p>
        <Button className="bg-vivant-green hover:bg-vivant-green/90 gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Disponibilizar para troca/venda
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
        </div>
      ) : listings.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-[#1A2F4B]/70">
            Você ainda não criou anúncios. Use o botão acima para disponibilizar uma semana.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {listings.map((l) => (
            <Card key={l.id} className="border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-[#1A2F4B]">
                  {l.ownedWeek.description ?? `Semana ${l.ownedWeek.weekIndex}`} ·{" "}
                  {format(new Date(l.ownedWeek.startDate), "dd/MM/yyyy", { locale: ptBR })} –{" "}
                  {format(new Date(l.ownedWeek.endDate), "dd/MM/yyyy", { locale: ptBR })}
                </CardTitle>
                <p className="text-xs text-slate-500">
                  {LISTING_TYPE_LABEL[l.type] ?? l.type} · Classe {l.ownedWeek.tier} ·{" "}
                  {LISTING_STATUS_LABEL[l.status] ?? l.status}
                </p>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 pt-0">
                {l.status === "DRAFT" ? (
                  <Button size="sm" variant="secondary" onClick={() => void publishDraft(l.id)}>
                    Publicar
                  </Button>
                ) : null}
                {l.status !== "COMPLETED" && l.status !== "CANCELLED" ? (
                  <Button size="sm" variant="outline" onClick={() => void cancelListing(l.id)}>
                    Cancelar anúncio
                  </Button>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova oferta</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <Label>Cota</Label>
              <Select value={cotaId} onValueChange={setCotaId}>
                <SelectTrigger>
                  <SelectValue placeholder="Cota" />
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
            <div>
              <Label>Sua semana (distribuição {year})</Label>
              <Select value={weekId} onValueChange={setWeekId}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha a semana" />
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
            <div>
              <Label>Tipo</Label>
              <Select
                value={listingType}
                onValueChange={(v) => setListingType(v as "EXCHANGE" | "SALE" | "BOTH")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXCHANGE">{LISTING_TYPE_LABEL.EXCHANGE}</SelectItem>
                  <SelectItem value="SALE">{LISTING_TYPE_LABEL.SALE}</SelectItem>
                  <SelectItem value="BOTH">{LISTING_TYPE_LABEL.BOTH}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={publishNow}
                onChange={(e) => setPublishNow(e.target.checked)}
              />
              Publicar imediatamente
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Fechar
            </Button>
            <Button
              className="bg-vivant-green hover:bg-vivant-green/90"
              disabled={saving || !weekId}
              onClick={() => void submitCreate()}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
