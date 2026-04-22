"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Heart, ArrowRight, Users, Eye, EyeOff } from "lucide-react";
import { PublicMarketingShell } from "@/components/public/PublicMarketingShell";

export default function LoginCotistaPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

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
        return;
      }

      if (result?.ok) {
        toast.success("Login realizado com sucesso!");
        if (callbackUrl && callbackUrl.startsWith("/")) {
          window.location.href = callbackUrl;
          return;
        }
        window.location.href = "/dashboard";
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
    <PublicMarketingShell
      backgroundVariant="green"
      cardHeaderVariant="light"
      badge={
        <div className="inline-flex items-center gap-2 bg-vivant-green/10 backdrop-blur-sm border border-vivant-green/30 rounded-full px-4 sm:px-6 py-2 sm:py-3">
          <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-vivant-green" />
          <span className="text-vivant-green text-sm sm:text-base font-semibold">
            Acesso Cotista
          </span>
        </div>
      }
      titleLeft="Portal do Cotista"
      subtitleLeft="Acesse sua área exclusiva para reservas, avisos, assembleias e documentos."
      bulletsLeft={[
        {
          icon: Users,
          title: "Área do cotista",
          description: "Acesso exclusivo para titulares das cotas",
        },
      ]}
      rightCardIcon={Lock}
      rightCardTitle="Login Cotista"
      rightCardSubtitle="Entre com e-mail/CPF e senha"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-vivant-navy font-medium">
            E-mail ou CPF
          </Label>
          <Input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com ou CPF"
            className="h-11 border-2 border-slate-200 focus:border-vivant-green focus:ring-vivant-green/20"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-vivant-navy font-medium">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11 border-2 border-slate-200 focus:border-vivant-green focus:ring-vivant-green/20 pr-11"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-vivant-green transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 font-semibold text-base shadow-lg bg-gradient-to-r from-vivant-green to-teal-600 hover:from-vivant-green/90 text-white"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Entrando...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Entrar
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>
      </form>
    </PublicMarketingShell>
  );
}
