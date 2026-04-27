"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Heart, ArrowRight, Building2, Eye, EyeOff, Shield } from "lucide-react";
import { PublicMarketingShell } from "@/components/public/PublicMarketingShell";

const LOGIN_BULLETS = [
  { icon: Building2, title: "Admin Site / Portal", description: "Gestão de casas, destinos e cotistas" },
  { icon: Heart, title: "Portal do Cotista", description: "Reservas, financeiro e avisos" },
];

function LoginPageContent() {
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
      // 1. CSRF token do endpoint admin (não usa signIn() do next-auth/react para evitar
      //    que __NEXTAUTH.basePath do SessionProvider raiz sobrescreva o endpoint correto)
      const csrfRes = await fetch("/api/auth-admin/csrf");
      const { csrfToken } = await csrfRes.json() as { csrfToken?: string };

      // 2. Autenticar diretamente no endpoint admin
      const loginRes = await fetch("/api/auth-admin/callback/admin-credentials", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Auth-Return-Redirect": "1",
        },
        body: new URLSearchParams({
          email,
          password,
          csrfToken: csrfToken ?? "",
          callbackUrl: callbackUrl ?? "/",
          json: "true",
        }),
        credentials: "include",
      });

      const loginData = await loginRes.json() as { url?: string };
      const responseUrl = loginData.url
        ? new URL(loginData.url, window.location.origin)
        : null;
      const urlError = responseUrl?.searchParams.get("error");

      if (urlError || !loginRes.ok) {
        toast.error("Email ou senha incorretos");
        setIsLoading(false);
        return;
      }

      // 3. Verificar que a sessão criada é de fato um usuário admin
      const sessionRes = await fetch("/api/auth-admin/session");
      const sessionData = await sessionRes.json() as {
        user?: { userType?: string; roleKey?: string | null; defaultRoute?: string | null };
      };

      if (!sessionData?.user || sessionData.user.userType !== "admin") {
        toast.error("Acesso não autorizado. Use o Portal do Cotista.");
        setIsLoading(false);
        return;
      }

      // 4. Calcular rota de destino a partir dos dados da sessão e redirecionar
      toast.success("Login realizado com sucesso!");
      fetch("/api/telemetry/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "auth.login", message: "Login realizado", status: "OK" }),
      }).catch(() => {});

      const { defaultRoute, roleKey } = sessionData.user;
      let targetRoute: string;
      if (callbackUrl && callbackUrl.startsWith("/")) {
        targetRoute = callbackUrl;
      } else if (defaultRoute && defaultRoute.startsWith("/")) {
        targetRoute = defaultRoute;
      } else if (roleKey === "INVESTOR") {
        targetRoute = "/capital/dashboard";
      } else {
        switch (roleKey) {
          case "OWNER":
          case "SUPER_ADMIN":
            targetRoute = "/admin/overview";
            break;
          case "COMMERCIAL":
            targetRoute = "/dashboard/comercial";
            break;
          default:
            targetRoute = "/dashboard";
        }
      }
      window.location.href = targetRoute;
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
      subtitleLeft="Acesso administrativo do sistema Vivant."
      bulletsLeft={LOGIN_BULLETS}
      rightCardIcon={Lock}
      rightCardTitle="Login Admin"
      rightCardSubtitle="Use suas credenciais administrativas"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-vivant-navy font-medium">
            E-mail
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@vivant.com.br"
            className="h-11 border-2 border-slate-200 focus:border-vivant-navy focus:ring-vivant-navy/20"
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
              className="h-11 border-2 border-slate-200 focus:border-vivant-navy focus:ring-vivant-navy/20 pr-11"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-vivant-navy transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 font-semibold text-base shadow-lg bg-gradient-to-r from-vivant-navy to-slate-700 hover:from-vivant-navy/90 text-white"
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  );
}
