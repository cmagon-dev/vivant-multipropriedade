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

const CAPTACAO_STATUS = ["ABERTA", "RESERVADA", "CONCLUIDA", "CANCELADA"] as const;

function resolveStatus(percentual: number, reservado: number): (typeof CAPTACAO_STATUS)[number] {
  if (percentual >= 100) return "CONCLUIDA";
  if (reservado > 0) return "RESERVADA";
  return "ABERTA";
}

export default async function CapitalCaptacoesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");
  const companyId = await getCapitalCompanyId(session);

  const [ativos, participacoes] = await Promise.all([
    prisma.capitalAssetConfig.findMany({
      where: { companyId },
      include: { property: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.capitalParticipation.findMany({ where: { companyId } }),
  ]);

  const linhas = ativos.map((a) => {
    const participacoesAtivo = participacoes.filter((p) => p.assetConfigId === a.id);
    const metaCaptacao = a.totalCotas * Number(a.valorPorCota);
    const valorCaptado = participacoesAtivo
      .filter((p) => p.status === "PAGO" || p.status === "ATIVO")
      .reduce((acc, p) => acc + Number(p.valorAportado), 0);
    const valorReservado = participacoesAtivo
      .filter((p) => p.status === "RESERVADO" || p.status === "CONTRATO_ENVIADO")
      .reduce((acc, p) => acc + Number(p.valorAportado), 0);
    const cotasReservadas = participacoesAtivo
      .filter((p) => p.status === "RESERVADO" || p.status === "CONTRATO_ENVIADO")
      .reduce((acc, p) => acc + p.numeroCotas, 0);
    const cotasVendidas = participacoesAtivo
      .filter((p) => p.status === "PAGO" || p.status === "ATIVO")
      .reduce((acc, p) => acc + p.numeroCotas, 0);
    const percentualCaptado = metaCaptacao > 0 ? (valorCaptado / metaCaptacao) * 100 : 0;
    return {
      id: a.id,
      ativo: a.property?.name ?? "Ativo sem imóvel",
      metaCaptacao,
      valorCaptado,
      valorReservado,
      cotasTotais: a.totalCotas,
      cotasDisponiveis: Math.max(a.totalCotas - cotasReservadas - cotasVendidas, 0),
      cotasReservadas,
      cotasVendidas,
      percentualCaptado,
      status: resolveStatus(percentualCaptado, cotasReservadas),
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Captações</h1>
          <p className="text-gray-500 mt-1">Controle de captação por ativo</p>
        </div>
        <Link href="/admin/capital/participacoes" className="text-sm font-medium text-vivant-navy hover:underline">
          Gerenciar vínculos investidor x ativo
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {linhas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Nenhum ativo disponível para captação.
            </CardContent>
          </Card>
        ) : (
          linhas.map((item) => (
            <Card key={item.id} className="border border-gray-200">
              <CardHeader>
                <CardTitle className="text-base text-vivant-navy">{item.ativo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
                  <div><span className="text-gray-500">Meta de captação</span><p className="font-semibold">{fmt(item.metaCaptacao)}</p></div>
                  <div><span className="text-gray-500">Valor captado</span><p className="font-semibold">{fmt(item.valorCaptado)}</p></div>
                  <div><span className="text-gray-500">Valor reservado</span><p className="font-semibold">{fmt(item.valorReservado)}</p></div>
                  <div><span className="text-gray-500">Cotas</span><p className="font-semibold">{item.cotasTotais}</p></div>
                  <div><span className="text-gray-500">Status</span><p className="font-semibold">{item.status}</p></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-gray-600">
                  <p>Disponíveis: {item.cotasDisponiveis}</p>
                  <p>Reservadas: {item.cotasReservadas}</p>
                  <p>Confirmadas/vendidas: {item.cotasVendidas}</p>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full bg-vivant-green" style={{ width: `${Math.max(0, Math.min(100, item.percentualCaptado))}%` }} />
                </div>
                <p className="text-xs text-gray-500">{item.percentualCaptado.toFixed(2)}% captado</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
