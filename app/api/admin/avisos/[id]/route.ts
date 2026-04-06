import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { MensagemTargetType } from "@prisma/client";

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
      include: {
        property: { select: { id: true, name: true } },
        targetCotista: { select: { id: true, name: true } },
        targetDestino: { select: { id: true, name: true } },
      },
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
    const {
      targetType,
      propertyId,
      targetCotistaId,
      targetCondominio,
      targetDestinoId,
      titulo,
      conteudo,
      tipo,
      prioridade,
      fixada,
      ativa,
    } = body as {
      targetType?: MensagemTargetType;
      propertyId?: string | null;
      targetCotistaId?: string | null;
      targetCondominio?: string | null;
      targetDestinoId?: string | null;
      titulo?: string;
      conteudo?: string;
      tipo?: string;
      prioridade?: string;
      fixada?: boolean;
      ativa?: boolean;
    };
    const safeTargetType = targetType ?? undefined;

    if (safeTargetType === "CASA" && !propertyId) {
      return NextResponse.json({ error: "Selecione a casa para segmentação CASA." }, { status: 400 });
    }
    if (safeTargetType === "COTISTA" && !targetCotistaId) {
      return NextResponse.json({ error: "Selecione o cotista para segmentação COTISTA." }, { status: 400 });
    }
    if (safeTargetType === "CONDOMINIO" && !targetCondominio) {
      return NextResponse.json({ error: "Selecione o condomínio para segmentação CONDOMÍNIO." }, { status: 400 });
    }
    if (safeTargetType === "DESTINO" && !targetDestinoId) {
      return NextResponse.json({ error: "Selecione o destino para segmentação DESTINO." }, { status: 400 });
    }

    const data: Record<string, unknown> = {};
    if (safeTargetType !== undefined) {
      data.targetType = safeTargetType;
      data.propertyId = safeTargetType === "CASA" ? propertyId ?? null : null;
      data.targetCotistaId = safeTargetType === "COTISTA" ? targetCotistaId ?? null : null;
      data.targetCondominio = safeTargetType === "CONDOMINIO" ? targetCondominio ?? null : null;
      data.targetDestinoId = safeTargetType === "DESTINO" ? targetDestinoId ?? null : null;
    } else if (propertyId != null) {
      data.propertyId = propertyId;
    }
    if (titulo != null) data.titulo = titulo;
    if (conteudo != null) data.conteudo = conteudo;
    if (tipo != null) data.tipo = tipo;
    if (prioridade != null) data.prioridade = prioridade;
    if (typeof fixada === "boolean") data.fixada = fixada;
    if (typeof ativa === "boolean") data.ativa = ativa;

    const msg = await prisma.mensagem.update({
      where: { id: params.id },
      data: data as any,
      include: {
        property: { select: { id: true, name: true } },
        targetCotista: { select: { id: true, name: true } },
        targetDestino: { select: { id: true, name: true } },
      },
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
