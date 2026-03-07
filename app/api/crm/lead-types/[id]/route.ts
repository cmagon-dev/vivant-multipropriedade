import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** PUT — editar tipo (crm.manage) */
export async function PUT(
  request: NextRequest,
  context: { params?: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "crm.manage")) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { id } = await context.params!.then((p) => p);
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const body = await request.json();
  const { name, description, order, isActive, initialStageId } = body as { name?: string; description?: string; order?: number; isActive?: boolean; initialStageId?: string | null };

  if (initialStageId !== undefined) {
    if (initialStageId === null || initialStageId === "") {
      // clear initial stage
    } else {
      const stage = await prisma.leadStage.findFirst({ where: { id: initialStageId, leadTypeId: id } });
      if (!stage) return NextResponse.json({ error: "Etapa deve pertencer a este tipo" }, { status: 400 });
    }
  }

  const updated = await prisma.leadType.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(order !== undefined && { order }),
      ...(isActive !== undefined && { isActive }),
      ...(initialStageId !== undefined && { initialStageId: initialStageId?.trim() || null }),
    },
  });
  return NextResponse.json(updated);
}
