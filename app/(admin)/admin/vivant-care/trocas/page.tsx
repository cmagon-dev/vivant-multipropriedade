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

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  ABERTA: "Aberta",
  EM_NEGOCIACAO: "Em negociação",
  ACEITA: "Aceita",
  CONCLUIDA: "Concluída",
  CANCELADA: "Cancelada",
  EXPIRADA: "Expirada",
};

export default async function VivantCareTrocasPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "vivantCare.trocas.view") && !hasPermission(session as any, "vivantCare.trocas.manage"))
    redirect("/403");

  const trocas = await prisma.trocaSemana.findMany({
    include: {
      solicitante: { select: { id: true, name: true, email: true } },
      reservas: { take: 1, include: { cota: { include: { property: { select: { name: true } } } } } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Troca de Semanas</h1>
        <p className="text-gray-500 mt-1">Solicitações de troca de semanas</p>
      </div>
      <div className="space-y-4">
        {trocas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">Nenhuma solicitação de troca.</CardContent>
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
                    <Link href={"/admin/vivant-care/trocas/" + t.id} className="text-lg font-semibold text-vivant-navy hover:underline">
                      {t.solicitante?.name ?? "—"}
                    </Link>
                    <p className="text-sm text-gray-600">{t.solicitante?.email}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>{format(new Date(t.createdAt), "dd MMM yyyy", { locale: ptBR })}</span>
                      {t.reservas?.[0]?.cota?.property?.name && (
                        <span className="inline-flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {t.reservas[0].cota.property.name}
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded ${t.status === "CONCLUIDA" ? "bg-green-100 text-green-700" : t.status === "CANCELADA" || t.status === "EXPIRADA" ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-800"}`}>
                        {STATUS_LABEL[t.status] ?? t.status}
                      </span>
                    </div>
                    {t.observacoes && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{t.observacoes}</p>}
                  </div>
                  <Link href={"/admin/vivant-care/trocas/" + t.id} className="text-sm font-medium text-vivant-navy hover:underline shrink-0">
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
