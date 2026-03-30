"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { StatsCard } from "@/components/cotista/dashboard/stats-card";
import { NextReservations } from "@/components/cotista/dashboard/next-reservations";
import { PendingPayments } from "@/components/cotista/dashboard/pending-payments";
import { RecentNotices } from "@/components/cotista/dashboard/recent-notices";
import { 
  Calendar, 
  DollarSign, 
  Home, 
  Layers,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStats {
  proximasReservas: number;
  pagamentosPendentes: number;
  cotasAtivas: number;
  quantidadePropriedades: number;
  proximaSemana: string | null;
  statusFinanceiro?: "EM_DIA" | "PENDENTE";
  /** Com cotaId na URL: métricas só da propriedade da cota selecionada no header */
  escopo?: "propriedade" | "todas";
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;

    async function loadStats() {
      try {
        const [statsRes, propsRes] = await Promise.all([
          fetch("/api/cotistas/me/stats", {
            credentials: "include",
            cache: "no-store",
          }),
          fetch("/api/cotistas/me/propriedades", {
            credentials: "include",
            cache: "no-store",
          }),
        ]);

        let data: DashboardStats | null = null;
        if (statsRes.ok) {
          data = (await statsRes.json()) as DashboardStats;
        }

        /** Mesma contagem da página Minhas propriedades (imóveis distintos com cota ativa). */
        let qtdPropriedadesDistintas = 0;
        if (propsRes.ok) {
          const pj = await propsRes.json();
          qtdPropriedadesDistintas = Array.isArray(pj.propriedades)
            ? pj.propriedades.length
            : 0;
          if (data) {
            data = { ...data, quantidadePropriedades: qtdPropriedadesDistintas };
          }
        }

        const semCotas =
          !data ||
          (data.cotasAtivas === 0 && data.quantidadePropriedades === 0);
        if (semCotas) {
          const r2 = await fetch("/api/cotistas/me/cotas", {
            credentials: "include",
            cache: "no-store",
          });
          if (r2.ok) {
            const j = await r2.json();
            const cotas = (j.cotas ?? []) as Array<{
              property?: { id?: string };
            }>;
            if (cotas.length > 0) {
              const propIds = new Set(
                cotas
                  .map((c) => c.property?.id)
                  .filter((id): id is string => Boolean(id))
              );
              data = {
                proximasReservas: data?.proximasReservas ?? 0,
                pagamentosPendentes: data?.pagamentosPendentes ?? 0,
                cotasAtivas: cotas.length,
                quantidadePropriedades: propIds.size,
                proximaSemana: data?.proximaSemana ?? null,
                statusFinanceiro: data?.statusFinanceiro ?? "EM_DIA",
                escopo: "todas",
              };
            }
          }
        }

        if (propsRes.ok && data) {
          data = { ...data, quantidadePropriedades: qtdPropriedadesDistintas };
        }

        if (!cancelled) setStats(data);
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadStats();

    const onFocus = () => {
      void loadStats();
    };
    window.addEventListener("focus", onFocus);
    window.addEventListener("propertyChanged", onFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("propertyChanged", onFocus);
    };
  }, [status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-vivant-green animate-spin mx-auto mb-4" />
          <p className="text-[#1A2F4B]/70">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">
          Olá, {session?.user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="text-[#1A2F4B]/70">
          Bem-vindo ao seu Portal do Cotista Vivant Care
        </p>
        {stats != null && (stats.cotasAtivas > 0 || stats.quantidadePropriedades > 0) && (
          <p className="mt-2 text-sm text-[#1A2F4B]/85">
            {stats.escopo === "propriedade" ? (
              <>
                Nesta propriedade (contexto do seletor):{" "}
                <span className="font-semibold text-[#1A2F4B]">{stats.cotasAtivas}</span>{" "}
                {stats.cotasAtivas === 1 ? "cota" : "cotas"}.
              </>
            ) : (
              <>
                Resumo geral:{" "}
                <span className="font-semibold text-[#1A2F4B]">{stats.cotasAtivas}</span>{" "}
                {stats.cotasAtivas === 1 ? "cota ativa" : "cotas ativas"} em{" "}
                <span className="font-semibold text-[#1A2F4B]">{stats.quantidadePropriedades}</span>{" "}
                {stats.quantidadePropriedades === 1 ? "propriedade" : "propriedades"}.
              </>
            )}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard
          title="Próximas Reservas"
          value={stats?.proximasReservas ?? 0}
          subtitle="Semanas confirmadas"
          icon={Calendar}
          color="green"
        />
        <StatsCard
          title="Pagamentos Pendentes"
          value={stats?.pagamentosPendentes ?? 0}
          subtitle="Cobranças em aberto"
          icon={DollarSign}
          color={stats?.pagamentosPendentes ? "orange" : "green"}
        />
        <StatsCard
          title="Minhas propriedades"
          value={stats?.quantidadePropriedades ?? 0}
          subtitle={
            stats == null
              ? "—"
              : stats.quantidadePropriedades === 0
                ? "Nenhum imóvel vinculado"
                : stats.quantidadePropriedades === 1
                  ? "1 propriedade no seu nome"
                  : `${stats.quantidadePropriedades} propriedades no seu nome`
          }
          icon={Home}
          color="blue"
        />
        <StatsCard
          title="Cotas ativas"
          value={stats?.cotasAtivas ?? 0}
          subtitle="Total de cotas no seu nome"
          icon={Layers}
          color="green"
        />
        <StatsCard
          title="Status"
          value={stats?.statusFinanceiro === "PENDENTE" ? "Pendente" : "Em dia"}
          subtitle={stats?.statusFinanceiro === "PENDENTE" ? "Cobranças em aberto" : "Todas obrigações ok"}
          icon={CheckCircle2}
          color={stats?.statusFinanceiro === "PENDENTE" ? "orange" : "green"}
        />
      </div>

      {stats?.proximaSemana && (
        <Card className="border-2 border-vivant-green/30 bg-gradient-to-br from-vivant-green/5 to-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br from-vivant-green to-teal-600 flex items-center justify-center">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-serif font-bold text-[#1A2F4B] mb-2">
                  Sua Próxima Semana
                </h3>
                <p className="text-sm text-[#1A2F4B]/80 leading-relaxed">
                  {stats.proximaSemana}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <NextReservations />
        <PendingPayments />
      </div>

      <RecentNotices />
    </div>
  );
}
