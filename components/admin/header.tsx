"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut, ExternalLink } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  user: {
    name: string;
    role: string;
  };
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
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
          asChild
        >
          <Link href="/" target="_blank">
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Site
          </Link>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair
        </Button>
      </div>
    </header>
  );
}
