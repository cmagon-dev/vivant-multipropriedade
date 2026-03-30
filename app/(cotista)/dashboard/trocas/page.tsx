"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Building2,
  Sparkles,
  ClipboardList,
  CalendarDays,
  Info,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const STATUS_LEGADO: Record<string, string> = {
  ABERTA: "Aberta",
  EM_NEGOCIACAO: "Em negociação",
  ACEITA: "Aceita",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
  EXPIRADA: "Expirada",
};

const STATUS_NOVO: Record<string, string> = {
  REQUESTED: "Enviada",
  UNDER_ADMIN_REVIEW: "Em análise",
  PUBLISHED_TO_PEERS: "Publicada (oportunidade)",
  PEER_INTEREST_FOUND: "Interesse recebido",
  PENDING_ADMIN_APPROVAL: "Aguardando aprovação",
  APPROVED: "Aprovada",
  REJECTED: "Recusada",
  EXPIRED: "Expirada",
  CANCELLED: "Cancelada",
};

type CotaRow = {
  id: string;
  numeroCota: string;
  property: { id: string; name: string };
};

type WeekRow = {
  id: string;
  weekIndex: number;
  label: string | null;
  startDate: string;
  endDate: string;
  isBlocked: boolean;
  isExchangeAllowed: boolean;
};

/** Rótulo completo para o cotista escolher: nome + datas (nunca só “Semana N”). */
function labelSemanaComDatas(w: WeekRow): string {
  const nome = w.label ?? `Semana ${w.weekIndex}`;
  const d1 = format(new Date(w.startDate), "dd/MM/yyyy", { locale: ptBR });
  const d2 = format(new Date(w.endDate), "dd/MM/yyyy", { locale: ptBR });
  return `${nome} · ${d1} – ${d2}`;
}

export default function TrocasPage() {
  const year = new Date().getFullYear();
  const [loading, setLoading] = useState(true);
  const [blocos, setBlocos] = useState<
    Array<{
      propertyId: string;
      propertyName: string;
      cotaId: string;
      numeroCota: string;
      weeks: WeekRow[];
      myWeekIds: string[];
    }>
  >([]);
  const [oportunidades, setOportunidades] = useState<
    Array<{
      id: string;
      createdAt: string;
      property: { name: string };
      cotista: { name: string };
      ownedWeek: { label: string | null; weekIndex: number };
    }>
  >([]);
  const [solicitacoes, setSolicitacoes] = useState<
    Array<{
      id: string;
      status: string;
      createdAt: string;
      property: { name: string };
      ownedWeek: { label: string | null; weekIndex: number };
    }>
  >([]);
  const [legado, setLegado] = useState<
    Array<{ id: string; status: string; createdAt: string; observacoes: string | null }>
  >([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formPropertyId, setFormPropertyId] = useState("");
  const [formCotaId, setFormCotaId] = useState("");
  const [formOwnedWeekId, setFormOwnedWeekId] = useState("");
  const [formDesiredWeekId, setFormDesiredWeekId] = useState<string | undefined>(undefined);
  const [formNotes, setFormNotes] = useState("");
  const [formAlt, setFormAlt] = useState(true);
  const [formPublic, setFormPublic] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [rCotas, rOp, rReq, rLeg] = await Promise.all([
        fetch("/api/cotistas/me/cotas", { credentials: "include" }),
        fetch("/api/cotistas/me/trocas-oportunidades", { credentials: "include" }),
        fetch("/api/cotistas/me/week-exchange-requests", { credentials: "include" }),
        fetch("/api/cotistas/me/trocas", { credentials: "include" }),
      ]);
      const jCotas = rCotas.ok ? await rCotas.json() : { cotas: [] };
      const jOp = rOp.ok ? await rOp.json() : { oportunidades: [] };
      const jReq = rReq.ok ? await rReq.json() : { requests: [] };
      const jLeg = rLeg.ok ? await rLeg.json() : { trocas: [] };

      setOportunidades(jOp.oportunidades ?? []);
      setSolicitacoes(jReq.requests ?? []);
      setLegado(jLeg.trocas ?? []);

      const cotas = (jCotas.cotas ?? []) as CotaRow[];
      const out: Array<{
        propertyId: string;
        propertyName: string;
        cotaId: string;
        numeroCota: string;
        weeks: WeekRow[];
        myWeekIds: string[];
      }> = [];

      await Promise.all(
        cotas.map(async (c) => {
          const r = await fetch(
            `/api/cotistas/me/property-weeks?propertyId=${encodeURIComponent(c.property.id)}&cotaId=${encodeURIComponent(c.id)}&year=${year}`,
            { credentials: "include" }
          );
          const j = r.ok ? await r.json() : null;
          out.push({
            propertyId: c.property.id,
            propertyName: c.property.name,
            cotaId: c.id,
            numeroCota: c.numeroCota,
            weeks: j?.weeks ?? [],
            myWeekIds: j?.myPropertyWeekIds ?? [],
          });
        })
      );
      setBlocos(out);
    } catch {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    void load();
  }, [load]);

  const abrirTroca = (
    propertyId: string,
    cotaId: string,
    ownedWeekId: string
  ) => {
    setFormPropertyId(propertyId);
    setFormCotaId(cotaId);
    setFormOwnedWeekId(ownedWeekId);
    setFormDesiredWeekId(undefined);
    setFormNotes("");
    setFormAlt(true);
    setFormPublic(false);
    setDialogOpen(true);
  };

  const enviarSolicitacao = async () => {
    if (!formPropertyId || !formCotaId || !formOwnedWeekId) {
      toast.error("Dados incompletos");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/cotistas/me/week-exchange-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: formPropertyId,
          cotaId: formCotaId,
          ownedPropertyWeekId: formOwnedWeekId,
          desiredPropertyWeekId: formDesiredWeekId || undefined,
          notes: formNotes.trim() || undefined,
          acceptsAlternatives: formAlt,
          publicToPeers: formPublic,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Solicitação enviada. A administração vai analisar — nada é automático.");
        setDialogOpen(false);
        await load();
      } else {
        toast.error(data.error || "Não foi possível enviar");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const blocoAtual = blocos.find((b) => b.propertyId === formPropertyId);
  const semanasDisponiveis = blocoAtual?.weeks ?? [];
  const minhaSemana = semanasDisponiveis.find((w) => w.id === formOwnedWeekId);
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2 flex items-center gap-2">
          <CalendarDays className="w-8 h-8 text-vivant-green" />
          Troca de semanas
        </h1>
        <p className="text-[#1A2F4B]/70 max-w-3xl">
          Aqui você <strong>solicita troca</strong> das suas semanas (sempre mediada pela administração).
          Para ver o resumo por cota e o calendário completo, use{" "}
          <Link href="/dashboard/minhas-semanas" className="font-medium text-vivant-green hover:underline">
            Minhas semanas
          </Link>
          .
        </p>
      </div>

      <div className="flex items-start gap-2 p-4 rounded-lg bg-blue-50/80 border border-blue-100 text-sm text-[#1A2F4B]/90">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p>
          Nenhuma troca é concluída sozinha: o administrador analisa, pode publicar para outros
          cotistas da <strong>mesma propriedade</strong> e só então há negociação. Semanas só existem
          se o admin tiver planejado e distribuído no painel Vivant Care.
        </p>
      </div>

      {/* 1 — Minhas semanas */}
      <section className="space-y-4" id="minhas-semanas">
        <h2 className="text-lg font-semibold text-[#1A2F4B] flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-vivant-green" />
          Suas semanas ({year})
        </h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
          </div>
        ) : blocos.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-[#1A2F4B]/70">
              Nenhuma cota ativa encontrada.
            </CardContent>
          </Card>
        ) : (
          blocos.map((b) => (
            <Card key={b.cotaId} className="border border-slate-200 shadow-md overflow-hidden">
              <CardHeader className="bg-slate-50/80 border-b border-slate-100 py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-vivant-green" />
                  {b.propertyName}
                  <span className="font-normal text-[#1A2F4B]/70">
                    · {b.numeroCota}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {b.weeks.length === 0 ? (
                  <p className="text-sm text-[#1A2F4B]/70">
                    O administrador ainda não cadastrou semanas para {year} neste imóvel.
                  </p>
                ) : b.myWeekIds.length === 0 ? (
                  <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
                    Ainda não há semanas <strong>alocadas à sua cota</strong> neste ciclo. Peça ao
                    administrador para usar <em>Distribuir semanas</em> no painel da propriedade.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {b.weeks
                      .filter((w) => b.myWeekIds.includes(w.id))
                      .map((w) => (
                        <li
                          key={w.id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3"
                        >
                          <div>
                            <p className="font-medium text-[#1A2F4B]">
                              {w.label ?? `Semana ${w.weekIndex}`}
                            </p>
                            <p className="text-xs text-[#1A2F4B]/65">
                              {format(new Date(w.startDate), "dd/MM", { locale: ptBR })} –{" "}
                              {format(new Date(w.endDate), "dd/MM/yyyy", { locale: ptBR })}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="bg-vivant-green hover:bg-vivant-green/90"
                            disabled={w.isBlocked || !w.isExchangeAllowed}
                            onClick={() => abrirTroca(b.propertyId, b.cotaId, w.id)}
                          >
                            Solicitar troca
                          </Button>
                        </li>
                      ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </section>

      {/* 2 — Oportunidades / vagas */}
      <section className="space-y-4" id="oportunidades">
        <h2 className="text-lg font-semibold text-[#1A2F4B] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Oportunidades na sua casa
        </h2>
        <p className="text-sm text-[#1A2F4B]/70">
          Publicações feitas pelo admin para cotistas da <strong>mesma propriedade</strong> — não
          aparecem para outras casas.
        </p>
        {oportunidades.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-[#1A2F4B]/60 text-sm">
              Nenhuma oportunidade aberta no momento.
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-2">
            {oportunidades.slice(0, 5).map((o) => (
              <li
                key={o.id}
                className="rounded-lg border border-amber-200/60 bg-amber-50/50 px-4 py-3 text-sm"
              >
                <span className="font-medium text-[#1A2F4B]">{o.property.name}</span>
                {" — "}
                {o.cotista.name}: {o.ownedWeek.label ?? `Semana ${o.ownedWeek.weekIndex}`}
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/dashboard/oportunidades-trocas"
          className="text-sm font-medium text-vivant-green hover:underline"
        >
          Ver todas as oportunidades →
        </Link>
      </section>

      {/* 3 — Solicitações novas */}
      <section className="space-y-4" id="solicitacoes">
        <h2 className="text-lg font-semibold text-[#1A2F4B] flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-vivant-green" />
          Suas solicitações de troca
        </h2>
        {solicitacoes.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-[#1A2F4B]/60 text-sm">
              Você ainda não enviou solicitações pelo novo fluxo. Use &quot;Solicitar troca&quot; em
              uma das suas semanas acima.
            </CardContent>
          </Card>
        ) : (
          <ul className="space-y-2">
            {solicitacoes.map((s) => (
              <li
                key={s.id}
                className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm flex flex-wrap justify-between gap-2"
              >
                <span>
                  <strong>{s.property.name}</strong> —{" "}
                  {s.ownedWeek.label ?? `Semana ${s.ownedWeek.weekIndex}`}
                </span>
                <span className="text-vivant-green font-medium">
                  {STATUS_NOVO[s.status] ?? s.status}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/dashboard/solicitacoes-trocas"
          className="text-sm font-medium text-vivant-green hover:underline"
        >
          Ver histórico detalhado →
        </Link>
      </section>

      {/* 4 — Legado */}
      {legado.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-medium text-[#1A2F4B]/80">Solicitações antigas (legado)</h2>
          <ul className="space-y-2">
            {legado.map((t) => (
              <li key={t.id} className="text-sm border border-slate-100 rounded-md px-3 py-2">
                <Link href={`/dashboard/trocas/${t.id}`} className="text-vivant-navy hover:underline">
                  {format(new Date(t.createdAt), "dd/MM/yyyy", { locale: ptBR })}
                </Link>
                {" · "}
                {STATUS_LEGADO[t.status] ?? t.status}
              </li>
            ))}
          </ul>
        </section>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Solicitar troca de semana</DialogTitle>
          </DialogHeader>
          {minhaSemana && (
            <p className="text-sm text-[#1A2F4B]/80">
              Sua semana:{" "}
              <strong>
                {minhaSemana.label ?? `Semana ${minhaSemana.weekIndex}`}
              </strong>
              {" — "}
              {format(new Date(minhaSemana.startDate), "dd/MM", { locale: ptBR })} a{" "}
              {format(new Date(minhaSemana.endDate), "dd/MM/yyyy", { locale: ptBR })}
            </p>
          )}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Semana desejada (opcional)</Label>
              <Select
                value={formDesiredWeekId ?? "__none__"}
                onValueChange={(v) =>
                  setFormDesiredWeekId(v === "__none__" ? undefined : v)
                }
              >
                <SelectTrigger className="h-auto min-h-10 whitespace-normal py-2 text-left">
                  <SelectValue placeholder="Qualquer — a administração sugere" />
                </SelectTrigger>
                <SelectContent className="max-h-72">
                  <SelectItem value="__none__">Nenhuma em específico</SelectItem>
                  {semanasDisponiveis
                    .filter((w) => w.id !== formOwnedWeekId)
                    .map((w) => (
                      <SelectItem
                        key={w.id}
                        value={w.id}
                        className="whitespace-normal py-2.5 text-left text-sm leading-snug"
                      >
                        {labelSemanaComDatas(w)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="Ex.: prefiro alta temporada, aceito janela em julho..."
                rows={3}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={formAlt}
                onCheckedChange={(c) => setFormAlt(c === true)}
              />
              Aceito alternativas sugeridas pela administração
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={formPublic}
                onCheckedChange={(c) => setFormPublic(c === true)}
              />
              Autorizo publicar para outros cotistas deste imóvel (se o admin aprovar)
            </label>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-vivant-green hover:bg-vivant-green/90"
              disabled={submitting}
              onClick={() => void enviarSolicitacao()}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar solicitação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
