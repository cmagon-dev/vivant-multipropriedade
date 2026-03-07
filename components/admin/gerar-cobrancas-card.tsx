"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function GerarCobrancasCard() {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    tipo: "CONDOMINIO",
    valor: "",
    descricao: "",
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/cobrancas/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          valor: parseFloat(formData.valor),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`${data.count} cobranças geradas com sucesso!`);
        setFormData({ ...formData, valor: "", descricao: "" });
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao gerar cobranças");
      }
    } catch {
      toast.error("Erro ao gerar cobranças");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="w-5 h-5 text-vivant-green" />
          Gerar cobranças em lote
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mês de referência *</Label>
              <Select
                value={formData.mes.toString()}
                onValueChange={(v) => setFormData({ ...formData, mes: parseInt(v) })}
                disabled={generating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MESES.map((mes, idx) => (
                    <SelectItem key={idx} value={(idx + 1).toString()}>
                      {mes}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ano *</Label>
              <Input
                type="number"
                value={formData.ano}
                onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                required
                disabled={generating}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Tipo de cobrança *</Label>
            <Select
              value={formData.tipo}
              onValueChange={(v) => setFormData({ ...formData, tipo: v })}
              disabled={generating}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CONDOMINIO">Condomínio</SelectItem>
                <SelectItem value="LIMPEZA">Limpeza</SelectItem>
                <SelectItem value="MANUTENCAO">Manutenção</SelectItem>
                <SelectItem value="SEGURO">Seguro</SelectItem>
                <SelectItem value="IPTU">IPTU</SelectItem>
                <SelectItem value="TAXA_GESTAO">Taxa de Gestão</SelectItem>
                <SelectItem value="OUTROS">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Valor por cota (R$) *</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              placeholder="500.00"
              required
              disabled={generating}
            />
          </div>
          <div className="space-y-2">
            <Label>Descrição *</Label>
            <Input
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Ex: Condomínio Janeiro/2024"
              required
              disabled={generating}
            />
          </div>
          <div className="p-4 bg-vivant-green/10 border border-vivant-green/30 rounded-lg flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-vivant-green flex-shrink-0 mt-0.5" />
            <p className="text-sm text-vivant-navy/80">
              Serão criadas cobranças para todas as cotas ativas, vencimento no dia 5 do mês.
            </p>
          </div>
          <Button
            type="submit"
            className="w-full bg-vivant-green hover:bg-vivant-green/90"
            disabled={generating}
          >
            {generating ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Gerar cobranças
              </span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
