import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PropertiesTable } from "@/components/admin/properties-table";
import { prisma } from "@/lib/prisma";

export default async function PropertiesListPage() {
  const properties = await prisma.property.findMany({
    include: {
      destino: true,
      createdBy: {
        select: { name: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Casas</h1>
          <p className="text-gray-600">Gerencie todas as propriedades</p>
        </div>
        
        <Button asChild className="bg-vivant-navy hover:bg-vivant-navy/90">
          <Link href="/admin/casas/nova">
            <Plus className="w-4 h-4 mr-2" />
            Nova Casa
          </Link>
        </Button>
      </div>
      
      <PropertiesTable properties={properties} />
    </div>
  );
}
