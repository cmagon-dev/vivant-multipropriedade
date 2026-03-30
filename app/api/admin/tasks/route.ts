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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  if (!hasPermission(session as any, "tasks.manage")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { title, description, assignedToUserId, priority, dueAt } = body as {
      title?: string;
      description?: string;
      assignedToUserId?: string;
      priority?: string;
      dueAt?: string | null;
    };

    if (!title?.trim() || !description?.trim() || !assignedToUserId || !priority) {
      return NextResponse.json(
        { error: "title, description, assignedToUserId e priority são obrigatórios" },
        { status: 400 }
      );
    }

    const normalizedPriority = priority.toUpperCase();
    if (!["LOW", "MED", "HIGH"].includes(normalizedPriority)) {
      return NextResponse.json(
        { error: "priority inválida. Use LOW, MED ou HIGH." },
        { status: 400 }
      );
    }

    const assignee = await prisma.user.findUnique({
      where: { id: assignedToUserId },
      select: { id: true },
    });
    if (!assignee) {
      return NextResponse.json(
        { error: "Usuário responsável não encontrado" },
        { status: 400 }
      );
    }

    const parsedDueAt =
      dueAt && typeof dueAt === "string" && dueAt.trim() !== ""
        ? new Date(dueAt)
        : null;

    const baseData = {
      title: title.trim(),
      description: description.trim(),
      assignedToUserId,
      priority: normalizedPriority as "LOW" | "MED" | "HIGH",
      dueAt: parsedDueAt,
      relatedEntityType: null,
      relatedEntityId: null,
      productKey: "system",
      status: "OPEN" as const,
    };

    let task: { id: string; [k: string]: unknown };
    try {
      task = await prisma.systemTask.create({
        data: {
          ...baseData,
          createdByUserId: session.user?.id ?? null,
          source: "manual",
        },
      });
    } catch (createErr: unknown) {
      const msg = createErr && typeof (createErr as Error).message === "string" ? (createErr as Error).message : "";
      const isUnknownColumn = /Unknown arg|Unknown column|does not exist|createdByUserId|source/.test(msg);
      if (isUnknownColumn) {
        try {
          task = await prisma.systemTask.create({ data: baseData });
        } catch (fallbackErr) {
          console.error("[POST /api/admin/tasks] fallback create failed", fallbackErr);
          return NextResponse.json(
            { error: "Erro ao criar tarefa. Rode: npx prisma migrate dev" },
            { status: 500 }
          );
        }
      } else {
        throw createErr;
      }
    }

    return NextResponse.json(task, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/tasks]", err);
    const message = err && typeof (err as Error).message === "string" ? (err as Error).message : "";
    return NextResponse.json(
      { error: message ? `Erro ao criar tarefa: ${message}` : "Erro ao criar tarefa" },
      { status: 500 }
    );
  }
}
