import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { DistribuicaoDetailClient } from "./distribuicao-detail-client";

export const dynamic = "force-dynamic";

export default async function DistribuicaoCapitalPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");

  const { id } = await params;
  const dist = await prisma.capitalDistribution.findUnique({
    where: { id },
    include: {
      assetConfig: { include: { property: { select: { name: true } } } },
      items: {
        include: {
          investorProfile: { include: { user: { select: { name: true, email: true } } } },
        },
      },
    },
  });
  if (!dist) redirect("/admin/capital/distribuicoes");

  const serialized = {
    ...dist,
    receitaBruta: Number(dist.receitaBruta),
    custos: Number(dist.custos),
    taxaAdministracaoValor: Number(dist.taxaAdministracaoValor),
    reservaValor: Number(dist.reservaValor),
    resultadoDistribuivel: Number(dist.resultadoDistribuivel),
    valorTotalDistribuido: Number(dist.valorTotalDistribuido),
    items: dist.items.map((i) => ({
      ...i,
      percentualAplicado: Number(i.percentualAplicado),
      valorDevido: Number(i.valorDevido),
      valorPago: Number(i.valorPago),
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/capital/distribuicoes" className="text-sm text-gray-500 hover:underline">← Voltar</Link>
        <h1 className="text-3xl font-bold text-vivant-navy mt-2">
          {dist.assetConfig.property.name} — {dist.competencia}
        </h1>
        <p className="text-gray-500 mt-1">Detalhes da distribuição</p>
      </div>
      <DistribuicaoDetailClient dist={serialized} />
    </div>
  );
}
