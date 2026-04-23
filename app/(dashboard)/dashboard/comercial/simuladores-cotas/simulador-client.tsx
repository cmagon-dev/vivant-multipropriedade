"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Printer, Calculator, ChevronDown, ChevronUp, Building2, User, Loader2, FileDown } from "lucide-react";
import { calcularSimulacao, type SimuladorInputs, type TipoReforco } from "./calc";

// ─── Tipos ──────────────────────────────────────────────────────────────────────

type CadastroBasico = {
  id: string; titulo: string;
  numCotas: number | null; valorCota: number | null;
  valorAcordado: number | null; vgvEstimado: number | null;
  destino: { name: string } | null;
};
type Props = { cadastros: CadastroBasico[]; forceClienteMode?: boolean };

// ─── Formatação pt-BR ───────────────────────────────────────────────────────────

const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const pct = (v: number, d = 2) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }) + "%";
const numBR = (v: number, d = 2) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d });

function parseBRL(s: string) {
  const n = parseFloat(s.replace(/[R$\s.]/g, "").replace(",", "."));
  return isNaN(n) ? 0 : n;
}
function parsePct(s: string) {
  const n = parseFloat(s.replace(/[%\s]/g, "").replace(",", "."));
  return isNaN(n) ? 0 : n;
}
const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtPct = (v: number) =>
  v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Inputs formatados ─────────────────────────────────────────────────────────

function MoneyInput({ value, onChange, label, readOnly }: {
  value: number; onChange?: (v: number) => void; label?: string; readOnly?: boolean;
}) {
  const [local, setLocal] = useState(fmtBRL(value));
  const focused = useRef(false);
  useEffect(() => { if (!focused.current) setLocal(fmtBRL(value)); }, [value]);
  return (
    <div className="space-y-1">
      {label && <Label className="text-xs text-gray-600">{label}</Label>}
      {readOnly
        ? <Input value={fmtBRL(value)} readOnly className="bg-gray-50 font-medium cursor-default text-sm" />
        : <Input value={local}
            onChange={(e) => setLocal(e.target.value)}
            onFocus={() => { focused.current = true; }}
            onBlur={() => {
              focused.current = false;
              const p = parseBRL(local); setLocal(fmtBRL(p)); onChange?.(p);
            }}
            className="text-sm" />
      }
    </div>
  );
}

function PctInput({ value, onChange, label, readOnly, suffix = "%" }: {
  value: number; onChange?: (v: number) => void; label?: string; readOnly?: boolean; suffix?: string;
}) {
  const [local, setLocal] = useState(fmtPct(value));
  const focused = useRef(false);
  useEffect(() => { if (!focused.current) setLocal(fmtPct(value)); }, [value]);
  return (
    <div className="space-y-1">
      {label && <Label className="text-xs text-gray-600">{label}</Label>}
      <div className="relative">
        {readOnly
          ? <Input value={fmtPct(value)} readOnly className="bg-gray-50 font-medium cursor-default text-sm pr-8" />
          : <Input value={local}
              onChange={(e) => setLocal(e.target.value)}
              onFocus={() => { focused.current = true; }}
              onBlur={() => {
                focused.current = false;
                const p = parsePct(local); setLocal(fmtPct(p)); onChange?.(p);
              }}
              className="text-sm pr-8" />
        }
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{suffix}</span>
      </div>
    </div>
  );
}

function NumberInput({ value, onChange, label, min = 0 }: {
  value: number; onChange: (v: number) => void; label?: string; min?: number;
}) {
  return (
    <div className="space-y-1">
      {label && <Label className="text-xs text-gray-600">{label}</Label>}
      <Input type="number" min={min} value={value}
        onChange={(e) => { const n = parseInt(e.target.value, 10); if (!isNaN(n) && n >= min) onChange(n); }}
        className="text-sm" />
    </div>
  );
}

// ─── Seção colapsável ───────────────────────────────────────────────────────────

function Section({ title, children, badge, right }: {
  title: string; children: React.ReactNode; badge?: string; right?: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  // #region agent log
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{title}</span>
          {badge && <Badge variant="secondary" className="text-xs">{badge}</Badge>}
        </div>
        <div className="flex items-center gap-2">
          {right}
          {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>
      {open && <div className="p-4 space-y-3 bg-white">{children}</div>}
    </div>
  );
}

// ─── Cards de resumo ────────────────────────────────────────────────────────────

function SummaryCard({ label, value, sub, sub2, highlight, neutral }: {
  label: string; value: string; sub?: string; sub2?: string; highlight?: boolean; neutral?: boolean;
}) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? "bg-emerald-50 border-emerald-200" : neutral ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"}`}>
      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-lg font-bold ${highlight ? "text-emerald-700" : neutral ? "text-blue-700" : "text-gray-900"}`}>
        {value}
      </p>
      {sub  && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      {sub2 && <p className="text-xs text-gray-400 mt-0">{sub2}</p>}
    </div>
  );
}

// ─── DRE ────────────────────────────────────────────────────────────────────────

function DRESection({ title, note }: { title: string; note?: string }) {
  return (
    <tr>
      <td colSpan={3} className="pt-4 pb-0.5 px-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap px-1">{title}</span>
          {note && <span className="text-xs text-gray-400 font-normal normal-case">({note})</span>}
          <div className="flex-1 h-px bg-gray-300" />
        </div>
      </td>
    </tr>
  );
}

function DRELine({ label, value, indent = false, indent2 = false, bold = false,
  negative = false, separator = false, highlight = false, dimmed = false, pctOf }: {
  label: string; value: number; indent?: boolean; indent2?: boolean;
  bold?: boolean; negative?: boolean; separator?: boolean;
  highlight?: boolean; dimmed?: boolean; pctOf?: number;
}) {
  const bg = highlight ? "bg-emerald-50" : (negative && value < 0) ? "bg-red-50" : dimmed ? "bg-amber-50" : "";
  const color = highlight ? "text-emerald-800" : (negative && value < 0) ? "text-red-700" : dimmed ? "text-amber-800" : "text-gray-700";
  const pl = indent2 ? "pl-10" : indent ? "pl-6" : "pl-2";
  return (
    <>
      {separator && <tr><td colSpan={3} className="py-0"><div className="border-t-2 border-gray-300" /></td></tr>}
      <tr className={bg}>
        <td className={`py-1.5 pr-4 text-sm ${pl} ${bold ? "font-semibold" : "font-normal"} ${color}`}>{label}</td>
        <td className={`py-1.5 text-right text-sm tabular-nums ${bold ? "font-semibold" : ""} ${color}`}>{brl(value)}</td>
        <td className="py-1.5 text-right text-xs tabular-nums text-gray-400 pl-4 w-20">
          {pctOf != null && pctOf !== 0 ? pct((value / pctOf) * 100) : ""}
        </td>
      </tr>
    </>
  );
}

function DREInfo({ label, value }: { label: string; value: string }) {
  return (
    <tr className="bg-gray-50">
      <td className="py-1 pl-10 pr-4 text-xs text-gray-400 italic">{label}</td>
      <td className="py-1 text-right text-xs tabular-nums text-gray-400 italic">{value}</td>
      <td />
    </tr>
  );
}

// ─── Visão do Cliente ───────────────────────────────────────────────────────────

type ClienteViewProps = {
  resultado: ReturnType<typeof calcularSimulacao>;
  imovelTitulo: string;
  nParcelas: number;
  nReforcos: number;
  tipoReforco: TipoReforco;
  pctEntrada: number;
  setPctEntrada: (v: number) => void;
  pctParcelas: number;
  setPctParcelas: (v: number) => void;
  pctReforcos: number;
  numSemanas: number;
  setNumSemanas: (v: number) => void;
  custoAquisicaoTotal: number;
  setCustoAquisicaoTotal: (v: number) => void;
  markup: number;
  setNParcelas: (v: number) => void;
  tipoReforcoSetter: (v: TipoReforco) => void;
  setNReforcos: (v: number) => void;
  taxaVivantMensal: number;
  setTaxaVivantMensal: (v: number) => void;
  ipcaAnual: number;
  setIpcaAnual: (v: number) => void;
  cadastros: CadastroBasico[];
  imovelId: string;
  onSelectImovel: (id: string) => void;
  isExporting: boolean;
};

function ClienteView({
  resultado, imovelTitulo, nParcelas, nReforcos, tipoReforco,
  pctEntrada, setPctEntrada, pctParcelas, setPctParcelas, pctReforcos,
  numSemanas, setNumSemanas, custoAquisicaoTotal, setCustoAquisicaoTotal,
  markup, setNParcelas, tipoReforcoSetter, setNReforcos,
  taxaVivantMensal, setTaxaVivantMensal, ipcaAnual, setIpcaAnual,
  cadastros, imovelId, onSelectImovel, isExporting,
}: ClienteViewProps) {
  // Toggles R$ | %
  const [entradaModo, setEntradaModo] = useState<"pct" | "valor">("pct");
  const [parcelasModo, setParcelasModo] = useState<"pct" | "valor">("pct");

  // Fórmula inversa do Price: dado PMT, retorna PV
  const pvFromPMT = (pmtVal: number, r: number, n: number) => {
    if (n <= 0) return 0;
    if (r === 0) return pmtVal * n;
    return pmtVal * (1 - Math.pow(1 + r, -n)) / r;
  };
  const valorCota = resultado.valorCotaVenda;
  const cota = resultado.porCota;
  const labelReforco = tipoReforco === "semestral" ? "Semestral" : "Anual";
  const labelReforcos = tipoReforco === "semestral" ? "Semestrais" : "Anuais";
  const taxaLabel = tipoReforco === "semestral" ? "a.s." : "a.a.";

  // Barra de progresso dos 3 componentes
  const totalPrincipal = cota.valorEntrada + cota.pvParcelas + cota.pvReforcos;
  const barEntrada  = totalPrincipal > 0 ? (cota.valorEntrada / totalPrincipal) * 100 : 0;
  const barParcelas = totalPrincipal > 0 ? (cota.pvParcelas  / totalPrincipal) * 100 : 0;
  const barReforcos = totalPrincipal > 0 ? (cota.pvReforcos  / totalPrincipal) * 100 : 0;

  return (
    <div className="flex gap-6 min-h-0">
      {/* ── Painel de inputs (cliente) ──────────────────────────── */}
      <aside className="w-72 shrink-0 space-y-4 print:hidden" id="cliente-inputs">
        {/* Imóvel */}
        <Section title="Imóvel">
          <div className="space-y-1">
            <Label className="text-xs text-gray-600">Empreendimento</Label>
            <Select value={imovelId || "__none__"} onValueChange={onSelectImovel}>
              <SelectTrigger className="text-sm"><SelectValue placeholder="Selecione…" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— Nenhum —</SelectItem>
                {cadastros.map((c) => <SelectItem key={c.id} value={c.id}>{c.titulo}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {imovelId && imovelId !== "__none__" && (
            <div className="grid grid-cols-3 gap-3 items-end">
              <NumberInput label="Semanas / Cota" value={numSemanas} onChange={setNumSemanas} min={1} />
              {numSemanas > 0 && (
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs text-gray-600">Valor da Cota</Label>
                  <Input
                    value={custoAquisicaoTotal > 0
                      ? brl(numSemanas * ((custoAquisicaoTotal * (1 + markup / 100)) / 52)) : "—"}
                    readOnly className="bg-emerald-50 text-emerald-800 font-bold cursor-default text-sm"
                  />
                </div>
              )}
            </div>
          )}
        </Section>

        {/* Estrutura de Venda e Taxas — apenas quando há imóvel e semanas definidas */}
        {imovelId && imovelId !== "__none__" && numSemanas > 0 && <Section title="Estrutura de Venda">
          {/* Entrada com toggle R$ | % */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600">Entrada</Label>
              <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs">
                <button
                  onClick={() => setEntradaModo("pct")}
                  className={`px-2.5 py-1 transition-colors ${entradaModo === "pct" ? "bg-emerald-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >%</button>
                <button
                  onClick={() => setEntradaModo("valor")}
                  className={`px-2.5 py-1 transition-colors border-l border-gray-200 ${entradaModo === "valor" ? "bg-emerald-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >R$</button>
              </div>
            </div>
            {entradaModo === "pct" ? (
              <PctInput value={pctEntrada} onChange={setPctEntrada} />
            ) : (
              <MoneyInput
                value={valorCota > 0 ? valorCota * (pctEntrada / 100) : 0}
                onChange={(v) => { if (valorCota > 0) setPctEntrada((v / valorCota) * 100); }}
              />
            )}
            {/* Mostrar o valor equivalente em pequeno */}
            <p className="text-xs text-gray-400">
              {entradaModo === "pct"
                ? valorCota > 0 ? `= ${brl(valorCota * pctEntrada / 100)}` : ""
                : `= ${pct(pctEntrada)}`}
            </p>
          </div>

          {/* Parcelas com toggle R$ | % */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-gray-600">Parcelas Mensais</Label>
              <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs">
                <button
                  onClick={() => setParcelasModo("pct")}
                  className={`px-2.5 py-1 transition-colors ${parcelasModo === "pct" ? "bg-emerald-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >%</button>
                <button
                  onClick={() => setParcelasModo("valor")}
                  className={`px-2.5 py-1 transition-colors border-l border-gray-200 ${parcelasModo === "valor" ? "bg-emerald-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >R$</button>
              </div>
            </div>
            {parcelasModo === "pct" ? (
              <PctInput value={pctParcelas} onChange={setPctParcelas} />
            ) : (
              <MoneyInput
                value={resultado.porCota.prestacaoMensal}
                onChange={(v) => {
                  if (valorCota > 0 && nParcelas > 0) {
                    const pv = pvFromPMT(v, resultado.taxaCombinadadMensal, nParcelas);
                    setPctParcelas((pv / valorCota) * 100);
                  }
                }}
              />
            )}
            <p className="text-xs text-gray-400">
              {parcelasModo === "pct"
                ? resultado.porCota.prestacaoMensal > 0
                  ? `= ${brl(resultado.porCota.prestacaoMensal)}/mês`
                  : ""
                : `= ${pct(pctParcelas)} do valor da cota`}
            </p>
          </div>

          <PctInput label="% Reforços (automático)" value={pctReforcos} readOnly />

          <div className="grid grid-cols-2 gap-3">
            <NumberInput label="Qtd. Parcelas" value={nParcelas} onChange={setNParcelas} min={1} />
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Tipo Reforço</Label>
              <Select value={tipoReforco} onValueChange={(v) => tipoReforcoSetter(v as TipoReforco)}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="anual">Anual</SelectItem>
                  <SelectItem value="semestral">Semestral</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <NumberInput label={`Qtd. Reforços ${labelReforcos}`} value={nReforcos} onChange={setNReforcos} min={1} />
        </Section>}

        {imovelId && imovelId !== "__none__" && numSemanas > 0 && <Section title="Taxas de Juros">
          <PctInput label="Taxa Vivant (% a.m.)" value={taxaVivantMensal} onChange={setTaxaVivantMensal} />
          <PctInput label="IPCA (% a.a.)" value={ipcaAnual} onChange={setIpcaAnual} suffix="% a.a." />
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-xs space-y-0.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Taxa mensal (parcelas):</span>
              <span className="font-semibold text-blue-700">{pct(resultado.taxaCombinadadMensal * 100)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Taxa reforços ({taxaLabel}):</span>
              <span className="font-semibold text-blue-700">{pct(resultado.taxaReforcoEfetiva * 100)}</span>
            </div>
          </div>
        </Section>}
      </aside>

      {/* ── Proposta visual ─────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5" id="cliente-proposta">

        {/* Cabeçalho de branding — visível apenas durante exportação PDF */}
        {isExporting && (
          <div className="flex items-center justify-between pb-5 mb-2 border-b-2 border-emerald-600">
            <div>
              <p className="text-2xl font-black text-emerald-700 tracking-tight">Vivant Multipropriedade</p>
              <p className="text-sm text-gray-500 mt-0.5">Proposta Comercial — Cota de Multipropriedade</p>
            </div>
            <div className="text-right text-sm text-gray-400 space-y-0.5">
              <p className="font-medium text-gray-600">{new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" })}</p>
              <p className="text-xs italic">Documento confidencial</p>
            </div>
          </div>
        )}

        {/* Header da proposta */}
        <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600 rounded-2xl p-7 text-white shadow-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-emerald-200 text-sm font-medium uppercase tracking-wider mb-1">Proposta de Aquisição</p>
              <h2 className="text-2xl font-bold leading-tight mb-3">
                {imovelTitulo || "Selecione um empreendimento"}
              </h2>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className="bg-white/20 rounded-full px-3 py-1">
                  {numSemanas} {numSemanas === 1 ? "semana" : "semanas"} / cota
                </span>
                {resultado.numCotas > 0 && (
                  <span className="bg-white/20 rounded-full px-3 py-1">
                    {numBR(resultado.numCotas, 2)} cotas disponíveis
                  </span>
                )}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-emerald-200 text-sm mb-1">Valor da Cota</p>
              <p className="text-4xl font-black">{brl(valorCota)}</p>
            </div>
          </div>
        </div>

        {/* Barra visual de composição */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Composição do Pagamento</p>
          <div className="flex rounded-full overflow-hidden h-4 mb-3 gap-0.5">
            <div className="bg-emerald-500 transition-all" style={{ width: `${barEntrada}%` }} title={`Entrada ${pct(barEntrada)}`} />
            <div className="bg-blue-500 transition-all" style={{ width: `${barParcelas}%` }} title={`Parcelas ${pct(barParcelas)}`} />
            <div className="bg-violet-500 transition-all" style={{ width: `${barReforcos}%` }} title={`Reforços ${pct(barReforcos)}`} />
          </div>
          <div className="flex gap-6 text-xs text-gray-600">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />Entrada {pct(pctEntrada)}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />Parcelas {pct(pctParcelas)}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-violet-500 inline-block" />Reforços {pct(pctReforcos)}</span>
          </div>
        </div>

        {/* 3 Cards de pagamento */}
        <div className="grid grid-cols-3 gap-4">
          {/* Entrada */}
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-5 space-y-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <span className="text-emerald-700 text-xs font-bold">1</span>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Entrada</p>
            </div>
            <p className="text-3xl font-black text-gray-900">{brl(cota.valorEntrada)}</p>
            <p className="text-sm text-emerald-600 font-medium">{pct(pctEntrada)} do valor da cota</p>
            <p className="text-xs text-gray-400 pt-1">Pagamento à vista na assinatura</p>
          </div>

          {/* Parcelas */}
          <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5 space-y-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 text-xs font-bold">2</span>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Parcelas Mensais</p>
            </div>
            <p className="text-3xl font-black text-gray-900">{brl(cota.prestacaoMensal)}</p>
            <p className="text-sm text-blue-600 font-medium">{nParcelas}× mensais</p>
            <div className="text-xs text-gray-400 pt-1 space-y-0.5">
              <div>Financiado: {brl(cota.pvParcelas)}</div>
              <div>Taxa: {pct(resultado.taxaCombinadadMensal * 100)} a.m.</div>
            </div>
          </div>

          {/* Reforços */}
          <div className="bg-white rounded-2xl border border-violet-100 shadow-sm p-5 space-y-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center">
                <span className="text-violet-700 text-xs font-bold">3</span>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Reforço {labelReforco}</p>
            </div>
            <p className="text-3xl font-black text-gray-900">{brl(cota.reforcoValor)}</p>
            <p className="text-sm text-violet-600 font-medium">{nReforcos}× {labelReforcos.toLowerCase()}</p>
            <div className="text-xs text-gray-400 pt-1 space-y-0.5">
              <div>Financiado: {brl(cota.pvReforcos)}</div>
              <div>Taxa: {pct(resultado.taxaReforcoEfetiva * 100)} {taxaLabel}</div>
            </div>
          </div>
        </div>

        {/* Total financiado */}
        <div className="bg-gray-900 rounded-2xl p-5 text-white flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Financiado por Cota</p>
            <p className="text-xs text-gray-500">Principal + juros acumulados ao longo do prazo</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black">{brl(cota.totalRecebidoCota)}</p>
            <p className="text-sm text-gray-400 mt-0.5">
              Principal: {brl(valorCota)} · Juros: {brl(cota.jurosTotaisCota)}
            </p>
          </div>
        </div>

        {/* Tabela de parcelas (colapsável) */}
        {cota.tabelaParcelas.length > 0 && (
          <ScheduleCard
            title={`Cronograma de Parcelas — ${nParcelas} meses`}
            taxaLabel={`${pct(resultado.taxaCombinadadMensal * 100)} a.m.`}
            rows={cota.tabelaParcelas}
            periodoLabel="Mês"
          />
        )}

        {cota.tabelaReforcos.length > 0 && (
          <ScheduleCard
            title={`Cronograma de Reforços — ${nReforcos} ${tipoReforco === "semestral" ? "Semestres" : "Anos"}`}
            taxaLabel={`${pct(resultado.taxaReforcoEfetiva * 100)} ${taxaLabel}`}
            rows={cota.tabelaReforcos}
            periodoLabel={tipoReforco === "semestral" ? "Semestre" : "Ano"}
            periodoMeses={cota.periodoReforcoMeses}
          />
        )}
      </div>
    </div>
  );
}

/** Tabela de amortização colapsável para a visão cliente */
function ScheduleCard({ title, taxaLabel, rows, periodoLabel, periodoMeses }: {
  title: string; taxaLabel: string;
  rows: { periodo: number; prestacao: number; juros: number; amortizacao: number; saldoDevedor: number }[];
  periodoLabel: string; periodoMeses?: number;
}) {
  const [open, setOpen] = useState(false);
  const totalJuros = rows.reduce((s, r) => s + r.juros, 0);
  return (
    <div className="schedule-card bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors print:hidden"
      >
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-800 text-left">{title}</p>
            <p className="text-xs text-gray-400">Taxa: {taxaLabel} · Juros totais: {brl(totalJuros)}</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {/* Cabeçalho visível apenas no print */}
      <div className="hidden print:flex items-center justify-between px-5 py-3 border-b border-gray-200">
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-400">Taxa: {taxaLabel} · Juros totais: {brl(totalJuros)}</p>
        </div>
      </div>
      <div className={`schedule-body overflow-x-auto border-t border-gray-100 ${open ? "max-h-96 overflow-y-auto" : "hidden"}`}>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {[periodoLabel, periodoMeses ? "Mês" : null, "Valor", "Juros", "Amortização", "Saldo"].filter(Boolean).map((h) => (
                <th key={h!} className={`px-4 py-2 text-xs font-medium text-gray-500 ${h === periodoLabel || h === "Mês" ? "text-left" : "text-right"}`}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.periodo} className="hover:bg-gray-50">
                <td className="px-4 py-1.5 tabular-nums text-gray-700">{row.periodo}</td>
                {periodoMeses && <td className="px-4 py-1.5 tabular-nums text-gray-400 text-xs">{row.periodo * periodoMeses}</td>}
                <td className="px-4 py-1.5 text-right tabular-nums font-medium">{brl(row.prestacao)}</td>
                <td className="px-4 py-1.5 text-right tabular-nums text-amber-600">{brl(row.juros)}</td>
                <td className="px-4 py-1.5 text-right tabular-nums text-blue-600">{brl(row.amortizacao)}</td>
                <td className="px-4 py-1.5 text-right tabular-nums text-gray-600">{brl(row.saldoDevedor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Defaults ───────────────────────────────────────────────────────────────────

const DEFAULTS = {
  pctEntrada: 30, pctParcelas: 25, nParcelas: 60,
  tipoReforco: "anual" as TipoReforco, nReforcos: 5,
  taxaVivantMensal: 1.0,      // 1% a.m.
  ipcaAnual: 4.0,             // 4% a.a.
  temAntecipacao: true,
  mesAntecipacao: 24,
  taxaAntecipacaoAnual: 12.0,
  pctSetup: 4, pctImpostos: 6.73, pctComissoes: 2, pctPlataforma: 0.55,
};

// ─── Componente principal ───────────────────────────────────────────────────────

export function SimuladorClient({ cadastros, forceClienteMode = false }: Props) {
  const [viewMode, setViewMode] = useState<"empresa" | "cliente">(forceClienteMode ? "cliente" : "empresa");
  const [isExporting, setIsExporting] = useState(false);

  const exportClientePDF = async () => {
    if (isExporting || !resultado) return;
    setIsExporting(true);
    try {
      const { jsPDF } = await import("jspdf");

      const pdf   = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const PW    = pdf.internal.pageSize.getWidth();   // 210
      const PH    = pdf.internal.pageSize.getHeight();  // 297
      const MX    = 14;   // margem horizontal
      const CW    = PW - MX * 2; // 182
      const cota  = resultado.porCota;
      const titulo = imovelSelecionado?.titulo ?? "Empreendimento";
      const hoje  = new Date().toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" });
      const taxaLabel = tipoReforco === "semestral" ? "a.s." : "a.a.";
      const labelReforcoUp = tipoReforco === "semestral" ? "SEMESTRAL" : "ANUAL";

      let y = 0;

      // ── helpers ──────────────────────────────────────────────────────
      const newPageIfNeeded = (needed: number) => {
        if (y + needed > PH - 14) { pdf.addPage(); y = 14; return true; }
        return false;
      };

      // ── CABEÇALHO VERDE ──────────────────────────────────────────────
      pdf.setFillColor(5, 150, 105);
      pdf.rect(0, 0, PW, 42, "F");

      // label topo
      pdf.setTextColor(167, 243, 208);
      pdf.setFontSize(7); pdf.setFont("helvetica", "bold");
      pdf.text("PROPOSTA DE AQUISIÇÃO  ·  VIVANT MULTIPROPRIEDADE", MX, 9);

      // nome do imóvel
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(15); pdf.setFont("helvetica", "bold");
      const tituloLines = pdf.splitTextToSize(titulo, CW - 55);
      pdf.text(tituloLines, MX, 18);

      // badges
      pdf.setFontSize(7); pdf.setFont("helvetica", "normal");
      pdf.setFillColor(255, 255, 255, 0.2);
      pdf.setTextColor(209, 250, 229);
      const badge1 = `${numSemanas} semanas / cota`;
      const badge2 = resultado.numCotas > 0 ? `${numBR(resultado.numCotas, 0)} cotas` : "";
      pdf.text(badge1, MX, 30);
      if (badge2) pdf.text(badge2, MX + pdf.getTextWidth(badge1) + 8, 30);

      // valor da cota (direita)
      pdf.setTextColor(167, 243, 208);
      pdf.setFontSize(7); pdf.setFont("helvetica", "normal");
      pdf.text("Valor da Cota", PW - MX, 12, { align: "right" });
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18); pdf.setFont("helvetica", "bold");
      pdf.text(brl(resultado.valorCotaVenda), PW - MX, 24, { align: "right" });

      y = 49;

      // ── DATA ─────────────────────────────────────────────────────────
      pdf.setTextColor(120, 120, 120);
      pdf.setFontSize(7.5); pdf.setFont("helvetica", "normal");
      pdf.text(hoje + "  ·  Documento Confidencial", MX, y);
      y += 8;

      // ── BARRA DE COMPOSIÇÃO ──────────────────────────────────────────
      pdf.setFontSize(8.5); pdf.setFont("helvetica", "bold"); pdf.setTextColor(40, 40, 40);
      pdf.text("Composição do Pagamento", MX, y); y += 4;

      const barH = 4;
      const wE = CW * (pctEntrada / 100);
      const wP = CW * (pctParcelas / 100);
      const wR = CW - wE - wP;

      pdf.setFillColor(16, 185, 129); pdf.roundedRect(MX,          y, wE, barH, 1, 1, "F");
      pdf.setFillColor(59, 130, 246); pdf.rect(MX + wE + 0.3,     y, wP, barH, "F");
      pdf.setFillColor(139, 92, 246); pdf.roundedRect(MX + wE + wP + 0.6, y, wR, barH, 1, 1, "F");

      y += barH + 3;
      pdf.setFontSize(7); pdf.setFont("helvetica", "normal");
      const dot = (r: number, g: number, b: number, tx: number) => {
        pdf.setFillColor(r, g, b); pdf.circle(MX + tx, y - 0.8, 1.3, "F");
      };
      dot(16, 185, 129, 0); pdf.setTextColor(60,60,60); pdf.text(`Entrada ${pct(pctEntrada)}`, MX + 3, y);
      dot(59, 130, 246, 36); pdf.text(`Parcelas ${pct(pctParcelas)}`, MX + 39, y);
      dot(139, 92, 246, 74); pdf.text(`Reforços ${pct(pctReforcos)}`, MX + 77, y);
      y += 9;

      // ── 3 CARDS ──────────────────────────────────────────────────────
      const cardW = (CW - 4) / 3;
      const cardH = 38;
      type RGB = [number, number, number];
      const cards: { label: string; sub: string; val: string; note: string; bg: RGB; border: RGB; txtColor: RGB }[] = [
        {
          label: "ENTRADA", sub: `${pct(pctEntrada)} do valor da cota`,
          val: brl(cota.valorEntrada),
          note: "Pagamento à vista na assinatura",
          bg: [236, 253, 245], border: [16, 185, 129], txtColor: [5, 120, 85],
        },
        {
          label: "PARCELAS MENSAIS", sub: `${nParcelas}× mensais`,
          val: brl(cota.prestacaoMensal),
          note: `Financiado: ${brl(cota.pvParcelas)}  |  Taxa: ${pct(resultado.taxaCombinadadMensal * 100)} a.m.`,
          bg: [239, 246, 255], border: [59, 130, 246], txtColor: [29, 78, 216],
        },
        {
          label: `REFORÇO ${labelReforcoUp}`, sub: `${nReforcos}× ${tipoReforco === "semestral" ? "semestrais" : "anuais"}`,
          val: brl(cota.reforcoValor),
          note: `Financiado: ${brl(cota.pvReforcos)}  |  Taxa: ${pct(resultado.taxaReforcoEfetiva * 100)} ${taxaLabel}`,
          bg: [245, 243, 255], border: [139, 92, 246], txtColor: [109, 40, 217],
        },
      ];
      cards.forEach((c, i) => {
        const cx = MX + i * (cardW + 2);
        pdf.setFillColor(...c.bg); pdf.roundedRect(cx, y, cardW, cardH, 2, 2, "F");
        pdf.setDrawColor(...c.border); pdf.setLineWidth(0.4); pdf.roundedRect(cx, y, cardW, cardH, 2, 2, "S");
        // número
        pdf.setFillColor(...c.border); pdf.circle(cx + 5, y + 5.5, 3.2, "F");
        pdf.setTextColor(255, 255, 255); pdf.setFontSize(6.5); pdf.setFont("helvetica", "bold");
        pdf.text(`${i + 1}`, cx + 5, y + 6.2, { align: "center" });
        // label
        pdf.setTextColor(100, 100, 100); pdf.setFontSize(6.5);
        pdf.text(c.label, cx + 11, y + 6);
        // valor
        pdf.setTextColor(20, 20, 20); pdf.setFontSize(13.5); pdf.setFont("helvetica", "bold");
        pdf.text(c.val, cx + 4, y + 18);
        // sub
        pdf.setTextColor(...c.txtColor); pdf.setFontSize(7.5); pdf.setFont("helvetica", "bold");
        pdf.text(c.sub, cx + 4, y + 24.5);
        // note
        pdf.setTextColor(120, 120, 120); pdf.setFontSize(6); pdf.setFont("helvetica", "normal");
        pdf.splitTextToSize(c.note, cardW - 6).forEach((line: string, li: number) => {
          pdf.text(line, cx + 4, y + 29.5 + li * 3.5);
        });
      });
      y += cardH + 5;

      // ── TOTAL ────────────────────────────────────────────────────────
      pdf.setFillColor(17, 24, 39);
      pdf.roundedRect(MX, y, CW, 17, 2, 2, "F");
      pdf.setTextColor(156, 163, 175); pdf.setFontSize(8); pdf.setFont("helvetica", "normal");
      pdf.text("Total Financiado por Cota", MX + 5, y + 6.5);
      pdf.setFontSize(6.5);
      pdf.text(`Principal: ${brl(resultado.valorCotaVenda)}  ·  Juros: ${brl(cota.jurosTotaisCota)}`, MX + 5, y + 12);
      pdf.setTextColor(255, 255, 255); pdf.setFontSize(14); pdf.setFont("helvetica", "bold");
      pdf.text(brl(cota.totalRecebidoCota), PW - MX, y + 11, { align: "right" });
      y += 23;

      // ── TABELAS DE AMORTIZAÇÃO ───────────────────────────────────────
      type Linha = { periodo: number; prestacao: number; juros: number; amortizacao: number; saldoDevedor: number };
      const drawTable = (title: string, taxa: string, rows: Linha[], perLabel: string, perMeses?: number) => {
        if (!rows.length) return;
        newPageIfNeeded(30);
        // título da tabela
        pdf.setFontSize(9); pdf.setFont("helvetica", "bold"); pdf.setTextColor(30, 30, 30);
        pdf.text(title, MX, y);
        pdf.setFontSize(7); pdf.setFont("helvetica", "normal"); pdf.setTextColor(110, 110, 110);
        const totalJ = rows.reduce((s, r) => s + r.juros, 0);
        pdf.text(`Taxa: ${taxa}  ·  Juros totais: ${brl(totalJ)}`, MX, y + 4);
        y += 9;

        const cols  = perMeses
          ? [perLabel, "Mês cal.", "Valor", "Juros", "Amortização", "Saldo"]
          : [perLabel, "Valor", "Juros", "Amortização", "Saldo"];
        const colW  = perMeses ? [14, 16, 36, 32, 36, 48] : [16, 44, 34, 34, 54];
        const RH    = 5;

        const drawHeader = () => {
          pdf.setFillColor(243, 244, 246);
          pdf.rect(MX, y, CW, RH, "F");
          let rx = MX;
          cols.forEach((col, ci) => {
            pdf.setFontSize(6.5); pdf.setFont("helvetica", "bold"); pdf.setTextColor(100, 100, 100);
            const isL = ci < (perMeses ? 2 : 1);
            pdf.text(col, isL ? rx + 1.5 : rx + colW[ci] - 1.5, y + 3.3, { align: isL ? "left" : "right" });
            rx += colW[ci];
          });
          y += RH;
        };
        drawHeader();

        rows.forEach((row, ri) => {
          if (newPageIfNeeded(RH + 2)) drawHeader();
          if (ri % 2 === 0) { pdf.setFillColor(249, 250, 251); pdf.rect(MX, y, CW, RH, "F"); }
          const vals = perMeses
            ? [`${row.periodo}`, `${row.periodo * perMeses!}`, brl(row.prestacao), brl(row.juros), brl(row.amortizacao), brl(row.saldoDevedor)]
            : [`${row.periodo}`, brl(row.prestacao), brl(row.juros), brl(row.amortizacao), brl(row.saldoDevedor)];
          let rx = MX;
          vals.forEach((v, vi) => {
            const isL = vi < (perMeses ? 2 : 1);
            const isJuros = vi === (perMeses ? 3 : 2);
            const isAmort = vi === (perMeses ? 4 : 3);
            pdf.setTextColor(isJuros ? 180 : isAmort ? 37 : 50, isJuros ? 90 : isAmort ? 99 : 50, isJuros ? 10 : isAmort ? 235 : 50);
            pdf.setFontSize(6.5); pdf.setFont("helvetica", "normal");
            pdf.text(v, isL ? rx + 1.5 : rx + colW[vi] - 1.5, y + 3.3, { align: isL ? "left" : "right" });
            rx += colW[vi];
          });
          pdf.setDrawColor(230, 230, 230); pdf.setLineWidth(0.1);
          pdf.line(MX, y + RH, MX + CW, y + RH);
          y += RH;
        });
        y += 7;
      };

      if (cota.tabelaParcelas.length > 0) {
        drawTable(
          `Cronograma de Parcelas — ${nParcelas} meses`,
          `${pct(resultado.taxaCombinadadMensal * 100)} a.m.`,
          cota.tabelaParcelas, "Mês"
        );
      }
      if (cota.tabelaReforcos.length > 0) {
        drawTable(
          `Cronograma de Reforços — ${nReforcos} ${tipoReforco === "semestral" ? "Semestres" : "Anos"}`,
          `${pct(resultado.taxaReforcoEfetiva * 100)} ${taxaLabel}`,
          cota.tabelaReforcos,
          tipoReforco === "semestral" ? "Semestre" : "Ano",
          cota.periodoReforcoMeses
        );
      }

      // ── RODAPÉ em todas as páginas ───────────────────────────────────
      const total = (pdf.internal as { getNumberOfPages(): number }).getNumberOfPages();
      for (let p = 1; p <= total; p++) {
        pdf.setPage(p);
        pdf.setDrawColor(210, 210, 210); pdf.setLineWidth(0.3);
        pdf.line(MX, PH - 11, PW - MX, PH - 11);
        pdf.setFontSize(7); pdf.setFont("helvetica", "normal"); pdf.setTextColor(160, 160, 160);
        pdf.text("Vivant Multipropriedade  ·  Documento Confidencial", MX, PH - 7);
        pdf.text(`Página ${p} de ${total}`, PW - MX, PH - 7, { align: "right" });
      }

      const slug = titulo.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").slice(0, 40);
      pdf.save(`Proposta_${slug}.pdf`);
    } finally {
      setIsExporting(false);
    }
  };
  const [imovelId, setImovelId] = useState<string>("");
  const [custoAquisicaoTotal, setCustoAquisicaoTotal] = useState(0);
  const [markup, setMarkup] = useState(0);
  const [numSemanas, setNumSemanas] = useState(0);

  const [pctEntrada, setPctEntrada]   = useState(DEFAULTS.pctEntrada);
  const [pctParcelas, setPctParcelas] = useState(DEFAULTS.pctParcelas);
  const [nParcelas, setNParcelas]     = useState(DEFAULTS.nParcelas);
  const [tipoReforco, setTipoReforco] = useState<TipoReforco>(DEFAULTS.tipoReforco);
  const [nReforcos, setNReforcos]     = useState(DEFAULTS.nReforcos);

  const [taxaVivantMensal, setTaxaVivantMensal] = useState(DEFAULTS.taxaVivantMensal);
  const [ipcaAnual, setIpcaAnual]               = useState(DEFAULTS.ipcaAnual);

  const [temAntecipacao, setTemAntecipacao]             = useState(DEFAULTS.temAntecipacao);
  const [mesAntecipacao, setMesAntecipacao]             = useState(DEFAULTS.mesAntecipacao);
  const [taxaAntecipacaoAnual, setTaxaAntecipacaoAnual] = useState(DEFAULTS.taxaAntecipacaoAnual);

  const [pctSetup, setPctSetup]         = useState(DEFAULTS.pctSetup);
  const [pctImpostos, setPctImpostos]   = useState(DEFAULTS.pctImpostos);
  const [pctComissoes, setPctComissoes] = useState(DEFAULTS.pctComissoes);
  const [pctPlataforma, setPctPlataforma] = useState(DEFAULTS.pctPlataforma);

  const pctReforcos = Math.max(0, 100 - pctEntrada - pctParcelas);

  function handleSelectImovel(id: string) {
    setImovelId(id);
    if (id === "__none__") { setCustoAquisicaoTotal(0); setMarkup(0); setNumSemanas(0); return; }
    const c = cadastros.find((x) => x.id === id);
    if (!c) return;
    const custo = c.valorAcordado != null ? Number(c.valorAcordado) : 0;
    setCustoAquisicaoTotal(custo);
    if (c.vgvEstimado != null && custo > 0)
      setMarkup(Math.round((Number(c.vgvEstimado) / custo - 1) * 10000) / 100);
    else setMarkup(0);
  }

  const resultado = useMemo(() => {
    if (custoAquisicaoTotal <= 0 || numSemanas <= 0) return null;
    const inputs: SimuladorInputs = {
      custoAquisicaoTotal, markup, numSemanas,
      pctEntrada, pctParcelas, nParcelas, tipoReforco, nReforcos,
      taxaVivantMensal, ipcaAnual,
      temAntecipacao, mesAntecipacao, taxaAntecipacaoAnual,
      pctSetup, pctImpostos, pctComissoes, pctPlataforma,
    };
    return calcularSimulacao(inputs);
  }, [
    custoAquisicaoTotal, markup, numSemanas,
    pctEntrada, pctParcelas, nParcelas, tipoReforco, nReforcos,
    taxaVivantMensal, ipcaAnual,
    temAntecipacao, mesAntecipacao, taxaAntecipacaoAnual,
    pctSetup, pctImpostos, pctComissoes, pctPlataforma,
  ]);

  const imovelSelecionado  = cadastros.find((c) => c.id === imovelId);
  const labelReforco       = tipoReforco === "semestral" ? "Semestre" : "Ano";
  const labelReforcos      = tipoReforco === "semestral" ? "Semestrais" : "Anuais";
  const taxaReforcoLabel   = tipoReforco === "semestral" ? "a.s." : "a.a.";

  // Taxa combinada para exibição
  const taxaCombinadadAnualExib = resultado
    ? (Math.pow(1 + resultado.taxaCombinadadMensal, 12) - 1) * 100
    : (Math.pow(1 + taxaVivantMensal / 100, 12) - 1) *
      (1 + ipcaAnual / 100) * 100;

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Calculator className="w-6 h-6 text-emerald-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Simulador de Vendas de Cotas</h1>
            {imovelSelecionado && <p className="text-sm text-gray-500">{imovelSelecionado.titulo}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Toggle Empresa | Cliente — oculto no modo standalone */}
          {!forceClienteMode && (
            <div className="flex rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode("empresa")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                  viewMode === "empresa"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <Building2 className="w-4 h-4" />Empresa
              </button>
              <button
                onClick={() => setViewMode("cliente")}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-l border-gray-200 ${
                  viewMode === "cliente"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <User className="w-4 h-4" />Cliente
              </button>
            </div>
          )}
          {viewMode === "cliente" ? (
            <Button
              size="sm"
              onClick={exportClientePDF}
              disabled={isExporting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isExporting
                ? <><Loader2 className="w-4 h-4 animate-spin" />Gerando PDF…</>
                : <><FileDown className="w-4 h-4" />Exportar PDF</>}
            </Button>
          ) : (
            !forceClienteMode && (
              <Button variant="outline" size="sm" onClick={() => window.print()} className="flex items-center gap-2">
                <Printer className="w-4 h-4" />Imprimir
              </Button>
            )
          )}
        </div>
      </div>

      {/* ── Visão Cliente ──────────────────────────────────────────── */}
      {viewMode === "cliente" && resultado && (
        <div className="p-6 max-w-screen-2xl mx-auto">
          <ClienteView
            resultado={resultado}
            imovelTitulo={imovelSelecionado?.titulo ?? ""}
            nParcelas={nParcelas} nReforcos={nReforcos} tipoReforco={tipoReforco}
            pctEntrada={pctEntrada} setPctEntrada={setPctEntrada}
            pctParcelas={pctParcelas} setPctParcelas={setPctParcelas}
            pctReforcos={pctReforcos}
            numSemanas={numSemanas} setNumSemanas={setNumSemanas}
            custoAquisicaoTotal={custoAquisicaoTotal} setCustoAquisicaoTotal={setCustoAquisicaoTotal}
            markup={markup}
            setNParcelas={setNParcelas}
            tipoReforcoSetter={setTipoReforco}
            setNReforcos={setNReforcos}
            taxaVivantMensal={taxaVivantMensal} setTaxaVivantMensal={setTaxaVivantMensal}
            ipcaAnual={ipcaAnual} setIpcaAnual={setIpcaAnual}
            cadastros={cadastros} imovelId={imovelId} onSelectImovel={handleSelectImovel}
            isExporting={isExporting}
          />
        </div>
      )}
      {viewMode === "cliente" && !resultado && (
        <div className="p-6 max-w-screen-2xl mx-auto">
          <div className="flex gap-6">
            <aside className="w-72 shrink-0 space-y-4">
              <Section title="Imóvel">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">Empreendimento</Label>
                  <Select value={imovelId || "__none__"} onValueChange={handleSelectImovel}>
                    <SelectTrigger className="text-sm"><SelectValue placeholder="Selecione…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">— Nenhum —</SelectItem>
                      {cadastros.map((c) => <SelectItem key={c.id} value={c.id}>{c.titulo}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <NumberInput label="Semanas / Cota" value={numSemanas} onChange={setNumSemanas} min={1} />
              </Section>
            </aside>
            <div className="flex-1 flex items-center justify-center h-64 text-gray-400 gap-3">
              <Calculator className="w-12 h-12 opacity-30" />
              <p className="text-sm">Preencha os dados para gerar a proposta.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Visão Empresa ──────────────────────────────────────────── */}
      <div className={viewMode === "empresa" ? "" : "hidden"}>
      <div className="flex gap-6 p-6 max-w-screen-2xl mx-auto">
        {/* ── Painel de Inputs ─────────────────────────────────────── */}
        <aside className="w-80 shrink-0 space-y-4 print:hidden">

          {/* Imóvel */}
          <Section title="Imóvel">
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Cadastro</Label>
              <Select value={imovelId || "__none__"} onValueChange={handleSelectImovel}>
                <SelectTrigger className="text-sm"><SelectValue placeholder="Selecione…" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">— Nenhum —</SelectItem>
                  {cadastros.map((c) => <SelectItem key={c.id} value={c.id}>{c.titulo}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <MoneyInput label="Custo de Aquisição Total" value={custoAquisicaoTotal} onChange={setCustoAquisicaoTotal} />
            <PctInput label="Markup % (custo → VGV)" value={markup} onChange={setMarkup} />
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 space-y-1.5 text-xs">
              {[
                ["VGV Total", brl(custoAquisicaoTotal * (1 + markup / 100))],
                ["Valor por semana", brl((custoAquisicaoTotal * (1 + markup / 100)) / 52)],
                ["Nº de cotas (52 ÷ sem.)", numSemanas > 0 ? numBR(52 / numSemanas, 2) : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-500">{k}:</span>
                  <span className="font-semibold text-emerald-800">{v}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 items-end">
              <NumberInput label="Nº de Semanas / Cota" value={numSemanas} onChange={setNumSemanas} min={1} />
              <div className="space-y-1">
                <Label className="text-xs text-gray-600">Valor da Cota</Label>
                <Input
                  value={numSemanas > 0 && custoAquisicaoTotal > 0
                    ? brl(numSemanas * ((custoAquisicaoTotal * (1 + markup / 100)) / 52)) : "—"}
                  readOnly className="bg-emerald-50 text-emerald-800 font-semibold cursor-default text-sm"
                />
              </div>
            </div>
          </Section>

          {/* Estrutura de Venda */}
          <Section title="Estrutura de Venda" badge="por cota">
            <div className="grid grid-cols-2 gap-3">
              <PctInput label="% Entrada (cash)" value={pctEntrada} onChange={setPctEntrada} />
              <PctInput label="% Parcelas Mensais" value={pctParcelas} onChange={setPctParcelas} />
            </div>
            <PctInput label="% Reforços (automático)" value={pctReforcos} readOnly />
            <NumberInput label="Qtd. Parcelas Mensais" value={nParcelas} onChange={setNParcelas} min={1} />
            <div className="space-y-1">
              <Label className="text-xs text-gray-600">Tipo de Reforço</Label>
              <Select value={tipoReforco} onValueChange={(v) => setTipoReforco(v as TipoReforco)}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="anual">Anuais (1× por ano)</SelectItem>
                  <SelectItem value="semestral">Semestrais (2× por ano)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <NumberInput label={`Qtd. Reforços ${labelReforcos}`} value={nReforcos} onChange={setNReforcos} min={1} />
          </Section>

          {/* Taxas de Juros */}
          <Section title="Taxas de Juros">
            <PctInput label="Taxa Vivant (% a.m.)" value={taxaVivantMensal} onChange={setTaxaVivantMensal} />
            <PctInput label="IPCA (% a.a.)" value={ipcaAnual} onChange={setIpcaAnual} suffix="% a.a." />
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-1 text-xs">
              <p className="font-semibold text-blue-700 mb-1">Taxa combinada (Vivant + IPCA)</p>
              {[
                ["Mensal efetiva (parcelas)", resultado ? pct(resultado.taxaCombinadadMensal * 100) : "—"],
                [`Por período (reforços ${taxaReforcoLabel})`, resultado ? pct(resultado.taxaReforcoEfetiva * 100) : "—"],
                ["Anual efetiva", pct(taxaCombinadadAnualExib)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-500">{k}:</span>
                  <span className="font-semibold text-blue-800">{v}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Antecipação — com toggle */}
          <Section
            title="Antecipação de Recebíveis"
            right={
              <div
                className="flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="text-xs text-gray-500">{temAntecipacao ? "Sim" : "Não"}</span>
                <Switch
                  checked={temAntecipacao}
                  onCheckedChange={setTemAntecipacao}
                />
              </div>
            }
          >
            {temAntecipacao ? (
              <>
                <NumberInput label="Mês da Antecipação" value={mesAntecipacao} onChange={setMesAntecipacao} min={0} />
                <PctInput label="Taxa de Antecipação (% a.a.)" value={taxaAntecipacaoAnual} onChange={setTaxaAntecipacaoAnual} suffix="% a.a." />
                {resultado && (
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 space-y-1.5 text-xs">
                    {[
                      [`Parcelas pagas (até mês ${mesAntecipacao})`, `${resultado.porCota.parcelasRecebidas} de ${nParcelas}`],
                      ["Parcelas restantes", `${resultado.porCota.parcelasRestantes}`],
                      [`Reforços recebidos`, `${resultado.porCota.reforcosRecebidos} de ${nReforcos}`],
                      [`Reforços restantes`, `${resultado.porCota.reforcosRestantes}`],
                      ["Juros recebidos (p/ cota)", brl(resultado.porCota.totalJurosRecebidos)],
                      ["Deságio total (p/ cota)", brl(resultado.porCota.totalDesagioAntecipacao)],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-1">
                        <span className="text-gray-500">{k}:</span>
                        <span className="font-semibold text-amber-800">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-gray-400 italic py-1">
                Sem antecipação — desenvolvedor recebe todos os juros. Nenhum deságio aplicado na DRE.
              </p>
            )}
          </Section>

          {/* Custos */}
          <Section title="Custos e Despesas">
            <PctInput label="Setup Legal/Engenharia (% s/ custo)" value={pctSetup} onChange={setPctSetup} />
            <PctInput label="Impostos Lucro Presumido (% s/ RVS)" value={pctImpostos} onChange={setPctImpostos} />
            <PctInput label="Comissões/Marketing (% s/ RVS)" value={pctComissoes} onChange={setPctComissoes} />
            <PctInput label="Taxa de Plataforma (% s/ RVS)" value={pctPlataforma} onChange={setPctPlataforma} />
          </Section>
        </aside>

        {/* ── Resultados ───────────────────────────────────────────── */}
        <main className="flex-1 space-y-6 min-w-0">
          {!resultado ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
              <Calculator className="w-12 h-12 opacity-30" />
              <p className="text-sm">Selecione um imóvel e defina as semanas por cota para ver a simulação.</p>
            </div>
          ) : (
            <>
              {/* ── 4 Cards (por cota) ──────────────────────────────── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Entrada */}
                <SummaryCard
                  label="Entrada (por cota)"
                  value={brl(resultado.porCota.valorEntrada)}
                  sub={pct(pctEntrada) + " do valor da cota"}
                />

                {/* Parcela Mensal */}
                <SummaryCard
                  label="Parcela Mensal"
                  value={brl(resultado.prestacaoMensal)}
                  sub={`${nParcelas}× mensais`}
                  sub2={`Taxa: ${pct(resultado.taxaCombinadadMensal * 100)} a.m.`}
                />

                {/* Reforço */}
                <SummaryCard
                  label={`Reforço ${tipoReforco === "semestral" ? "Semestral" : "Anual"}`}
                  value={brl(resultado.reforcoValor)}
                  sub={`${nReforcos}× ${labelReforcos.toLowerCase()}`}
                  sub2={`Taxa: ${pct(resultado.taxaReforcoEfetiva * 100)} ${taxaReforcoLabel}`}
                  neutral
                />

                {/* VGV por cota (financiado) */}
                <SummaryCard
                  label="VGV por Cota (financiado)"
                  value={brl(resultado.porCota.totalRecebidoCota)}
                  sub={`Principal: ${brl(resultado.valorCotaVenda)}`}
                  sub2={`Juros: ${brl(resultado.porCota.jurosTotaisCota)}`}
                  highlight
                />
              </div>

              {/* Chips de contexto */}
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { label: `${resultado.numSemanas} sem./cota`, color: "" },
                  { label: `${numBR(resultado.numCotas, 2)} cotas`, color: "" },
                  { label: `Cota: ${brl(resultado.valorCotaVenda)}`, color: "emerald" },
                  { label: `VGV: ${brl(resultado.vgvTotal)}`, color: "" },
                  { label: `${brl(resultado.valorPorSemana)}/semana`, color: "" },
                  temAntecipacao
                    ? { label: `Antecipação: mês ${mesAntecipacao} · ${pct(taxaAntecipacaoAnual)} a.a.`, color: "amber" }
                    : { label: "Sem antecipação", color: "gray" },
                ].map(({ label, color }) => (
                  <span key={label} className={`rounded-full px-3 py-1 ${
                    color === "emerald" ? "bg-emerald-100 text-emerald-700"
                    : color === "amber" ? "bg-amber-100 text-amber-700"
                    : "bg-gray-100 text-gray-600"
                  }`}>{label}</span>
                ))}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="dre" className="space-y-4">
                <TabsList className="print:hidden">
                  <TabsTrigger value="dre">DRE Consolidada</TabsTrigger>
                  <TabsTrigger value="cota">Amortização por Cota</TabsTrigger>
                </TabsList>

                {/* ── DRE Consolidada ───────────────────────────────── */}
                <TabsContent value="dre" className="space-y-6">
                  {/* Cards DRE */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <SummaryCard
                      label="Receita Total Bruta"
                      value={brl(resultado.receitaTotalBruta)}
                      sub={`Juros rec.: ${brl(resultado.totalJurosRecebidos)}`}
                    />
                    <SummaryCard
                      label="Lucro Bruto"
                      value={brl(resultado.lucroBrutoTotal)}
                      sub={pct((resultado.lucroBrutoTotal / resultado.receitaVendaSimples) * 100) + " s/ RVS"}
                      highlight={resultado.lucroBrutoTotal > 0}
                    />
                    <SummaryCard
                      label="EBITDA"
                      value={brl(resultado.ebitdaTotal)}
                      sub={pct((resultado.ebitdaTotal / resultado.receitaVendaSimples) * 100) + " s/ RVS"}
                      highlight={resultado.ebitdaTotal > 0}
                    />
                    <SummaryCard
                      label="Lucro Líquido"
                      value={brl(resultado.lucroLiquidoTotal)}
                      sub={`Margem: ${pct(resultado.margemLiquida)}`}
                      highlight={resultado.lucroLiquidoTotal > 0}
                    />
                  </div>

                  {/* Tabela DRE */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                      <h2 className="text-sm font-semibold text-gray-700">
                        DRE Consolidada · {numBR(resultado.numCotas, 2)} cotas · {resultado.numSemanas} sem./cota
                      </h2>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">Lucro Presumido</Badge>
                        {!temAntecipacao && <Badge className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100">Sem antecipação</Badge>}
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Item</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Valor</th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 w-20">% RVS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* RECEITA */}
                          <DRESection title="Receita" />
                          <DRELine label="(+) Receita de Venda Simples (principal)" value={resultado.receitaVendaSimples} bold pctOf={resultado.receitaVendaSimples} />
                          <DRELine label={`(+) Juros recebidos${temAntecipacao ? ` até mês ${mesAntecipacao}` : " (integral — sem antecipação)"}`}
                            value={resultado.totalJurosRecebidos} indent pctOf={resultado.receitaVendaSimples} />
                          <DREInfo
                            label={`Parcelas (${resultado.porCota.parcelasRecebidas}×) + Reforços (${resultado.porCota.reforcosRecebidos}×)`}
                            value={brl(resultado.totalJurosRecebidos / resultado.numCotas) + " /cota"}
                          />
                          <DRELine label="= Receita Total Bruta" value={resultado.receitaTotalBruta} bold separator highlight pctOf={resultado.receitaVendaSimples} />

                          {/* CUSTOS */}
                          <DRESection title="Custos de Estrutura" />
                          <DRELine label="(-) Custo de Aquisição" value={-resultado.custoAquisicaoTotal} indent negative pctOf={resultado.receitaVendaSimples} />
                          <DRELine label={`(-) Setup Legal / Engenharia (${pctSetup}% s/ custo)`} value={-resultado.custoSetupTotal} indent negative pctOf={resultado.receitaVendaSimples} />
                          <DRELine label="= Lucro Bruto" value={resultado.lucroBrutoTotal} bold separator highlight={resultado.lucroBrutoTotal > 0} negative={resultado.lucroBrutoTotal <= 0} pctOf={resultado.receitaVendaSimples} />

                          {/* DESPESAS OPERACIONAIS */}
                          <DRESection title="Despesas Operacionais" note="base = Rec. Venda Simples" />
                          <DRELine label={`(-) Impostos — Lucro Presumido (${pctImpostos}%)`} value={-resultado.impostosTotal} indent negative pctOf={resultado.receitaVendaSimples} />
                          <DRELine label={`(-) Comissões / Marketing (${pctComissoes}%)`} value={-resultado.comissoesTotal} indent negative pctOf={resultado.receitaVendaSimples} />
                          <DRELine label={`(-) Taxa de Plataforma (${pctPlataforma}%)`} value={-resultado.taxaPlataformaTotal} indent negative pctOf={resultado.receitaVendaSimples} />
                          <DRELine label="= EBITDA" value={resultado.ebitdaTotal} bold separator highlight={resultado.ebitdaTotal > 0} negative={resultado.ebitdaTotal <= 0} pctOf={resultado.receitaVendaSimples} />

                          {/* ANTECIPAÇÃO (condicional) */}
                          {temAntecipacao ? (
                            <>
                              <DRESection title="Resultado Financeiro — Antecipação" note={`Mês ${mesAntecipacao} · ${pct(taxaAntecipacaoAnual)} a.a.`} />
                              <DRELine label="(-) Deságio s/ Parcelas Restantes" value={-resultado.desagioParcelasTotal} indent dimmed pctOf={resultado.receitaVendaSimples} />
                              <DREInfo
                                label={`${resultado.porCota.parcelasRestantes} parcelas · face ${brl(resultado.porCota.faceParcelasRestantes)} → VPL ${brl(resultado.porCota.pvParcelasRestantes)}`}
                                value={brl(-resultado.desagioParcelasTotal / resultado.numCotas) + " /cota"}
                              />
                              <DRELine label="(-) Deságio s/ Reforços Restantes" value={-resultado.desagioReforcosTotal} indent dimmed pctOf={resultado.receitaVendaSimples} />
                              <DREInfo
                                label={`${resultado.porCota.reforcosRestantes} reforços · face ${brl(resultado.porCota.faceReforcosRestantes)} → VPL ${brl(resultado.porCota.pvReforcosRestantes)}`}
                                value={brl(-resultado.desagioReforcosTotal / resultado.numCotas) + " /cota"}
                              />
                            </>
                          ) : (
                            <>
                              <DRESection title="Resultado Financeiro" note="sem antecipação" />
                              <DREInfo label="Todos os juros incorporados à receita — deságio = zero" value="R$ 0,00" />
                            </>
                          )}
                          <DRELine label="= Lucro Líquido" value={resultado.lucroLiquidoTotal} bold separator highlight={resultado.lucroLiquidoTotal > 0} negative={resultado.lucroLiquidoTotal <= 0} pctOf={resultado.receitaVendaSimples} />
                        </tbody>
                        <tfoot className="border-t-2 border-gray-400">
                          <tr className="bg-gray-50">
                            <td className="px-4 py-3 text-sm font-bold text-gray-700">Margem Líquida (s/ RVS)</td>
                            <td className="px-4 py-3 text-right text-sm font-bold tabular-nums">
                              <span className={resultado.margemLiquida > 0 ? "text-emerald-700" : "text-red-600"}>
                                {pct(resultado.margemLiquida)}
                              </span>
                            </td>
                            <td />
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Legenda antecipação */}
                  {temAntecipacao && (
                    <div className="text-xs text-gray-500 bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 space-y-1">
                      <p className="font-semibold text-amber-700">Como funciona o Deságio de Antecipação</p>
                      <p>No mês <strong>{mesAntecipacao}</strong>, os recebíveis restantes são vendidos a um financiador com deságio calculado à taxa de <strong>{pct(taxaAntecipacaoAnual)} a.a.</strong> Os juros já recebidos antes do mês {mesAntecipacao} ficam com o incorporador.</p>
                    </div>
                  )}
                </TabsContent>

                {/* ── Amortização por Cota ─────────────────────────── */}
                <TabsContent value="cota" className="space-y-6">
                  {/* Estrutura de pagamento */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                      <h2 className="text-sm font-semibold text-gray-700">
                        Estrutura de Pagamento — Por Cota ({resultado.numSemanas} {resultado.numSemanas === 1 ? "semana" : "semanas"})
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100 divide-y sm:divide-y-0">
                      {[
                        { label: "Entrada", value: brl(resultado.porCota.valorEntrada), sub: pct(pctEntrada) },
                        { label: `${nParcelas}× Parcelas`, value: brl(resultado.porCota.pvParcelas), sub: `PMT: ${brl(resultado.prestacaoMensal)}` },
                        { label: `${nReforcos}× Reforços`, value: brl(resultado.porCota.pvReforcos), sub: `PMT: ${brl(resultado.reforcoValor)}` },
                        { label: "Total Recebido", value: brl(resultado.porCota.totalRecebidoCota), sub: `Juros: ${brl(resultado.porCota.jurosTotaisCota)}` },
                      ].map((item) => (
                        <div key={item.label} className="px-4 py-3">
                          <p className="text-xs text-gray-500">{item.label}</p>
                          <p className="text-base font-bold text-gray-900">{item.value}</p>
                          <p className="text-xs text-gray-400">{item.sub}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tabela parcelas */}
                  {resultado.porCota.tabelaParcelas.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-700">Parcelas Mensais ({nParcelas} meses)</h2>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>Taxa combinada: {pct(resultado.taxaCombinadadMensal * 100)} a.m.</span>
                          {temAntecipacao && (
                            <Badge variant="secondary" className="text-xs">Ant. mês {mesAntecipacao} · {resultado.porCota.parcelasRestantes} rest.</Badge>
                          )}
                        </div>
                      </div>
                      <div className="overflow-x-auto max-h-80 overflow-y-auto">
                        <table className="w-full text-sm">
                          <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
                            <tr>
                              {["Mês","Prestação","Juros","Amortização","Saldo Devedor"].map((h, i) => (
                                <th key={h} className={`px-4 py-2 text-xs font-medium text-gray-500 ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {resultado.porCota.tabelaParcelas.map((row) => {
                              const isAnt   = temAntecipacao && row.periodo === mesAntecipacao;
                              const isAfter = temAntecipacao && row.periodo > mesAntecipacao;
                              return (
                                <tr key={row.periodo} className={isAnt ? "bg-amber-50" : isAfter ? "bg-gray-50 opacity-60" : "hover:bg-gray-50"}>
                                  <td className="px-4 py-1.5 tabular-nums text-gray-700">
                                    {row.periodo}{isAnt && <span className="ml-1 text-xs text-amber-600 font-medium">← ant.</span>}
                                  </td>
                                  <td className="px-4 py-1.5 text-right tabular-nums text-gray-800">{brl(row.prestacao)}</td>
                                  <td className="px-4 py-1.5 text-right tabular-nums text-amber-600">{brl(row.juros)}</td>
                                  <td className="px-4 py-1.5 text-right tabular-nums text-blue-600">{brl(row.amortizacao)}</td>
                                  <td className="px-4 py-1.5 text-right tabular-nums text-gray-700">{brl(row.saldoDevedor)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot className="bg-gray-50 border-t border-gray-200">
                            <tr>
                              <td className="px-4 py-2 text-xs font-semibold text-gray-600">Total</td>
                              <td className="px-4 py-2 text-right text-xs font-semibold tabular-nums">{brl(resultado.porCota.totalParcelas)}</td>
                              <td className="px-4 py-2 text-right text-xs font-semibold tabular-nums text-amber-600">{brl(resultado.porCota.tabelaParcelas.reduce((s,r)=>s+r.juros,0))}</td>
                              <td className="px-4 py-2 text-right text-xs font-semibold tabular-nums text-blue-600">{brl(resultado.porCota.pvParcelas)}</td>
                              <td />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Tabela reforços */}
                  {resultado.porCota.tabelaReforcos.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="px-5 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-700">Reforços {labelReforcos} ({nReforcos} {labelReforco.toLowerCase()}s)</h2>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>Taxa: {pct(resultado.taxaReforcoEfetiva * 100)} {taxaReforcoLabel}</span>
                          {temAntecipacao && (
                            <Badge variant="secondary" className="text-xs">{resultado.porCota.reforcosRestantes} rest. após mês {mesAntecipacao}</Badge>
                          )}
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              {[labelReforco, "Mês", "Reforço", "Juros", "Amortização", "Saldo Devedor"].map((h, i) => (
                                <th key={h} className={`px-4 py-2 text-xs font-medium ${i < 2 ? "text-left text-gray-500" : "text-right text-gray-500"}`}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {resultado.porCota.tabelaReforcos.map((row) => {
                              const mesReforco = row.periodo * resultado.porCota.periodoReforcoMeses;
                              const isAfter = temAntecipacao && mesReforco > mesAntecipacao;
                              return (
                                <tr key={row.periodo} className={isAfter ? "bg-gray-50 opacity-60" : "hover:bg-gray-50"}>
                                  <td className="px-4 py-2 tabular-nums text-gray-700">{row.periodo}</td>
                                  <td className="px-4 py-2 tabular-nums text-gray-400 text-xs">{mesReforco}</td>
                                  <td className="px-4 py-2 text-right tabular-nums text-gray-800">{brl(row.prestacao)}</td>
                                  <td className="px-4 py-2 text-right tabular-nums text-amber-600">{brl(row.juros)}</td>
                                  <td className="px-4 py-2 text-right tabular-nums text-blue-600">{brl(row.amortizacao)}</td>
                                  <td className="px-4 py-2 text-right tabular-nums text-gray-700">{brl(row.saldoDevedor)}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                          <tfoot className="bg-gray-50 border-t border-gray-200">
                            <tr>
                              <td colSpan={2} className="px-4 py-2 text-xs font-semibold text-gray-600">Total</td>
                              <td className="px-4 py-2 text-right text-xs font-semibold tabular-nums">{brl(resultado.porCota.totalReforcos)}</td>
                              <td className="px-4 py-2 text-right text-xs font-semibold tabular-nums text-amber-600">{brl(resultado.porCota.tabelaReforcos.reduce((s,r)=>s+r.juros,0))}</td>
                              <td className="px-4 py-2 text-right text-xs font-semibold tabular-nums text-blue-600">{brl(resultado.porCota.pvReforcos)}</td>
                              <td />
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>
      </div> {/* fim visão empresa */}

      <style>{`
        @page {
          size: A4 portrait;
          margin: 14mm 12mm;
        }
        @media print {
          /* Cores exatas */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

          /* Esconder tudo exceto a proposta do cliente */
          body > * { visibility: hidden; }
          #cliente-proposta, #cliente-proposta * { visibility: visible; }
          #cliente-proposta {
            position: fixed; top: 0; left: 0;
            width: 100%; padding: 0;
          }

          /* Utilitários Tailwind */
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:flex  { display: flex  !important; }

          /* Expandir tabelas de cronograma */
          .schedule-body {
            display: block !important;
            max-height: none !important;
            overflow: visible !important;
          }

          /* Evitar quebra de página dentro de cards */
          .schedule-card { page-break-inside: avoid; }
          .grid > * { page-break-inside: avoid; }

          /* Remover sombras e bordas desnecessárias para impressão */
          .shadow-lg, .shadow-sm { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
