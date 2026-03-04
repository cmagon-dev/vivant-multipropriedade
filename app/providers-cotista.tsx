"use client";

import { SessionProvider } from "next-auth/react";

export function CotistaProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath="/api/auth-cotista">
      {children}
    </SessionProvider>
  );
}
