"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, DollarSign, Mail, Settings, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin-portal", icon: Home },
  { name: "Propriedades", href: "/admin-portal/propriedades", icon: Building2 },
  { name: "Cotistas", href: "/admin-portal/cotistas", icon: Users },
  { name: "Financeiro", href: "/admin-portal/financeiro", icon: DollarSign },
  { name: "Convites Pendentes", href: "/admin-portal/convites-pendentes", icon: Mail },
  { name: "Configurações", href: "/admin-portal/configuracoes", icon: Settings },
];

interface AdminPortalSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
    image?: string | null;
  };
}

export function AdminPortalSidebar({ user }: AdminPortalSidebarProps) {
  const pathname = usePathname();
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col font-sans">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex flex-col">
          <img src="/logo-vivant-care.png" alt="Vivant Care" className="h-8" />
          <span className="text-xs text-vivant-green font-semibold mt-1">Portal do Cotista</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin-portal" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-vivant-green text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* User Info */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-vivant-green text-white flex items-center justify-center font-bold">
            {user.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              Administrador Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
