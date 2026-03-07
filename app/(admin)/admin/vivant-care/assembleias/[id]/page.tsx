"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft, Edit, Loader2, Vote, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const STATUS_LABEL: Record<string, string> = {
  AGENDADA: "Agendada",
  EM_ANDAMENTO: "Em andamento",
  FINALIZADA: "Finalizada",
  CANCELADA: "Cancelada",
};

const TIPO_LABEL: Record<string, string> = {
  ORDINARIA: "Ordinária",
  EXTRAORDINARIA: "Extraordinária",
  VIRTUAL: "Virtual",
};

const TIPO_PAUTA: Record<string, string> = {
  INFORMATIVA: "Informativa",
  DELIBERATIVA: "Deliberativa",
  ELETIVA: "Eletiva",
};

export default function AssembleiaDetalhePage() {
  const params = useParams();
  const id = params.id as string;
  const [a, setA] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/assembleias/" + id)
      .then((res) => (res.ok ? res.json() : null))
      .then(setA)
      .catch(() => setA(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-10 h-10 text-vivant-navy animate-spin" />
      </div>
    );
  }

  if (!a) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Assembleia não encontrada.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/vivant-care/assembleias">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/vivant-care/assembleias">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-vivant-navy">{a.titulo}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {a.property?.name ?? "-"}
              </span>
              <span>{TIPO_LABEL[a.tipo] ?? a.tipo}</span>
              <span>{format(new Date(a.dataRealizacao), "dd MMM yyyy HH:mm", { locale: ptBR })}</span>
              <span className={`px-2 py-0.5 rounded ${a.status === "FINALIZADA" ? "bg-green-100 text-green-700" : a.status === "CANCELADA" ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-800"}`}>
                {STATUS_LABEL[a.status] ?? a.status}
              </span>
            </div>
          </div>
        </div>
        <Button asChild className="bg-vivant-green hover:bg-vivant-green/90">
          <Link href={"/admin/vivant-care/assembleias/" + a.id + "/editar"}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-vivant-navy mb-2">Descrição</h3>
          <p className="whitespace-pre-wrap text-gray-700">{a.descricao}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
            <span>Quórum mínimo: {Number(a.quorumMinimo)}%</span>
            {a.quorumAlcancado != null && <span>Quórum alcançado: {Number(a.quorumAlcancado)}%</span>}
            {a.ataUrl && (
              <a href={a.ataUrl} target="_blank" rel="noopener noreferrer" className="text-vivant-navy hover:underline inline-flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Ata
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Vote className="w-5 h-5" />
            Pautas ({a.pautas?.length ?? 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!a.pautas?.length ? (
            <p className="text-gray-500 text-sm">Nenhuma pauta cadastrada.</p>
          ) : (
            <ul className="space-y-3">
              {a.pautas.map((p: any, idx: number) => (
                <li key={p.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-vivant-navy">
                      {p.ordem}. {p.titulo}
                    </span>
                    <span className="text-xs text-gray-500">{TIPO_PAUTA[p.tipo] ?? p.tipo}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.descricao}</p>
                  {p._count?.votos != null && <p className="text-xs text-gray-500 mt-1">{p._count.votos} voto(s)</p>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
