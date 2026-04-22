import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();

    if (!session || (session.user as { userType?: string }).userType !== "admin") {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const canManage =
      hasPermission(session as any, "vivantCare.cotistas.manage") ||
      (session.user as { role?: string }).role === "ADMIN";

    if (!canManage) {
      return NextResponse.json(
        { error: "Sem permissão para excluir cotistas" },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "ID do cotista é obrigatório" },
        { status: 400 }
      );
    }

    await prisma.cotista.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json(
        { error: "Cotista não encontrado" },
        { status: 404 }
      );
    }
    console.error("Erro ao excluir cotista:", error);
    return NextResponse.json(
      { error: "Erro ao excluir cotista" },
      { status: 500 }
    );
  }
}
