"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Mail, User, Phone, Home, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Cotista {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  active: boolean;
  cotas: any[];
  createdAt: string;
}

export default function CotistasPage() {
  const [cotistas, setCotistas] = useState<Cotista[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCotistas() {
      try {
        const response = await fetch("/api/admin/cotistas");
        if (response.ok) {
          const data = await response.json();
          setCotistas(data.cotistas || []);
        }
      } catch (error) {
        console.error("Erro ao carregar cotistas:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCotistas();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-vivant-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-vivant-navy mb-2">
            Gestão de Cotistas
          </h1>
          <p className="text-slate-600">
            {cotistas.length} cotista{cotistas.length !== 1 ? "s" : ""} cadastrado{cotistas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild className="bg-vivant-green hover:bg-vivant-green/90">
          <Link href="/admin-portal/cotistas/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Convite
          </Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {cotistas.map((cotista) => (
          <Card key={cotista.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-vivant-green/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-vivant-green" />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-[#1A2F4B] mb-1">
                        {cotista.name}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-[#1A2F4B]/70">
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {cotista.email}
                        </span>
                        {cotista.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {cotista.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      cotista.active 
                        ? "bg-vivant-green/20 text-vivant-green" 
                        : "bg-slate-200 text-slate-600"
                    }`}>
                      {cotista.active ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  {cotista.cotas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {cotista.cotas.map((cota: any, idx: number) => (
                        <span 
                          key={idx} 
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1"
                        >
                          <Home className="w-3 h-3" />
                          {cota.property?.name} - {cota.numeroCota}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-[#1A2F4B]/50">
                    <span>
                      Cadastrado em {format(new Date(cotista.createdAt), "dd MMM yyyy", { locale: ptBR })}
                    </span>
                    <div className="flex gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin-portal/cotistas/${cotista.id}`}>
                          Ver Detalhes
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
