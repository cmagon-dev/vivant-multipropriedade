import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentoForm } from "@/components/admin/documento-form";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditarDocumentoVivantCarePage(props: { params: { id: string } }) {
  const { params } = props;
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "vivantCare.documentos.manage")) redirect("/403");

  const [doc, properties] = await Promise.all([
    prisma.documento.findUnique({ where: { id: params.id } }),
    prisma.property.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  if (!doc) notFound();

  return (
    <div className="space-y-6">
      <nav className="flex items-center text-sm text-gray-600 mb-4">
        <Link href="/admin/vivant-care" className="hover:text-vivant-navy">Vivant Care</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href="/admin/vivant-care/documentos" className="hover:text-vivant-navy">Documentos</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link href={"/admin/vivant-care/documentos/" + params.id} className="hover:text-vivant-navy">{doc.titulo}</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-vivant-navy font-medium">Editar</span>
      </nav>
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Editar Documento</h1>
        <p className="text-gray-600">{doc.titulo}</p>
      </div>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <DocumentoForm
          documento={{
            id: doc.id,
            propertyId: doc.propertyId,
            titulo: doc.titulo,
            descricao: doc.descricao,
            tipo: doc.tipo,
            categoria: doc.categoria,
            ativo: doc.ativo,
          }}
          properties={properties}
          redirectPath="/admin/vivant-care/documentos"
        />
      </div>
    </div>
  );
}
