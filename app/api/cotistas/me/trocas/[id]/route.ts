import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const { id } = await ctx.params;
    const t = await prisma.weekExchangeRequest.findFirst({
      where: { id, cotistaId },
      include: {
        property: { select: { id: true, name: true } },
        ownedWeek: true,
        desiredWeek: true,
        cota: { select: { id: true, numeroCota: true } },
      },
    });
    if (!t) return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
    return NextResponse.json(t);
  } catch (e) {
    console.error("Erro ao buscar troca:", e);
    return NextResponse.json({ error: "Erro ao buscar troca" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;
    const cotistaId = auth.cotistaId;

    const { id } = await ctx.params;
    const existente = await prisma.weekExchangeRequest.findFirst({
      where: { id, cotistaId },
    });
    if (!existente)
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
    const body = await req.json().catch(() => ({}));
    if (body.cancelar === true && existente.status === "REQUESTED") {
      const t = await prisma.weekExchangeRequest.update({
        where: { id },
        data: { status: "CANCELLED" },
        include: {
          property: { select: { id: true, name: true } },
          ownedWeek: true,
          desiredWeek: true,
        },
      });
      return NextResponse.json(t);
    }
    return NextResponse.json(existente);
  } catch (e) {
    console.error("Erro ao atualizar troca:", e);
    return NextResponse.json({ error: "Erro ao atualizar troca" }, { status: 500 });
  }
}
