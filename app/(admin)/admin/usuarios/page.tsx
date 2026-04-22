import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UsersTable } from "@/components/admin/users-table";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";

export default async function UsersPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "users.manage")) redirect("/admin/overview");

  const [usersRaw, cotistasRaw] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        defaultRoute: true,
        createdAt: true,
        userRoleAssignments: {
          take: 1,
          orderBy: { id: "asc" as const },
          select: { role: { select: { key: true, name: true } } },
        },
        _count: {
          select: {
            properties: true,
            destinations: true,
          }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.cotista.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        cpf: true,
        active: true,
        createdAt: true,
        _count: { select: { cotas: true } },
      },
      orderBy: { createdAt: "desc" }
    }),
  ]);

  const users = usersRaw.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    active: u.active,
    defaultRoute: u.defaultRoute,
    createdAt: u.createdAt,
    roleKey: u.userRoleAssignments?.[0]?.role?.key ?? null,
    roleName: u.userRoleAssignments?.[0]?.role?.name ?? null,
    _count: u._count,
    tipo: "admin" as const,
  }));

  const cotistas = cotistasRaw.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    active: c.active,
    createdAt: c.createdAt,
    cpf: c.cpf,
    _count: c._count,
    tipo: "cotista" as const,
  }));

  const todasContas = [...users, ...cotistas].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Usuários</h1>
          <p className="text-gray-600">Gerencie acessos ao sistema</p>
        </div>
        
        <Button asChild className="bg-vivant-navy">
          <Link href="/admin/usuarios/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Link>
        </Button>
      </div>
      
      <UsersTable accounts={todasContas} />
    </div>
  );
}
