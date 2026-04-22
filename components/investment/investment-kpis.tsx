"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { InvestmentAnalysis } from "@/lib/math/investment-calculator";
import {
  TrendingUp,
  DollarSign,
  PiggyBank,
  BarChart3,
  Shield,
  CheckCircle2,
  HelpCircle,
  CircleDollarSign,
  TrendingDown,
  Info,
  AlertTriangle,
  Home,
  Wallet,
  Calendar,
  Receipt,
  Clock,
} from "lucide-react";

interface InvestmentKPIsProps {
  analysis: InvestmentAnalysis | null;
}

export function InvestmentKPIs({ analysis }: InvestmentKPIsProps): JSX.Element {
  // Card verde de garantias (sempre visível)
  const GreenSecurityCard = () => (
    <div className="bg-gradient-to-r from-vivant-green to-emerald-600 text-white p-6 rounded-xl shadow-xl border-2 border-vivant-green">
      <div className="flex items-start gap-4">
        <div className="bg-white/20 p-3 rounded-lg">
          <Shield className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">
            Capital 100% Lastreado em Garantia Real
          </h3>
          <div className="space-y-1 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Garantia Real: Imóveis de Alto Padrão</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Alienação Fiduciária das Cotas</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Estrutura Preparada para Securitização (CRI)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!analysis) {
    return (
      <div className="space-y-4">
        <GreenSecurityCard />

        {/* Título do guia */}
        <div className="flex items-center gap-3 pb-1 mt-2">
          <div className="w-10 h-10 bg-vivant-green/10 rounded-full flex items-center justify-center flex-shrink-0">
            <HelpCircle className="w-5 h-5 text-vivant-green" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-vivant-navy">Guia de Preenchimento</h2>
            <p className="text-xs text-slate-500">Entenda cada campo antes de simular</p>
          </div>
        </div>

        {/* PASSO 1 — Valor do Aporte */}
        <Card className="border-2 border-vivant-green/30 overflow-hidden">
          <div className="bg-vivant-green/10 px-4 py-3 flex items-center gap-3 border-b border-vivant-green/20">
            <div className="w-7 h-7 bg-vivant-navy rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <div className="flex items-center gap-2">
              <CircleDollarSign className="w-4 h-4 text-vivant-green" />
              <span className="font-semibold text-vivant-navy text-sm">Valor do Aporte</span>
            </div>
          </div>
          <CardContent className="pt-4 pb-4 space-y-3">
            <p className="text-sm text-slate-700 leading-relaxed">
              Informe o <strong>capital disponível para investir</strong>. Esse valor será utilizado
              para a compra à vista de um imóvel de alto padrão — e é justamente a compra à vista
              que garante o desconto de aproximadamente <strong>20% sobre o valor de mercado</strong>.
            </p>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-vivant-navy uppercase tracking-wide">
                Como o aporte é utilizado:
              </p>
              <ul className="space-y-1.5">
                {[
                  {
                    icon: <CheckCircle2 className="w-3.5 h-3.5 text-vivant-green flex-shrink-0 mt-0.5" />,
                    text: "Seu aporte representa o preço à vista do imóvel (com desconto de ~20% sobre o valor de mercado)",
                  },
                  {
                    icon: <CheckCircle2 className="w-3.5 h-3.5 text-vivant-green flex-shrink-0 mt-0.5" />,
                    text: "Sobre o valor de mercado real do imóvel, a Vivant aplica 50% de markup para formar o VGV (Valor Geral de Vendas)",
                  },
                  {
                    icon: <CheckCircle2 className="w-3.5 h-3.5 text-vivant-green flex-shrink-0 mt-0.5" />,
                    text: "Você recebe 70% de todo o fluxo gerado pelas vendas ao longo do período",
                  },
                  {
                    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />,
                    text: "O imóvel específico e o desconto real são definidos pela equipe Vivant — esta simulação usa estimativas de referência",
                  },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    {item.icon}
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-vivant-green/10 border border-vivant-green/30 rounded-lg p-3">
              <p className="text-xs text-vivant-navy">
                <strong>Exemplo:</strong> Aporte de R$ 2.000.000 → compra imóvel de mercado
                R$ 2.500.000 → VGV de R$ 3.750.000 → você recebe 70% do fluxo de vendas.
              </p>
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
              dos seus recebimentos ao longo dos anos.
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  faixa: "3% – 4,5%",
                  rotulo: "Conservador",
                  desc: "Meta oficial do Banco Central. Use se acredita que a inflação ficará controlada.",
                  cor: "bg-slate-50 border-slate-200 text-slate-700",
                },
                {
                  faixa: "5% – 6,5%",
                  rotulo: "Moderado",
                  desc: "Média histórica dos últimos 10 anos. Cenário mais provável no médio prazo.",
                  cor: "bg-vivant-green/10 border-vivant-green/30 text-vivant-navy",
                },
                {
                  faixa: "7% – 10%",
                  rotulo: "Pessimista",
                  desc: "Cenário de pressão inflacionária. Use para testar o pior caso.",
                  cor: "bg-amber-50 border-amber-200 text-amber-900",
                },
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
                <strong>Banco Central (bcb.gov.br → Focus/Expectativas)</strong> para a projeção
                de mercado atualizada. Utilize a mediana das projeções dos próximos 5 anos.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Como funciona o modelo Capital */}
        <Card className="border-2 border-vivant-navy/20 overflow-hidden">
          <div className="bg-vivant-navy/5 px-4 py-3 flex items-center gap-3 border-b border-vivant-navy/10">
            <Home className="w-4 h-4 text-vivant-navy" />
            <span className="font-semibold text-vivant-navy text-sm">Como Funciona o Modelo Capital</span>
          </div>
          <CardContent className="pt-4 pb-4 space-y-3">
            <div className="space-y-2.5">
              {[
                {
                  icon: <DollarSign className="w-4 h-4 text-vivant-green flex-shrink-0 mt-0.5" />,
                  titulo: "Compra à Vista com Desconto",
                  desc: "Seu aporte é usado para comprar um imóvel de alto padrão à vista. Pagando à vista, a Vivant negocia ~20% de desconto sobre o valor de mercado.",
                },
                {
                  icon: <BarChart3 className="w-4 h-4 text-vivant-green flex-shrink-0 mt-0.5" />,
                  titulo: "Markup e Formação do VGV",
                  desc: "Sobre o valor de mercado real do imóvel, a Vivant aplica 50% de markup para formar o VGV. Esse acréscimo remunera a estruturação, operação e custos de venda.",
                },
                {
                  icon: <Receipt className="w-4 h-4 text-vivant-green flex-shrink-0 mt-0.5" />,
                  titulo: "Forma de Pagamento por Venda",
                  desc: "Cada unidade é paga em partes: 20% de entrada no ato da venda, 40% em parcelas mensais (1% a.m. + IPCA) e 40% em 5 reforços anuais.",
                },
                {
                  icon: <TrendingUp className="w-4 h-4 text-vivant-green flex-shrink-0 mt-0.5" />,
                  titulo: "Seus 70% dos Recebimentos",
                  desc: "De tudo que entra — entradas, parcelas e reforços — 70% é seu e 30% da Vivant. Os primeiros recebimentos cobrem o custo de implantação (3%), adiantado pela Vivant.",
                },
              ].map((item) => (
                <div key={item.titulo} className="flex items-start gap-3">
                  <div className="w-7 h-7 bg-vivant-green/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.icon}
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
      label: "Valor Aportado",
      value: analysis.valorInvestido,
      sub: "Capital inicial investido",
      icon: <DollarSign className="w-5 h-5" />,
      color: "from-vivant-navy to-[#2A4F6B]",
      textColor: "text-white",
    },
    {
      label: "Total a Receber (70%)",
      value: analysis.totalReceber,
      sub: "Sua participação no fluxo",
      icon: <Wallet className="w-5 h-5" />,
      color: "from-vivant-green to-emerald-600",
      textColor: "text-white",
    },
    {
      label: "Entradas (70%)",
      value: analysis.totalEntradas,
      sub: "20% por unidade na venda",
      icon: <DollarSign className="w-5 h-5" />,
      color: "from-emerald-600 to-emerald-700",
      textColor: "text-white",
    },
    {
      label: "Parcelas Mensais (70%)",
      value: analysis.totalParcelas,
      sub: `Média: ${analysis.parcelaMensalMedia}/mês`,
      icon: <Calendar className="w-5 h-5" />,
      color: "from-vivant-navy/90 to-[#1A2F4B]",
      textColor: "text-white",
    },
    {
      label: "Reforços Anuais (70%)",
      value: analysis.totalReforcos,
      sub: `Média: ${analysis.reforcoAnualMedio}/ano`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-vivant-gold-muted to-[#B8924A]",
      textColor: "text-white",
    },
    {
      label: "Lucro Projetado",
      value: analysis.lucroLiquido,
      sub: "Total recebido − aporte",
      icon: <PiggyBank className="w-5 h-5" />,
      color: "from-slate-600 to-slate-500",
      textColor: "text-white",
    },
  ];

  return (
    <div className="space-y-6">
      <GreenSecurityCard />

      {/* Header de resultados */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-vivant-navy">
            Resultados da Simulação
          </h2>
          <p className="text-sm text-slate-500">
            VGV da operação:{" "}
            <span className="font-semibold text-vivant-green">{analysis.vgv}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 bg-vivant-green/10 border border-vivant-green/30 px-3 py-2 rounded-lg text-sm">
          <Clock className="w-4 h-4 text-vivant-green" />
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

      {/* TIR + ROI — Destaque */}
      <Card className="border-2 border-vivant-green bg-gradient-to-r from-vivant-green/5 to-emerald-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-6 h-6 text-vivant-green" />
                <h3 className="text-lg font-semibold text-vivant-navy">
                  TIR — Taxa Interna de Retorno
                </h3>
              </div>
              <p className="text-sm text-slate-600">
                Rentabilidade anualizada considerando todo o fluxo de caixa (70%)
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-4xl font-bold text-vivant-green">
                {analysis.tir}
              </div>
              <p className="text-xs text-vivant-green/70 mt-1">
                ROI: <strong>{analysis.roi}</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contexto do modelo */}
      <div className="bg-vivant-green/10 border-2 border-vivant-green/30 rounded-xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-vivant-green mt-0.5 flex-shrink-0" />
          <div className="text-sm text-vivant-navy space-y-1">
            <p className="font-semibold">Como funciona o modelo Capital:</p>
            <p>
              Você aporta o capital para compra à vista de um imóvel com desconto de ~20%.
              A Vivant incorpora a multipropriedade, estrutura as vendas e divide os recebimentos
              na proporção <strong>70% para você</strong> e 30% para a Vivant.
            </p>
            <p className="text-xs text-vivant-navy/60">
              O custo de implantação (3%) é adiantado pela Vivant e reembolsado dos primeiros
              recebimentos antes do split. Comissão de vendas: 5% por unidade.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
