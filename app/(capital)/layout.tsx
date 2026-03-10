"use client";

import { SessionProvider } from "next-auth/react";
import { CapitalSidebar } from "@/components/capital/sidebar";
import { CapitalHeader } from "@/components/capital/header";

export default function CapitalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#F8F9FA] flex">
        <CapitalSidebar />
        <div className="flex-1 flex flex-col">
          <CapitalHeader />
          <main className="flex-1 p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </SessionProvider>
  );
}
