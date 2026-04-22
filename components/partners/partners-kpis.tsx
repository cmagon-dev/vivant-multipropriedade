"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { PartnersAnalysis } from "@/lib/math/partners-calculator";
import {
  Home,
  TrendingUp,
  DollarSign,
  Calendar,
  Wallet,
  BarChart3,
  Clock,
  Info,
  CircleDollarSign,
  TrendingDown,
  Zap,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Users,
  Receipt,
} from "lucide-react";

interface PartnersKPIsProps {
  analysis: PartnersAnalysis | null;
}

const LABEL_CENARIO: Record<string, string> = {
  otimista: "Otimista (2 cotas/mês)",
  realista: "Realista (1 cota/mês)",
  pessimista: "Conservador (1 cota a cada 1,5 meses)",
};

export function PartnersKPIs({ analysis }: PartnersKPIsProps): JSX.Element {
  if (!analysis) {
    return (
      <div className="space-y-4">
        {/* Título do painel */}
        <div className="flex items-center gap-3 pb-1">
          <div className="w-10 h-10 bg-vivant-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-vivant-gold-muted" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-vivant-navy">Guia de Preenchimento</h2>
            <p className="text-xs text-slate-500">Entenda cada campo antes de simular</p>
          </div>
        </div>

        {/* PASSO 1 — Valor do Imóvel */}
        <Card className="border-2 border-vivant-gold/30 overflow-hidden">
          <div className="bg-vivant-gold/10 px-4 py-3 flex items-center gap-3 border-b border-vivant-gold/20">
            <div className="w-7 h-7 bg-vivant-navy rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleDollarSign className="w-4 h-4 text-vivant-gold-muted" />
              <span className="font-semibold text-vivant-navy text-sm">Valor do Imóvel</span>
            </div>
          </div>
          <CardContent className="pt-4 pb-4 space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              Informe o <strong>valor de venda à vista</strong> do seu imóvel no mercado atual —
              ou seja, quanto você conseguiria vender hoje se colocasse o imóvel à venda de forma convencional.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-vivant-navy uppercase tracking-wide">Como estimar corretamente:</p>
              <ul className="space-y-1.5">
                {[
                  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-vivant-gold-muted flex-shrink-0 mt-0.5" />, text: "Consulte avaliações recentes de imóveis similares na mesma região (sites como ZAP, Viva Real, OLX)" },
                  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-vivant-gold-muted flex-shrink-0 mt-0.5" />, text: "Considere o valor do IPTU — geralmente a avaliação fiscal é 30–50% abaixo do valor de mercado" },
                  { icon: <CheckCircle2 className="w-3.5 h-3.5 text-vivant-gold-muted flex-shrink-0 mt-0.5" />, text: "Prefira o valor conservador: superestimar o imóvel distorce toda a simulação" },
                  { icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />, text: "O valor informado é estimativo — a Vivant realiza avaliação técnica oficial antes da operação" },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    {item.icon}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* PASSO 2 — IPCA */}
        <Card className="border-2 border-vivant-navy/20 overflow-hidden">
          <div className="bg-vivant-navy/5 px-4 py-3 flex items-center gap-3 border-b border-vivant-navy/10">
            <div className="w-7 h-7 bg-vivant-navy rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-vivant-navy/70" />
              <span className="font-semibold text-vivant-navy text-sm">Projeção de IPCA</span>
            </div>
          </div>
          <CardContent className="pt-4 pb-4 space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              O IPCA (Índice de Preços ao Consumidor Amplo) é o índice oficial de inflação do Brasil.
              Ele é aplicado mensalmente ao saldo das parcelas e reforços, corrigindo o poder de compra
              dos seus recebimentos ao longo dos 5 anos.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { faixa: "3% – 4,5%", rotulo: "Conservador", desc: "Meta oficial do Banco Central. Use se acredita que a inflação ficará controlada.", cor: "bg-slate-50 border-slate-200 text-slate-700" },
                { faixa: "5% – 6,5%", rotulo: "Moderado", desc: "Média histórica brasileira dos últimos 10 anos. Cenário mais provável no médio prazo.", cor: "bg-vivant-gold/10 border-vivant-gold/30 text-vivant-navy" },
                { faixa: "7% – 10%", rotulo: "Pessimista", desc: "Cenário de pressão inflacionária. Use para testar o pior caso e proteger sua projeção.", cor: "bg-amber-50 border-amber-200 text-amber-900" },
              ].map((c) => (
                <div key={c.rotulo} className={`rounded-lg border p-2.5 ${c.cor}`}>
                  <p className="text-xs font-bold mb-0.5">{c.rotulo}</p>
                  <p className="text-xs font-semibold mb-1">{c.faixa} a.a.</p>
                  <p className="text-xs leading-relaxed opacity-80">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                <strong>Onde consultar:</strong> Acesse o site do{" "}
                <strong>Banco Central (bcb.gov.br → Focus/Expectativas)</strong> para ver a projeção
                de mercado atualizada para o IPCA dos próximos anos. Utilize o valor da mediana das
                projeções dos próximos 5 anos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* PASSO 3 — Cenário de Vendas */}
        <Card className="border-2 border-vivant-gold/30 overflow-hidden">
          <div className="bg-vivant-gold/10 px-4 py-3 flex items-center gap-3 border-b border-vivant-gold/20">
            <div className="w-7 h-7 bg-vivant-navy rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">3</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-vivant-gold-muted" />
              <span className="font-semibold text-vivant-navy text-sm">Cenário de Velocidade de Vendas</span>
            </div>
          </div>
          <CardContent className="pt-4 pb-4 space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              Define o ritmo em que as 6 cotas do seu imóvel serão vendidas. Isso impacta
              diretamente o início dos recebimentos — quanto mais rápido as cotas são vendidas,
              antes você começa a receber as entradas e parcelas.
            </p>

            <div className="space-y-2.5">
              {[
                {
                  icone: "⚡",
                  rotulo: "Otimista",
                  ritmo: "2 cotas/mês → 6 cotas em 3 meses",
                  quando: "Imóveis em destinos de alta demanda (Praia, Serra, Litoral consolidado) com apelo turístico comprovado e boa infraestrutura.",
                  cor: "border-vivant-gold/40 bg-vivant-gold/5",
                },
                {
                  icone: "📈",
                  rotulo: "Realista",
                  ritmo: "1 cota/mês → 6 cotas em 6 meses",
                  quando: "Cenário mais equilibrado. Recomendado para a maioria dos imóveis bem localizados. É o ponto de partida ideal para sua simulação.",
                  cor: "border-vivant-navy/20 bg-vivant-navy/5",
                },
                {
                  icone: "🔒",
                  rotulo: "Conservador",
                  ritmo: "1 cota a cada 1,5 meses → 6 cotas em 9 meses",
                  quando: "Imóveis em regiões com menor liquidez, fora de temporada, ou quando o mercado local está mais aquecido. Use para projetar o pior cenário de vendas.",
                  cor: "border-slate-200 bg-slate-50",
                },
              ].map((c) => (
                <div key={c.rotulo} className={`rounded-xl border-2 p-3 ${c.cor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{c.icone}</span>
                    <span className="font-semibold text-vivant-navy text-sm">{c.rotulo}</span>
                    <span className="text-xs text-vivant-gold-muted font-medium ml-1">— {c.ritmo}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pl-6">{c.quando}</p>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-2 bg-vivant-gold/10 border border-vivant-gold/30 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 text-vivant-gold-muted flex-shrink-0 mt-0.5" />
              <p className="text-xs text-vivant-navy">
                <strong>Dica:</strong> Simule nos 3 cenários para entender o intervalo de recebimentos
                e tomar a decisão mais informada. Os cenários <em>não</em> alteram o valor total a receber —
                apenas o prazo para início e distribuição dos fluxos ao longo do tempo.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Como funciona a venda das cotas */}
        <Card className="border-2 border-vivant-navy/20 overflow-hidden">
          <div className="bg-vivant-navy/5 px-4 py-3 flex items-center gap-3 border-b border-vivant-navy/10">
            <Building2 className="w-4 h-4 text-vivant-navy" />
            <span className="font-semibold text-vivant-navy text-sm">Como Funciona a Venda das Cotas</span>
          </div>
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="space-y-2.5">
              {[
                {
                  icone: <Users className="w-4 h-4 text-vivant-gold-muted flex-shrink-0 mt-0.5" />,
                  titulo: "Estruturação da SPE",
                  desc: "A Vivant cria uma Sociedade de Propósito Específico (SPE) na qual você é sócio. O imóvel é incorporado à SPE e dividido em 6 cotas de multipropriedade.",
                },
                {
                  icone: <DollarSign className="w-4 h-4 text-vivant-gold-muted flex-shrink-0 mt-0.5" />,
                  titulo: "Preço das Cotas com Markup",
                  desc: "A Vivant aplica um markup de 50% sobre o valor do imóvel para definir o VGV (Valor Geral de Vendas). Esse acréscimo remunera a estruturação, a operação e os custos de venda.",
                },
                {
                  icone: <Receipt className="w-4 h-4 text-vivant-gold-muted flex-shrink-0 mt-0.5" />,
                  titulo: "Forma de Pagamento por Cota",
                  desc: "Cada cota é paga em 3 partes: 20% de entrada no ato da venda, 40% em 60 parcelas mensais (corrigidas por 1% a.m. + IPCA) e 40% em 5 reforços anuais.",
                },
                {
                  icone: <TrendingUp className="w-4 h-4 text-vivant-gold-muted flex-shrink-0 mt-0.5" />,
                  titulo: "Split dos Recebimentos",
                  desc: "De tudo que entra — entradas, parcelas e reforços — 70% é seu e 30% da Vivant. Os primeiros recebimentos cobrem o custo de implantação (3% do imóvel), adiantado pela Vivant.",
                },
              ].map((item) => (
                <div key={item.titulo} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-vivant-gold/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.icone}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-vivant-navy mb-0.5">{item.titulo}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    );
  }

  const kpis = [
    {
      label: "VGV da Operação",
      value: analysis.vgv,
      sub: `Valor por cota: ${analysis.valorPorCota}`,
      icon: <Home className="w-5 h-5" />,
      color: "from-vivant-navy to-[#2A4F6B]",
      textColor: "text-white",
    },
    {
      label: "Total que Você Recebe",
      value: analysis.totalReceberCliente,
      sub: "70% de todos os recebimentos",
      icon: <Wallet className="w-5 h-5" />,
      color: "from-vivant-gold-muted to-[#B8924A]",
      textColor: "text-white",
    },
    {
      label: "Entradas (70% seu)",
      value: analysis.totalEntradaCliente,
      sub: "20% por cota na venda",
      icon: <DollarSign className="w-5 h-5" />,
      color: "from-[#C5A059] to-[#A8893F]",
      textColor: "text-white",
    },
    {
      label: "Parcelas Mensais (70% seu)",
      value: analysis.totalParcelasCliente,
      sub: `Média: ${analysis.parcelaMensalMedia}/mês`,
      icon: <Calendar className="w-5 h-5" />,
      color: "from-vivant-navy/90 to-[#1A2F4B]",
      textColor: "text-white",
    },
    {
      label: "Reforços Anuais (70% seu)",
      value: analysis.totalReforcosCliente,
      sub: `Média: ${analysis.reforcoAnualMedio}/ano`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-[#8B6914] to-[#6B4F10]",
      textColor: "text-white",
    },
    {
      label: "Custo de Implantação",
      value: analysis.custoImplantacao,
      sub: `Reembolsado em ${analysis.mesesParaQuitarCusto} ${analysis.mesesParaQuitarCusto === 1 ? "mês" : "meses"}`,
      icon: <BarChart3 className="w-5 h-5" />,
      color: "from-slate-600 to-slate-500",
      textColor: "text-white",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-vivant-navy">
            Resultados da Simulação
          </h2>
          <p className="text-sm text-slate-500">
            Cenário: <span className="font-semibold text-vivant-gold-muted">{LABEL_CENARIO[analysis.cenario]}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-vivant-gold/10 border border-vivant-gold/30 px-3 py-2 rounded-lg text-sm">
          <Clock className="w-4 h-4 text-vivant-gold-muted" />
          <span className="text-vivant-navy font-medium">
            Até o mês {analysis.mesUltimoRecebimento}
          </span>
        </div>
      </div>

      {/* KPIs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className={`bg-gradient-to-br ${k.color} border-0 shadow-md`}>
            <CardContent className="pt-5 pb-5">
              <div className={`flex items-center gap-2 mb-2 ${k.textColor} opacity-80`}>
                {k.icon}
                <span className="text-xs font-medium">{k.label}</span>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold ${k.textColor} leading-tight`}>
                {k.value}
              </p>
              <p className={`text-xs mt-1 ${k.textColor} opacity-70`}>{k.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contexto do modelo */}
      <div className="bg-vivant-gold/10 border-2 border-vivant-gold/30 rounded-xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-vivant-gold-muted mt-0.5 flex-shrink-0" />
          <div className="text-sm text-vivant-navy space-y-1">
            <p className="font-semibold">Como funciona o modelo Partners:</p>
            <p>
              Você entra com o imóvel. A Vivant incorpora a multipropriedade em uma SPE, estrutura
              as cotas e realiza as vendas. Os recebimentos são divididos na proporção <strong>70% para você</strong>{" "}
              e 30% para a Vivant, ao longo de todo o período de pagamento das cotas.
            </p>
            <p className="text-xs text-vivant-navy/60">
              O custo de implantação (3%) é adiantado pela Vivant e reembolsado dos primeiros
              recebimentos antes do split.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
