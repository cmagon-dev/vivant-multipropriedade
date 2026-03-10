import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { canManageCapital } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CapitalAtivoForm } from "./capital-ativo-form";

export const dynamic = "force-dynamic";

export default async function NovoAtivoCapitalPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!canManageCapital(session)) redirect("/403");

  const properties = await prisma.property.findMany({
    where: { id: { notIn: (await prisma.capitalAssetConfig.findMany({ select: { propertyId: true } })).map((c) => c.propertyId) } },
    select: { id: true, name: true, location: true, priceValue: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/capital/ativos" className="text-sm text-gray-500 hover:underline">← Voltar aos ativos</Link>
        <h1 className="text-3xl font-bold text-vivant-navy mt-2">Vincular imóvel ao Capital</h1>
        <p className="text-gray-500 mt-1">Escolha um imóvel existente e defina a configuração de cotas.</p>
      </div>
      <CapitalAtivoForm properties={properties} />
    </div>
  );
}
