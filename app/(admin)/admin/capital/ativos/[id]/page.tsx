import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CapitalAtivoEditForm } from "./capital-ativo-edit-form";

export const dynamic = "force-dynamic";

export default async function EditarAtivoCapitalPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");

  const { id } = await params;
  const ativo = await prisma.capitalAssetConfig.findUnique({
    where: { id },
    include: { property: { select: { id: true, name: true, location: true } } },
  });
  if (!ativo) redirect("/admin/capital/ativos");

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/capital/ativos" className="text-sm text-gray-500 hover:underline">← Voltar aos ativos</Link>
        <h1 className="text-3xl font-bold text-vivant-navy mt-2">{ativo.property.name}</h1>
        <p className="text-gray-500 mt-1">Configuração do ativo no Vivant Capital</p>
      </div>
      <CapitalAtivoEditForm
        ativoId={ativo.id}
        initial={{
          enabled: ativo.enabled,
          totalCotas: ativo.totalCotas,
          valorPorCota: Number(ativo.valorPorCota),
          taxaAdministracaoPercent: Number(ativo.taxaAdministracaoPercent),
          reservaPercent: Number(ativo.reservaPercent),
          ativoStatus: ativo.ativoStatus,
          observacoes: ativo.observacoes ?? "",
        }}
      />
    </div>
  );
}
