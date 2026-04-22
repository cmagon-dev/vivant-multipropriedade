import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { toAdminWeekJson } from "@/lib/vivant/admin-week-visual";
import type { OfficialWeekType, WeekTier } from "@prisma/client";

function canManage(session: unknown) {
  const s = session as { user?: { userType?: string } } | null;
  return (
    s?.user?.userType === "admin" &&
    hasPermission(session as any, "vivantCare.propriedades.manage")
  );
}

export async function PUT(
  request: NextRequest,
  ctx: { params: Promise<{ id: string; weekId: string }> }
) {
  try {
    const session = await getSession();
    if (!canManage(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id: propertyId, weekId } = await ctx.params;
    const week = await prisma.propertyCalendarWeek.findFirst({
      where: {
        id: weekId,
        calendarYear: { propertyId },
      },
    });
    if (!week) {
      return NextResponse.json({ error: "Semana não encontrada" }, { status: 404 });
    }

    const body = await request.json();
    const {
      description,
      officialWeekType,
      tier,
      isExtra,
      weight,
      isBlocked,
      exchangeAllowed,
      notes,
      startDate,
      endDate,
      weekIndex,
    } = body as {
      description?: string | null;
      officialWeekType?: OfficialWeekType;
      tier?: WeekTier;
      isExtra?: boolean;
      weight?: number;
      isBlocked?: boolean;
      exchangeAllowed?: boolean;
      notes?: string | null;
      startDate?: string;
      endDate?: string;
      weekIndex?: number;
    };

    await prisma.propertyCalendarWeek.update({
      where: { id: weekId },
      data: {
        ...(description !== undefined ? { description: description ?? null } : {}),
        ...(officialWeekType !== undefined ? { officialWeekType } : {}),
        ...(tier !== undefined ? { tier } : {}),
        ...(isExtra !== undefined ? { isExtra } : {}),
        ...(weight !== undefined ? { weight } : {}),
        ...(isBlocked !== undefined ? { isBlocked } : {}),
        ...(exchangeAllowed !== undefined ? { exchangeAllowed } : {}),
        ...(notes !== undefined ? { notes: notes ?? null } : {}),
        ...(startDate !== undefined ? { startDate: new Date(startDate) } : {}),
        ...(endDate !== undefined ? { endDate: new Date(endDate) } : {}),
        ...(weekIndex !== undefined ? { weekIndex } : {}),
      },
    });

    const full = await prisma.propertyCalendarWeek.findFirst({
      where: { id: weekId },
      include: {
        assignments: { select: { id: true } },
        weekReservations: {
          select: { status: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ week: full ? toAdminWeekJson(full) : null });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao atualizar semana" },
      { status: 500 }
    );
  }
}
