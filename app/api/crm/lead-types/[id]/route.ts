import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** PUT — editar tipo (crm.manage) */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    if (!hasPermission(session as any, "crm.manage")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
    }

    const body = await request.json();
    const { name, description, order, isActive, initialStageId } = body as {
      name?: string;
      description?: string;
      order?: number;
      isActive?: boolean;
      initialStageId?: string | null;
    };

    if (initialStageId !== undefined) {
      if (initialStageId && initialStageId.trim() !== "") {
        const stage = await prisma.leadStage.findFirst({
          where: { id: initialStageId, leadTypeId: id },
        });
        if (!stage) {
          return NextResponse.json(
            { error: "Etapa deve pertencer a este tipo" },
            { status: 400 }
          );
        }
      }
    }

    const updated = await prisma.leadType.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive }),
        ...(initialStageId !== undefined && {
          initialStageId:
            initialStageId && initialStageId.trim() !== ""
              ? initialStageId
              : null,
        }),
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PUT /api/crm/lead-types/:id]", err);
    return NextResponse.json(
      { error: "Erro ao atualizar tipo de funil" },
      { status: 500 }
    );
  }
}

/** DELETE — excluir tipo de funil (crm.manage) */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
    if (!hasPermission(session as any, "crm.manage")) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
    }

    // Não permitir excluir funil que já tem leads associados
    const leadsCount = await prisma.lead.count({ where: { leadTypeId: id } });
    if (leadsCount > 0) {
      return NextResponse.json(
        {
          error:
            "Não é possível excluir este funil porque existem leads associados. Arquive o funil (desative) ou mova os leads antes.",
        },
        { status: 400 }
      );
    }

    await prisma.leadType.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/crm/lead-types/:id]", err);
    return NextResponse.json(
      { error: "Erro ao excluir tipo de funil" },
      { status: 500 }
    );
  }
}
