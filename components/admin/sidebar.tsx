"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, MapPin, Users, Shield, Key, HelpCircle, LayoutDashboard, Activity, CheckSquare, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    role?: string;
    image?: string;
    permissions?: string[];
    roleKey?: string | null;
  };
}

function canAccess(user: AdminSidebarProps["user"], permission?: string) {
  if (user.roleKey === "OWNER" || user.roleKey === "SUPER_ADMIN") return true;
  if (!permission) return true;
  return (user.permissions ?? []).includes(permission);
}

const navigation = [
  { name: "Visão do Dono", href: "/admin/overview", icon: LayoutDashboard },
  { name: "Eventos", href: "/admin/events", icon: Activity, permission: "events.view" as const },
  { name: "Tarefas", href: "/admin/tasks", icon: CheckSquare, permission: "tasks.view" as const },
  { name: "Funis / CRM", href: "/admin/crm", icon: GitBranch, permission: "crm.manage" as const },
  { name: "Casas", href: "/admin/casas", icon: Building2 },
  { name: "Destinos", href: "/admin/destinos", icon: MapPin },
  { name: "Usuários", href: "/admin/usuarios", icon: Users, permission: "users.manage" as const },
  { name: "Roles", href: "/admin/roles", icon: Shield, permission: "roles.manage" as const },
  { name: "Permissões", href: "/admin/permissions", icon: Key, permission: "permissions.manage" as const },
  { name: "Ajuda", href: "/admin/help", icon: HelpCircle, permission: "help.manage" as const },
];

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col font-sans">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 flex-shrink-0">
        <img src="/logo-vivant.png" alt="Vivant" className="h-10" />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const itemPermission = "permission" in item ? item.permission : undefined;
          if (itemPermission && !canAccess(user, itemPermission)) return null;
          
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-vivant-navy text-white"
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
          <div className="w-10 h-10 rounded-full bg-vivant-navy text-white flex items-center justify-center font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.role ?? user.roleKey ?? "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
