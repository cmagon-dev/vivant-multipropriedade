import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import type { WeekSeasonType } from "@prisma/client";

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
    const session = await getServerSession(authOptions);
    if (!canManage(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    const { id: propertyId, weekId } = await ctx.params;
    const week = await prisma.propertyWeek.findFirst({
      where: { id: weekId, propertyId },
    });
    if (!week) {
      return NextResponse.json({ error: "Semana não encontrada" }, { status: 404 });
    }

    const body = await request.json();
    const {
      label,
      seasonType,
      weight,
      isHoliday,
      isSchoolVacation,
      isBlocked,
      isExchangeAllowed,
      color,
      notes,
      startDate,
      endDate,
      weekIndex,
    } = body as {
      label?: string | null;
      seasonType?: WeekSeasonType;
      weight?: number;
      isHoliday?: boolean;
      isSchoolVacation?: boolean;
      isBlocked?: boolean;
      isExchangeAllowed?: boolean;
      color?: string | null;
      notes?: string | null;
      startDate?: string;
      endDate?: string;
      weekIndex?: number;
    };

    const updated = await prisma.propertyWeek.update({
      where: { id: weekId },
      data: {
        ...(label !== undefined ? { label: label ?? null } : {}),
        ...(seasonType !== undefined ? { seasonType } : {}),
        ...(weight !== undefined ? { weight } : {}),
        ...(isHoliday !== undefined ? { isHoliday } : {}),
        ...(isSchoolVacation !== undefined ? { isSchoolVacation } : {}),
        ...(isBlocked !== undefined ? { isBlocked } : {}),
        ...(isExchangeAllowed !== undefined ? { isExchangeAllowed } : {}),
        ...(color !== undefined ? { color: color ?? null } : {}),
        ...(notes !== undefined ? { notes: notes ?? null } : {}),
        ...(startDate !== undefined ? { startDate: new Date(startDate) } : {}),
        ...(endDate !== undefined ? { endDate: new Date(endDate) } : {}),
        ...(weekIndex !== undefined ? { weekIndex } : {}),
      },
    });

    return NextResponse.json({ week: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao atualizar semana" },
      { status: 500 }
    );
  }
}
