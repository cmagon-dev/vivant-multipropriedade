"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Pin, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Aviso {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: string;
  prioridade: string;
  fixada: boolean;
  createdAt: string;
}

export default function AvisosPage() {
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAvisos() {
      try {
        const response = await fetch("/api/cotistas/me/avisos?limit=50");
        if (response.ok) {
          const data = await response.json();
          setAvisos(data.avisos || []);
        }
      } catch (error) {
        console.error("Erro ao carregar avisos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadAvisos();
  }, []);

  const getPriorityColor = (prioridade: string) => {
    const colors: Record<string, string> = {
      URGENTE: "bg-red-50 border-red-200 text-red-900",
      ALTA: "bg-orange-50 border-orange-200 text-orange-900",
      NORMAL: "bg-blue-50 border-blue-200 text-blue-900",
      BAIXA: "bg-slate-50 border-slate-200 text-slate-900",
    };
    return colors[prioridade] || colors.NORMAL;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-vivant-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">
          Mural de Avisos
        </h1>
        <p className="text-[#1A2F4B]/70">
          Comunicados e informações importantes
        </p>
      </div>

      {avisos.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="p-12 text-center">
            <Bell className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-[#1A2F4B]/60">Nenhum aviso no momento</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {avisos.map((aviso) => (
            <Card
              key={aviso.id}
              className={`border-2 ${getPriorityColor(aviso.prioridade)} shadow-lg`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {aviso.fixada && (
                    <Pin className="w-5 h-5 text-vivant-green flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold">{aviso.titulo}</h3>
                      <span className="px-3 py-1 bg-white rounded-full text-xs font-medium">
                        {aviso.tipo}
                      </span>
                    </div>
                    <p className="text-sm mb-3 whitespace-pre-wrap">{aviso.conteudo}</p>
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(aviso.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
