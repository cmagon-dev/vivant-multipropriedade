"use client";

/**
 * Componente visual para verificar se estilos estão carregando
 * Remover em produção
 */
export function StyleChecker(): JSX.Element {
  return (
    <div className="fixed bottom-4 right-4 bg-white border-2 border-vivant-navy rounded-lg shadow-lg p-4 text-xs max-w-xs z-50">
      <div className="font-bold text-vivant-navy mb-2">
        🎨 Style Debug
      </div>
      
      <div className="space-y-1 text-slate-700">
        <div className="font-sans">
          Font Sans (Inter): ABCabc123
        </div>
        
        <div className="font-serif">
          Font Serif (Playfair): ABCabc123
        </div>
        
        <div className="text-vivant-navy">
          Vivant Navy: #1A2F4B
        </div>
        
        <div className="text-vivant-gold">
          Vivant Gold: #D4AF37
        </div>
        
        <div className="bg-vivant-navy text-white px-2 py-1 rounded mt-2">
          Background Navy
        </div>
      </div>
      
      <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
        Se não vê cores/fontes corretas, abra DevTools Console
      </div>
    </div>
  );
}
