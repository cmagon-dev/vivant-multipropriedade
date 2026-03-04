import NextAuth from "next-auth";
import { authOptionsCotista } from "@/lib/auth-cotista";

const handler = NextAuth(authOptionsCotista);

export { handler as GET, handler as POST };

export const runtime = 'nodejs';
