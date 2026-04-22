import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AssembleiaForm } from "@/components/admin/assembleia-form";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NovaAssembleiaPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "vivantCare.assembleias.manage")) redirect("/403");
  const properties = await prisma.property.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return (
    <div className="space-y-6">
      <nav className="flex items-center text-sm text-gray-600 mb-4">
        <Link href="/admin/vivant-care" className="hover:text-vivant-navy">Vivant Care</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/admin/vivant-care/assembleias" className="hover:text-vivant-navy">Assembleias</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-vivant-navy font-medium">Nova</span>
      </nav>
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Nova Assembleia</h1>
        <p className="text-gray-600">Cadastre uma nova assembleia</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <AssembleiaForm properties={properties} redirectPath="/admin/vivant-care/assembleias" />
      </div>
    </div>
  );
}
