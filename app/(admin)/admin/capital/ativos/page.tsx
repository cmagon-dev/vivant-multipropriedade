import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CapitalAtivosPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");

  const ativos = await prisma.capitalAssetConfig.findMany({
    include: {
      property: { select: { id: true, name: true, slug: true, location: true, priceValue: true } },
      _count: { select: { participations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Ativos</h1>
          <p className="text-gray-500 mt-1">Imóveis vinculados ao Vivant Capital (camada de investimento)</p>
        </div>
        <Link href="/admin/capital/ativos/novo">
          <span className="inline-flex items-center justify-center rounded-md bg-vivant-navy px-4 py-2 text-sm font-medium text-white hover:bg-vivant-navy/90">
            Vincular imóvel
          </span>
        </Link>
      </div>

      {ativos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Nenhum ativo vinculado. Vincule um imóvel existente em Casas para adicionar ao Capital.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {ativos.map((a) => (
            <Card key={a.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-vivant-navy" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-vivant-navy">{a.property.name}</h3>
                      <p className="text-sm text-gray-600">{a.property.location}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        <span>{a.totalCotas} cotas</span>
                        <span>Valor/cota: {fmt(Number(a.valorPorCota))}</span>
                        <span>Taxa adm: {Number(a.taxaAdministracaoPercent)}%</span>
                        <span>{a._count.participations} participação(ões)</span>
                        <span className={`px-2 py-0.5 rounded ${a.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {a.enabled ? "Ativo" : "Inativo"}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-100">{a.ativoStatus}</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/admin/capital/ativos/${a.id}`} className="text-sm font-medium text-vivant-navy hover:underline shrink-0">
                    Configurar
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
