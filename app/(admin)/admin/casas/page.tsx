import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PropertiesTable } from "@/components/admin/properties-table";
import { PropertiesFilters } from "@/components/admin/properties-filters";
import { prisma } from "@/lib/prisma";

interface SearchParams {
  search?: string;
  destinoId?: string;
  status?: string;
  published?: string;
}

export default async function PropertiesListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { search, destinoId, status, published } = searchParams;
  
  const whereClause: any = {};
  
  if (search) {
    whereClause.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { cidade: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }
  
  if (destinoId && destinoId !== 'all') {
    whereClause.destinoId = destinoId;
  }
  
  if (status && status !== 'all') {
    whereClause.status = status;
  }
  
  if (published === 'true') {
    whereClause.published = true;
  } else if (published === 'false') {
    whereClause.published = false;
  }
  
  const [properties, destinations] = await Promise.all([
    prisma.property.findMany({
      where: whereClause,
      include: {
        destino: true,
        createdBy: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.destination.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    }),
  ]);
  
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
      
      <PropertiesFilters destinations={destinations} />
      
      <PropertiesTable properties={properties} />
    </div>
  );
}
