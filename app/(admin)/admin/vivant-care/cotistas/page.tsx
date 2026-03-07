"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Mail, User, Phone, Home, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";

interface Cotista {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone?: string | null;
  active: boolean;
  cotas: { numeroCota: string; property?: { name: string } }[];
  createdAt: string;
}

export default function VivantCareCotistasPage() {
  const [cotistas, setCotistas] = useState<Cotista[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/cotistas");
        if (res.ok) {
          const data = await res.json();
          setCotistas(data.cotistas || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return cotistas;
    const s = search.trim().toLowerCase();
    return cotistas.filter(
      (c) =>
        c.name.toLowerCase().includes(s) ||
        c.email.toLowerCase().includes(s) ||
        (c.cpf && c.cpf.replace(/\D/g, "").includes(s.replace(/\D/g, ""))) ||
        (c.phone && c.phone.includes(s)) ||
        c.cotas.some((cota) => cota.property?.name?.toLowerCase().includes(s))
    );
  }, [cotistas, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-vivant-navy animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Cotistas</h1>
          <p className="text-gray-500 mt-1">
            {filtered.length} de {cotistas.length} cotista{cotistas.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild className="bg-vivant-navy shrink-0">
          <Link href="/admin/vivant-care/convites/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo convite
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome, e-mail, CPF, telefone ou propriedade..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 max-w-md"
        />
      </div>

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              {cotistas.length === 0
                ? "Nenhum cotista cadastrado."
                : "Nenhum resultado para a busca."}
            </CardContent>
          </Card>
        ) : (
          filtered.map((cotista) => (
            <Card key={cotista.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-vivant-navy" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-vivant-navy">
                          {cotista.name}
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-4 h-4 shrink-0" />
                            {cotista.email}
                          </span>
                          {cotista.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4 shrink-0" />
                              {cotista.phone}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                          cotista.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {cotista.active ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    {cotista.cotas?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {cotista.cotas.map((c: { numeroCota: string; property?: { name: string } }, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-vivant-navy/5 text-vivant-navy rounded text-xs font-medium"
                          >
                            <Home className="w-3 h-3" />
                            {c.property?.name ?? "—"} — {c.numeroCota}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Cadastrado em{" "}
                      {format(new Date(cotista.createdAt), "dd MMM yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
