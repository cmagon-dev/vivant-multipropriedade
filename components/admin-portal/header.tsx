"use client";

import { Bell, LogOut, User, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminPortalHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AdminPortalHeader({ user }: AdminPortalHeaderProps) {
  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold text-vivant-navy">Gestão do Portal do Cotista</h1>
        <p className="text-sm text-gray-500">Administração de cotistas e cobranças</p>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Notificações */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-vivant-green rounded-full"></span>
        </Button>
        
        {/* Menu do Usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">
              <div className="w-8 h-8 rounded-full bg-vivant-green text-white flex items-center justify-center font-bold text-sm">
                {user.name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name || "Admin"}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="w-4 h-4 mr-2" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
