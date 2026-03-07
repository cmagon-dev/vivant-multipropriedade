import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Plus, Users, FileText, Bell } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function VivantCarePropriedadesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (
    !hasPermission(session as any, "vivantCare.propriedades.view") &&
    !hasPermission(session as any, "vivantCare.propriedades.manage")
  )
    redirect("/403");

  const propriedades = await prisma.property.findMany({
    include: {
      destino: { select: { id: true, name: true } },
      cotas: {
        include: {
          cotista: { select: { id: true, name: true, email: true } },
        },
      },
      _count: {
        select: { cotas: true, mensagens: true, documentos: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Propriedades</h1>
          <p className="text-gray-500 mt-1">
            Propriedades do portal do cotista e vínculo com cotas
          </p>
        </div>
        <Link href="/admin/vivant-care/propriedades/nova">
          <span className="inline-flex items-center justify-center rounded-md bg-vivant-navy px-4 py-2 text-sm font-medium text-white hover:bg-vivant-navy/90">
            <Plus className="w-4 h-4 mr-2" />
            Nova propriedade
          </span>
        </Link>
      </div>

      <div className="grid gap-4">
        {propriedades.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Nenhuma propriedade cadastrada.
            </CardContent>
          </Card>
        ) : (
          propriedades.map((prop) => (
            <Card key={prop.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-vivant-navy" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-vivant-navy">
                        {prop.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {prop.destino?.name} · {prop.cidade}
                      </p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {prop._count.cotas} cota(s)
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Bell className="w-4 h-4" />
                          {prop._count.mensagens} aviso(s)
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {prop._count.documentos} documento(s)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={`/admin/vivant-care/propriedades/${prop.id}`}
                      className="text-sm font-medium text-vivant-navy hover:underline"
                    >
                      Ver detalhes
                    </Link>
                    <span className="text-gray-300">|</span>
                    <Link
                      href={`/admin/vivant-care/propriedades/${prop.id}/calendario`}
                      className="text-sm font-medium text-vivant-navy hover:underline"
                    >
                      Calendário
                    </Link>
                  </div>
                </div>
                {prop.cotas.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Cotistas vinculados
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {prop.cotas.map((cota) => (
                        <span
                          key={cota.id}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm text-gray-700"
                        >
                          <Users className="w-3 h-3" />
                          {cota.cotista?.name ?? "—"} ({cota.numeroCota})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
