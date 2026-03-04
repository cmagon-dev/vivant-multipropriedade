"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function NovoConvitePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const response = await fetch("/api/cotistas/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Convite enviado com sucesso!");
        router.push("/admin-portal/cotistas");
      } else {
        const data = await response.json();
        toast.error(data.error || "Erro ao enviar convite");
      }
    } catch (error) {
      toast.error("Erro ao enviar convite");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/admin-portal/cotistas">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-serif font-bold text-vivant-navy">
            Enviar Convite para Cotista
          </h1>
          <p className="text-slate-600">
            O cotista receberá um e-mail para completar o cadastro
          </p>
        </div>
      </div>

      <Card className="border-none shadow-lg max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-vivant-green" />
            Informações do Cotista
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
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

            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                Após enviar o convite, você precisará associar as cotas de propriedades ao cotista na próxima etapa.
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-vivant-green hover:bg-vivant-green/90"
                disabled={sending}
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Enviar Convite
                  </span>
                )}
              </Button>
              <Button asChild variant="outline" disabled={sending}>
                <Link href="/admin-portal/cotistas">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
