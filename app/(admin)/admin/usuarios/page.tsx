import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UsersTable } from "@/components/admin/users-table";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }
  
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      _count: {
        select: {
          properties: true,
          destinations: true,
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  
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
      
      <UsersTable users={users} />
    </div>
  );
}
