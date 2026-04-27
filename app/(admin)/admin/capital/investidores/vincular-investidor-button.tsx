"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UserPlus, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

type User = { id: string; name: string; email: string };

export function VincularInvestidorButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [filter, setFilter] = useState("");
  const [tipo, setTipo] = useState("PESSOA_FISICA");
  const [documento, setDocumento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [perfil, setPerfil] = useState("QUALIFICADO");
  const [kycStatus, setKycStatus] = useState("PENDENTE");
  const [observacoes, setObservacoes] = useState("");

  const filteredUsers = useMemo(() => {
    if (!filter.trim()) return users;
    const q = filter.trim().toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q)
    );
  }, [users, filter]);

  useEffect(() => {
    if (open) {
      setLoading(true);
      setSelectedUserId("");
      setFilter("");
      setTipo("PESSOA_FISICA");
      setDocumento("");
      setTelefone("");
      setPerfil("QUALIFICADO");
      setKycStatus("PENDENTE");
      setObservacoes("");
      fetch("/api/admin/capital/investidores/available-users")
        .then((r) => r.json())
        .then((data) => {
          setUsers(Array.isArray(data?.users) ? data.users : []);
        })
        .catch(() => toast.error("Erro ao carregar usuários"))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Selecione um usuário");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/capital/investidores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUserId,
          tipo,
          documento,
          telefone,
          perfil,
          kycStatus,
          observacoes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        toast.success("Perfil de investidor criado. O usuário já aparece na lista e pode ser vinculado a ativos.");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(data.error ?? "Erro ao vincular usuário");
      }
    } catch {
      toast.error("Erro ao vincular usuário");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-vivant-navy hover:bg-vivant-navy/90">
          <UserPlus className="w-4 h-4 mr-2" />
          Vincular usuário
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Vincular usuário como investidor</DialogTitle>
          <DialogDescription>
            Só aparecem usuários com perfil Capital (role Investidor). Crie o perfil para o usuário aparecer aqui e poder vinculá-lo a ativos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Usuário</Label>
            {loading ? (
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Carregando usuários Capital sem perfil…
              </p>
            ) : users.length === 0 ? (
              <p className="text-sm text-gray-500">
                Nenhum usuário Capital disponível. Cadastre usuários com role Investidor (ou permissão Capital) em Usuários; quem já tem perfil de investidor não aparece aqui.
              </p>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome ou e-mail"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="pl-9"
                  />
                </div>
                {filteredUsers.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum resultado para o filtro.</p>
                ) : (
                  <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um usuário" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredUsers.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.name} ({u.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Tipo</Label>
              <Select value={tipo} onValueChange={setTipo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PESSOA_FISICA">Pessoa Física</SelectItem>
                  <SelectItem value="PESSOA_JURIDICA">Pessoa Jurídica</SelectItem>
                  <SelectItem value="INSTITUCIONAL">Institucional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Perfil</Label>
              <Select value={perfil} onValueChange={setPerfil}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="QUALIFICADO">Qualificado</SelectItem>
                  <SelectItem value="PROFISSIONAL">Profissional</SelectItem>
                  <SelectItem value="INSTITUCIONAL">Institucional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>KYC</Label>
              <Select value={kycStatus} onValueChange={setKycStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDENTE">Pendente</SelectItem>
                  <SelectItem value="APROVADO">Aprovado</SelectItem>
                  <SelectItem value="REPROVADO">Reprovado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Documento</Label>
              <Input value={documento} onChange={(e) => setDocumento(e.target.value)} placeholder="CPF/CNPJ" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Telefone</Label>
              <Input value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-9999" />
            </div>
            <div className="space-y-1 md:col-span-2">
              <Label>Observações</Label>
              <Input value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Observações internas" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting || loading || filteredUsers.length === 0 || !selectedUserId}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Vincular
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
