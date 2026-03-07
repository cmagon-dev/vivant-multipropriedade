import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

const canManageCrm = (s: { user?: { id?: string }; permissions?: string[]; roleKey?: string }) =>
  (s.user as { roleKey?: string })?.roleKey === "OWNER" ||
  (s.user as { roleKey?: string })?.roleKey === "SUPER_ADMIN" ||
  (s.user as { permissions?: string[] })?.permissions?.includes("crm.manage");

async function canAccessLead(session: { user?: { id?: string } }, leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId }, select: { ownerUserId: true } });
  if (!lead) return { ok: false as const, status: 404 };
  const isOwner = canManageCrm(session as any);
  if (isOwner || lead.ownerUserId === session?.user?.id) return { ok: true as const, lead };
  return { ok: false as const, status: 403 };
}

/** GET — um lead (respeitar ownership) */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view") && !canManageCrm(session as any)) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { id } = params;
  const access = await canAccessLead(session, id);
  if (!access.ok) return NextResponse.json({ error: access.status === 404 ? "Lead não encontrado" : "Acesso negado" }, { status: access.status });

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      leadType: true,
      stage: true,
      owner: { select: { id: true, name: true, email: true } },
      activities: {
        orderBy: { createdAt: "desc" },
        include: { actor: { select: { id: true, name: true } } },
      },
    },
  });
  if (!lead) return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
  return NextResponse.json(lead);
}

/** PUT — atualizar dados básicos (respeitar ownership) */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view") && !canManageCrm(session as any)) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { id } = params;
  const access = await canAccessLead(session, id);
  if (!access.ok) return NextResponse.json({ error: access.status === 404 ? "Lead não encontrado" : "Acesso negado" }, { status: access.status });

  const body = await request.json();
  const { name, phone, email, source, notes } = body as { name?: string; phone?: string; email?: string; source?: string; notes?: string };

  const updated = await prisma.lead.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(phone !== undefined && { phone: phone.trim() }),
      ...(email !== undefined && { email: email?.trim() ?? "" }),
      ...(source !== undefined && { source: source?.trim() ?? null }),
      ...(notes !== undefined && { notes: notes?.trim() ?? null }),
    },
    include: {
      leadType: true,
      stage: true,
      owner: { select: { id: true, name: true, email: true } },
    },
  });
  return NextResponse.json(updated);
}
