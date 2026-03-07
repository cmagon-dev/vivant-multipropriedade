import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

function canAccess(session: any) {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return (
    hasPermission(session, "vivantCare.avisos.view") ||
    hasPermission(session, "vivantCare.avisos.manage")
  );
}

function canManage(session: any) {
  return canAccess(session) && hasPermission(session, "vivantCare.avisos.manage");
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!canAccess(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    const msg = await prisma.mensagem.findUnique({
      where: { id: params.id },
      include: { property: { select: { id: true, name: true } } },
    });
    if (!msg) return NextResponse.json({ error: "Aviso não encontrado" }, { status: 404 });
    return NextResponse.json(msg);
  } catch (e) {
    console.error("Erro ao buscar aviso:", e);
    return NextResponse.json({ error: "Erro ao buscar aviso" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!canManage(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
    const body = await request.json();
    const { propertyId, titulo, conteudo, tipo, prioridade, fixada, ativa } = body;
    const msg = await prisma.mensagem.update({
      where: { id: params.id },
      data: {
        ...(propertyId != null && { propertyId }),
        ...(titulo != null && { titulo }),
        ...(conteudo != null && { conteudo }),
        ...(tipo != null && { tipo }),
        ...(prioridade != null && { prioridade }),
        ...(typeof fixada === "boolean" && { fixada }),
        ...(typeof ativa === "boolean" && { ativa }),
      },
      include: { property: { select: { id: true, name: true } } },
    });
    return NextResponse.json(msg);
  } catch (e) {
    console.error("Erro ao atualizar aviso:", e);
    return NextResponse.json({ error: "Erro ao atualizar aviso" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!canManage(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
    await prisma.mensagem.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Erro ao excluir aviso:", e);
    return NextResponse.json({ error: "Erro ao excluir aviso" }, { status: 500 });
  }
}
