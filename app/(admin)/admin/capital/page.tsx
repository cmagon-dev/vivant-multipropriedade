import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Building2, FileText, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CapitalDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");

  const [totalCaptado, totalDistribuido, investidoresAtivos, ativosVinculados, solicitacoesPendentes] = await Promise.all([
    prisma.capitalParticipation.aggregate({ where: { status: "ATIVO" }, _sum: { valorAportado: true } }).then((r) => Number(r._sum.valorAportado ?? 0)),
    prisma.capitalDistributionItem.aggregate({ where: { status: "PAGO" }, _sum: { valorPago: true } }).then((r) => Number(r._sum.valorPago ?? 0)),
    prisma.capitalInvestorProfile.count({ where: { status: "ATIVO" } }),
    prisma.capitalAssetConfig.count({ where: { enabled: true } }),
    prisma.capitalLiquidityRequest.count({ where: { status: "PENDENTE" } }),
  ]);
  const data = { totalCaptado, totalDistribuido, investidoresAtivos, ativosVinculados, solicitacoesPendentes };

  const cards = [
    {
      title: "Total captado",
      value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(data.totalCaptado ?? 0),
      description: "Aportes ativos",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
      href: "/admin/capital/participacoes",
    },
    {
      title: "Total distribuído",
      value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(data.totalDistribuido ?? 0),
      description: "Rendimentos pagos",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      href: "/admin/capital/distribuicoes",
    },
    {
      title: "Investidores ativos",
      value: data.investidoresAtivos ?? 0,
      description: "Perfis ativos",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      href: "/admin/capital/investidores",
    },
    {
      title: "Ativos vinculados",
      value: data.ativosVinculados ?? 0,
      description: "Imóveis no Capital",
      icon: Building2,
      color: "text-vivant-navy",
      bg: "bg-vivant-navy/10",
      href: "/admin/capital/ativos",
    },
    {
      title: "Solicitações pendentes",
      value: data.solicitacoesPendentes ?? 0,
      description: "Antecipação / liquidez",
      icon: FileText,
      color: "text-amber-600",
      bg: "bg-amber-100",
      href: "/admin/capital/solicitacoes",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Vivant Capital</h1>
        <p className="text-gray-500 mt-1">Visão geral da gestão de investimentos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:shadow-lg transition-shadow h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{card.title}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-vivant-navy">{card.value}</div>
                <p className="text-xs text-gray-500 mt-1">{card.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
