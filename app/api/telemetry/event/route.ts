import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { trackEvent } from "@/lib/telemetry/trackEvent";

/**
 * POST - Registra evento (uso interno após login/ações).
 * Body: { type, message, status?, severity?, entityType?, entityId?, productKey?, meta? }
 */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const id = await trackEvent({
      actorUserId: session.user.id,
      actorRole: (session.user as { roleKey?: string }).roleKey ?? undefined,
      type: body.type ?? "unknown",
      message: body.message ?? "",
      status: body.status ?? "OK",
      severity: body.severity ?? "INFO",
      entityType: body.entityType ?? null,
      entityId: body.entityId ?? null,
      productKey: body.productKey ?? null,
      meta: body.meta ?? null,
    });
    return NextResponse.json({ id });
  } catch (e) {
    console.error("trackEvent error:", e);
    return NextResponse.json({ error: "Erro ao registrar evento" }, { status: 500 });
  }
}
