import { prisma } from "@/lib/prisma";
import { getSlaStatus, parseStageThresholds, type SlaThresholdEntry } from "./sla";

type LeadWithSla = {
  id: string;
  stageId: string;
  stageEnteredAt: Date | null;
  stageDueAt: Date | null;
  stage: {
    slaEnabled: boolean;
    slaHours: number | null;
    slaThresholds: unknown;
  };
};

/**
 * Registra STAGE_CHANGED ao mudar de etapa.
 */
export async function recordStageChanged(params: {
  leadId: string;
  stageId: string;
  fromStageId?: string;
  toStageId?: string;
}): Promise<void> {
  await prisma.leadSlaEvent.create({
    data: {
      leadId: params.leadId,
      stageId: params.stageId,
      type: "STAGE_CHANGED",
      meta: {
        fromStageId: params.fromStageId ?? null,
        toStageId: params.toStageId ?? null,
      },
    },
  });
}

/**
 * Registra SLA_RESOLVED quando o lead deixa de estar atrasado (ex: mudou de etapa).
 */
export async function recordSlaResolved(params: {
  leadId: string;
  stageId: string;
  overdueHoursTotal: number;
  resolvedAt: Date;
  breachedAt?: Date | null;
}): Promise<void> {
  await prisma.leadSlaEvent.create({
    data: {
      leadId: params.leadId,
      stageId: params.stageId,
      type: "SLA_RESOLVED",
      meta: {
        overdueHoursTotal: params.overdueHoursTotal,
        resolvedAt: params.resolvedAt.toISOString(),
        breachedAt: params.breachedAt?.toISOString() ?? null,
      },
    },
  });
}

/**
 * Registra SLA_BREACHED 1x por (leadId, stageId). Idempotente.
 */
export async function ensureSlaBreachedRecorded(leadId: string, stageId: string): Promise<boolean> {
  const existing = await prisma.leadSlaEvent.findFirst({
    where: { leadId, stageId, type: "SLA_BREACHED" },
  });
  if (existing) return false;
  await prisma.leadSlaEvent.create({
    data: { leadId, stageId, type: "SLA_BREACHED", meta: { breachedAt: new Date().toISOString() } },
  });
  return true;
}

/**
 * Registra SLA_WARNING 1x por (leadId, stageId, thresholdHoursLeft). Idempotente.
 */
export async function ensureSlaWarningRecorded(
  leadId: string,
  stageId: string,
  thresholdHoursLeft: number,
  color: string
): Promise<boolean> {
  const existingList = await prisma.leadSlaEvent.findMany({
    where: { leadId, stageId, type: "SLA_WARNING" },
  });
  const already = existingList.some(
    (e) => (e.meta as { thresholdHoursLeft?: number } | null)?.thresholdHoursLeft === thresholdHoursLeft
  );
  if (already) return false;
  await prisma.leadSlaEvent.create({
    data: {
      leadId,
      stageId,
      type: "SLA_WARNING",
      meta: { thresholdHoursLeft, color },
    },
  });
  return true;
}

/**
 * Para cada lead, calcula status e grava SLA_WARNING / SLA_BREACHED se ainda não registrados.
 * Chamado opcionalmente ao listar leads do Kanban para “lastro” de eventos.
 */
export async function ensureSlaEventsForLeads(leads: LeadWithSla[]): Promise<void> {
  const now = new Date();
  for (const lead of leads) {
    const thresholds = parseStageThresholds(lead.stage?.slaThresholds ?? null);
    const result = getSlaStatus({
      stageDueAt: lead.stageDueAt,
      stageEnteredAt: lead.stageEnteredAt,
      slaEnabled: lead.stage?.slaEnabled ?? true,
      slaHours: lead.stage?.slaHours ?? null,
      thresholds,
      now,
    });
    if (result.status === "RED" && result.overdueHours != null) {
      await ensureSlaBreachedRecorded(lead.id, lead.stageId);
    }
    if (result.status === "YELLOW" || result.status === "ORANGE") {
      const sorted = [...thresholds].sort((a, b) => a.hoursLeft - b.hoursLeft);
      for (const t of sorted) {
        if (result.hoursLeft != null && result.hoursLeft <= t.hoursLeft) {
          await ensureSlaWarningRecorded(lead.id, lead.stageId, t.hoursLeft, t.color);
          break;
        }
      }
    }
  }
}
