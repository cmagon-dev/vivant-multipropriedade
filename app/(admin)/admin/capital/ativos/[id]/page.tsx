import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin } from "@/lib/capital-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";
import Link from "next/link";
import { CapitalAtivoEditForm } from "./capital-ativo-edit-form";

export const dynamic = "force-dynamic";

export default async function EditarAtivoCapitalPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!canAccessCapitalAdmin(session)) redirect("/403");
  const companyId = await getCapitalCompanyId(session);

  const { id } = await params;
  const ativo = await prisma.capitalAssetConfig.findUnique({
    where: { id },
    select: {
      id: true,
      companyId: true,
      enabled: true,
      totalCotas: true,
      valorPorCota: true,
      taxaAdministracaoPercent: true,
      reservaPercent: true,
      ativoStatus: true,
      observacoes: true,
      property: { select: { id: true, name: true, location: true } },
    },
  });
  if (!ativo) redirect("/admin/capital/ativos");
  if (ativo.companyId !== companyId) redirect("/403");
  let meta: any = {};
  if (ativo.observacoes?.startsWith("__CAPITAL_META__:")) {
    try {
      meta = JSON.parse(ativo.observacoes.replace("__CAPITAL_META__:", ""));
    } catch {
      meta = {};
    }
  }

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
          nomeAtivo: meta.nomeAtivo ?? "",
          localizacao: meta.localizacao ?? "",
          descricao: meta.descricao ?? "",
          vgv: meta.vgv ?? "",
          valorAquisicao: meta.valorAquisicao ?? "",
          valorTotalEstruturado: meta.valorTotalEstruturado ?? "",
          capRateProjetado: meta.capRateProjetado ?? "",
          rentabilidadeProjetada: meta.rentabilidadeProjetada ?? "",
          margemOperacionalPrevista: meta.margemOperacionalPrevista ?? "",
          statusAtivo: meta.statusAtivo ?? "EM_ESTRUTURACAO",
          documentosRelacionados: Array.isArray(meta.documentosRelacionados)
            ? meta.documentosRelacionados.join(", ")
            : "",
          observacoesInternas: meta.observacoesInternas ?? "",
        }}
      />
    </div>
  );
}
