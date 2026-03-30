"use client";

import { signOutAndGoToLogin } from "@/lib/auth/signOutClient";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  user: {
    name: string;
    role?: string;
    roleKey?: string | null;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-xl font-bold text-vivant-navy">
          Painel Administrativo
        </h1>
        <p className="text-xs text-gray-500">
          Bem-vindo, {user.name}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => void signOutAndGoToLogin()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </header>
  );
}
