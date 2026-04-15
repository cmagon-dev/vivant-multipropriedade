import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { WeekExchangeRequestStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<WeekExchangeRequestStatus, string> = {
  REQUESTED: "Solicitada",
  UNDER_ADMIN_REVIEW: "Em análise",
  ADMIN_OPTION_FOUND: "Opção encontrada",
  PUBLISHED_TO_PEERS: "Publicada aos pares",
  PEER_INTEREST_FOUND: "Interesse de par",
  NEGOTIATION_IN_PROGRESS: "Em negociação",
  PENDING_ADMIN_APPROVAL: "Aguardando aprovação",
  APPROVED: "Aprovada",
  REJECTED: "Rejeitada",
  EXPIRED: "Expirada",
  CANCELLED: "Cancelada",
};

function statusClass(status: WeekExchangeRequestStatus) {
  if (status === "APPROVED") return "bg-green-100 text-green-700";
  if (status === "REJECTED" || status === "CANCELLED" || status === "EXPIRED")
    return "bg-gray-100 text-gray-600";
  return "bg-amber-100 text-amber-800";
}

export default async function VivantCareTrocasPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (
    !hasPermission(session as any, "vivantCare.trocas.view") &&
    !hasPermission(session as any, "vivantCare.trocas.manage")
  )
    redirect("/403");

  const trocas = await prisma.weekExchangeRequest.findMany({
    include: {
      cotista: { select: { id: true, name: true, email: true } },
      property: { select: { name: true } },
      ownedWeek: true,
      desiredWeek: true,
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Troca de Semanas</h1>
        <p className="text-gray-500 mt-1">
          Solicitações de troca entre semanas oficiais do calendário
        </p>
      </div>
      <div className="space-y-4">
        {trocas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Nenhuma solicitação de troca.
            </CardContent>
          </Card>
        ) : (
          trocas.map((t) => (
            <Card key={t.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                    <ArrowRightLeft className="w-5 h-5 text-vivant-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={"/admin/vivant-care/trocas/" + t.id}
                      className="text-lg font-semibold text-vivant-navy hover:underline"
                    >
                      {t.cotista?.name ?? "—"}
                    </Link>
                    <p className="text-sm text-gray-600">{t.cotista?.email}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{format(new Date(t.createdAt), "dd MMM yyyy", { locale: ptBR })}</span>
                      {t.property?.name && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {t.property.name}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded ${statusClass(t.status)}`}>
                        {STATUS_LABEL[t.status] ?? t.status}
                      </span>
                    </div>
                    {t.ownedWeek && (
                      <p className="text-sm text-gray-600 mt-2">
                        Oferece: semana {t.ownedWeek.weekIndex} ·{" "}
                        {format(new Date(t.ownedWeek.startDate), "dd/MM/yyyy", { locale: ptBR })} →{" "}
                        {format(new Date(t.ownedWeek.endDate), "dd/MM/yyyy", { locale: ptBR })}
                        {t.desiredWeek
                          ? ` · deseja: semana ${t.desiredWeek.weekIndex}`
                          : ""}
                      </p>
                    )}
                    {t.notes && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{t.notes}</p>
                    )}
                  </div>
                  <Link
                    href={"/admin/vivant-care/trocas/" + t.id}
                    className="text-sm font-medium text-vivant-navy hover:underline shrink-0"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
