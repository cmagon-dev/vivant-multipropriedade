"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

const fmt = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);
const STATUS_OPTIONS = ["RASCUNHO", "APROVADA", "PAGA"] as const;

type Item = {
  id: string;
  investorProfile: { user: { name: string; email: string } };
  percentualAplicado: number;
  valorDevido: number;
  valorPago: number;
  status: string;
};

type Dist = {
  id: string;
  competencia: string;
  receitaBruta: number;
  custos: number;
  resultadoDistribuivel: number;
  valorTotalDistribuido: number;
  status: string;
  items: Item[];
};

export function DistribuicaoDetailClient({ dist }: { dist: Dist }) {
  const router = useRouter();
  const [status, setStatus] = useState(dist.status);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/capital/distribuicoes/${dist.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatus(newStatus);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Resumo</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>Receita bruta: {fmt(dist.receitaBruta)}</p>
          <p>Custos: {fmt(dist.custos)}</p>
          <p>Resultado distribuível: {fmt(dist.resultadoDistribuivel)}</p>
          <p>Valor total distribuído: {fmt(dist.valorTotalDistribuido)}</p>
          <p>Status: <span className="font-medium">{status}</span></p>
          {STATUS_OPTIONS.indexOf(status as (typeof STATUS_OPTIONS)[number]) < STATUS_OPTIONS.length - 1 && (
            <div className="flex gap-2 pt-2">
              {status === "RASCUNHO" && (
                <Button size="sm" disabled={loading} onClick={() => updateStatus("APROVADA")}>
                  Aprovar
                </Button>
              )}
              {status === "APROVADA" && (
                <Button size="sm" disabled={loading} onClick={() => updateStatus("PAGA")}>
                  Marcar como paga
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Itens por investidor</h2>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investidor</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Valor devido</TableHead>
                <TableHead>Valor pago</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dist.items.map((i) => (
                <TableRow key={i.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{i.investorProfile.user.name}</p>
                      <p className="text-xs text-gray-500">{i.investorProfile.user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{i.percentualAplicado.toFixed(2)}%</TableCell>
                  <TableCell>{fmt(i.valorDevido)}</TableCell>
                  <TableCell>{fmt(i.valorPago)}</TableCell>
                  <TableCell>{i.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
