"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Heart, CheckCircle2, Home, Calendar, ArrowRight, Loader2 } from "lucide-react";

interface CotistaData {
  name: string;
  email: string;
  cotas: Array<{
    id: string;
    numeroCota: string;
    semanasAno: number;
    property: {
      name: string;
      location: string;
      destino: string;
    };
  }>;
}

export default function AcceptInvitePage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cotistaData, setCotistaData] = useState<CotistaData | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function validateToken() {
      try {
        const response = await fetch(`/api/cotistas/invite/${token}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Convite inválido");
          setLoading(false);
          return;
        }

        setCotistaData(data.cotista);
        setLoading(false);
      } catch (err) {
        setError("Erro ao validar convite");
        setLoading(false);
      }
    }

    validateToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`/api/cotistas/invite/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao ativar conta");
        setSubmitting(false);
        return;
      }

      toast.success("Conta ativada com sucesso!");
      
      setTimeout(() => {
        router.push("/portal-cotista");
      }, 1500);

    } catch (err) {
      toast.error("Erro ao ativar conta");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-vivant-green animate-spin mx-auto mb-4" />
          <p className="text-[#1A2F4B]/70">Validando convite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-none shadow-xl">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-[#1A2F4B] mb-2">
              Convite Inválido
            </h2>
            <p className="text-[#1A2F4B]/70 mb-6">{error}</p>
            <Button
              asChild
              className="bg-vivant-green hover:bg-vivant-green/90"
            >
              <a href="/care">Voltar ao Site</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b-2 border-vivant-green/10 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20 lg:h-24">
            <div className="flex items-center py-2">
              <img 
                src="/logo-vivant-care.png" 
                alt="Vivant Care" 
                className="h-12 sm:h-14 lg:h-16 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-16 px-4">
        <div className="w-full max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-vivant-green/10 backdrop-blur-sm border border-vivant-green/30 rounded-full px-6 py-3 mb-6">
              <Heart className="w-5 h-5 text-vivant-green" />
              <span className="text-vivant-green text-base font-semibold">
                Bem-vindo à Vivant Care
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-4">
              Ative sua Conta
            </h1>
            <p className="text-lg text-[#1A2F4B]/70">
              Complete seu cadastro para acessar o Portal do Cotista
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl bg-white overflow-hidden">
              <div className="bg-gradient-to-br from-vivant-green to-teal-600 p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-serif font-bold text-white mb-1">
                  Suas Informações
                </h2>
              </div>

              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-[#1A2F4B]/60 mb-1">Nome</p>
                    <p className="text-lg font-semibold text-[#1A2F4B]">{cotistaData?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#1A2F4B]/60 mb-1">Email</p>
                    <p className="text-base text-[#1A2F4B]">{cotistaData?.email}</p>
                  </div>

                  {cotistaData?.cotas && cotistaData.cotas.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                      <p className="text-sm font-semibold text-[#1A2F4B] mb-3">Suas Propriedades</p>
                      <div className="space-y-3">
                        {cotistaData.cotas.map((cota) => (
                          <div key={cota.id} className="flex items-start gap-3 p-3 bg-vivant-green/5 rounded-lg">
                            <Home className="w-5 h-5 text-vivant-green mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-medium text-[#1A2F4B] text-sm">{cota.property.name}</p>
                              <p className="text-xs text-[#1A2F4B]/60">{cota.property.location}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs bg-vivant-green/20 text-vivant-green px-2 py-0.5 rounded">
                                  {cota.numeroCota}
                                </span>
                                <span className="text-xs text-[#1A2F4B]/60 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {cota.semanasAno} semanas/ano
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white overflow-hidden">
              <div className="bg-gradient-to-br from-vivant-green to-teal-600 p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-3">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-xl font-serif font-bold text-white mb-1">
                  Crie sua Senha
                </h2>
              </div>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#1A2F4B] font-medium">
                      Telefone (opcional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 99999-9999"
                      className="h-11 border-2 border-slate-200 focus:border-vivant-green"
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#1A2F4B] font-medium">
                      Senha *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="h-11 border-2 border-slate-200 focus:border-vivant-green"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#1A2F4B] font-medium">
                      Confirmar Senha *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Digite a senha novamente"
                      className="h-11 border-2 border-slate-200 focus:border-vivant-green"
                      required
                      disabled={submitting}
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-vivant-green to-teal-600 hover:from-vivant-green/90 hover:to-teal-600/90 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Ativando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          Ativar Conta
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-center text-[#1A2F4B]/60 mt-4">
                    Ao ativar sua conta, você concorda com os termos de uso e política de privacidade da Vivant Care.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-vivant-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
