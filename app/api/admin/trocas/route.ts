import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
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

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!canAccess(session))
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    const sp = request.nextUrl.searchParams;
    const status = sp.get("status") as WeekExchangeRequestStatus | null;
    const where = status ? { status } : {};
    const trocas = await prisma.weekExchangeRequest.findMany({
      where,
      include: {
        cotista: { select: { id: true, name: true, email: true } },
        property: { select: { id: true, name: true } },
        ownedWeek: true,
        desiredWeek: true,
        cota: { select: { id: true, numeroCota: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json({ trocas });
  } catch (e) {
    console.error("Erro ao listar trocas:", e);
    return NextResponse.json({ error: "Erro ao listar trocas" }, { status: 500 });
  }
}
