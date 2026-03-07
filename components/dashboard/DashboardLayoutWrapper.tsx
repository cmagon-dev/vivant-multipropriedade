"use client";

import { usePathname } from "next/navigation";

type BrandConfig = { name: string; description: string };

/**
 * Para /dashboard/comercial* não mostra o header do (dashboard), pois o AppShell do comercial já fornece o shell completo.
 * Demais rotas do (dashboard) continuam com o header da marca.
 */
export function DashboardLayoutWrapper({
  children,
  brandConfig,
}: {
  children: React.ReactNode;
  brandConfig: BrandConfig;
}) {
  const pathname = usePathname();
  const isComercial = pathname?.startsWith("/dashboard/comercial");

  if (isComercial) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-vivant-navy font-serif">
            {brandConfig.name}
          </h1>
          <p className="text-sm text-slate-600">
            {brandConfig.description.split(".")[0]}
          </p>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
