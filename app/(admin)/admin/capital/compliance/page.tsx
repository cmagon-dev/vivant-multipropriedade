import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceDocManager } from "./compliance-doc-manager";

export const dynamic = "force-dynamic";

const CHECKLIST = [
  "patrimonio_de_afetacao",
  "alienacao_fiduciaria",
  "clausula_resolutiva",
  "escritura_publica",
  "conta_escrow",
  "auditoria_externa",
  "estrutura_cri_ready",
  "relatorios_trimestrais",
  "governanca_fii",
] as const;

const LABELS: Record<(typeof CHECKLIST)[number], string> = {
  patrimonio_de_afetacao: "Patrimônio de afetação",
  alienacao_fiduciaria: "Alienação fiduciária",
  clausula_resolutiva: "Cláusula resolutiva",
  escritura_publica: "Escritura pública",
  conta_escrow: "Conta escrow",
  auditoria_externa: "Auditoria externa",
  estrutura_cri_ready: "Estrutura CRI-ready",
  relatorios_trimestrais: "Relatórios trimestrais",
  governanca_fii: "Governança FII",
};

export default async function CapitalCompliancePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");
  const companyId = await getCapitalCompanyId(session);

  const ativos = await prisma.capitalAssetConfig.findMany({
    where: { companyId },
    include: { property: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  const docs = await prisma.capitalComplianceDocument.findMany({
    where: { companyId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Compliance</h1>
        <p className="text-gray-500 mt-1">Checklist jurídico e documental por ativo</p>
      </div>

      {ativos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Nenhum ativo cadastrado para controle de compliance.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {ativos.map((ativo) => (
            <Card key={ativo.id} className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-base text-vivant-navy">
                  {ativo.property?.name ?? "Ativo sem imóvel"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {CHECKLIST.map((item) => (
                  <div key={item} className="grid grid-cols-1 md:grid-cols-5 gap-2 rounded border border-gray-100 p-3 text-sm">
                    <span className="md:col-span-2 font-medium text-gray-700">{LABELS[item]}</span>
                    <span className="md:col-span-1 text-gray-500">
                      {docs.find((d) => d.assetId === ativo.id && d.type === item.toUpperCase())?.status ?? "PENDENTE"}
                    </span>
                    <span className="md:col-span-1 text-gray-500">
                      Documento: {docs.find((d) => d.assetId === ativo.id && d.type === item.toUpperCase())?.fileUrl ? "Anexado" : "—"}
                    </span>
                    <span className="md:col-span-1 text-gray-500">
                      Conclusão: {docs.find((d) => d.assetId === ativo.id && d.type === item.toUpperCase())?.concludedAt ? new Date(docs.find((d) => d.assetId === ativo.id && d.type === item.toUpperCase())!.concludedAt!).toLocaleDateString("pt-BR") : "—"}
                    </span>
                    <div className="md:col-span-5">
                      <ComplianceDocManager assetId={ativo.id} defaultType={item.toUpperCase()} />
                    </div>
                  </div>
                ))}
                <p className="text-xs text-gray-500 pt-2">
                  Base inicial da Fase 1. Evolução recomendada: registrar itens e anexos por ativo em tabela dedicada.
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
