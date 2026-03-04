"use client";

import { useEffect, useState } from "react";
import { CalendarView } from "@/components/cotista/calendario/calendar-view";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Home } from "lucide-react";

export default function CalendarioPage() {
  const [selectedCota, setSelectedCota] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCota() {
      try {
        const response = await fetch("/api/cotistas/me/cotas");
        if (response.ok) {
          const data = await response.json();
          if (data.cotas && data.cotas.length > 0) {
            const savedPropertyId = localStorage.getItem("selectedPropertyId");
            const selected = data.cotas.find((c: any) => c.id === savedPropertyId) || data.cotas[0];
            setSelectedCota(selected);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar cota:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCota();

    const handlePropertyChange = (e: any) => {
      if (e.detail) {
        setSelectedCota(e.detail);
      }
    };

    window.addEventListener("propertyChanged", handlePropertyChange as any);
    return () => window.removeEventListener("propertyChanged", handlePropertyChange as any);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-vivant-green animate-spin mx-auto mb-4" />
          <p className="text-[#1A2F4B]/70">Carregando calendário...</p>
        </div>
      </div>
    );
  }

  if (!selectedCota) {
    return (
      <Card className="border-none shadow-lg">
        <CardContent className="p-12 text-center">
          <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold text-[#1A2F4B] mb-2">
            Nenhuma Propriedade Encontrada
          </h2>
          <p className="text-[#1A2F4B]/70">
            Você ainda não possui cotas de propriedades cadastradas.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">
          Calendário de Uso
        </h1>
        <p className="text-[#1A2F4B]/70">
          Gerencie suas semanas de uso em {selectedCota.name}
        </p>
      </div>

      <CalendarView 
        cotaId={selectedCota.id} 
        propertyId={selectedCota.property.id} 
      />
    </div>
  );
}
