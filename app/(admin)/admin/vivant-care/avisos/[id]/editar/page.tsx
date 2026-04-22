import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AvisoForm } from "@/components/admin/aviso-form";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditarAvisoVivantCarePage(props: { params: { id: string } }) {
  const { params } = props;
  const session = await getSession();
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "vivantCare.avisos.manage")) redirect("/403");

  const [aviso, properties, cotistas, destinos] = await Promise.all([
    prisma.mensagem.findUnique({ where: { id: params.id } }),
    prisma.property.findMany({ select: { id: true, name: true, condominio: true }, orderBy: { name: "asc" } }),
    prisma.cotista.findMany({
      where: { active: true },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
    prisma.destination.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);
  const condominios = Array.from(new Set(properties.map((property) => property.condominio).filter(Boolean)));

  if (!aviso) notFound();

  return (
    <div className="space-y-6">
      <nav className="flex items-center text-sm text-gray-600 mb-4">
        <Link href="/admin/vivant-care" className="hover:text-vivant-navy">Vivant Care</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/admin/vivant-care/avisos" className="hover:text-vivant-navy">Avisos</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href={`/admin/vivant-care/avisos/${params.id}`} className="hover:text-vivant-navy">{aviso.titulo}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-vivant-navy font-medium">Editar</span>
      </nav>
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Editar Aviso</h1>
        <p className="text-gray-600">{aviso.titulo}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <AvisoForm
          aviso={{
            id: aviso.id,
            propertyId: aviso.propertyId,
            targetType: aviso.targetType,
            targetCotistaId: aviso.targetCotistaId,
            targetCondominio: aviso.targetCondominio,
            targetDestinoId: aviso.targetDestinoId,
            titulo: aviso.titulo,
            conteudo: aviso.conteudo,
            tipo: aviso.tipo,
            prioridade: aviso.prioridade,
            fixada: aviso.fixada,
            ativa: aviso.ativa,
          }}
          properties={properties.map((property) => ({ id: property.id, name: property.name }))}
          cotistas={cotistas}
          destinos={destinos}
          condominios={condominios as string[]}
          redirectPath="/admin/vivant-care/avisos"
        />
      </div>
    </div>
  );
}
