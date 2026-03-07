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
  CheckCircle2,
  Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStats {
  proximasReservas: number;
  pagamentosPendentes: number;
  propriedades: number;
  proximaSemana: string | null;
  statusFinanceiro?: "EM_DIA" | "PENDENTE";
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch("/api/cotistas/me/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

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
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Próximas Reservas"
          value={stats?.proximasReservas || 0}
          subtitle="Semanas confirmadas"
          icon={Calendar}
          color="green"
        />
        <StatsCard
          title="Pagamentos Pendentes"
          value={stats?.pagamentosPendentes || 0}
          subtitle="Cobranças em aberto"
          icon={DollarSign}
          color={stats?.pagamentosPendentes ? "orange" : "green"}
        />
        <StatsCard
          title="Minhas Propriedades"
          value={stats?.propriedades || 0}
          subtitle="Cotas ativas"
          icon={Home}
          color="blue"
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
