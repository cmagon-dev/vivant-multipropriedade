"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { hasPermissionKey } from "@/lib/auth/permissions";

type Destination = {
  id: string;
  name: string;
  slug: string;
  state: string;
  emoji: string;
  subtitle: string;
  _count?: { properties: number };
};

type Property = {
  id: string;
  name: string;
  slug: string;
  location: string;
  cidade: string;
  type: string;
  status: string;
  published: boolean;
  destino?: { id: string; name: string; emoji: string };
};

function can(permissions: string[], key: string, manageKey: string) {
  return hasPermissionKey(permissions, key) || permissions.includes(manageKey);
}

export function PropriedadesList() {
  const router = useRouter();
  const { data: session } = useSession();
  const permissions = (session?.user as { permissions?: string[] } | undefined)?.permissions ?? [];

  const canCreateDest = can(permissions, "destinations.create", "destinations.manage");
  const canEditDest = can(permissions, "destinations.edit", "destinations.manage");
  const canDeleteDest = can(permissions, "destinations.delete", "destinations.manage");
  const canCreateProp = can(permissions, "properties.create", "properties.manage");
  const canEditProp = can(permissions, "properties.edit", "properties.manage");
  const canDeleteProp = can(permissions, "properties.delete", "properties.manage");

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = () => {
    Promise.all([
      fetch("/api/destinations")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch("/api/properties")
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
    ])
      .then(([dests, props]) => {
        setDestinations(Array.isArray(dests) ? dests : []);
        setProperties(Array.isArray(props) ? props : []);
      })
      .catch(() => toast.error("Erro ao carregar dados"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteDestination = async (id: string, name: string) => {
    if (!confirm(`Excluir o destino "${name}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Destino excluído");
        loadData();
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao excluir");
      }
    } catch {
      toast.error("Erro ao excluir destino");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteProperty = async (id: string, name: string) => {
    if (!confirm(`Excluir a propriedade "${name}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Propriedade excluída");
        loadData();
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao excluir");
      }
    } catch {
      toast.error("Erro ao excluir propriedade");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded" />
            ))}
          </div>
          <div className="h-8 w-40 bg-gray-200 rounded mt-6" />
          <div className="h-48 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Destinos */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-vivant-navy flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Destinos
          </h2>
          {canCreateDest && (
            <Button asChild size="sm" className="bg-vivant-navy hover:bg-vivant-navy/90">
              <Link href="/admin/destinos/novo">
                <Plus className="w-4 h-4 mr-2" />
                Novo Destino
              </Link>
            </Button>
          )}
        </div>
        {destinations.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Nenhum destino cadastrado.
              {canCreateDest && (
                <Button asChild className="mt-3 bg-vivant-navy">
                  <Link href="/admin/destinos/novo">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Destino
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((d) => (
              <Card key={d.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <span>{d.emoji}</span>
                    {d.name}
                  </CardTitle>
                  {d.subtitle && (
                    <p className="text-sm text-gray-500 font-normal">{d.subtitle}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-gray-600">
                    {d.state}
                    {d._count != null && (
                      <span className="ml-2 text-vivant-navy font-medium">
                        · {d._count.properties} {d._count.properties === 1 ? "casa" : "casas"}
                      </span>
                    )}
                  </p>
                  {(canEditDest || canDeleteDest) && (
                    <div className="flex gap-2 pt-2">
                      {canEditDest && (
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/destinos/${d.id}/editar`}>
                            <Pencil className="w-3.5 h-3.5 mr-1" />
                            Editar
                          </Link>
                        </Button>
                      )}
                      {canDeleteDest && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={deletingId === d.id}
                          onClick={() => handleDeleteDestination(d.id, d.name)}
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Excluir
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Casas / Propriedades */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-semibold text-vivant-navy flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Casas (Propriedades)
          </h2>
          {canCreateProp && (
            <Button asChild size="sm" className="bg-vivant-navy hover:bg-vivant-navy/90">
              <Link href="/admin/casas/nova">
                <Plus className="w-4 h-4 mr-2" />
                Nova Casa
              </Link>
            </Button>
          )}
        </div>
        {properties.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              Nenhuma propriedade cadastrada.
              {canCreateProp && (
                <Button asChild className="mt-3 bg-vivant-navy">
                  <Link href="/admin/casas/nova">
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Casa
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-700">Nome</th>
                      <th className="text-left p-3 font-medium text-gray-700">Destino</th>
                      <th className="text-left p-3 font-medium text-gray-700">Cidade</th>
                      <th className="text-left p-3 font-medium text-gray-700">Tipo</th>
                      <th className="text-left p-3 font-medium text-gray-700">Status</th>
                      {(canEditProp || canDeleteProp) && (
                        <th className="text-right p-3 font-medium text-gray-700">Ações</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((p) => (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50/50">
                        <td className="p-3 font-medium text-vivant-navy">{p.name}</td>
                        <td className="p-3">
                          {p.destino ? (
                            <span className="flex items-center gap-1">
                              <span>{p.destino.emoji}</span>
                              {p.destino.name}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3 text-gray-600">{p.cidade}</td>
                        <td className="p-3 text-gray-600">{p.type}</td>
                        <td className="p-3">
                          <span
                            className={
                              p.published
                                ? "text-green-700"
                                : "text-amber-700"
                            }
                          >
                            {p.published ? "Publicada" : "Rascunho"}
                          </span>
                        </td>
                        {(canEditProp || canDeleteProp) && (
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-2">
                              {canEditProp && (
                                <Button asChild variant="ghost" size="sm">
                                  <Link href={`/admin/casas/${p.id}/editar`}>
                                    <Pencil className="w-3.5 h-3.5 mr-1" />
                                    Editar
                                  </Link>
                                </Button>
                              )}
                              {canDeleteProp && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  disabled={deletingId === p.id}
                                  onClick={() => handleDeleteProperty(p.id, p.name)}
                                >
                                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                                  Excluir
                                </Button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
