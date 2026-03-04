"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useSession, signOut } from "next-auth/react";
import { PropertySelector } from "./property-selector";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { data: session } = useSession();
  const notificationsCount = 3;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-3">
            <img 
              src="/logo-vivant-care.png" 
              alt="Vivant Care" 
              className="h-8 w-auto lg:hidden"
            />
            <h1 className="text-lg font-semibold text-[#1A2F4B] hidden sm:block">
              Portal do Cotista
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <PropertySelector />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {notificationsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {notificationsCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start p-3">
                <p className="font-medium text-sm">Nova cobrança disponível</p>
                <p className="text-xs text-slate-600">Condomínio - Vencimento 05/03</p>
                <p className="text-xs text-slate-400 mt-1">Há 2 horas</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3">
                <p className="font-medium text-sm">Assembleia agendada</p>
                <p className="text-xs text-slate-600">15/03 às 19h - Votação online</p>
                <p className="text-xs text-slate-400 mt-1">Há 1 dia</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start p-3">
                <p className="font-medium text-sm">Confirme sua semana</p>
                <p className="text-xs text-slate-600">Semana 12 (20-27/03)</p>
                <p className="text-xs text-slate-400 mt-1">Há 3 dias</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center text-vivant-green">
                Ver todas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-vivant-green/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-vivant-green">
                    {session?.user?.name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <span className="hidden sm:inline text-sm font-medium text-[#1A2F4B]">
                  {session?.user?.name}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/perfil">Meu Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/configuracoes">Configurações</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 cursor-pointer"
                onClick={() => {
                  signOut({ callbackUrl: "/portal-cotista" });
                }}
              >
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
