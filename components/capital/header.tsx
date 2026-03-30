"use client";

import { useSession } from "next-auth/react";
import { signOutAndGoToLogin } from "@/lib/auth/signOutClient";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function CapitalHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6">
        <h1 className="text-lg font-semibold text-vivant-navy">Portal do Investidor</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 truncate max-w-[140px] sm:max-w-[200px]">
            {session?.user?.name ?? session?.user?.email ?? "Investidor"}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void signOutAndGoToLogin()}
            className="shrink-0"
          >
            <LogOut className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
