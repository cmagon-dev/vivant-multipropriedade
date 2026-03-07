import type { Session } from "next-auth";
import { getKeysThatGrant, DEFAULT_ROLE_PERMISSIONS } from "./permissionCatalog";

export type SessionWithPermissions = Session & {
  user: Session["user"] & {
    permissions?: string[];
    roleKey?: string | null;
    userType?: "admin" | "cotista";
  };
};

const FULL_ACCESS_ROLES = ["OWNER", "SUPER_ADMIN"];

/**
 * Verifica se o usuário tem a permissão (ou é OWNER/SUPER_ADMIN).
 * Aceita aliases: ex. "comercial.view" é concedida por "crm.view".
 * Se a role for COMMERCIAL/ADMIN/STAFF e o banco não tiver permissões da role, usa o padrão do catálogo.
 * @param session - sessão com permissions e roleKey
 * @param permissionKey - ex: "properties.read", "users.manage", "comercial.view"
 * @param _companyId - opcional para multi-tenant (futuro)
 */
export function hasPermission(
  session: SessionWithPermissions | null,
  permissionKey: string,
  _companyId?: string | null
): boolean {
  if (!session?.user) return false;
  const roleKey = (session.user as { roleKey?: string | null }).roleKey;
  if (roleKey && FULL_ACCESS_ROLES.includes(roleKey)) return true;

  const permissions = (session.user as { permissions?: string[] }).permissions ?? [];
  const keysThatGrant = getKeysThatGrant(permissionKey);
  if (keysThatGrant.some((k) => permissions.includes(k))) return true;

  // Fallback: se a role no banco não tiver permissões (ex.: seed não rodou ou role sem RolePermissions),
  // concede as permissões padrão da role para COMMERCIAL/ADMIN/STAFF
  const defaultForRole = roleKey ? DEFAULT_ROLE_PERMISSIONS[roleKey] : undefined;
  if (defaultForRole?.includes("*")) return true;
  if (defaultForRole && keysThatGrant.some((k) => defaultForRole.includes(k))) return true;

  return false;
}

/**
 * Verifica se a lista de permissões inclui alguma chave que concede a permissão (para uso em middleware).
 */
export function hasPermissionKey(permissions: string[], permissionKey: string): boolean {
  return getKeysThatGrant(permissionKey).some((k) => permissions.includes(k));
}

/**
 * Para uso em Server Components: obtém sessão, verifica permissão e redireciona com 403 ou retorna.
 * Use com getServerSession + redirect.
 */
export function requirePermission(
  session: SessionWithPermissions | null,
  permissionKey: string,
  options?: { redirectTo?: string }
): asserts session is SessionWithPermissions {
  if (!session) {
    const { redirect } = require("next/navigation");
    redirect(options?.redirectTo ?? "/login");
  }
  if (!hasPermission(session, permissionKey)) {
    const { redirect } = require("next/navigation");
    redirect(options?.redirectTo ?? "/403");
  }
}
