import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CapitalRelatoriosPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Relatórios</h1>
        <p className="text-gray-500 mt-1">Relatórios financeiros e documentos do Vivant Capital</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy">Resumo financeiro</h3>
                <p className="text-sm text-gray-500">Captado, distribuído e por ativo (em breve)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy">Documentos</h3>
                <p className="text-sm text-gray-500">Contratos e relatórios do módulo (em breve)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
