import { prisma } from "@/lib/prisma";
import { PropertyForm } from "@/components/admin/property-form";
import { PropertyDocsAssetsManager } from "@/components/admin/property-docs-assets-manager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      
      <Tabs defaultValue="dados" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
          <TabsTrigger value="dados">Dados da casa</TabsTrigger>
          <TabsTrigger value="documentos">Documentos da casa</TabsTrigger>
          <TabsTrigger value="imobilizado">Imobilizado da casa</TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="mt-0">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <PropertyForm property={property} destinations={destinations} />
          </div>
        </TabsContent>

        <TabsContent value="documentos" className="mt-0">
          <PropertyDocsAssetsManager propertyId={property.id} sections="documents" />
        </TabsContent>

        <TabsContent value="imobilizado" className="mt-0">
          <PropertyDocsAssetsManager propertyId={property.id} sections="assets" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
