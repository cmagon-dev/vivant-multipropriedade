import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { requirePortalCotista } from "@/lib/auth/cotistaPortalSession";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const rows = await prisma.weekExchangeRequest.findMany({
      where: { cotistaId: auth.cotistaId },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        property: { select: { id: true, name: true } },
        ownedWeek: true,
        desiredWeek: true,
      },
    });

    return NextResponse.json({ requests: rows });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao listar solicitações" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    const auth = await requirePortalCotista(session);
    if (!auth.ok) return auth.response;

    const body = await request.json();
    const {
      propertyId,
      cotaId,
      ownedCalendarWeekId,
      desiredCalendarWeekId,
      desiredPeriodStart,
      desiredPeriodEnd,
      acceptsAlternatives,
      publicToPeers,
      notes,
      expiresAt,
    } = body as Record<string, unknown>;

    const ownedId =
      (ownedCalendarWeekId as string) ||
      (body as { ownedPropertyWeekId?: string }).ownedPropertyWeekId;

    const desiredId =
      (desiredCalendarWeekId as string | undefined) ||
      (body as { desiredPropertyWeekId?: string }).desiredPropertyWeekId;

    if (
      !propertyId ||
      typeof propertyId !== "string" ||
      !cotaId ||
      typeof cotaId !== "string" ||
      !ownedId ||
      typeof ownedId !== "string"
    ) {
      return NextResponse.json(
        { error: "propertyId, cotaId e ownedCalendarWeekId são obrigatórios" },
        { status: 400 }
      );
    }

    const cota = await prisma.cotaPropriedade.findFirst({
      where: {
        id: cotaId,
        cotistaId: auth.cotistaId,
        propertyId,
        ativo: true,
      },
    });
    if (!cota) {
      return NextResponse.json(
        { error: "Cota inválida ou não pertence a você nesta propriedade" },
        { status: 400 }
      );
    }

    const owned = await prisma.propertyCalendarWeek.findFirst({
      where: {
        id: ownedId,
        calendarYear: { propertyId, status: "PUBLISHED" },
      },
    });
    if (!owned) {
      return NextResponse.json(
        { error: "Semana de origem não encontrada ou calendário não publicado" },
        { status: 400 }
      );
    }

    if (owned.isBlocked || !owned.exchangeAllowed) {
      return NextResponse.json(
        { error: "Esta semana não está disponível para troca" },
        { status: 400 }
      );
    }

    let desired: { id: string } | null = null;
    if (desiredId && typeof desiredId === "string") {
      desired = await prisma.propertyCalendarWeek.findFirst({
        where: {
          id: desiredId,
          calendarYear: { propertyId },
        },
        select: { id: true },
      });
      if (!desired) {
        return NextResponse.json(
          { error: "Semana desejada inválida para esta propriedade" },
          { status: 400 }
        );
      }
    }

    const slotsCount = await prisma.calendarDistributionSlot.count({
      where: { calendarYear: { propertyId } },
    });
    if (slotsCount > 0) {
      const hasAlloc = await prisma.propertyWeekAssignment.findFirst({
        where: { cotaId, propertyCalendarWeekId: ownedId },
      });
      if (!hasAlloc) {
        return NextResponse.json(
          {
            error:
              "Esta semana não está alocada à sua cota no planejamento vigente. Solicite apoio à administração.",
          },
          { status: 400 }
        );
      }
    }

    const exp =
      expiresAt && typeof expiresAt === "string"
        ? new Date(expiresAt)
        : null;

    const created = await prisma.weekExchangeRequest.create({
      data: {
        propertyId,
        cotistaId: auth.cotistaId,
        cotaId,
        ownedCalendarWeekId: ownedId,
        desiredCalendarWeekId: desired?.id ?? null,
        desiredPeriodStart:
          desiredPeriodStart && typeof desiredPeriodStart === "string"
            ? new Date(desiredPeriodStart)
            : null,
        desiredPeriodEnd:
          desiredPeriodEnd && typeof desiredPeriodEnd === "string"
            ? new Date(desiredPeriodEnd)
            : null,
        acceptsAlternatives: !!acceptsAlternatives,
        publicToPeers: !!publicToPeers,
        status: "REQUESTED",
        notes:
          typeof notes === "string" && notes.trim() ? notes.trim() : null,
        expiresAt: exp && !Number.isNaN(exp.getTime()) ? exp : null,
      },
      include: {
        property: { select: { name: true } },
        ownedWeek: true,
        desiredWeek: true,
      },
    });

    await prisma.weekExchangeEventLog.create({
      data: {
        requestId: created.id,
        actorType: "COTISTA",
        actorId: auth.cotistaId,
        action: "REQUEST_CREATED",
        payload: { status: created.status },
      },
    });

    await prisma.notificacao.create({
      data: {
        cotistaId: auth.cotistaId,
        propertyId,
        tipo: "TROCA_SOLICITACAO",
        titulo: "Solicitação de troca registrada",
        mensagem: `Sua solicitação para a semana ${owned.description ?? owned.weekIndex} foi recebida e será analisada pela administração. Nenhuma troca é automática.`,
        url: "/dashboard/solicitacoes-trocas",
      },
    });

    await prisma.systemEvent.create({
      data: {
        type: "vivant.week_exchange.requested",
        entityType: "WeekExchangeRequest",
        entityId: created.id,
        productKey: "vivant-care",
        severity: "INFO",
        status: "PENDING",
        message: `Nova solicitação de troca de semanas (propriedade ${propertyId})`,
        meta: { propertyId, requestId: created.id },
      },
    });

    return NextResponse.json(created);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao criar solicitação" },
      { status: 500 }
    );
  }
}
