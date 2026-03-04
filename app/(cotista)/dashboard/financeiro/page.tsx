"use client";

import { useEffect, useState } from "react";
import { PaymentSummary } from "@/components/cotista/financeiro/payment-summary";
import { ChargeCard } from "@/components/cotista/financeiro/charge-card";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Cobranca {
  id: string;
  tipo: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
  dataPagamento?: string;
  status: string;
  urlBoleto?: string;
  property: {
    name: string;
  };
}

export default function FinanceiroPage() {
  const [cobrancas, setCobrancas] = useState<Cobranca[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState<string | null>(null);

  useEffect(() => {
    async function loadCobrancas() {
      try {
        const url = filtro 
          ? `/api/cotistas/me/cobrancas?status=${filtro}&limit=50`
          : "/api/cotistas/me/cobrancas?limit=50";
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setCobrancas(data.cobrancas || []);
        }
      } catch (error) {
        console.error("Erro ao carregar cobranças:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCobrancas();
  }, [filtro]);

  const pendentes = cobrancas.filter(c => c.status === "PENDENTE");
  const vencidas = cobrancas.filter(c => c.status === "VENCIDA");
  const pagas = cobrancas.filter(c => c.status === "PAGA");

  const totalPendente = pendentes.reduce((sum, c) => sum + c.valor, 0);
  const totalVencido = vencidas.reduce((sum, c) => sum + c.valor, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-vivant-green animate-spin mx-auto mb-4" />
          <p className="text-[#1A2F4B]/70">Carregando informações financeiras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">
          Financeiro
        </h1>
        <p className="text-[#1A2F4B]/70">
          Acompanhe suas cobranças e pagamentos
        </p>
      </div>

      <PaymentSummary
        pendentes={pendentes.length}
        vencidas={vencidas.length}
        pagas={pagas.length}
        totalPendente={totalPendente}
        totalVencido={totalVencido}
      />

      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-serif font-bold text-[#1A2F4B]">
              Minhas Cobranças
            </h2>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={filtro === null ? "default" : "outline"}
                onClick={() => setFiltro(null)}
              >
                Todas
              </Button>
              <Button
                size="sm"
                variant={filtro === "PENDENTE" ? "default" : "outline"}
                onClick={() => setFiltro("PENDENTE")}
              >
                Pendentes
              </Button>
              <Button
                size="sm"
                variant={filtro === "VENCIDA" ? "default" : "outline"}
                onClick={() => setFiltro("VENCIDA")}
              >
                Vencidas
              </Button>
              <Button
                size="sm"
                variant={filtro === "PAGA" ? "default" : "outline"}
                onClick={() => setFiltro("PAGA")}
              >
                Pagas
              </Button>
            </div>
          </div>

          {cobrancas.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-[#1A2F4B]/60">
                {filtro ? "Nenhuma cobrança com este filtro" : "Nenhuma cobrança encontrada"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cobrancas.map((charge) => (
                <ChargeCard key={charge.id} charge={charge} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
