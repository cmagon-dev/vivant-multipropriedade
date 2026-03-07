import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCatalogByModule, DEFAULT_ROLE_PERMISSIONS } from "@/lib/auth/permissionCatalog";

const MODULE_LABELS: Record<string, string> = {
  crm: "CRM / Leads",
  users: "Usuários",
  roles: "Roles",
  permissions: "Permissões",
  properties: "Propriedades / Imóveis",
  destinations: "Destinos",
  events: "Auditoria / Eventos",
  tasks: "Tarefas",
  help: "Ajuda",
  dashboard: "Dashboard",
  cotista: "Portal Cotista",
  companies: "Empresas",
};

const RISK_LABELS: Record<string, string> = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
  critical: "Crítico",
};

export function PermissionsDocSection() {
  const byModule = getCatalogByModule();
  const modules = Object.keys(byModule).sort();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-vivant-navy mb-1">Permissões (o que cada uma faz)</h2>
        <p className="text-sm text-gray-600">
          Catálogo por módulo. Padrão: <code className="bg-gray-100 px-1 rounded">&lt;módulo&gt;.&lt;ação&gt;</code> (view, create, edit, delete, manage).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Por módulo</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2 pr-4 font-medium text-gray-700">Módulo</th>
                <th className="py-2 pr-4 font-medium text-gray-700">Permissão</th>
                <th className="py-2 pr-4 font-medium text-gray-700">Para que serve</th>
                <th className="py-2 pr-4 font-medium text-gray-700">Ação</th>
                <th className="py-2 font-medium text-gray-700">Risco</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((mod) =>
                byModule[mod].map((p) => (
                  <tr key={p.key} className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-700">{MODULE_LABELS[mod] ?? mod}</td>
                    <td className="py-2 pr-4 font-mono text-xs">{p.key}</td>
                    <td className="py-2 pr-4 text-gray-600">{p.description}</td>
                    <td className="py-2 pr-4 text-gray-600">{p.action}</td>
                    <td className="py-2">{RISK_LABELS[p.riskLevel] ?? p.riskLevel}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold text-vivant-navy mb-1">Matriz por role (padrão do sistema)</h2>
        <p className="text-sm text-gray-600 mb-4">
          Permissões concedidas por padrão a cada role no seed. OWNER/SUPER_ADMIN têm todas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Role → Permissões</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left">
                <th className="py-2 pr-4 font-medium text-gray-700">Role</th>
                <th className="py-2 font-medium text-gray-700">Permissões concedidas por padrão</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(DEFAULT_ROLE_PERMISSIONS).map(([role, perms]) => (
                <tr key={role} className="border-b border-gray-100">
                  <td className="py-2 pr-4 font-medium text-gray-700 align-top">{role}</td>
                  <td className="py-2 text-gray-600">
                    {perms[0] === "*" ? "Todas" : perms.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
