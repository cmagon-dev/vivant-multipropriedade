import { getSession } from "@/lib/auth";
import { getCapitalInvestorContext, isCapitalInvestor } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CapitalDocumentosPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isCapitalInvestor(session)) redirect("/403");

  const context = await getCapitalInvestorContext(session);
  if (!context) redirect("/403");

  const participations = await prisma.capitalParticipation.findMany({
    where: {
      investorProfileId: context.investorProfileId,
      companyId: context.companyId,
      status: { in: ["ATIVO", "PAGO", "RESERVADO"] },
    },
    select: { assetConfigId: true, assetConfig: { select: { propertyId: true, property: { select: { name: true } } } } },
  });
  const propertyIds = Array.from(new Set(participations.map((p) => p.assetConfig.propertyId)));
  const assetConfigIds = Array.from(new Set(participations.map((p) => p.assetConfigId)));

  const [documentos, complianceDocs, reportDocs] = await Promise.all([
    prisma.documento.findMany({
      where: { propertyId: { in: propertyIds }, ativo: true, tipo: { in: ["CONTRATO", "ATA", "LAUDO", "MANUAL", "OUTROS"] } },
      include: { property: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.capitalComplianceDocument.findMany({
      where: {
        companyId: context.companyId,
        assetId: { in: assetConfigIds },
      },
      include: { asset: { include: { property: { select: { name: true } } } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.documento.findMany({
      where: { propertyId: { in: propertyIds }, ativo: true, tipo: { in: ["LAUDO", "ATA"] } },
      include: { property: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vivant-navy">Documentos</h1>
        <p className="text-gray-500 mt-1">Compliance, contratos e relatórios dos seus ativos</p>
      </div>
      {documentos.length === 0 && complianceDocs.length === 0 && reportDocs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Nenhum documento disponível.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-vivant-navy">Compliance</h2>
            {complianceDocs.length === 0 ? (
              <Card><CardContent className="py-6 text-sm text-gray-500">Sem documentos de compliance.</CardContent></Card>
            ) : (
              complianceDocs.map((d) => (
                <Card key={d.id} className="border border-gray-200">
                  <CardContent className="p-4 sm:p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-vivant-navy" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-vivant-navy">{d.type}</p>
                      <p className="text-sm text-gray-600">{d.asset.property.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{d.status}</p>
                    </div>
                    {d.fileUrl ? (
                      <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-vivant-navy hover:underline">
                        Abrir
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Sem arquivo</span>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-vivant-navy">Contratos</h2>
            {documentos.length === 0 ? (
              <Card><CardContent className="py-6 text-sm text-gray-500">Sem contratos disponíveis.</CardContent></Card>
            ) : (
              documentos.map((d) => (
                <Card key={d.id} className="border border-gray-200">
                  <CardContent className="p-4 sm:p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-vivant-navy" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-vivant-navy">{d.titulo}</p>
                      <p className="text-sm text-gray-600">{d.property.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{d.tipo}</p>
                    </div>
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-vivant-navy hover:underline">
                      Abrir
                    </a>
                  </CardContent>
                </Card>
              ))
            )}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-vivant-navy">Relatórios</h2>
            {reportDocs.length === 0 ? (
              <Card><CardContent className="py-6 text-sm text-gray-500">Sem relatórios disponíveis.</CardContent></Card>
            ) : (
              reportDocs.map((d) => (
                <Card key={`report-${d.id}`} className="border border-gray-200">
                  <CardContent className="p-4 sm:p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-vivant-navy" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-vivant-navy">{d.titulo}</p>
                      <p className="text-sm text-gray-600">{d.property.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{d.tipo}</p>
                    </div>
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-vivant-navy hover:underline">
                      Abrir
                    </a>
                  </CardContent>
                </Card>
              ))
            )}
          </section>
        </div>
      )}
    </div>
  );
}
