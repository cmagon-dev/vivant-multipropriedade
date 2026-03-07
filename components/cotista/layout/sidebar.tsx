"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  Bell, 
  Home,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const menuItems = [
  { 
    href: "/dashboard", 
    label: "Dashboard", 
    icon: LayoutDashboard 
  },
  { 
    href: "/dashboard/calendario", 
    label: "Calendário", 
    icon: Calendar 
  },
  { 
    href: "/dashboard/financeiro", 
    label: "Financeiro", 
    icon: DollarSign 
  },
  { 
    href: "/dashboard/assembleias", 
    label: "Assembleias", 
    icon: Users 
  },
  { 
    href: "/dashboard/trocas", 
    label: "Troca de Semanas", 
    icon: Home 
  },
  { 
    href: "/dashboard/documentos", 
    label: "Documentos", 
    icon: FileText 
  },
  { 
    href: "/dashboard/avisos", 
    label: "Avisos", 
    icon: Bell 
  },
  { 
    href: "/dashboard/perfil", 
    label: "Meu Perfil", 
    icon: User 
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={`hidden lg:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <img 
              src="/logo-vivant-care.png" 
              alt="Vivant Care" 
              className="h-10 w-auto"
            />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#1A2F4B]/60 hover:text-[#1A2F4B] transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                isActive
                  ? "bg-vivant-green text-white shadow-md"
                  : "text-[#1A2F4B]/70 hover:bg-slate-50 hover:text-vivant-green"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${
                isActive ? "" : "group-hover:scale-110 transition-transform"
              }`} />
              {!collapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <Button
          variant="ghost"
          className={`w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 ${
            collapsed ? "px-3" : ""
          }`}
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
