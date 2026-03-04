import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Mail, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPortalDashboard() {
  // Estatísticas
  const [
    totalCotistas,
    cotistasAtivos,
    totalCobrancasPendentes,
    convitesPendentes,
  ] = await Promise.all([
    prisma.cotista.count(),
    prisma.cotista.count({ where: { active: true } }),
    prisma.cobranca.count({ where: { status: "PENDENTE" } }),
    prisma.cotista.count({ where: { inviteToken: { not: null } } }),
  ]);

  const cards = [
    {
      title: "Total de Cotistas",
      value: totalCotistas,
      description: `${cotistasAtivos} ativos`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Cotistas Ativos",
      value: cotistasAtivos,
      description: `${((cotistasAtivos / totalCotistas) * 100).toFixed(0)}% do total`,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Cobranças Pendentes",
      value: totalCobrancasPendentes,
      description: "Aguardando pagamento",
      icon: DollarSign,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Convites Pendentes",
      value: convitesPendentes,
      description: "Aguardando aceite",
      icon: Mail,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Dashboard do Portal</h1>
        <p className="text-gray-500 mt-1">Visão geral da gestão de cotistas</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-vivant-navy">{card.value}</div>
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-vivant-green" />
              Gerenciar Cotistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Visualize e gerencie todos os cotistas cadastrados no sistema
            </p>
            <a
              href="/admin-portal/cotistas"
              className="text-sm font-medium text-vivant-green hover:underline"
            >
              Acessar →
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-vivant-green" />
              Gestão Financeira
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Gere cobranças, acompanhe pagamentos e gerencie boletos
            </p>
            <a
              href="/admin-portal/financeiro"
              className="text-sm font-medium text-vivant-green hover:underline"
            >
              Acessar →
            </a>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5 text-vivant-green" />
              Convites
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Envie convites para novos cotistas e acompanhe aceites
            </p>
            <a
              href="/admin-portal/convites-pendentes"
              className="text-sm font-medium text-vivant-green hover:underline"
            >
              Acessar →
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
