import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

function canAccess(session: any) {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return hasPermission(session, "vivantCare.avisos.view") || hasPermission(session, "vivantCare.avisos.manage");
}

function canManage(session: any) {
  return canAccess(session) && hasPermission(session, "vivantCare.avisos.manage");
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!canAccess(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const where: { propertyId?: string; ativa?: boolean } = {};
    const sp = request.nextUrl.searchParams;
    if (sp.get("propertyId")) where.propertyId = sp.get("propertyId")!;
    if (sp.get("ativa") === "true") where.ativa = true;
    if (sp.get("ativa") === "false") where.ativa = false;
    const avisos = await prisma.mensagem.findMany({
      where,
      include: { property: { select: { id: true, name: true } } },
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
    const session = await getServerSession(authOptions);
    if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const body = await request.json();
    const { propertyId, titulo, conteudo, tipo, prioridade, fixada, ativa } = body;
    if (!propertyId || !titulo || !conteudo) {
      return NextResponse.json({ error: "Propriedade, título e conteúdo são obrigatórios" }, { status: 400 });
    }
    const autorNome = (session?.user?.name as string) || "Administração";
    const msg = await prisma.mensagem.create({
      data: {
        propertyId,
        autorId: null,
        autorNome,
        autorTipo: "ADMINISTRACAO",
        titulo,
        conteudo,
        tipo: tipo || "AVISO",
        prioridade: prioridade || "NORMAL",
        fixada: !!fixada,
        ativa: ativa !== false,
      },
      include: { property: { select: { id: true, name: true } } },
    });
    return NextResponse.json(msg);
  } catch (e) {
    console.error("Erro ao criar aviso:", e);
    return NextResponse.json({ error: "Erro ao criar aviso" }, { status: 500 });
  }
}
