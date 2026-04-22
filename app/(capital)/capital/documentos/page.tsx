import { getSession } from "@/lib/auth";
import { getCapitalInvestorProfileId, isCapitalInvestor } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CapitalDocumentosPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isCapitalInvestor(session)) redirect("/403");

  const profileId = await getCapitalInvestorProfileId(session);
  if (!profileId) redirect("/403");

  const participations = await prisma.capitalParticipation.findMany({
    where: { investorProfileId: profileId, status: "ATIVO" },
    select: { assetConfig: { select: { propertyId: true } } },
  });
  const propertyIds = Array.from(new Set(participations.map((p) => p.assetConfig.propertyId)));

  const documentos = await prisma.documento.findMany({
    where: { propertyId: { in: propertyIds }, ativo: true },
    include: { property: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vivant-navy">Documentos</h1>
        <p className="text-gray-500 mt-1">Contratos e documentos dos ativos em que você participa</p>
      </div>
      {documentos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Nenhum documento disponível.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {documentos.map((d) => (
            <Card key={d.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-vivant-navy" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-vivant-navy">{d.titulo}</p>
                    <p className="text-sm text-gray-600">{d.property.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{d.tipo}</p>
                  </div>
                  <a
                    href={d.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-vivant-navy hover:underline"
                  >
                    Abrir
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
