import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type UserContext = {
  userId: string;
  role: string;
  permissions: string[];
  homeRoute: string;
  displayName: string;
  userType: "admin" | "cotista";
  email?: string;
  defaultRoute?: string | null;
};

/**
 * Retorna o contexto do usuário logado (server-side).
 * Use em Server Components ou API routes.
 */
export async function getUserContext(): Promise<UserContext | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = session.user as {
    id: string;
    name?: string;
    email?: string;
    userType?: "admin" | "cotista";
    roleKey?: string | null;
    permissions?: string[];
    defaultRoute?: string | null;
  };

  const role = user.roleKey ?? (user.userType === "cotista" ? "COTISTA" : "STAFF");
  const permissions = user.permissions ?? [];
  const homeRoute = getHomeRouteFromContext({
    role,
    userType: user.userType ?? "admin",
    defaultRoute: user.defaultRoute,
  });
  const displayName = user.name ?? user.email ?? "Usuário";

  return {
    userId: user.id,
    role,
    permissions,
    homeRoute,
    displayName,
    userType: user.userType ?? "admin",
    email: user.email,
    defaultRoute: user.defaultRoute,
  };
}

function getHomeRouteFromContext({
  role,
  userType,
  defaultRoute,
}: {
  role: string;
  userType: string;
  defaultRoute?: string | null;
}): string {
  if (defaultRoute && defaultRoute.startsWith("/")) return defaultRoute;
  if (userType === "cotista") return "/cotista";
  switch (role) {
    case "OWNER":
    case "SUPER_ADMIN":
      return "/admin/overview";
    case "COMMERCIAL":
      return "/dashboard/comercial";
    case "COTISTA":
      return "/cotista";
    case "STAFF":
    case "ADMIN":
      return "/dashboard";
    default:
      return "/dashboard";
  }
}
