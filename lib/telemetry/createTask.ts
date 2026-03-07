import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type SystemTaskStatus = "OPEN" | "DONE" | "CANCELED";
export type SystemTaskPriority = "LOW" | "MED" | "HIGH";

export type CreateTaskParams = {
  title: string;
  description?: string | null;
  dueAt?: Date | null;
  assignedToUserId?: string | null;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
  productKey?: string | null;
  priority?: SystemTaskPriority;
  status?: SystemTaskStatus;
  meta?: Record<string, unknown> | null;
};

/**
 * Cria uma tarefa/pendência para visibilidade do Dono em /admin/tasks.
 */
export async function createTask(params: CreateTaskParams): Promise<string> {
  const task = await prisma.systemTask.create({
    data: {
      title: params.title,
      description: params.description ?? null,
      dueAt: params.dueAt ?? null,
      assignedToUserId: params.assignedToUserId ?? null,
      relatedEntityType: params.relatedEntityType ?? null,
      relatedEntityId: params.relatedEntityId ?? null,
      productKey: params.productKey ?? null,
      priority: (params.priority ?? "MED") as "LOW" | "MED" | "HIGH",
      status: (params.status ?? "OPEN") as "OPEN" | "DONE" | "CANCELED",
      meta: (params.meta ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });
  return task.id;
}
