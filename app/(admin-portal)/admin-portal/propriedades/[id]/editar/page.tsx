import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/property-form";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default async function EditarPropriedadeAdminPortalPage({
  params,
}: {
  params: { id: string };
}) {
  const [property, destinations] = await Promise.all([
    prisma.property.findUnique({
      where: { id: params.id },
    }),
    prisma.destination.findMany({
      where: { published: true },
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    })
  ]);
  
  if (!property) {
    notFound();
  }
  
  return (
    <div className="space-y-6">
      <nav className="flex items-center text-sm text-gray-600 mb-4">
        <Link href="/admin-portal" className="hover:text-vivant-navy">
          Admin Portal
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/admin-portal/propriedades" className="hover:text-vivant-navy">
          Propriedades
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href={`/admin-portal/propriedades/${params.id}`} className="hover:text-vivant-navy">
          {property.name}
        </Link>
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
          redirectPath={`/admin-portal/propriedades/${params.id}`}
        />
      </div>
    </div>
  );
}
