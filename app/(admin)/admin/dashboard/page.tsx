import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, MapPin, Users } from "lucide-react";
import { DashboardHelp } from "@/components/admin/dashboard-help";
import { HelpTip } from "@/components/help/HelpTip";

export default async function DashboardPage() {
  const [propertiesCount, destinationsCount, usersCount, publishedProperties] = 
    await Promise.all([
      prisma.property.count(),
      prisma.destination.count(),
      prisma.user.count(),
      prisma.property.count({ where: { published: true } }),
    ]);
  
  const stats = [
    {
      name: "Total de Casas",
      value: propertiesCount,
      icon: Building2,
      description: `${publishedProperties} publicadas`,
    },
    {
      name: "Destinos",
      value: destinationsCount,
      icon: MapPin,
      description: "Localizações disponíveis",
    },
    {
      name: "Usuários Admin",
      value: usersCount,
      icon: Users,
      description: "Acesso ao sistema",
    },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy mb-2">Dashboard</h1>
          <p className="text-gray-600">Visão geral do sistema</p>
        </div>
        <DashboardHelp />
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.name}
              </CardTitle>
              <stat.icon className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-vivant-navy">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
          <CardTitle>Bem-vindo ao Painel Administrativo</CardTitle>
          <HelpTip helpKey="dashboard.welcome" fallbackTitle="Ajuda" fallbackText="Use o menu lateral para acessar casas, destinos, usuários e configurações de acesso (roles/permissões)." />
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Use o menu lateral para navegar entre as seções de gerenciamento de casas, destinos e usuários.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
