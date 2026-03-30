import type { Session } from "next-auth";

export type SessionLike = {
  user?: {
    id?: string;
    userType?: "admin" | "cotista";
    defaultRoute?: string | null;
    roleKey?: string | null;
  };
};

/**
 * Define a rota de redirecionamento pós-login (CORE definitivo).
 * OWNER/SUPER_ADMIN -> /admin/overview (sempre em /admin, nunca /dashboard)
 * COMMERCIAL -> /dashboard/comercial
 * COTISTA -> /cotista
 * STAFF/ADMIN -> /dashboard
 * Se user.defaultRoute estiver definido no banco, usa ele.
 */
export function getPostLoginRedirectRoute(session: SessionLike | null): string {
  if (!session?.user) return "/login";

  const { userType, defaultRoute, roleKey } = session.user;

  if (defaultRoute && defaultRoute.startsWith("/")) {
    return defaultRoute;
  }

  if (userType === "cotista") {
    return "/cotista";
  }

  if (roleKey === "INVESTOR") {
    return "/capital/dashboard";
  }

  const role = roleKey ?? "STAFF";
  switch (role) {
    case "OWNER":
    case "SUPER_ADMIN":
      return "/admin/overview";
    case "COMMERCIAL":
      return "/dashboard/comercial";
    case "COTISTA":
      /** User admin com role COTISTA: mesmo portal em /dashboard (evita /cotista bloqueado para userType admin no middleware) */
      return userType === "admin" ? "/dashboard" : "/cotista";
    case "STAFF":
    case "ADMIN":
    default:
      return "/dashboard";
  }
}
