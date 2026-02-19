"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff, MapPin, Plus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DestinationsTableProps {
  destinations: any[];
}

export function DestinationsTable({ destinations }: DestinationsTableProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar "${name}"?`)) return;
    
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Destino deletado com sucesso");
        router.refresh();
      } else {
        const error = await res.json();
        toast.error(error.error || "Erro ao deletar destino");
      }
    } catch (error) {
      toast.error("Erro ao deletar destino");
    } finally {
      setIsDeleting(null);
    }
  };
  
  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/destinations/${id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      });
      
      if (res.ok) {
        toast.success(currentStatus ? "Destino despublicado" : "Destino publicado");
        router.refresh();
      } else {
        toast.error("Erro ao atualizar status");
      }
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };
  
  if (destinations.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhum destino cadastrado
        </h3>
        <p className="text-gray-600 mb-4">
          Comece criando seu primeiro destino
        </p>
        <Button asChild className="bg-vivant-navy">
          <Link href="/admin/destinos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Destino
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
              Destino
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Propriedades
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ordem
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
          {destinations.map((destination) => (
            <tr key={destination.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{destination.emoji}</div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {destination.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {destination.subtitle}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {destination.state}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <Badge variant="secondary">
                  {destination._count.properties} casas
                </Badge>
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {destination.order}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => togglePublished(destination.id, destination.published)}
                  className="text-gray-400 hover:text-gray-600"
                  title={destination.published ? "Despublicar" : "Publicar"}
                >
                  {destination.published ? (
                    <Eye className="w-5 h-5 text-green-600" />
                  ) : (
                    <EyeOff className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/destinos/${destination.id}/editar`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(destination.id, destination.name)}
                    disabled={isDeleting === destination.id}
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
