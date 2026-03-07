import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AvisoForm } from "@/components/admin/aviso-form";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NovoAvisoVivantCarePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "vivantCare.avisos.manage")) redirect("/403");

  const properties = await prisma.property.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <nav className="flex items-center text-sm text-gray-600 mb-4">
        <Link href="/admin/vivant-care" className="hover:text-vivant-navy">Vivant Care</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/admin/vivant-care/avisos" className="hover:text-vivant-navy">Avisos</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-vivant-navy font-medium">Novo</span>
      </nav>
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Novo Aviso</h1>
        <p className="text-gray-600">Crie um comunicado para os cotistas</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <AvisoForm properties={properties} redirectPath="/admin/vivant-care/avisos" />
      </div>
    </div>
  );
}
