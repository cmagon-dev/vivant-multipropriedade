import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCapitalInvestorProfileId, isCapitalInvestor } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
const STATUS_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  APROVADA: "Aprovada",
  RECUSADA: "Recusada",
  PAGA: "Paga",
};

export default async function CapitalSolicitacaoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!isCapitalInvestor(session)) redirect("/403");

  const profileId = await getCapitalInvestorProfileId(session);
  if (!profileId) redirect("/403");

  const { id } = await params;
  const sol = await prisma.capitalLiquidityRequest.findFirst({
    where: { id, investorProfileId: profileId },
    include: { assetConfig: { include: { property: { select: { name: true } } } } },
  });
  if (!sol) redirect("/capital/solicitacoes");

  return (
    <div className="space-y-6">
      <div>
        <Link href="/capital/solicitacoes" className="text-sm text-gray-500 hover:underline">← Voltar</Link>
        <h1 className="text-2xl font-bold text-vivant-navy mt-2">Solicitação de {sol.tipoSolicitacao}</h1>
        <p className="text-gray-500 mt-1">{sol.assetConfig.property.name}</p>
      </div>
      <Card>
        <CardContent className="pt-6 space-y-2">
          <p><strong>Valor:</strong> {fmt(Number(sol.valorSolicitado))}</p>
          <p><strong>Data da solicitação:</strong> {format(new Date(sol.dataSolicitacao), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
          <p><strong>Status:</strong> <span className="font-medium">{STATUS_LABEL[sol.status] ?? sol.status}</span></p>
          {sol.motivo && <p><strong>Motivo:</strong> {sol.motivo}</p>}
          {sol.observacaoAdmin && <p><strong>Observação da administração:</strong> {sol.observacaoAdmin}</p>}
          {sol.dataDecisao && <p><strong>Data da decisão:</strong> {format(new Date(sol.dataDecisao), "dd/MM/yyyy", { locale: ptBR })}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
