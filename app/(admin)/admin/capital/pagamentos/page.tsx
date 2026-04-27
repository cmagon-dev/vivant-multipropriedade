import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";

const fmt = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

function getStatus(status: string): "PENDENTE" | "PAGO" | "ATRASADO" | "CANCELADO" {
  if (status === "PAGO") return "PAGO";
  if (status === "CANCELADO") return "CANCELADO";
  return "PENDENTE";
}

export default async function CapitalPagamentosPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");
  const companyId = await getCapitalCompanyId(session);

  const pagamentos = await prisma.capitalPayment.findMany({
    where: { companyId },
    include: {
      investor: { include: { user: { select: { name: true } } } },
      asset: { include: { property: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Pagamentos</h1>
          <p className="text-gray-500 mt-1">Controle financeiro da operação Capital</p>
        </div>
        <Link href="/admin/capital/distribuicoes" className="text-sm font-medium text-vivant-navy hover:underline">
          Gerenciar distribuições
        </Link>
      </div>

      {pagamentos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Nenhum pagamento registrado.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {pagamentos.map((p) => {
            const bolcaoGarantia = Number(p.guaranteeAmount ?? 0);
            const operacaoVivant = Number(p.operationAmount ?? 0);
            const status = getStatus(p.status);
            return (
              <Card key={p.id} className="border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-base text-vivant-navy">
                    {p.investor.user.name} · {p.asset.property.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Valor pago</span>
                    <p className="font-semibold">{fmt(p.status === "PAGO" ? Number(p.amount) : 0)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Valor devido</span>
                    <p className="font-semibold">{fmt(Number(p.amount))}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Forma de pagamento</span>
                    <p className="font-semibold">Transferência</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status</span>
                    <p className="font-semibold">{status}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Bolsão de garantia (50%)</span>
                    <p className="font-semibold">{fmt(bolcaoGarantia)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Operação Vivant (50%)</span>
                    <p className="font-semibold">{fmt(operacaoVivant)}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
