import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  ClipboardCheck,
  DollarSign,
  Users,
  FileText,
  Bell,
  User,
  Building2,
  Store,
} from "lucide-react";

export type CotistaNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Rotas extras que deixam este item ativo (ex.: calendário em /minhas-semanas/:id) */
  activeWhenPathStartsWith?: string[];
};

/** Itens da sidebar desktop e do menu “Mais” no mobile */
export const COTISTA_NAV_ITEMS: CotistaNavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/propriedades", label: "Minhas propriedades", icon: Building2 },
  { href: "/dashboard/calendario", label: "Calendário", icon: Calendar },
  { href: "/dashboard/financeiro", label: "Financeiro", icon: DollarSign },
  {
    href: "/dashboard/marketplace/oportunidades",
    label: "Marketplace",
    icon: Store,
    activeWhenPathStartsWith: ["/dashboard/marketplace"],
  },
  { href: "/dashboard/assembleias", label: "Assembleias", icon: Users },
  {
    href: "/dashboard/minhas-semanas",
    label: "Minhas semanas",
    icon: CalendarDays,
    /** Trocas e subpáginas ficam sob este item (botão Troca de semanas em Minhas semanas). */
    activeWhenPathStartsWith: [
      "/dashboard/trocas",
      "/dashboard/oportunidades-trocas",
      "/dashboard/solicitacoes-trocas",
    ],
  },
  { href: "/dashboard/documentos", label: "Documentos", icon: FileText },
  { href: "/dashboard/check-in-check-out", label: "Check-in e Check-out", icon: ClipboardCheck },
  { href: "/dashboard/avisos", label: "Avisos", icon: Bell },
  { href: "/dashboard/perfil", label: "Meu Perfil", icon: User },
];

export function isCotistaNavItemActive(
  pathname: string,
  item: CotistaNavItem
): boolean {
  if (item.href === "/dashboard") {
    return pathname === "/dashboard";
  }
  if (pathname === item.href || pathname.startsWith(item.href + "/")) {
    return true;
  }
  for (const prefix of item.activeWhenPathStartsWith ?? []) {
    if (pathname === prefix || pathname.startsWith(prefix + "/")) {
      return true;
    }
  }
  return false;
}
