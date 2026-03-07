import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/property-form";
import { HelpTip } from "@/components/help/HelpTip";

export default async function NovaPropriedadePage() {
  const destinations = await prisma.destination.findMany({
    where: { published: true },
    select: { id: true, name: true },
    orderBy: { name: "asc" }
  });
  
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold text-vivant-navy">Nova Casa</h1>
          <HelpTip helpKey="properties.create" fallbackTitle="Nova propriedade" fallbackText="Preencha os dados da propriedade. O slug será gerado automaticamente a partir do nome." />
        </div>
        <p className="text-gray-600">Cadastre uma nova propriedade</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <PropertyForm destinations={destinations} />
      </div>
    </div>
  );
}
