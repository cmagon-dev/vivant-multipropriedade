import { getSession } from "@/lib/auth";
import { getCapitalInvestorProfileId, isCapitalInvestor } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Building2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NovaSolicitacaoForm } from "./nova-solicitacao-form";

export const dynamic = "force-dynamic";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
const STATUS_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  APROVADA: "Aprovada",
  RECUSADA: "Recusada",
  PAGA: "Paga",
};

export default async function CapitalSolicitacoesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isCapitalInvestor(session)) redirect("/403");

  const profileId = await getCapitalInvestorProfileId(session);
  if (!profileId) redirect("/403");

  const [solicitacoes, participations] = await Promise.all([
    prisma.capitalLiquidityRequest.findMany({
      where: { investorProfileId: profileId },
      include: { assetConfig: { include: { property: { select: { id: true, name: true } } } } },
      orderBy: { dataSolicitacao: "desc" },
    }),
    prisma.capitalParticipation.findMany({
      where: { investorProfileId: profileId, status: "ATIVO" },
      include: { assetConfig: { include: { property: { select: { id: true, name: true } } } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vivant-navy">Solicitações</h1>
        <p className="text-gray-500 mt-1">Antecipação ou resgate — acompanhe o status</p>
      </div>

      {participations.length > 0 && (
        <NovaSolicitacaoForm
          assetOptions={participations.map((p) => ({
            assetConfigId: p.assetConfigId,
            propertyName: p.assetConfig.property.name,
          }))}
        />
      )}

      {solicitacoes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Nenhuma solicitação. Crie uma acima se precisar de antecipação ou resgate.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {solicitacoes.map((s) => (
            <Card key={s.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-vivant-navy" />
                    </div>
                    <div>
                      <p className="font-semibold text-vivant-navy">{s.tipoSolicitacao}</p>
                      <p className="text-sm text-gray-600">{s.assetConfig.property.name}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        <span>{fmt(Number(s.valorSolicitado))}</span>
                        <span>{format(new Date(s.dataSolicitacao), "dd/MM/yyyy", { locale: ptBR })}</span>
                        <span className={`px-2 py-0.5 rounded ${s.status === "PENDENTE" ? "bg-amber-100 text-amber-800" : s.status === "APROVADA" || s.status === "PAGA" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>
                          {STATUS_LABEL[s.status] ?? s.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/capital/solicitacoes/${s.id}`} className="text-sm font-medium text-vivant-navy hover:underline shrink-0">
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
