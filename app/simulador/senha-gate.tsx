"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export function SenhaGate() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    try {
      const res = await fetch("/api/comercial-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senha }),
      });

      if (!res.ok) {
        setErro("Senha incorreta. Tente novamente.");
        return;
      }

      router.refresh();
    } catch {
      setErro("Erro de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
            <Lock className="w-8 h-8 text-emerald-200" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Vivant Multipropriedade</h1>
          <p className="text-emerald-300 text-sm mt-1">Portal Comercial — Simulador de Cotas</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Acesso restrito</h2>
          <p className="text-sm text-gray-500 mb-6">
            Digite a senha para acessar o simulador.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="senha" className="block text-xs font-medium text-gray-600 mb-1.5">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                autoFocus
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
              />
            </div>

            {erro && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={carregando || !senha}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {carregando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verificando…
                </>
              ) : (
                "Acessar"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-emerald-400/60 text-xs mt-6">
          © {new Date().getFullYear()} Vivant Multipropriedade
        </p>
      </div>
    </div>
  );
}
