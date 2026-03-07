import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { PermissionsList } from "@/components/admin/permissions-list";

export default async function AdminPermissionsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "permissions.manage")) redirect("/admin/overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Permissões</h1>
        <p className="text-gray-600">Lista de permissões do sistema (atribuição via Roles)</p>
      </div>
      <PermissionsList />
    </div>
  );
}
