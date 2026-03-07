"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userCreateSchema, userUpdateSchema, UserCreateInput, UserUpdateInput } from "@/lib/validations/user";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { HelpTip } from "@/components/help/HelpTip";
import { toast } from "sonner";

type GroupedPermission = { group: string; permissions: { id: string; key: string; name: string }[] }[];
type RoleOption = { id: string; key: string; name: string; description?: string | null }[];

const MODULE_LABELS: Record<string, string> = {
  crm: "CRM",
  users: "Usuários",
  roles: "Roles",
  permissions: "Permissões",
  properties: "Casas",
  destinations: "Destinos",
  events: "Auditoria (Eventos)",
  tasks: "Auditoria (Tarefas)",
  help: "Ajuda",
  dashboard: "Dashboard",
  cotista: "Portal Cotista",
  companies: "Empresas",
  leads: "Leads (legado)",
  admin: "Admin",
  outros: "Outros",
};

const MODULE_ORDER = ["crm", "properties", "destinations", "users", "roles", "permissions", "events", "tasks", "help", "dashboard", "cotista", "companies", "leads", "admin", "outros"];

interface UserFormProps {
  user?: any;
}

export function UserForm({ user }: UserFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<RoleOption>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<GroupedPermission>([]);
  const [extraKeys, setExtraKeys] = useState<string[]>(user?.extraPermissionKeys ?? []);
  const isEditing = !!user;

  const form = useForm<UserCreateInput | UserUpdateInput>({
    resolver: zodResolver(isEditing ? userUpdateSchema : userCreateSchema),
    defaultValues: user
      ? {
          name: user.name,
          email: user.email,
          password: "",
          roleKey: user.roleKey ?? "COMMERCIAL",
          active: user.active,
          defaultRoute: user.defaultRoute ?? "",
          extraPermissionKeys: user.extraPermissionKeys ?? [],
        }
      : {
          name: "",
          email: "",
          password: "",
          roleKey: "COMMERCIAL",
          extraPermissionKeys: [],
        },
  });

  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  const [activeValue, setActiveValue] = useState(user?.active ?? true);

  useEffect(() => {
    fetch("/api/roles")
      .then((r) => (r.ok ? r.json() : []))
      .then(setRoles)
      .catch(() => setRoles([]));
  }, []);

  useEffect(() => {
    fetch("/api/users/permissions")
      .then((r) => (r.ok ? r.json() : []))
      .then(setGroupedPermissions)
      .catch(() => setGroupedPermissions([]));
  }, []);

  useEffect(() => {
    if (user?.extraPermissionKeys?.length) setExtraKeys(user.extraPermissionKeys);
  }, [user?.extraPermissionKeys]);

  const toggleExtraPermission = (key: string, checked: boolean) => {
    setExtraKeys((prev) => (checked ? [...prev, key] : prev.filter((k) => k !== key)));
    setValue("extraPermissionKeys", checked ? [...extraKeys, key] : extraKeys.filter((k) => k !== key), { shouldValidate: true });
  };

  const onSubmit = async (data: UserCreateInput | UserUpdateInput) => {
    setIsSubmitting(true);
    try {
      const url = isEditing ? `/api/users/${user.id}` : "/api/users";
      const method = isEditing ? "PUT" : "POST";
      const payload = isEditing
        ? { ...data, password: ("password" in data && data.password) ? data.password : undefined, active: activeValue, roleKey: watch("roleKey"), extraPermissionKeys: extraKeys }
        : { name: data.name, email: data.email, password: data.password, roleKey: (data as UserCreateInput).roleKey, extraPermissionKeys: extraKeys };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEditing ? "Usuário atualizado!" : "Usuário criado");
        router.push("/admin/usuarios");
        router.refresh();
      } else {
        const err = await res.json();
        toast.error(err.error || "Erro ao salvar");
      }
    } catch {
      toast.error("Erro ao salvar usuário");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Informações do Usuário
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="flex items-center gap-1">
              Nome Completo *
              <HelpTip helpKey="users.name" fallbackTitle="Nome" fallbackText="Nome completo do usuário." />
            </Label>
            <Input id="name" {...register("name")} placeholder="João Silva" />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="email" className="flex items-center gap-1">
              Email *
              <HelpTip helpKey="users.email" fallbackTitle="Email" fallbackText="E-mail de login do usuário." />
            </Label>
            <Input id="email" type="email" {...register("email")} placeholder="joao@vivant.com.br" />
            {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="flex items-center gap-1">
            {isEditing ? "Nova Senha (deixe vazio para manter)" : "Senha *"}
            <HelpTip helpKey="users.password" fallbackTitle="Senha" fallbackText="Mínimo 8 caracteres. Será criptografada." />
          </Label>
          <Input id="password" type="password" {...register("password")} placeholder="••••••••" />
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>}
          {isEditing && <p className="text-xs text-gray-500 mt-1">Preencha apenas se desejar alterar a senha</p>}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
          Permissões e Acesso (RBAC)
        </h2>

        <div className="space-y-4">
          <div>
            <Label className="flex items-center gap-1">
              Role *
              <HelpTip helpKey="users.role" fallbackTitle="Role" fallbackText="Perfil RBAC do banco: OWNER (admin), COMMERCIAL (painel comercial), COTISTA (portal), STAFF (dashboard). Permissões da role são herdadas; use 'Permissões extras' para overrides." />
            </Label>
            <Select
              value={watch("roleKey") ?? "COMMERCIAL"}
              onValueChange={(v: string) => setValue("roleKey", v)}
            >
              <SelectTrigger><SelectValue placeholder="Selecione o role" /></SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.key}>
                    {r.key} — {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(() => {
              const roleKey = watch("roleKey") ?? "";
              const roleHint: Record<string, string> = {
                OWNER: "Acesso total ao sistema (admin).",
                SUPER_ADMIN: "Acesso total ao sistema.",
                ADMIN: "Administrador da empresa/portal.",
                COMMERCIAL: "Acesso Comercial (CRM). Após login: /dashboard/comercial.",
                COTISTA: "Portal do Cotista. Após login: /cotista.",
                STAFF: "Equipe. Após login: /dashboard.",
              };
              const hint = roleHint[roleKey];
              if (!hint) return null;
              return <p className="text-sm text-muted-foreground mt-1.5">{hint}</p>;
            })()}
          </div>
          {isEditing && (
            <>
              <div>
                <Label htmlFor="defaultRoute">Rota padrão pós-login (opcional)</Label>
                <Input id="defaultRoute" {...register("defaultRoute")} placeholder="/admin/overview" />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded">
                <div>
                  <Label>Usuário ativo?</Label>
                  <p className="text-sm text-gray-500">Desative para bloquear acesso</p>
                </div>
                <Switch checked={activeValue} onCheckedChange={(c) => setActiveValue(c)} />
              </div>
            </>
          )}
          {groupedPermissions.length > 0 && (
            <div className="rounded border border-gray-200 p-4 bg-gray-50/50">
              <Label className="flex items-center gap-1 mb-3 block">
                Permissões extras (override)
                <HelpTip helpKey="users.overrides" fallbackTitle="Extras" fallbackText="Conceda permissões adicionais além do role. Ex: STAFF com comercial.view acessa o comercial." />
              </Label>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {[...groupedPermissions]
                  .sort((a, b) => {
                    const ia = MODULE_ORDER.indexOf(a.group);
                    const ib = MODULE_ORDER.indexOf(b.group);
                    if (ia !== -1 && ib !== -1) return ia - ib;
                    if (ia !== -1) return -1;
                    if (ib !== -1) return 1;
                    return (a.group || "").localeCompare(b.group || "");
                  })
                  .map(({ group, permissions }) => (
                  <div key={group}>
                    <p className="text-xs font-medium text-gray-600 uppercase mb-1">
                      {MODULE_LABELS[group] ?? group}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {permissions.map((p) => (
                        <label key={p.id} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={extraKeys.includes(p.key)}
                            onCheckedChange={(checked) => toggleExtraPermission(p.key, !!checked)}
                          />
                          <span>{p.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-vivant-navy hover:bg-vivant-navy/90">
          {isSubmitting ? "Salvando..." : isEditing ? "Atualizar Usuário" : "Criar Usuário"}
        </Button>
      </div>
    </form>
  );
}
