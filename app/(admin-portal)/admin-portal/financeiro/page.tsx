"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function FinanceiroAdminPage() {
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
      const response = await fetch("/api/admin/cobrancas/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          valor: parseFloat(formData.valor)
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`${data.count} cobranças geradas com sucesso!`);
        setFormData({
          ...formData,
          valor: "",
          descricao: "",
        });
      } else {
        const data = await response.json();
        toast.error(data.error || "Erro ao gerar cobranças");
      }
    } catch (error) {
      toast.error("Erro ao gerar cobranças");
    } finally {
      setGenerating(false);
    }
  };

  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-vivant-navy mb-2">
          Gestão Financeira
        </h1>
        <p className="text-slate-600">
          Gerar cobranças mensais para todos os cotistas
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-vivant-navy flex items-center gap-2">
              <Plus className="w-5 h-5 text-vivant-green" />
              Gerar Cobranças em Lote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mes">Mês de Referência *</Label>
                  <Select
                    value={formData.mes.toString()}
                    onValueChange={(value) => setFormData({ ...formData, mes: parseInt(value) })}
                    disabled={generating}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {meses.map((mes, idx) => (
                        <SelectItem key={idx} value={(idx + 1).toString()}>
                          {mes}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ano">Ano *</Label>
                  <Input
                    id="ano"
                    type="number"
                    value={formData.ano}
                    onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value) })}
                    required
                    disabled={generating}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Cobrança *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
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
                <Label htmlFor="valor">Valor por Cota (R$) *</Label>
                <Input
                  id="valor"
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
                <Label htmlFor="descricao">Descrição *</Label>
                <Input
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Ex: Condomínio referente a Janeiro/2024"
                  required
                  disabled={generating}
                />
              </div>

              <div className="p-4 bg-vivant-green/10 border-2 border-vivant-green/30 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-vivant-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#1A2F4B] mb-1">
                      Sistema Automático
                    </p>
                    <p className="text-xs text-[#1A2F4B]/70">
                      As cobranças serão geradas automaticamente para todas as cotas ativas,
                      com vencimento no dia 5 do mês seguinte.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-vivant-green hover:bg-vivant-green/90 h-12"
                disabled={generating}
              >
                {generating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Gerando Cobranças...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Gerar Cobranças
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-serif font-bold text-[#1A2F4B] mb-4">
                Como Funciona
              </h3>
              <div className="space-y-3 text-sm text-[#1A2F4B]/80">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-vivant-green text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <p>Selecione o mês/ano, tipo e valor da cobrança</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-vivant-green text-white flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <p>Sistema cria automaticamente uma cobrança para cada cota ativa</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-vivant-green text-white flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <p>Cotistas visualizam no portal e recebem notificação</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-vivant-green text-white flex items-center justify-center text-xs font-bold">
                    4
                  </span>
                  <p>Após upload de comprovante, admin valida o pagamento</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="p-6">
              <h3 className="text-lg font-serif font-bold text-[#1A2F4B] mb-2">
                Dica Importante
              </h3>
              <p className="text-sm text-[#1A2F4B]/80">
                As cobranças geradas aqui são apenas para visualização e controle. 
                Para gerar boletos bancários, você precisará integrar com um gateway de pagamento.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
