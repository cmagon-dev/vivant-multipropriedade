"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, TrendingUp, PieChart, BookOpen } from "lucide-react";

const ORIGIN_OPTIONS = [
  "Google",
  "Instagram",
  "Indicação",
  "Corretor",
  "Evento",
  "Outro",
] as const;

const TIPOS = [
  { key: "IMOVEL" as const, label: "Quero fracionar meu imóvel", icon: Building2 },
  { key: "INVESTIDOR" as const, label: "Quero ser um Investidor Vivant", icon: TrendingUp },
  { key: "COTISTA" as const, label: "Quero ser um Cliente Cotista", icon: PieChart },
  { key: "MODELO" as const, label: "Quero conhecer o modelo melhor", icon: BookOpen },
];

const PLACEHOLDERS: Record<string, string> = {
  IMOVEL: "Ex: cidade/bairro, tipo do imóvel, valor aproximado...",
  INVESTIDOR: "Ex: quanto pretende investir e prazo...",
  COTISTA: "Ex: cidade de interesse e objetivo (renda/férias/investimento)...",
  MODELO: "Ex: o que você gostaria de entender primeiro (cotas, imóveis, investimento)...",
};

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : "";
  return `(${d.slice(0, 2)}) ${d.slice(2)}`;
}

export function CaptarWizard({
  presetType,
  embedded = false,
}: { presetType?: "IMOVEL" | "INVESTIDOR" | "COTISTA" | "MODELO" | null; embedded?: boolean }) {
  const searchParams = useSearchParams();
  const vendedor = searchParams.get("vendedor") ?? undefined;
  const utm = {
    utm_source: searchParams.get("utm_source") ?? undefined,
    utm_medium: searchParams.get("utm_medium") ?? undefined,
    utm_campaign: searchParams.get("utm_campaign") ?? undefined,
  };

  const [step, setStep] = useState(presetType ? 2 : 1);
  const [leadTypeKey, setLeadTypeKey] = useState<"IMOVEL" | "INVESTIDOR" | "COTISTA" | "MODELO" | null>(presetType ?? null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [origin, setOrigin] = useState<string>("");
  const [message, setMessage] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const currentType = presetType ?? leadTypeKey;

  const validateStep2 = (): boolean => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Nome deve ter pelo menos 2 caracteres.";
    const digits = phone.replace(/\D/g, "");
    const len = digits.startsWith("55") ? digits.length - 2 : digits.length;
    if (len < 10 || len > 11) e.phone = "Informe um WhatsApp válido (DDD + número).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = "Informe um e-mail válido.";
    if (city.trim().length < 2) e.city = "Cidade deve ter pelo menos 2 caracteres.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep3 = (): boolean => {
    const e: Record<string, string> = {};
    if (message.trim().length < 10) e.message = "Conte um pouco mais (mínimo 10 caracteres).";
    if (message.trim().length > 500) e.message = "Máximo 500 caracteres.";
    if (!lgpd) e.lgpd = "É preciso aceitar receber contato.";
    setErrors((prev) => ({ ...prev, ...e }));
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!currentType || !validateStep2() || !validateStep3()) return;
    setLoading(true);
    setErrors({});
    try {
      const res = await fetch("/api/public/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadTypeKey: currentType,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          city: city.trim(),
          origin: origin.trim() || undefined,
          message: message.trim(),
          vendedorUserId: vendedor || undefined,
          utm: (utm.utm_source || utm.utm_medium || utm.utm_campaign) ? utm : undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrors({ submit: data.error || "Não foi possível enviar. Tente de novo." });
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch {
      setErrors({ submit: "Erro de conexão. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    const successContent = (
      <div className="w-full text-center space-y-4 py-4">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <span className="text-3xl">✓</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Recebido!</h2>
        <p className="text-gray-600 text-sm">Vamos falar com você no WhatsApp em breve.</p>
      </div>
    );
    if (embedded) return successContent;
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">{successContent}</div>
      </div>
    );
  }

  const wizardContent = (
    <div className="w-full max-w-lg mx-auto">
        <div className="mb-8">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-vivant-navy transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2 text-center">
            Etapa {step} de 3
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <h1 className="text-xl font-bold text-center text-gray-900">Como podemos te ajudar?</h1>
            <p className="text-center text-gray-600 text-sm">Escolha uma opção para continuar.</p>
            <div className="grid gap-3">
              {TIPOS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setLeadTypeKey(t.key)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                    leadTypeKey === t.key
                      ? "border-vivant-navy bg-vivant-navy/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <t.icon className="w-8 h-8 text-vivant-navy flex-shrink-0" />
                  <span className="font-medium text-gray-900">{t.label}</span>
                </button>
              ))}
            </div>
            <Button
              className="w-full h-12 text-base"
              disabled={!leadTypeKey}
              onClick={() => setStep(2)}
            >
              Continuar
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Seus dados</h1>
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="mt-1 h-11"
              />
              {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="phone">WhatsApp *</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(maskPhone(e.target.value))}
                placeholder="(11) 99999-9999"
                className="mt-1 h-11"
              />
              {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="mt-1 h-11"
              />
              {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
            </div>
            <div>
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Sua cidade"
                className="mt-1 h-11"
              />
              {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label>Como conheceu a Vivant?</Label>
              <Select value={origin || "_"} onValueChange={(v) => setOrigin(v === "_" ? "" : v)}>
                <SelectTrigger className="mt-1 h-11">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {ORIGIN_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button
                className="flex-1 h-12"
                onClick={() => {
                  if (validateStep2()) setStep(3);
                }}
              >
                Continuar
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h1 className="text-xl font-bold text-gray-900">Conte um pouco mais</h1>
            <div>
              <Label htmlFor="message">O que você precisa? *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={currentType ? PLACEHOLDERS[currentType] : "Descreva brevemente..."
                }
                className="mt-1 min-h-[120px]"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{message.length}/500</p>
              {errors.message && <p className="text-sm text-red-600 mt-1">{errors.message}</p>}
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <Checkbox checked={lgpd} onCheckedChange={(c) => setLgpd(!!c)} className="mt-1" />
              <span className="text-sm text-gray-700">
                Concordo em receber contato da Vivant pelo WhatsApp e e-mail. *
              </span>
            </label>
            {errors.lgpd && <p className="text-sm text-red-600">{errors.lgpd}</p>}
            {errors.submit && <p className="text-sm text-red-600">{errors.submit}</p>}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 h-12" onClick={() => setStep(2)}>
                Voltar
              </Button>
              <Button
                className="flex-1 h-12 text-base"
                disabled={loading}
                onClick={handleSubmit}
              >
                {loading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>
        )}
    </div>
  );

  if (embedded) return wizardContent;
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col items-center justify-center p-4 sm:p-6">
      {wizardContent}
    </div>
  );
}
