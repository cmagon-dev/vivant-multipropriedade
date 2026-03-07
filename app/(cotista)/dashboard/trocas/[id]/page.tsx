"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ArrowRightLeft, Building2 } from "lucide-react";
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

export default function TrocaDetalheCotistaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [t, setT] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetch("/api/cotistas/me/trocas/" + id)
      .then((res) => (res.ok ? res.json() : null))
      .then(setT)
      .catch(() => setT(null))
      .finally(() => setLoading(false));
  }, [id]);

  const cancelar = async () => {
    if (!t || t.status !== "ABERTA") return;
    setCancelling(true);
    try {
      const res = await fetch("/api/cotistas/me/trocas/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelar: true }),
      });
      if (res.ok) {
        toast.success("Solicitação cancelada.");
        setT(await res.json());
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao cancelar");
      }
    } catch {
      toast.error("Erro ao cancelar");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
      </div>
    );
  }

  if (!t) {
    return (
      <div className="text-center py-12">
        <p className="text-[#1A2F4B]/70">Solicitação não encontrada.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/trocas">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/dashboard/trocas">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1A2F4B]">Solicitação de troca</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-[#1A2F4B]/70">
              <span>{format(new Date(t.createdAt), "dd MMM yyyy HH:mm", { locale: ptBR })}</span>
              <span className={`px-2 py-0.5 rounded ${
                t.status === "CONCLUIDA" ? "bg-green-100 text-green-700" :
                t.status === "CANCELADA" || t.status === "EXPIRADA" ? "bg-gray-100 text-gray-600" :
                "bg-amber-100 text-amber-800"
              }`}>
                {STATUS_LABEL[t.status] ?? t.status}
              </span>
            </div>
          </div>
        </div>
        {t.status === "ABERTA" && (
          <Button variant="outline" onClick={cancelar} disabled={cancelling} className="border-red-200 text-red-700 hover:bg-red-50">
            {cancelling ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Cancelar solicitação
          </Button>
        )}
      </div>

      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[#1A2F4B] mb-2 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            Detalhes
          </h3>
          {t.observacoes && (
            <p className="whitespace-pre-wrap text-[#1A2F4B]/80 mb-4">{t.observacoes}</p>
          )}
          {t.reservas?.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-[#1A2F4B]/80 mb-2">Reservas vinculadas</h4>
              <ul className="space-y-2">
                {t.reservas.map((r: any) => (
                  <li key={r.id} className="flex items-center gap-2 text-sm text-[#1A2F4B]/80">
                    <Building2 className="w-4 h-4 text-vivant-green" />
                    {r.cota?.property?.name ?? "—"} — Semana {r.numeroSemana} ({r.ano})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!t.observacoes && (!t.reservas || t.reservas.length === 0) && (
            <p className="text-[#1A2F4B]/60 text-sm">Nenhum detalhe adicional.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
