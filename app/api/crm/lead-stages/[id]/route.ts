import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** PUT — editar etapa (crm.manage) */
export async function PUT(
  request: NextRequest,
  context: { params?: Promise<{ id: string }> | { id: string } }
) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const canManageCrm = hasPermission(session as any, "crm.manage");
  const canManageSla = hasPermission(session as any, "sla.manage");
  if (!canManageCrm) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const id = context.params instanceof Promise ? (await context.params).id : context.params?.id;
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
  const body = await request.json();
  const {
    name,
    order,
    isFinal,
    finalStatus,
    slaEnabled,
    slaHours,
    slaThresholds,
    isActive,
    whatsTemplate,
    playbookChecklist,
    helpText,
    nextActionType,
  } = body as {
    name?: string;
    order?: number;
    isFinal?: boolean;
    finalStatus?: "WON" | "LOST" | null;
    slaEnabled?: boolean;
    slaHours?: number | null;
    slaThresholds?: { color: string; hoursLeft: number }[] | null;
    isActive?: boolean;
    whatsTemplate?: string | null;
    playbookChecklist?: string[] | null;
    helpText?: string | null;
    nextActionType?: string | null;
  };

  if ((slaEnabled !== undefined || slaThresholds !== undefined) && !canManageSla) {
    return NextResponse.json({ error: "Sem permissão para configurar ALERTA" }, { status: 403 });
  }

  if (slaThresholds !== undefined && Array.isArray(slaThresholds)) {
    const valid = slaThresholds
      .filter((t) => t && (t.color === "YELLOW" || t.color === "ORANGE") && typeof t.hoursLeft === "number" && t.hoursLeft >= 0)
      .map((t) => ({ color: t.color as "YELLOW" | "ORANGE", hoursLeft: Math.round(t.hoursLeft) }));
    valid.sort((a, b) => a.hoursLeft - b.hoursLeft);
    const stage = await prisma.leadStage.findUnique({ where: { id }, select: { slaHours: true } });
    const maxHours = stage?.slaHours ?? 0;
    for (const t of valid) {
      if (maxHours > 0 && t.hoursLeft > maxHours) {
        return NextResponse.json(
          { error: `Threshold ${t.hoursLeft}h não pode ser maior que ALERTA da etapa (${maxHours}h)` },
          { status: 400 }
        );
      }
    }
  }

  const normalizedOrder =
    order !== undefined && Number.isFinite(Number(order)) ? Math.max(1, Math.round(Number(order))) : undefined;

  const patchData = {
    ...(name !== undefined && { name }),
    ...(isFinal !== undefined && { isFinal }),
    ...(finalStatus !== undefined && { finalStatus: finalStatus ?? null }),
    ...(slaEnabled !== undefined && { slaEnabled }),
    ...(slaHours !== undefined && { slaHours: slaHours ?? null }),
    ...(slaThresholds !== undefined && {
      slaThresholds: Array.isArray(slaThresholds)
        ? (slaThresholds
            .filter((t) => t && (t.color === "YELLOW" || t.color === "ORANGE") && typeof t.hoursLeft === "number")
            .sort((a, b) => (a as { hoursLeft: number }).hoursLeft - (b as { hoursLeft: number }).hoursLeft) as unknown as Prisma.InputJsonValue)
        : Prisma.JsonNull,
    }),
    ...(isActive !== undefined && { isActive }),
    ...(whatsTemplate !== undefined && { whatsTemplate: whatsTemplate?.trim() || null }),
    ...(playbookChecklist !== undefined && { playbookChecklist: Array.isArray(playbookChecklist) ? playbookChecklist : Prisma.JsonNull }),
    ...(helpText !== undefined && { helpText: helpText?.trim() || null }),
    ...(nextActionType !== undefined && { nextActionType: nextActionType?.trim() || null }),
  };

  // Reordenação segura: evita colisão de UNIQUE(leadTypeId, order) durante drag-and-drop.
  if (normalizedOrder !== undefined) {
    const updated = await prisma.$transaction(async (tx) => {
      const current = await tx.leadStage.findUnique({
        where: { id },
        select: { id: true, leadTypeId: true },
      });
      if (!current) throw new Error("Etapa não encontrada");

      const siblings = await tx.leadStage.findMany({
        where: { leadTypeId: current.leadTypeId },
        orderBy: { order: "asc" },
      });

      const withoutCurrent = siblings.filter((s) => s.id !== id);
      const targetIndex = Math.min(Math.max(normalizedOrder - 1, 0), withoutCurrent.length);
      const reordered = [...withoutCurrent];
      const currentStage = siblings.find((s) => s.id === id)!;
      reordered.splice(targetIndex, 0, currentStage);

      // Primeiro joga para faixa temporária para não colidir.
      for (let i = 0; i < reordered.length; i += 1) {
        await tx.leadStage.update({
          where: { id: reordered[i].id },
          data: { order: 1000 + i },
        });
      }

      // Depois aplica a ordem final + patch no item atual.
      for (let i = 0; i < reordered.length; i += 1) {
        const stage = reordered[i];
        await tx.leadStage.update({
          where: { id: stage.id },
          data: stage.id === id ? { order: i + 1, ...patchData } : { order: i + 1 },
        });
      }

      return tx.leadStage.findUnique({ where: { id } });
    });
    return NextResponse.json(updated);
  }

  const updated = await prisma.leadStage.update({
    where: { id },
    data: patchData,
  });
  return NextResponse.json(updated);
}

/** DELETE — excluir etapa (crm.manage). Bloqueia se houver leads na etapa. */
export async function DELETE(
  _request: NextRequest,
  context: { params?: Promise<{ id: string }> | { id: string } }
) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "crm.manage")) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const id = context.params instanceof Promise ? (await context.params).id : context.params?.id;
  if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

  try {
    const count = await prisma.lead.count({ where: { stageId: id } });
    if (count > 0) {
      return NextResponse.json(
        { error: "Não é possível excluir esta etapa porque existem leads nela. Mova os leads para outra etapa antes de excluir." },
        { status: 400 }
      );
    }

    await prisma.leadStage.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("[DELETE /api/crm/lead-stages/[id]]", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: message.includes("Foreign key") || message.includes("lead_stage") ? "Não é possível excluir esta etapa porque existem leads nela. Mova os leads para outra etapa antes de excluir." : "Erro ao excluir etapa." },
      { status: 400 }
    );
  }
}
