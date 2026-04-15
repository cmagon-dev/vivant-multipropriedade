import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import type { WeekExchangeRequestStatus } from "@prisma/client";

function canAccess(session: unknown) {
  if (!session || (session as { user?: { userType?: string } }).user?.userType !== "admin")
    return false;
  return (
    hasPermission(session as any, "vivantCare.trocas.view") ||
    hasPermission(session as any, "vivantCare.trocas.manage")
  );
}

function canManage(session: unknown) {
  return canAccess(session) && hasPermission(session as any, "vivantCare.trocas.manage");
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!canAccess(session)) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const { id } = await ctx.params;
    const t = await prisma.weekExchangeRequest.findUnique({
      where: { id },
      include: {
        cotista: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, name: true } },
        ownedWeek: true,
        desiredWeek: true,
        cota: { select: { id: true, numeroCota: true } },
        peerInterests: {
          include: {
            interestedCotista: { select: { id: true, name: true, email: true } },
            offeredWeek: true,
          },
        },
        eventLogs: { orderBy: { createdAt: "desc" }, take: 50 },
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
    const { status, adminNotes, publicToPeers } = body as {
      status?: WeekExchangeRequestStatus;
      adminNotes?: string | null;
      publicToPeers?: boolean;
    };
    const updateData: Record<string, unknown> = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (publicToPeers !== undefined) updateData.publicToPeers = publicToPeers;

    const t = await prisma.weekExchangeRequest.update({
      where: { id },
      data: updateData,
      include: {
        cotista: { select: { id: true, name: true, email: true } },
        ownedWeek: true,
        desiredWeek: true,
      },
    });

    await prisma.weekExchangeEventLog.create({
      data: {
        requestId: id,
        actorType: "ADMIN",
        actorId: (session!.user as { id?: string }).id ?? null,
        action: "ADMIN_UPDATE",
        payload: updateData as object,
      },
    });

    return NextResponse.json(t);
  } catch (e) {
    console.error("Erro ao atualizar troca:", e);
    return NextResponse.json({ error: "Erro ao atualizar troca" }, { status: 500 });
  }
}
