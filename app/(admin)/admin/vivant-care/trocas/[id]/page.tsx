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

const STATUS_LABEL: Record<string, string> = {
  ABERTA: "Aberta",
  EM_NEGOCIACAO: "Em negociação",
  ACEITA: "Aceita",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
  EXPIRADA: "Expirada",
};

export default function TrocaDetalheAdminPage() {
  const params = useParams();
  const id = params.id as string;
  const [t, setT] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/trocas/" + id)
      .then((res) => (res.ok ? res.json() : null))
      .then(setT)
      .catch(() => setT(null))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus: string) => {
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

  const canChangeStatus = ["ABERTA", "EM_NEGOCIACAO"].includes(t.status);

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
                {t.solicitante?.name ?? "—"} ({t.solicitante?.email})
              </span>
              <span className={`px-2 py-0.5 rounded ${t.status === "CONCLUIDA" ? "bg-green-100 text-green-700" : t.status === "CANCELADA" || t.status === "EXPIRADA" ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-800"}`}>
                {STATUS_LABEL[t.status] ?? t.status}
              </span>
              <span>{format(new Date(t.createdAt), "dd MMM yyyy HH:mm", { locale: ptBR })}</span>
            </div>
          </div>
        </div>
        {canChangeStatus && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => updateStatus("ACEITA")} disabled={updating}>
              Aprovar
            </Button>
            <Button size="sm" variant="outline" className="text-red-600" onClick={() => updateStatus("CANCELADA")} disabled={updating}>
              Reprovar
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          {t.observacoes && (
            <div>
              <h3 className="font-semibold text-vivant-navy mb-1">Observações</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{t.observacoes}</p>
            </div>
          )}
          {t.reservas?.length > 0 && (
            <div>
              <h3 className="font-semibold text-vivant-navy mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Semanas/reservas
              </h3>
              <ul className="space-y-2">
                {t.reservas.map((r: any) => (
                  <li key={r.id} className="text-sm text-gray-700">
                    {r.cota?.property?.name ?? "—"} — Semana {r.numeroSemana} ({format(new Date(r.dataInicio), "dd MMM yyyy", { locale: ptBR })})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {t.concluidaEm && (
            <p className="text-sm text-gray-500">Concluída em {format(new Date(t.concluidaEm), "dd MMM yyyy HH:mm", { locale: ptBR })}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
