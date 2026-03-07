"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Key, Search } from "lucide-react";
import { toast } from "sonner";
import { getPermissionByKey } from "@/lib/auth/permissionCatalog";

type Permission = { id: string; key: string; name: string; description: string | null; group: string };

const MODULE_LABELS: Record<string, string> = {
  crm: "CRM",
  users: "Usuários",
  roles: "Roles",
  permissions: "Permissões",
  properties: "Propriedades",
  destinations: "Destinos",
  events: "Eventos",
  tasks: "Tarefas",
  help: "Ajuda",
  dashboard: "Dashboard",
  cotista: "Cotista",
  companies: "Empresas",
};

const RISK_LABELS: Record<string, string> = {
  low: "Baixo",
  medium: "Médio",
  high: "Alto",
  critical: "Crítico",
};

export function PermissionsList() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/permissions")
      .then((r) => r.json())
      .then((p) => setPermissions(Array.isArray(p) ? p : []))
      .catch(() => toast.error("Erro ao carregar permissões"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return permissions;
    const q = search.trim().toLowerCase();
    return permissions.filter(
      (p) =>
        p.key.toLowerCase().includes(q) ||
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.group && p.group.toLowerCase().includes(q))
    );
  }, [permissions, search]);

  const byModule = useMemo(() => {
    const acc: Record<string, Permission[]> = {};
    for (const p of filtered) {
      const mod = p.group || "outros";
      (acc[mod] = acc[mod] || []).push(p);
    }
    return acc;
  }, [filtered]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-vivant-navy" />
      </div>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, key ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="space-y-6">
          {Object.entries(byModule)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([module, perms]) => (
              <div key={module}>
                <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                  {MODULE_LABELS[module] ?? module}
                </h3>
                <ul className="space-y-2">
                  {perms.map((p) => {
                    const catalog = getPermissionByKey(p.key);
                    return (
                      <li
                        key={p.id}
                        className="flex flex-wrap items-start gap-3 py-3 border-b border-gray-100 last:border-0"
                      >
                        <Key className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-medium">{catalog?.label ?? p.name}</span>
                          <span className="text-gray-500 text-sm ml-2 font-mono">{p.key}</span>
                          {p.description && (
                            <p className="text-sm text-gray-500 mt-0.5">{p.description}</p>
                          )}
                          <div className="flex gap-3 mt-1 text-xs text-gray-400">
                            {catalog && (
                              <>
                                <span>Ação: {catalog.action}</span>
                                <span>Risco: {RISK_LABELS[catalog.riskLevel] ?? catalog.riskLevel}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
