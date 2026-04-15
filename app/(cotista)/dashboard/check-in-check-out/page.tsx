"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type PropertyItem = {
  propertyId: string;
  name: string;
};

type AssetItem = {
  id: string;
  name: string;
  category: string;
};

type OccurrenceDraft = {
  category: string;
  assetId: string;
  occurrenceType: string;
  description: string;
};

type CheckReport = {
  id: string;
  expectedCheckinDate: string | null;
  expectedCheckinTime: string | null;
  description: string | null;
};

type CompanionDraft = {
  name: string;
  document: string;
};

type ProfilePrefill = {
  name: string;
  cpf: string;
  phone: string | null;
  registration?: Record<string, string>;
};

const CATEGORY_OPTIONS = [
  { value: "MOVEIS", label: "Móveis" },
  { value: "ELETRODOMESTICOS", label: "Eletrodomésticos" },
  { value: "ELETRONICOS", label: "Eletrônicos" },
  { value: "UTENSILIOS", label: "Utensílios" },
  { value: "DECORACAO", label: "Decoração" },
  { value: "CAMA_MESA_BANHO", label: "Cama, mesa e banho" },
  { value: "AREA_EXTERNA", label: "Área externa" },
  { value: "OUTROS", label: "Outros" },
];

const OCCURRENCE_OPTIONS = [
  { value: "QUEBRADO", label: "Quebrado" },
  { value: "DANIFICADO", label: "Danificado" },
  { value: "AUSENTE", label: "Ausente" },
  { value: "PRECISA_MANUTENCAO", label: "Precisa manutenção" },
  { value: "MAU_FUNCIONAMENTO", label: "Mau funcionamento" },
  { value: "OUTRO", label: "Outro" },
];

export default function CheckInCheckOutPage() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    expectedCheckinDate: "",
    expectedCheckinTime: "",
    expectedCheckoutDate: "",
    expectedCheckoutTime: "",
    totalGuests: "1",
    primaryGuestName: "",
    primaryGuestDocument: "",
    primaryGuestPhone: "",
    hadBrokenItem: false,
    hadMaintenance: false,
    description: "",
    observations: "",
  });
  const [companions, setCompanions] = useState<CompanionDraft[]>([]);
  const [occurrences, setOccurrences] = useState<OccurrenceDraft[]>([]);
  const [reports, setReports] = useState<CheckReport[]>([]);
  const [checkinSaving, setCheckinSaving] = useState(false);
  const [checkoutSaving, setCheckoutSaving] = useState(false);
  const [profilePrefill, setProfilePrefill] = useState<ProfilePrefill | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/cotistas/me/propriedades")
        .then((r) => (r.ok ? r.json() : { propriedades: [] }))
        .then((data) => {
          const list = Array.isArray(data.propriedades) ? data.propriedades : [];
          const mapped = list.map((p: any) => ({ propertyId: p.propertyId, name: p.name }));
          setProperties(mapped);
          const saved = typeof window !== "undefined" ? localStorage.getItem("selectedPropertyId") : null;
          const initial = saved && mapped.some((m: PropertyItem) => m.propertyId === saved) ? saved : mapped[0]?.propertyId;
          if (initial) setSelectedPropertyId(initial);
        }),
      fetch("/api/cotistas/me/property-assets")
        .then((r) => (r.ok ? r.json() : { assets: [] }))
        .then((data) => setAssets(Array.isArray(data.assets) ? data.assets : [])),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/cotistas/me/profile", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { profile: null }))
      .then((data) => {
        const p = (data.profile ?? null) as ProfilePrefill | null;
        setProfilePrefill(p);
        if (!p) return;
        const cpfFromProfile = p.cpf ?? "";
        const phoneFromProfile =
          p.registration?.emergencyContactPhone || p.phone || "";
        setForm((prev) => ({
          ...prev,
          primaryGuestName: prev.primaryGuestName || p.name || "",
          primaryGuestDocument: prev.primaryGuestDocument || cpfFromProfile,
          primaryGuestPhone: prev.primaryGuestPhone || phoneFromProfile,
        }));
      })
      .catch(() => {
        setProfilePrefill(null);
      });
  }, []);

  useEffect(() => {
    if (!selectedPropertyId) return;
    fetch(`/api/cotistas/me/property-assets?propertyId=${selectedPropertyId}`)
      .then((r) => (r.ok ? r.json() : { assets: [] }))
      .then((data) => setAssets(Array.isArray(data.assets) ? data.assets : []))
      .catch(() => setAssets([]));
  }, [selectedPropertyId]);

  useEffect(() => {
    if (!selectedPropertyId) {
      setReports([]);
      return;
    }
    fetch(`/api/cotistas/me/check-in-check-out?propertyId=${selectedPropertyId}`)
      .then((r) => (r.ok ? r.json() : { reports: [] }))
      .then((data) => setReports(Array.isArray(data.reports) ? data.reports : []))
      .catch(() => setReports([]));
  }, [selectedPropertyId]);

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => !occurrences.some((o) => o.assetId && o.assetId === asset.id));
  }, [assets, occurrences]);

  const addOccurrence = () => {
    setOccurrences((prev) => [
      ...prev,
      { category: "OUTROS", assetId: "__none__", occurrenceType: "QUEBRADO", description: "" },
    ]);
  };

  const updateOccurrence = (index: number, patch: Partial<OccurrenceDraft>) => {
    setOccurrences((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  const removeOccurrence = (index: number) => {
    setOccurrences((prev) => prev.filter((_, i) => i !== index));
  };

  const hasCheckin = useMemo(
    () => reports.some((r) => r.description === "__CHECKIN_OPEN__"),
    [reports]
  );

  const submitCheckin = async () => {
    if (!selectedPropertyId) {
      toast.error("Selecione a residência.");
      return;
    }

    if (!form.expectedCheckinDate) {
      toast.error("Informe a data prevista de check-in.");
      return;
    }
    if (!form.expectedCheckoutDate) {
      toast.error("A previsão de check-out deve ser preenchida no check-in.");
      return;
    }
    const totalGuests = Number(form.totalGuests || "0");
    if (!Number.isFinite(totalGuests) || totalGuests < 1) {
      toast.error("Informe a quantidade de pessoas.");
      return;
    }
    if (!form.primaryGuestName.trim() || !form.primaryGuestDocument.trim()) {
      toast.error("Informe nome e documento do responsável principal.");
      return;
    }
    if (companions.some((c) => !c.name.trim())) {
      toast.error("Todos os acompanhantes precisam ter nome.");
      return;
    }

    setCheckinSaving(true);
    try {
      const response = await fetch("/api/cotistas/me/check-in-check-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedPropertyId,
          expectedCheckinDate: form.expectedCheckinDate || null,
          expectedCheckinTime: form.expectedCheckinTime || null,
          expectedCheckoutDate: form.expectedCheckoutDate || null,
          expectedCheckoutTime: form.expectedCheckoutTime || null,
          action: "CHECKIN",
          totalGuests,
          primaryGuestName: form.primaryGuestName,
          primaryGuestDocument: form.primaryGuestDocument,
          primaryGuestPhone: form.primaryGuestPhone || null,
          companions: companions.map((c) => ({
            name: c.name,
            document: c.document || null,
          })),
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error || "Erro ao registrar check-in.");
        return;
      }
      toast.success("Check-in registrado. Checkout oficial liberado.");
      setCompanions([]);
      const reportsRes = await fetch(`/api/cotistas/me/check-in-check-out?propertyId=${selectedPropertyId}`);
      const reportsData = await reportsRes.json().catch(() => ({ reports: [] }));
      setReports(Array.isArray(reportsData.reports) ? reportsData.reports : []);
    } finally {
      setCheckinSaving(false);
    }
  };

  const submitCheckout = async () => {
    if (!selectedPropertyId) {
      toast.error("Selecione a residência.");
      return;
    }
    if (!hasCheckin) {
      toast.error("Você precisa registrar o check-in antes do checkout.");
      return;
    }
    for (const o of occurrences) {
      if (!o.description.trim()) {
        toast.error("Todas as ocorrências precisam de descrição.");
        return;
      }
    }

    setCheckoutSaving(true);
    try {
      const response = await fetch("/api/cotistas/me/check-in-check-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: selectedPropertyId,
          action: "CHECKOUT",
          hadBrokenItem: form.hadBrokenItem,
          hadMaintenance: form.hadMaintenance,
          description: form.description || null,
          observations: form.observations || null,
          occurrences: occurrences.map((o) => ({
            category: o.category,
            assetId: o.assetId === "__none__" ? null : o.assetId,
            occurrenceType: o.occurrenceType,
            description: o.description,
          })),
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error || "Erro ao registrar checkout.");
        return;
      }
      toast.success("Checkout oficial registrado com sucesso.");
      setOccurrences([]);
      setForm((prev) => ({
        ...prev,
        hadBrokenItem: false,
        hadMaintenance: false,
        description: "",
        observations: "",
      }));
    } finally {
      setCheckoutSaving(false);
    }
  };

  if (loading) {
    return <div className="py-8 text-center text-[#1A2F4B]/70">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">Check-in e Check-out</h1>
        <p className="text-[#1A2F4B]/70">
          Registre o check-in completo com previsão de checkout. Depois, o sistema libera somente o
          checkout oficial.
        </p>
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle>Residência</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedPropertyId} onValueChange={setSelectedPropertyId}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="Selecione a residência" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.propertyId} value={property.propertyId}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {!hasCheckin ? (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Check-in (com previsão de check-out)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantidade de pessoas</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.totalGuests}
                  onChange={(e) => setForm((prev) => ({ ...prev, totalGuests: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Nome do responsável principal</Label>
                <Input
                  value={form.primaryGuestName}
                  onChange={(e) => setForm((prev) => ({ ...prev, primaryGuestName: e.target.value }))}
                  placeholder="Nome completo do titular"
                />
              </div>
              <div className="space-y-2">
                <Label>Documento do responsável</Label>
                <Input
                  value={form.primaryGuestDocument}
                  onChange={(e) => setForm((prev) => ({ ...prev, primaryGuestDocument: e.target.value }))}
                  placeholder="CPF/RG/Passaporte do titular"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone do responsável</Label>
                <Input
                  value={form.primaryGuestPhone}
                  onChange={(e) => setForm((prev) => ({ ...prev, primaryGuestPhone: e.target.value }))}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            {profilePrefill ? (
              <p className="text-xs text-[#1A2F4B]/70">
                Dados do titular preenchidos automaticamente pelo cadastro do perfil. Você pode ajustar se necessário.
              </p>
            ) : null}
            <div className="space-y-3 rounded-md border border-slate-200 p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1A2F4B]">Acompanhantes</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setCompanions((prev) => [...prev, { name: "", document: "" }])
                  }
                >
                  Adicionar acompanhante
                </Button>
              </div>
              {companions.length === 0 ? (
                <p className="text-xs text-slate-500">Nenhum acompanhante adicionado.</p>
              ) : (
                companions.map((companion, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <Input
                      value={companion.name}
                      onChange={(e) =>
                        setCompanions((prev) =>
                          prev.map((c, i) => (i === index ? { ...c, name: e.target.value } : c))
                        )
                      }
                      placeholder={`Nome do acompanhante ${index + 1}`}
                    />
                    <div className="flex gap-2">
                      <Input
                        value={companion.document}
                        onChange={(e) =>
                          setCompanions((prev) =>
                            prev.map((c, i) => (i === index ? { ...c, document: e.target.value } : c))
                          )
                        }
                        placeholder="Documento (opcional)"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-600"
                        onClick={() =>
                          setCompanions((prev) => prev.filter((_, i) => i !== index))
                        }
                      >
                        Remover
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data prevista de chegada</Label>
                <Input
                  type="date"
                  value={form.expectedCheckinDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, expectedCheckinDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Horário previsto de chegada</Label>
                <Input
                  type="time"
                  value={form.expectedCheckinTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, expectedCheckinTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Data prevista de saída</Label>
                <Input
                  type="date"
                  value={form.expectedCheckoutDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, expectedCheckoutDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Horário previsto de saída</Label>
                <Input
                  type="time"
                  value={form.expectedCheckoutTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, expectedCheckoutTime: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-vivant-green hover:bg-vivant-green/90" onClick={submitCheckin} disabled={checkinSaving}>
                {checkinSaving ? "Registrando..." : "Registrar check-in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {hasCheckin ? (
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Checkout oficial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-[#1A2F4B]">
              <Checkbox
                checked={form.hadBrokenItem}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, hadBrokenItem: !!checked }))}
              />
              Houve item quebrado?
            </label>
            <label className="flex items-center gap-2 text-sm text-[#1A2F4B]">
              <Checkbox
                checked={form.hadMaintenance}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, hadMaintenance: !!checked }))}
              />
              Houve necessidade de manutenção?
            </label>
          </div>
          <div className="space-y-2">
            <Label>Descrição geral</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Resumo geral do check-out"
            />
          </div>
          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={form.observations}
              onChange={(e) => setForm((prev) => ({ ...prev, observations: e.target.value }))}
              placeholder="Informações adicionais"
            />
          </div>
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-[#1A2F4B]">Etapa 3 — Ocorrências (apenas no checkout)</h3>
                <Button variant="outline" onClick={addOccurrence}>Adicionar ocorrência</Button>
              </div>
              {occurrences.length === 0 ? (
                <p className="text-sm text-[#1A2F4B]/70">Nenhuma ocorrência adicionada.</p>
              ) : (
                occurrences.map((occurrence, index) => (
                  <div key={index} className="rounded-md border p-3 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Select
                        value={occurrence.category}
                        onValueChange={(value) => updateOccurrence(index, { category: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORY_OPTIONS.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={occurrence.assetId}
                        onValueChange={(value) => updateOccurrence(index, { assetId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Item do imobilizado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__none__">Sem item específico</SelectItem>
                          {filteredAssets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id}>
                              {asset.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={occurrence.occurrenceType}
                        onValueChange={(value) => updateOccurrence(index, { occurrenceType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Tipo de ocorrência" />
                        </SelectTrigger>
                        <SelectContent>
                          {OCCURRENCE_OPTIONS.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Descrição do problema</Label>
                      <Textarea
                        value={occurrence.description}
                        onChange={(e) => updateOccurrence(index, { description: e.target.value })}
                        placeholder="Descreva o que ocorreu"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button variant="ghost" className="text-red-600" onClick={() => removeOccurrence(index)}>
                        Remover ocorrência
                      </Button>
                    </div>
                  </div>
                ))
              )}
          </div>
          </CardContent>
        </Card>
      ) : null}

      {hasCheckin ? (
        <div className="flex justify-end">
          <Button className="bg-vivant-green hover:bg-vivant-green/90" onClick={submitCheckout} disabled={checkoutSaving}>
            {checkoutSaving ? "Registrando..." : "Registrar checkout oficial"}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

