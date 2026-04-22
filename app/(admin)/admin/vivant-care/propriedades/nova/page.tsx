import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/property-form";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NovaPropriedadeVivantCarePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (
    !hasPermission(session as any, "vivantCare.propriedades.view") &&
    !hasPermission(session as any, "vivantCare.propriedades.manage")
  )
    redirect("/403");

  const destinations = await prisma.destination.findMany({
    where: { published: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <nav className="flex items-center text-sm text-gray-600 mb-4">
        <Link href="/admin/vivant-care" className="hover:text-vivant-navy">
          Vivant Care
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/admin/vivant-care/propriedades" className="hover:text-vivant-navy">
          Propriedades
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-vivant-navy font-medium">Nova</span>
      </nav>

      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Nova Propriedade</h1>
        <p className="text-gray-600">Cadastre uma nova propriedade no sistema</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PropertyForm
          destinations={destinations}
          apiPath="/api/admin/propriedades"
          redirectPath="/admin/vivant-care/propriedades"
        />
      </div>
    </div>
  );
}
