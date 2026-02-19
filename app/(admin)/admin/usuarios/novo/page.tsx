import { UserForm } from "@/components/admin/user-form";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function NovoUsuarioPage() {
  const session = await getServerSession(authOptions);
  
  if (session?.user.role !== "ADMIN") {
    redirect("/admin/dashboard");
  }
  
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Novo Usuário</h1>
        <p className="text-gray-600">Cadastre um novo usuário no sistema</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <UserForm />
      </div>
    </div>
  );
}
