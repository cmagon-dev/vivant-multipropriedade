import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/property-form";
import { notFound } from "next/navigation";

export default async function EditarPropriedadePage({
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
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Editar Casa</h1>
        <p className="text-gray-600">{property.name}</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PropertyForm property={property} destinations={destinations} />
      </div>
    </div>
  );
}
