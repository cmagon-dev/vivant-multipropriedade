"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, Plus, Settings, Upload } from "lucide-react";
import { toast } from "sonner";

type DocumentoCasa = {
  id: string;
  titulo: string;
  url: string;
};

type AssetItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unitValue: string | number;
  totalValue: string | number;
  notes?: string | null;
};

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

export function PropertyDocsAssetsManager({
  propertyId,
  sections = "both",
}: {
  propertyId: string;
  sections?: "both" | "documents" | "assets";
}) {
  const [documentos, setDocumentos] = useState<DocumentoCasa[]>([]);
  const [loadingDocumentos, setLoadingDocumentos] = useState(false);
  const [tituloDocumento, setTituloDocumento] = useState("");
  const [arquivoDocumento, setArquivoDocumento] = useState<File | null>(null);
  const [assetItems, setAssetItems] = useState<AssetItem[]>([]);
  const [savingAsset, setSavingAsset] = useState(false);
  const [importingAssets, setImportingAssets] = useState(false);
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const assetsImportInputRef = useRef<HTMLInputElement | null>(null);
  const [assetForm, setAssetForm] = useState({
    name: "",
    category: "OUTROS",
    unitValue: "",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    void carregarDocumentos();
    void carregarAssets();
  }, [propertyId]);

  const carregarDocumentos = async () => {
    setLoadingDocumentos(true);
    try {
      const response = await fetch(`/api/admin/documentos?propertyId=${propertyId}`);
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
      const response = await fetch(`/api/admin/propriedades/${propertyId}/assets`);
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
    fd.append("propertyId", propertyId);
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
          ? `/api/admin/propriedades/${propertyId}/assets/${editingAssetId}`
          : `/api/admin/propriedades/${propertyId}/assets`,
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
    const response = await fetch(`/api/admin/propriedades/${propertyId}/assets/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Erro ao excluir item.");
      return;
    }
    toast.success("Item removido.");
    await carregarAssets();
  };

  const exportarAssetsExcel = () => {
    window.open(`/api/admin/propriedades/${propertyId}/assets?format=xlsx`, "_blank");
  };

  const importarAssetsExcel = async (file: File | null) => {
    if (!file) return;
    setImportingAssets(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const response = await fetch(`/api/admin/propriedades/${propertyId}/assets`, {
        method: "POST",
        body: fd,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        toast.error(err.error || "Erro ao importar planilha.");
        return;
      }

      const data = await response.json().catch(() => ({ imported: 0 }));
      toast.success(`Importação concluída. ${data.imported ?? 0} itens adicionados.`);
      await carregarAssets();
    } finally {
      setImportingAssets(false);
      if (assetsImportInputRef.current) {
        assetsImportInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-6">
      {(sections === "both" || sections === "documents") && (
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
      )}

      {(sections === "both" || sections === "assets") && (
        <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-vivant-green" />
            Imobilizado da casa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={exportarAssetsExcel}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Excel
            </Button>
            <input
              ref={assetsImportInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => void importarAssetsExcel(e.target.files?.[0] ?? null)}
            />
            <Button
              variant="outline"
              disabled={importingAssets}
              onClick={() => assetsImportInputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {importingAssets ? "Importando..." : "Importar Excel"}
            </Button>
          </div>
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
      )}
    </div>
  );
}

