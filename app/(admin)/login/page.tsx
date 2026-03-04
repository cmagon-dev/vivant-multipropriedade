"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Lock, Heart, Shield, Sparkles, ArrowRight, Building2, Users } from "lucide-react";

type PortalType = "site" | "cotistas";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState<PortalType>("site");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn("admin-credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        toast.error("Email ou senha incorretos");
        setIsLoading(false);
      } else if (result?.ok) {
        toast.success("Login realizado com sucesso!");
        // Redirecionar baseado no portal selecionado
        const redirectUrl = callbackUrl || (selectedPortal === "site" ? "/admin/dashboard" : "/admin-portal");
        window.location.href = redirectUrl;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-vivant-navy">
      {/* Navbar com Logo Vivant */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center py-2">
              <img 
                src="/logo-vivant.png" 
                alt="Vivant" 
                className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 px-4 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Side - Welcome Section */}
            <div className="space-y-6 text-center md:text-left order-2 md:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-vivant-gold/20 backdrop-blur-sm border border-vivant-gold/30 rounded-full px-4 sm:px-6 py-2 sm:py-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-vivant-gold" />
                <span className="text-vivant-gold text-sm sm:text-base font-semibold">
                  Painel Administrativo
                </span>
              </div>

              {/* Heading */}
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                  Bem-vindo ao Painel Vivant
                </h1>
                <p className="text-base sm:text-lg text-white/70 leading-relaxed">
                  Acesse o sistema de gestão para administrar propriedades, destinos, cotistas e muito mais
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-vivant-gold/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-vivant-gold" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white text-base mb-0.5">
                      Gestão Centralizada
                    </h3>
                    <p className="text-white/70 text-sm">
                      Administre casas, destinos e cotistas em um só lugar
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-vivant-gold/20 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-vivant-gold" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white text-base mb-0.5">
                      Controle Total
                    </h3>
                    <p className="text-white/70 text-sm">
                      Acesso completo a todas as funcionalidades do sistema
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-vivant-gold/20 rounded-lg flex items-center justify-center">
                    <Lock className="w-5 h-5 text-vivant-gold" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-white text-base mb-0.5">
                      Segurança Avançada
                    </h3>
                    <p className="text-white/70 text-sm">
                      Sistema protegido com autenticação de dois fatores
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Login Card */}
            <div className="order-1 md:order-2">
              <Card className="border-none shadow-2xl bg-white overflow-hidden">
                {/* Card Header with Gradient */}
                <div className="bg-gradient-to-br from-vivant-navy to-slate-800 p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-vivant-gold/20 backdrop-blur-sm rounded-full mb-4">
                    <Lock className="w-8 h-8 text-vivant-gold" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                    Login Administrativo
                  </h2>
                  <p className="text-white/90 text-sm">
                    Acesse com suas credenciais de administrador
                  </p>
                </div>

                <CardContent className="p-6 sm:p-8">
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Seletor de Portal */}
                    <div className="space-y-3">
                      <Label className="text-vivant-navy font-medium">
                        Selecione o Painel
                      </Label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedPortal("site")}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedPortal === "site"
                              ? "border-vivant-navy bg-vivant-navy/5 shadow-md"
                              : "border-gray-200 hover:border-vivant-navy/50"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Building2 className={`w-6 h-6 ${
                              selectedPortal === "site" ? "text-vivant-navy" : "text-gray-400"
                            }`} />
                            <span className={`text-sm font-semibold ${
                              selectedPortal === "site" ? "text-vivant-navy" : "text-gray-600"
                            }`}>
                              Admin Site
                            </span>
                            <span className="text-xs text-gray-500">
                              Casas e destinos
                            </span>
                          </div>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => setSelectedPortal("cotistas")}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            selectedPortal === "cotistas"
                              ? "border-vivant-green bg-vivant-green/5 shadow-md"
                              : "border-gray-200 hover:border-vivant-green/50"
                          }`}
                        >
                          <div className="flex flex-col items-center gap-2">
                            <Users className={`w-6 h-6 ${
                              selectedPortal === "cotistas" ? "text-vivant-green" : "text-gray-400"
                            }`} />
                            <span className={`text-sm font-semibold ${
                              selectedPortal === "cotistas" ? "text-vivant-green" : "text-gray-600"
                            }`}>
                              Admin Portal
                            </span>
                            <span className="text-xs text-gray-500">
                              Gestão de cotistas
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-vivant-navy font-medium">
                        E-mail Administrativo
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@vivant.com"
                        className="h-11 border-2 border-slate-200 focus:border-vivant-navy focus:ring-vivant-navy/20"
                        required
                        disabled={isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-vivant-navy font-medium">
                        Senha
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-11 border-2 border-slate-200 focus:border-vivant-navy focus:ring-vivant-navy/20"
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-300 text-vivant-navy focus:ring-vivant-navy" 
                        />
                        <span className="text-slate-600">Lembrar-me</span>
                      </label>
                      <button 
                        type="button"
                        className="text-vivant-navy hover:text-vivant-navy/80 font-medium transition-colors"
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className={`w-full h-12 font-semibold text-base shadow-lg hover:shadow-xl transition-all ${
                        selectedPortal === "site"
                          ? "bg-gradient-to-r from-vivant-navy to-slate-700 hover:from-vivant-navy/90 hover:to-slate-700/90"
                          : "bg-gradient-to-r from-vivant-green to-teal-600 hover:from-vivant-green/90 hover:to-teal-600/90"
                      } text-white`}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Entrando...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          {selectedPortal === "site" ? (
                            <>
                              <Building2 className="w-5 h-5" />
                              Entrar no Admin Site
                            </>
                          ) : (
                            <>
                              <Users className="w-5 h-5" />
                              Entrar no Admin Portal
                            </>
                          )}
                          <ArrowRight className="w-5 h-5" />
                        </span>
                      )}
                    </Button>
                  </form>

                  {/* Info Box - Dinâmico baseado no portal selecionado */}
                  <div className={`mt-6 p-4 rounded-lg border-l-4 ${
                    selectedPortal === "site"
                      ? "bg-vivant-navy/10 border-vivant-navy"
                      : "bg-vivant-green/10 border-vivant-green"
                  }`}>
                    <h4 className={`font-semibold mb-1 text-sm flex items-center gap-2 ${
                      selectedPortal === "site" ? "text-vivant-navy" : "text-vivant-green"
                    }`}>
                      {selectedPortal === "site" ? (
                        <>
                          <Building2 className="w-4 h-4" />
                          Admin do Site
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4" />
                          Admin do Portal
                        </>
                      )}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {selectedPortal === "site"
                        ? "Você será redirecionado para o painel de gestão de casas, destinos e site institucional."
                        : "Você será redirecionado para o painel de gestão de cotistas, cobranças e convites."}
                    </p>
                    <p className={`text-xs font-medium mt-2 ${
                      selectedPortal === "site" ? "text-vivant-navy" : "text-vivant-green"
                    }`}>
                      {selectedPortal === "site" ? "→ /admin/dashboard" : "→ /admin-portal"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-vivant-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-vivant-navy/20 rounded-full blur-3xl" />
      </div>
    </div>
  );
}
