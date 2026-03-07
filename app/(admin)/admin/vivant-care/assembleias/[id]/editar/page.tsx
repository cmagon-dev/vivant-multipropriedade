import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AssembleiaForm } from "@/components/admin/assembleia-form";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditarAssembleiaPage(props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "vivantCare.assembleias.manage")) redirect("/403");
  const { id } = await props.params;
  const [a, properties] = await Promise.all([
    prisma.assembleia.findUnique({ where: { id } }),
    prisma.property.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!a) notFound();
  return (
    <div className="space-y-6">
      <nav className="flex items-center text-sm text-gray-600 mb-4">
        <Link href="/admin/vivant-care" className="hover:text-vivant-navy">Vivant Care</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/admin/vivant-care/assembleias" className="hover:text-vivant-navy">Assembleias</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href={"/admin/vivant-care/assembleias/" + id} className="hover:text-vivant-navy">{a.titulo}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-vivant-navy font-medium">Editar</span>
      </nav>
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Editar Assembleia</h1>
        <p className="text-gray-600">{a.titulo}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <AssembleiaForm
          assembleia={{
            id: a.id,
            propertyId: a.propertyId,
            titulo: a.titulo,
            descricao: a.descricao,
            tipo: a.tipo,
            dataRealizacao: a.dataRealizacao.toISOString(),
            dataInicio: a.dataInicio.toISOString(),
            dataFim: a.dataFim.toISOString(),
            status: a.status,
            quorumMinimo: Number(a.quorumMinimo),
            ataUrl: a.ataUrl,
          }}
          properties={properties}
          redirectPath="/admin/vivant-care/assembleias"
        />
      </div>
    </div>
  );
}
