import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** GET — lista motivos de perda. ?leadTypeId= para filtrar (comercial); ?all=true para admin (todos). */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const canView = hasPermission(session as any, "comercial.view") || hasPermission(session as any, "crm.manage");
  const isOwner = (session.user as { roleKey?: string }).roleKey === "OWNER" || (session.user as { roleKey?: string }).roleKey === "SUPER_ADMIN";
  if (!canView && !isOwner) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const leadTypeId = searchParams.get("leadTypeId") ?? undefined;
  const all = searchParams.get("all") === "true" && (hasPermission(session as any, "crm.manage") || isOwner);

  const where = all ? undefined : { isActive: true, ...(leadTypeId && { leadTypeId }) };
  const reasons = await prisma.leadLossReason.findMany({
    where,
    include: all ? { leadType: { select: { id: true, key: true, name: true } } } : undefined,
    orderBy: [{ leadTypeId: "asc" }, { order: "asc" }],
  });
  return NextResponse.json(reasons);
}

/** POST — criar motivo (crm.manage) */
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "crm.manage")) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const body = await request.json();
  const { leadTypeId, name, order } = body as { leadTypeId: string; name: string; order: number };
  if (!leadTypeId || !name?.trim()) return NextResponse.json({ error: "leadTypeId e name obrigatórios" }, { status: 400 });

  const created = await prisma.leadLossReason.create({
    data: {
      leadTypeId,
      name: name.trim(),
      order: order ?? 0,
      isActive: true,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
