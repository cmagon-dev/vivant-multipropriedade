import { prisma } from "@/lib/prisma";
import { DestinationForm } from "@/components/admin/destination-form";
import { notFound } from "next/navigation";

export default async function EditarDestinoPage({
  params,
}: {
  params: { id: string };
}) {
  const destination = await prisma.destination.findUnique({
    where: { id: params.id },
  });
  
  if (!destination) {
    notFound();
  }
  
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Editar Destino</h1>
        <p className="text-gray-600">{destination.name}</p>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <DestinationForm destination={destination} />
      </div>
    </div>
  );
}
