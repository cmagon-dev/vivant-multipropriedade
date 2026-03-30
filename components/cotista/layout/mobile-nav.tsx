"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Menu,
  Building2,
  Bell,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signOutAndGoToLogin } from "@/lib/auth/signOutClient";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import {
  COTISTA_NAV_ITEMS,
  isCotistaNavItemActive,
} from "@/components/cotista/layout/cotista-nav-config";

const mainItems = [
  { href: "/dashboard", label: "Início", icon: LayoutDashboard },
  { href: "/dashboard/propriedades", label: "Minhas propriedades", icon: Building2 },
  { href: "/dashboard/calendario", label: "Calendário", icon: Calendar },
  { href: "/dashboard/financeiro", label: "Financeiro", icon: DollarSign },
  { href: "/dashboard/avisos", label: "Avisos", icon: Bell },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 shadow-lg">
        <div className="flex items-center justify-around h-16 px-2">
          {mainItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all flex-1 ${
                  isActive
                    ? "text-vivant-green"
                    : "text-[#1A2F4B]/60"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "scale-110" : ""} transition-transform`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
          
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all flex-1 text-[#1A2F4B]/60">
                <Menu className="w-5 h-5" />
                <span className="text-xs font-medium">Mais</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[400px]">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left">
                  <img 
                    src="/logo-vivant-care.png" 
                    alt="Vivant Care" 
                    className="h-12 w-auto"
                  />
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex flex-col space-y-1">
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
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => void signOutAndGoToLogin()}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sair</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
      
      <div className="lg:hidden h-16" />
    </>
  );
}
