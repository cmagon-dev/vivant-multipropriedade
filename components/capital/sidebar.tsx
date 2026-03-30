"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PieChart, DollarSign, FileText, Send, LogOut } from "lucide-react";
import { signOutAndGoToLogin } from "@/lib/auth/signOutClient";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/capital/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/capital/portfolio", label: "Portfólio", icon: PieChart },
  { href: "/capital/rendimentos", label: "Rendimentos", icon: DollarSign },
  { href: "/capital/documentos", label: "Documentos", icon: FileText },
  { href: "/capital/solicitacoes", label: "Solicitações", icon: Send },
];

export function CapitalSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 font-sans">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-vivant-navy">Vivant Capital</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/capital/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? "bg-vivant-navy/10 text-vivant-navy" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200">
        <Button variant="ghost" size="sm" className="w-full justify-start text-gray-600" onClick={() => void signOutAndGoToLogin()}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
