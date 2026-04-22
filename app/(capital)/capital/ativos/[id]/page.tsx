import { getSession } from "@/lib/auth";
import { getCapitalInvestorProfileId, isCapitalInvestor } from "@/lib/capital-auth";
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

  const profileId = await getCapitalInvestorProfileId(session);
  if (!profileId) redirect("/403");

  const { id: assetConfigId } = await params;
  const participation = await prisma.capitalParticipation.findUnique({
    where: {
      investorProfileId_assetConfigId: { investorProfileId: profileId, assetConfigId },
      status: "ATIVO",
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

  if (!participation) redirect("/capital/portfolio");

  const latestValuation = await prisma.capitalValuation.findFirst({
    where: { assetConfigId },
    orderBy: { dataReferencia: "desc" },
  });

  const prop = participation.assetConfig.property;

  return (
    <div className="space-y-6">
      <div>
        <Link href="/capital/portfolio" className="text-sm text-gray-500 hover:underline">Voltar ao portfólio</Link>
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
          {latestValuation && (
            <p><strong>Última avaliação (imóvel):</strong> {fmt(Number(latestValuation.valorImovel))} ({new Date(latestValuation.dataReferencia).toLocaleDateString("pt-BR")})</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
