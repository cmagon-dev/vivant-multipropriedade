"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard/marketplace/minhas-ofertas", label: "Minhas ofertas" },
  { href: "/dashboard/marketplace/oportunidades", label: "Oportunidades" },
  { href: "/dashboard/marketplace/negociacoes", label: "Minhas negociações" },
] as const;

export function MarketplaceSubnav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 mb-6">
      {LINKS.map((l) => {
        const active = pathname === l.href || pathname.startsWith(l.href + "/");
        return (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition",
              active
                ? "bg-emerald-500 text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
