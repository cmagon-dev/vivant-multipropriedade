import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Building2, MapPin } from "lucide-react";

export const dynamic = "force-dynamic";

type Agg = {
  propertyId: string;
  name: string;
  location: string;
  total: number;
  pendentes: number;
  vencidas: number;
  pagas: number;
  outras: number;
  valorEmAberto: number;
  comprovanteAguardando: number;
};

export default async function FinanceiroPorPropriedadePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (
    !hasPermission(session as any, "vivantCare.financeiro.view") &&
    !hasPermission(session as any, "vivantCare.financeiro.manage")
  )
    redirect("/403");

  const [properties, cobrancas] = await Promise.all([
    prisma.property.findMany({
      where: {
        cotas: { some: { ativo: true } },
      },
      select: { id: true, name: true, location: true },
      orderBy: { name: "asc" },
    }),
    prisma.cobranca.findMany({
      select: {
        status: true,
        valor: true,
        urlComprovante: true,
        cota: { select: { propertyId: true } },
      },
    }),
  ]);

  const map = new Map<string, Agg>();
  for (const p of properties) {
    map.set(p.id, {
      propertyId: p.id,
      name: p.name,
      location: p.location,
      total: 0,
      pendentes: 0,
      vencidas: 0,
      pagas: 0,
      outras: 0,
      valorEmAberto: 0,
      comprovanteAguardando: 0,
    });
  }

  for (const c of cobrancas) {
    const pid = c.cota.propertyId;
    const row = map.get(pid);
    if (!row) continue;

    row.total += 1;
    const valor = Number(c.valor);

    switch (c.status) {
      case "PENDENTE":
        row.pendentes += 1;
        row.valorEmAberto += valor;
        break;
      case "VENCIDA":
        row.vencidas += 1;
        row.valorEmAberto += valor;
        break;
      case "PAGA":
      case "PAGA_PARCIAL":
        row.pagas += 1;
        break;
      default:
        row.outras += 1;
        break;
    }

    if (
      c.urlComprovante &&
      (c.status === "PENDENTE" || c.status === "VENCIDA")
    ) {
      row.comprovanteAguardando += 1;
    }
  }

  const rows = Array.from(map.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR")
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Situação por casa</h1>
        <p className="text-gray-500 mt-1 max-w-3xl">
          Resumo financeiro <strong>por propriedade</strong>: cobranças em aberto, pagas e
          comprovantes aguardando análise. Abra o detalhe no Financeiro filtrado por imóvel.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild>
          <Link href="/admin/vivant-care/financeiro/cobrancas">
            Ir para Financeiro (todas as cobranças)
          </Link>
        </Button>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Nenhuma propriedade com cotas ativas.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((r) => (
            <Card
              key={r.propertyId}
              className="border border-gray-200 shadow-sm hover:border-vivant-green/40 transition-colors"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start gap-2 text-lg text-vivant-navy">
                  <Building2 className="h-5 w-5 text-vivant-green shrink-0 mt-0.5" />
                  <span className="leading-tight">{r.name}</span>
                </CardTitle>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {r.location}
                </p>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-md bg-slate-50 py-2">
                    <p className="text-2xl font-bold text-vivant-navy">{r.total}</p>
                    <p className="text-[11px] text-gray-600">Cobranças</p>
                  </div>
                  <div className="rounded-md bg-amber-50 py-2">
                    <p className="text-2xl font-bold text-amber-800">
                      {r.pendentes + r.vencidas}
                    </p>
                    <p className="text-[11px] text-gray-600">Em aberto</p>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-700">
                  <dt>Pendentes</dt>
                  <dd className="font-medium text-right">{r.pendentes}</dd>
                  <dt>Vencidas</dt>
                  <dd className="font-medium text-right text-red-700">{r.vencidas}</dd>
                  <dt>Pagas</dt>
                  <dd className="font-medium text-right text-green-700">{r.pagas}</dd>
                  {r.outras > 0 && (
                    <>
                      <dt>Outras</dt>
                      <dd className="font-medium text-right">{r.outras}</dd>
                    </>
                  )}
                </dl>
                <div className="border-t pt-2">
                  <p className="text-xs text-gray-500">Valor em aberto (pend. + venc.)</p>
                  <p className="text-lg font-semibold text-vivant-navy">
                    R${" "}
                    {r.valorEmAberto.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>
                {r.comprovanteAguardando > 0 && (
                  <p className="text-xs rounded-md bg-emerald-50 text-emerald-900 px-2 py-1.5 border border-emerald-100">
                    <strong>{r.comprovanteAguardando}</strong> com comprovante enviado aguardando
                    confirmação
                  </p>
                )}
                <Button asChild className="w-full bg-vivant-green hover:bg-vivant-green/90" size="sm">
                  <Link
                    href={`/admin/vivant-care/financeiro/cobrancas?propertyId=${encodeURIComponent(r.propertyId)}`}
                  >
                    Ver cobranças desta casa
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="ghost" asChild className="w-full text-xs text-gray-600" size="sm">
                  <Link href={`/admin/vivant-care/propriedades/${r.propertyId}`}>
                    Ficha da propriedade
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
