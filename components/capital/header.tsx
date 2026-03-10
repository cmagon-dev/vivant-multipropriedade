"use client";

import { useSession } from "next-auth/react";

export function CapitalHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6">
        <h1 className="text-lg font-semibold text-vivant-navy">Portal do Investidor</h1>
        <div className="text-sm text-gray-600">
          {session?.user?.name ?? session?.user?.email ?? "Investidor"}
        </div>
      </div>
    </header>
  );
}
