import { getSession } from "@/lib/auth";
import { getCapitalInvestorProfileId, isCapitalInvestor } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export default async function CapitalPortfolioPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isCapitalInvestor(session)) redirect("/403");

  const profileId = await getCapitalInvestorProfileId(session);
  if (!profileId) redirect("/403");

  const participations = await prisma.capitalParticipation.findMany({
    where: { investorProfileId: profileId, status: "ATIVO" },
    include: {
        assetConfig: {
        include: {
          property: { select: { id: true, name: true, slug: true, location: true, cidade: true, images: true, priceValue: true } },
        },
      },
    },
    orderBy: { dataEntrada: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vivant-navy">Portfólio</h1>
        <p className="text-gray-500 mt-1">Ativos em que você participa</p>
      </div>
      {participations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Você ainda não possui participação em nenhum ativo.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {participations.map((p) => (
            <Card key={p.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-vivant-navy" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-vivant-navy">{p.assetConfig.property.name}</h3>
                      <p className="text-sm text-gray-600">{p.assetConfig.property.location}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        <span>{p.numeroCotas} cotas</span>
                        <span>{Number(p.percentualTotal).toFixed(2)}%</span>
                        <span>{fmt(Number(p.valorAportado))} aportado</span>
                        <span>Valor/cota: {fmt(Number(p.assetConfig.valorPorCota))}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/capital/ativos/${p.assetConfigId}`} className="text-sm font-medium text-vivant-navy hover:underline shrink-0">
                    Ver detalhes
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
