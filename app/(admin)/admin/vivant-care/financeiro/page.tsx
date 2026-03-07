import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { GerarCobrancasCard } from "@/components/admin/gerar-cobrancas-card";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  VENCIDA: "Vencida",
  PAGA: "Paga",
  PAGA_PARCIAL: "Paga (parcial)",
  CANCELADA: "Cancelada",
};

const TIPO_LABEL: Record<string, string> = {
  CONDOMINIO: "Condomínio",
  LIMPEZA: "Limpeza",
  MANUTENCAO: "Manutenção",
  SEGURO: "Seguro",
  IPTU: "IPTU",
  TAXA_GESTAO: "Taxa de Gestão",
  OUTROS: "Outros",
};

interface SearchParams {
  status?: string;
}

export default async function VivantCareFinanceiroPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (
    !hasPermission(session as any, "vivantCare.financeiro.view") &&
    !hasPermission(session as any, "vivantCare.financeiro.manage")
  )
    redirect("/403");

  const hasManage = hasPermission(session as any, "vivantCare.financeiro.manage");
  const validStatuses = ["PENDENTE", "VENCIDA", "PAGA", "PAGA_PARCIAL", "CANCELADA"] as const;
  const statusFilter =
    searchParams.status && validStatuses.includes(searchParams.status as any)
      ? (searchParams.status as "PENDENTE" | "VENCIDA" | "PAGA" | "PAGA_PARCIAL" | "CANCELADA")
      : undefined;

  const [cobrancas, totalPendentes, totalVencidas] = await Promise.all([
    prisma.cobranca.findMany({
      where: statusFilter ? { status: statusFilter } : undefined,
      include: {
        cota: {
          include: {
            cotista: { select: { id: true, name: true, email: true } },
            property: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: [{ dataVencimento: "desc" }, { createdAt: "desc" }],
      take: 150,
    }),
    prisma.cobranca.count({ where: { status: "PENDENTE" } }),
    prisma.cobranca.count({ where: { status: "VENCIDA" } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Financeiro</h1>
        <p className="text-gray-500 mt-1">
          Cobranças e pagamentos do portal do cotista
        </p>
      </div>

      {hasManage && (
        <GerarCobrancasCard />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600">Pendentes</p>
            <p className="text-2xl font-bold text-vivant-navy mt-1">
              {totalPendentes}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600">Vencidas</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {totalVencidas}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="text-lg font-semibold text-vivant-navy">
            Cobranças
          </h2>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/vivant-care/financeiro"
              className={`text-sm px-3 py-1.5 rounded-md ${!statusFilter ? "bg-vivant-navy text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Todas
            </Link>
            {(["PENDENTE", "VENCIDA", "PAGA", "CANCELADA"] as const).map((s) => (
              <Link
                key={s}
                href={`/admin/vivant-care/financeiro?status=${s}`}
                className={`text-sm px-3 py-1.5 rounded-md ${statusFilter === s ? "bg-vivant-navy text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {STATUS_LABEL[s]}
              </Link>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {cobrancas.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Nenhuma cobrança encontrada.
              </CardContent>
            </Card>
          ) : (
            cobrancas.map((c) => (
              <Card key={c.id} className="border border-gray-200">
                <CardContent className="py-4 px-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-vivant-navy">
                      {c.cota.cotista?.name ?? "—"} · {c.cota.property?.name ?? "—"}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {TIPO_LABEL[c.tipo] ?? c.tipo} — {c.descricao}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Venc.: {format(new Date(c.dataVencimento), "dd/MM/yyyy", { locale: ptBR })}
                      {c.dataPagamento && (
                        <> · Pago: {format(new Date(c.dataPagamento), "dd/MM/yyyy", { locale: ptBR })}</>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-semibold text-vivant-navy">
                      R$ {Number(c.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        c.status === "PAGA" || c.status === "PAGA_PARCIAL"
                          ? "bg-green-100 text-green-700"
                          : c.status === "VENCIDA"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {STATUS_LABEL[c.status] ?? c.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
