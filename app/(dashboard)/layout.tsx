"use client";

import { CotistaProvider } from "@/app/providers-cotista";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <CotistaProvider>
      {children}
    </CotistaProvider>
  );
}
