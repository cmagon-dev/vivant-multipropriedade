import { getSession } from "@/lib/auth";
import { getCapitalInvestorContext, isCapitalInvestor } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

type InvestorStatementItem = {
  id: string;
  type: "APORTE" | "DISTRIBUICAO";
  title: string;
  assetName: string;
  date: Date;
  amount: number;
  status: string;
};

export default async function CapitalPagamentosPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isCapitalInvestor(session)) redirect("/403");

  const context = await getCapitalInvestorContext(session);
  if (!context) redirect("/403");

  const [participations, distributions] = await Promise.all([
    prisma.capitalParticipation.findMany({
      where: {
        investorProfileId: context.investorProfileId,
        companyId: context.companyId,
      },
      include: { assetConfig: { include: { property: { select: { name: true } } } } },
      orderBy: { dataEntrada: "desc" },
    }),
    prisma.capitalDistributionItem.findMany({
      where: {
        investorProfileId: context.investorProfileId,
        companyId: context.companyId,
      },
      include: {
        distribution: {
          include: { assetConfig: { include: { property: { select: { name: true } } } } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const statement: InvestorStatementItem[] = [
    ...participations.map((p) => ({
      id: `aporte-${p.id}`,
      type: "APORTE" as const,
      title: "Entrada de investimento",
      assetName: p.assetConfig.property.name,
      date: p.dataEntrada,
      amount: Number(p.valorAportado),
      status: p.status,
    })),
    ...distributions.map((d) => ({
      id: `dist-${d.id}`,
      type: "DISTRIBUICAO" as const,
      title: `Distribuição ${d.distribution.competencia}`,
      assetName: d.distribution.assetConfig.property.name,
      date: d.createdAt,
      amount: Number(d.valorPago),
      status: d.status,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-vivant-navy">Pagamentos / Extrato</h1>
        <p className="text-gray-500 mt-1">Entradas e distribuições recebidas</p>
      </div>

      {statement.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">Nenhuma movimentação encontrada.</CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {statement.map((item) => (
            <Card key={item.id} className="border border-gray-200">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      item.type === "APORTE" ? "bg-blue-100" : "bg-green-100"
                    }`}
                  >
                    {item.type === "APORTE" ? (
                      <ArrowDownLeft className="w-5 h-5 text-blue-700" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-green-700" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-vivant-navy">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.assetName}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                      <span>{new Date(item.date).toLocaleDateString("pt-BR")}</span>
                      <span>{fmt(item.amount)}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-100">{item.status}</span>
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
