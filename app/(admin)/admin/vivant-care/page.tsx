import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Mail, TrendingUp, Building2, Bell, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VivantCareDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "vivantCare.view")) redirect("/403");

  const [
    totalCotistas,
    cotistasAtivos,
    totalCobrancasPendentes,
    convitesPendentes,
    totalPropriedades,
    avisosAtivos,
    documentosAtivos,
  ] = await Promise.all([
    prisma.cotista.count(),
    prisma.cotista.count({ where: { active: true } }),
    prisma.cobranca.count({ where: { status: { in: ["PENDENTE", "VENCIDA"] } } }),
    prisma.cotista.count({ where: { inviteToken: { not: null } } }),
    prisma.property.count(),
    prisma.mensagem.count({ where: { ativa: true } }),
    prisma.documento.count({ where: { ativo: true } }),
  ]);

  const cards = [
    {
      title: "Total de Cotistas",
      value: totalCotistas,
      description: `${cotistasAtivos} ativos`,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
      href: "/admin/vivant-care/cotistas",
    },
    {
      title: "Cotistas Ativos",
      value: cotistasAtivos,
      description: totalCotistas > 0 ? `${Math.round((cotistasAtivos / totalCotistas) * 100)}% do total` : "—",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
      href: "/admin/vivant-care/cotistas",
    },
    {
      title: "Propriedades",
      value: totalPropriedades,
      description: "Casas no portal",
      icon: Building2,
      color: "text-vivant-navy",
      bg: "bg-vivant-navy/10",
      href: "/admin/vivant-care/propriedades",
    },
    {
      title: "Cobranças Pendentes",
      value: totalCobrancasPendentes,
      description: "Aguardando pagamento",
      icon: DollarSign,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
      href: "/admin/vivant-care/financeiro/cobrancas",
    },
    {
      title: "Convites Pendentes",
      value: convitesPendentes,
      description: "Aguardando aceite",
      icon: Mail,
      color: "text-purple-600",
      bg: "bg-purple-100",
      href: "/admin/vivant-care/convites",
    },
    {
      title: "Avisos Ativos",
      value: avisosAtivos,
      description: "Comunicados publicados",
      icon: Bell,
      color: "text-orange-600",
      bg: "bg-orange-100",
      href: "/admin/vivant-care/avisos",
    },
    {
      title: "Documentos",
      value: documentosAtivos,
      description: "Documentos publicados",
      icon: FileText,
      color: "text-slate-600",
      bg: "bg-slate-100",
      href: "/admin/vivant-care/documentos",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Vivant Care</h1>
        <p className="text-gray-500 mt-1">Visão geral da gestão do portal do cotista</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="hover:shadow-lg transition-shadow h-full">
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
          </Link>
        ))}
      </div>
    </div>
  );
}
