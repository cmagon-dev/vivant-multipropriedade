import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Building2, FileText, TrendingUp, PieChart, BarChart3 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CapitalDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");
  const companyId = await getCapitalCompanyId(session);

  const [ativos, participacoes, pagamentos, solicitacoesPendentes, wallet, settings] = await Promise.all([
    prisma.capitalAssetConfig.findMany({
      where: { companyId, enabled: true },
      include: { property: { select: { name: true, priceValue: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.capitalParticipation.findMany({
      where: { companyId },
      include: { assetConfig: { select: { id: true, totalCotas: true, valorPorCota: true } } },
    }),
    prisma.capitalPayment.findMany({ where: { companyId } }),
    prisma.capitalLiquidityRequest.count({ where: { companyId, status: "PENDENTE" } }),
    prisma.capitalWallet.findUnique({ where: { companyId } }),
    prisma.capitalSettings.findUnique({ where: { companyId } }),
  ]);

  const totalAtivos = ativos.length;
  const vgvTotal = ativos.reduce((acc, a) => acc + Number(a.property?.priceValue ?? 0), 0);
  const valorEmCaptacao = ativos.reduce((acc, a) => acc + a.totalCotas * Number(a.valorPorCota), 0);
  const valorCaptado = participacoes.reduce((acc, p) => acc + Number(p.valorAportado), 0);
  const cotasTotais = ativos.reduce((acc, a) => acc + a.totalCotas, 0);
  const cotasReservadas = participacoes
    .filter((p) => p.status === "RESERVADO" || p.status === "CONTRATO_ENVIADO")
    .reduce((acc, p) => acc + p.numeroCotas, 0);
  const cotasVendidas = participacoes
    .filter((p) => p.status === "PAGO" || p.status === "ATIVO")
    .reduce((acc, p) => acc + p.numeroCotas, 0);
  const cotasDisponiveis = Math.max(cotasTotais - cotasReservadas - cotasVendidas, 0);
  const rentabilidadeMediaProjetada =
    totalAtivos > 0
      ? ativos.reduce((acc, a) => acc + Number(a.taxaAdministracaoPercent), 0) / totalAtivos
      : 0;

  const pagamentosPendentes = pagamentos.filter((p) => p.status !== "PAGO").length;
  const progressoCaptacao = valorEmCaptacao > 0 ? (valorCaptado / valorEmCaptacao) * 100 : 0;
  const statusOperacoes = ativos.reduce<Record<string, number>>((acc, a) => {
    const key = a.ativoStatus || "EM_ESTRUTURACAO";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const cards = [
    {
      title: "Total de ativos estruturados",
      value: totalAtivos,
      description: "Ativos habilitados no Capital",
      icon: Building2,
      color: "text-vivant-navy",
      bg: "bg-vivant-navy/10",
      href: "/admin/capital/ativos",
    },
    {
      title: "VGV total",
      value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(vgvTotal),
      description: "Soma do VGV dos ativos",
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      href: "/admin/capital/relatorios",
    },
    {
      title: "Valor em captação",
      value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorEmCaptacao),
      description: "Meta potencial por cotas",
      icon: TrendingUp,
      color: "text-amber-700",
      bg: "bg-amber-100",
      href: "/admin/capital/captacoes",
    },
    {
      title: "Valor captado",
      value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorCaptado),
      description: "Volume alocado em participações",
      icon: BarChart3,
      color: "text-green-700",
      bg: "bg-green-100",
      href: "/admin/capital/captacoes",
    },
    {
      title: "Cotas disponíveis",
      value: cotasDisponiveis,
      description: `Reservadas: ${cotasReservadas} · Vendidas: ${cotasVendidas}`,
      icon: PieChart,
      color: "text-indigo-700",
      bg: "bg-indigo-100",
      href: "/admin/capital/captacoes",
    },
    {
      title: "Bolsão de garantia",
      value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(wallet?.totalGuaranteeBalance ?? 0)),
      description: "Saldo acumulado de garantia",
      icon: DollarSign,
      color: "text-orange-700",
      bg: "bg-orange-100",
      href: "/admin/capital/pagamentos",
    },
    {
      title: "Operação Vivant",
      value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(wallet?.totalOperationBalance ?? 0)),
      description: "Saldo operacional acumulado",
      icon: DollarSign,
      color: "text-cyan-700",
      bg: "bg-cyan-100",
      href: "/admin/capital/pagamentos",
    },
    {
      title: "Total distribuído",
      value: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(wallet?.totalDistributed ?? 0)),
      description: "Distribuições efetivadas",
      icon: DollarSign,
      color: "text-purple-700",
      bg: "bg-purple-100",
      href: "/admin/capital/pagamentos",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Vivant Capital</h1>
        <p className="text-gray-500 mt-1">Dashboard executivo da estruturação e captação dos ativos</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-vivant-navy">Progresso de captação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full bg-vivant-green" style={{ width: `${Math.max(0, Math.min(100, progressoCaptacao))}%` }} />
            </div>
            <p className="text-sm text-gray-600">
              {progressoCaptacao.toFixed(2)}% captado ({new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorCaptado)} de{" "}
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valorEmCaptacao)})
            </p>
            <p className="text-sm text-gray-600">
              Rentabilidade média projetada: <strong>{rentabilidadeMediaProjetada.toFixed(2)}%</strong> (base padrão {Number(settings?.defaultReturnRate ?? 12).toFixed(2)}%)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-vivant-navy">Status das operações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            {Object.keys(statusOperacoes).length === 0 ? (
              <p>Nenhuma operação configurada.</p>
            ) : (
              Object.entries(statusOperacoes).map(([status, qtd]) => (
                <div key={status} className="flex items-center justify-between rounded border border-gray-100 px-3 py-2">
                  <span>{status}</span>
                  <strong>{qtd}</strong>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base text-vivant-navy">Principais ativos em andamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            {ativos.slice(0, 6).map((a) => {
              const captadoAtivo = participacoes
                .filter((p) => p.assetConfigId === a.id)
                .reduce((acc, p) => acc + Number(p.valorAportado), 0);
              return (
                <div key={a.id} className="flex items-center justify-between rounded border border-gray-100 px-3 py-2">
                  <span>{a.property?.name ?? "Ativo sem imóvel"}</span>
                  <span>{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(captadoAtivo)}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-vivant-navy">Alertas de compliance/documentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-between rounded border border-gray-100 px-3 py-2">
              <span>Solicitações pendentes para análise</span>
              <strong>{solicitacoesPendentes}</strong>
            </div>
            <div className="flex items-center justify-between rounded border border-gray-100 px-3 py-2">
              <span>Pagamentos pendentes</span>
              <strong>{pagamentosPendentes}</strong>
            </div>
            <div className="flex items-center justify-between rounded border border-gray-100 px-3 py-2">
              <span>Cotas reservadas sem confirmação</span>
              <strong>{cotasReservadas}</strong>
            </div>
            <Link href="/admin/capital/compliance" className="inline-flex text-vivant-navy hover:underline pt-1">
              Abrir painel de compliance
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
