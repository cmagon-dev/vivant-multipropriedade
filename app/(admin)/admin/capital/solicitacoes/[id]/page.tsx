import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { SolicitacaoDetailClient } from "./solicitacao-detail-client";

export const dynamic = "force-dynamic";

export default async function SolicitacaoCapitalPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");

  const { id } = await params;
  const sol = await prisma.capitalLiquidityRequest.findUnique({
    where: { id },
    include: {
      investorProfile: { include: { user: { select: { name: true, email: true } } } },
      assetConfig: { include: { property: { select: { name: true } } } },
    },
  });
  if (!sol) redirect("/admin/capital/solicitacoes");

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/capital/solicitacoes" className="text-sm text-gray-500 hover:underline">← Voltar</Link>
        <h1 className="text-3xl font-bold text-vivant-navy mt-2">Solicitação de {sol.tipoSolicitacao}</h1>
        <p className="text-gray-500 mt-1">{sol.investorProfile.user.name} — {sol.assetConfig.property.name}</p>
      </div>
      <SolicitacaoDetailClient
        sol={{
          id: sol.id,
          tipoSolicitacao: sol.tipoSolicitacao,
          valorSolicitado: Number(sol.valorSolicitado),
          motivo: sol.motivo,
          status: sol.status,
          observacaoAdmin: sol.observacaoAdmin,
          dataSolicitacao: sol.dataSolicitacao,
          dataDecisao: sol.dataDecisao,
          investorName: sol.investorProfile.user.name,
          propertyName: sol.assetConfig.property.name,
        }}
      />
    </div>
  );
}
