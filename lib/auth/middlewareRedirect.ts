import type { JWT } from "next-auth/jwt";

/**
 * Lógica de redirect pós-login para uso no middleware (apenas token, sem session).
 */
export function getPostLoginRedirectFromToken(token: JWT | null): string {
  if (!token) return "/login";
  const userType = token.userType as string | undefined;
  const defaultRoute = token.defaultRoute as string | undefined | null;
  const roleKey = token.roleKey as string | undefined | null;

  if (defaultRoute && typeof defaultRoute === "string" && defaultRoute.startsWith("/")) {
    return defaultRoute;
  }
  if (userType === "cotista") return "/cotista";
  if (roleKey === "INVESTOR") return "/capital/dashboard";
  if (userType === "admin") {
    if (roleKey === "OWNER" || roleKey === "SUPER_ADMIN") return "/admin/overview";
    if (roleKey === "COMMERCIAL") return "/dashboard/comercial";
    /** Role COTISTA no User: portal do cotista (/dashboard), não admin */
    if (roleKey === "COTISTA") return "/dashboard";
    if (roleKey === "STAFF" || roleKey === "ADMIN") return "/dashboard";
    return "/admin/overview";
  }
  return "/dashboard";
}
