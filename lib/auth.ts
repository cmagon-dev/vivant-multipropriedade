import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 [ADMIN AUTH] Tentativa de login:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ [ADMIN AUTH] Credenciais vazias');
          return null;
        }

        console.log('🔍 [ADMIN AUTH] Buscando usuário no banco...');
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          console.log('❌ [ADMIN AUTH] Usuário não encontrado:', credentials.email);
          return null;
        }

        console.log('✅ [ADMIN AUTH] Usuário encontrado:', user.email, 'Role:', user.role, 'Active:', user.active);

        if (!user.active) {
          console.log('❌ [ADMIN AUTH] Usuário INATIVO');
          return null;
        }

        console.log('🔐 [ADMIN AUTH] Verificando senha...');
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        console.log('🔐 [ADMIN AUTH] Senha válida?', isPasswordValid);

        if (!isPasswordValid) {
          console.log('❌ [ADMIN AUTH] Senha incorreta');
          return null;
        }

        console.log('✅ [ADMIN AUTH] Login bem-sucedido!');
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          userType: "admin",
        };
      }
    }),
    CredentialsProvider({
      id: "cotista-credentials",
      name: "Cotista Login",
      credentials: {
        email: { label: "Email ou CPF", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log('🔐 [COTISTA AUTH] Tentativa de login:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ [COTISTA AUTH] Credenciais vazias');
          return null;
        }

        console.log('🔍 [COTISTA AUTH] Buscando cotista no banco...');
        const cotista = await prisma.cotista.findFirst({
          where: {
            OR: [
              { email: credentials.email },
              { cpf: credentials.email.replace(/\D/g, '') }
            ]
          },
          include: {
            cotas: {
              include: {
                property: true
              }
            }
          }
        });

        if (!cotista) {
          console.log('❌ [COTISTA AUTH] Cotista não encontrado:', credentials.email);
          return null;
        }

        console.log('✅ [COTISTA AUTH] Cotista encontrado:', cotista.email, 'Active:', cotista.active);

        if (!cotista.active) {
          console.log('❌ [COTISTA AUTH] Cotista INATIVO');
          return null;
        }

        console.log('🔐 [COTISTA AUTH] Verificando senha...');
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          cotista.password
        );

        console.log('🔐 [COTISTA AUTH] Senha válida?', isPasswordValid);

        if (!isPasswordValid) {
          console.log('❌ [COTISTA AUTH] Senha incorreta');
          return null;
        }

        return {
          id: cotista.id,
          email: cotista.email,
          name: cotista.name,
          image: cotista.avatar,
          userType: "cotista",
          cpf: cotista.cpf,
          phone: cotista.phone || undefined,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.userType = (user as any).userType || "admin";
        token.cpf = (user as any).cpf;
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        (session.user as any).userType = token.userType;
        (session.user as any).cpf = token.cpf;
        (session.user as any).phone = token.phone;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  }
};
