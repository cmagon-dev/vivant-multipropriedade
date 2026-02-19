"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Users as UsersIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface UsersTableProps {
  users: any[];
}

export function UsersTable({ users }: UsersTableProps) {
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
  
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <UsersIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum usuário cadastrado
        </h3>
        <p className="text-gray-600 mb-4">
          Comece criando o primeiro usuário
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
              Usuário
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Função
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
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-vivant-navy text-white flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {user.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <Badge variant={
                  user.role === "ADMIN" ? "default" : 
                  user.role === "EDITOR" ? "secondary" : 
                  "outline"
                }>
                  {user.role}
                </Badge>
              </td>
              <td className="px-6 py-4">
                <Badge variant={user.active ? "default" : "destructive"}>
                  {user.active ? "Ativo" : "Inativo"}
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div className="flex gap-3">
                  <span>{user._count.properties} casas</span>
                  <span>{user._count.destinations} destinos</span>
                </div>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/usuarios/${user.id}/editar`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(user.id, user.name)}
                    disabled={isDeleting === user.id}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
