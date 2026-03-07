"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Heart, ArrowRight, Building2, Users, Shield } from "lucide-react";
import { PublicMarketingShell } from "@/components/public/PublicMarketingShell";

type PortalType = "admin" | "cotista";

const LOGIN_BULLETS = [
  { icon: Building2, title: "Admin Site / Portal", description: "Gestão de casas, destinos e cotistas" },
  { icon: Heart, title: "Portal do Cotista", description: "Reservas, financeiro e avisos" },
];

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [portal, setPortal] = useState<PortalType>("admin");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const provider = portal === "admin" ? "admin-credentials" : "cotista-credentials";
      const result = await signIn(provider, {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(portal === "admin" ? "Email ou senha incorretos" : "Email/CPF ou senha incorretos");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        toast.success("Login realizado com sucesso!");
        fetch("/api/telemetry/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "auth.login", message: "Login realizado", status: "OK" }),
        }).catch(() => {});
        if (callbackUrl && callbackUrl.startsWith("/")) {
          window.location.href = callbackUrl;
          return;
        }
        const res = await fetch("/api/auth/post-login-redirect");
        const data = await res.json();
        window.location.href = data?.url ?? "/dashboard";
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
      badge={
        <div className="inline-flex items-center gap-2 bg-vivant-gold/20 backdrop-blur-sm border border-vivant-gold/30 rounded-full px-4 sm:px-6 py-2 sm:py-3">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-vivant-gold" />
          <span className="text-vivant-gold text-sm sm:text-base font-semibold">
            Acesso único Vivant
          </span>
        </div>
      }
      titleLeft="Bem-vindo ao Vivant"
      subtitleLeft="Entre como administrador (Site ou Portal) ou como cotista. O sistema redireciona você automaticamente."
      bulletsLeft={LOGIN_BULLETS}
      rightCardIcon={Lock}
      rightCardTitle="Login único"
      rightCardSubtitle="Escolha o tipo de acesso e use suas credenciais"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3">
          <Label className="text-vivant-navy font-medium">Tipo de acesso</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPortal("admin")}
              className={`p-4 rounded-lg border-2 transition-all ${
                portal === "admin"
                  ? "border-vivant-navy bg-vivant-navy/5 shadow-md"
                  : "border-gray-200 hover:border-vivant-navy/50"
              }`}
            >
              <Building2 className={`w-6 h-6 mx-auto mb-2 ${portal === "admin" ? "text-vivant-navy" : "text-gray-400"}`} />
              <span className={`text-sm font-semibold ${portal === "admin" ? "text-vivant-navy" : "text-gray-600"}`}>
                Admin
              </span>
            </button>
            <button
              type="button"
              onClick={() => setPortal("cotista")}
              className={`p-4 rounded-lg border-2 transition-all ${
                portal === "cotista"
                  ? "border-vivant-green bg-vivant-green/5 shadow-md"
                  : "border-gray-200 hover:border-vivant-green/50"
              }`}
            >
              <Users className={`w-6 h-6 mx-auto mb-2 ${portal === "cotista" ? "text-vivant-green" : "text-gray-400"}`} />
              <span className={`text-sm font-semibold ${portal === "cotista" ? "text-vivant-green" : "text-gray-600"}`}>
                Cotista
              </span>
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-vivant-navy font-medium">
            {portal === "admin" ? "E-mail" : "E-mail ou CPF"}
          </Label>
          <Input
            id="email"
            type={portal === "admin" ? "email" : "text"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={portal === "admin" ? "admin@vivant.com" : "seu@email.com ou CPF"}
            className="h-11 border-2 border-slate-200 focus:border-vivant-navy focus:ring-vivant-navy/20"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-vivant-navy font-medium">Senha</Label>
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

        <Button
          type="submit"
          className={`w-full h-12 font-semibold text-base shadow-lg ${
            portal === "admin"
              ? "bg-gradient-to-r from-vivant-navy to-slate-700 hover:from-vivant-navy/90"
              : "bg-gradient-to-r from-vivant-green to-teal-600 hover:from-vivant-green/90"
          } text-white`}
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
