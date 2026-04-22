import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function canAccess(session: any) {
  if (!session || (session.user as { userType?: string }).userType !== "admin") return false;
  return hasPermission(session, "vivantCare.assembleias.view") || hasPermission(session, "vivantCare.assembleias.manage");
}

function canManage(session: any) {
  return canAccess(session) && hasPermission(session, "vivantCare.assembleias.manage");
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canAccess(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const sp = request.nextUrl.searchParams;
    const propertyId = sp.get("propertyId") || undefined;
    const status = sp.get("status") || undefined;
    const where: Prisma.AssembleiaWhereInput = {};
    if (propertyId) where.propertyId = propertyId;
    if (status && ["AGENDADA", "EM_ANDAMENTO", "FINALIZADA", "CANCELADA"].includes(status)) {
      where.status = status as "AGENDADA" | "EM_ANDAMENTO" | "FINALIZADA" | "CANCELADA";
    }
    const assembleias = await prisma.assembleia.findMany({
      where,
      include: {
        property: { select: { id: true, name: true } },
        _count: { select: { pautas: true } },
      },
      orderBy: { dataRealizacao: "desc" },
      take: 200,
    });
    return NextResponse.json({ assembleias });
  } catch (e) {
    console.error("Erro ao listar assembleias:", e);
    return NextResponse.json({ error: "Erro ao listar assembleias" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canManage(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    const body = await request.json();
    const { propertyId, titulo, descricao, tipo, dataRealizacao, dataInicio, dataFim, status, quorumMinimo } = body;
    if (!propertyId || !titulo || !descricao || !dataRealizacao) {
      return NextResponse.json({ error: "Propriedade, título, descrição e data são obrigatórios" }, { status: 400 });
    }
    const dataReal = new Date(dataRealizacao);
    const dataIni = dataInicio ? new Date(dataInicio) : dataReal;
    const dataF = dataFim ? new Date(dataFim) : dataReal;
    const a = await prisma.assembleia.create({
      data: {
        propertyId,
        titulo,
        descricao,
        tipo: tipo || "ORDINARIA",
        dataRealizacao: dataReal,
        dataInicio: dataIni,
        dataFim: dataF,
        status: status || "AGENDADA",
        quorumMinimo: quorumMinimo != null ? Number(quorumMinimo) : 50,
      },
      include: { property: { select: { id: true, name: true } }, _count: { select: { pautas: true } } },
    });

    const statusFinal = a.status;
    if (statusFinal === "AGENDADA" || statusFinal === "EM_ANDAMENTO") {
      const cotasAtivas = await prisma.cotaPropriedade.findMany({
        where: { propertyId: a.propertyId, ativo: true },
        select: { cotistaId: true },
      });
      const cotistaIds = Array.from(new Set(cotasAtivas.map((c) => c.cotistaId)));
      if (cotistaIds.length > 0) {
        const dataFmt = format(new Date(a.dataRealizacao), "dd/MM/yyyy 'às' HH:mm", {
          locale: ptBR,
        });
        const propNome = a.property?.name ?? "Imóvel";
        const desc = String(descricao).trim();
        const msgBody =
          desc.length > 220 ? `${desc.slice(0, 220)}…` : desc;

        await prisma.notificacao.createMany({
          data: cotistaIds.map((cotistaId) => ({
            cotistaId,
            tipo: "ASSEMBLEIA",
            titulo: `Nova assembleia: ${titulo}`,
            mensagem: `${propNome} — ${dataFmt}. ${msgBody}`,
            url: `/dashboard/assembleias/${a.id}`,
          })),
        });
      }
    }

    return NextResponse.json(a);
  } catch (e) {
    console.error("Erro ao criar assembleia:", e);
    return NextResponse.json({ error: "Erro ao criar assembleia" }, { status: 500 });
  }
}
