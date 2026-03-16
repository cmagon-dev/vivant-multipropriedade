import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCapitalInvestorProfileId, isCapitalInvestor } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, PieChart, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export default async function CapitalInvestorDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!isCapitalInvestor(session)) redirect("/403");

  const profileId = await getCapitalInvestorProfileId(session);
  if (!profileId) redirect("/403");

  const [participations, lastDistribution, liquidityOpen] = await Promise.all([
    prisma.capitalParticipation.findMany({
      where: { investorProfileId: profileId, status: "ATIVO" },
      include: { assetConfig: { select: { valorPorCota: true } } },
    }),
    prisma.capitalDistributionItem.findFirst({
      where: { investorProfileId: profileId, status: "PAGO" },
      orderBy: { createdAt: "desc" },
      select: { valorPago: true, distribution: { select: { competencia: true } } },
    }),
    prisma.capitalLiquidityRequest.count({ where: { investorProfileId: profileId, status: "PENDENTE" } }),
  ]);

  const patrimonioInvestido = participations.reduce((s, p) => s + Number(p.valorAportado), 0);
  const valorEstimado = participations.reduce((s, p) => s + p.numeroCotas * Number(p.assetConfig.valorPorCota), 0);
  const rendimentoItems = await prisma.capitalDistributionItem.findMany({
    where: { investorProfileId: profileId },
    select: { valorPago: true },
  });
  const rendimentoAcumulado = rendimentoItems.reduce((s, i) => s + Number(i.valorPago), 0);

  const cards = [
    { title: "Patrimônio investido", value: fmt(patrimonioInvestido), icon: TrendingUp, href: "/capital/portfolio" },
    { title: "Valor estimado atual", value: fmt(valorEstimado), icon: PieChart, href: "/capital/portfolio" },
    { title: "Rendimento acumulado", value: fmt(rendimentoAcumulado), icon: DollarSign, href: "/capital/rendimentos" },
    { title: "Último recebimento", value: lastDistribution ? fmt(Number(lastDistribution.valorPago)) : "—", sub: lastDistribution?.distribution.competencia, icon: DollarSign, href: "/capital/rendimentos" },
    { title: "Ativos", value: String(participations.length), icon: PieChart, href: "/capital/portfolio" },
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
    </div>
  );
}

