"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Book, FileCheck, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

function getIcon(tipo: string) {
  const icons: Record<string, typeof FileText> = {
    ESTATUTO: Book,
    REGIMENTO_INTERNO: FileCheck,
    MANUAL: FileText,
    CONTRATO: File,
  };
  return icons[tipo] || File;
}

interface Doc {
  id: string;
  titulo: string;
  tipo: string;
  versao: string;
  url: string;
  tamanhoBytes: number;
  nomeArquivo: string;
  property?: { name: string };
}

export default function DocumentosPage() {
  const [documentos, setDocumentos] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cotistas/me/documentos")
      .then((res) => (res.ok ? res.json() : { documentos: [] }))
      .then((data) => setDocumentos(data.documentos || []))
      .catch(() => setDocumentos([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">
          Biblioteca de Documentos
        </h1>
        <p className="text-[#1A2F4B]/70">
          Acesse estatutos, regimentos e documentos das suas propriedades
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
        </div>
      ) : documentos.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="py-12 text-center text-[#1A2F4B]/70">
            <FileText className="w-12 h-12 mx-auto mb-4 text-[#1A2F4B]/30" />
            <p className="font-medium">Nenhum documento disponível</p>
            <p className="text-sm mt-1">Os documentos das suas propriedades aparecerão aqui quando publicados.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentos.map((doc) => {
            const Icon = getIcon(doc.tipo);
            return (
              <Card key={doc.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-lg bg-vivant-green/10 flex items-center justify-center mb-4">
                      <Icon className="w-8 h-8 text-vivant-green" />
                    </div>
                    <h3 className="font-bold text-[#1A2F4B] mb-1">{doc.titulo}</h3>
                    {doc.property?.name && (
                      <p className="text-xs text-[#1A2F4B]/60 mb-1">{doc.property.name}</p>
                    )}
                    <p className="text-xs text-[#1A2F4B]/60 mb-1">
                      {TIPO_LABEL[doc.tipo] ?? doc.tipo} · v{doc.versao}
                    </p>
                    <p className="text-xs text-[#1A2F4B]/50 mb-4">{formatBytes(doc.tamanhoBytes)}</p>
                    <Button
                      className="w-full bg-vivant-green hover:bg-vivant-green/90"
                      size="sm"
                      asChild
                    >
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Abrir / Baixar
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
