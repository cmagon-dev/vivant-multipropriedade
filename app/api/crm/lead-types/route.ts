import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** GET — lista tipos (comercial: só ativos; crm.manage: ?all=true para todos) com etapas */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const can = hasPermission(session as any, "comercial.view") || hasPermission(session as any, "crm.manage");
  const isOwner = (session.user as { roleKey?: string }).roleKey === "OWNER" || (session.user as { roleKey?: string }).roleKey === "SUPER_ADMIN";
  if (!can && !isOwner) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const all = searchParams.get("all") === "true" && (hasPermission(session as any, "crm.manage") || isOwner);

  try {
    const types = await prisma.leadType.findMany({
      where: all ? undefined : { isActive: true },
      include: {
        stages: {
          where: all ? undefined : { isActive: true },
          orderBy: { order: "asc" },
          select: {
            id: true,
            leadTypeId: true,
            name: true,
            order: true,
            isFinal: true,
            finalStatus: true,
            slaHours: true,
            isActive: true,
            whatsTemplate: true,
            playbookChecklist: true,
            nextActionType: true,
            helpText: true,
          },
        },
        ...(all && { initialStage: { select: { id: true, name: true } } }),
      },
      orderBy: { order: "asc" },
    });
    return NextResponse.json(types);
  } catch (err) {
    console.error("[GET /api/crm/lead-types]", err);
    return NextResponse.json([], { status: 200 });
  }
}

/** POST — criar tipo (crm.manage) */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "crm.manage")) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const body = await request.json();
  const { key, name, description, order } = body as { key?: string; name?: string; description?: string; order?: number };
  if (!key?.trim() || !name?.trim()) return NextResponse.json({ error: "key e name obrigatórios" }, { status: 400 });

  const created = await prisma.leadType.create({
    data: {
      key: key.trim().toUpperCase().replace(/\s/g, "_"),
      name: name.trim(),
      description: description?.trim() ?? null,
      order: order ?? 0,
      isActive: true,
    },
  });
  return NextResponse.json(created, { status: 201 });
}
