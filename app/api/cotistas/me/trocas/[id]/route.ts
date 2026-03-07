import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { userType?: string }).userType !== "cotista") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const { id } = await ctx.params;
    const t = await prisma.trocaSemana.findFirst({
      where: { id, cotistaSolicitante: session.user.id },
      include: {
        reservas: {
          include: {
            cota: { include: { property: { select: { id: true, name: true } } } },
          },
        },
      },
    });
    if (!t) return NextResponse.json({ error: "Troca não encontrada" }, { status: 404 });
    return NextResponse.json(t);
  } catch (e) {
    console.error("Erro ao buscar troca:", e);
    return NextResponse.json({ error: "Erro ao buscar troca" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as { userType?: string }).userType !== "cotista") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const { id } = await ctx.params;
    const existente = await prisma.trocaSemana.findFirst({
      where: { id, cotistaSolicitante: session.user.id },
    });
    if (!existente) return NextResponse.json({ error: "Troca não encontrada" }, { status: 404 });
    const body = await req.json().catch(() => ({}));
    if (body.cancelar === true && existente.status === "ABERTA") {
      const t = await prisma.trocaSemana.update({
        where: { id },
        data: { status: "CANCELADA" },
        include: {
          reservas: {
            include: {
              cota: { include: { property: { select: { id: true, name: true } } } },
            },
          },
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
