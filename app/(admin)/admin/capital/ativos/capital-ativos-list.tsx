"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Ativo = {
  id: string;
  totalCotas: number;
  valorPorCota: number;
  taxaAdministracaoPercent: number;
  enabled: boolean;
  ativoStatus: string;
  property: { id: string; name: string; slug: string; location: string; priceValue: number | null } | null;
  _count: { participations: number };
};

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export function CapitalAtivosList({ ativos }: { ativos: Ativo[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteAtivo = async (id: string, name: string) => {
    if (!confirm(`Excluir o ativo "${name}"? Participações, distribuições e dados vinculados serão removidos. Esta ação não pode ser desfeita.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/capital/ativos/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Ativo excluído");
        router.refresh();
      } else {
        toast.error(data.error ?? "Erro ao excluir ativo");
      }
    } catch {
      toast.error("Erro ao excluir ativo");
    } finally {
      setDeletingId(null);
    }
  };

  if (ativos.length === 0) return null;

  return (
    <div className="space-y-4">
      {ativos.map((a) => (
          <Card key={a.id} className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-6 h-6 text-vivant-navy" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-vivant-navy">{a.property?.name ?? "—"}</h3>
                    <p className="text-sm text-gray-600">{a.property?.location ?? "—"}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                      <span>{a.totalCotas} cotas</span>
                      <span>Valor/cota: {fmt(a.valorPorCota)}</span>
                      <span>Taxa adm: {a.taxaAdministracaoPercent}%</span>
                      <span>{a._count.participations} participação(ões)</span>
                      <span className={`px-2 py-0.5 rounded ${a.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {a.enabled ? "Ativo" : "Inativo"}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100">{a.ativoStatus}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/capital/ativos/${a.id}`}>
                      Configurar
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteAtivo(a.id, a.property?.name ?? "Ativo")}
                    disabled={deletingId === a.id}
                  >
                    {deletingId === a.id ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Trash2 className="w-4 h-4 mr-1" />}
                    Excluir
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
      ))}
    </div>
  );
}
