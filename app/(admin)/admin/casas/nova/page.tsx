import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/property-form";

export default async function NovaPropriedadePage() {
  const destinations = await prisma.destination.findMany({
    where: { published: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });
  
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Nova Casa</h1>
        <p className="text-gray-600">Cadastre uma nova propriedade</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PropertyForm destinations={destinations} />
      </div>
    </div>
  );
}
