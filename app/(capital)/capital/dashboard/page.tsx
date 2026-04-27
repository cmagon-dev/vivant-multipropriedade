import { getSession } from "@/lib/auth";
import { getCapitalInvestorContext, isCapitalInvestor } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, PieChart, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export default async function CapitalInvestorDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isCapitalInvestor(session)) redirect("/403");

  const context = await getCapitalInvestorContext(session);
  if (!context) redirect("/403");

  const [participations, lastDistribution, liquidityOpen, distributions] = await Promise.all([
    prisma.capitalParticipation.findMany({
      where: {
        investorProfileId: context.investorProfileId,
        companyId: context.companyId,
        status: { in: ["ATIVO", "PAGO", "RESERVADO"] },
      },
      include: { assetConfig: { select: { valorPorCota: true } } },
    }),
    prisma.capitalDistributionItem.findFirst({
      where: {
        investorProfileId: context.investorProfileId,
        companyId: context.companyId,
        status: "PAGO",
      },
      orderBy: { createdAt: "desc" },
      select: { valorPago: true, distribution: { select: { competencia: true } } },
    }),
    prisma.capitalLiquidityRequest.count({
      where: {
        investorProfileId: context.investorProfileId,
        companyId: context.companyId,
        status: "PENDENTE",
      },
    }),
    prisma.capitalDistributionItem.findMany({
      where: {
        investorProfileId: context.investorProfileId,
        companyId: context.companyId,
      },
      include: { distribution: { select: { competencia: true } } },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const totalInvestido = participations.reduce((s, p) => s + Number(p.valorAportado), 0);
  const retornoProjetado = participations.reduce((s, p) => s + Number(p.expectedReturn ?? 0), 0);
  const roiPercent = totalInvestido > 0 ? (retornoProjetado / totalInvestido) * 100 : 0;
  const ativosParticipa = participations.length;

  const evolutionMap = new Map<string, number>();
  for (const item of distributions) {
    const key = item.distribution.competencia;
    evolutionMap.set(key, (evolutionMap.get(key) ?? 0) + Number(item.valorPago));
  }
  const evolution = Array.from(evolutionMap.entries()).map(([competencia, valor]) => ({ competencia, valor }));
  const maxEvolutionValue = Math.max(...evolution.map((e) => e.valor), 1);

  const cards = [
    { title: "Total investido", value: fmt(totalInvestido), icon: TrendingUp, href: "/capital/investimentos" },
    { title: "Retorno projetado", value: fmt(retornoProjetado), icon: PieChart, href: "/capital/investimentos" },
    { title: "ROI projetado", value: `${roiPercent.toFixed(2)}%`, icon: DollarSign, href: "/capital/investimentos" },
    { title: "Último recebimento", value: lastDistribution ? fmt(Number(lastDistribution.valorPago)) : "—", sub: lastDistribution?.distribution.competencia, icon: DollarSign, href: "/capital/pagamentos" },
    { title: "Ativos que participa", value: String(ativosParticipa), icon: PieChart, href: "/capital/investimentos" },
    { title: "Solicitações em aberto", value: String(liquidityOpen), icon: FileText, href: "/capital/solicitacoes" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vivant-navy">Meu Capital</h1>
        <p className="text-gray-500 mt-1">Visão geral dos seus investimentos</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.title} href={c.href}>
            <Card className="hover:shadow-md transition-shadow h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{c.title}</CardTitle>
                <c.icon className="w-4 h-4 text-vivant-navy" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-vivant-navy">{c.value}</div>
                {c.sub && <p className="text-xs text-gray-500 mt-1">{c.sub}</p>}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base text-vivant-navy">Evolução de distribuições</CardTitle>
        </CardHeader>
        <CardContent>
          {evolution.length === 0 ? (
            <p className="text-sm text-gray-500">Sem histórico de distribuições para exibir.</p>
          ) : (
            <div className="space-y-3">
              {evolution.map((item) => (
                <div key={item.competencia} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.competencia}</span>
                    <span className="font-medium text-vivant-navy">{fmt(item.valor)}</span>
                  </div>
                  <div className="h-2 rounded bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-vivant-navy"
                      style={{ width: `${Math.max(6, (item.valor / maxEvolutionValue) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

