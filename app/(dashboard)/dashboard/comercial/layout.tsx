import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { hasPermission } from "@/lib/auth/permissions";
import { AppShell } from "@/components/shell/AppShell";
import {
  UNIFIED_MENU_CONFIG,
  filterMenuByPermission,
  filterMenuSubItemsByPermission,
  toShellMenuItems,
} from "@/lib/navigation/menu";

export default async function ComercialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "comercial.view")) redirect("/403");

  const user = session.user as {
    name?: string;
    roleKey?: string;
    permissions?: string[];
  };

  const permissions = user.permissions ?? [];
  const roleKey = user.roleKey ?? null;
  const filtered = filterMenuByPermission(UNIFIED_MENU_CONFIG, permissions, roleKey);
  const menuItems = toShellMenuItems(
    filterMenuSubItemsByPermission(filtered, permissions, roleKey)
  );

  return (
    <AppShell
      title="Painel Comercial"
      menuItems={menuItems}
      userDisplay={{
        name: user.name ?? "Usuário",
        roleLabel: user.roleKey ?? "COMMERCIAL",
      }}
    >
      {children}
    </AppShell>
  );
}
