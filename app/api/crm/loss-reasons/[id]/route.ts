import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** PUT — editar motivo (crm.manage) */
export async function PUT(
  request: NextRequest,
  context: { params?: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "crm.manage")) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { id } = await context.params!.then((p) => p);
  const body = await request.json();
  const { name, order, isActive } = body as { name?: string; order?: number; isActive?: boolean };

  const updated = await prisma.leadLossReason.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(order !== undefined && { order }),
      ...(isActive !== undefined && { isActive }),
    },
  });
  return NextResponse.json(updated);
}
