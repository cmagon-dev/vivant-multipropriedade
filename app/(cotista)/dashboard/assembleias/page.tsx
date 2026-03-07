"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Calendar, Vote, Loader2, Building2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const STATUS_LABEL: Record<string, string> = {
  AGENDADA: "Agendada",
  EM_ANDAMENTO: "Em andamento",
  FINALIZADA: "Finalizada",
};

const TIPO_LABEL: Record<string, string> = {
  ORDINARIA: "Ordinária",
  EXTRAORDINARIA: "Extraordinária",
  VIRTUAL: "Virtual",
};

interface Assembleia {
  id: string;
  titulo: string;
  descricao: string;
  tipo: string;
  dataRealizacao: string;
  status: string;
  property?: { name: string };
  pautas?: { titulo: string; tipo: string }[];
}

export default function AssembleiasPage() {
  const [assembleias, setAssembleias] = useState<Assembleia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cotistas/me/assembleias")
      .then((res) => (res.ok ? res.json() : { assembleias: [] }))
      .then((data) => setAssembleias(data.assembleias || []))
      .catch(() => setAssembleias([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">
          Assembleias e Votações
        </h1>
        <p className="text-[#1A2F4B]/70">
          Participe das decisões das suas propriedades
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
        </div>
      ) : assembleias.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-[#1A2F4B]/30 mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold text-[#1A2F4B] mb-2">Nenhuma assembleia</h2>
            <p className="text-[#1A2F4B]/70">As assembleias das suas propriedades aparecerão aqui quando forem agendadas.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {assembleias.map((a) => (
            <Card key={a.id} className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-vivant-green/10 flex items-center justify-center flex-shrink-0">
                    <Vote className="w-6 h-6 text-vivant-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={"/dashboard/assembleias/" + a.id} className="text-lg font-bold text-[#1A2F4B] hover:underline">
                      {a.titulo}
                    </Link>
                    <p className="text-sm text-[#1A2F4B]/70 mt-0.5 line-clamp-2">{a.descricao}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-[#1A2F4B]/60">
                      <span className="inline-flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {a.property?.name ?? "—"}
                      </span>
                      <span>{TIPO_LABEL[a.tipo] ?? a.tipo}</span>
                      <span>{format(new Date(a.dataRealizacao), "dd MMM yyyy HH:mm", { locale: ptBR })}</span>
                      <span className={`px-2 py-0.5 rounded ${a.status === "FINALIZADA" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"}`}>
                        {STATUS_LABEL[a.status] ?? a.status}
                      </span>
                    </div>
                    {a.pautas?.length ? (
                      <p className="text-xs text-[#1A2F4B]/50 mt-2">{a.pautas.length} pauta(s)</p>
                    ) : null}
                  </div>
                  <Link
                    href={"/dashboard/assembleias/" + a.id}
                    className="text-sm font-medium text-vivant-green hover:underline shrink-0"
                  >
                    Ver detalhes
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
