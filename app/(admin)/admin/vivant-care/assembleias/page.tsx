import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Vote, Building2, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  AGENDADA: "Agendada",
  EM_ANDAMENTO: "Em andamento",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
};

const TIPO_LABEL: Record<string, string> = {
  ORDINARIA: "Ordinária",
  EXTRAORDINARIA: "Extraordinária",
  VIRTUAL: "Virtual",
};

export default async function VivantCareAssembleiasPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (
    !hasPermission(session as any, "vivantCare.assembleias.view") &&
    !hasPermission(session as any, "vivantCare.assembleias.manage")
  )
    redirect("/403");

  const assembleias = await prisma.assembleia.findMany({
    include: {
      property: { select: { id: true, name: true } },
      _count: { select: { pautas: true } },
    },
    orderBy: { dataRealizacao: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Assembleias</h1>
          <p className="text-gray-500 mt-1">Assembleias e pautas por propriedade</p>
        </div>
        {hasPermission(session as any, "vivantCare.assembleias.manage") && (
          <Link
            href="/admin/vivant-care/assembleias/nova"
            className="inline-flex items-center justify-center rounded-md bg-vivant-navy px-4 py-2 text-sm font-medium text-white hover:bg-vivant-navy/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova assembleia
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {assembleias.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Nenhuma assembleia cadastrada.
            </CardContent>
          </Card>
        ) : (
          assembleias.map((a) => (
            <Card key={a.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                    <Vote className="w-5 h-5 text-vivant-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={"/admin/vivant-care/assembleias/" + a.id} className="text-lg font-semibold text-vivant-navy hover:underline">
                      {a.titulo}
                    </Link>
                    <p className="text-sm text-gray-600 mt-0.5 line-clamp-1">{a.descricao}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {a.property?.name ?? "—"}
                      </span>
                      <span>{TIPO_LABEL[a.tipo] ?? a.tipo}</span>
                      <span>{format(new Date(a.dataRealizacao), "dd MMM yyyy HH:mm", { locale: ptBR })}</span>
                      <span>{a._count.pautas} pauta(s)</span>
                      <span className={`px-2 py-0.5 rounded ${a.status === "FINALIZADA" ? "bg-green-100 text-green-700" : a.status === "CANCELADA" ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-800"}`}>
                        {STATUS_LABEL[a.status] ?? a.status}
                      </span>
                    </div>
                    <Link href={"/admin/vivant-care/assembleias/" + a.id + "/editar"} className="text-sm text-vivant-navy hover:underline mt-2 inline-block">
                      Editar
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
