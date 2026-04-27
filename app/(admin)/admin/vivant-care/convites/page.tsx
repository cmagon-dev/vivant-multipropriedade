"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Copy, Clock, AlertCircle, ExternalLink, Plus, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { ConviteDeleteButton } from "@/components/admin/convite-delete-button";

interface ConviteCota {
  id: string;
  numeroCota: string;
  property: { id: string; name: string };
}

interface Convite {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  inviteToken: string | null;
  inviteTokenExpiry: string | null;
  invitedAt: string | null;
  cotas: ConviteCota[];
}

export default function VivantCareConvitesPage() {
  const [convites, setConvites] = useState<Convite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConvites();
  }, []);

  async function loadConvites() {
    try {
      const res = await fetch("/api/cotistas/invite");
      if (res.ok) {
        const data = await res.json();
        setConvites(data.convites || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const copyInviteLink = (token: string) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/convite/${token}` : "";
    navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  };

  const openInviteLink = (token: string) => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/convite/${token}` : "";
    window.open(url, "_blank");
  };

  const normalizeWhatsappPhone = (phone?: string | null) => {
    const digits = (phone || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("55")) return digits;
    if (digits.length === 10 || digits.length === 11) return `55${digits}`;
    return digits;
  };

  const openWhatsappInvite = (convite: Convite) => {
    if (!convite.inviteToken) return;
    const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/convite/${convite.inviteToken}` : "";
    const text = encodeURIComponent(
      [
        `Olá, ${convite.name}!`,
        "",
        "Seu convite da Vivant está pronto. Para concluir seu cadastro, acesse o link abaixo:",
        inviteUrl,
        "",
        "Se precisar de ajuda, estou à disposição.",
      ].join("\n")
    );
    const phone = normalizeWhatsappPhone(convite.phone);
    const waUrl = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const isExpired = (expiry: string | null) => (expiry ? new Date(expiry) < new Date() : true);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-vivant-navy animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Convites</h1>
          <p className="text-gray-500 mt-1">
            {convites.length} convite{convites.length !== 1 ? "s" : ""} aguardando aceite
          </p>
        </div>
        <Button asChild className="bg-vivant-navy shrink-0">
          <Link href="/admin/vivant-care/convites/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo convite
          </Link>
        </Button>
      </div>

      {convites.length === 0 ? (
        <Card className="border-none shadow-lg">
          <CardContent className="p-12 text-center">
            <Mail className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-vivant-navy mb-2">Nenhum convite pendente</h2>
            <p className="text-gray-500 mb-6">Todos os convites foram aceitos ou expiraram.</p>
            <Button asChild>
              <Link href="/admin/vivant-care/convites/novo">Enviar novo convite</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="border-2 border-vivant-green/30 bg-vivant-green/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-vivant-green mt-0.5 flex-shrink-0" />
                <p className="text-sm text-vivant-navy/80">
                  Use Copiar link ou Abrir link para o convidado acessar e completar o cadastro.
                </p>
              </div>
            </CardContent>
          </Card>

          {convites.map((convite) => {
            const expired = convite.inviteToken ? isExpired(convite.inviteTokenExpiry) : true;
            return (
              <Card key={convite.id} className={expired ? "opacity-60" : ""}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        expired ? "bg-slate-100" : "bg-vivant-green/10"
                      }`}
                    >
                      <Mail className={expired ? "text-slate-400" : "text-vivant-green"} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-vivant-navy">{convite.name}</h3>
                          <p className="text-sm text-gray-600">{convite.email}</p>
                        </div>
                        <span className="ml-auto inline-flex items-center gap-2 whitespace-nowrap self-start">
                          {expired ? (
                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1 shrink-0">
                              <AlertCircle className="w-3 h-3" />
                              Expirado
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium flex items-center gap-1 shrink-0">
                              <Clock className="w-3 h-3" />
                              Pendente
                            </span>
                          )}
                          <ConviteDeleteButton
                            conviteId={convite.id}
                            className="h-8 w-8 self-center border border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                          />
                        </span>
                      </div>
                      {convite.cotas?.length > 0 && (
                        <p className="text-xs text-gray-500 mb-2">
                          Cota(s): {convite.cotas.map((c) => `${c.property?.name || "-"} (${c.numeroCota})`).join(", ")}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mb-4">
                        Enviado em{" "}
                        {convite.invitedAt
                          ? format(new Date(convite.invitedAt), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })
                          : "-"}
                        {!expired && convite.inviteTokenExpiry && (
                          <> • Expira em {format(new Date(convite.inviteTokenExpiry), "dd MMM yyyy", { locale: ptBR })}</>
                        )}
                      </p>
                      {convite.inviteToken && !expired && (
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" variant="outline" onClick={() => copyInviteLink(convite.inviteToken!)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar link
                          </Button>
                          <Button size="sm" className="bg-[#25D366] hover:bg-[#20bd5a] text-white" onClick={() => openWhatsappInvite(convite)}>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            WhatsApp
                          </Button>
                          <Button size="sm" className="bg-vivant-green hover:bg-vivant-green/90" onClick={() => openInviteLink(convite.inviteToken!)}>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Abrir link
                          </Button>
                        </div>
                      )}
                      {expired && (
                        <p className="text-sm text-red-600">Este convite expirou. Envie um novo em Novo convite se necessário.</p>
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
