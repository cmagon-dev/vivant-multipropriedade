"use client";

import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
  /** basePath explícito: evita __NEXTAUTH.basePath errado e signOut apontando para rota errada */
  return (
    <SessionProvider basePath="/api/auth">
      {children}
    </SessionProvider>
  );
}
