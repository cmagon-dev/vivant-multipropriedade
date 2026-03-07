import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/telemetry/trackEvent";

const canManageCrm = (s: { user?: { id?: string }; roleKey?: string; permissions?: string[] }) =>
  (s.user as { roleKey?: string })?.roleKey === "OWNER" ||
  (s.user as { roleKey?: string })?.roleKey === "SUPER_ADMIN" ||
  (s.user as { permissions?: string[] })?.permissions?.includes("crm.manage");

/** POST — registra que o vendedor copiou a mensagem WhatsApp (trackEvent opcional). */
export async function POST(
  _request: NextRequest,
  context: { params?: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view") && !canManageCrm(session as any))
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { id: leadId } = await context.params!.then((p) => p);
  const lead = await prisma.lead.findUnique({ where: { id: leadId }, include: { leadType: true } });
  if (!lead) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
  if (!canManageCrm(session as any) && lead.ownerUserId !== session.user!.id)
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  await trackEvent({
    actorUserId: session.user!.id,
    type: "crm.whatsapp.copied",
    entityType: "Lead",
    entityId: lead.id,
    productKey: lead.leadType.key,
    message: `Mensagem WhatsApp copiada para lead ${lead.name}`,
    meta: { leadId: lead.id },
  });

  return NextResponse.json({ ok: true });
}
