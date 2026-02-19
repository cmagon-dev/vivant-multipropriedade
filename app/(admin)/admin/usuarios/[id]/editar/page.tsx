import { prisma } from "@/lib/prisma";
import { UserForm } from "@/components/admin/user-form";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function EditarUsuarioPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  
  if (session?.user.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }
  
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
    }
  });
  
  if (!user) {
    notFound();
  }
  
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Editar Usuário</h1>
        <p className="text-gray-600">{user.name}</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <UserForm user={user} />
      </div>
    </div>
  );
}
