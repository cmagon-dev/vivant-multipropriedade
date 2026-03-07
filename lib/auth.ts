import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { DEFAULT_ROLE_PERMISSIONS } from "@/lib/auth/permissionCatalog";

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
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.active) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
          userType: "admin",
          defaultRoute: (user as { defaultRoute?: string | null }).defaultRoute ?? null,
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
          phone: cotista.phone ?? undefined,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      const uid = (user?.id ?? token.id) as string | undefined;
      const isAdmin = (user ?? token) && ((user as any)?.userType ?? (token as any).userType) === "admin";

      const refreshAdminToken = async () => {
        if (!uid || !isAdmin) return;
        try {
          const assignment = await prisma.userRoleAssignment.findFirst({
            where: { userId: uid },
            include: {
              role: { include: { rolePermissions: { include: { permission: true } } } },
            },
          }).catch(() => null);
          const overrides = await prisma.userPermission.findMany({
            where: { userId: uid },
            include: { permission: true },
          }).catch(() => []);
          const legacyRole = (token as any).role ?? "EDITOR";
          const roleKey = assignment?.role?.key ?? (legacyRole === "ADMIN" ? "ADMIN" : "STAFF");
          token.roleKey = roleKey;
          const fromRole = new Set(assignment?.role?.rolePermissions?.map((rp: { permission: { key: string } }) => rp.permission.key) ?? []);
          if (fromRole.size === 0 && legacyRole === "ADMIN") {
            const allPerms = await prisma.permission.findMany({ select: { key: true } }).catch(() => []);
            allPerms.forEach((p) => fromRole.add(p.key));
          }
          if (fromRole.size === 0 && roleKey && roleKey !== "OWNER" && roleKey !== "SUPER_ADMIN") {
            const defaultPerms = DEFAULT_ROLE_PERMISSIONS[roleKey];
            if (defaultPerms && !defaultPerms.includes("*")) defaultPerms.forEach((k) => fromRole.add(k));
          }
          const fromOverrides = overrides.filter((o: { granted: boolean }) => o.granted).map((o: { permission: { key: string } }) => o.permission.key);
          const permSet = new Set([...Array.from(fromRole), ...fromOverrides]);
          overrides.filter((o: { granted: boolean }) => !o.granted).forEach((o: { permission: { key: string } }) => permSet.delete(o.permission.key));
          token.permissions = Array.from(permSet);
        } catch {
          if (user) {
            (token as any).roleKey = "OWNER";
            token.permissions = ["admin.view", "dashboard.view"];
          }
        }
      };

      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.userType = (user as any).userType || "admin";
        token.cpf = (user as any).cpf;
        token.phone = (user as any).phone;
        token.defaultRoute = (user as any).defaultRoute ?? null;
        if ((user as any).userType === "admin") await refreshAdminToken();
      } else if (uid && isAdmin) {
        // A cada requisição: atualiza role e permissões do token a partir do banco
        // (para que alterações feitas pelo admin na role do usuário passem a valer sem novo login)
        await refreshAdminToken();
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        (session.user as any).userType = token.userType ?? "admin";
        (session.user as any).cpf = token.cpf;
        (session.user as any).phone = token.phone;
        (session.user as any).defaultRoute = token.defaultRoute ?? null;
        (session.user as any).roleKey = token.roleKey ?? "ADMIN";
        (session.user as any).permissions = Array.isArray(token.permissions) ? token.permissions : [];
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
