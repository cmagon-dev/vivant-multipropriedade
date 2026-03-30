"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { signOutAndGoToLogin } from "@/lib/auth/signOutClient";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  COTISTA_NAV_ITEMS,
  isCotistaNavItemActive,
} from "@/components/cotista/layout/cotista-nav-config";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-slate-200 font-sans transition-all duration-300 ${
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

      <nav className="flex-1 p-4 space-y-2">
        {COTISTA_NAV_ITEMS.map((item) => {
          const isActive = isCotistaNavItemActive(pathname, item);
          const Icon = item.icon;

          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`h-5 w-5 flex-shrink-0 ${isActive ? "" : "text-slate-500"}`}
              />
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
          onClick={() => void signOutAndGoToLogin()}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Sair</span>}
        </Button>
      </div>
    </aside>
  );
}
