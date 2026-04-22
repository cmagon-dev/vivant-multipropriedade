import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { MensagemTargetType, PrioridadeMensagem, TipoMensagem } from "@prisma/client";

function canAccess(session: any) {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return hasPermission(session, "vivantCare.avisos.view") || hasPermission(session, "vivantCare.avisos.manage");
}

function canManage(session: any) {
  return canAccess(session) && hasPermission(session, "vivantCare.avisos.manage");
}

async function resolveCotistaIdsForTarget(payload: {
  targetType: MensagemTargetType;
  propertyId?: string | null;
  targetCotistaId?: string | null;
  targetCondominio?: string | null;
  targetDestinoId?: string | null;
}) {
  if (payload.targetType === "COTISTA") {
    return payload.targetCotistaId ? [payload.targetCotistaId] : [];
  }

  let propertyIds: string[] = [];
  if (payload.targetType === "CASA") {
    if (payload.propertyId) propertyIds = [payload.propertyId];
  } else if (payload.targetType === "CONDOMINIO") {
    const props = await prisma.property.findMany({
      where: { condominio: payload.targetCondominio || undefined },
      select: { id: true },
    });
    propertyIds = props.map((p) => p.id);
  } else if (payload.targetType === "DESTINO") {
    const props = await prisma.property.findMany({
      where: { destinoId: payload.targetDestinoId || undefined },
      select: { id: true },
    });
    propertyIds = props.map((p) => p.id);
  }

  if (!propertyIds.length) return [];

  const cotasAtivas = await prisma.cotaPropriedade.findMany({
    where: { propertyId: { in: propertyIds }, ativo: true },
    select: { cotistaId: true },
  });
  return Array.from(new Set(cotasAtivas.map((c) => c.cotistaId)));
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canAccess(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const where: { propertyId?: string; ativa?: boolean; targetType?: MensagemTargetType } = {};
    const sp = request.nextUrl.searchParams;
    if (sp.get("propertyId")) where.propertyId = sp.get("propertyId")!;
    if (sp.get("targetType")) where.targetType = sp.get("targetType") as MensagemTargetType;
    if (sp.get("ativa") === "true") where.ativa = true;
    if (sp.get("ativa") === "false") where.ativa = false;
    const avisos = await prisma.mensagem.findMany({
      where,
      include: {
        property: { select: { id: true, name: true } },
        targetCotista: { select: { id: true, name: true } },
        targetDestino: { select: { id: true, name: true } },
      },
      orderBy: [{ fixada: "desc" }, { createdAt: "desc" }],
      take: 200,
    });
    return NextResponse.json({ avisos });
  } catch (e) {
    console.error("Erro ao listar avisos:", e);
    return NextResponse.json({ error: "Erro ao listar avisos" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
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
      propertyId?: string;
      targetCotistaId?: string;
      targetCondominio?: string;
      targetDestinoId?: string;
      titulo?: string;
      conteudo?: string;
      tipo?: string;
      prioridade?: string;
      fixada?: boolean;
      ativa?: boolean;
    };
    const safeTargetType = targetType ?? "CASA";
    if (!titulo || !conteudo) {
      return NextResponse.json({ error: "Título e conteúdo são obrigatórios" }, { status: 400 });
    }
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
    const autorNome = (session?.user?.name as string) || "Administração";
    const msg = await prisma.mensagem.create({
      data: {
        propertyId: safeTargetType === "CASA" ? propertyId : null,
        targetType: safeTargetType,
        targetCotistaId: safeTargetType === "COTISTA" ? targetCotistaId : null,
        targetCondominio: safeTargetType === "CONDOMINIO" ? targetCondominio : null,
        targetDestinoId: safeTargetType === "DESTINO" ? targetDestinoId : null,
        autorId: null,
        autorNome,
        autorTipo: "ADMINISTRACAO",
        titulo,
        conteudo,
        tipo: (tipo || "AVISO") as TipoMensagem,
        prioridade: (prioridade || "NORMAL") as PrioridadeMensagem,
        fixada: !!fixada,
        ativa: ativa !== false,
      },
      include: {
        property: { select: { id: true, name: true } },
        targetCotista: { select: { id: true, name: true } },
        targetDestino: { select: { id: true, name: true } },
      },
    });

    if (msg.ativa) {
      const cotistaIds = await resolveCotistaIdsForTarget({
        targetType: msg.targetType,
        propertyId: msg.propertyId,
        targetCotistaId: msg.targetCotistaId,
        targetCondominio: msg.targetCondominio,
        targetDestinoId: msg.targetDestinoId,
      });

      if (cotistaIds.length > 0) {
        await prisma.notificacao.createMany({
          data: cotistaIds.map((cotistaId) => ({
            cotistaId,
            propertyId: msg.propertyId ?? null,
            tipo: "AVISO",
            titulo: msg.titulo,
            mensagem: msg.conteudo,
            url: "/dashboard/avisos",
          })),
        });
      }
    }

    return NextResponse.json(msg);
  } catch (e) {
    console.error("Erro ao criar aviso:", e);
    return NextResponse.json({ error: "Erro ao criar aviso" }, { status: 500 });
  }
}
