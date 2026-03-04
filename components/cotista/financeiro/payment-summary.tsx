"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle2, Clock } from "lucide-react";

interface PaymentSummaryProps {
  pendentes: number;
  vencidas: number;
  pagas: number;
  totalPendente: number;
  totalVencido: number;
}

export function PaymentSummary({ 
  pendentes, 
  vencidas, 
  pagas, 
  totalPendente,
  totalVencido 
}: PaymentSummaryProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-none shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#1A2F4B]/60 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">{pendentes}</p>
              <p className="text-xs text-[#1A2F4B]/50 mt-1">
                R$ {totalPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#1A2F4B]/60 mb-1">Vencidas</p>
              <p className="text-2xl font-bold text-red-600">{vencidas}</p>
              <p className="text-xs text-[#1A2F4B]/50 mt-1">
                R$ {totalVencido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#1A2F4B]/60 mb-1">Pagas</p>
              <p className="text-2xl font-bold text-vivant-green">{pagas}</p>
              <p className="text-xs text-[#1A2F4B]/50 mt-1">Este ano</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-vivant-green/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-vivant-green" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-lg">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#1A2F4B]/60 mb-1">Total do Ano</p>
              <p className="text-2xl font-bold text-[#1A2F4B]">{pendentes + vencidas + pagas}</p>
              <p className="text-xs text-[#1A2F4B]/50 mt-1">Cobranças</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-slate-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
