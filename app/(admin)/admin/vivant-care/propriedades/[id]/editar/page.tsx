import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/property-form";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditarPropriedadeVivantCarePage(props: { params: { id: string } }) {
  const { params } = props;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (
    !hasPermission(session as any, "vivantCare.propriedades.view") &&
    !hasPermission(session as any, "vivantCare.propriedades.manage")
  )
    redirect("/403");

  const property = await prisma.property.findUnique({ where: { id: params.id } });
  if (!property) notFound();

  const destinations = await prisma.destination.findMany({
    where: { published: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <nav className="flex items-center text-sm text-gray-600 mb-4">
        <Link href="/admin/vivant-care" className="hover:text-vivant-navy">Vivant Care</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/admin/vivant-care/propriedades" className="hover:text-vivant-navy">Propriedades</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href={`/admin/vivant-care/propriedades/${params.id}`} className="hover:text-vivant-navy">{property.name}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-vivant-navy font-medium">Editar</span>
      </nav>
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Editar Propriedade</h1>
        <p className="text-gray-600">{property.name}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PropertyForm
          property={property}
          destinations={destinations}
          apiPath="/api/admin/propriedades"
          redirectPath={`/admin/vivant-care/propriedades/${params.id}`}
        />
      </div>
    </div>
  );
}
