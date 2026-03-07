import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/telemetry/trackEvent";

const canManageCrm = (s: { user?: { id?: string }; roleKey?: string; permissions?: string[] }) =>
  (s.user as { roleKey?: string })?.roleKey === "OWNER" ||
  (s.user as { roleKey?: string })?.roleKey === "SUPER_ADMIN" ||
  (s.user as { permissions?: string[] })?.permissions?.includes("crm.manage");

const ACTIVITY_TYPES = ["NOTE", "CALL", "WHATSAPP", "VISIT", "PROPOSAL", "STATUS_CHANGE"] as const;

/** POST — registrar atividade no lead. trackEvent */
export async function POST(
  request: NextRequest,
  context: { params?: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view") && !canManageCrm(session as any))
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { id: leadId } = await context.params!.then((p) => p);
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: { leadType: true },
  });
  if (!lead) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
  if (!canManageCrm(session as any) && lead.ownerUserId !== session.user!.id)
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const body = await request.json();
  const { type, message, meta } = body as { type: string; message?: string; meta?: Record<string, unknown> };
  if (!type || !ACTIVITY_TYPES.includes(type as (typeof ACTIVITY_TYPES)[number]))
    return NextResponse.json({ error: "type obrigatório: NOTE, CALL, WHATSAPP, VISIT, PROPOSAL, STATUS_CHANGE" }, { status: 400 });

  const activity = await prisma.leadActivity.create({
    data: {
      leadId,
      actorUserId: session.user!.id,
      type: type as (typeof ACTIVITY_TYPES)[number],
      message: message?.trim() ?? null,
      meta: (meta ?? undefined) as Prisma.InputJsonValue | undefined,
    },
    include: { actor: { select: { id: true, name: true } } },
  });

  await trackEvent({
    actorUserId: session.user!.id,
    type: "crm.lead.activity_added",
    entityType: "Lead",
    entityId: lead.id,
    productKey: lead.leadType.key,
    message: `Atividade ${type} em lead ${lead.name}`,
    meta: { leadId: lead.id, activityType: type, activityId: activity.id, ownerUserId: lead.ownerUserId },
  });

  return NextResponse.json(activity, { status: 201 });
}
