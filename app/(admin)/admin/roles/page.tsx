import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { RolesManager } from "@/components/admin/roles-manager";

export default async function AdminRolesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "roles.manage")) redirect("/admin/overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Roles</h1>
        <p className="text-gray-600">Gerencie roles e suas permissões</p>
      </div>
      <RolesManager />
    </div>
  );
}
