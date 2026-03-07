"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft, Edit, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DocumentoDetalhePage() {
  const params = useParams();
  const id = params.id as string;
  const [doc, setDoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/documentos/" + id)
      .then((res) => (res.ok ? res.json() : null))
      .then(setDoc)
      .catch(() => setDoc(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-10 h-10 text-vivant-navy animate-spin" />
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Documento não encontrado.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/vivant-care/documentos">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/vivant-care/documentos">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-vivant-navy">{doc.titulo}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {doc.property?.name ?? "-"}
              </span>
              <span>{TIPO_LABEL[doc.tipo] ?? doc.tipo}</span>
              {doc.categoria && <span>{doc.categoria}</span>}
              <span>{formatBytes(doc.tamanhoBytes)}</span>
              <span>v{doc.versao}</span>
              {!doc.ativo && <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded">Inativo</span>}
              <span>{format(new Date(doc.uploadedAt ?? doc.createdAt), "dd MMM yyyy", { locale: ptBR })}</span>
            </div>
          </div>
        </div>
        <Button asChild className="bg-vivant-green hover:bg-vivant-green/90">
          <Link href={"/admin/vivant-care/documentos/" + doc.id + "/editar"}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {doc.descricao && <p className="text-gray-700 mb-4">{doc.descricao}</p>}
          <p className="text-sm text-gray-500 mb-2">Arquivo: {doc.nomeArquivo}</p>
          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-vivant-navy font-medium hover:underline">
            <FileText className="w-4 h-4" />
            Abrir documento
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
