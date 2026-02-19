"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      
      if (result?.error) {
        toast.error("Email ou senha incorretos");
        setIsLoading(false);
      } else if (result?.ok) {
        toast.success("Login realizado com sucesso!");
        // Usar window.location para forçar reload completo da página
        window.location.href = callbackUrl;
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-vivant-navy to-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <img 
            src="/logo-vivant.png" 
            alt="Vivant" 
            className="h-16 mx-auto mb-2"
          />
          <CardTitle className="text-2xl font-serif text-vivant-navy">
            Painel Administrativo
          </CardTitle>
          <CardDescription>
            Acesso exclusivo para equipe Vivant
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-vivant-navy hover:bg-vivant-navy/90"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
