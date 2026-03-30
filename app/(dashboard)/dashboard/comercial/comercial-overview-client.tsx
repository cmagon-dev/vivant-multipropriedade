"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ContextualHelpAuto } from "@/components/help/ContextualHelpAuto";
import { HelpTip } from "@/components/help/HelpTip";
import { MicroOnboarding } from "@/components/help/MicroOnboarding";
import { NewLeadsAlert } from "@/components/comercial/NewLeadsAlert";
import { TrendingUp, Users, Building2, AlertCircle, BarChart3, Gauge, Trophy, PieChart, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Stats = {
  activeCount: number;
  wonThisMonth: number;
  lostThisMonth: number;
  overdueTaskCount: number;
} | null;

type MetricByType = { leadTypeId: string; key: string; name: string; active: number; won: number; lost: number };
type Bottleneck = { stageId: string; count: number; stage: { id: string; name: string } | null };
type Ranking = { ownerUserId: string; won: number; owner: { id: string; name: string } | null };
type LossByReason = { lossReasonId: string; count: number; reason: { id: string; name: string } | null };

type Metrics = {
  byType: MetricByType[];
  bottleneck: Bottleneck[];
  ranking: Ranking[];
  lossesByReason: LossByReason[];
} | null;

export function ComercialOverviewClient() {
  const [stats, setStats] = useState<Stats>(null);
  const [metrics, setMetrics] = useState<Metrics>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOpts: RequestInit = { cache: "no-store" };

  const fetchStats = () => {
    fetch("/api/crm/stats", fetchOpts)
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => setStats(null));
  };

  const fetchMetrics = () => {
    fetch("/api/crm/metrics", fetchOpts)
      .then((r) => (r.ok ? r.json() : null))
      .then(setMetrics)
      .catch(() => setMetrics(null));
  };

  const refreshAll = () => {
    setRefreshing(true);
    Promise.all([
      fetch("/api/crm/stats", fetchOpts).then((r) => (r.ok ? r.json() : null)).then(setStats).catch(() => setStats(null)),
      fetch("/api/crm/metrics", fetchOpts).then((r) => (r.ok ? r.json() : null)).then(setMetrics).catch(() => setMetrics(null)),
    ]).finally(() => setRefreshing(false));
  };

  useEffect(() => {
    fetchStats();
    fetchMetrics();
  }, []);

  // Atualizar métricas ao voltar para a aba e a cada 60s
  useEffect(() => {
    const onVisibility = () => document.visibilityState === "visible" && refreshAll();
    const interval = setInterval(refreshAll, 60_000);
    window.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(interval);
      window.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="space-y-6">
      <ContextualHelpAuto />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-vivant-navy">Painel Comercial</h1>
          <NewLeadsAlert />
          <Button
            variant="outline"
            size="sm"
            onClick={refreshAll}
            disabled={refreshing}
            className="gap-1.5"
          >
            <RefreshCw className={cn("w-4 h-4", refreshing && "animate-spin")} />
            {refreshing ? "Atualizando..." : "Atualizar"}
          </Button>
          <HelpTip
            helpKey="crm.leads"
            fallbackTitle="Área comercial"
            fallbackText="Aqui você acompanha seus leads e métricas. Use o menu para acessar Leads e Propriedades."
          />
        </div>
        <MicroOnboarding
          tutorialKey="dashboard.comercial"
          steps={[
            { id: "1", title: "Bem-vindo ao Comercial", content: "Este é seu painel para acompanhar leads e propriedades." },
            { id: "2", title: "Leads", content: "Acesse Leads no menu para ver e gerenciar contatos e oportunidades." },
            { id: "3", title: "Propriedades", content: "Em Propriedades você vê o portfólio disponível para ofertas." },
          ]}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Meus leads ativos</CardTitle>
            <Users className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-vivant-navy">{stats?.activeCount ?? "—"}</p>
            <Link href="/dashboard/comercial/leads">
              <Button variant="link" className="px-0 text-sm">Ver leads</Button>
            </Link>
          </CardContent>
        </Card>
        <Card className={stats?.overdueTaskCount ? "border-amber-300 bg-amber-50/50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">ALERTA vencidos</CardTitle>
            <AlertCircle className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-vivant-navy">{stats?.overdueTaskCount ?? "—"}</p>
            <p className="text-xs text-gray-500">Tarefas em atraso</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Ganhos no mês</CardTitle>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-700">{stats?.wonThisMonth ?? "—"}</p>
            <p className="text-xs text-gray-500">Leads fechados (WON)</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Perdidos no mês</CardTitle>
            <Building2 className="w-5 h-5 text-gray-400" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-700">{stats?.lostThisMonth ?? "—"}</p>
            <p className="text-xs text-gray-500">Leads perdidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Métricas por tipo (linha inteira), depois Gargalos, Ranking e Perdas em linha */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-vivant-navy" />
              Métricas por tipo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {!metrics ? (
              <p className="text-gray-500">Carregando...</p>
            ) : (metrics.byType ?? []).length === 0 ? (
              <p className="text-gray-500">Nenhum tipo cadastrado.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {(metrics.byType ?? []).map((m) => (
                  <div key={m.leadTypeId} className="rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                    <p className="font-medium text-gray-800 truncate">{m.name}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1.5 text-gray-600">
                      <span>Ativos: <strong>{m.active}</strong></span>
                      <span>Ganhos: <strong className="text-green-600">{m.won}</strong></span>
                      <span>Perdidos: <strong className="text-red-600">{m.lost}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Gauge className="w-4 h-4 text-vivant-navy" />
              Gargalos (etapas com mais leads)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {!metrics ? (
              <p className="text-gray-500">Carregando...</p>
            ) : (metrics.bottleneck ?? []).length === 0 ? (
              <p className="text-gray-500">Nenhum lead ativo nas etapas.</p>
            ) : (
              <ul className="space-y-2">
                {(metrics.bottleneck ?? []).slice(0, 6).map((b, i) => (
                  <li key={b.stageId} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={cn("flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium", i === 0 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-600")}>
                        {i + 1}
                      </span>
                      <span className="truncate">{b.stage?.name ?? b.stageId}</span>
                    </span>
                    <span className="font-medium text-vivant-navy flex-shrink-0">{b.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-vivant-navy" />
              Ranking (ganhos)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {!metrics ? (
              <p className="text-gray-500">Carregando...</p>
            ) : (metrics.ranking ?? []).length === 0 ? (
              <p className="text-gray-500">Nenhum ganho registrado.</p>
            ) : (
              <ul className="space-y-2">
                {(metrics.ranking ?? []).slice(0, 6).map((r, i) => (
                  <li key={r.ownerUserId} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={cn("flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium", i === 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600")}>
                        {i + 1}
                      </span>
                      <span className="truncate">{r.owner?.name ?? "—"}</span>
                    </span>
                    <span className="font-medium text-green-600 flex-shrink-0">{r.won}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PieChart className="w-4 h-4 text-vivant-navy" />
              Perdas por motivo
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {!metrics ? (
              <p className="text-gray-500">Carregando...</p>
            ) : (metrics.lossesByReason ?? []).length === 0 ? (
              <p className="text-gray-500">Nenhuma perda registrada.</p>
            ) : (
              <ul className="space-y-2">
                {(metrics.lossesByReason ?? []).slice(0, 8).map((l) => (
                  <li key={l.lossReasonId} className="flex items-center justify-between gap-2">
                    <span className="truncate">{l.reason?.name ?? l.lossReasonId}</span>
                    <span className="font-medium text-red-600 flex-shrink-0">{l.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Início rápido</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-600">
          Use o menu acima para acessar <strong>Leads</strong> (funil por tipo) e <strong>Propriedades</strong>. O Dono do sistema vê todos os eventos e tarefas em /admin.
        </CardContent>
      </Card>
    </div>
  );
}
