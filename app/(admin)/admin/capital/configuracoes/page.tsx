import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CapitalSettingsForm } from "./capital-settings-form";

export const dynamic = "force-dynamic";

export default async function CapitalConfiguracoesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");
  const companyId = await getCapitalCompanyId(session);
  const settings = await prisma.capitalSettings.upsert({
    where: { companyId },
    create: { companyId },
    update: {},
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-vivant-navy">Configurações</h1>
        <p className="text-gray-500 mt-1">Parâmetros operacionais do módulo Vivant Capital</p>
      </div>

      <CapitalSettingsForm
        initial={{
          guaranteePercentage: Number(settings.guaranteePercentage),
          operationPercentage: Number(settings.operationPercentage),
          defaultReturnRate: Number(settings.defaultReturnRate),
          marginMin: Number(settings.marginMin),
          marginMax: Number(settings.marginMax),
          disclaimer:
            settings.disclaimer ||
            "Investimentos estruturados sujeitos a risco de mercado, liquidez e performance operacional. Material para uso interno administrativo.",
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base text-vivant-navy">Parâmetros de status (Fase 1)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-1">
          <p>Ativos: EM_ESTRUTURACAO, EM_CAPTACAO, CAPTADO, EM_OPERACAO, ENCERRADO</p>
          <p>Captações: ABERTA, RESERVADA, CONCLUIDA, CANCELADA</p>
          <p>Investimentos: INTERESSE, RESERVADO, CONTRATO_ENVIADO, PAGO, CANCELADO</p>
          <p>Pagamentos: PENDENTE, PAGO, ATRASADO, CANCELADO</p>
          <p>Compliance: PENDENTE, EM_ANALISE, CONCLUIDO</p>
        </CardContent>
      </Card>
    </div>
  );
}
