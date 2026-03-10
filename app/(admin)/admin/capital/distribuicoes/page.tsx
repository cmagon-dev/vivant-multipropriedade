import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Building2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
const STATUS_LABEL: Record<string, string> = {
  RASCUNHO: "Rascunho",
  APROVADA: "Aprovada",
  PAGA: "Paga",
};

export default async function CapitalDistribuicoesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");

  const distributions = await prisma.capitalDistribution.findMany({
    include: {
      assetConfig: { include: { property: { select: { name: true } } } },
      _count: { select: { items: true } },
    },
    orderBy: { competencia: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Distribuições</h1>
        <p className="text-gray-500 mt-1">Distribuição de resultados por competência</p>
      </div>

      {distributions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Nenhuma distribuição cadastrada.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {distributions.map((d) => (
            <Card key={d.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-vivant-navy" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-vivant-navy">
                        {d.assetConfig.property.name} — {d.competencia}
                      </h3>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        <span>Resultado: {fmt(Number(d.resultadoDistribuivel))}</span>
                        <span>{d._count.items} item(ns)</span>
                        <span className={`px-2 py-0.5 rounded ${d.status === "PAGA" ? "bg-green-100 text-green-700" : d.status === "APROVADA" ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}>
                          {STATUS_LABEL[d.status] ?? d.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/admin/capital/distribuicoes/${d.id}`} className="text-sm font-medium text-vivant-navy hover:underline shrink-0">
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
