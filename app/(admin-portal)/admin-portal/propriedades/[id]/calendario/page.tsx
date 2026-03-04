import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { CalendarioPropriedade } from "@/components/admin-portal/calendario-propriedade";

export default async function CalendarioPropriedadePage({
  params,
}: {
  params: { id: string };
}) {
  const propriedade = await prisma.property.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      totalCotas: true,
    }
  });
  
  if (!propriedade) {
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
          {propriedade.name}
        </Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-vivant-navy font-medium">Calendário</span>
      </nav>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Calendário de Uso</h1>
          <p className="text-gray-600">{propriedade.name}</p>
        </div>
        
        <Button variant="outline" asChild>
          <Link href={`/admin-portal/propriedades/${params.id}`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Link>
        </Button>
      </div>
      
      <CalendarioPropriedade propriedadeId={params.id} />
    </div>
  );
}
