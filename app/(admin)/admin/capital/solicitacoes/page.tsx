import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Building2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
const STATUS_LABEL: Record<string, string> = {
  PENDENTE: "Pendente",
  APROVADA: "Aprovada",
  RECUSADA: "Recusada",
  PAGA: "Paga",
};

export default async function CapitalSolicitacoesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");

  const solicitacoes = await prisma.capitalLiquidityRequest.findMany({
    include: {
      investorProfile: { include: { user: { select: { name: true, email: true } } } },
      assetConfig: { include: { property: { select: { name: true } } } },
    },
    orderBy: { dataSolicitacao: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Solicitações de liquidez</h1>
        <p className="text-gray-500 mt-1">Antecipação e resgate — aprovar ou recusar</p>
      </div>

      {solicitacoes.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Nenhuma solicitação.
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
                      <h3 className="text-lg font-semibold text-vivant-navy">{s.investorProfile.user.name}</h3>
                      <p className="text-sm text-gray-600">{s.investorProfile.user.email}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-4 h-4" />
                          {s.assetConfig.property.name}
                        </span>
                        <span>{s.tipoSolicitacao}</span>
                        <span>{fmt(Number(s.valorSolicitado))}</span>
                        <span>{format(new Date(s.dataSolicitacao), "dd/MM/yyyy", { locale: ptBR })}</span>
                        <span className={`px-2 py-0.5 rounded ${s.status === "PENDENTE" ? "bg-amber-100 text-amber-800" : s.status === "APROVADA" || s.status === "PAGA" ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>
                          {STATUS_LABEL[s.status] ?? s.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/admin/capital/solicitacoes/${s.id}`} className="text-sm font-medium text-vivant-navy hover:underline shrink-0">
                    Ver / decidir
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
