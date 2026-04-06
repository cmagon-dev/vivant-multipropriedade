"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft, Edit, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const TIPO_LABEL: Record<string, string> = {
  AVISO: "Aviso",
  COMUNICADO: "Comunicado",
  URGENTE: "Urgente",
  MANUTENCAO: "Manutenção",
  EVENTO: "Evento",
  LEMBRETE: "Lembrete",
};

const PRIORIDADE_LABEL: Record<string, string> = {
  BAIXA: "Baixa",
  NORMAL: "Normal",
  ALTA: "Alta",
  URGENTE: "Urgente",
};

const TARGET_LABEL: Record<string, string> = {
  CASA: "Casa",
  COTISTA: "Cotista",
  CONDOMINIO: "Condomínio",
  DESTINO: "Destino",
};

interface Aviso {
  id: string;
  propertyId: string | null;
  targetType?: "CASA" | "COTISTA" | "CONDOMINIO" | "DESTINO";
  targetCotistaId?: string | null;
  targetCondominio?: string | null;
  targetDestinoId?: string | null;
  titulo: string;
  conteudo: string;
  tipo: string;
  prioridade: string;
  fixada: boolean;
  ativa: boolean;
  createdAt: string;
  property?: { id: string; name: string };
  targetCotista?: { id: string; name: string };
  targetDestino?: { id: string; name: string };
}

export default function AvisoDetalhePage() {
  const params = useParams();
  const id = params.id as string;
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/avisos/" + id)
      .then((res) => (res.ok ? res.json() : null))
      .then(setAviso)
      .catch(() => setAviso(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-10 h-10 text-vivant-navy animate-spin" />
      </div>
    );
  }

  if (!aviso) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Aviso não encontrado.</p>
        <Button asChild className="mt-4">
          <Link href="/admin/vivant-care/avisos">
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
            <Link href="/admin/vivant-care/avisos">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-vivant-navy">{aviso.titulo}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {(() => {
                  const targetType = aviso.targetType ?? "CASA";
                  if (targetType === "CASA") return `${TARGET_LABEL[targetType]}: ${aviso.property?.name ?? "-"}`;
                  if (targetType === "COTISTA") return `${TARGET_LABEL[targetType]}: ${aviso.targetCotista?.name ?? "-"}`;
                  if (targetType === "CONDOMINIO") return `${TARGET_LABEL[targetType]}: ${aviso.targetCondominio ?? "-"}`;
                  if (targetType === "DESTINO") return `${TARGET_LABEL[targetType]}: ${aviso.targetDestino?.name ?? "-"}`;
                  return aviso.property?.name ?? "-";
                })()}
              </span>
              <span>{TIPO_LABEL[aviso.tipo] ?? aviso.tipo}</span>
              <span>{PRIORIDADE_LABEL[aviso.prioridade] ?? aviso.prioridade}</span>
              {aviso.fixada && <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">Fixada</span>}
              {!aviso.ativa && <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded">Inativo</span>}
              <span>{format(new Date(aviso.createdAt), "dd MMM yyyy", { locale: ptBR })}</span>
            </div>
          </div>
        </div>
        <Button asChild className="bg-vivant-green hover:bg-vivant-green/90">
          <Link href={"/admin/vivant-care/avisos/" + aviso.id + "/editar"}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          <p className="whitespace-pre-wrap text-gray-700">{aviso.conteudo}</p>
        </CardContent>
      </Card>
    </div>
  );
}
