import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AppShell } from "@/components/shell/AppShell";
import { ContextualHelpAuto } from "@/components/help/ContextualHelpAuto";
import {
  UNIFIED_MENU_CONFIG,
  filterMenuByPermission,
  filterMenuSubItemsByPermission,
  toShellMenuItems,
} from "@/lib/navigation/menu";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as {
    name?: string;
    email?: string;
    role?: string;
    roleKey?: string | null;
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
      title="Painel Administrativo"
      menuItems={menuItems}
      userDisplay={{
        name: user.name ?? "Usuário",
        roleLabel: user.role ?? user.roleKey ?? "—",
      }}
    >
      <>
        <ContextualHelpAuto />
        {children}
      </>
    </AppShell>
  );
}
