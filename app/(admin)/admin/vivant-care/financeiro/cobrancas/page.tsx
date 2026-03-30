import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FileCheck2, ExternalLink, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MarcarCobrancaPagaButton } from "@/components/admin/marcar-cobranca-paga-button";

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

/** Cor do card inteiro: facilita escanear a lista (comprovante + status). */
function cobrancaCardTone(c: { status: string; urlComprovante: string | null }) {
  const hasComp = !!c.urlComprovante;
  const precisaAnalisar =
    hasComp && (c.status === "PENDENTE" || c.status === "VENCIDA");

  if (precisaAnalisar) {
    return "border-2 border-emerald-500 bg-emerald-100/90 shadow-md ring-1 ring-emerald-200/80";
  }
  if (hasComp) {
    return "border-2 border-teal-400 bg-teal-50/95 shadow-sm";
  }
  switch (c.status) {
    case "VENCIDA":
      return "border-2 border-red-400 bg-red-50/90 shadow-sm";
    case "PENDENTE":
      return "border border-gray-200 bg-white";
    case "PAGA":
    case "PAGA_PARCIAL":
      return "border-2 border-green-400 bg-green-50/80 shadow-sm";
    case "CANCELADA":
      return "border-2 border-slate-300 bg-slate-100/80";
    default:
      return "border border-gray-200 bg-white";
  }
}

interface SearchParams {
  status?: string;
  /** "1" = só cobranças que já têm arquivo de comprovante enviado pelo cotista */
  comprovante?: string;
  /** Filtra cobranças de cotas desta propriedade (vem de Situação por casa) */
  propertyId?: string;
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

  const soComComprovante = searchParams.comprovante === "1";

  const propertyMeta = searchParams.propertyId
    ? await prisma.property.findUnique({
        where: { id: searchParams.propertyId },
        select: { id: true, name: true },
      })
    : null;
  const propertyId = propertyMeta?.id;

  const whereCotaProp = propertyId ? { cota: { propertyId } } : {};

  const whereCobrancas = {
    ...whereCotaProp,
    ...(statusFilter ? { status: statusFilter } : {}),
    ...(soComComprovante ? { urlComprovante: { not: null } as const } : {}),
  };

  const whereBaseCounts = propertyId ? { cota: { propertyId } } : {};

  const [
    cobrancas,
    totalPendentes,
    totalVencidas,
    totalComComprovante,
    aguardandoAnaliseComprovante,
  ] = await Promise.all([
    prisma.cobranca.findMany({
      where: Object.keys(whereCobrancas).length ? whereCobrancas : undefined,
      include: {
        cota: {
          include: {
            cotista: { select: { id: true, name: true, email: true } },
            property: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: [{ updatedAt: "desc" }, { dataVencimento: "desc" }],
      take: 150,
    }),
    prisma.cobranca.count({
      where: { ...whereBaseCounts, status: "PENDENTE" },
    }),
    prisma.cobranca.count({
      where: { ...whereBaseCounts, status: "VENCIDA" },
    }),
    prisma.cobranca.count({
      where: { ...whereBaseCounts, urlComprovante: { not: null } },
    }),
    prisma.cobranca.count({
      where: {
        ...whereBaseCounts,
        urlComprovante: { not: null },
        status: { in: ["PENDENTE", "VENCIDA"] },
      },
    }),
  ]);

  const invalidPropertyFilter =
    !!searchParams.propertyId && !propertyMeta;

  const financeiroQs = (opts: {
    status?: (typeof validStatuses)[number];
    comprovante?: boolean;
  }) => {
    const p = new URLSearchParams();
    if (propertyId) p.set("propertyId", propertyId);
    if (opts.status) p.set("status", opts.status);
    if (opts.comprovante) p.set("comprovante", "1");
    const s = p.toString();
    return s ? `?${s}` : "";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Financeiro</h1>
        <p className="text-gray-500 mt-1">
          Cobranças, pagamentos e comprovantes enviados pelos cotistas pelo portal
        </p>
        {invalidPropertyFilter && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 mt-3">
            O filtro de propriedade na URL é inválido ou o imóvel não existe.{" "}
            <Link
              href="/admin/vivant-care/financeiro/cobrancas"
              className="font-medium underline underline-offset-2"
            >
              Remover filtro
            </Link>
          </p>
        )}
        {propertyMeta && (
          <div className="flex flex-wrap items-center gap-2 mt-3 text-sm text-gray-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <span>
              Filtrando por:{" "}
              <strong className="text-vivant-navy">{propertyMeta.name}</strong>
            </span>
            <span className="text-gray-400">·</span>
            <Link
              href="/admin/vivant-care/financeiro/por-propriedade"
              className="text-vivant-green font-medium hover:underline"
            >
              Situação por casa
            </Link>
            <span className="text-gray-400">·</span>
            <Link
              href="/admin/vivant-care/financeiro/cobrancas"
              className="text-gray-600 hover:text-vivant-navy underline underline-offset-2"
            >
              Limpar filtro desta casa
            </Link>
          </div>
        )}
      </div>

      {aguardandoAnaliseComprovante > 0 && (
        <Card className="border-vivant-green/40 bg-vivant-green/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-vivant-navy">
              <Inbox className="h-5 w-5 text-vivant-green" />
              Comprovantes de pagamento
            </CardTitle>
            <p className="text-sm text-gray-600 font-normal">
              {aguardandoAnaliseComprovante}{" "}
              {aguardandoAnaliseComprovante === 1
                ? "cobrança tem arquivo enviado"
                : "cobranças têm arquivo enviado"}{" "}
              e ainda estão <strong>pendentes ou vencidas</strong> — confira o comprovante e
              atualize o status ao validar o pagamento.
            </p>
          </CardHeader>
          <CardContent className="pt-0">
            <Button asChild className="bg-vivant-green hover:bg-vivant-green/90">
              <Link href={`/admin/vivant-care/financeiro/cobrancas${financeiroQs({ comprovante: true })}`}>
                <FileCheck2 className="mr-2 h-4 w-4" />
                Ver cobranças com comprovante
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
              <FileCheck2 className="h-4 w-4 text-vivant-green" />
              Com comprovante
            </p>
            <p className="text-2xl font-bold text-vivant-navy mt-1">
              {totalComComprovante}
            </p>
          </CardContent>
        </Card>
        <Card className={soComComprovante ? "ring-2 ring-vivant-green/50" : ""}>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-gray-600">Aguardando análise</p>
            <p className="text-2xl font-bold text-amber-700 mt-1">
              {aguardandoAnaliseComprovante}
            </p>
            <p className="text-xs text-gray-500 mt-1">Comprovante + status pendente/vencida</p>
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
              href={`/admin/vivant-care/financeiro/cobrancas${financeiroQs({})}`}
              className={`text-sm px-3 py-1.5 rounded-md ${!statusFilter && !soComComprovante ? "bg-vivant-navy text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Todas
            </Link>
            {(["PENDENTE", "VENCIDA", "PAGA", "CANCELADA"] as const).map((s) => (
              <Link
                key={s}
                href={`/admin/vivant-care/financeiro/cobrancas${financeiroQs(
                  soComComprovante
                    ? { status: s, comprovante: true }
                    : { status: s }
                )}`}
                className={`text-sm px-3 py-1.5 rounded-md ${statusFilter === s ? "bg-vivant-navy text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {STATUS_LABEL[s]}
              </Link>
            ))}
            <Link
              href={`/admin/vivant-care/financeiro/cobrancas${financeiroQs({
                ...(statusFilter ? { status: statusFilter } : {}),
                comprovante: true,
              })}`}
              className={`text-sm px-3 py-1.5 rounded-md inline-flex items-center gap-1 ${soComComprovante ? "bg-vivant-green text-white" : "bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-200"}`}
            >
              <FileCheck2 className="h-3.5 w-3.5" />
              Com comprovante
            </Link>
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-3 flex flex-wrap gap-x-6 gap-y-1">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-5 rounded border-2 border-emerald-500 bg-emerald-100" />
            Comprovante enviado (pendente/vencida) — revisar
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-5 rounded border-2 border-teal-400 bg-teal-50" />
            Com comprovante (outros status)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-5 rounded border-2 border-red-400 bg-red-50" />
            Vencida
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-3 w-5 rounded border-2 border-green-400 bg-green-50" />
            Paga
          </span>
        </p>
        <div className="space-y-2">
          {cobrancas.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                Nenhuma cobrança encontrada.
              </CardContent>
            </Card>
          ) : (
            cobrancas.map((c) => (
              <Card
                key={c.id}
                className={cn(
                  "overflow-hidden transition-shadow hover:shadow-lg",
                  cobrancaCardTone({
                    status: c.status,
                    urlComprovante: c.urlComprovante,
                  })
                )}
              >
                <CardContent className="py-4 px-6 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
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
                      {c.urlComprovante && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-900">
                            <FileCheck2 className="h-3 w-3" />
                            Comprovante recebido
                          </span>
                          <a
                            href={c.urlComprovante}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-vivant-green hover:underline"
                          >
                            Abrir arquivo
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
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
                  </div>
                  {hasManage &&
                    c.status !== "PAGA" &&
                    c.status !== "CANCELADA" && (
                      <div className="flex flex-wrap items-center gap-3 border-t border-gray-200/70 pt-3">
                        <MarcarCobrancaPagaButton
                          cobrancaId={c.id}
                          status={c.status}
                          temComprovante={!!c.urlComprovante}
                        />
                        <span className="text-xs text-gray-500">
                          {c.urlComprovante
                            ? "Use após conferir o comprovante."
                            : "Também sem comprovante, se o pagamento foi confirmado por outro meio."}
                        </span>
                      </div>
                    )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
