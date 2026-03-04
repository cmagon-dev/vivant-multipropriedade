"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Copy, CheckCircle2, Clock, AlertCircle, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Convite {
  id: string;
  name: string;
  email: string;
  inviteToken: string;
  inviteTokenExpiry: string;
  invitedAt: string;
}

export default function ConvitesPendentesPage() {
  const [convites, setConvites] = useState<Convite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConvites();
  }, []);

  async function loadConvites() {
    try {
      const response = await fetch("/api/cotistas/invite");
      if (response.ok) {
        const data = await response.json();
        setConvites(data.convites || []);
      }
    } catch (error) {
      console.error("Erro ao carregar convites:", error);
    } finally {
      setLoading(false);
    }
  }

  const copyInviteLink = (token: string) => {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/convite/${token}`;
    navigator.clipboard.writeText(inviteUrl);
    toast.success("Link copiado para a área de transferência!");
  };

  const openInviteLink = (token: string) => {
    const baseUrl = window.location.origin;
    const inviteUrl = `${baseUrl}/convite/${token}`;
    window.open(inviteUrl, "_blank");
  };

  const isExpired = (expiry: string) => {
    return new Date(expiry) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Clock className="w-12 h-12 text-vivant-green animate-spin mx-auto mb-4" />
          <p className="text-[#1A2F4B]/70">Carregando convites...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-bold text-vivant-navy mb-2">
          Convites Pendentes
        </h1>
        <p className="text-slate-600">
          {convites.length} convite{convites.length !== 1 ? "s" : ""} aguardando aceite
        </p>
      </div>

      {convites.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="p-12 text-center">
            <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-serif font-bold text-[#1A2F4B] mb-2">
              Nenhum convite pendente
            </h2>
            <p className="text-[#1A2F4B]/70">
              Todos os convites foram aceitos ou expiraram
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-2 border-vivant-green/30 bg-vivant-green/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-vivant-green mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[#1A2F4B] mb-1">
                    Modo de Teste - Email Fictício
                  </p>
                  <p className="text-sm text-[#1A2F4B]/80">
                    Em desenvolvimento, os emails não são enviados automaticamente.
                    Use os botões abaixo para copiar ou abrir os links de convite.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {convites.map((convite) => {
            const expired = isExpired(convite.inviteTokenExpiry);

            return (
              <Card
                key={convite.id}
                className={`border-none shadow-lg ${expired ? "opacity-60" : ""}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      expired ? "bg-slate-100" : "bg-vivant-green/10"
                    }`}>
                      <Mail className={`w-6 h-6 ${expired ? "text-slate-400" : "text-vivant-green"}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-[#1A2F4B] mb-1">
                            {convite.name}
                          </h3>
                          <p className="text-sm text-[#1A2F4B]/70">{convite.email}</p>
                        </div>
                        {expired ? (
                          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Expirado
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pendente
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#1A2F4B]/50 mb-4">
                        Enviado em {format(new Date(convite.invitedAt), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
                        {!expired && (
                          <> • Expira em {format(new Date(convite.inviteTokenExpiry), "dd MMM yyyy", { locale: ptBR })}</>
                        )}
                      </div>

                      {!expired && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyInviteLink(convite.inviteToken)}
                            className="flex-1"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar Link
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-vivant-green hover:bg-vivant-green/90"
                            onClick={() => openInviteLink(convite.inviteToken)}
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Abrir Link
                          </Button>
                        </div>
                      )}

                      {expired && (
                        <p className="text-sm text-red-600">
                          Este convite expirou e precisa ser reenviado
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
