"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  LayoutDashboard,
  LayoutGrid,
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
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SECTION_TITLES, SECTION_ORDER } from "@/lib/navigation/menu";
import type { ShellMenuItem } from "@/lib/navigation/menu";
import { SignOutButton } from "@/components/shell/SignOutButton";

export type AppShellMenuItem = ShellMenuItem;

type PanelArea = {
  key: "vivant" | "vivantcare" | "partners" | "capital";
  label: string;
  href: string;
  logoSrc: string;
  isMatch: (pathname: string) => boolean;
};

const PANEL_AREAS: PanelArea[] = [
  {
    key: "vivant",
    label: "Vivant",
    href: "/admin/overview",
    logoSrc: "/logo-vivant.png",
    isMatch: (pathname) => pathname.startsWith("/admin") && !pathname.startsWith("/admin/vivant-care") && !pathname.startsWith("/admin/capital"),
  },
  {
    key: "vivantcare",
    label: "Vivant Care",
    href: "/admin/vivant-care",
    logoSrc: "/logo-vivant-care.png",
    isMatch: (pathname) => pathname.startsWith("/admin/vivant-care"),
  },
  {
    key: "partners",
    label: "Vivant Partners",
    href: "/dashboard/comercial",
    logoSrc: "/logo-vivant-partners.png",
    isMatch: (pathname) => pathname.startsWith("/dashboard/comercial"),
  },
  {
    key: "capital",
    label: "Vivant Capital",
    href: "/admin/capital",
    logoSrc: "/logo-vivant-capital.png",
    isMatch: (pathname) => pathname.startsWith("/admin/capital"),
  },
];

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  LayoutGrid,
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

/** Evita marcar o item "raiz" ativo em todas as subrotas (ex.: /dashboard vs /dashboard/calendario). */
function isNavActive(pathname: string, href: string): boolean {
  const p = pathname.endsWith("/") && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const h = href.endsWith("/") && href.length > 1 ? href.slice(0, -1) : href;
  if (p === h) return true;
  const exactRoots = ["/dashboard", "/dashboard/comercial", "/admin/vivant-care"];
  if (exactRoots.includes(h)) return false;
  return p.startsWith(h + "/");
}

function navItemMatchesPath(pathname: string, item: AppShellMenuItem): boolean {
  if (isNavActive(pathname, item.href)) return true;
  return item.subItems?.some((c) => isNavActive(pathname, c.href)) ?? false;
}

function getSectionContainingPathname(
  pathname: string,
  bySection: Map<string | undefined, AppShellMenuItem[]>
): string | null {
  for (const sectionKey of SECTION_ORDER) {
    if (!sectionKey) continue;
    const items = bySection.get(sectionKey) ?? [];
    if (items.some((item) => navItemMatchesPath(pathname, item))) return sectionKey;
  }
  return null;
}

/** Item com children: pai só expande/colapsa; links ficam nos filhos. */
function SidebarExpandableNavGroup({
  item,
  pathname,
  isVivantCare,
  navClassName,
}: {
  item: AppShellMenuItem;
  pathname: string;
  isVivantCare: boolean;
  /** Classes extras no wrapper (ex.: px do bloco __none) */
  navClassName?: string;
}) {
  const subItems = item.subItems ?? [];
  const Icon = ICON_MAP[item.iconKey] ?? HelpCircle;
  const prevPathname = useRef(pathname);
  const [open, setOpen] = useState(() => navItemMatchesPath(pathname, item));

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      if (navItemMatchesPath(pathname, item)) setOpen(true);
    }
  }, [pathname, item]);

  const submenuHasActive = subItems.some((c) => isNavActive(pathname, c.href));

  const toggle = () => setOpen((o) => !o);

  return (
    <div className={cn(isVivantCare ? "space-y-1.5" : "space-y-0.5")}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg text-left font-medium transition-colors",
          navClassName ?? "px-4 py-3 text-sm",
          submenuHasActive
            ? isVivantCare
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
              : "bg-vivant-navy text-white"
            : isVivantCare
              ? "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              : "text-vivant-navy hover:bg-vivant-navy/10"
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 flex-shrink-0",
            !submenuHasActive && isVivantCare && "text-slate-500"
          )}
        />
        <span className="flex-1 min-w-0">{item.name}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 flex-shrink-0 transition-transform duration-200",
            open && "rotate-180",
            submenuHasActive ? "text-white" : isVivantCare && "text-slate-400"
          )}
          aria-hidden
        />
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
          <div className="flex min-h-0 flex-col overflow-hidden">
          <div className="flex flex-col gap-0.5 pb-0.5">
            {subItems.map((child) => {
              const childActive = isNavActive(pathname, child.href);
              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={cn(
                    "flex items-center rounded-lg py-2 text-sm font-medium transition-colors",
                    navClassName
                      ? "pl-11 pr-3"
                      : "pl-11 pr-4",
                    childActive
                      ? isVivantCare
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                        : "bg-vivant-navy text-white"
                      : isVivantCare
                        ? "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        : "text-vivant-navy hover:bg-vivant-navy/10"
                  )}
                >
                  {child.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  menuItems,
  userDisplay,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const hasCapitalAccess = useMemo(
    () => menuItems.some((item) => item.href.startsWith("/admin/capital")),
    [menuItems]
  );
  const bySection = useMemo(() => groupItemsBySection(menuItems), [menuItems]);
  const [sidebarMode, setSidebarMode] = useState<"vivant" | "vivantcare" | "capital">(
    pathname.startsWith("/admin/vivant-care")
      ? "vivantcare"
      : pathname.startsWith("/admin/capital")
        ? "capital"
        : "vivant"
  );
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const [hiddenLogos, setHiddenLogos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (pathname.startsWith("/admin/vivant-care")) {
      setSidebarMode("vivantcare");
    } else if (pathname.startsWith("/admin/capital")) {
      setSidebarMode("capital");
    } else if (pathname.startsWith("/admin")) {
      setSidebarMode("vivant");
    }
  }, [pathname]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!contextMenuRef.current) return;
      if (!contextMenuRef.current.contains(event.target as Node)) {
        setContextMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const initialOpenSections = useMemo(() => {
    const active = getSectionContainingPathname(pathname, bySection);
    return active ? [active] : [];
  }, [pathname, bySection]);

  const [openSections, setOpenSections] = useState<string[]>(initialOpenSections);

  useEffect(() => {
    if (sidebarMode === "vivantcare") {
      setOpenSections(["vivantcare"]);
    } else if (sidebarMode === "capital") {
      setOpenSections(["capital"]);
    }
  }, [sidebarMode]);

  useEffect(() => {
    const active = getSectionContainingPathname(pathname, bySection);
    if (active) {
      if (sidebarMode === "vivantcare") {
        setOpenSections(["vivantcare"]);
      } else if (sidebarMode === "capital") {
        setOpenSections(["capital"]);
      } else {
        setOpenSections((prev) => (prev.includes(active) ? prev : [...prev, active]));
      }
    }
  }, [pathname, bySection, sidebarMode]);

  const preferredSections =
    sidebarMode === "vivantcare"
      ? (["vivantcare"] as const)
      : sidebarMode === "capital"
        ? (["capital"] as const)
      : SECTION_ORDER.filter((section) => section !== "vivantcare" && section !== "capital");

  const hasPreferredSections = preferredSections.some((sectionKey) => {
    const items = sectionKey ? bySection.get(sectionKey) : undefined;
    return !!items?.length;
  });

  const visibleSections = hasPreferredSections ? preferredSections : SECTION_ORDER;
  const availableAreas = useMemo(
    () => PANEL_AREAS.filter((area) => area.key !== "capital" || hasCapitalAccess),
    [hasCapitalAccess]
  );
  const activeArea = availableAreas.find((area) => area.isMatch(pathname)) ?? availableAreas[0];

  const onLogoError = (logoSrc: string) => {
    setHiddenLogos((prev) => ({ ...prev, [logoSrc]: true }));
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 font-sans min-h-screen sticky top-0 self-start">
        <div
          ref={contextMenuRef}
          className="h-16 flex items-center px-4 border-b border-gray-200 flex-shrink-0 relative"
        >
          <button
            type="button"
            onClick={() => setContextMenuOpen((v) => !v)}
            className={cn(
              "w-full flex items-center justify-between rounded-md px-2 py-1.5 transition-colors",
              activeArea.key === "vivantcare"
                ? "border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-50"
                : "hover:bg-gray-50"
            )}
            aria-label="Selecionar sidebar"
          >
            {!hiddenLogos[activeArea.logoSrc] ? (
              <img
                src={activeArea.logoSrc}
                alt={activeArea.label}
                className={cn(
                  "mx-auto object-contain object-center",
                  activeArea.key === "vivant" ? "h-[1.85rem] w-[162px]" : "h-10 w-[190px]"
                )}
                onError={() => onLogoError(activeArea.logoSrc)}
              />
            ) : (
              <div className="text-sm font-semibold text-vivant-navy uppercase tracking-wide">
                {activeArea.label}
              </div>
            )}
            <ChevronDown className={cn("h-4 w-4 text-gray-500 transition-transform", contextMenuOpen && "rotate-180")} />
          </button>
          {contextMenuOpen && (
            <div className="absolute top-16 left-4 right-4 z-20 rounded-xl border border-gray-200 bg-white shadow-lg p-2.5 space-y-2">
              {availableAreas.map((area) => {
                const active = area.key === activeArea.key;
                const isDisabled = area.key === "partners";
                return (
                  isDisabled ? (
                    <button
                      key={area.key}
                      type="button"
                      disabled
                      className={cn(
                        "flex min-h-[52px] w-full items-center justify-center rounded-lg border px-2 py-2 transition-colors cursor-not-allowed opacity-55",
                        "border-gray-200 bg-gray-50"
                      )}
                      title="Em breve"
                    >
                      {!hiddenLogos[area.logoSrc] ? (
                        <img
                          src={area.logoSrc}
                          alt={area.label}
                          className={cn(
                            "mx-auto object-contain object-center",
                            area.key === "vivant" ? "h-[1.85rem] w-[162px]" : "h-10 w-[190px]"
                          )}
                          onError={() => onLogoError(area.logoSrc)}
                        />
                      ) : (
                        <span className="text-center text-xs font-semibold uppercase tracking-wide text-vivant-navy">
                          {area.label}
                        </span>
                      )}
                    </button>
                  ) : (
                    <Link
                      key={area.key}
                      href={area.href}
                      onClick={() => {
                        setSidebarMode(
                          area.key === "vivantcare"
                            ? "vivantcare"
                            : area.key === "capital"
                              ? "capital"
                              : "vivant"
                        );
                        setContextMenuOpen(false);
                      }}
                      className={cn(
                        "flex min-h-[52px] items-center justify-center rounded-lg border px-2 py-2 transition-colors",
                        active
                          ? area.key === "vivantcare"
                            ? "border-emerald-300 bg-emerald-50/60 shadow-sm"
                            : "border-vivant-navy bg-vivant-navy/5 shadow-sm"
                          : "border-gray-200 hover:bg-gray-50"
                      )}
                    >
                      {!hiddenLogos[area.logoSrc] ? (
                        <img
                          src={area.logoSrc}
                          alt={area.label}
                          className={cn(
                            "mx-auto object-contain object-center",
                            area.key === "vivant" ? "h-[1.85rem] w-[162px]" : "h-10 w-[190px]"
                          )}
                          onError={() => onLogoError(area.logoSrc)}
                        />
                      ) : (
                        <span className="text-center text-xs font-semibold uppercase tracking-wide text-vivant-navy">
                          {area.label}
                        </span>
                      )}
                    </Link>
                  )
                );
              })}
            </div>
          )}
        </div>
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <Accordion
            type="multiple"
            value={openSections}
            onValueChange={(value) => {
              if (sidebarMode === "vivantcare") {
                setOpenSections(["vivantcare"]);
                return;
              }
              setOpenSections(value);
            }}
            className="space-y-0"
          >
            {visibleSections.map((sectionKey) => {
              const items = sectionKey ? bySection.get(sectionKey) : undefined;
              if (!items?.length) return null;
              const sectionTitle = sectionKey ? SECTION_TITLES[sectionKey] : null;
              const hideSectionTitle = sidebarMode === "vivantcare" && sectionKey === "vivantcare";
              return (
                <AccordionItem
                  key={sectionKey ?? "__none"}
                  value={sectionKey!}
                  className="border-0 first:mt-0 mt-1"
                >
                  {!hideSectionTitle ? (
                    <AccordionTrigger
                      className={cn(
                        "px-3 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider text-vivant-navy",
                        "hover:bg-vivant-navy/10 hover:text-vivant-navy hover:no-underline",
                        "data-[state=open]:bg-vivant-navy/5 data-[state=open]:text-vivant-navy",
                        sectionKey === "vivantcare" &&
                          "bg-emerald-500 text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-600 hover:text-white data-[state=open]:bg-emerald-600 data-[state=open]:text-white"
                      )}
                    >
                      {sectionTitle}
                    </AccordionTrigger>
                  ) : null}
                  <AccordionContent className="overflow-hidden pb-1 pt-0">
                    <div
                      className={cn(
                        hideSectionTitle ? "pt-1" : "pl-1",
                        sectionKey === "vivantcare" ? "space-y-2" : "space-y-0.5"
                      )}
                    >
                      {items.map((item) => {
                        const isVivantCare = sectionKey === "vivantcare";
                        if (item.subItems?.length) {
                          return (
                            <SidebarExpandableNavGroup
                              key={item.href}
                              item={item}
                              pathname={pathname}
                              isVivantCare={isVivantCare}
                            />
                          );
                        }
                        const Icon = ICON_MAP[item.iconKey] ?? HelpCircle;
                        const isActive = isNavActive(pathname, item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                              isActive
                                ? isVivantCare
                                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                                  : "bg-vivant-navy text-white"
                                : isVivantCare
                                  ? "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                  : "text-vivant-navy hover:bg-vivant-navy/10"
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-5 w-5 flex-shrink-0",
                                !isActive && isVivantCare && "text-slate-500"
                              )}
                            />
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
          {sidebarMode !== "vivantcare" && bySection.get("__none")?.length ? (
            <div className="mt-4 pt-2 border-t border-gray-100">
              <div className="space-y-0.5">
                {bySection.get("__none")!.map((item) => {
                  if (item.subItems?.length) {
                    return (
                      <SidebarExpandableNavGroup
                        key={item.href}
                        item={item}
                        pathname={pathname}
                        isVivantCare={false}
                        navClassName="px-3 py-2.5 text-base"
                      />
                    );
                  }
                  const Icon = ICON_MAP[item.iconKey] ?? HelpCircle;
                  const isActive = isNavActive(pathname, item.href);
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

      <div className="flex-1 flex flex-col min-w-0 self-start min-h-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-vivant-navy font-sans">
              {title}
            </h1>
            <p className="text-xs text-gray-500">
              Bem-vindo, {userDisplay.name}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SignOutButton variant="outline" size="sm" />
          </div>
        </header>

        <main className="flex-1 py-6">
          <div className="max-w-7xl mx-auto px-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
