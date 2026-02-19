import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DestinationsTable } from "@/components/admin/destinations-table";
import { prisma } from "@/lib/prisma";

export default async function DestinosListPage() {
  const destinations = await prisma.destination.findMany({
    include: {
      createdBy: {
        select: { name: true }
      },
      _count: {
        select: { properties: true }
      }
    },
    orderBy: { order: "asc" }
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Destinos</h1>
          <p className="text-gray-600">Gerencie todos os destinos</p>
        </div>
        
        <Button asChild className="bg-vivant-navy hover:bg-vivant-navy/90">
          <Link href="/admin/destinos/novo">
            <Plus className="w-4 h-4 mr-2" />
            Novo Destino
          </Link>
        </Button>
      </div>
      
      <DestinationsTable destinations={destinations} />
    </div>
  );
}
