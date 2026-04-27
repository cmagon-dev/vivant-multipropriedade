import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { Card, CardContent } from "@/components/ui/card";
import { VincularInvestidorButton } from "./vincular-investidor-button";
import { CapitalInvestidoresList } from "./capital-investidores-list";

export const dynamic = "force-dynamic";

export default async function CapitalInvestidoresPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");
  const companyId = await getCapitalCompanyId(session);

  const investidores = await prisma.capitalInvestorProfile.findMany({
    where: { companyId },
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { participations: true, liquidityRequests: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-vivant-navy">Investidores</h1>
          <p className="text-gray-500 mt-1">Perfis de investidores do Vivant Capital (vinculados para participar de ativos)</p>
        </div>
        {canManageCapital(session) && <VincularInvestidorButton />}
      </div>

      {investidores.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-gray-500 space-y-2">
            <p>Nenhum investidor com perfil cadastrado.</p>
            <p className="text-sm">
              Clique em <strong>Vincular usuário</strong> acima para criar o perfil de investidor de um usuário. Assim ele aparece aqui e pode ser vinculado a ativos nas participações.
            </p>
          </CardContent>
        </Card>
      ) : <CapitalInvestidoresList investidores={investidores as any} />}
    </div>
  );
}
