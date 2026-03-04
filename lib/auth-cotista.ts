import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptionsCotista: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/portal-cotista",
  },
  cookies: {
    sessionToken: {
      name: `vivant.cotista.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  providers: [
    CredentialsProvider({
      id: "cotista-credentials",
      name: "Cotista Login",
      credentials: {
        email: { label: "Email ou CPF", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

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

        if (!cotista || !cotista.active) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          cotista.password
        );

        if (!isPasswordValid) {
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.userType = "cotista";
        token.cpf = (user as any).cpf;
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).userType = "cotista";
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
