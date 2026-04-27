import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Building2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { NovaParticipacaoModal } from "./nova-participacao-modal";

export const dynamic = "force-dynamic";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

export default async function CapitalParticipacoesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");
  const companyId = await getCapitalCompanyId(session);

  const participations = await prisma.capitalParticipation.findMany({
    where: { companyId },
    include: {
      investorProfile: { include: { user: { select: { name: true, email: true } } } },
      assetConfig: { include: { property: { select: { name: true } } } },
    },
    orderBy: { dataEntrada: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Participações</h1>
          <p className="text-gray-500 mt-1">Investidor x ativo (cotas e percentuais)</p>
        </div>
        {canManageCapital(session) && <NovaParticipacaoModal />}
      </div>

      {participations.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500 space-y-2">
            <p>Nenhuma participação cadastrada.</p>
            <p className="text-sm">
              Clique em <strong>Nova participação</strong> para vincular um investidor a um ativo (informe as cotas). Assim o investidor passa a ter participação e aparece no portal.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {participations.map((p) => (
            <Card key={p.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                      <PieChart className="w-5 h-5 text-vivant-navy" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-vivant-navy">{p.investorProfile.user.name}</h3>
                      <p className="text-sm text-gray-600">{p.investorProfile.user.email}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {p.assetConfig.property.name}
                        </span>
                        <span>{p.numeroCotas} cotas</span>
                        <span>{Number(p.percentualTotal).toFixed(2)}%</span>
                        <span>{fmt(Number(p.valorAportado))}</span>
                        <span>Retorno est.: {fmt(Number((p as any).expectedReturn ?? 0))}</span>
                        <span>ROI: {Number((p as any).roiPercent ?? 0).toFixed(2)}%</span>
                        <span>{format(new Date(p.dataEntrada), "dd/MM/yyyy", { locale: ptBR })}</span>
                        <span className={`px-2 py-0.5 rounded ${p.status === "ATIVO" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>
                          {p.status}
                        </span>
                      </div>
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
