/**
 * Catálogo central de permissões por módulo.
 * Padrão: <modulo>.<acao> (view | create | edit | delete | manage).
 */

export type RiskLevel = "low" | "medium" | "high" | "critical";

export type PermissionEntry = {
  key: string;
  label: string;
  description: string;
  module: string;
  action: string;
  riskLevel: RiskLevel;
};

/** Quem geralmente tem essa permissão (para documentação). */
export type DefaultAudience = "OWNER" | "COMMERCIAL" | "STAFF" | "COTISTA" | "ADMIN";

const catalog: PermissionEntry[] = [
  { key: "crm.view", label: "Ver CRM/Leads", description: "Visualizar funis e leads", module: "crm", action: "view", riskLevel: "low" },
  { key: "crm.create", label: "Criar leads", description: "Criar novos leads", module: "crm", action: "create", riskLevel: "medium" },
  { key: "crm.edit", label: "Editar leads", description: "Editar dados de leads", module: "crm", action: "edit", riskLevel: "medium" },
  { key: "crm.delete", label: "Excluir leads", description: "Excluir leads", module: "crm", action: "delete", riskLevel: "high" },
  { key: "crm.manage", label: "Gerenciar CRM", description: "Tipos, etapas, motivos de perda", module: "crm", action: "manage", riskLevel: "high" },
  { key: "crm.activity", label: "Registrar atividades", description: "Notas, ligações, WhatsApp", module: "crm", action: "activity", riskLevel: "low" },
  { key: "crm.move", label: "Mover etapa", description: "Mover lead entre etapas", module: "crm", action: "move", riskLevel: "medium" },
  { key: "crm.close", label: "Fechar lead", description: "Ganho/Perda", module: "crm", action: "close", riskLevel: "medium" },
  { key: "sla.manage", label: "Configurar ALERTA / Kanban", description: "Pode configurar ALERTA e thresholds por etapa", module: "crm", action: "sla", riskLevel: "high" },
  { key: "users.view", label: "Ver usuários", description: "Listar usuários", module: "users", action: "view", riskLevel: "medium" },
  { key: "users.create", label: "Criar usuários", description: "Criar novos usuários", module: "users", action: "create", riskLevel: "high" },
  { key: "users.edit", label: "Editar usuários", description: "Editar usuários", module: "users", action: "edit", riskLevel: "high" },
  { key: "users.delete", label: "Excluir usuários", description: "Excluir usuários", module: "users", action: "delete", riskLevel: "critical" },
  { key: "users.manage", label: "Gerenciar usuários", description: "CRUD e atribuição de usuários", module: "users", action: "manage", riskLevel: "critical" },
  { key: "roles.view", label: "Ver roles", description: "Listar roles", module: "roles", action: "view", riskLevel: "medium" },
  { key: "roles.manage", label: "Gerenciar roles", description: "Criar e editar roles", module: "roles", action: "manage", riskLevel: "critical" },
  { key: "permissions.view", label: "Ver permissões", description: "Listar permissões", module: "permissions", action: "view", riskLevel: "medium" },
  { key: "permissions.manage", label: "Gerenciar permissões", description: "Atribuir permissões a roles", module: "permissions", action: "manage", riskLevel: "critical" },
  { key: "properties.view", label: "Ver propriedades", description: "Visualizar casas/propriedades", module: "properties", action: "view", riskLevel: "low" },
  { key: "properties.create", label: "Criar propriedades", description: "Criar propriedades", module: "properties", action: "create", riskLevel: "high" },
  { key: "properties.edit", label: "Editar propriedades", description: "Editar propriedades", module: "properties", action: "edit", riskLevel: "high" },
  { key: "properties.delete", label: "Excluir propriedades", description: "Excluir propriedades", module: "properties", action: "delete", riskLevel: "critical" },
  { key: "properties.manage", label: "Gerenciar propriedades", description: "Admin total de propriedades", module: "properties", action: "manage", riskLevel: "high" },
  { key: "destinations.view", label: "Ver destinos", description: "Visualizar destinos", module: "destinations", action: "view", riskLevel: "low" },
  { key: "destinations.create", label: "Criar destinos", description: "Criar novos destinos", module: "destinations", action: "create", riskLevel: "high" },
  { key: "destinations.edit", label: "Editar destinos", description: "Editar destinos", module: "destinations", action: "edit", riskLevel: "high" },
  { key: "destinations.delete", label: "Excluir destinos", description: "Excluir destinos", module: "destinations", action: "delete", riskLevel: "critical" },
  { key: "destinations.manage", label: "Gerenciar destinos", description: "CRUD de destinos", module: "destinations", action: "manage", riskLevel: "high" },
  { key: "events.view", label: "Ver eventos", description: "Eventos do sistema para o Dono", module: "events", action: "view", riskLevel: "medium" },
  { key: "events.manage", label: "Gerenciar eventos", description: "Admin de eventos", module: "events", action: "manage", riskLevel: "high" },
  { key: "tasks.view", label: "Ver tarefas", description: "Tarefas e pendências", module: "tasks", action: "view", riskLevel: "medium" },
  { key: "tasks.manage", label: "Gerenciar tarefas", description: "Admin de tarefas", module: "tasks", action: "manage", riskLevel: "high" },
  { key: "help.view", label: "Ver ajuda", description: "Conteúdos de ajuda", module: "help", action: "view", riskLevel: "low" },
  { key: "help.manage", label: "Gerenciar ajuda", description: "Editar conteúdos de ajuda contextual", module: "help", action: "manage", riskLevel: "medium" },
  { key: "dashboard.view", label: "Ver dashboard", description: "Acesso ao painel dashboard", module: "dashboard", action: "view", riskLevel: "low" },
  { key: "dashboard.admin.view", label: "Ver painel admin", description: "Acesso ao /admin", module: "dashboard", action: "admin.view", riskLevel: "high" },
  { key: "cotista.view", label: "Ver portal cotista", description: "Acesso ao portal do cotista", module: "cotista", action: "view", riskLevel: "low" },
  { key: "companies.manage", label: "Gerenciar empresas", description: "Multi-tenant", module: "companies", action: "manage", riskLevel: "critical" },
  // Vivant Care (gestão do portal do cotista dentro do admin)
  { key: "vivantCare.view", label: "Ver Vivant Care", description: "Acesso ao módulo Vivant Care no admin", module: "vivantCare", action: "view", riskLevel: "low" },
  { key: "vivantCare.cotistas.view", label: "Ver cotistas", description: "Listar cotistas do Vivant Care", module: "vivantCare", action: "cotistas.view", riskLevel: "medium" },
  { key: "vivantCare.cotistas.manage", label: "Gerenciar cotistas", description: "CRUD e convites de cotistas", module: "vivantCare", action: "cotistas.manage", riskLevel: "high" },
  { key: "vivantCare.propriedades.view", label: "Ver propriedades (Vivant Care)", description: "Listar propriedades do portal", module: "vivantCare", action: "propriedades.view", riskLevel: "low" },
  { key: "vivantCare.propriedades.manage", label: "Gerenciar propriedades (Vivant Care)", description: "Editar propriedades e cotas do portal", module: "vivantCare", action: "propriedades.manage", riskLevel: "high" },
  { key: "vivantCare.financeiro.view", label: "Ver financeiro", description: "Listar cobranças e financeiro", module: "vivantCare", action: "financeiro.view", riskLevel: "medium" },
  { key: "vivantCare.financeiro.manage", label: "Gerenciar financeiro", description: "Gerar cobranças e registrar pagamentos", module: "vivantCare", action: "financeiro.manage", riskLevel: "high" },
  { key: "vivantCare.avisos.view", label: "Ver avisos", description: "Listar avisos/comunicados", module: "vivantCare", action: "avisos.view", riskLevel: "low" },
  { key: "vivantCare.avisos.manage", label: "Gerenciar avisos", description: "Criar e editar avisos por propriedade", module: "vivantCare", action: "avisos.manage", riskLevel: "medium" },
  { key: "vivantCare.documentos.view", label: "Ver documentos", description: "Listar documentos do portal", module: "vivantCare", action: "documentos.view", riskLevel: "low" },
  { key: "vivantCare.documentos.manage", label: "Gerenciar documentos", description: "Upload e gestão de documentos", module: "vivantCare", action: "documentos.manage", riskLevel: "medium" },
  { key: "vivantCare.convites.view", label: "Ver convites", description: "Listar convites de cotistas", module: "vivantCare", action: "convites.view", riskLevel: "low" },
  { key: "vivantCare.convites.manage", label: "Gerenciar convites", description: "Criar, reenviar e cancelar convites", module: "vivantCare", action: "convites.manage", riskLevel: "medium" },
  { key: "vivantCare.assembleias.view", label: "Ver assembleias", description: "Listar assembleias", module: "vivantCare", action: "assembleias.view", riskLevel: "low" },
  { key: "vivantCare.assembleias.manage", label: "Gerenciar assembleias", description: "Criar e editar assembleias e pautas", module: "vivantCare", action: "assembleias.manage", riskLevel: "medium" },
  { key: "vivantCare.trocas.view", label: "Ver trocas de semanas", description: "Listar solicitações de troca", module: "vivantCare", action: "trocas.view", riskLevel: "low" },
  { key: "vivantCare.trocas.manage", label: "Gerenciar trocas", description: "Aprovar, reprovar e gerenciar trocas", module: "vivantCare", action: "trocas.manage", riskLevel: "medium" },
  // Legado (mantidos para compatibilidade)
  { key: "admin.view", label: "Ver painel admin (legado)", description: "Alias para dashboard.admin.view", module: "dashboard", action: "view", riskLevel: "high" },
  { key: "comercial.view", label: "Ver painel comercial (legado)", description: "Alias para crm.view", module: "crm", action: "view", riskLevel: "low" },
  { key: "leads.read", label: "Ler leads (legado)", description: "Alias para crm.view", module: "crm", action: "view", riskLevel: "low" },
  { key: "leads.write", label: "Editar leads (legado)", description: "Alias para crm.edit", module: "crm", action: "edit", riskLevel: "medium" },
  { key: "properties.read", label: "Ler propriedades (legado)", description: "Alias para properties.view", module: "properties", action: "view", riskLevel: "low" },
  { key: "properties.write", label: "Editar propriedades (legado)", description: "Alias para properties.edit", module: "properties", action: "edit", riskLevel: "high" },
];

/** Chaves que concedem a permissão lógica (para hasPermission). */
const GRANTED_BY: Record<string, string[]> = {
  "admin.view": ["admin.view", "dashboard.admin.view"],
  "comercial.view": ["comercial.view", "crm.view"],
  "leads.read": ["leads.read", "crm.view"],
  "leads.write": ["leads.write", "crm.edit", "crm.create"],
  "properties.read": ["properties.read", "properties.view"],
  "properties.write": ["properties.write", "properties.edit", "properties.create"],
};

export function getPermissionCatalog(): PermissionEntry[] {
  return catalog;
}

export function getPermissionByKey(key: string): PermissionEntry | undefined {
  return catalog.find((p) => p.key === key);
}

/** Retorna todas as chaves que concedem a permissão (incluindo a própria). */
export function getKeysThatGrant(permissionKey: string): string[] {
  return GRANTED_BY[permissionKey] ?? [permissionKey];
}

export function getCatalogByModule(): Record<string, PermissionEntry[]> {
  const byModule: Record<string, PermissionEntry[]> = {};
  for (const p of catalog) {
    (byModule[p.module] = byModule[p.module] || []).push(p);
  }
  for (const mod of Object.keys(byModule)) {
    byModule[mod].sort((a, b) => a.key.localeCompare(b.key));
  }
  return byModule;
}

/** Matriz: role key -> permissões concedidas por padrão no seed (para documentação). */
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  OWNER: ["*"],
  SUPER_ADMIN: ["*"],
  COMMERCIAL: [
    "comercial.view", "crm.view", "crm.create", "crm.edit", "crm.activity", "crm.move", "crm.close",
    "dashboard.view", "leads.read", "leads.write", "properties.read", "properties.view",
  ],
  STAFF: ["dashboard.view", "properties.view", "properties.read", "events.view", "tasks.view"],
  COTISTA: ["cotista.view"],
  ADMIN: [
    "admin.view", "dashboard.view", "dashboard.admin.view", "properties.read", "properties.write",
    "leads.read", "leads.write", "cotista.view", "sla.manage",
  ],
};
