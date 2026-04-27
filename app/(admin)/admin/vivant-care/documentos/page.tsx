import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Building2, Pencil } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DocumentoDeleteButton } from "@/components/admin/documento-delete-button";

export const dynamic = "force-dynamic";

const TIPO_LABEL: Record<string, string> = {
  ESTATUTO: "Estatuto",
  REGIMENTO_INTERNO: "Regimento Interno",
  ATA: "Ata",
  CONTRATO: "Contrato",
  MANUAL: "Manual",
  PLANTA: "Planta",
  LAUDO: "Laudo",
  OUTROS: "Outros",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function VivantCareDocumentosPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (
    !hasPermission(session as any, "vivantCare.documentos.view") &&
    !hasPermission(session as any, "vivantCare.documentos.manage")
  )
    redirect("/403");

  const documentos = await prisma.documento.findMany({
    include: {
      property: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Documentos</h1>
          <p className="text-gray-500 mt-1">
            Documentos por propriedade (visíveis no portal do cotista)
          </p>
        </div>
        <Link
          href="/admin/vivant-care/documentos/novo"
          className="inline-flex items-center justify-center rounded-md bg-vivant-navy px-4 py-2 text-sm font-medium text-white hover:bg-vivant-navy/90"
        >
          <FileText className="w-4 h-4 mr-2" />
          Novo documento
        </Link>
      </div>

      <div className="space-y-4">
        {documentos.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              Nenhum documento cadastrado.
            </CardContent>
          </Card>
        ) : (
          documentos.map((doc) => (
            <Card key={doc.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-vivant-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={"/admin/vivant-care/documentos/" + doc.id} className="text-lg font-semibold text-vivant-navy hover:underline">
                      {doc.titulo}
                    </Link>
                    {doc.descricao && (
                      <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">
                        {doc.descricao}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                      <span>
                        {TIPO_LABEL[doc.tipo] ?? doc.tipo}
                        {doc.categoria && ` · ${doc.categoria}`}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {doc.property?.name ?? "—"}
                      </span>
                      <span>{formatBytes(doc.tamanhoBytes)}</span>
                      <span>v{doc.versao}</span>
                      <span>
                        {format(new Date(doc.uploadedAt ?? doc.createdAt), "dd MMM yyyy", {
                          locale: ptBR,
                        })}
                      </span>
                      <span className="ml-auto inline-flex items-center gap-2 whitespace-nowrap self-center">
                        {!doc.ativo ? (
                          <span className="px-2.5 py-1 bg-gray-200 text-gray-600 rounded text-[11px]">
                            Inativo
                          </span>
                        ) : null}
                        <Link
                          href={"/admin/vivant-care/documentos/" + doc.id + "/editar"}
                          aria-label="Editar documento"
                          title="Editar documento"
                          className="inline-flex h-8 w-8 items-center justify-center self-center rounded border border-gray-200 text-vivant-navy hover:bg-gray-50 leading-none"
                        >
                          <Pencil className="w-4.5 h-4.5" />
                        </Link>
                        <DocumentoDeleteButton
                          documentoId={doc.id}
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
