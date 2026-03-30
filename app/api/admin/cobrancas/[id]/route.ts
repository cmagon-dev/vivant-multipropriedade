import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

function canManageFinanceiro(session: unknown) {
  const s = session as { user?: { userType?: string; role?: string } } | null;
  if (!s?.user || s.user.userType !== "admin") return false;
  return (
    hasPermission(session as any, "vivantCare.financeiro.manage") ||
    s.user.role === "ADMIN"
  );
}

/** Marca cobrança como paga após conferência (ex.: comprovante validado). */
export async function PATCH(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!canManageFinanceiro(session)) {
      return NextResponse.json(
        { error: "Sem permissão para alterar cobranças" },
        { status: 403 }
      );
    }

    const { id } = await ctx.params;

    const cobranca = await prisma.cobranca.findUnique({
      where: { id },
      include: {
        cota: { select: { cotistaId: true } },
      },
    });

    if (!cobranca) {
      return NextResponse.json({ error: "Cobrança não encontrada" }, { status: 404 });
    }

    if (cobranca.status === "PAGA") {
      return NextResponse.json(
        { error: "Esta cobrança já está paga" },
        { status: 400 }
      );
    }
    if (cobranca.status === "CANCELADA") {
      return NextResponse.json(
        { error: "Não é possível marcar como paga uma cobrança cancelada" },
        { status: 400 }
      );
    }

    const agora = new Date();
    const updated = await prisma.cobranca.update({
      where: { id },
      data: {
        status: "PAGA",
        dataPagamento: agora,
        valorPago: cobranca.valor,
      },
    });

    await prisma.notificacao.create({
      data: {
        cotistaId: cobranca.cota.cotistaId,
        tipo: "COBRANCA",
        titulo: "Pagamento confirmado",
        mensagem: `Sua cobrança foi marcada como paga: ${cobranca.descricao} — R$ ${Number(cobranca.valor).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}.`,
        url: `/dashboard/financeiro/${cobranca.id}`,
      },
    });

    return NextResponse.json({ cobranca: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao atualizar cobrança" },
      { status: 500 }
    );
  }
}
