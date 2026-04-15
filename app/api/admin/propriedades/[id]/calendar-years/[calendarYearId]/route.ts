import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import type { CalendarYearStatus } from "@prisma/client";

function canManage(session: unknown) {
  const s = session as { user?: { userType?: string } } | null;
  return (
    s?.user?.userType === "admin" &&
    hasPermission(session as any, "vivantCare.propriedades.manage")
  );
}

/** Atualizar ano do calendário (ex.: publicar). */
export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string; calendarYearId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!canManage(session)) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }
    const { id: propertyId, calendarYearId } = await ctx.params;
    const row = await prisma.propertyCalendarYear.findFirst({
      where: { id: calendarYearId, propertyId },
    });
    if (!row) {
      return NextResponse.json({ error: "Calendário não encontrado" }, { status: 404 });
    }
    const body = await request.json();
    const { status, label } = body as {
      status?: CalendarYearStatus;
      label?: string | null;
    };
    const updated = await prisma.propertyCalendarYear.update({
      where: { id: calendarYearId },
      data: {
        ...(status !== undefined ? { status } : {}),
        ...(label !== undefined ? { label: label ?? null } : {}),
      },
    });
    return NextResponse.json({ calendarYear: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Erro ao atualizar calendário" },
      { status: 500 }
    );
  }
}
