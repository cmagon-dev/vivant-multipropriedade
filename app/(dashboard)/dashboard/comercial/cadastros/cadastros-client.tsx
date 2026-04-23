"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Plus, Search, Filter, Building2, MapPin, User, DollarSign,
  ChevronDown, Edit2, Trash2, X, Check, AlertCircle, TrendingUp,
  BarChart2, Home, Phone, Mail, FileText, ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type StatusKey =
  | "ANALISE_INICIAL" | "EM_NEGOCIACAO" | "PROPOSTA_ENVIADA"
  | "DUE_DILIGENCE" | "CONTRATO_ASSINADO" | "ADQUIRIDO"
  | "DECLINADO" | "DESCARTADO";

const STATUS_CONFIG: Record<StatusKey, { label: string; color: string; dot: string }> = {
  ANALISE_INICIAL:    { label: "Análise Inicial",    color: "bg-blue-100 text-blue-700",     dot: "bg-blue-500" },
  EM_NEGOCIACAO:      { label: "Em Negociação",       color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  PROPOSTA_ENVIADA:   { label: "Proposta Enviada",    color: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  DUE_DILIGENCE:      { label: "Due Diligence",       color: "bg-purple-100 text-purple-700", dot: "bg-purple-500" },
  CONTRATO_ASSINADO:  { label: "Contrato Assinado",   color: "bg-teal-100 text-teal-700",     dot: "bg-teal-500" },
  ADQUIRIDO:          { label: "Adquirido",           color: "bg-green-100 text-green-700",   dot: "bg-green-500" },
  DECLINADO:          { label: "Declinado",           color: "bg-red-100 text-red-700",       dot: "bg-red-500" },
  DESCARTADO:         { label: "Descartado",          color: "bg-gray-100 text-gray-500",     dot: "bg-gray-400" },
};

const TIPO_OPTIONS = ["Casa", "Apartamento", "Terreno", "Chácara", "Fazenda", "Outro"];
const ORIGEM_OPTIONS = ["Indicação", "Google", "Instagram", "Facebook", "Parceiro Imobiliário", "Visita Direta", "Outro"];
const ESTADO_OPTIONS = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];

// ─── Geração automática de título ────────────────────────────────────────────

const TIPO_CODES: Record<string, string> = {
  "Casa": "C",
  "Apartamento": "A",
  "Terreno": "T",
  "Chácara": "CH",
  "Fazenda": "F",
};

const COND_PREFIXES = [
  "condomínio ", "condominio ", "cond. ", "cond ",
  "residencial ", "res. ", "res ",
  "village ", "loteamento ", "lot. ", "lot ",
  "jardim ", "parque ",
];

function abreviarCondominio(cond: string): string {
  const s = cond.trim();
  const lower = s.toLowerCase();
  for (const prefix of COND_PREFIXES) {
    if (lower.startsWith(prefix)) {
      return s.slice(prefix.length).trim();
    }
  }
  return s;
}

/** Remove sufixo de estado do nome do destino (ex: "Porto Rico/PR" → "Porto Rico") */
function abreviarDestino(name: string): string {
  // Remove padrões como "/PR", " - PR", " PR" no final
  return name.replace(/[\s/–-]+[A-Z]{2}$/, "").trim();
}

const CURRENT_YEAR = new Date().getFullYear().toString().slice(-2);

export function gerarTitulo(
  tipo: string | null,
  condominio: string | null,
  destinoName: string | null
): string {
  const typeCode = tipo ? (TIPO_CODES[tipo] ?? "D") : "D";
  const condPart = condominio?.trim() ? abreviarCondominio(condominio.trim()) : "";
  const destPart = destinoName?.trim() ? abreviarDestino(destinoName.trim()) : "";

  const locPart = condPart || destPart
    ? ` ${condPart}${condPart && destPart ? "/" : ""}${destPart}`
    : "";

  return `Residência V${typeCode}-##${CURRENT_YEAR}${locPart}`;
}

type Destino = { id: string; name: string; emoji: string };
type Usuario = { id: string; name: string };

type Cadastro = {
  id: string;
  status: StatusKey;
  titulo: string;
  tipo: string | null;
  destino: Destino | null;
  condominio: string | null;
  cidade: string | null;
  estado: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cep: string | null;
  areaTotal: number | null;
  areaTerreno: number | null;
  areaConstruida: number | null;
  valorPedido: number | null;
  valorProposta: number | null;
  valorAcordado: number | null;
  valorReforma: number | null;
  numCotas: number | null;
  valorCota: number | null;
  vgvEstimado: number | null;
  margemEstimada: number | null;
  taxaOcupacao: number | null;
  rentabilidadeAnual: number | null;
  vendedorNome: string | null;
  vendedorTelefone: string | null;
  vendedorEmail: string | null;
  vendedorCpfCnpj: string | null;
  vendedorObservacoes: string | null;
  descricao: string | null;
  observacoes: string | null;
  motivoDeclinado: string | null;
  origem: string | null;
  responsavel: Usuario | null;
  createdBy: Usuario;
  createdAt: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (v: number | null | undefined, prefix = "R$ ") =>
  v != null ? `${prefix}${v.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}` : "—";
const fmtPct = (v: number | null | undefined) => (v != null ? `${v}%` : "—");
const fmtArea = (v: number | null | undefined) => (v != null ? `${v} m²` : "—");

// ─── Formatação pt-BR para inputs ─────────────────────────────────────────────

function formatBRL(v: number | null | undefined): string {
  if (v == null) return "";
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseBRL(s: string): number | null {
  const clean = s.trim().replace(/\./g, "").replace(",", ".");
  const n = parseFloat(clean);
  return isNaN(n) ? null : Math.round(n * 100) / 100;
}

function formatPct(v: number | null | undefined): string {
  if (v == null) return "";
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parsePct(s: string): number | null {
  const clean = s.trim().replace(",", ".");
  const n = parseFloat(clean);
  return isNaN(n) ? null : Math.round(n * 100) / 100;
}

function MoneyInput({
  value, onChange, placeholder, readOnly, className,
}: {
  value: number | null | undefined;
  onChange?: (v: number | null) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}) {
  const [local, setLocal] = useState(() => formatBRL(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setLocal(formatBRL(value));
  }, [value]);

  if (readOnly) {
    return (
      <Input
        value={local || "—"}
        readOnly
        className={`bg-gray-50 text-gray-700 font-medium cursor-default ${className ?? ""}`}
      />
    );
  }
  return (
    <Input
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onFocus={() => { focused.current = true; }}
      onBlur={() => {
        focused.current = false;
        const parsed = parseBRL(local);
        setLocal(parsed != null ? formatBRL(parsed) : "");
        onChange?.(parsed);
      }}
      placeholder={placeholder ?? "0,00"}
      className={className}
    />
  );
}

function PctInput({
  value, onChange, placeholder, readOnly, className,
}: {
  value: number | null | undefined;
  onChange?: (v: number | null) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}) {
  const [local, setLocal] = useState(() => formatPct(value));
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) setLocal(formatPct(value));
  }, [value]);

  if (readOnly) {
    return (
      <Input
        value={local ? `${local}%` : "—"}
        readOnly
        className={`bg-gray-50 text-gray-700 font-medium cursor-default ${className ?? ""}`}
      />
    );
  }
  return (
    <Input
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onFocus={() => { focused.current = true; }}
      onBlur={() => {
        focused.current = false;
        const parsed = parsePct(local);
        setLocal(parsed != null ? formatPct(parsed) : "");
        onChange?.(parsed);
      }}
      placeholder={placeholder ?? "0,00"}
      className={className}
    />
  );
}

// ─── Formulário em branco ──────────────────────────────────────────────────────

const BLANK: Omit<Cadastro, "id" | "createdBy" | "createdAt" | "destino" | "responsavel"> & {
  destinoId: string; responsavelId: string; markup: number | null;
} = {
  status: "ANALISE_INICIAL", titulo: "", tipo: null,
  destinoId: "", responsavelId: "",
  condominio: null, endereco: null, numero: null, complemento: null,
  bairro: null, cidade: null, estado: null, cep: null,
  areaTotal: null, areaTerreno: null, areaConstruida: null,
  valorPedido: null, valorProposta: null, valorAcordado: null, valorReforma: null,
  numCotas: null, valorCota: null, vgvEstimado: null, margemEstimada: null,
  taxaOcupacao: null, rentabilidadeAnual: null,
  markup: null,
  vendedorNome: null, vendedorTelefone: null, vendedorEmail: null,
  vendedorCpfCnpj: null, vendedorObservacoes: null,
  descricao: null, observacoes: null, motivoDeclinado: null, origem: null,
};

// ─── Componente principal ─────────────────────────────────────────────────────

export function CadastrosClient({
  initialData,
  destinos,
  usuarios,
}: {
  initialData: Cadastro[];
  destinos: Destino[];
  usuarios: Usuario[];
}) {
  const [data, setData] = useState<Cadastro[]>(initialData);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDestino, setFilterDestino] = useState<string>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cadastro | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ ...BLANK });
  const [tituloManual, setTituloManual] = useState(false);

  // ── Auto-geração do título ─────────────────────────────────────────────────
  useEffect(() => {
    if (tituloManual) return;
    const destinoName = destinos.find((d) => d.id === form.destinoId)?.name ?? null;
    const gerado = gerarTitulo(form.tipo, form.condominio, destinoName);
    setForm((f) => ({ ...f, titulo: gerado }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.tipo, form.condominio, form.destinoId, tituloManual]);

  // ── Auto-cálculo financeiro ────────────────────────────────────────────────
  // VGV = valorAcordado × (1 + markup/100)
  // valorCota = VGV / numCotas
  // margemBruta = (VGV - valorAcordado) / VGV × 100
  useEffect(() => {
    const { valorAcordado, numCotas, markup } = form;
    if (valorAcordado && numCotas && markup != null) {
      const vgv    = valorAcordado * (1 + markup / 100);
      const cota   = vgv / numCotas;
      const margem = ((vgv - valorAcordado) / vgv) * 100;
      setForm((f) => ({
        ...f,
        vgvEstimado:    Math.round(vgv    * 100) / 100,
        valorCota:      Math.round(cota   * 100) / 100,
        margemEstimada: Math.round(margem * 100) / 100,
      }));
    } else if (!valorAcordado || !numCotas) {
      setForm((f) => ({ ...f, vgvEstimado: null, valorCota: null, margemEstimada: null }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.valorAcordado, form.numCotas, form.markup]);

  // Filtros
  const filtered = useMemo(() => {
    return data.filter((c) => {
      if (filterStatus !== "all" && c.status !== filterStatus) return false;
      if (filterDestino !== "all" && c.destino?.id !== filterDestino) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.titulo.toLowerCase().includes(q) ||
          (c.cidade ?? "").toLowerCase().includes(q) ||
          (c.condominio ?? "").toLowerCase().includes(q) ||
          (c.vendedorNome ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [data, search, filterStatus, filterDestino]);

  // Contadores por status
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    data.forEach((d) => { c[d.status] = (c[d.status] ?? 0) + 1; });
    return c;
  }, [data]);

  // ── Abrir modal ────────────────────────────────────────────────────────────
  const openNew = () => {
    setEditing(null);
    setTituloManual(false);
    setForm({ ...BLANK });
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (c: Cadastro) => {
    setEditing(c);
    setTituloManual(true); // ao editar, preserva o título existente
    setForm({
      status: c.status, titulo: c.titulo, tipo: c.tipo,
      destinoId: c.destino?.id ?? "",
      responsavelId: c.responsavel?.id ?? "",
      condominio: c.condominio, endereco: c.endereco, numero: c.numero,
      complemento: c.complemento, bairro: c.bairro, cidade: c.cidade,
      estado: c.estado, cep: c.cep,
      areaTotal: c.areaTotal, areaTerreno: c.areaTerreno, areaConstruida: c.areaConstruida,
      valorPedido: c.valorPedido, valorProposta: c.valorProposta,
      valorAcordado: c.valorAcordado, valorReforma: c.valorReforma,
      numCotas: c.numCotas, valorCota: c.valorCota, vgvEstimado: c.vgvEstimado,
      margemEstimada: c.margemEstimada, taxaOcupacao: c.taxaOcupacao,
      rentabilidadeAnual: c.rentabilidadeAnual,
      vendedorNome: c.vendedorNome, vendedorTelefone: c.vendedorTelefone,
      vendedorEmail: c.vendedorEmail, vendedorCpfCnpj: c.vendedorCpfCnpj,
      vendedorObservacoes: c.vendedorObservacoes,
      markup: null, // markup não é persistido; recalcular se necessário
      descricao: c.descricao, observacoes: c.observacoes,
      motivoDeclinado: c.motivoDeclinado, origem: c.origem,
    });
    setError(null);
    setModalOpen(true);
  };

  // ── Salvar ─────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!form.titulo.trim()) { setError("Título é obrigatório"); return; }
    setSaving(true); setError(null);
    try {
      const payload = {
        ...form,
        destinoId: form.destinoId || null,
        responsavelId: form.responsavelId || null,
      };
      const url = editing
        ? `/api/comercial/cadastros/${editing.id}`
        : "/api/comercial/cadastros";
      const res = await fetch(url, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error ?? "Erro ao salvar");
        return;
      }
      const saved: Cadastro = await res.json();
      setData((prev) =>
        editing
          ? prev.map((c) => (c.id === saved.id ? saved : c))
          : [saved, ...prev]
      );
      setModalOpen(false);
    } catch {
      setError("Erro de conexão");
    } finally {
      setSaving(false);
    }
  }, [form, editing]);

  // ── Deletar ────────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await fetch(`/api/comercial/cadastros/${deleteId}`, { method: "DELETE" });
      setData((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } catch {
      // silent
    } finally {
      setDeleting(false);
    }
  }, [deleteId]);

  const set = (k: string, v: unknown) =>
    setForm((f) => ({ ...f, [k]: v === "" ? null : v }));

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cadastros de Imóveis</h1>
          <p className="text-sm text-gray-500 mt-0.5">Pipeline de captação e análise de imóveis</p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" /> Novo Cadastro
        </Button>
      </div>

      {/* Cards de status */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {(Object.keys(STATUS_CONFIG) as StatusKey[]).map((s) => {
          const cfg = STATUS_CONFIG[s];
          const active = filterStatus === s;
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(active ? "all" : s)}
              className={`rounded-lg border p-3 text-left transition-all hover:shadow-sm ${
                active ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white"
              }`}
            >
              <div className={`text-lg font-bold ${active ? "text-white" : "text-gray-900"}`}>
                {counts[s] ?? 0}
              </div>
              <div className={`text-xs mt-0.5 leading-tight ${active ? "text-gray-200" : "text-gray-500"}`}>
                {cfg.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por título, cidade, condomínio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterDestino} onValueChange={setFilterDestino}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Destino" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os destinos</SelectItem>
            {destinos.map((d) => (
              <SelectItem key={d.id} value={d.id}>
                {d.emoji} {d.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {(filterStatus !== "all" || filterDestino !== "all" || search) && (
          <Button variant="ghost" size="sm" onClick={() => { setFilterStatus("all"); setFilterDestino("all"); setSearch(""); }} className="gap-1 text-gray-500">
            <X className="h-3.5 w-3.5" /> Limpar
          </Button>
        )}
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Building2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum cadastro encontrado</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Imóvel</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Localização</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Valores</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Viabilidade</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Responsável</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((c) => {
                const cfg = STATUS_CONFIG[c.status];
                return (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{c.titulo}</div>
                      {c.tipo && <div className="text-xs text-gray-400">{c.tipo}</div>}
                      {c.areaTotal && (
                        <div className="text-xs text-gray-400 mt-0.5">{fmtArea(c.areaTotal)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.destino && (
                        <div className="text-xs font-medium text-gray-700">
                          {c.destino.emoji} {c.destino.name}
                        </div>
                      )}
                      {c.cidade && (
                        <div className="text-xs text-gray-400">{c.cidade}{c.estado ? `, ${c.estado}` : ""}</div>
                      )}
                      {c.condominio && (
                        <div className="text-xs text-gray-400">{c.condominio}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.valorPedido && (
                        <div className="text-xs text-gray-600">Pedido: <span className="font-medium">{fmt(c.valorPedido)}</span></div>
                      )}
                      {c.valorProposta && (
                        <div className="text-xs text-gray-600">Proposta: <span className="font-medium">{fmt(c.valorProposta)}</span></div>
                      )}
                      {c.valorAcordado && (
                        <div className="text-xs text-green-700 font-medium">Acordado: {fmt(c.valorAcordado)}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {c.numCotas && (
                        <div className="text-xs text-gray-600">{c.numCotas} cotas {c.valorCota ? `× ${fmt(c.valorCota)}` : ""}</div>
                      )}
                      {c.vgvEstimado && (
                        <div className="text-xs text-gray-600">VGV: <span className="font-medium">{fmt(c.vgvEstimado)}</span></div>
                      )}
                      {c.margemEstimada && (
                        <div className="text-xs text-gray-600">Margem: <span className="font-medium">{fmtPct(c.margemEstimada)}</span></div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-gray-600">{c.responsavel?.name ?? c.createdBy.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEdit(c)}
                          className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteId(c.id)}
                          className="p-1.5 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal criar/editar */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Cadastro" : "Novo Cadastro de Imóvel"}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="imovel" className="mt-2">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="imovel" className="gap-1.5 text-xs"><Home className="h-3.5 w-3.5" />Imóvel</TabsTrigger>
              <TabsTrigger value="financeiro" className="gap-1.5 text-xs"><DollarSign className="h-3.5 w-3.5" />Financeiro</TabsTrigger>
              <TabsTrigger value="vendedor" className="gap-1.5 text-xs"><User className="h-3.5 w-3.5" />Vendedor</TabsTrigger>
              <TabsTrigger value="obs" className="gap-1.5 text-xs"><FileText className="h-3.5 w-3.5" />Obs.</TabsTrigger>
            </TabsList>

            {/* ABA: Imóvel */}
            <TabsContent value="imovel" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label>
                      Título / Nome do imóvel <span className="text-red-500">*</span>
                    </Label>
                    {tituloManual ? (
                      <button
                        type="button"
                        onClick={() => setTituloManual(false)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        ↺ Regenerar automático
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Auto-gerado · clique para editar</span>
                    )}
                  </div>
                  <Input
                    value={form.titulo}
                    onChange={(e) => {
                      setTituloManual(true);
                      set("titulo", e.target.value);
                    }}
                    placeholder="Preenchido automaticamente"
                    className={tituloManual ? "" : "bg-gray-50 text-gray-600"}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => set("status", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {(Object.keys(STATUS_CONFIG) as StatusKey[]).map((s) => (
                        <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Tipo</Label>
                  <Select value={form.tipo ?? ""} onValueChange={(v) => set("tipo", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      {TIPO_OPTIONS.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Destino</Label>
                  <Select value={form.destinoId || "__none__"} onValueChange={(v) => set("destinoId", v === "__none__" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">Sem destino</SelectItem>
                      {destinos.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.emoji} {d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Condomínio</Label>
                  <Input value={form.condominio ?? ""} onChange={(e) => set("condominio", e.target.value)} placeholder="Nome do condomínio" />
                </div>
              </div>

              {/* Endereço */}
              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />Endereço</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <Label>Endereço</Label>
                    <Input value={form.endereco ?? ""} onChange={(e) => set("endereco", e.target.value)} placeholder="Rua, Av., Rod..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Número</Label>
                    <Input value={form.numero ?? ""} onChange={(e) => set("numero", e.target.value)} placeholder="123" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Complemento</Label>
                    <Input value={form.complemento ?? ""} onChange={(e) => set("complemento", e.target.value)} placeholder="Apto, Bloco..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Bairro</Label>
                    <Input value={form.bairro ?? ""} onChange={(e) => set("bairro", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>CEP</Label>
                    <Input value={form.cep ?? ""} onChange={(e) => set("cep", e.target.value)} placeholder="00000-000" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Cidade</Label>
                    <Input value={form.cidade ?? ""} onChange={(e) => set("cidade", e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Estado</Label>
                  <Select value={form.estado || "__none__"} onValueChange={(v) => set("estado", v === "__none__" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="UF" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">—</SelectItem>
                      {ESTADO_OPTIONS.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  </div>
                </div>
              </div>

              {/* Áreas */}
              <div className="border-t pt-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Áreas (m²)</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label>Área Total</Label>
                    <Input type="number" value={form.areaTotal ?? ""} onChange={(e) => set("areaTotal", e.target.value)} placeholder="m²" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Área do Terreno</Label>
                    <Input type="number" value={form.areaTerreno ?? ""} onChange={(e) => set("areaTerreno", e.target.value)} placeholder="m²" />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Área Construída</Label>
                    <Input type="number" value={form.areaConstruida ?? ""} onChange={(e) => set("areaConstruida", e.target.value)} placeholder="m²" />
                  </div>
                </div>
              </div>

              {/* Origem */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="space-y-1.5">
                  <Label>Origem da captação</Label>
                  <Select value={form.origem || "__none__"} onValueChange={(v) => set("origem", v === "__none__" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Como surgiu?" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">—</SelectItem>
                      {ORIGEM_OPTIONS.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Responsável</Label>
                  <Select value={form.responsavelId || "__none__"} onValueChange={(v) => set("responsavelId", v === "__none__" ? "" : v)}>
                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">—</SelectItem>
                      {usuarios.map((u) => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* ABA: Financeiro */}
            <TabsContent value="financeiro" className="space-y-4 mt-4">
              {/* Valores de negociação */}
              <div className="border-b pb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5" />Valores de Negociação
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Valor Pedido (R$)</Label>
                    <MoneyInput value={form.valorPedido} onChange={(v) => set("valorPedido", v)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Nossa Proposta (R$)</Label>
                    <MoneyInput value={form.valorProposta} onChange={(v) => set("valorProposta", v)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Valor Acordado (R$)</Label>
                    <MoneyInput value={form.valorAcordado} onChange={(v) => set("valorAcordado", v)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Estimativa de Reforma (R$)</Label>
                    <MoneyInput value={form.valorReforma} onChange={(v) => set("valorReforma", v)} />
                  </div>
                </div>
              </div>

              {/* Viabilidade — entrada */}
              <div className="border-b pb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />Viabilidade Financeira
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <Label>Número de Cotas</Label>
                    <Input
                      type="number"
                      value={form.numCotas ?? ""}
                      onChange={(e) => set("numCotas", e.target.value === "" ? null : Number(e.target.value))}
                      placeholder="Ex: 8"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Markup (%)</Label>
                    <PctInput
                      value={(form as any).markup}
                      onChange={(v) => setForm((f) => ({ ...f, markup: v }))}
                      placeholder="Ex: 40,00"
                    />
                  </div>
                  <div className="space-y-1.5 opacity-60">
                    <Label className="flex items-center gap-1">
                      Valor por Cota (R$)
                      <span className="text-xs font-normal text-gray-400 ml-1">auto</span>
                    </Label>
                    <MoneyInput value={form.valorCota} readOnly />
                  </div>
                </div>
              </div>

              {/* Resultados calculados */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Resultados Calculados</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5 opacity-60">
                    <Label className="flex items-center gap-1">
                      VGV Estimado (R$)
                      <span className="text-xs font-normal text-gray-400 ml-1">auto</span>
                    </Label>
                    <MoneyInput value={form.vgvEstimado} readOnly />
                  </div>
                  <div className="space-y-1.5 opacity-60">
                    <Label className="flex items-center gap-1">
                      Margem Bruta Estimada (%)
                      <span className="text-xs font-normal text-gray-400 ml-1">auto</span>
                    </Label>
                    <PctInput value={form.margemEstimada} readOnly />
                  </div>
                </div>

                {/* Resumo verde */}
                {form.vgvEstimado && form.valorAcordado ? (
                  <div className="mt-4 rounded-lg bg-green-50 border border-green-100 p-3 grid grid-cols-3 gap-3">
                    <div>
                      <div className="text-xs text-green-600 font-medium">VGV</div>
                      <div className="text-sm font-bold text-green-800">R$ {formatBRL(form.vgvEstimado)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-green-600 font-medium">Spread</div>
                      <div className="text-sm font-bold text-green-800">
                        R$ {formatBRL(form.vgvEstimado - form.valorAcordado)}
                      </div>
                    </div>
                    {form.valorReforma ? (
                      <div>
                        <div className="text-xs text-green-600 font-medium">Custo Total</div>
                        <div className="text-sm font-bold text-green-800">
                          R$ {formatBRL(form.valorAcordado + form.valorReforma)}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-xs text-green-600 font-medium">Margem Bruta</div>
                        <div className="text-sm font-bold text-green-800">{formatPct(form.margemEstimada)}%</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mt-3 text-center">
                    Preencha Valor Acordado, Nº de Cotas e Markup para calcular automaticamente.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* ABA: Vendedor */}
            <TabsContent value="vendedor" className="space-y-4 mt-4">
              <p className="text-xs text-gray-400">Todos os campos são opcionais.</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>Nome do Vendedor</Label>
                  <Input value={form.vendedorNome ?? ""} onChange={(e) => set("vendedorNome", e.target.value)} placeholder="Nome completo" />
                </div>
                <div className="space-y-1.5">
                  <Label>Telefone</Label>
                  <Input value={form.vendedorTelefone ?? ""} onChange={(e) => set("vendedorTelefone", e.target.value)} placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-1.5">
                  <Label>E-mail</Label>
                  <Input type="email" value={form.vendedorEmail ?? ""} onChange={(e) => set("vendedorEmail", e.target.value)} placeholder="vendedor@email.com" />
                </div>
                <div className="space-y-1.5">
                  <Label>CPF / CNPJ</Label>
                  <Input value={form.vendedorCpfCnpj ?? ""} onChange={(e) => set("vendedorCpfCnpj", e.target.value)} placeholder="000.000.000-00" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Observações sobre o vendedor</Label>
                <Textarea
                  value={form.vendedorObservacoes ?? ""}
                  onChange={(e) => set("vendedorObservacoes", e.target.value)}
                  placeholder="Histórico de negociações, preferências, contatos..."
                  rows={4}
                />
              </div>
            </TabsContent>

            {/* ABA: Observações */}
            <TabsContent value="obs" className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label>Descrição do imóvel</Label>
                <Textarea
                  value={form.descricao ?? ""}
                  onChange={(e) => set("descricao", e.target.value)}
                  placeholder="Características, diferenciais, estado de conservação..."
                  rows={4}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Observações internas</Label>
                <Textarea
                  value={form.observacoes ?? ""}
                  onChange={(e) => set("observacoes", e.target.value)}
                  placeholder="Anotações da equipe, histórico de visitas..."
                  rows={3}
                />
              </div>
              {(form.status === "DECLINADO" || form.status === "DESCARTADO") && (
                <div className="space-y-1.5">
                  <Label>Motivo do declínio / descarte</Label>
                  <Textarea
                    value={form.motivoDeclinado ?? ""}
                    onChange={(e) => set("motivoDeclinado", e.target.value)}
                    placeholder="Explique o motivo..."
                    rows={3}
                  />
                </div>
              )}
            </TabsContent>
          </Tabs>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? "Salvando..." : <><Check className="h-4 w-4" /> {editing ? "Salvar alterações" : "Criar cadastro"}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal confirmar exclusão */}
      <Dialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">
            Tem certeza que deseja excluir este cadastro? A ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
