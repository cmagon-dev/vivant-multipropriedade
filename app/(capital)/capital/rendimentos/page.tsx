import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCapitalInvestorProfileId, isCapitalInvestor } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export default async function CapitalRendimentosPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!isCapitalInvestor(session)) redirect("/403");

  const profileId = await getCapitalInvestorProfileId(session);
  if (!profileId) redirect("/403");

  const items = await prisma.capitalDistributionItem.findMany({
    where: { investorProfileId: profileId },
    include: {
      distribution: {
        include: {
          assetConfig: { include: { property: { select: { name: true } } } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vivant-navy">Rendimentos</h1>
        <p className="text-gray-500 mt-1">Histórico de distribuições</p>
      </div>
      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Nenhum rendimento registrado.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((i) => (
            <Card key={i.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-vivant-navy" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-vivant-navy">{i.distribution.assetConfig.property.name}</p>
                    <p className="text-sm text-gray-600">Competência: {i.distribution.competencia}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                      <span>Devido: {fmt(Number(i.valorDevido))}</span>
                      <span>Pago: {fmt(Number(i.valorPago))}</span>
                      <span className={`px-2 py-0.5 rounded ${i.status === "PAGO" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"}`}>
                        {i.status}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
