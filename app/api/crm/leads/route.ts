import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/telemetry/trackEvent";
import { createTask } from "@/lib/telemetry/createTask";
import { closeLeadSlaTasks } from "@/lib/crm/closeLeadSlaTasks";

const canManageCrm = (s: { user?: { id?: string }; permissions?: string[]; roleKey?: string }) =>
  (s.user as { roleKey?: string })?.roleKey === "OWNER" ||
  (s.user as { roleKey?: string })?.roleKey === "SUPER_ADMIN" ||
  (s.user as { roleKey?: string })?.roleKey === "ADMIN" ||
  (s.user as { permissions?: string[] })?.permissions?.includes("crm.manage");

async function getAllowedResponsibleIds() {
  const commercialRole = await prisma.role.findUnique({ where: { key: "COMMERCIAL" } });
  const ownerRole = await prisma.role.findUnique({ where: { key: "OWNER" } });
  const superAdminRole = await prisma.role.findUnique({ where: { key: "SUPER_ADMIN" } });
  const adminRole = await prisma.role.findUnique({ where: { key: "ADMIN" } });
  const roleIds = [commercialRole?.id, ownerRole?.id, superAdminRole?.id, adminRole?.id].filter(Boolean) as string[];

  const users = await prisma.user.findMany({
    where: {
      active: true,
      OR: [
        { userRoleAssignments: { some: { roleId: { in: roleIds } } } },
        {
          userPermissions: {
            some: { permission: { key: "comercial.view" }, granted: true },
          },
        },
      ],
    },
    select: { id: true },
  });
  return new Set(users.map((u) => u.id));
}

/** GET — lista leads (comercial: só próprios; OWNER: todos). Filtros: type, stage, status */
export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const canView = hasPermission(session as any, "comercial.view") || canManageCrm(session as any);
  if (!canView) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const leadTypeId = searchParams.get("leadTypeId") ?? undefined;
  const stageId = searchParams.get("stageId") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const mine = searchParams.get("mine") === "true";
  const responsibleUserId = searchParams.get("responsibleUserId");
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Math.min(Math.max(1, parseInt(limitParam, 10)), 50) : undefined;
  const sort = searchParams.get("sort") === "createdAt" ? "createdAt" : "updatedAt";

  const isOwner = canManageCrm(session as any);
  const where: Record<string, unknown> = {};
  if (!isOwner || mine) where.ownerUserId = session.user!.id;
  if (isOwner && responsibleUserId === "__unassigned__") where.ownerUserId = null;
  if (isOwner && responsibleUserId && responsibleUserId !== "__unassigned__") where.ownerUserId = responsibleUserId;
  if (leadTypeId) where.leadTypeId = leadTypeId;
  if (stageId) where.stageId = stageId;
  if (status) where.status = status;

  const leads = await prisma.lead.findMany({
    where,
    include: {
      leadType: { select: { id: true, key: true, name: true } },
      stage: {
        select: {
          id: true,
          name: true,
          order: true,
          slaHours: true,
          slaEnabled: true,
          slaThresholds: true,
          isFinal: true,
          finalStatus: true,
        },
      },
      owner: { select: { id: true, name: true, email: true } },
    },
    orderBy: sort === "createdAt" ? [{ createdAt: "desc" }] : [{ updatedAt: "desc" }],
    take: limit,
  });

  const slaEnabled = (s: { slaEnabled?: boolean; slaHours: number | null; isFinal: boolean }) =>
    (s.slaEnabled !== false && (s.slaHours ?? 0) > 0 && !s.isFinal);

  for (const lead of leads) {
    const stage = lead.stage as { slaEnabled?: boolean; slaHours: number | null; isFinal: boolean };
    if (
      lead.stageEnteredAt == null &&
      lead.stageDueAt == null &&
      stage &&
      slaEnabled(stage)
    ) {
      const entered = new Date(lead.updatedAt);
      const due = new Date(entered.getTime() + (stage.slaHours ?? 0) * 60 * 60 * 1000);
      await prisma.lead.update({
        where: { id: lead.id },
        data: { stageEnteredAt: entered, stageDueAt: due },
      });
      (lead as { stageEnteredAt: Date | null; stageDueAt: Date | null }).stageEnteredAt = entered;
      (lead as { stageEnteredAt: Date | null; stageDueAt: Date | null }).stageDueAt = due;
    }
  }

  return NextResponse.json(leads);
}

/** POST — criar lead (comercial para si). Stage inicial = primeira etapa do tipo. trackEvent + createTask SLA */
export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view")) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const body = await request.json();
  const { leadTypeId, name, phone, email, source, notes, ownerUserId } = body as {
    leadTypeId: string;
    name: string;
    phone: string;
    email?: string;
    source?: string;
    notes?: string;
    ownerUserId?: string | null;
  };
  if (!leadTypeId || !name?.trim() || !phone?.trim())
    return NextResponse.json({ error: "leadTypeId, name e phone obrigatórios" }, { status: 400 });

  const leadType = await prisma.leadType.findUnique({
    where: { id: leadTypeId },
    include: { initialStage: true },
  });
  if (!leadType) return NextResponse.json({ error: "Tipo de lead inválido" }, { status: 400 });

  const firstStage =
    leadType.initialStageId && leadType.initialStage && leadType.initialStage.isActive
      ? leadType.initialStage
      : await prisma.leadStage.findFirst({
          where: { leadTypeId, isActive: true },
          orderBy: { order: "asc" },
        });
  if (!firstStage) return NextResponse.json({ error: "Tipo de lead sem etapas configuradas" }, { status: 400 });

  const now = new Date();
  const firstStageSla = (firstStage as { slaEnabled?: boolean }).slaEnabled !== false && (firstStage.slaHours ?? 0) > 0 && !firstStage.isFinal;
  const stageEnteredAt = now;
  const stageDueAt = firstStageSla ? new Date(now.getTime() + (firstStage.slaHours ?? 0) * 60 * 60 * 1000) : null;

  let assignedOwnerUserId: string | null = session.user!.id;
  if (canManageCrm(session as any)) {
    if (ownerUserId === null || ownerUserId === "__unassigned__") {
      assignedOwnerUserId = null;
    } else if (typeof ownerUserId === "string" && ownerUserId.trim()) {
      const allowedIds = await getAllowedResponsibleIds();
      if (!allowedIds.has(ownerUserId)) {
        return NextResponse.json({ error: "Responsável inválido." }, { status: 400 });
      }
      assignedOwnerUserId = ownerUserId;
    }
  }

  const lead = await prisma.lead.create({
    data: {
      leadTypeId,
      stageId: firstStage.id,
      ownerUserId: assignedOwnerUserId,
      name: name.trim(),
      phone: phone.trim(),
      email: (email?.trim() ?? "").length ? email!.trim() : "sem-email@vivant.local",
      source: source?.trim() ?? null,
      origin: null, // interno = "Sistema interno" na UI
      notes: notes?.trim() ?? null,
      status: "ACTIVE",
      stageEnteredAt,
      stageDueAt,
    },
    include: {
      leadType: { select: { key: true, name: true } },
      stage: { select: { name: true, slaHours: true } },
    },
  });

  await trackEvent({
    actorUserId: session.user!.id,
    type: "crm.lead.created",
    entityType: "Lead",
    entityId: lead.id,
    productKey: leadType.key,
    message: `Lead criado: ${lead.name} (${lead.leadType.name})`,
    meta: { leadTypeKey: leadType.key, stageId: firstStage.id, stageName: firstStage.name, ownerUserId: lead.ownerUserId ?? null },
  });

  await closeLeadSlaTasks(lead.id, "CANCELED");

  if (firstStage.slaHours != null && firstStage.slaHours > 0 && lead.ownerUserId) {
    const dueAt = new Date();
    dueAt.setHours(dueAt.getHours() + firstStage.slaHours);
    await createTask({
      title: `1º contato: ${lead.name}`,
      description: `Lead em "${firstStage.name}" (${lead.leadType.name}). SLA: ${firstStage.slaHours}h`,
      dueAt,
      assignedToUserId: lead.ownerUserId,
      relatedEntityType: "Lead",
      relatedEntityId: lead.id,
      productKey: leadType.key,
      priority: "MED",
      meta: { leadId: lead.id, stageId: firstStage.id, leadTypeKey: leadType.key },
    });
  }

  return NextResponse.json(lead, { status: 201 });
}
