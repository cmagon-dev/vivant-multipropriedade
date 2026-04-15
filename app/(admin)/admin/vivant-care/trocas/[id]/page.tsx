"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, User, Building2, Calendar } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import type { WeekExchangeRequestStatus } from "@prisma/client";

const STATUS_LABEL: Record<WeekExchangeRequestStatus, string> = {
  REQUESTED: "Solicitada",
  UNDER_ADMIN_REVIEW: "Em análise",
  ADMIN_OPTION_FOUND: "Opção encontrada",
  PUBLISHED_TO_PEERS: "Publicada aos pares",
  PEER_INTEREST_FOUND: "Interesse de par",
  NEGOTIATION_IN_PROGRESS: "Em negociação",
  PENDING_ADMIN_APPROVAL: "Aguardando aprovação",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
  EXPIRED: "Expirada",
  CANCELLED: "Cancelada",
};

const TERMINAL: WeekExchangeRequestStatus[] = [
  "APPROVED",
  "REJECTED",
  "CANCELLED",
  "EXPIRED",
];

type WeekBrief = {
  id: string;
  weekIndex: number;
  startDate: string;
  endDate: string;
  description: string | null;
};

export default function TrocaDetalheAdminPage() {
  const params = useParams();
  const id = params.id as string;
  const [t, setT] = useState<{
    status: WeekExchangeRequestStatus;
    notes: string | null;
    adminNotes: string | null;
    createdAt: string;
    cotista?: { name?: string | null; email?: string | null };
    property?: { name?: string | null };
    cota?: { numeroCota?: number | null };
    ownedWeek?: WeekBrief | null;
    desiredWeek?: WeekBrief | null;
    peerInterests?: Array<{
      id: string;
      status: string;
      interestedCotista?: { name?: string | null };
      offeredWeek?: WeekBrief | null;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/trocas/" + id)
      .then((res) => (res.ok ? res.json() : null))
      .then(setT)
      .catch(() => setT(null))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus: WeekExchangeRequestStatus) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/trocas/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success("Status atualizado.");
        setT(await res.json());
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao atualizar");
      }
    } catch {
      toast.error("Erro ao atualizar");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-10 h-10 text-vivant-navy animate-spin" />
      </div>
    );
  }

  if (!t) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Solicitação não encontrada.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/vivant-care/trocas">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }

  const canChangeStatus = !TERMINAL.includes(t.status);

  const formatWeek = (w: WeekBrief) => (
    <>
      Semana {w.weekIndex}
      {w.description ? ` — ${w.description}` : ""} ·{" "}
      {format(new Date(w.startDate), "dd MMM yyyy", { locale: ptBR })} →{" "}
      {format(new Date(w.endDate), "dd MMM yyyy", { locale: ptBR })}
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/vivant-care/trocas">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-vivant-navy">Solicitação de troca</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <User className="w-4 h-4" />
                {t.cotista?.name ?? "—"} ({t.cotista?.email})
              </span>
              <span
                className={`px-2 py-0.5 rounded ${
                  t.status === "APPROVED"
                    ? "bg-green-100 text-green-700"
                    : TERMINAL.includes(t.status)
                      ? "bg-gray-100 text-gray-600"
                      : "bg-amber-100 text-amber-800"
                }`}
              >
                {STATUS_LABEL[t.status] ?? t.status}
              </span>
              <span>
                {format(new Date(t.createdAt), "dd MMM yyyy HH:mm", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>
        {canChangeStatus && (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateStatus("APPROVED")}
              disabled={updating}
            >
              Aprovar
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-red-600"
              onClick={() => updateStatus("REJECTED")}
              disabled={updating}
            >
              Rejeitar
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {t.property?.name && (
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <Building2 className="w-4 h-4 shrink-0" />
              {t.property.name}
              {t.cota?.numeroCota != null && (
                <span className="text-gray-500">· Cota {t.cota.numeroCota}</span>
              )}
            </p>
          )}
          {t.notes && (
            <div>
              <h3 className="font-semibold text-vivant-navy mb-1">Observações do cotista</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{t.notes}</p>
            </div>
          )}
          {t.adminNotes && (
            <div>
              <h3 className="font-semibold text-vivant-navy mb-1">Notas internas</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{t.adminNotes}</p>
            </div>
          )}
          {(t.ownedWeek || t.desiredWeek) && (
            <div>
              <h3 className="font-semibold text-vivant-navy mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Semanas oficiais
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {t.ownedWeek && (
                  <li>
                    <span className="font-medium text-vivant-navy">Oferece: </span>
                    {formatWeek(t.ownedWeek)}
                  </li>
                )}
                {t.desiredWeek && (
                  <li>
                    <span className="font-medium text-vivant-navy">Deseja: </span>
                    {formatWeek(t.desiredWeek)}
                  </li>
                )}
              </ul>
            </div>
          )}
          {t.peerInterests && t.peerInterests.length > 0 && (
            <div>
              <h3 className="font-semibold text-vivant-navy mb-2">Interesses de pares</h3>
              <ul className="space-y-2 text-sm">
                {t.peerInterests.map((p) => (
                  <li key={p.id} className="text-gray-700">
                    {p.interestedCotista?.name ?? "—"} — {p.status}
                    {p.offeredWeek && (
                      <span className="block text-gray-600 mt-0.5">
                        Oferece semana {p.offeredWeek.weekIndex} (
                        {format(new Date(p.offeredWeek.startDate), "dd/MM/yyyy", {
                          locale: ptBR,
                        })}
                        )
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
