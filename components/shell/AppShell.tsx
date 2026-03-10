"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LogOut,
  LayoutDashboard,
  Home,
  GitBranch,
  Users,
  Building2,
  MapPin,
  Shield,
  Key,
  Activity,
  CheckSquare,
  HelpCircle,
  DollarSign,
  Bell,
  FileText,
  Mail,
  Vote,
  ArrowRightLeft,
  TrendingUp,
  PieChart,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SECTION_TITLES, SECTION_ORDER } from "@/lib/navigation/menu";
import type { ShellMenuItem } from "@/lib/navigation/menu";

export type AppShellMenuItem = ShellMenuItem;

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Home,
  GitBranch,
  Users,
  Building2,
  MapPin,
  Shield,
  Key,
  Activity,
  CheckSquare,
  HelpCircle,
  DollarSign,
  Bell,
  FileText,
  Mail,
  Vote,
  ArrowRightLeft,
  TrendingUp,
  PieChart,
  BarChart3,
};

export type AppShellUserDisplay = {
  name: string;
  roleLabel: string;
};

export type AppShellProps = {
  /** Título exibido na topbar */
  title: string;
  /** Itens do menu já filtrados por permissão (menu único para todo o sistema) */
  menuItems: AppShellMenuItem[];
  userDisplay: AppShellUserDisplay;
  children: React.ReactNode;
};

/**
 * Shell único para todo o sistema (Admin, Comercial, etc.).
 * Mesma sidebar, topbar e container. Apenas "Sair" no topo — sem "Ver site".
 */
function groupItemsBySection(items: AppShellMenuItem[]): Map<string | undefined, AppShellMenuItem[]> {
  const map = new Map<string | undefined, AppShellMenuItem[]>();
  for (const item of items) {
    const key = item.section ?? "__none";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return map;
}

function getSectionContainingPathname(
  pathname: string,
  bySection: Map<string | undefined, AppShellMenuItem[]>
): string | null {
  for (const sectionKey of SECTION_ORDER) {
    if (!sectionKey) continue;
    const items = bySection.get(sectionKey) ?? [];
    if (items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/")))
      return sectionKey;
  }
  return null;
}

export function AppShell({
  title,
  menuItems,
  userDisplay,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const bySection = useMemo(() => groupItemsBySection(menuItems), [menuItems]);

  const initialOpenSections = useMemo(() => {
    const active = getSectionContainingPathname(pathname, bySection);
    return active ? [active] : [];
  }, [pathname, bySection]);

  const [openSections, setOpenSections] = useState<string[]>(initialOpenSections);

  useEffect(() => {
    const active = getSectionContainingPathname(pathname, bySection);
    if (active) {
      setOpenSections((prev) => (prev.includes(active) ? prev : [...prev, active]));
    }
  }, [pathname, bySection]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 flex-shrink-0">
          <Link href="/" className="block">
            <img src="/logo-vivant.png" alt="Vivant" className="h-10" />
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <Accordion
            type="multiple"
            value={openSections}
            onValueChange={setOpenSections}
            className="space-y-0"
          >
            {SECTION_ORDER.map((sectionKey) => {
              const items = sectionKey ? bySection.get(sectionKey) : undefined;
              if (!items?.length) return null;
              const sectionTitle = sectionKey ? SECTION_TITLES[sectionKey] : null;
              return (
                <AccordionItem
                  key={sectionKey ?? "__none"}
                  value={sectionKey!}
                  className="border-0 first:mt-0 mt-1"
                >
                  <AccordionTrigger
                    className={cn(
                      "px-3 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider text-vivant-navy",
                      "hover:bg-vivant-navy/10 hover:text-vivant-navy hover:no-underline",
                      "data-[state=open]:bg-vivant-navy/5 data-[state=open]:text-vivant-navy"
                    )}
                  >
                    {sectionTitle}
                  </AccordionTrigger>
                  <AccordionContent className="overflow-hidden pb-1 pt-0">
                    <div className="space-y-0.5 pl-1">
                      {items.map((item) => {
                        const isActive =
                          pathname === item.href || pathname.startsWith(item.href + "/");
                        const Icon = ICON_MAP[item.iconKey] ?? HelpCircle;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg py-2.5 pl-3 pr-2 transition-colors text-base",
                              isActive
                                ? "bg-vivant-navy text-white"
                                : "text-vivant-navy hover:bg-vivant-navy/10"
                            )}
                          >
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          {bySection.get("__none")?.length ? (
            <div className="mt-4 pt-2 border-t border-gray-100">
              <div className="space-y-0.5">
                {bySection.get("__none")!.map((item) => {
                  const isActive =
                    pathname === item.href || pathname.startsWith(item.href + "/");
                  const Icon = ICON_MAP[item.iconKey] ?? HelpCircle;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-base",
                        isActive
                          ? "bg-vivant-navy text-white"
                          : "text-vivant-navy hover:bg-vivant-navy/10"
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
        </nav>
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-vivant-navy text-white flex items-center justify-center font-bold flex-shrink-0">
              {userDisplay.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-vivant-navy truncate">
                {userDisplay.name}
              </p>
              <p className="text-xs text-vivant-navy/70 truncate">
                {userDisplay.roleLabel}
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-vivant-navy font-serif">
              {title}
            </h1>
            <p className="text-xs text-gray-500">
              Bem-vindo, {userDisplay.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto min-h-0">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
