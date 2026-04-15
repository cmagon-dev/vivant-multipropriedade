"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Loader2, IdCard } from "lucide-react";
import { toast } from "sonner";

type ProfileData = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
  avatar: string | null;
  active: boolean;
  emailVerified: string | null;
  createdAt: string;
  registration?: Record<string, string>;
  cotas?: Array<{
    id: string;
    numeroCota: string;
    percentualCota: string;
    semanasAno: number;
    property: {
      name: string;
      cidade: string;
      location: string;
    };
  }>;
};

type FullForm = {
  name: string;
  cpf: string;
  phone: string;
  avatar: string;
  rg: string;
  rgIssuer: string;
  birthDate: string;
  maritalStatus: string;
  nationality: string;
  profession: string;
  monthlyIncome: string;
  motherName: string;
  fatherName: string;
  spouseName: string;
  spouseCpf: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  bankName: string;
  bankBranch: string;
  bankAccount: string;
  bankAccountType: string;
  pixKey: string;
  notes: string;
};

const EMPTY_FORM: FullForm = {
  name: "",
  cpf: "",
  phone: "",
  avatar: "",
  rg: "",
  rgIssuer: "",
  birthDate: "",
  maritalStatus: "",
  nationality: "",
  profession: "",
  monthlyIncome: "",
  motherName: "",
  fatherName: "",
  spouseName: "",
  spouseCpf: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  country: "Brasil",
  bankName: "",
  bankBranch: "",
  bankAccount: "",
  bankAccountType: "",
  pixKey: "",
  notes: "",
};

export default function PerfilPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form, setForm] = useState<FullForm>(EMPTY_FORM);

  useEffect(() => {
    fetch("/api/cotistas/me/profile", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Erro ao carregar perfil"))))
      .then((d) => {
        const p = d.profile as ProfileData;
        setProfile(p);
        const reg = p.registration ?? {};
        setForm({
          ...EMPTY_FORM,
          name: p.name ?? "",
          cpf: p.cpf ?? "",
          phone: p.phone ?? "",
          avatar: p.avatar ?? "",
          rg: (reg.rg as string) ?? "",
          rgIssuer: (reg.rgIssuer as string) ?? "",
          birthDate: (reg.birthDate as string) ?? "",
          maritalStatus: (reg.maritalStatus as string) ?? "",
          nationality: (reg.nationality as string) ?? "",
          profession: (reg.profession as string) ?? "",
          monthlyIncome: (reg.monthlyIncome as string) ?? "",
          motherName: (reg.motherName as string) ?? "",
          fatherName: (reg.fatherName as string) ?? "",
          spouseName: (reg.spouseName as string) ?? "",
          spouseCpf: (reg.spouseCpf as string) ?? "",
          emergencyContactName: (reg.emergencyContactName as string) ?? "",
          emergencyContactPhone: (reg.emergencyContactPhone as string) ?? "",
          zipCode: (reg.zipCode as string) ?? "",
          street: (reg.street as string) ?? "",
          number: (reg.number as string) ?? "",
          complement: (reg.complement as string) ?? "",
          neighborhood: (reg.neighborhood as string) ?? "",
          city: (reg.city as string) ?? "",
          state: (reg.state as string) ?? "",
          country: (reg.country as string) ?? "Brasil",
          bankName: (reg.bankName as string) ?? "",
          bankBranch: (reg.bankBranch as string) ?? "",
          bankAccount: (reg.bankAccount as string) ?? "",
          bankAccountType: (reg.bankAccountType as string) ?? "",
          pixKey: (reg.pixKey as string) ?? "",
          notes: (reg.notes as string) ?? "",
        });
      })
      .catch((e) => {
        console.error(e);
        toast.error("Não foi possível carregar seu perfil.");
      })
      .finally(() => setLoading(false));
  }, []);

  const statusConta = useMemo(() => {
    if (!profile) return "";
    if (!profile.active) return "Inativa";
    return profile.emailVerified ? "Ativa (e-mail verificado)" : "Ativa";
  }, [profile]);

  const setField = (key: keyof FullForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/cotistas/me/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          cpf: form.cpf,
          phone: form.phone || null,
          avatar: form.avatar || null,
          registration: {
            rg: form.rg,
            rgIssuer: form.rgIssuer,
            birthDate: form.birthDate,
            maritalStatus: form.maritalStatus,
            nationality: form.nationality,
            profession: form.profession,
            monthlyIncome: form.monthlyIncome,
            motherName: form.motherName,
            fatherName: form.fatherName,
            spouseName: form.spouseName,
            spouseCpf: form.spouseCpf,
            emergencyContactName: form.emergencyContactName,
            emergencyContactPhone: form.emergencyContactPhone,
            zipCode: form.zipCode,
            street: form.street,
            number: form.number,
            complement: form.complement,
            neighborhood: form.neighborhood,
            city: form.city,
            state: form.state,
            country: form.country,
            bankName: form.bankName,
            bankBranch: form.bankBranch,
            bankAccount: form.bankAccount,
            bankAccountType: form.bankAccountType,
            pixKey: form.pixKey,
            notes: form.notes,
          },
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error || "Erro ao atualizar perfil.");
        return;
      }
      toast.success("Ficha cadastral atualizada com sucesso.");
      if (profile) {
        setProfile({
          ...profile,
          name: data.profile?.name ?? form.name,
          cpf: data.profile?.cpf ?? form.cpf,
          phone: data.profile?.phone ?? form.phone,
          avatar: data.profile?.avatar ?? form.avatar,
          registration: data.profile?.registration ?? profile.registration,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-vivant-green animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return <div className="py-8 text-center text-[#1A2F4B]/70">Não foi possível carregar o perfil.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A2F4B] mb-2">Meu Perfil</h1>
        <p className="text-[#1A2F4B]/70">Ficha cadastral completa do dono da cota.</p>
      </div>

      <div className="grid gap-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-vivant-green" />
              Dados pessoais e documentos
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nome completo *" value={form.name} onChange={(v) => setField("name", v)} />
            <Field label="E-mail" value={profile.email} disabled />
            <Field label="CPF *" value={form.cpf} onChange={(v) => setField("cpf", v)} />
            <Field label="Telefone" value={form.phone} onChange={(v) => setField("phone", v)} />
            <Field label="RG" value={form.rg} onChange={(v) => setField("rg", v)} />
            <Field label="Órgão emissor" value={form.rgIssuer} onChange={(v) => setField("rgIssuer", v)} />
            <Field label="Data de nascimento" value={form.birthDate} type="date" onChange={(v) => setField("birthDate", v)} />
            <Field label="Estado civil" value={form.maritalStatus} onChange={(v) => setField("maritalStatus", v)} />
            <Field label="Nacionalidade" value={form.nationality} onChange={(v) => setField("nationality", v)} />
            <Field label="Profissão" value={form.profession} onChange={(v) => setField("profession", v)} />
            <Field label="Renda mensal" value={form.monthlyIncome} onChange={(v) => setField("monthlyIncome", v)} />
            <Field label="Nome da mãe" value={form.motherName} onChange={(v) => setField("motherName", v)} />
            <Field label="Nome do pai" value={form.fatherName} onChange={(v) => setField("fatherName", v)} />
            <Field label="Nome do cônjuge" value={form.spouseName} onChange={(v) => setField("spouseName", v)} />
            <Field label="CPF do cônjuge" value={form.spouseCpf} onChange={(v) => setField("spouseCpf", v)} />
            <Field label="URL do avatar" value={form.avatar} onChange={(v) => setField("avatar", v)} />
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IdCard className="w-5 h-5 text-vivant-green" />
              Endereço, emergência e dados bancários
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="CEP" value={form.zipCode} onChange={(v) => setField("zipCode", v)} />
            <Field label="Endereço" value={form.street} onChange={(v) => setField("street", v)} />
            <Field label="Número" value={form.number} onChange={(v) => setField("number", v)} />
            <Field label="Complemento" value={form.complement} onChange={(v) => setField("complement", v)} />
            <Field label="Bairro" value={form.neighborhood} onChange={(v) => setField("neighborhood", v)} />
            <Field label="Cidade" value={form.city} onChange={(v) => setField("city", v)} />
            <Field label="Estado" value={form.state} onChange={(v) => setField("state", v)} />
            <Field label="País" value={form.country} onChange={(v) => setField("country", v)} />
            <Field label="Contato de emergência" value={form.emergencyContactName} onChange={(v) => setField("emergencyContactName", v)} />
            <Field label="Telefone de emergência" value={form.emergencyContactPhone} onChange={(v) => setField("emergencyContactPhone", v)} />
            <Field label="Banco" value={form.bankName} onChange={(v) => setField("bankName", v)} />
            <Field label="Agência" value={form.bankBranch} onChange={(v) => setField("bankBranch", v)} />
            <Field label="Conta" value={form.bankAccount} onChange={(v) => setField("bankAccount", v)} />
            <Field label="Tipo de conta" value={form.bankAccountType} onChange={(v) => setField("bankAccountType", v)} />
            <Field label="Chave PIX" value={form.pixKey} onChange={(v) => setField("pixKey", v)} />
            <Field label="Observações da ficha" value={form.notes} onChange={(v) => setField("notes", v)} />
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Resumo do cadastro</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Status da conta" value={statusConta} disabled />
              <Field label="Cliente desde" value={new Date(profile.createdAt).toLocaleDateString("pt-BR")} disabled />
            </div>
            <div className="space-y-2">
              <Label>Cotas ativas</Label>
              <div className="space-y-2">
                {(profile.cotas ?? []).length === 0 ? (
                  <p className="text-sm text-[#1A2F4B]/70">Nenhuma cota ativa vinculada.</p>
                ) : (
                  profile.cotas?.map((cota) => (
                    <div key={cota.id} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                      <p className="font-medium text-[#1A2F4B]">
                        {cota.property.name} • {cota.numeroCota}
                      </p>
                      <p className="text-[#1A2F4B]/70">{cota.property.cidade} • {cota.property.location}</p>
                      <p className="text-[#1A2F4B]/70">
                        Percentual: {Number(cota.percentualCota).toFixed(2)}% • {cota.semanasAno} semanas/ano
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <Button className="w-full bg-vivant-green hover:bg-vivant-green/90" onClick={() => void submitProfile()} disabled={saving}>
              {saving ? "Salvando ficha cadastral..." : "Salvar ficha cadastral completa"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled = false,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        value={value}
        type={type}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
