import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type SystemEventSeverity = "INFO" | "WARN" | "CRITICAL";
export type SystemEventStatus = "OK" | "PENDING" | "FAILED";

export type TrackEventParams = {
  actorUserId?: string | null;
  actorRole?: string | null;
  type: string;
  entityType?: string | null;
  entityId?: string | null;
  productKey?: string | null;
  severity?: SystemEventSeverity;
  status?: SystemEventStatus;
  message: string;
  meta?: Record<string, unknown> | null;
};

/**
 * Registra um evento do sistema para visibilidade do Dono em /admin/events.
 */
export async function trackEvent(params: TrackEventParams): Promise<string> {
  const event = await prisma.systemEvent.create({
    data: {
      actorUserId: params.actorUserId ?? null,
      actorRole: params.actorRole ?? null,
      type: params.type,
      entityType: params.entityType ?? null,
      entityId: params.entityId ?? null,
      productKey: params.productKey ?? null,
      severity: (params.severity ?? "INFO") as "INFO" | "WARN" | "CRITICAL",
      status: (params.status ?? "OK") as "OK" | "PENDING" | "FAILED",
      message: params.message,
      meta: (params.meta ?? undefined) as Prisma.InputJsonValue | undefined,
    },
  });
  return event.id;
}
