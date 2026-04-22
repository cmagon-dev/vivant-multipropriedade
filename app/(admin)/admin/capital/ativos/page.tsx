import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { CapitalAtivosList } from "./capital-ativos-list";

export const dynamic = "force-dynamic";

export default async function CapitalAtivosPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");

  const ativos = await prisma.capitalAssetConfig.findMany({
    include: {
      property: { select: { id: true, name: true, slug: true, location: true, priceValue: true } },
      _count: { select: { participations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const ativosSerialized = ativos.map((a) => ({
    id: a.id,
    totalCotas: a.totalCotas,
    valorPorCota: Number(a.valorPorCota),
    taxaAdministracaoPercent: Number(a.taxaAdministracaoPercent),
    enabled: a.enabled,
    ativoStatus: a.ativoStatus,
    property: a.property ? { id: a.property.id, name: a.property.name, slug: a.property.slug, location: a.property.location ?? "", priceValue: a.property.priceValue ?? null } : null,
    _count: a._count,
  }));

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
        <CapitalAtivosList ativos={ativosSerialized} />
      )}
    </div>
  );
}
