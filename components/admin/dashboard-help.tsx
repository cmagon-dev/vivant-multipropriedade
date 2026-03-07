"use client";

import { ModuleHelpBar } from "@/components/help/ModuleHelpBar";

const DASHBOARD_STEPS = [
  { id: "1", title: "Bem-vindo ao Dashboard", content: "Aqui você vê um resumo do sistema: total de casas, destinos e usuários. Use o menu lateral para acessar cada seção." },
  { id: "2", title: "Navegação", content: "Casas: gerencie propriedades. Destinos: localizações. Usuários: apenas para administradores. Roles e Permissões: controle de acesso (Admin Master)." },
];

export function DashboardHelp() {
  return (
    <ModuleHelpBar tutorialKey="admin.dashboard" steps={DASHBOARD_STEPS} />
  );
}
