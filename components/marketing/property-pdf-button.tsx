"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import type { PropertyPDFData } from "@/lib/utils/pdf-property";

interface PropertyPDFButtonProps {
  data: PropertyPDFData;
}

export function PropertyPDFButton({ data }: PropertyPDFButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const { generatePropertyPresentation } = await import(
        "@/lib/utils/pdf-property"
      );
      await generatePropertyPresentation(data);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      variant="outline"
      className="w-full border-2 border-vivant-navy text-vivant-navy hover:bg-vivant-navy hover:text-white transition-colors"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Gerando PDF...
        </>
      ) : (
        <>
          <Download className="w-4 h-4 mr-2" />
          Baixar Apresentação PDF
        </>
      )}
    </Button>
  );
}
