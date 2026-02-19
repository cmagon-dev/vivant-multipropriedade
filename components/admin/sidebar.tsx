"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Building2, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Casas", href: "/admin/casas", icon: Building2 },
  { name: "Destinos", href: "/admin/destinos", icon: MapPin },
  { name: "Usuários", href: "/admin/usuarios", icon: Users, adminOnly: true },
];

interface AdminSidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
    image?: string;
  };
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <img src="/logo-vivant.png" alt="Vivant" className="h-10" />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          if (item.adminOnly && user.role !== "ADMIN") return null;
          
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
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-vivant-navy text-white flex items-center justify-center font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user.role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
