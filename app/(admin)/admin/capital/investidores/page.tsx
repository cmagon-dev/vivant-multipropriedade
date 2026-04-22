import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";
import { VincularInvestidorButton } from "./vincular-investidor-button";

export const dynamic = "force-dynamic";

export default async function CapitalInvestidoresPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");

  const investidores = await prisma.capitalInvestorProfile.findMany({
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
      ) : (
        <div className="space-y-4">
          {investidores.map((inv) => (
            <Card key={inv.id} className="border border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-vivant-navy/10 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-vivant-navy" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-vivant-navy">{inv.user.name}</h3>
                    <p className="text-sm text-gray-600">{inv.user.email}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                      <span>{inv._count.participations} participação(ões)</span>
                      <span>{inv._count.liquidityRequests} solicitação(ões)</span>
                      <span className={`px-2 py-0.5 rounded ${inv.status === "ATIVO" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {inv.status}
                      </span>
                      <span>{inv.tipoPessoa}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
