import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { HelpContentManager } from "@/components/admin/help-content-manager";
import { PermissionsDocSection } from "@/components/admin/permissions-doc-section";

export default async function AdminHelpPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "help.manage")) redirect("/admin/overview");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Ajuda contextual</h1>
        <p className="text-gray-600">Edite os textos de ajuda (ícone ?) e consulte o catálogo de permissões</p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-vivant-navy mb-4">Esquema de Ajuda</h2>
        <HelpContentManager />
      </section>

      <section className="border-t border-gray-200 pt-8">
        <PermissionsDocSection />
      </section>
    </div>
  );
}
