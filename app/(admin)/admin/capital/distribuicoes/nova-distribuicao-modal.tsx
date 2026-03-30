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
import { DollarSign, Loader2 } from "lucide-react";
import { toast } from "sonner";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

type Ativo = { id: string; property: { name: string } };

export function NovaDistribuicaoModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [ativos, setAtivos] = useState<Ativo[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [assetConfigId, setAssetConfigId] = useState("");
  const [competencia, setCompetencia] = useState("");
  const [receitaBruta, setReceitaBruta] = useState("");
  const [custos, setCustos] = useState("");
  const [taxaAdministracaoValor, setTaxaAdministracaoValor] = useState("");
  const [reservaValor, setReservaValor] = useState("");

  useEffect(() => {
    if (open) {
      setLoading(true);
      setAssetConfigId("");
      setCompetencia("");
      setReceitaBruta("");
      setCustos("");
      setTaxaAdministracaoValor("");
      setReservaValor("");
      fetch("/api/admin/capital/ativos")
        .then((r) => r.json())
        .then((data) => setAtivos(Array.isArray(data?.ativos) ? data.ativos : []))
        .catch(() => toast.error("Erro ao carregar ativos"))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const hoje = new Date();
  const mesAnoPadrao = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;

  const rec = Number(receitaBruta) || 0;
  const cust = Number(custos) || 0;
  const taxAdm = Number(taxaAdministracaoValor) || 0;
  const reserva = Number(reservaValor) || 0;
  const resultadoCalculado = rec - cust - taxAdm - reserva;

  const competenciaFinal = competencia.trim() || mesAnoPadrao;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetConfigId) {
      toast.error("Selecione o ativo.");
      return;
    }
    if (receitaBruta === "" || custos === "") {
      toast.error("Receita bruta e custos são obrigatórios.");
      return;
    }
    const recNum = Number(receitaBruta);
    const custNum = Number(custos);
    if (isNaN(recNum) || isNaN(custNum)) {
      toast.error("Receita e custos devem ser números.");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        assetConfigId,
        competencia: competenciaFinal,
        receitaBruta: recNum,
        custos: custNum,
        taxaAdministracaoValor: taxAdm || undefined,
        reservaValor: reserva || undefined,
        resultadoDistribuivel: resultadoCalculado,
        status: "RASCUNHO",
      };
      const res = await fetch("/api/admin/capital/distribuicoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Distribuição criada. Os itens por investidor foram gerados. Abra 'Ver detalhes' para aprovar ou marcar como paga.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(data.error ?? "Erro ao criar distribuição");
      }
    } catch {
      toast.error("Erro ao criar distribuição");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vivant-navy hover:bg-vivant-navy/90">
          <DollarSign className="w-4 h-4 mr-2" />
          Nova distribuição
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova distribuição</DialogTitle>
          <DialogDescription>
            Registre o resultado de um ativo em uma competência (mês/ano). O sistema gera automaticamente os itens por investidor conforme a participação de cada um.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {loading ? (
            <p className="text-sm text-gray-500 flex items-center gap-2 py-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              Carregando ativos…
            </p>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Ativo</Label>
                <Select value={assetConfigId} onValueChange={setAssetConfigId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o ativo" />
                  </SelectTrigger>
                  <SelectContent>
                    {ativos.map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.property?.name ?? a.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {ativos.length === 0 && (
                  <p className="text-xs text-gray-500">Cadastre ativos em Ativos → Vincular imóvel.</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="competencia">Competência (mês/ano) *</Label>
                <Input
                  id="competencia"
                  type="month"
                  value={competencia || mesAnoPadrao}
                  onChange={(e) => setCompetencia(e.target.value)}
                />
                <p className="text-xs text-gray-500">Ex.: 2025-01 para janeiro/2025</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receitaBruta">Receita bruta *</Label>
                  <Input
                    id="receitaBruta"
                    type="number"
                    step={0.01}
                    min={0}
                    placeholder="0,00"
                    value={receitaBruta}
                    onChange={(e) => setReceitaBruta(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custos">Custos *</Label>
                  <Input
                    id="custos"
                    type="number"
                    step={0.01}
                    min={0}
                    placeholder="0,00"
                    value={custos}
                    onChange={(e) => setCustos(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxaAdministracaoValor">Taxa administração (R$)</Label>
                  <Input
                    id="taxaAdministracaoValor"
                    type="number"
                    step={0.01}
                    min={0}
                    placeholder="0,00"
                    value={taxaAdministracaoValor}
                    onChange={(e) => setTaxaAdministracaoValor(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reservaValor">Reserva (R$)</Label>
                  <Input
                    id="reservaValor"
                    type="number"
                    step={0.01}
                    min={0}
                    placeholder="0,00"
                    value={reservaValor}
                    onChange={(e) => setReservaValor(e.target.value)}
                  />
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-sm">
                <span className="text-gray-600">Resultado distribuível: </span>
                <strong className={resultadoCalculado >= 0 ? "text-green-700" : "text-red-700"}>
                  {fmt(resultadoCalculado)}
                </strong>
                <p className="text-xs text-gray-500 mt-1">Receita − Custos − Taxa − Reserva (será repartido entre os investidores do ativo)</p>
              </div>
            </>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting || loading || !assetConfigId || receitaBruta === "" || custos === ""}
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Criar distribuição
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
