import NextAuth from "next-auth";
import { authOptionsAdmin } from "@/lib/auth-admin";

const handler = NextAuth(authOptionsAdmin);

export { handler as GET, handler as POST };

// Configuração runtime para Vercel
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
