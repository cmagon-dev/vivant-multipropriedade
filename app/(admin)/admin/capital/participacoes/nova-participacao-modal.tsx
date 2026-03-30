"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PieChart, Loader2 } from "lucide-react";
import { toast } from "sonner";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

type Investor = { id: string; user: { name: string; email: string } };
type Ativo = { id: string; valorPorCota: number; totalCotas: number; property: { name: string } };

export function NovaParticipacaoModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [investidores, setInvestidores] = useState<Investor[]>([]);
  const [ativos, setAtivos] = useState<Ativo[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [investorProfileId, setInvestorProfileId] = useState("");
  const [assetConfigId, setAssetConfigId] = useState("");
  const [numeroCotas, setNumeroCotas] = useState("");
  const [valorAportado, setValorAportado] = useState("");

  useEffect(() => {
    if (open) {
      setLoading(true);
      setInvestorProfileId("");
      setAssetConfigId("");
      setNumeroCotas("");
      setValorAportado("");
      Promise.all([
        fetch("/api/admin/capital/investidores").then((r) => r.json()),
        fetch("/api/admin/capital/ativos").then((r) => r.json()),
      ])
        .then(([invRes, ativosRes]) => {
          setInvestidores(Array.isArray(invRes?.investidores) ? invRes.investidores : []);
          setAtivos(Array.isArray(ativosRes?.ativos) ? ativosRes.ativos : []);
        })
        .catch(() => toast.error("Erro ao carregar dados"))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const ativoSelecionado = ativos.find((a) => a.id === assetConfigId);
  const valorSugerido =
    ativoSelecionado && numeroCotas && /^\d+$/.test(numeroCotas)
      ? ativoSelecionado.valorPorCota * Number(numeroCotas)
      : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cotas = Number(numeroCotas);
    if (!investorProfileId || !assetConfigId || !numeroCotas.trim() || isNaN(cotas) || cotas < 1) {
      toast.error("Preencha investidor, ativo e número de cotas (mín. 1)");
      return;
    }
    setSubmitting(true);
    try {
      const body: { investorProfileId: string; assetConfigId: string; numeroCotas: number; valorAportado?: number } = {
        investorProfileId,
        assetConfigId,
        numeroCotas: cotas,
      };
      if (valorAportado.trim() && !isNaN(Number(valorAportado))) {
        body.valorAportado = Number(valorAportado);
      }
      const res = await fetch("/api/admin/capital/participacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Participação criada. O investidor está vinculado ao ativo.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(data.error ?? "Erro ao criar participação");
      }
    } catch {
      toast.error("Erro ao criar participação");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vivant-navy hover:bg-vivant-navy/90">
          <PieChart className="w-4 h-4 mr-2" />
          Nova participação
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova participação</DialogTitle>
          <DialogDescription>
            Vincule um investidor a um ativo informando a quantidade de cotas. O valor aportado pode ser preenchido ou calculado automaticamente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {loading ? (
            <p className="text-sm text-gray-500 flex items-center gap-2 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Carregando investidores e ativos…
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Investidor</Label>
                <Select value={investorProfileId} onValueChange={setInvestorProfileId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o investidor" />
                  </SelectTrigger>
                  <SelectContent>
                    {investidores.map((inv) => (
                      <SelectItem key={inv.id} value={inv.id}>
                        {inv.user?.name ?? "—"} ({inv.user?.email ?? ""})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {investidores.length === 0 && (
                  <p className="text-xs text-gray-500">Cadastre investidores em Investidores → Vincular usuário.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Ativo</Label>
                <Select value={assetConfigId} onValueChange={setAssetConfigId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ativo" />
                  </SelectTrigger>
                  <SelectContent>
                    {ativos.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.property?.name ?? a.id} (valor/cota: {fmt(a.valorPorCota)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {ativos.length === 0 && (
                  <p className="text-xs text-gray-500">Cadastre ativos em Ativos → Vincular imóvel.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroCotas">Número de cotas *</Label>
                <Input
                  id="numeroCotas"
                  type="number"
                  min={1}
                  max={ativoSelecionado?.totalCotas ?? 999999}
                  placeholder="Ex: 10"
                  value={numeroCotas}
                  onChange={(e) => setNumeroCotas(e.target.value)}
                />
                {ativoSelecionado && (
                  <p className="text-xs text-gray-500">Máximo {ativoSelecionado.totalCotas} cotas neste ativo.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorAportado">Valor aportado (opcional)</Label>
                <Input
                  id="valorAportado"
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder={valorSugerido != null ? fmt(valorSugerido) : "Calculado automaticamente"}
                  value={valorAportado}
                  onChange={(e) => setValorAportado(e.target.value)}
                />
                {valorSugerido != null && !valorAportado && (
                  <p className="text-xs text-gray-500">Sugestão: {fmt(valorSugerido)} ({numeroCotas} × {fmt(ativoSelecionado!.valorPorCota)}/cota)</p>
                )}
              </div>
            </>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting || loading || !investorProfileId || !assetConfigId || !numeroCotas.trim()}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Criar participação
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
