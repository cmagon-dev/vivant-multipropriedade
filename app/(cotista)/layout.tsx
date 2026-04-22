"use client";

import { Sidebar } from "@/components/cotista/layout/sidebar";
import { Header } from "@/components/cotista/layout/header";
import { MobileNav } from "@/components/cotista/layout/mobile-nav";
import { CotistaProvider } from "@/app/providers-cotista";

export default function CotistaLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <CotistaProvider>
      <div className="min-h-screen bg-[#F8F9FA] flex">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header />

          <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6">{children}</main>
        </div>

        <MobileNav />
      </div>
    </CotistaProvider>
  );
}
