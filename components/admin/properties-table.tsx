"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PropertiesTableProps {
  properties: any[];
}

export function PropertiesTable({ properties }: PropertiesTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${name}"?`)) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Casa deletada com sucesso");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Erro ao deletar casa");
      }
    } catch (error) {
      toast.error("Erro ao deletar casa");
    } finally {
      setIsDeleting(null);
    }
  };
  
  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/properties/${id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      });
      
      if (res.ok) {
        toast.success(currentStatus ? "Casa despublicada" : "Casa publicada");
        router.refresh();
      } else {
        toast.error("Erro ao atualizar status");
      }
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };
  
  if (properties.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhuma casa cadastrada
        </h3>
        <p className="text-gray-600 mb-4">
          Comece criando sua primeira propriedade
        </p>
        <Button asChild className="bg-vivant-navy">
          <Link href="/admin/casas/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Casa
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
              Casa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destino
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Preço
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Publicado
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {properties.map((property) => (
            <tr key={property.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={property.images[0]}
                    alt={property.name}
                    className="w-16 h-12 rounded object-cover"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {property.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {property.cidade}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {property.destino.name}
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {property.price}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={property.status} />
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => togglePublished(property.id, property.published)}
                  className="text-gray-400 hover:text-gray-600"
                  title={property.published ? "Despublicar" : "Publicar"}
                >
                  {property.published ? (
                    <Eye className="w-5 h-5 text-green-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/casas/${property.id}/editar`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(property.id, property.name)}
                    disabled={isDeleting === property.id}
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

import { Building2, Plus } from "lucide-react";
