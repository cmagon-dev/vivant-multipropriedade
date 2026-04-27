import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Building2, Pencil } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AvisoDeleteButton } from "@/components/admin/aviso-delete-button";

export const dynamic = "force-dynamic";

const TIPO_LABEL: Record<string, string> = {
  AVISO: "Aviso",
  COMUNICADO: "Comunicado",
  URGENTE: "Urgente",
  MANUTENCAO: "Manutenção",
  EVENTO: "Evento",
  LEMBRETE: "Lembrete",
};

const TARGET_LABEL: Record<string, string> = {
  CASA: "Casa",
  COTISTA: "Cotista",
  CONDOMINIO: "Condomínio",
  DESTINO: "Destino",
};

export default async function VivantCareAvisosPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (
    !hasPermission(session as any, "vivantCare.avisos.view") &&
    !hasPermission(session as any, "vivantCare.avisos.manage")
  )
    redirect("/403");

  const avisos = await prisma.mensagem.findMany({
    include: {
      property: { select: { id: true, name: true } },
      targetCotista: { select: { id: true, name: true } },
      targetDestino: { select: { id: true, name: true } },
    },
    orderBy: [{ fixada: "desc" }, { createdAt: "desc" }],
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Avisos</h1>
        <p className="text-gray-500 mt-1">
          Comunicados e avisos por propriedade (visíveis no portal do cotista)
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div />
        <Link
          href="/admin/vivant-care/avisos/novo"
          className="inline-flex items-center justify-center rounded-md bg-vivant-navy px-4 py-2 text-sm font-medium text-white hover:bg-vivant-navy/90"
        >
          <Bell className="w-4 h-4 mr-2" />
          Novo aviso
        </Link>
      </div>

      <div className="space-y-4">
        {avisos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Nenhum aviso cadastrado.
            </CardContent>
          </Card>
        ) : (
          avisos.map((msg) => (
            <Card key={msg.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-5 h-5 text-vivant-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Link href={`/admin/vivant-care/avisos/${msg.id}`} className="text-lg font-semibold text-vivant-navy hover:underline">
                        {msg.titulo}
                      </Link>
                      {msg.fixada && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-xs font-medium">
                          Fixada
                        </span>
                      )}
                      {!msg.ativa && (
                        <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs font-medium">
                          Inativo
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {TIPO_LABEL[msg.tipo] ?? msg.tipo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {msg.conteudo}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {(() => {
                          const targetType = msg.targetType ?? "CASA";
                          if (targetType === "CASA") return `${TARGET_LABEL[targetType]}: ${msg.property?.name ?? "—"}`;
                          if (targetType === "COTISTA") return `${TARGET_LABEL[targetType]}: ${msg.targetCotista?.name ?? "—"}`;
                          if (targetType === "CONDOMINIO") return `${TARGET_LABEL[targetType]}: ${msg.targetCondominio ?? "—"}`;
                          if (targetType === "DESTINO") return `${TARGET_LABEL[targetType]}: ${msg.targetDestino?.name ?? "—"}`;
                          return msg.property?.name ?? "—";
                        })()}
                      </span>
                      <span>
                        {format(new Date(msg.createdAt), "dd MMM yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                      <span className="ml-auto inline-flex items-center gap-2 whitespace-nowrap self-center">
                        <Link
                          href={`/admin/vivant-care/avisos/${msg.id}/editar`}
                          aria-label="Editar aviso"
                          title="Editar aviso"
                          className="inline-flex h-8 w-8 items-center justify-center self-center rounded border border-gray-200 text-vivant-navy hover:bg-gray-50 leading-none"
                        >
                          <Pencil className="w-4.5 h-4.5" />
                        </Link>
                        <AvisoDeleteButton
                          avisoId={msg.id}
                          className="h-8 w-8 self-center border border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                        />
                      </span>
                    </div>
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
