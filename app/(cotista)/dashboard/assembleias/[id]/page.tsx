"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft, Loader2, Vote, FileText } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

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

const TIPO_PAUTA: Record<string, string> = {
  INFORMATIVA: "Informativa",
  DELIBERATIVA: "Deliberativa",
  ELETIVA: "Eletiva",
};

export default function AssembleiaDetalheCotistaPage() {
  const params = useParams();
  const id = params.id as string;
  const [a, setA] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [votandoPautaId, setVotandoPautaId] = useState<string | null>(null);

  const carregar = () => {
    setLoading(true);
    fetch("/api/cotistas/me/assembleias/" + id)
      .then((res) => (res.ok ? res.json() : null))
      .then(setA)
      .catch(() => setA(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    carregar();
  }, [id]);

  const votar = async (pautaId: string, voto: "FAVOR" | "CONTRA" | "ABSTENCAO") => {
    setVotandoPautaId(pautaId);
    try {
      const res = await fetch("/api/cotistas/me/assembleias/" + id, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pautaId, voto }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Não foi possível registrar seu voto.");
        return;
      }
      toast.success("Voto registrado com sucesso.");
      carregar();
    } catch {
      toast.error("Erro ao registrar voto.");
    } finally {
      setVotandoPautaId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-10 h-10 text-vivant-green animate-spin" />
      </div>
    );
  }

  if (!a) {
    return (
      <div className="text-center py-12">
        <p className="text-[#1A2F4B]/70">Assembleia não encontrada.</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/assembleias">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/dashboard/assembleias">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1A2F4B]">{a.titulo}</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-[#1A2F4B]/70">
            <span className="inline-flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              {a.property?.name ?? "—"}
            </span>
            <span>{TIPO_LABEL[a.tipo] ?? a.tipo}</span>
            <span>{format(new Date(a.dataRealizacao), "dd MMM yyyy HH:mm", { locale: ptBR })}</span>
            <span className={`px-2 py-0.5 rounded ${a.status === "FINALIZADA" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-800"}`}>
              {STATUS_LABEL[a.status] ?? a.status}
            </span>
          </div>
        </div>
      </div>

      <Card className="border-none shadow-lg">
        <CardContent className="p-6">
          <h3 className="font-semibold text-[#1A2F4B] mb-2">Descrição</h3>
          <p className="whitespace-pre-wrap text-[#1A2F4B]/80">{a.descricao}</p>
          {a.ataUrl && (
            <a href={a.ataUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-vivant-green hover:underline mt-4">
              <FileText className="w-4 h-4" />
              Acessar ata
            </a>
          )}
          {a.participacao && (
            <p className="text-sm text-[#1A2F4B]/70 mt-4">
              Participação atual: {a.participacao.cotistasQueVotaram}/{a.participacao.totalCotistasElegiveis} cotistas
              {" "}({a.participacao.percentual}%)
            </p>
          )}
        </CardContent>
      </Card>

      {a.pautas?.length > 0 && (
        <Card className="border-none shadow-lg">
          <CardContent className="p-6">
            <h3 className="font-semibold text-[#1A2F4B] mb-4 flex items-center gap-2">
              <Vote className="w-5 h-5" />
              Pautas
            </h3>
            <ul className="space-y-3">
              {a.pautas.map((p: any) => (
                <li key={p.id} className="p-4 border border-[#1A2F4B]/10 rounded-lg">
                  <div className="font-medium text-[#1A2F4B]">
                    {p.ordem}. {p.titulo}
                  </div>
                  <p className="text-sm text-[#1A2F4B]/70 mt-1">{p.descricao}</p>
                  <span className="text-xs text-[#1A2F4B]/50">{TIPO_PAUTA[p.tipo] ?? p.tipo}</span>
                  {p._count?.votos != null && <span className="text-xs text-[#1A2F4B]/50 ml-2">· {p._count.votos} voto(s)</span>}
                  {p.requererVotacao ? (
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-[#1A2F4B]/60">
                        Meu voto: <strong>{p.meuVoto ? p.meuVoto : "não registrado"}</strong>
                      </p>
                      <p className="text-xs text-[#1A2F4B]/50">
                        Resultado parcial: {p.resumoVotos?.favor ?? 0} favor · {p.resumoVotos?.contra ?? 0} contra · {p.resumoVotos?.abstencao ?? 0} abstenção
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant={p.meuVoto === "FAVOR" ? "default" : "outline"}
                          disabled={!p.votacaoAberta || votandoPautaId === p.id}
                          onClick={() => votar(p.id, "FAVOR")}
                        >
                          Favor
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={p.meuVoto === "CONTRA" ? "default" : "outline"}
                          disabled={!p.votacaoAberta || votandoPautaId === p.id}
                          onClick={() => votar(p.id, "CONTRA")}
                        >
                          Contra
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant={p.meuVoto === "ABSTENCAO" ? "default" : "outline"}
                          disabled={!p.votacaoAberta || votandoPautaId === p.id}
                          onClick={() => votar(p.id, "ABSTENCAO")}
                        >
                          Abstenção
                        </Button>
                        {!p.votacaoAberta ? (
                          <span className="text-xs text-amber-700 self-center">Votação encerrada para esta pauta</span>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
