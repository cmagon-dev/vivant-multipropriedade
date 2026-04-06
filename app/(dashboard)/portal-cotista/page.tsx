"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Lock, Smartphone, Calendar, FileText, Sparkles, Download, Apple, Heart, Shield, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function PortalCotistaPage(): JSX.Element {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("cotista-credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Email/CPF ou senha incorretos");
        setIsLoading(false);
      } else if (result?.ok) {
        toast.success("Login realizado com sucesso!");
        router.push("/dashboard");
      } else {
        toast.error("Erro inesperado ao fazer login");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Erro ao fazer login");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Navbar com Logo Vivant Care */}
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

      {/* Main Content */}
      <div className="pt-32 pb-16 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Welcome Section */}
            <div className="space-y-6 text-center md:text-left order-2 md:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-vivant-green/10 backdrop-blur-sm border border-vivant-green/30 rounded-full px-4 sm:px-6 py-2 sm:py-3">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-vivant-green" />
                <span className="text-vivant-green text-sm sm:text-base font-semibold">
                  Portal do Cotista
                </span>
              </div>

              {/* Heading */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#1A2F4B] mb-4 leading-tight">
                  Bem-vindo ao seu Portal Vivant Care
                </h1>
                <p className="text-base sm:text-lg text-[#1A2F4B]/70 leading-relaxed">
                  Acesse sua área exclusiva para gerenciar reservas, acompanhar manutenções e aproveitar ao máximo sua experiência Vivant
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-vivant-green/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-vivant-green" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-[#1A2F4B] text-base mb-0.5">
                      Calendário de Uso
                    </h3>
                    <p className="text-[#1A2F4B]/70 text-sm">
                      Agende seus períodos e visualize disponibilidade em tempo real
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-vivant-green/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-vivant-green" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-[#1A2F4B] text-base mb-0.5">
                      Gestão Financeira
                    </h3>
                    <p className="text-[#1A2F4B]/70 text-sm">
                      Acesse boletos, extratos e histórico de pagamentos
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-vivant-green/10 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-vivant-green" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-[#1A2F4B] text-base mb-0.5">
                      Concierge Premium
                    </h3>
                    <p className="text-[#1A2F4B]/70 text-sm">
                      Serviços exclusivos: transfer, alimentação e experiências únicas
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-vivant-green/10 rounded-lg flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-vivant-green" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-[#1A2F4B] text-base mb-0.5">
                      App Mobile
                    </h3>
                    <p className="text-[#1A2F4B]/70 text-sm">
                      Gerencie tudo pelo celular, disponível para iOS e Android
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="order-1 md:order-2">
              <Card className="border-none shadow-2xl bg-white overflow-hidden">
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-br from-vivant-green to-teal-600 p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                    Acesse sua Conta
                  </h2>
                  <p className="text-white/90 text-sm">
                    Entre com suas credenciais para continuar
                  </p>
                </div>

                <div className="p-6 sm:p-8">
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#1A2F4B] font-medium">
                        E-mail ou CPF
                      </Label>
                      <Input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com ou 000.000.000-00"
                        className="h-11 border-2 border-slate-200 focus:border-vivant-green focus:ring-vivant-green/20"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-[#1A2F4B] font-medium">
                        Senha
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 border-2 border-slate-200 focus:border-vivant-green focus:ring-vivant-green/20"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-vivant-green focus:ring-vivant-green"
                          disabled={isLoading}
                        />
                        <span className="text-[#1A2F4B]/70">Lembrar-me</span>
                      </label>
                      <button 
                        type="button"
                        className="text-vivant-green hover:text-vivant-green/80 font-medium transition-colors"
                        disabled={isLoading}
                      >
                        Esqueci minha senha
                      </button>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-gradient-to-r from-vivant-green to-teal-600 hover:from-vivant-green/90 hover:to-teal-600/90 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Entrando...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          Entrar
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-[#1A2F4B]/50">ou</span>
                    </div>
                  </div>

                  {/* App Download */}
                  <div className="text-center space-y-3">
                    <p className="text-sm text-[#1A2F4B]/70 font-medium">
                      Baixe nosso aplicativo
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button
                        variant="outline"
                        className="border-2 border-vivant-green/30 text-vivant-green hover:bg-vivant-green hover:text-white text-sm h-10 px-4 transition-all"
                        onClick={() => alert("Em breve disponível!")}
                      >
                        <Apple className="w-4 h-4 mr-2" />
                        App Store
                      </Button>
                      <Button
                        variant="outline"
                        className="border-2 border-vivant-green/30 text-vivant-green hover:bg-vivant-green hover:text-white text-sm h-10 px-4 transition-all"
                        onClick={() => alert("Em breve disponível!")}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Google Play
                      </Button>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="mt-6 p-4 bg-vivant-green/5 rounded-lg border-l-4 border-vivant-green">
                    <h4 className="font-semibold text-[#1A2F4B] mb-1 text-sm flex items-center gap-2">
                      <Heart className="w-4 h-4 text-vivant-green" />
                      Suporte Vivant Care
                    </h4>
                    <p className="text-xs text-[#1A2F4B]/70 leading-relaxed">
                      Nossa equipe está sempre disponível para garantir que sua experiência seja impecável.
                    </p>
                    <p className="text-xs text-vivant-green font-medium mt-2">
                      care@vivant.com.br | (44) 99969-1196
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-vivant-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-vivant-green/3 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
