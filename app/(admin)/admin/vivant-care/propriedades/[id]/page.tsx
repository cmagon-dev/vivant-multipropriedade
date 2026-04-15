"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Home,
  Users,
  Calendar,
  CalendarRange,
  Trash2,
  Edit,
  ArrowLeft,
  UserPlus,
  MapPin,
  Settings,
  FileText,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarioPropriedade } from "@/components/admin-portal/calendario-propriedade";
import { PlanejamentoSemanasPanel } from "@/components/admin/vivant-care/planejamento-semanas-panel";
import { DistribuirSemanasPanel } from "@/components/admin/vivant-care/distribuir-semanas-panel";

interface Propriedade {
  id: string;
  name: string;
  destino?: { name: string };
  bedrooms?: number;
  bathrooms?: number;
  maxGuests?: number;
  totalCotas?: number;
  cotas: Array<{
    id: string;
    numeroCota: string;
    percentualCota: number;
    semanasAno: number;
    ativo: boolean;
    cotista: { id: string; name: string; email: string };
  }>;
}

interface Cotista {
  id: string;
  name: string;
  email: string;
}

interface DocumentoCasa {
  id: string;
  titulo: string;
  tipo: string;
  url: string;
  ativo: boolean;
  createdAt: string;
}

interface AssetItem {
  id: string;
  name: string;
  category: string;
  unitValue: string | number;
  quantity: number;
  totalValue: string | number;
  notes?: string | null;
}

const ASSET_CATEGORIES = [
  { value: "MOVEIS", label: "Móveis" },
  { value: "ELETRODOMESTICOS", label: "Eletrodomésticos" },
  { value: "ELETRONICOS", label: "Eletrônicos" },
  { value: "UTENSILIOS", label: "Utensílios" },
  { value: "DECORACAO", label: "Decoração" },
  { value: "CAMA_MESA_BANHO", label: "Cama, mesa e banho" },
  { value: "AREA_EXTERNA", label: "Área externa" },
  { value: "OUTROS", label: "Outros" },
];

function extrairNumeroCota(valor: string): number | null {
  const match = valor.match(/\d+/);
  if (!match) return null;
  const numero = Number(match[0]);
  return Number.isInteger(numero) && numero > 0 ? numero : null;
}

const baseProp = "/admin/vivant-care/propriedades";

type PropriedadeLoadStatus = "idle" | "missing" | "unauthorized" | "error";

export default function PropriedadeDetalhesVivantCarePage({ params }: { params: { id: string } }) {
  const [propriedade, setPropriedade] = useState<Propriedade | null>(null);
  const [loadStatus, setLoadStatus] = useState<PropriedadeLoadStatus>("idle");
  const [cotistas, setCotistas] = useState<Cotista[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNovaCota, setShowNovaCota] = useState(false);
  const [activeTab, setActiveTab] = useState("cotas");
  const [documentos, setDocumentos] = useState<DocumentoCasa[]>([]);
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);
  const [tituloDocumento, setTituloDocumento] = useState("");
  const [arquivoDocumento, setArquivoDocumento] = useState<File | null>(null);
  const [assetItems, setAssetItems] = useState<AssetItem[]>([]);
  const [savingAsset, setSavingAsset] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [assetForm, setAssetForm] = useState({
    name: "",
    category: "OUTROS",
    unitValue: "",
    quantity: 1,
    notes: "",
  });
  const [novaCota, setNovaCota] = useState({
    cotistaId: "",
    numeroCota: "",
    percentualCota: 0,
    semanasAno: 0,
  });

  useEffect(() => {
    setLoading(true);
    setPropriedade(null);
    setLoadStatus("idle");
    carregarPropriedade();
    carregarCotistas();
    carregarDocumentos();
    carregarAssets();
  }, [params.id]);

  const opcoesCotasDisponiveis = useMemo(() => {
    if (!propriedade?.totalCotas || propriedade.totalCotas <= 0) return [];
    const cotasAlocadas = new Set(
      propriedade.cotas
        .map((cota) => extrairNumeroCota(cota.numeroCota))
        .filter((numero): numero is number => numero !== null)
    );

    return Array.from({ length: propriedade.totalCotas }, (_, index) => index + 1)
      .filter((numero) => !cotasAlocadas.has(numero))
      .map((numero) => `Cota ${numero}`);
  }, [propriedade]);

  const carregarPropriedade = async () => {
    try {
      const response = await fetch(`/api/admin/propriedades/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setPropriedade(data);
        setLoadStatus("idle");
        return;
      }
      setPropriedade(null);
      if (response.status === 404) {
        setLoadStatus("missing");
        return;
      }
      if (response.status === 401) {
        setLoadStatus("unauthorized");
        toast.error("Sessão expirada ou sem permissão. Entre novamente.");
        return;
      }
      setLoadStatus("error");
      const err = await response.json().catch(() => ({}));
      toast.error(err.error || "Erro ao carregar propriedade");
    } catch {
      setPropriedade(null);
      setLoadStatus("error");
      toast.error("Erro ao carregar propriedade");
    } finally {
      setLoading(false);
    }
  };

  const carregarCotistas = async () => {
    try {
      const response = await fetch("/api/admin/cotistas");
      if (response.ok) {
        const data = await response.json();
        setCotistas(data.cotistas || []);
      }
    } catch (e) {
      console.error("Erro ao carregar cotistas:", e);
    }
  };

  const carregarDocumentos = async () => {
    setLoadingDocumentos(true);
    try {
      const response = await fetch(`/api/admin/documentos?propertyId=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setDocumentos(data.documentos || []);
      }
    } finally {
      setLoadingDocumentos(false);
    }
  };

  const carregarAssets = async () => {
    try {
      const response = await fetch(`/api/admin/propriedades/${params.id}/assets`);
      if (response.ok) {
        const data = await response.json();
        setAssetItems(Array.isArray(data.assets) ? data.assets : []);
      }
    } catch {
      toast.error("Erro ao carregar imobilizado.");
    }
  };

  const uploadDocumento = async () => {
    if (!tituloDocumento.trim() || !arquivoDocumento) {
      toast.error("Informe título e arquivo do documento.");
      return;
    }
    const fd = new FormData();
    fd.append("propertyId", params.id);
    fd.append("titulo", tituloDocumento.trim());
    fd.append("tipo", "OUTROS");
    fd.append("file", arquivoDocumento);

    const response = await fetch("/api/admin/documentos", {
      method: "POST",
      body: fd,
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      toast.error(err.error || "Erro ao enviar documento.");
      return;
    }
    toast.success("Documento enviado com sucesso.");
    setTituloDocumento("");
    setArquivoDocumento(null);
    await carregarDocumentos();
  };

  const removerDocumento = async (id: string) => {
    const ok = confirm("Deseja remover este documento?");
    if (!ok) return;
    const response = await fetch(`/api/admin/documentos/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Erro ao remover documento.");
      return;
    }
    toast.success("Documento removido.");
    await carregarDocumentos();
  };

  const renomearDocumento = async (doc: DocumentoCasa) => {
    const novoTitulo = prompt("Novo título do documento:", doc.titulo);
    if (!novoTitulo || !novoTitulo.trim() || novoTitulo.trim() === doc.titulo) return;
    const response = await fetch(`/api/admin/documentos/${doc.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: novoTitulo.trim() }),
    });
    if (!response.ok) {
      toast.error("Erro ao renomear documento.");
      return;
    }
    toast.success("Título atualizado.");
    await carregarDocumentos();
  };

  const salvarAsset = async () => {
    if (!assetForm.name.trim()) {
      toast.error("Nome do item é obrigatório.");
      return;
    }
    const unitValue = Number(assetForm.unitValue);
    if (!Number.isFinite(unitValue) || unitValue < 0) {
      toast.error("Valor unitário inválido.");
      return;
    }
    if (!Number.isFinite(assetForm.quantity) || assetForm.quantity <= 0) {
      toast.error("Quantidade inválida.");
      return;
    }
    setSavingAsset(true);
    try {
      const payload = {
        name: assetForm.name.trim(),
        category: assetForm.category,
        unitValue,
        quantity: assetForm.quantity,
        notes: assetForm.notes.trim() || null,
      };
      const response = await fetch(
        editingAssetId
          ? `/api/admin/propriedades/${params.id}/assets/${editingAssetId}`
          : `/api/admin/propriedades/${params.id}/assets`,
        {
          method: editingAssetId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error || "Erro ao salvar item.");
        return;
      }
      toast.success(editingAssetId ? "Item atualizado." : "Item cadastrado.");
      setAssetForm({ name: "", category: "OUTROS", unitValue: "", quantity: 1, notes: "" });
      setEditingAssetId(null);
      await carregarAssets();
    } finally {
      setSavingAsset(false);
    }
  };

  const editarAsset = (item: AssetItem) => {
    setEditingAssetId(item.id);
    setAssetForm({
      name: item.name,
      category: item.category,
      unitValue: String(item.unitValue),
      quantity: item.quantity,
      notes: item.notes || "",
    });
  };

  const excluirAsset = async (id: string) => {
    const ok = confirm("Deseja excluir este item do imobilizado?");
    if (!ok) return;
    const response = await fetch(`/api/admin/propriedades/${params.id}/assets/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Erro ao excluir item.");
      return;
    }
    toast.success("Item removido.");
    await carregarAssets();
  };

  const handleCriarCota = async () => {
    if (!novaCota.cotistaId || !novaCota.numeroCota) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    try {
      const response = await fetch(`/api/admin/propriedades/${params.id}/cotas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaCota),
      });
      if (response.ok) {
        toast.success("Cota criada com sucesso!");
        setShowNovaCota(false);
        setNovaCota({ cotistaId: "", numeroCota: "", percentualCota: 0, semanasAno: 0 });
        carregarPropriedade();
      } else {
        const error = await response.json();
        toast.error(error.error || "Erro ao criar cota");
      }
    } catch {
      toast.error("Erro ao criar cota");
    }
  };

  const handleRemoverCota = async (cotaId: string) => {
    if (!confirm("Tem certeza que deseja remover esta cota?")) return;
    try {
      const response = await fetch(`/api/admin/cotas/${cotaId}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Cota removida com sucesso!");
        carregarPropriedade();
      } else {
        toast.error("Erro ao remover cota");
      }
    } catch {
      toast.error("Erro ao remover cota");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-vivant-green border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!propriedade) {
    const isMissing = loadStatus === "missing";
    const isUnauthorized = loadStatus === "unauthorized";
    return (
      <div className="text-center py-12 max-w-lg mx-auto px-4">
        <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-800 font-medium">
          {isUnauthorized ? "Acesso não autorizado" : "Propriedade não encontrada"}
        </p>
        {isMissing ? (
          <p className="text-sm text-gray-600 mt-2">
            Não existe registro com este ID no banco atual (por exemplo após migração ou seed).
            Abra a propriedade pela lista em Propriedades ou cadastre de novo.
          </p>
        ) : isUnauthorized ? (
          <p className="text-sm text-gray-600 mt-2">Faça login de novo como administrador com permissão de Vivant Care.</p>
        ) : loadStatus === "error" ? (
          <p className="text-sm text-gray-600 mt-2">Ocorreu um erro ao consultar o servidor. Tente novamente.</p>
        ) : null}
        <Button asChild className="mt-4">
          <Link href={baseProp}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }

  const cotasDisponiveis = (propriedade.totalCotas || 0) - propriedade.cotas.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href={baseProp}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-vivant-navy">{propriedade.name}</h1>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span>{propriedade.destino?.name || "Destino não definido"}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button asChild className="bg-vivant-green hover:bg-vivant-green/90">
            <Link href={`${baseProp}/${propriedade.id}/editar`}>
              <Edit className="w-4 h-4 mr-2" />
              Editar Propriedade
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total de Cotas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-vivant-navy">{propriedade.totalCotas || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cotas Alocadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-vivant-green">{propriedade.cotas.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cotas Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{cotasDisponiveis}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Capacidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{propriedade.maxGuests || 0}</div>
            <p className="text-xs text-gray-500">pessoas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="h-auto flex flex-wrap justify-start gap-2 bg-transparent p-0">
          <TabsTrigger value="cotas" className="data-[state=active]:bg-vivant-navy data-[state=active]:text-white border">
            <Users className="w-4 h-4 mr-2" />
            Cotas e Cotistas
          </TabsTrigger>
          <TabsTrigger value="documentos" className="data-[state=active]:bg-vivant-navy data-[state=active]:text-white border">
            <FileText className="w-4 h-4 mr-2" />
            Documentos da casa
          </TabsTrigger>
          <TabsTrigger value="imobilizado" className="data-[state=active]:bg-vivant-navy data-[state=active]:text-white border">
            <Settings className="w-4 h-4 mr-2" />
            Imobilizado da casa
          </TabsTrigger>
          <TabsTrigger value="planejamento" className="data-[state=active]:bg-vivant-navy data-[state=active]:text-white border">
            <CalendarRange className="w-4 h-4 mr-2" />
            Planejamento de semanas
          </TabsTrigger>
          <TabsTrigger value="distribuicao" className="data-[state=active]:bg-vivant-navy data-[state=active]:text-white border">
            <Users className="w-4 h-4 mr-2" />
            Distribuir semanas
          </TabsTrigger>
          <TabsTrigger value="calendario" className="data-[state=active]:bg-vivant-navy data-[state=active]:text-white border">
            <Calendar className="w-4 h-4 mr-2" />
            Ver Calendário
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cotas">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-vivant-green" />
                  Cotas e Cotistas
                </CardTitle>
                <Dialog open={showNovaCota} onOpenChange={setShowNovaCota}>
                  <DialogTrigger asChild>
                    <Button className="bg-vivant-green hover:bg-vivant-green/90">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Alocar Nova Cota
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alocar Nova Cota</DialogTitle>
                      <DialogDescription>Vincule um cotista a uma cota desta propriedade</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Cotista *</Label>
                        <Select value={novaCota.cotistaId} onValueChange={(value) => setNovaCota({ ...novaCota, cotistaId: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cotista" />
                          </SelectTrigger>
                          <SelectContent>
                            {cotistas.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name} ({c.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Número da Cota *</Label>
                        <Select
                          value={novaCota.numeroCota}
                          onValueChange={(value) => setNovaCota({ ...novaCota, numeroCota: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma cota disponível" />
                          </SelectTrigger>
                          <SelectContent>
                            {opcoesCotasDisponiveis.map((cota) => (
                              <SelectItem key={cota} value={cota}>
                                {cota}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {opcoesCotasDisponiveis.length === 0 && (
                          <p className="text-xs text-amber-600">
                            Não há cotas disponíveis para alocação nesta propriedade.
                          </p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Percentual (%)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="16.67"
                            value={novaCota.percentualCota}
                            onChange={(e) => setNovaCota({ ...novaCota, percentualCota: parseFloat(e.target.value) })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Semanas/Ano</Label>
                          <Input
                            type="number"
                            placeholder="8"
                            value={novaCota.semanasAno}
                            onChange={(e) => setNovaCota({ ...novaCota, semanasAno: parseInt(e.target.value) })}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={handleCriarCota}
                          disabled={opcoesCotasDisponiveis.length === 0}
                          className="flex-1 bg-vivant-green hover:bg-vivant-green/90"
                        >
                          Criar Cota
                        </Button>
                        <Button variant="outline" onClick={() => setShowNovaCota(false)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {propriedade.cotas.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">Nenhuma cota alocada ainda</p>
                  <p className="text-sm text-gray-500 mt-1">Clique em Alocar Nova Cota para começar</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {propriedade.cotas.map((cota) => (
                    <div
                      key={cota.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-vivant-green/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-vivant-green" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-vivant-navy">{cota.cotista.name}</h4>
                          <p className="text-sm text-gray-600">{cota.cotista.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-vivant-navy">{cota.numeroCota}</p>
                          <p className="text-sm text-gray-600">
                            {cota.percentualCota}% • {cota.semanasAno} semanas/ano (contrato)
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Distribuição no calendário oficial: aba <strong>Distribuir semanas</strong> ou{" "}
                            <Link
                              className="text-vivant-navy underline font-medium"
                              href={`/admin/vivant-care/propriedades/${params.id}/distribuir-semanas`}
                            >
                              abrir distribuição
                            </Link>
                            .
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/vivant-care/propriedades/${params.id}/distribuir-semanas`}>
                            <CalendarRange className="w-4 h-4 mr-2" />
                            Distribuir semanas
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoverCota(cota.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-vivant-green" />
                Documentos da casa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-2">
                <Input
                  placeholder="Título do documento"
                  value={tituloDocumento}
                  onChange={(e) => setTituloDocumento(e.target.value)}
                />
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,image/*,.txt"
                  onChange={(e) => setArquivoDocumento(e.target.files?.[0] ?? null)}
                />
                <Button onClick={uploadDocumento} className="bg-vivant-green hover:bg-vivant-green/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </div>
              {loadingDocumentos ? (
                <p className="text-sm text-gray-500">Carregando documentos...</p>
              ) : documentos.length === 0 ? (
                <p className="text-sm text-gray-500">Nenhum documento cadastrado para esta casa.</p>
              ) : (
                <div className="space-y-2">
                  {documentos.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between rounded-md border p-3">
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-vivant-navy hover:underline">
                        {doc.titulo}
                      </a>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => renomearDocumento(doc)}>
                          Renomear
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => removerDocumento(doc.id)} className="text-red-600">
                          Remover
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="imobilizado">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-vivant-green" />
                Imobilizado da casa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Nome do item"
                  value={assetForm.name}
                  onChange={(e) => setAssetForm((prev) => ({ ...prev, name: e.target.value }))}
                />
                <Select
                  value={assetForm.category}
                  onValueChange={(value) => setAssetForm((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {ASSET_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Valor unitário"
                  value={assetForm.unitValue}
                  onChange={(e) => setAssetForm((prev) => ({ ...prev, unitValue: e.target.value }))}
                />
                <Input
                  type="number"
                  min={1}
                  placeholder="Quantidade"
                  value={assetForm.quantity}
                  onChange={(e) => setAssetForm((prev) => ({ ...prev, quantity: Number(e.target.value) || 1 }))}
                />
              </div>
              <Input
                placeholder="Observações (opcional)"
                value={assetForm.notes}
                onChange={(e) => setAssetForm((prev) => ({ ...prev, notes: e.target.value }))}
              />
              <div className="flex gap-2">
                <Button onClick={salvarAsset} disabled={savingAsset} className="bg-vivant-green hover:bg-vivant-green/90">
                  {savingAsset ? "Salvando..." : editingAssetId ? "Salvar alterações" : "Cadastrar item"}
                </Button>
                {editingAssetId ? (
                  <Button variant="outline" onClick={() => {
                    setEditingAssetId(null);
                    setAssetForm({ name: "", category: "OUTROS", unitValue: "", quantity: 1, notes: "" });
                  }}>
                    Cancelar edição
                  </Button>
                ) : null}
              </div>
              <div className="space-y-2">
                {assetItems.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum item cadastrado no imobilizado.</p>
                ) : (
                  assetItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
                      <div>
                        <p className="font-medium text-vivant-navy">{item.name}</p>
                        <p className="text-xs text-gray-600">
                          {item.category} · Qtd: {item.quantity} · Unit: R$ {Number(item.unitValue).toFixed(2)} · Total: R$ {Number(item.totalValue).toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => editarAsset(item)}>
                          Editar
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600" onClick={() => excluirAsset(item.id)}>
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="planejamento">
          <PlanejamentoSemanasPanel propertyId={params.id} />
        </TabsContent>
        <TabsContent value="distribuicao">
          <DistribuirSemanasPanel propertyId={params.id} />
        </TabsContent>
        <TabsContent value="calendario">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-vivant-navy" />
                Calendário de uso
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarioPropriedade propriedadeId={params.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

    </div>
  );
}
