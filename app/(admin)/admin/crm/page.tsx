import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { CrmManager } from "@/components/admin/crm-manager";

export default async function AdminCrmPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "crm.manage")) redirect("/admin/overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Funis / CRM</h1>
        <p className="text-gray-600">Gerencie tipos de funil e etapas. Métricas por tipo e vendedores.</p>
      </div>
      <CrmManager />
    </div>
  );
}
