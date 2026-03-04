"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Book, FileCheck, File } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentosPage() {
  const documentos = [
    {
      id: "1",
      titulo: "Estatuto Social",
      tipo: "ESTATUTO",
      versao: "1.0",
      url: "#",
      tamanho: "2.5 MB"
    },
    {
      id: "2",
      titulo: "Regimento Interno",
      tipo: "REGIMENTO_INTERNO",
      versao: "1.0",
      url: "#",
      tamanho: "1.8 MB"
    },
    {
      id: "3",
      titulo: "Manual do Cotista",
      tipo: "MANUAL",
      versao: "2.0",
      url: "#",
      tamanho: "3.2 MB"
    },
  ];

  const getIcon = (tipo: string) => {
    const icons: Record<string, any> = {
      ESTATUTO: Book,
      REGIMENTO_INTERNO: FileCheck,
      MANUAL: FileText,
      CONTRATO: File,
    };
    return icons[tipo] || File;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">
          Biblioteca de Documentos
        </h1>
        <p className="text-[#1A2F4B]/70">
          Acesse estatutos, regimentos e documentos importantes
        </p>
      </div>

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
                  <p className="text-xs text-[#1A2F4B]/60 mb-1">Versão {doc.versao}</p>
                  <p className="text-xs text-[#1A2F4B]/50 mb-4">{doc.tamanho}</p>
                  <Button className="w-full bg-vivant-green hover:bg-vivant-green/90" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Baixar PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
