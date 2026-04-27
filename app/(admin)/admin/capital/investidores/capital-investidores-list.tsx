"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Loader2, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

type Investidor = {
  id: string;
  status: string;
  tipoPessoa: string;
  user: { id: string; name: string; email: string };
  _count: { participations: number; liquidityRequests: number };
  meta?: {
    tipo?: string;
    perfil?: string;
    kycStatus?: string;
    telefone?: string;
    observacoes?: string;
  };
};

export function CapitalInvestidoresList({ investidores }: { investidores: Investidor[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const deleteInvestidor = async (id: string, name: string) => {
    if (!confirm(`Excluir investidor "${name}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/capital/investidores/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao excluir investidor");
        return;
      }
      toast.success("Investidor excluído.");
      router.refresh();
    } catch {
      toast.error("Erro ao excluir investidor");
    } finally {
      setDeletingId(null);
    }
  };

  const editInvestidor = async (inv: Investidor) => {
    const novoTipo = prompt(
      "Tipo (PESSOA_FISICA | PESSOA_JURIDICA | INSTITUCIONAL):",
      inv.meta?.tipo ?? "PESSOA_FISICA"
    );
    if (!novoTipo) return;
    const novoPerfil = prompt(
      "Perfil (QUALIFICADO | PROFISSIONAL | INSTITUCIONAL):",
      inv.meta?.perfil ?? "QUALIFICADO"
    );
    if (!novoPerfil) return;
    const novoKyc = prompt(
      "KYC (PENDENTE | APROVADO | REPROVADO):",
      inv.meta?.kycStatus ?? "PENDENTE"
    );
    if (!novoKyc) return;
    setSavingId(inv.id);
    try {
      const res = await fetch(`/api/admin/capital/investidores/${inv.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipoPessoa:
            novoTipo === "PESSOA_JURIDICA" ? "PJ" : novoTipo === "INSTITUCIONAL" ? "INSTITUCIONAL" : "PF",
          documento: `__CAPITAL_INVESTOR_META__:${JSON.stringify({
            ...inv.meta,
            tipo: novoTipo,
            perfil: novoPerfil,
            kycStatus: novoKyc,
          })}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? "Erro ao atualizar investidor");
        return;
      }
      toast.success("Investidor atualizado.");
      router.refresh();
    } catch {
      toast.error("Erro ao atualizar investidor");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {investidores.map((inv) => (
        <Card key={inv.id} className="border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-vivant-navy" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-vivant-navy">{inv.user.name}</h3>
                  <p className="text-sm text-gray-600">{inv.user.email}</p>
                  <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                    <span>{inv._count.participations} participação(ões)</span>
                    <span>{inv._count.liquidityRequests} solicitação(ões)</span>
                    <span>{inv.meta?.tipo ?? inv.tipoPessoa}</span>
                    <span>Perfil: {inv.meta?.perfil ?? "QUALIFICADO"}</span>
                    <span>KYC: {inv.meta?.kycStatus ?? "PENDENTE"}</span>
                    <span className={`px-2 py-0.5 rounded ${inv.status === "ATIVO" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 whitespace-nowrap">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => editInvestidor(inv)}
                  className="h-8 w-8 border border-gray-200 text-vivant-navy hover:bg-gray-50"
                  aria-label="Editar investidor"
                  title="Editar investidor"
                  disabled={savingId === inv.id}
                >
                  {savingId === inv.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Pencil className="w-4.5 h-4.5" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteInvestidor(inv.id, inv.user.name)}
                  className="h-8 w-8 border border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                  aria-label="Excluir investidor"
                  title="Excluir investidor"
                  disabled={deletingId === inv.id}
                >
                  {deletingId === inv.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
