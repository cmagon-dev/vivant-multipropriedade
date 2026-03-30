"use client";

import { useEffect, useMemo, useState } from "react";
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

type ModoEscopo = "todas" | "propriedade" | "cota";

type CotaOption = {
  id: string;
  ativo: boolean;
  numeroCota: string;
  cotista?: { name: string | null } | null;
};

type PropertyOption = {
  id: string;
  name: string;
  cotas: CotaOption[];
};

export function GerarCobrancasCard() {
  const router = useRouter();
  const [generating, setGenerating] = useState(false);
  const [loadingProps, setLoadingProps] = useState(true);
  const [properties, setProperties] = useState<PropertyOption[]>([]);
  const [formData, setFormData] = useState({
    mes: new Date().getMonth() + 1,
    ano: new Date().getFullYear(),
    tipo: "CONDOMINIO",
    valor: "",
    descricao: "",
    modo: "todas" as ModoEscopo,
    propertyId: "",
    cotaId: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/admin/propriedades", { cache: "no-store" });
        if (!res.ok) throw new Error("Falha ao carregar imóveis");
        const data = (await res.json()) as PropertyOption[];
        if (!cancelled) setProperties(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) {
          setProperties([]);
          toast.error("Não foi possível carregar a lista de propriedades");
        }
      } finally {
        if (!cancelled) setLoadingProps(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedProperty = useMemo(
    () => properties.find((p) => p.id === formData.propertyId),
    [properties, formData.propertyId]
  );

  const cotasAtivasNoImovel = useMemo(() => {
    if (!selectedProperty?.cotas?.length) return [];
    return selectedProperty.cotas.filter((c) => c.ativo);
  }, [selectedProperty]);

  const resumoEscopo = useMemo(() => {
    if (formData.modo === "todas") {
      return "Serão criadas cobranças para todas as cotas ativas do sistema, com vencimento no dia 5 do mês de referência.";
    }
    if (formData.modo === "propriedade") {
      if (!formData.propertyId) {
        return "Selecione um imóvel: a cobrança será lançada para cada cota ativa daquele imóvel.";
      }
      const n = cotasAtivasNoImovel.length;
      return n === 0
        ? "Não há cotas ativas neste imóvel."
        : `Serão criadas ${n} cobrança${n === 1 ? "" : "s"} (uma por cota ativa do imóvel). Vencimento no dia 5 do mês de referência.`;
    }
    if (formData.modo === "cota") {
      if (!formData.cotaId) {
        return "Escolha o imóvel e a cota: será criada uma única cobrança.";
      }
      return "Será criada 1 cobrança para a cota selecionada. Vencimento no dia 5 do mês de referência.";
    }
    return "";
  }, [formData.modo, formData.propertyId, formData.cotaId, cotasAtivasNoImovel.length]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.modo === "propriedade" && !formData.propertyId) {
      toast.error("Selecione uma propriedade");
      return;
    }
    if (formData.modo === "cota") {
      if (!formData.propertyId) {
        toast.error("Selecione uma propriedade");
        return;
      }
      if (!formData.cotaId) {
        toast.error("Selecione uma cota");
        return;
      }
    }
    setGenerating(true);
    try {
      const body: Record<string, unknown> = {
        mes: formData.mes,
        ano: formData.ano,
        tipo: formData.tipo,
        valor: parseFloat(formData.valor),
        descricao: formData.descricao.trim(),
        modo: formData.modo,
      };
      if (formData.modo === "propriedade") {
        body.propertyId = formData.propertyId;
      }
      if (formData.modo === "cota") {
        body.cotaId = formData.cotaId;
      }

      const res = await fetch("/api/admin/cobrancas/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success(`${data.count} cobranças geradas com sucesso!`);
        setFormData((prev) => ({
          ...prev,
          valor: "",
          descricao: "",
          modo: "todas",
          propertyId: "",
          cotaId: "",
        }));
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
          Lançar cobranças
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="space-y-2">
            <Label>Escopo *</Label>
            <Select
              value={formData.modo}
              onValueChange={(v) =>
                setFormData({
                  ...formData,
                  modo: v as ModoEscopo,
                  propertyId: "",
                  cotaId: "",
                })
              }
              disabled={generating || loadingProps}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as cotas ativas (sistema)</SelectItem>
                <SelectItem value="propriedade">Apenas um imóvel (todas as cotas ativas do imóvel)</SelectItem>
                <SelectItem value="cota">Uma cota específica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.modo === "propriedade" || formData.modo === "cota") && (
            <div className="space-y-2">
              <Label>Imóvel *</Label>
              <Select
                value={formData.propertyId || undefined}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    propertyId: v,
                    cotaId: "",
                  })
                }
                disabled={generating || loadingProps}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingProps ? "Carregando..." : "Selecione o imóvel"} />
                </SelectTrigger>
                <SelectContent>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.modo === "cota" && formData.propertyId && (
            <div className="space-y-2">
              <Label>Cota *</Label>
              <Select
                value={formData.cotaId || undefined}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    cotaId: v,
                  })
                }
                disabled={generating || cotasAtivasNoImovel.length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cota" />
                </SelectTrigger>
                <SelectContent>
                  {cotasAtivasNoImovel.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.numeroCota}
                      {c.cotista?.name ? ` — ${c.cotista.name}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {cotasAtivasNoImovel.length === 0 && (
                <p className="text-xs text-amber-700">Nenhuma cota ativa neste imóvel.</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mês de referência *</Label>
              <Select
                value={formData.mes.toString()}
                onValueChange={(v) => setFormData({ ...formData, mes: parseInt(v, 10) })}
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
                onChange={(e) => setFormData({ ...formData, ano: parseInt(e.target.value, 10) })}
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
            <p className="text-sm text-vivant-navy/80">{resumoEscopo}</p>
          </div>
          <Button
            type="submit"
            className="w-full bg-vivant-green hover:bg-vivant-green/90"
            disabled={
              generating ||
              loadingProps ||
              (formData.modo === "propriedade" && !formData.propertyId) ||
              (formData.modo === "cota" && (!formData.propertyId || !formData.cotaId))
            }
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
