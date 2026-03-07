import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Prisma } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "tasks.view")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const mine = searchParams.get("mine") === "true";
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
  const offset = Number(searchParams.get("offset")) || 0;

  const where: Prisma.SystemTaskWhereInput = {};
  if (status && ["OPEN", "DONE", "CANCELED"].includes(status)) where.status = status as "OPEN" | "DONE" | "CANCELED";
  if (mine && session.user?.id) where.assignedToUserId = session.user.id;

  try {
    const [tasks, total] = await Promise.all([
      prisma.systemTask.findMany({
        where,
        orderBy: [{ status: "asc" }, { dueAt: "asc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
        include: {
          assignedTo: { select: { id: true, name: true, email: true } },
        },
      }),
      prisma.systemTask.count({ where }),
    ]);
    return NextResponse.json({ tasks, total });
  } catch (err) {
    console.error("[GET /api/admin/tasks]", err);
    const [tasks, total] = await Promise.all([
      prisma.systemTask.findMany({
        where,
        orderBy: [{ status: "asc" }, { dueAt: "asc" }, { createdAt: "desc" }],
        take: limit,
        skip: offset,
      }),
      prisma.systemTask.count({ where }),
    ]);
    return NextResponse.json({ tasks, total });
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "tasks.view")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  const body = await request.json();
  const { id, status } = body as { id: string; status: string };
  if (!id || !["OPEN", "DONE", "CANCELED"].includes(status)) {
    return NextResponse.json({ error: "id e status inválidos" }, { status: 400 });
  }
  const task = await prisma.systemTask.update({
    where: { id },
    data: { status: status as "OPEN" | "DONE" | "CANCELED" },
  });
  return NextResponse.json(task);
}
