import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { canAccessCapitalAdmin, canManageCapital } from "@/lib/capital-auth";
import { prisma } from "@/lib/prisma";
import { getCapitalCompanyId } from "@/lib/capital/company-context";

type InvestorMeta = {
  tipo?: "PESSOA_FISICA" | "PESSOA_JURIDICA" | "INSTITUCIONAL";
  perfil?: "QUALIFICADO" | "PROFISSIONAL" | "INSTITUCIONAL";
  kycStatus?: "PENDENTE" | "APROVADO" | "REPROVADO";
  telefone?: string;
  observacoes?: string;
};

function parseInvestorMeta(documento?: string | null): InvestorMeta {
  if (!documento) return {};
  try {
    if (!documento.startsWith("__CAPITAL_INVESTOR_META__:")) return {};
    return JSON.parse(documento.replace("__CAPITAL_INVESTOR_META__:", "")) as InvestorMeta;
  } catch {
    return {};
  }
}

function buildInvestorMeta(meta: InvestorMeta): string {
  return `__CAPITAL_INVESTOR_META__:${JSON.stringify(meta)}`;
}

export async function GET() {
  try {
    const session = await getSession();
    if (!canAccessCapitalAdmin(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const companyId = await getCapitalCompanyId(session);

    const investidores = await prisma.capitalInvestorProfile.findMany({
      where: { companyId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { participations: true, liquidityRequests: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      investidores: investidores.map((i) => ({
        ...i,
        meta: parseInvestorMeta(i.documento),
      })),
    });
  } catch (e) {
    console.error("Erro ao listar investidores Capital:", e);
    return NextResponse.json({ error: "Erro ao listar investidores" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canManageCapital(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const companyId = await getCapitalCompanyId(session);

    const body = await request.json();
    const {
      userId,
      tipo = "PESSOA_FISICA",
      documento,
      telefone,
      perfil = "QUALIFICADO",
      kycStatus = "PENDENTE",
      observacoes,
      tipoPessoa = "PF",
      status = "ATIVO",
    } = body;

    if (!userId) return NextResponse.json({ error: "userId é obrigatório" }, { status: 400 });

    const existing = await prisma.capitalInvestorProfile.findFirst({ where: { companyId, userId } });
    if (existing) return NextResponse.json({ error: "Este usuário já possui perfil de investidor" }, { status: 400 });

    const investidor = await prisma.capitalInvestorProfile.create({
      data: {
        userId,
        companyId,
        tipoPessoa:
          tipo === "PESSOA_JURIDICA" || tipoPessoa === "PJ"
            ? "PJ"
            : tipo === "INSTITUCIONAL"
              ? "INSTITUCIONAL"
              : "PF",
        documento: buildInvestorMeta({
          tipo,
          perfil,
          kycStatus,
          telefone,
          observacoes: observacoes ?? documento ?? "",
        }),
        status: status === "INATIVO" || status === "PENDENTE" ? status : "ATIVO",
      },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json({
      ...investidor,
      meta: parseInvestorMeta(investidor.documento),
    });
  } catch (e) {
    console.error("Erro ao criar perfil investidor:", e);
    return NextResponse.json({ error: "Erro ao criar investidor" }, { status: 500 });
  }
}
