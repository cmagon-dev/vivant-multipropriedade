import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "events.view")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const severity = searchParams.get("severity");
  const status = searchParams.get("status");
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const offset = Number(searchParams.get("offset")) || 0;

  const where: Record<string, unknown> = {};
  if (type) where.type = type;
  if (severity) where.severity = severity;
  if (status) where.status = status;

  const [events, total] = await Promise.all([
    prisma.systemEvent.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        actorUser: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.systemEvent.count({ where }),
  ]);
  return NextResponse.json({ events, total });
}
