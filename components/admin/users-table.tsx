"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Users as UsersIcon, Plus, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type AccountItem =
  | {
      id: string;
      name: string;
      email: string;
      active: boolean;
      createdAt: Date;
      tipo: "admin";
      roleKey: string | null;
      roleName: string | null;
      _count: { properties: number; destinations: number };
    }
  | {
      id: string;
      name: string;
      email: string;
      active: boolean;
      createdAt: Date;
      tipo: "cotista";
      cpf?: string;
      _count: { cotas: number };
    };

interface UsersTableProps {
  /** Lista unificada de usuários admin e cotistas */
  accounts: AccountItem[];
}

export function UsersTable({ accounts }: UsersTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar o usuário "${name}"?`)) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Usuário deletado com sucesso");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Erro ao deletar usuário");
      }
    } catch (error) {
      toast.error("Erro ao deletar usuário");
    } finally {
      setIsDeleting(null);
    }
  };

  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhuma conta cadastrada
        </h3>
        <p className="text-gray-600 mb-4">
          Adicione usuários do sistema ou cotistas (via Portal)
        </p>
        <Button asChild className="bg-vivant-navy">
          <Link href="/admin/usuarios/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conta
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role / Perfil
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Conteúdo
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {accounts.map((account) => (
            <tr key={`${account.tipo}-${account.id}`} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${account.tipo === "admin" ? "bg-vivant-navy text-white" : "bg-vivant-green/20 text-vivant-green"}`}>
                    {account.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {account.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {account.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge variant={account.tipo === "admin" ? "default" : "secondary"}>
                  {account.tipo === "admin" ? "Admin" : "Cotista"}
                </Badge>
              </td>
              <td className="px-6 py-4">
                {account.tipo === "admin" ? (
                  <Badge variant={account.roleKey === "OWNER" || account.roleKey === "SUPER_ADMIN" ? "default" : "secondary"}>
                    {account.roleKey ?? account.roleName ?? "—"}
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-600">Cotista</span>
                )}
              </td>
              <td className="px-6 py-4">
                <Badge variant={account.active ? "default" : "destructive"}>
                  {account.active ? "Ativo" : "Inativo"}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {account.tipo === "admin" ? (
                  <div className="flex gap-3">
                    <span>{account._count.properties} casas</span>
                    <span>{account._count.destinations} destinos</span>
                  </div>
                ) : (
                  <span>{account._count.cotas} cota(s)</span>
                )}
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  {account.tipo === "admin" ? (
                    <>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/usuarios/${account.id}/editar`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(account.id, account.name)}
                        disabled={isDeleting === account.id}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/admin-portal/cotistas" title="Ver cotistas no Portal">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
