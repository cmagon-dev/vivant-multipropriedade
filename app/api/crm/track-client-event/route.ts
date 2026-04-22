import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { trackEvent } from "@/lib/telemetry/trackEvent";

const ALLOWED_TYPES = ["crm.new_leads.alerted"] as const;

/** POST — registrar evento do client (ex: alerta de novos leads). Apenas tipos permitidos. */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view")) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const body = await request.json().catch(() => ({}));
  const { type, meta } = body as { type?: string; meta?: Record<string, unknown> };
  if (!type || !ALLOWED_TYPES.includes(type as (typeof ALLOWED_TYPES)[number])) {
    return NextResponse.json({ error: "Tipo de evento não permitido" }, { status: 400 });
  }

  await trackEvent({
    actorUserId: session.user.id,
    type,
    message: type === "crm.new_leads.alerted" ? `Alerta de novos leads (${(meta?.count as number) ?? 0})` : "Evento do painel",
    meta: meta ?? undefined,
  });
  return NextResponse.json({ ok: true });
}
