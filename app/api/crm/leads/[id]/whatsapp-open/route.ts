import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/telemetry/trackEvent";

const canManageCrm = (s: { user?: { id?: string }; roleKey?: string; permissions?: string[] }) =>
  (s.user as { roleKey?: string })?.roleKey === "OWNER" ||
  (s.user as { roleKey?: string })?.roleKey === "SUPER_ADMIN" ||
  (s.user as { permissions?: string[] })?.permissions?.includes("crm.manage");

/**
 * POST — registra abertura do WhatsApp (LeadActivity + trackEvent). Valida ownership.
 */
export async function POST(
  request: NextRequest,
  context: { params?: Promise<{ id: string }> }
) {
  const session = await getSession();
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

  const body = await request.json().catch(() => ({}));
  const { stageId, messagePreview } = body as { stageId?: string; messagePreview?: string };

  await prisma.leadActivity.create({
    data: {
      leadId,
      actorUserId: session.user!.id,
      type: "WHATSAPP",
      message: messagePreview ?? "WhatsApp aberto (playbook)",
      meta: stageId ? { stageId, messagePreview: messagePreview ?? null } : undefined,
    },
  });

  await trackEvent({
    actorUserId: session.user!.id,
    type: "crm.whatsapp.opened",
    entityType: "Lead",
    entityId: lead.id,
    productKey: lead.leadType.key,
    message: `WhatsApp aberto para lead ${lead.name}`,
    meta: { leadId: lead.id, stageId: stageId ?? null },
  });

  return NextResponse.json({ ok: true });
}
