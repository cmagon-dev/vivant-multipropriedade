/**
 * Menu ÚNICO do sistema. Todos os usuários (OWNER, COMMERCIAL, STAFF, etc.)
 * veem a mesma estrutura; a visibilidade de cada item é filtrada por permissão.
 * Nunca criar menu "especial" por role — apenas filtrar pelo permission set.
 */

import { hasPermissionKey } from "@/lib/auth/permissions";

export type MenuSubItemConfig = {
  label: string;
  href: string;
  /** Se definido, o usuário precisa de pelo menos uma destas permissões. Senão, vale o `requiredPermissions` do item pai. */
  requiredPermissions?: string[];
};

export type MenuItemConfig = {
  label: string;
  href: string;
  iconKey: string;
  /** Ver hasPermissionKey: usuário precisa de pelo menos uma destas permissões para ver o item. */
  requiredPermissions: string[];
  /** Seção da sidebar para agrupamento visual. */
  section?: "dashboard" | "crm" | "comercial" | "propriedades" | "vivantcare" | "capital" | "administracao" | "suporte";
  /** Sublinks (não usar a chave "children": reservada na serialização RSC → cliente). */
  subItems?: MenuSubItemConfig[];
};

const SECTIONS_ORDER: MenuItemConfig["section"][] = ["dashboard", "crm", "comercial", "propriedades", "vivantcare", "capital", "administracao", "suporte"];

/** Ordem padrão: todos os itens possíveis do sistema, agrupados por seção. */
export const UNIFIED_MENU_CONFIG: MenuItemConfig[] = [
  {
    label: "Visão do Dono",
    href: "/admin/overview",
    iconKey: "LayoutDashboard",
    requiredPermissions: ["admin.view", "dashboard.admin.view"],
    section: "dashboard",
  },
  {
    label: "Início Comercial",
    href: "/dashboard/comercial",
    iconKey: "Home",
    requiredPermissions: ["comercial.view", "crm.view"],
    section: "dashboard",
  },
  {
    label: "Leads",
    href: "/dashboard/comercial/leads",
    iconKey: "LayoutGrid",
    requiredPermissions: ["comercial.view", "crm.view"],
    section: "crm",
  },
  {
    label: "Parâmetros",
    href: "/admin/crm",
    iconKey: "GitBranch",
    requiredPermissions: ["crm.manage"],
    section: "crm",
  },
  {
    label: "Tarefas",
    href: "/admin/tasks",
    iconKey: "CheckSquare",
    requiredPermissions: ["tasks.view", "tasks.manage"],
    section: "crm",
  },
  {
    label: "Cadastros",
    href: "/dashboard/comercial/cadastros",
    iconKey: "ClipboardList",
    requiredPermissions: ["comercial.view"],
    section: "comercial",
  },
  {
    label: "Simulador de Vendas",
    href: "/dashboard/comercial/simuladores-cotas",
    iconKey: "Calculator",
    requiredPermissions: ["comercial.view"],
    section: "comercial",
  },
  {
    label: "Simuladores Aquisição",
    href: "/dashboard/comercial/simuladores-aquisicao",
    iconKey: "TrendingUp",
    requiredPermissions: ["comercial.view"],
    section: "comercial",
  },
  {
    label: "LOGS",
    href: "/admin/events",
    iconKey: "Activity",
    requiredPermissions: ["events.view", "events.manage"],
    section: "administracao",
  },
  {
    label: "Casas",
    href: "/admin/casas",
    iconKey: "Building2",
    requiredPermissions: ["properties.view", "properties.manage"],
    section: "propriedades",
  },
  {
    label: "Destinos",
    href: "/admin/destinos",
    iconKey: "MapPin",
    requiredPermissions: ["destinations.view", "destinations.manage"],
    section: "propriedades",
  },
  // Vivant Care (portal do cotista - gestão dentro do admin)
  {
    label: "Dashboard",
    href: "/admin/vivant-care",
    iconKey: "LayoutDashboard",
    requiredPermissions: ["vivantCare.view"],
    section: "vivantcare",
  },
  {
    label: "Cotistas",
    href: "/admin/vivant-care/cotistas",
    iconKey: "Users",
    requiredPermissions: ["vivantCare.cotistas.view", "vivantCare.cotistas.manage"],
    section: "vivantcare",
  },
  {
    label: "Convites",
    href: "/admin/vivant-care/convites",
    iconKey: "Mail",
    requiredPermissions: ["vivantCare.convites.view", "vivantCare.convites.manage"],
    section: "vivantcare",
  },
  {
    label: "Propriedades",
    href: "/admin/vivant-care/propriedades",
    iconKey: "Building2",
    requiredPermissions: ["vivantCare.propriedades.view", "vivantCare.propriedades.manage"],
    section: "vivantcare",
  },
  {
    label: "Financeiro",
    href: "/admin/vivant-care/financeiro",
    iconKey: "DollarSign",
    requiredPermissions: ["vivantCare.financeiro.view", "vivantCare.financeiro.manage"],
    section: "vivantcare",
    subItems: [
      { label: "Pagamentos", href: "/admin/vivant-care/financeiro/cobrancas" },
      {
        label: "Lançar cobranças",
        href: "/admin/vivant-care/financeiro/lancar-cobrancas",
        requiredPermissions: ["vivantCare.financeiro.manage"],
      },
      {
        label: "Situação por casa",
        href: "/admin/vivant-care/financeiro/por-propriedade",
      },
    ],
  },
  {
    label: "Avisos",
    href: "/admin/vivant-care/avisos",
    iconKey: "Bell",
    requiredPermissions: ["vivantCare.avisos.view", "vivantCare.avisos.manage"],
    section: "vivantcare",
  },
  {
    label: "Documentos",
    href: "/admin/vivant-care/documentos",
    iconKey: "FileText",
    requiredPermissions: ["vivantCare.documentos.view", "vivantCare.documentos.manage"],
    section: "vivantcare",
  },
  {
    label: "Assembleias",
    href: "/admin/vivant-care/assembleias",
    iconKey: "Vote",
    requiredPermissions: ["vivantCare.assembleias.view", "vivantCare.assembleias.manage"],
    section: "vivantcare",
  },
  {
    label: "Trocas",
    href: "/admin/vivant-care/trocas",
    iconKey: "ArrowRightLeft",
    requiredPermissions: ["vivantCare.trocas.view", "vivantCare.trocas.manage"],
    section: "vivantcare",
  },
  // Vivant Capital (investimentos sobre imóveis existentes)
  {
    label: "Dashboard",
    href: "/admin/capital",
    iconKey: "LayoutDashboard",
    requiredPermissions: ["capital.view", "capital.manage"],
    section: "capital",
  },
  {
    label: "Ativos",
    href: "/admin/capital/ativos",
    iconKey: "Building2",
    requiredPermissions: ["capital.view", "capital.manage"],
    section: "capital",
  },
  {
    label: "Investidores",
    href: "/admin/capital/investidores",
    iconKey: "Users",
    requiredPermissions: ["capital.view", "capital.manage"],
    section: "capital",
  },
  {
    label: "Captações",
    href: "/admin/capital/captacoes",
    iconKey: "TrendingUp",
    requiredPermissions: ["capital.view", "capital.manage"],
    section: "capital",
  },
  {
    label: "Pagamentos",
    href: "/admin/capital/pagamentos",
    iconKey: "DollarSign",
    requiredPermissions: ["capital.view", "capital.manage"],
    section: "capital",
  },
  {
    label: "Compliance",
    href: "/admin/capital/compliance",
    iconKey: "FileText",
    requiredPermissions: ["capital.view", "capital.manage"],
    section: "capital",
  },
  {
    label: "Relatórios",
    href: "/admin/capital/relatorios",
    iconKey: "BarChart3",
    requiredPermissions: ["capital.view", "capital.manage"],
    section: "capital",
  },
  {
    label: "Configurações",
    href: "/admin/capital/configuracoes",
    iconKey: "Shield",
    requiredPermissions: ["capital.view", "capital.manage"],
    section: "capital",
  },
  {
    label: "Usuários",
    href: "/admin/usuarios",
    iconKey: "Users",
    requiredPermissions: ["users.manage"],
    section: "administracao",
  },
  {
    label: "Permissões",
    href: "/admin/roles",
    iconKey: "Shield",
    requiredPermissions: ["roles.manage"],
    section: "administracao",
  },
  {
    label: "Ajuda",
    href: "/admin/help",
    iconKey: "HelpCircle",
    requiredPermissions: ["help.view", "help.manage"],
    section: "suporte",
  },
];

const FULL_ACCESS_ROLES = ["OWNER", "SUPER_ADMIN"];
const HIDDEN_MENU_SECTIONS: Array<NonNullable<MenuItemConfig["section"]>> = [];

/**
 * Filtra itens do menu pelo conjunto de permissões (e role).
 * OWNER/SUPER_ADMIN veem todos os itens.
 */
export function filterMenuByPermission(
  items: MenuItemConfig[],
  permissions: string[],
  roleKey?: string | null
): MenuItemConfig[] {
  const visibleItems = items.filter(
    (item) => !(item.section && HIDDEN_MENU_SECTIONS.includes(item.section))
  );
  if (roleKey && FULL_ACCESS_ROLES.includes(roleKey)) return visibleItems;
  return visibleItems.filter((item) =>
    item.requiredPermissions.some((perm) => hasPermissionKey(permissions, perm))
  );
}

/**
 * Remove subitens cujo `requiredPermissions` (ou o do pai) o usuário não atende.
 */
export function filterMenuSubItemsByPermission(
  items: MenuItemConfig[],
  permissions: string[],
  roleKey?: string | null
): MenuItemConfig[] {
  if (roleKey && FULL_ACCESS_ROLES.includes(roleKey)) {
    return items;
  }
  return items.map((item) => {
    if (!item.subItems?.length) return item;
    const subItems = item.subItems.filter((sub) => {
      const perms = sub.requiredPermissions ?? item.requiredPermissions;
      return perms.some((p) => hasPermissionKey(permissions, p));
    });
    return { ...item, subItems };
  });
}

/** Formato esperado pelo AppShell (name, href, iconKey, section). */
export type ShellMenuItem = {
  name: string;
  href: string;
  iconKey: string;
  section?: MenuItemConfig["section"];
  subItems?: { name: string; href: string }[];
};

/** Títulos das seções para exibição na sidebar. */
export const SECTION_TITLES: Record<NonNullable<MenuItemConfig["section"]>, string> = {
  dashboard: "DASHBOARD",
  crm: "CRM",
  comercial: "COMERCIAL",
  propriedades: "PROPRIEDADES",
  vivantcare: "VIVANT CARE",
  capital: "VIVANT CAPITAL",
  administracao: "ADMINISTRAÇÃO",
  suporte: "SUPORTE",
};

/** Ordem das seções na sidebar. */
export const SECTION_ORDER = SECTIONS_ORDER;

/** Converte config filtrado para o formato do AppShell. */
export function toShellMenuItems(items: MenuItemConfig[]): ShellMenuItem[] {
  return items.map((item) => ({
    name: item.label,
    href: item.href,
    iconKey: item.iconKey,
    section: item.section,
    subItems: item.subItems?.map((c) => ({ name: c.label, href: c.href })),
  }));
}
