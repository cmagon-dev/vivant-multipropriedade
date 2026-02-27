"use client";

import { useState } from "react";
import { Printer, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton() {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printed, setPrinted] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setPrinted(false);
    
    // Aguarda um momento para garantir que todos os estilos foram aplicados
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
      setPrinted(true);
      
      // Reset do feedback após 3 segundos
      setTimeout(() => {
        setPrinted(false);
      }, 3000);
    }, 100);
  };

  return (
    <div className="no-print">
      <Button
        onClick={handlePrint}
        disabled={isPrinting}
        size="lg"
        className="bg-gradient-to-r from-vivant-gold to-yellow-600 hover:from-vivant-gold/90 hover:to-yellow-600/90 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
      >
        {isPrinting ? (
          <>
            <Printer className="w-5 h-5 mr-2 animate-pulse" />
            Preparando...
          </>
        ) : printed ? (
          <>
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Pronto!
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2" />
            Gerar PDF / Imprimir
          </>
        )}
      </Button>
      
      {!isPrinting && !printed && (
        <p className="text-xs text-[#1A2F4B]/60 mt-2 text-center max-w-xs">
          Dica: Ative "Gráficos de fundo" para preservar todas as cores
        </p>
      )}
    </div>
  );
}
