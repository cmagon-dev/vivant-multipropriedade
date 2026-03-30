import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { redirect } from "next/navigation";
import { GerarCobrancasCard } from "@/components/admin/gerar-cobrancas-card";

export const dynamic = "force-dynamic";

export default async function LancarCobrancasPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  if (!hasPermission(session as any, "vivantCare.financeiro.manage")) {
    redirect("/403");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Lançar cobranças</h1>
        <p className="text-gray-500 mt-1">
          Gere cobranças em lote ou para um imóvel ou cota específica
        </p>
      </div>
      <GerarCobrancasCard />
    </div>
  );
}
