import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** DELETE — excluir tarefa (tasks.manage) */
export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "tasks.manage")) {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }
  const { id } = await ctx.params;
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  try {
    await prisma.systemTask.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const e = err as { code?: string; message?: string };
    const message = typeof e?.message === "string" ? e.message : "";
    if (e?.code === "P2025" || message.includes("Record to delete does not exist")) {
      return NextResponse.json({ error: "Tarefa não encontrada" }, { status: 404 });
    }
    console.error("[DELETE /api/admin/tasks/:id]", err);
    return NextResponse.json(
      { error: message ? `Erro ao excluir: ${message}` : "Erro ao excluir tarefa" },
      { status: 500 }
    );
  }
}
