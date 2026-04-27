import { getSession } from "@/lib/auth";
import { getCapitalInvestorContext, isCapitalInvestor } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export default async function CapitalAtivoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isCapitalInvestor(session)) redirect("/403");

  const context = await getCapitalInvestorContext(session);
  if (!context) redirect("/403");

  const { id: assetConfigId } = await params;
  const participation = await prisma.capitalParticipation.findFirst({
    where: {
        investorProfileId: context.investorProfileId,
        companyId: context.companyId,
      assetConfigId,
        status: { in: ["ATIVO", "PAGO", "RESERVADO"] },
    },
    include: {
      assetConfig: {
        include: {
          property: true,
          _count: { select: { participations: true } },
        },
      },
    },
  });

  if (!participation) redirect("/capital/investimentos");

  const prop = participation.assetConfig.property;

  const latestValuation = await prisma.capitalValuation.findFirst({
    where: { assetConfigId, companyId: context.companyId },
    orderBy: { dataReferencia: "desc" },
  });
  const [complianceDocs, propertyDocs] = await Promise.all([
    prisma.capitalComplianceDocument.findMany({
      where: {
        companyId: context.companyId,
        assetId: assetConfigId,
      },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        type: true,
        status: true,
        fileUrl: true,
        updatedAt: true,
      },
    }),
    prisma.documento.findMany({
      where: { propertyId: prop.id, ativo: true },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, titulo: true, url: true, tipo: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/capital/investimentos" className="text-sm text-gray-500 hover:underline">Voltar aos investimentos</Link>
        <h1 className="text-2xl font-bold text-vivant-navy mt-2">{prop.name}</h1>
        <p className="text-gray-500 mt-1">{prop.location}</p>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold">Sua participação</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Cotas:</strong> {participation.numeroCotas}</p>
          <p><strong>Percentual:</strong> {Number(participation.percentualTotal).toFixed(2)}%</p>
          <p><strong>Valor aportado:</strong> {fmt(Number(participation.valorAportado))}</p>
          <p><strong>Data de entrada:</strong> {new Date(participation.dataEntrada).toLocaleDateString("pt-BR")}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold">Dados do ativo</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Valor por cota:</strong> {fmt(Number(participation.assetConfig.valorPorCota))}</p>
          <p><strong>Taxa de administração:</strong> {Number(participation.assetConfig.taxaAdministracaoPercent)}%</p>
          <p><strong>Reserva:</strong> {Number(participation.assetConfig.reservaPercent)}%</p>
          <p><strong>Status da operação:</strong> {participation.assetConfig.ativoStatus}</p>
          {latestValuation && (
            <p><strong>Última avaliação (imóvel):</strong> {fmt(Number(latestValuation.valorImovel))} ({new Date(latestValuation.dataReferencia).toLocaleDateString("pt-BR")})</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold">Documentos de compliance</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          {complianceDocs.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum documento de compliance disponível.</p>
          ) : (
            complianceDocs.map((doc) => (
              <div key={doc.id} className="flex flex-wrap items-center justify-between gap-2 border rounded-md px-3 py-2">
                <div className="text-sm">
                  <p className="font-medium text-vivant-navy">{doc.type}</p>
                  <p className="text-gray-500">{doc.status}</p>
                </div>
                {doc.fileUrl ? (
                  <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-vivant-navy hover:underline">
                    Abrir
                  </a>
                ) : (
                  <span className="text-xs text-gray-400">Sem arquivo</span>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <h2 className="text-lg font-semibold">Documentos do ativo</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          {propertyDocs.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum documento de ativo disponível.</p>
          ) : (
            propertyDocs.map((doc) => (
              <div key={doc.id} className="flex flex-wrap items-center justify-between gap-2 border rounded-md px-3 py-2">
                <div className="text-sm">
                  <p className="font-medium text-vivant-navy">{doc.titulo}</p>
                  <p className="text-gray-500">{doc.tipo}</p>
                </div>
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-vivant-navy hover:underline">
                  Abrir
                </a>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
