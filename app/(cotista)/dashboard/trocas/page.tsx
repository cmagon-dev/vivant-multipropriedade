"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRightLeft, Loader2, Building2 } from "lucide-react";
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

interface Troca {
  id: string;
  status: string;
  observacoes: string | null;
  createdAt: string;
  reservas?: { cota?: { property?: { name: string } } }[];
}

export default function TrocasPage() {
  const [trocas, setTrocas] = useState<Troca[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/cotistas/me/trocas")
      .then((res) => (res.ok ? res.json() : { trocas: [] }))
      .then((data) => setTrocas(data.trocas || []))
      .catch(() => setTrocas([]))
      .finally(() => setLoading(false));
  }, []);

  const criarSolicitacao = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/cotistas/me/trocas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ observacoes: "Solicitação de troca de semanas" }),
      });
      if (res.ok) {
        toast.success("Solicitação criada. A administração analisará em breve.");
        const t = await res.json();
        setTrocas((prev) => [t, ...prev]);
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao criar solicitação");
      }
    } catch {
      toast.error("Erro ao criar solicitação");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">
            Troca de Semanas
          </h1>
          <p className="text-[#1A2F4B]/70">
            Solicite a troca de suas semanas
          </p>
        </div>
        <Button className="bg-vivant-green hover:bg-vivant-green/90" onClick={criarSolicitacao} disabled={creating}>
          <Plus className="w-4 h-4 mr-2" />
          Nova solicitação
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
        </div>
      ) : trocas.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="p-12 text-center">
            <ArrowRightLeft className="w-12 h-12 text-[#1A2F4B]/30 mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold text-[#1A2F4B] mb-2">Nenhuma solicitação</h2>
            <p className="text-[#1A2F4B]/70 mb-6">Você ainda não enviou solicitações de troca. Clique em &quot;Nova solicitação&quot; para começar.</p>
            <Button className="bg-vivant-green hover:bg-vivant-green/90" onClick={criarSolicitacao} disabled={creating}>
              <Plus className="w-4 h-4 mr-2" />
              Nova solicitação
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {trocas.map((t) => (
            <Card key={t.id} className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-vivant-green/10 flex items-center justify-center flex-shrink-0">
                      <ArrowRightLeft className="w-6 h-6 text-vivant-green" />
                    </div>
                    <div>
                      <Link href={"/dashboard/trocas/" + t.id} className="font-bold text-[#1A2F4B] hover:underline">
                        Solicitação de troca
                      </Link>
                      <p className="text-sm text-[#1A2F4B]/70 mt-0.5">
                        {format(new Date(t.createdAt), "dd MMM yyyy HH:mm", { locale: ptBR })}
                      </p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
                        t.status === "CONCLUIDA" ? "bg-green-100 text-green-700" :
                        t.status === "CANCELADA" || t.status === "EXPIRADA" ? "bg-gray-100 text-gray-600" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {STATUS_LABEL[t.status] ?? t.status}
                      </span>
                      {t.observacoes && <p className="text-sm text-[#1A2F4B]/70 mt-2 line-clamp-2">{t.observacoes}</p>}
                    </div>
                  </div>
                  <Link href={"/dashboard/trocas/" + t.id} className="text-sm font-medium text-vivant-green hover:underline shrink-0">
                    Ver detalhes
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
