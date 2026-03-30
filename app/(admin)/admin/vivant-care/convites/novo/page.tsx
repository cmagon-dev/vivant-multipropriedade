"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Loader2, MessageCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface CreatedInviteData {
  name: string;
  email: string;
  phone?: string | null;
  inviteToken: string;
}

export default function NovoConviteVivantCarePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
  });
  const [sending, setSending] = useState(false);
  const [createdInvite, setCreatedInvite] = useState<CreatedInviteData | null>(null);

  const buildInviteLink = (token: string) =>
    typeof window !== "undefined" ? `${window.location.origin}/convite/${token}` : "";

  const normalizeWhatsappPhone = (phone?: string | null) => {
    const digits = (phone || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("55")) return digits;
    if (digits.length === 10 || digits.length === 11) return `55${digits}`;
    return digits;
  };

  const buildWhatsappLink = (invite: CreatedInviteData) => {
    const inviteLink = buildInviteLink(invite.inviteToken);
    const text = [
      `Olá, ${invite.name}!`,
      "",
      "Seu convite da Vivant foi criado. Para concluir seu cadastro, acesse o link abaixo:",
      inviteLink,
      "",
      "Se precisar de ajuda, estou à disposição.",
    ].join("\n");
    const encodedText = encodeURIComponent(text);
    const phone = normalizeWhatsappPhone(invite.phone);
    return phone ? `https://wa.me/${phone}?text=${encodedText}` : `https://wa.me/?text=${encodedText}`;
  };

  const openWhatsappInvite = (invite: CreatedInviteData) => {
    const url = buildWhatsappLink(invite);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/cotistas/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.cotista?.inviteToken) {
          const inviteData: CreatedInviteData = {
            name: data.cotista.name || formData.name,
            email: data.cotista.email || formData.email,
            phone: data.cotista.phone || formData.phone,
            inviteToken: data.cotista.inviteToken,
          };
          setCreatedInvite(inviteData);
          toast.success("Convite criado! Envie também pelo WhatsApp.");
        } else {
          toast.success("Convite enviado com sucesso!");
          router.push("/admin/vivant-care/convites");
        }
      } else {
        const data = await res.json();
        toast.error(data.error || "Erro ao enviar convite");
      }
    } catch {
      toast.error("Erro ao enviar convite");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin/vivant-care/convites">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Enviar convite para cotista</h1>
          <p className="text-gray-500">O cotista receberá um e-mail para completar o cadastro.</p>
        </div>
      </div>

      <Card className="border-none shadow-lg max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-vivant-green" />
            Dados do convidado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="João da Silva"
                required
                disabled={sending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="joao@email.com"
                required
                disabled={sending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                placeholder="000.000.000-00"
                required
                disabled={sending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(11) 99999-9999"
                disabled={sending}
              />
            </div>
            <p className="text-sm text-gray-500">
              Após enviar o convite, você pode associar cotas ao cotista em Cotistas ou no aceite do convite.
            </p>
            {createdInvite && (
              <div className="rounded-lg border border-vivant-green/30 bg-vivant-green/5 p-4 space-y-3">
                <p className="text-sm text-vivant-navy">
                  Convite criado para <strong>{createdInvite.name}</strong>. Agora você pode enviar a mensagem pronta no WhatsApp.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    className="bg-[#25D366] hover:bg-[#20bd5a] text-white"
                    onClick={() => openWhatsappInvite(createdInvite)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar convite por WhatsApp
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/admin/vivant-care/convites")}>
                    Ir para convites
                  </Button>
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1 bg-vivant-green hover:bg-vivant-green/90" disabled={sending}>
                {sending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Enviar convite
                  </span>
                )}
              </Button>
              <Button asChild variant="outline" disabled={sending}>
                <Link href="/admin/vivant-care/convites">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
