import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import type { Prisma, TipoCobranca } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const TIPOS_COBRANCA = [
  "CONDOMINIO",
  "LIMPEZA",
  "MANUTENCAO",
  "SEGURO",
  "IPTU",
  "TAXA_GESTAO",
  "OUTROS",
] as const;

const TIPO_LABEL: Record<string, string> = {
  CONDOMINIO: "Condomínio",
  LIMPEZA: "Limpeza",
  MANUTENCAO: "Manutenção",
  SEGURO: "Seguro",
  IPTU: "IPTU",
  TAXA_GESTAO: "Taxa de Gestão",
  OUTROS: "Outros",
};

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session || (session.user as { userType?: string }).userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }
    const canManage =
      hasPermission(session as any, "vivantCare.financeiro.manage") ||
      (session.user as { role?: string }).role === "ADMIN";
    if (!canManage) {
      return NextResponse.json(
        { error: "Sem permissão para gerar cobranças" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { mes, ano, tipo, valor, descricao, modo, propertyId, cotaId } = body as {
      mes?: number;
      ano?: number;
      tipo?: string;
      valor?: number;
      descricao?: string;
      modo?: "todas" | "propriedade" | "cota";
      propertyId?: string;
      cotaId?: string;
    };

    if (
      mes == null ||
      ano == null ||
      !tipo ||
      valor == null ||
      !String(descricao ?? "").trim()
    ) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const mesNum = Number(mes);
    const anoNum = Number(ano);
    const valorNum = Number(valor);
    if (mesNum < 1 || mesNum > 12 || !Number.isFinite(anoNum)) {
      return NextResponse.json(
        { error: "Mês ou ano inválido" },
        { status: 400 }
      );
    }
    if (!Number.isFinite(valorNum) || valorNum <= 0) {
      return NextResponse.json(
        { error: "Valor deve ser maior que zero" },
        { status: 400 }
      );
    }
    if (!TIPOS_COBRANCA.includes(tipo as (typeof TIPOS_COBRANCA)[number])) {
      return NextResponse.json({ error: "Tipo de cobrança inválido" }, { status: 400 });
    }

    const escopo = modo ?? "todas";
    if (escopo !== "todas" && escopo !== "propriedade" && escopo !== "cota") {
      return NextResponse.json({ error: "Escopo inválido" }, { status: 400 });
    }
    if (escopo === "propriedade") {
      if (!propertyId || typeof propertyId !== "string") {
        return NextResponse.json(
          { error: "Selecione uma propriedade" },
          { status: 400 }
        );
      }
      const exists = await prisma.property.findUnique({
        where: { id: propertyId },
        select: { id: true },
      });
      if (!exists) {
        return NextResponse.json({ error: "Propriedade não encontrada" }, { status: 404 });
      }
    }
    if (escopo === "cota") {
      if (!cotaId || typeof cotaId !== "string") {
        return NextResponse.json(
          { error: "Selecione uma cota" },
          { status: 400 }
        );
      }
    }

    const where: Prisma.CotaPropriedadeWhereInput = { ativo: true };
    if (escopo === "propriedade") {
      where.propertyId = propertyId!;
    } else if (escopo === "cota") {
      where.id = cotaId!;
    }

    const cotas = await prisma.cotaPropriedade.findMany({ where });

    if (cotas.length === 0) {
      return NextResponse.json(
        {
          error:
            escopo === "cota"
              ? "Cota não encontrada ou inativa"
              : escopo === "propriedade"
                ? "Nenhuma cota ativa nesta propriedade"
                : "Nenhuma cota ativa no sistema",
        },
        { status: 400 }
      );
    }

    /** Mês no formulário: 1–12; `Date` usa mês 0–11. */
    const dataVencimento = new Date(anoNum, mesNum - 1, 5);

    const cobrancasData = cotas.map((cota) => ({
      cotaId: cota.id,
      tipo: tipo as TipoCobranca,
      descricao: String(descricao).trim(),
      valor: valorNum,
      mesReferencia: mesNum,
      anoReferencia: anoNum,
      dataVencimento,
      status: "PENDENTE" as const,
    }));

    const result = await prisma.cobranca.createMany({
      data: cobrancasData,
      skipDuplicates: true,
    });

    if (result.count > 0) {
      const descTrim = String(descricao).trim();
      const valorStr = valorNum.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      });
      const vencStr = format(dataVencimento, "dd/MM/yyyy", { locale: ptBR });
      const nomeTipo = TIPO_LABEL[tipo] ?? tipo;

      const countPorCotista = new Map<string, number>();
      for (const c of cotas) {
        countPorCotista.set(
          c.cotistaId,
          (countPorCotista.get(c.cotistaId) ?? 0) + 1
        );
      }

      await prisma.notificacao.createMany({
        data: Array.from(countPorCotista.entries()).map(([cotistaId, n]) => ({
          cotistaId,
          tipo: "COBRANCA",
          titulo:
            n === 1
              ? "Nova cobrança no portal"
              : `${n} novas cobranças no portal`,
          mensagem:
            `${nomeTipo}: ${descTrim} — R$ ${valorStr} · Venc. ${vencStr}` +
            (n > 1 ? ` (${n} cotas)` : ""),
          url: "/dashboard/financeiro",
        })),
      });
    }

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${result.count} cobranças geradas com sucesso`,
    });
  } catch (error) {
    console.error("Erro ao gerar cobranças:", error);
    return NextResponse.json(
      { error: "Erro ao gerar cobranças" },
      { status: 500 }
    );
  }
}
