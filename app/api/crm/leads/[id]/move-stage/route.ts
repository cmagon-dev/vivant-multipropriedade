import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/telemetry/trackEvent";
import { createTask } from "@/lib/telemetry/createTask";
import { closeLeadSlaTasks } from "@/lib/crm/closeLeadSlaTasks";
import { recordStageChanged, recordSlaResolved } from "@/lib/crm/slaEvents";

const canManageCrm = (s: { user?: { id?: string }; roleKey?: string; permissions?: string[] }) =>
  (s.user as { roleKey?: string })?.roleKey === "OWNER" ||
  (s.user as { roleKey?: string })?.roleKey === "SUPER_ADMIN" ||
  (s.user as { permissions?: string[] })?.permissions?.includes("crm.manage");

/** POST — mover lead para outra etapa. trackEvent + createTask se nova etapa tiver SLA */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view") && !canManageCrm(session as any)) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { id: leadId } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      leadType: true,
      stage: { select: { id: true, name: true, slaEnabled: true, slaHours: true, slaThresholds: true } },
      owner: { select: { id: true } },
    },
  });
  if (!lead) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
  const isOwner = canManageCrm(session as any);
  if (!isOwner && lead.ownerUserId !== session.user!.id)
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const body = await request.json();
  const { stageId, lossReasonId, lossNote } = body as { stageId: string; lossReasonId?: string; lossNote?: string };

  if (!stageId) return NextResponse.json({ error: "stageId obrigatório" }, { status: 400 });

  const newStage = await prisma.leadStage.findFirst({
    where: { id: stageId, leadTypeId: lead.leadTypeId, isActive: true },
  });
  if (!newStage) return NextResponse.json({ error: "Etapa inválida ou não pertence ao tipo do lead" }, { status: 400 });

  const now = new Date();
  const slaEnabled = (newStage as { slaEnabled?: boolean }).slaEnabled !== false;
  const slaHours = newStage.slaHours ?? 0;
  const hasSla = slaEnabled && slaHours > 0 && !newStage.isFinal;
  const stageEnteredAt = now;
  const stageDueAt = hasSla ? new Date(now.getTime() + slaHours * 60 * 60 * 1000) : null;

  const wasOverdue =
    lead.stageDueAt != null &&
    new Date(lead.stageDueAt) < now &&
    (lead.stage as { slaEnabled?: boolean })?.slaEnabled !== false;
  const overdueHoursTotal = wasOverdue && lead.stageDueAt
    ? (now.getTime() - new Date(lead.stageDueAt).getTime()) / (1000 * 60 * 60)
    : 0;

  if (newStage.isFinal && newStage.finalStatus === "LOST") {
    if (!lossReasonId?.trim()) {
      return NextResponse.json({ error: "Motivo de perda é obrigatório ao marcar lead como perdido" }, { status: 400 });
    }
    const reason = await prisma.leadLossReason.findFirst({
      where: { id: lossReasonId, leadTypeId: lead.leadTypeId, isActive: true },
    });
    if (!reason) {
      return NextResponse.json({ error: "Motivo de perda inválido ou não pertence ao tipo do lead" }, { status: 400 });
    }
  }

  const stageFrom = lead.stage.name;
  const stageTo = newStage.name;

  const updateData: {
    stageId: string;
    status?: "WON" | "LOST";
    lossReasonId?: string | null;
    stageEnteredAt: Date;
    stageDueAt: Date | null;
    stageBreachedAt: null;
  } = {
    stageId: newStage.id,
    stageEnteredAt,
    stageDueAt,
    stageBreachedAt: null,
  };
  if (newStage.isFinal && newStage.finalStatus) {
    updateData.status = newStage.finalStatus;
    if (newStage.finalStatus === "LOST" && lossReasonId) updateData.lossReasonId = lossReasonId;
    if (newStage.finalStatus === "WON") updateData.lossReasonId = null;
  }

  const updated = await prisma.lead.update({
    where: { id: leadId },
    data: updateData,
    include: {
      leadType: true,
      stage: true,
      owner: { select: { id: true, name: true, email: true } },
      lossReason: true,
    },
  });

  await recordStageChanged({
    leadId,
    stageId: newStage.id,
    fromStageId: lead.stage.id,
    toStageId: newStage.id,
  });
  if (wasOverdue && overdueHoursTotal > 0) {
    await recordSlaResolved({
      leadId,
      stageId: lead.stage.id,
      overdueHoursTotal,
      resolvedAt: now,
      breachedAt: lead.stageDueAt ? new Date(lead.stageDueAt) : null,
    });
  }

  await trackEvent({
    actorUserId: session.user!.id,
    type: "crm.lead.stage_changed",
    entityType: "Lead",
    entityId: lead.id,
    productKey: lead.leadType.key,
    message: `Lead ${lead.name}: ${stageFrom} → ${stageTo}`,
    meta: { leadTypeKey: lead.leadType.key, stageFrom, stageTo, ownerUserId: lead.ownerUserId, leadId: lead.id },
  });

  if (newStage.isFinal && newStage.finalStatus === "LOST") {
    await trackEvent({
      actorUserId: session.user!.id,
      type: "crm.lead.lost",
      entityType: "Lead",
      entityId: lead.id,
      productKey: lead.leadType.key,
      message: `Lead perdido: ${lead.name} - ${updated.lossReason?.name ?? lossReasonId}`,
      meta: { leadId: lead.id, lossReasonId, reason: updated.lossReason?.name, lossNote: lossNote ?? null },
    });
  }
  if (newStage.isFinal && newStage.finalStatus === "WON") {
    await trackEvent({
      actorUserId: session.user!.id,
      type: "crm.lead.won",
      entityType: "Lead",
      entityId: lead.id,
      productKey: lead.leadType.key,
      message: `Lead ganho: ${lead.name}`,
      meta: { leadId: lead.id },
    });
  }

  if (newStage.isFinal && newStage.finalStatus === "LOST" && (lossNote?.trim())) {
    await prisma.leadActivity.create({
      data: {
        leadId,
        actorUserId: session.user!.id,
        type: "NOTE",
        message: `[Motivo de perda] ${lossNote.trim()}`,
      },
    });
  }

  await closeLeadSlaTasks(leadId, "CANCELED");

  if (hasSla) {
    const dueAt = stageDueAt!;
    await createTask({
      title: `Ação na etapa: ${newStage.name} - ${lead.name}`,
      description: `Lead em "${newStage.name}" (${lead.leadType.name}). SLA: ${newStage.slaHours}h`,
      dueAt,
      assignedToUserId: lead.ownerUserId,
      relatedEntityType: "Lead",
      relatedEntityId: lead.id,
      productKey: lead.leadType.key,
      priority: "MED",
      meta: { leadId: lead.id, stageId: newStage.id, leadTypeKey: lead.leadType.key },
    });
  }

  return NextResponse.json(updated);
}
