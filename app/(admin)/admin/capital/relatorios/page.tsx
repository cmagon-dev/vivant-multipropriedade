import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, FileText, Users, DollarSign, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CapitalRelatoriosPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");
  const companyId = await getCapitalCompanyId(session);

  const [ativos, investidores, participacoes, pagamentos] = await Promise.all([
    prisma.capitalAssetConfig.findMany({ where: { companyId }, include: { property: { select: { name: true } } } }),
    prisma.capitalInvestorProfile.findMany({ where: { companyId }, include: { user: { select: { name: true } } } }),
    prisma.capitalParticipation.findMany({ where: { companyId }, include: { assetConfig: { include: { property: { select: { name: true } } } } } }),
    prisma.capitalPayment.findMany({ where: { companyId } }),
  ]);

  const captacaoPorAtivo = ativos.map((a) => {
    const aportes = participacoes
      .filter((p) => p.assetConfigId === a.id)
      .reduce((acc, p) => acc + Number(p.valorAportado), 0);
    return { nome: a.property?.name ?? "Ativo sem imóvel", valor: aportes };
  });

  const investidoresResumo = investidores.map((inv) => ({
    nome: inv.user.name,
    participacoes: participacoes.filter((p) => p.investorProfileId === inv.id).length,
  }));

  const pagamentosResumo = {
    totalPago: pagamentos.reduce((acc, p) => acc + Number(p.amount), 0),
    totalPendente: pagamentos
      .filter((p) => p.status !== "PAGO")
      .reduce((acc, p) => acc + Number(p.amount), 0),
  };

  const rentabilidadeProjetadaMedia =
    ativos.length > 0
      ? ativos.reduce((acc, a) => acc + Number(a.taxaAdministracaoPercent), 0) / ativos.length
      : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Relatórios</h1>
        <p className="text-gray-500 mt-1">Relatórios financeiros e documentos do Vivant Capital</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy">Captação por ativo</h3>
                <div className="text-sm text-gray-500 space-y-1 mt-1">
                  {captacaoPorAtivo.slice(0, 5).map((item) => (
                    <p key={item.nome}>
                      {item.nome}: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(item.valor)}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy">Relatório de investidores</h3>
                <div className="text-sm text-gray-500 space-y-1 mt-1">
                  {investidoresResumo.slice(0, 5).map((item) => (
                    <p key={item.nome}>{item.nome}: {item.participacoes} participação(ões)</p>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy">Relatório de pagamentos</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Pago: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pagamentosResumo.totalPago)}
                </p>
                <p className="text-sm text-gray-500">
                  Pendente: {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pagamentosResumo.totalPendente)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center">
                <Building2 className="w-6 h-6 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy">Rentabilidade projetada</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Média projetada: {rentabilidadeProjetadaMedia.toFixed(2)}%
                </p>
                <p className="text-sm text-gray-500">Base: taxa dos ativos configurados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-vivant-navy" />
              </div>
              <div>
                <h3 className="font-semibold text-vivant-navy">Relatório de compliance</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Itens pendentes devem ser acompanhados em Capital → Compliance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
