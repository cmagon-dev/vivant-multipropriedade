import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** PUT — atualiza defaultOwnerUserId e/ou isActive do assignment (crm.manage) */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ leadTypeId: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "crm.manage")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const { leadTypeId } = await params;
  const body = await request.json().catch(() => ({}));
  const { defaultOwnerUserId, isActive } = body as {
    defaultOwnerUserId?: string;
    isActive?: boolean;
  };

  const leadType = await prisma.leadType.findUnique({ where: { id: leadTypeId } });
  if (!leadType) return NextResponse.json({ error: "Tipo de funil não encontrado" }, { status: 404 });

  if (defaultOwnerUserId !== undefined) {
    const user = await prisma.user.findUnique({
      where: { id: defaultOwnerUserId },
      select: { id: true, active: true },
    });
    if (!user || !user.active) {
      return NextResponse.json({ error: "Usuário não encontrado ou inativo" }, { status: 400 });
    }
  }

  const existing = await prisma.leadTypeAssignment.findUnique({
    where: { leadTypeId },
  });

  const data: { defaultOwnerUserId?: string; isActive?: boolean } = {};
  if (defaultOwnerUserId !== undefined) data.defaultOwnerUserId = defaultOwnerUserId;
  if (isActive !== undefined) data.isActive = isActive;

  if (Object.keys(data).length === 0) {
    const current = existing
      ? await prisma.leadTypeAssignment.findUnique({
          where: { leadTypeId },
          include: {
            leadType: { select: { id: true, key: true, name: true } },
            defaultOwner: { select: { id: true, name: true, email: true } },
          },
        })
      : null;
    return NextResponse.json(current ?? { assignment: null, leadType });
  }

  if (existing) {
    const updated = await prisma.leadTypeAssignment.update({
      where: { leadTypeId },
      data,
      include: {
        leadType: { select: { id: true, key: true, name: true } },
        defaultOwner: { select: { id: true, name: true, email: true } },
      },
    });
    return NextResponse.json(updated);
  }

  const created = await prisma.leadTypeAssignment.create({
    data: {
      leadTypeId,
      defaultOwnerUserId: data.defaultOwnerUserId ?? session.user!.id,
      isActive: data.isActive ?? true,
    },
    include: {
      leadType: { select: { id: true, key: true, name: true } },
      defaultOwner: { select: { id: true, name: true, email: true } },
    },
  });
  return NextResponse.json(created);
}
