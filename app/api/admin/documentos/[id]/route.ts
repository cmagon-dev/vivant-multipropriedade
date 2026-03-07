import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

function canAccess(session: any) {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return hasPermission(session, "vivantCare.documentos.view") || hasPermission(session, "vivantCare.documentos.manage");
}

function canManage(session: any) {
  return canAccess(session) && hasPermission(session, "vivantCare.documentos.manage");
}

export async function GET(request: NextRequest, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!canAccess(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const doc = await prisma.documento.findUnique({
      where: { id: ctx.params.id },
      include: { property: { select: { id: true, name: true } } },
    });
    if (!doc) return NextResponse.json({ error: "Documento não encontrado" }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e) {
    console.error("Erro ao buscar documento:", e);
    return NextResponse.json({ error: "Erro ao buscar documento" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const body = await request.json();
    const { titulo, descricao, tipo, categoria, ativo } = body;
    const doc = await prisma.documento.update({
      where: { id: ctx.params.id },
      data: {
        ...(titulo != null && { titulo }),
        ...(descricao != null && { descricao }),
        ...(tipo != null && { tipo }),
        ...(categoria != null && { categoria }),
        ...(typeof ativo === "boolean" && { ativo }),
      },
      include: { property: { select: { id: true, name: true } } },
    });
    return NextResponse.json(doc);
  } catch (e) {
    console.error("Erro ao atualizar documento:", e);
    return NextResponse.json({ error: "Erro ao atualizar documento" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, ctx: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    await prisma.documento.delete({ where: { id: ctx.params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Erro ao excluir documento:", e);
    return NextResponse.json({ error: "Erro ao excluir documento" }, { status: 500 });
  }
}
