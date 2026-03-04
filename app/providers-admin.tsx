"use client";

import { SessionProvider } from "next-auth/react";

export function AdminProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth-admin">
      {children}
    </SessionProvider>
  );
}
