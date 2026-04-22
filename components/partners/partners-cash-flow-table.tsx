"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PartnersAnalysis } from "@/lib/math/partners-calculator";
import { Table2, CalendarDays, X, ChevronRight } from "lucide-react";

interface PartnersCashFlowTableProps {
  analysis: PartnersAnalysis;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// ─── Modal de fluxo mensal ────────────────────────────────────────────────────
function FluxoMensalModal({
  analysis,
  onClose,
}: {
  analysis: PartnersAnalysis;
  onClose: () => void;
}) {
  // Fechar com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Filtrar apenas meses com algum movimento
  const meses = analysis.fluxoMensal.filter((m) => m.fluxoBruto > 0 || m.fluxoCliente > 0);

  const totalEntradas  = meses.reduce((s, m) => s + m.entradaMes  * 0.7, 0);
  const totalParcelas  = meses.reduce((s, m) => s + m.parcelasMes * 0.7, 0);
  const totalReforcos  = meses.reduce((s, m) => s + m.reforcosMes * 0.7, 0);
  const totalGeral     = meses.reduce((s, m) => s + m.fluxoCliente, 0);

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Painel */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col"
           style={{ maxHeight: "88vh" }}>

        {/* Header fixo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-vivant-gold/20 flex-shrink-0">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-vivant-gold-muted" />
            <div>
              <h3 className="font-bold text-vivant-navy text-base">
                Fluxo de Caixa Mensal — Sua Parte (70%)
              </h3>
              <p className="text-xs text-slate-500">
                Recebimentos mês a mês · linhas douradas marcam o fechamento de cada ano
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Tabela com scroll */}
        <div className="overflow-y-auto overflow-x-auto flex-1">
          <table className="w-full text-sm min-w-[620px]">
            <thead className="sticky top-0 bg-white z-10">
              <tr className="border-b-2 border-vivant-gold/30">
                <th className="text-left py-3 px-3 text-vivant-navy font-semibold whitespace-nowrap">Mês</th>
                <th className="text-right py-3 px-3 text-vivant-navy font-semibold whitespace-nowrap">Entradas</th>
                <th className="text-right py-3 px-3 text-vivant-navy font-semibold whitespace-nowrap">Parcelas</th>
                <th className="text-right py-3 px-3 text-vivant-navy font-semibold whitespace-nowrap">Reforços</th>
                <th className="text-right py-3 px-3 text-vivant-navy font-semibold whitespace-nowrap">Total Recebido</th>
                <th className="text-right py-3 px-3 text-vivant-navy font-semibold whitespace-nowrap">Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {meses.map((m, idx) => {
                const isYearEnd = m.mes % 12 === 0;
                const ano = Math.ceil(m.mes / 12);
                const isAlt = idx % 2 === 0;
                const entradaCliente  = m.entradaMes  * 0.7;
                const parcelaCliente  = m.parcelasMes * 0.7;
                const reforcoCliente  = m.reforcosMes * 0.7;

                return (
                  <>
                    <tr
                      key={m.mes}
                      className={`border-b transition-colors ${
                        isYearEnd
                          ? "border-b-0 bg-vivant-navy/5"
                          : isAlt
                          ? "border-slate-100 bg-white hover:bg-vivant-gold/5"
                          : "border-slate-100 bg-slate-50/40 hover:bg-vivant-gold/5"
                      }`}
                    >
                      <td className={`py-2.5 px-3 whitespace-nowrap font-medium ${isYearEnd ? "text-vivant-navy font-semibold" : "text-slate-600"}`}>
                        Mês {m.mes}
                      </td>
                      <td className={`py-2.5 px-3 text-right ${isYearEnd ? "font-semibold text-vivant-gold-muted" : "text-vivant-gold-muted"}`}>
                        {entradaCliente > 0 ? formatCurrency(entradaCliente) : "—"}
                      </td>
                      <td className={`py-2.5 px-3 text-right ${isYearEnd ? "font-semibold text-vivant-navy/80" : "text-vivant-navy/70"}`}>
                        {parcelaCliente > 0 ? formatCurrency(parcelaCliente) : "—"}
                      </td>
                      <td className={`py-2.5 px-3 text-right ${isYearEnd ? "font-semibold text-[#8B6914]" : "text-[#8B6914]"}`}>
                        {reforcoCliente > 0 ? formatCurrency(reforcoCliente) : "—"}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-bold ${isYearEnd ? "text-vivant-navy" : "text-vivant-navy/80"}`}>
                        {formatCurrency(m.fluxoCliente)}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-semibold ${isYearEnd ? "text-vivant-navy" : "text-slate-500"}`}>
                        {formatCurrency(m.fluxoClienteAcumulado)}
                      </td>
                    </tr>

                    {/* Linha de fechamento de ano */}
                    {isYearEnd && (
                      <tr key={`year-${ano}`} className="bg-vivant-navy border-b-2 border-vivant-gold/40">
                        <td colSpan={6} className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <ChevronRight className="w-3.5 h-3.5 text-vivant-gold flex-shrink-0" />
                            <span className="text-xs font-bold text-white">
                              Fechamento do Ano {ano}
                            </span>
                            <span className="text-xs text-vivant-gold/80 ml-auto">
                              Acumulado: {formatCurrency(m.fluxoClienteAcumulado)}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
            <tfoot className="sticky bottom-0 bg-white">
              <tr className="border-t-2 border-vivant-gold/40 bg-vivant-gold/10">
                <td className="py-3 px-3 font-bold text-vivant-navy">TOTAL</td>
                <td className="py-3 px-3 text-right font-bold text-vivant-gold-muted">{formatCurrency(totalEntradas)}</td>
                <td className="py-3 px-3 text-right font-bold text-vivant-navy/80">{formatCurrency(totalParcelas)}</td>
                <td className="py-3 px-3 text-right font-bold text-[#8B6914]">{formatCurrency(totalReforcos)}</td>
                <td className="py-3 px-3 text-right font-bold text-vivant-navy">{formatCurrency(totalGeral)}</td>
                <td className="py-3 px-3 text-right font-bold text-vivant-navy">{formatCurrency(totalGeral)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer fixo */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-vivant-navy"></span>
              Fechamento de ano
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block w-3 h-3 rounded-sm bg-vivant-gold/30"></span>
              Reforço anual
            </span>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
            className="border-vivant-navy/30 text-vivant-navy hover:bg-vivant-navy hover:text-white"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Tabela anual principal ───────────────────────────────────────────────────
export function PartnersCashFlowTable({ analysis }: PartnersCashFlowTableProps): JSX.Element {
  const [showMensal, setShowMensal] = useState(false);

  const anos = analysis.fluxoAnual;
  const totalEntradas = anos.reduce((s, a) => s + a.entradas * 0.7, 0);
  const totalParcelas = anos.reduce((s, a) => s + a.parcelas * 0.7, 0);
  const totalReforcos = anos.reduce((s, a) => s + a.reforcos * 0.7, 0);
  const totalGeral    = anos.reduce((s, a) => s + a.totalCliente, 0);

  return (
    <>
      {showMensal && (
        <FluxoMensalModal analysis={analysis} onClose={() => setShowMensal(false)} />
      )}

      <Card className="border-2 border-vivant-navy/20 shadow-md">
        <CardHeader className="border-b border-vivant-gold/20">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="flex items-center gap-2 text-vivant-navy">
                <Table2 className="w-5 h-5 text-vivant-gold-muted" />
                Fluxo de Caixa Anual — Sua Parte (70%)
              </CardTitle>
              <p className="text-sm text-slate-500 mt-0.5">
                Recebimentos anuais por tipo de fluxo (perspectiva do cliente)
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowMensal(true)}
              className="flex-shrink-0 border-vivant-navy/30 text-vivant-navy hover:bg-vivant-navy hover:text-white text-xs gap-1.5"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              Ver mensal
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4 overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr className="border-b-2 border-vivant-gold/30">
                <th className="text-left py-3 px-3 text-vivant-navy font-semibold">Ano</th>
                <th className="text-right py-3 px-3 text-vivant-navy font-semibold whitespace-nowrap">Entradas</th>
                <th className="text-right py-3 px-3 text-vivant-navy font-semibold whitespace-nowrap">Parcelas</th>
                <th className="text-right py-3 px-3 text-vivant-navy font-semibold whitespace-nowrap">Reforços</th>
                <th className="text-right py-3 px-3 text-vivant-navy font-semibold whitespace-nowrap">Total Recebido</th>
                <th className="text-right py-3 px-3 text-vivant-navy font-semibold whitespace-nowrap">Acumulado</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                let acumulado = 0;
                return anos.map((ano, idx) => {
                  acumulado += ano.totalCliente;
                  const isAlt = idx % 2 === 0;
                  const entradaCliente = ano.entradas * 0.7;
                  const parcelaCliente = ano.parcelas * 0.7;
                  const reforcoCliente = ano.reforcos * 0.7;

                  return (
                    <tr
                      key={ano.ano}
                      className={`border-b border-slate-100 transition-colors hover:bg-vivant-gold/5 ${
                        isAlt ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="py-3 px-3 font-semibold text-vivant-navy whitespace-nowrap">
                        Ano {ano.ano}
                      </td>
                      <td className="py-3 px-3 text-right text-vivant-gold-muted font-medium">
                        {entradaCliente > 0 ? formatCurrency(entradaCliente) : "—"}
                      </td>
                      <td className="py-3 px-3 text-right text-vivant-navy/80 font-medium">
                        {parcelaCliente > 0 ? formatCurrency(parcelaCliente) : "—"}
                      </td>
                      <td className="py-3 px-3 text-right text-[#8B6914] font-medium">
                        {reforcoCliente > 0 ? formatCurrency(reforcoCliente) : "—"}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-vivant-navy">
                        {formatCurrency(ano.totalCliente)}
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-600">
                        {formatCurrency(acumulado)}
                      </td>
                    </tr>
                  );
                });
              })()}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-vivant-gold/40 bg-vivant-gold/10">
                <td className="py-4 px-3 font-bold text-vivant-navy">TOTAL</td>
                <td className="py-4 px-3 text-right font-bold text-vivant-gold-muted">{formatCurrency(totalEntradas)}</td>
                <td className="py-4 px-3 text-right font-bold text-vivant-navy/80">{formatCurrency(totalParcelas)}</td>
                <td className="py-4 px-3 text-right font-bold text-[#8B6914]">{formatCurrency(totalReforcos)}</td>
                <td className="py-4 px-3 text-right font-bold text-vivant-navy text-base">{formatCurrency(totalGeral)}</td>
                <td className="py-4 px-3 text-right font-bold text-vivant-navy text-base">{formatCurrency(totalGeral)}</td>
              </tr>
            </tfoot>
          </table>

          <div className="mt-4 grid sm:grid-cols-3 gap-3 text-xs text-slate-600">
            <div className="bg-vivant-gold/10 border border-vivant-gold/30 rounded-lg p-2.5">
              <span className="font-semibold text-vivant-navy">Entradas:</span>{" "}
              Recebidas no ato da venda de cada cota (20% da cota − comissão de 5%), 70% seu
            </div>
            <div className="bg-vivant-navy/5 border border-vivant-navy/20 rounded-lg p-2.5">
              <span className="font-semibold text-vivant-navy">Parcelas:</span>{" "}
              60 parcelas mensais com 1% a.m. + IPCA sobre 40% da cota, 70% seu
            </div>
            <div className="bg-[#8B6914]/10 border border-[#8B6914]/20 rounded-lg p-2.5">
              <span className="font-semibold text-vivant-navy">Reforços:</span>{" "}
              5 balões anuais com 1% a.m. + IPCA sobre 40% da cota, 70% seu
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
