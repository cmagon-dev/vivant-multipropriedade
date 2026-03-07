import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

function canAccess(session: any) {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return hasPermission(session, "vivantCare.trocas.view") || hasPermission(session, "vivantCare.trocas.manage");
}

function canManage(session: any) {
  return canAccess(session) && hasPermission(session, "vivantCare.trocas.manage");
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!canAccess(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const { id } = await ctx.params;
    const t = await prisma.trocaSemana.findUnique({
      where: { id },
      include: {
        solicitante: { select: { id: true, name: true, email: true } },
        reservas: {
          include: {
            cota: { include: { property: { select: { id: true, name: true } }, cotista: { select: { name: true } } } },
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
    if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const { id } = await ctx.params;
    const body = await req.json();
    const { status, observacoes } = body;
    const updateData: any = {};
    if (status) updateData.status = status;
    if (observacoes !== undefined) updateData.observacoes = observacoes;
    if (status === "CONCLUIDA" || status === "ACEITA") updateData.concluidaEm = new Date();
    const t = await prisma.trocaSemana.update({
      where: { id },
      data: updateData,
      include: {
        solicitante: { select: { id: true, name: true, email: true } },
        reservas: { include: { cota: { include: { property: { select: { name: true } } } } } },
      },
    });
    return NextResponse.json(t);
  } catch (e) {
    console.error("Erro ao atualizar troca:", e);
    return NextResponse.json({ error: "Erro ao atualizar troca" }, { status: 500 });
  }
}
