"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Payment {
  id: string;
  tipo: string;
  descricao: string;
  valor: number;
  dataVencimento: string;
  status: string;
}

export function PendingPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      try {
        const response = await fetch("/api/cotistas/me/cobrancas?status=PENDENTE&limit=3");
        if (response.ok) {
          const data = await response.json();
          setPayments(data.cobrancas || []);
        }
      } catch (error) {
        console.error("Erro ao carregar pagamentos:", error);
      } finally {
        setLoading(false);
      }
    }

    loadPayments();
  }, []);

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      CONDOMINIO: "Condomínio",
      LIMPEZA: "Limpeza",
      MANUTENCAO: "Manutenção",
      SEGURO: "Seguro",
      IPTU: "IPTU",
      TAXA_GESTAO: "Taxa de Gestão",
      OUTROS: "Outros"
    };
    return labels[tipo] || tipo;
  };

  if (loading) {
    return (
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-serif text-[#1A2F4B]">Pagamentos Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-serif text-[#1A2F4B]">Pagamentos Pendentes</CardTitle>
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/financeiro">Ver todos</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-[#1A2F4B]/60">Nenhum pagamento pendente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((payment) => {
              const isOverdue = new Date(payment.dataVencimento) < new Date();

              return (
                <div
                  key={payment.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                    isOverdue 
                      ? "bg-red-50 border-red-200" 
                      : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isOverdue ? "bg-red-100" : "bg-orange-100"
                  }`}>
                    {isOverdue ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <DollarSign className="w-5 h-5 text-orange-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#1A2F4B] text-sm mb-0.5">
                      {getTipoLabel(payment.tipo)}
                    </p>
                    <p className="text-xs text-[#1A2F4B]/60 mb-1">
                      {payment.descricao}
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-[#1A2F4B]">
                        R$ {payment.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                      <p className={`text-xs ${isOverdue ? "text-red-600 font-medium" : "text-[#1A2F4B]/60"}`}>
                        {isOverdue ? "Vencido em " : "Vence em "}
                        {format(new Date(payment.dataVencimento), "dd/MM/yy")}
                      </p>
                    </div>
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
