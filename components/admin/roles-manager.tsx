"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Role = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  rolePermissions: { permission: { id: string; key: string; name: string; group: string } }[];
  _count?: { rolePermissions: number; userRoleAssignments: number };
};

type Permission = { id: string; key: string; name: string; group: string };

export function RolesManager() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPerms, setSelectedPerms] = useState<Record<string, Set<string>>>({});

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/roles").then((r) => r.json()),
      fetch("/api/admin/permissions").then((r) => r.json()),
    ])
      .then(([r, p]) => {
        setRoles(Array.isArray(r) ? r : []);
        setPermissions(Array.isArray(p) ? p : []);
        const map: Record<string, Set<string>> = {};
        (Array.isArray(r) ? r : []).forEach((role: Role) => {
          map[role.id] = new Set(role.rolePermissions?.map((rp) => rp.permission.id) ?? []);
        });
        setSelectedPerms(map);
      })
      .catch(() => toast.error("Erro ao carregar dados"))
      .finally(() => setLoading(false));
  }, []);

  const saveRolePermissions = async (roleId: string) => {
    const permIds = Array.from(selectedPerms[roleId] ?? []);
    try {
      const res = await fetch(`/api/admin/roles/${roleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permissionIds: permIds }),
      });
      if (res.ok) {
        toast.success("Permissões atualizadas");
        setEditingId(null);
        const updated = await res.json();
        setRoles((prev) => prev.map((r) => (r.id === roleId ? { ...r, rolePermissions: updated.rolePermissions ?? r.rolePermissions } : r)));
        setSelectedPerms((prev) => ({
          ...prev,
          [roleId]: new Set(updated.rolePermissions?.map((rp: { permission: { id: string } }) => rp.permission.id) ?? []),
        }));
      } else {
        const e = await res.json();
        toast.error(e.error || "Erro ao salvar");
      }
    } catch {
      toast.error("Erro ao salvar");
    }
  };

  const togglePerm = (roleId: string, permId: string) => {
    setSelectedPerms((prev) => {
      const set = new Set(prev[roleId] ?? []);
      if (set.has(permId)) set.delete(permId);
      else set.add(permId);
      return { ...prev, [roleId]: set };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-vivant-navy" />
      </div>
    );
  }

  const byGroup = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    (acc[p.group] = acc[p.group] || []).push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {roles.map((role) => (
        <Card key={role.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-vivant-navy" />
              <div>
                <h3 className="font-semibold">{role.name}</h3>
                <p className="text-sm text-gray-500">{role.key} {role.isSystem && "(sistema)"}</p>
              </div>
            </div>
            {editingId === role.id ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancelar</Button>
                <Button size="sm" onClick={() => saveRolePermissions(role.id)}>Salvar</Button>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={() => setEditingId(role.id)}>Editar permissões</Button>
            )}
          </CardHeader>
          <CardContent>
            {editingId === role.id ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(byGroup).map(([group, perms]) => (
                  <div key={group}>
                    <Label className="text-xs font-medium text-gray-500 uppercase">{group}</Label>
                    <div className="mt-2 space-y-2">
                      {perms.map((p) => (
                        <div key={p.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${role.id}-${p.id}`}
                            checked={(selectedPerms[role.id] ?? new Set()).has(p.id)}
                            onCheckedChange={() => togglePerm(role.id, p.id)}
                          />
                          <label htmlFor={`${role.id}-${p.id}`} className="text-sm">{p.name} ({p.key})</label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {role.rolePermissions?.length ?? 0} permissões atribuídas
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
