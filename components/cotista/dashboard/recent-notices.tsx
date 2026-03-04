"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Notice {
  id: string;
  titulo: string;
  conteudo: string;
  tipo: string;
  prioridade: string;
  createdAt: string;
}

export function RecentNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotices() {
      try {
        const response = await fetch("/api/cotistas/me/avisos?limit=3");
        if (response.ok) {
          const data = await response.json();
          setNotices(data.avisos || []);
        }
      } catch (error) {
        console.error("Erro ao carregar avisos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNotices();
  }, []);

  const getPriorityConfig = (prioridade: string) => {
    const configs = {
      URGENTE: { color: "bg-red-100 border-red-300", icon: AlertTriangle, iconColor: "text-red-600" },
      ALTA: { color: "bg-orange-100 border-orange-300", icon: AlertTriangle, iconColor: "text-orange-600" },
      NORMAL: { color: "bg-blue-100 border-blue-300", icon: Info, iconColor: "text-blue-600" },
      BAIXA: { color: "bg-slate-100 border-slate-300", icon: Info, iconColor: "text-slate-600" },
    };
    return configs[prioridade as keyof typeof configs] || configs.NORMAL;
  };

  if (loading) {
    return (
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-[#1A2F4B]">Avisos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-serif text-[#1A2F4B]">Avisos Recentes</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/avisos">Ver todos</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {notices.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-[#1A2F4B]/60">Nenhum aviso recente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notices.map((notice) => {
              const priorityConfig = getPriorityConfig(notice.prioridade);
              const PriorityIcon = priorityConfig.icon;

              return (
                <div
                  key={notice.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 ${priorityConfig.color}`}
                >
                  <div className={`w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0`}>
                    <PriorityIcon className={`w-4 h-4 ${priorityConfig.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A2F4B] text-sm mb-1">
                      {notice.titulo}
                    </p>
                    <p className="text-xs text-[#1A2F4B]/70 line-clamp-2 mb-1">
                      {notice.conteudo}
                    </p>
                    <p className="text-xs text-[#1A2F4B]/50">
                      {format(new Date(notice.createdAt), "dd MMM yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
