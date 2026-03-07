import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/telemetry/trackEvent";
import { createTask } from "@/lib/telemetry/createTask";
import { normalizePhoneToE164BR } from "@/lib/crm/whatsapp";
import { checkRateLimit } from "@/lib/public/rateLimit";

const LEAD_TYPE_KEYS = ["IMOVEL", "INVESTIDOR", "COTISTA", "MODELO"] as const;

function validatePhoneBR(phone: string): { ok: boolean; digits?: string; error?: string } {
  const digits = phone.replace(/\D/g, "");
  const len = digits.startsWith("55") ? digits.length - 2 : digits.length;
  if (len < 10 || len > 11) return { ok: false, error: "Informe um WhatsApp válido (DDD + número, 10 ou 11 dígitos)." };
  return { ok: true, digits: digits.startsWith("55") ? digits : "55" + digits };
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.trim() ?? "");
}

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(request);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Tente novamente em alguns minutos." },
      { status: 429, headers: rate.retryAfter ? { "Retry-After": String(rate.retryAfter) } : undefined }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const {
    leadTypeKey,
    name,
    phone,
    email,
    city,
    message,
    origin: originRaw,
    vendedorUserId,
    utm,
  } = body as {
    leadTypeKey?: string;
    name?: string;
    phone?: string;
    email?: string;
    city?: string;
    message?: string;
    origin?: string;
    vendedorUserId?: string;
    utm?: { utm_source?: string; utm_medium?: string; utm_campaign?: string };
  };

  const ORIGIN_VALID = ["Google", "Instagram", "Indicação", "Corretor", "Evento", "Outro"] as const;
  const originStr = originRaw?.trim();
  const origin =
    originStr && ORIGIN_VALID.includes(originStr as (typeof ORIGIN_VALID)[number])
      ? originStr
      : originStr && originStr.length <= 50
        ? originStr
        : null;

  if (!leadTypeKey || !LEAD_TYPE_KEYS.includes(leadTypeKey as (typeof LEAD_TYPE_KEYS)[number])) {
    return NextResponse.json({ error: "Tipo de interesse inválido." }, { status: 400 });
  }
  const nameStr = name?.trim() ?? "";
  if (nameStr.length < 2) {
    return NextResponse.json({ error: "Nome deve ter pelo menos 2 caracteres." }, { status: 400 });
  }
  const phoneStr = phone?.trim() ?? "";
  const phoneCheck = validatePhoneBR(phoneStr);
  if (!phoneCheck.ok) {
    return NextResponse.json({ error: phoneCheck.error }, { status: 400 });
  }
  const emailStr = email?.trim() ?? "";
  if (!validateEmail(emailStr)) {
    return NextResponse.json({ error: "Informe um e-mail válido." }, { status: 400 });
  }
  const cityStr = city?.trim() ?? "";
  if (cityStr.length < 2) {
    return NextResponse.json({ error: "Cidade deve ter pelo menos 2 caracteres." }, { status: 400 });
  }
  const messageStr = message?.trim() ?? "";
  if (messageStr.length < 10) {
    return NextResponse.json({ error: "Conte um pouco mais (mínimo 10 caracteres)." }, { status: 400 });
  }
  if (messageStr.length > 500) {
    return NextResponse.json({ error: "Mensagem deve ter no máximo 500 caracteres." }, { status: 400 });
  }

  const leadType = await prisma.leadType.findUnique({
    where: { key: leadTypeKey },
    include: { initialStage: true },
  });

  if (!leadType) {
    console.error("[POST /api/public/lead] LeadType não encontrado.", { leadTypeKey });
    return NextResponse.json({ error: "Tipo inválido." }, { status: 400 });
  }
  if (!leadType.isActive) {
    console.error("[POST /api/public/lead] LeadType inativo.", { leadTypeKey, leadTypeId: leadType.id });
    return NextResponse.json({ error: "Tipo de interesse não disponível." }, { status: 400 });
  }

  const firstStage =
    leadType.initialStageId && leadType.initialStage && leadType.initialStage.isActive
      ? leadType.initialStage
      : await prisma.leadStage.findFirst({
          where: { leadTypeId: leadType.id, isActive: true },
          orderBy: { order: "asc" },
        });

  if (!firstStage) {
    console.error("[POST /api/public/lead] Nenhuma etapa ativa no funil.", {
      leadTypeKey,
      leadTypeId: leadType.id,
    });
    return NextResponse.json({ error: "Funil sem etapas ativas." }, { status: 500 });
  }

  let ownerUserId: string | null = null;

  if (vendedorUserId) {
    const user = await prisma.user.findUnique({
      where: { id: vendedorUserId },
      include: { userRoleAssignments: { include: { role: true } } },
    });
    const hasComercialOrOwner =
      user?.userRoleAssignments?.some(
        (a) =>
          a.role.key === "COMMERCIAL" || a.role.key === "OWNER" || a.role.key === "SUPER_ADMIN"
      ) ?? false;
    let hasPermission = false;
    if (user) {
      const perms = await prisma.userPermission.findMany({
        where: { userId: user.id },
        include: { permission: true },
      });
      hasPermission = perms.some((u) => u.permission.key === "comercial.view");
    }
    if (user && (hasComercialOrOwner || hasPermission)) {
      ownerUserId = user.id;
    }
  }

  if (ownerUserId === null) {
    const assignment = await prisma.leadTypeAssignment.findUnique({
      where: { leadTypeId: leadType.id },
    });
    if (assignment?.isActive && assignment.defaultOwnerUserId) {
      const defaultUser = await prisma.user.findUnique({
        where: { id: assignment.defaultOwnerUserId },
        select: { id: true, active: true },
      });
      if (defaultUser?.active) ownerUserId = defaultUser.id;
    }
  }

  if (ownerUserId === null) {
    const commercial = await prisma.user.findFirst({
      where: {
        userRoleAssignments: { some: { role: { key: "COMMERCIAL" } } },
        active: true,
      },
      select: { id: true },
    });
    if (commercial) {
      ownerUserId = commercial.id;
    }
  }

  if (ownerUserId === null) {
    const owner = await prisma.user.findFirst({
      where: {
        userRoleAssignments: { some: { role: { key: "OWNER" } } },
        active: true,
      },
      select: { id: true },
    });
    if (owner) {
      ownerUserId = owner.id;
    }
  }

  if (ownerUserId === null) {
    const anyAdmin = await prisma.user.findFirst({
      where: {
        userRoleAssignments: { some: {} },
        active: true,
      },
      select: { id: true },
    });
    if (anyAdmin) {
      ownerUserId = anyAdmin.id;
    }
  }

  if (ownerUserId === null) {
    console.error("[POST /api/public/lead] Nenhum usuário para atribuir o lead.", {
      leadTypeKey,
      vendedorUserId: vendedorUserId ?? null,
    });
    return NextResponse.json({ error: "Sem vendedor configurado." }, { status: 500 });
  }

  console.error("[POST /api/public/lead] Contexto.", {
    leadTypeKey,
    leadTypeId: leadType.id,
    initialStageId: firstStage.id,
    initialStageName: firstStage.name,
    selectedOwner: ownerUserId,
  });

  const phoneE164 = normalizePhoneToE164BR(phoneStr);
  const sourceParts: string[] = [];
  if (utm?.utm_source) sourceParts.push(utm.utm_source);
  if (utm?.utm_medium) sourceParts.push(utm.utm_medium);
  if (utm?.utm_campaign) sourceParts.push(utm.utm_campaign);
  const source = sourceParts.length ? sourceParts.join(" / ") : "Public Form";

  const now = new Date();
  const firstStageSla = (firstStage as { slaEnabled?: boolean }).slaEnabled !== false && (firstStage.slaHours ?? 0) > 0 && !firstStage.isFinal;
  const stageEnteredAt = now;
  const stageDueAt = firstStageSla ? new Date(now.getTime() + (firstStage.slaHours ?? 0) * 60 * 60 * 1000) : null;

  try {
    const lead = await prisma.lead.create({
      data: {
        leadTypeId: leadType.id,
        stageId: firstStage.id,
        ownerUserId,
        name: nameStr,
        phone: phoneE164,
        email: emailStr,
        city: cityStr || null,
        source,
        origin: origin ?? null,
        notes: null,
        status: "ACTIVE",
        stageEnteredAt,
        stageDueAt,
      },
      include: { leadType: true, stage: true },
    });

    await prisma.leadActivity.create({
      data: {
        leadId: lead.id,
        actorUserId: ownerUserId,
        type: "NOTE",
        message: `[Formulário público] Cidade: ${cityStr}. Me conta: ${messageStr}`,
        meta: { publicCapture: true, utm: utm ?? null },
      },
    });

    await trackEvent({
      actorUserId: null,
      type: "crm.lead.public.created",
      entityType: "Lead",
      entityId: lead.id,
      productKey: leadType.key,
      message: `Lead captado: ${lead.name} (${leadType.key})`,
      meta: {
        leadTypeKey: leadType.key,
        vendedorUserId: vendedorUserId ?? null,
        utm: utm ?? null,
        city: cityStr,
        emailProvided: true,
      },
    });

    if (firstStage.slaHours != null && firstStage.slaHours > 0) {
      const dueAt = new Date();
      dueAt.setHours(dueAt.getHours() + firstStage.slaHours);
      await createTask({
        title: "Fazer 1º contato",
        description: `Lead público: ${lead.name} (${lead.leadType.name}). SLA: ${firstStage.slaHours}h`,
        dueAt,
        assignedToUserId: ownerUserId,
        relatedEntityType: "Lead",
        relatedEntityId: lead.id,
        productKey: leadType.key,
        priority: firstStage.slaHours <= 2 ? "HIGH" : "MED",
        meta: { leadId: lead.id, stageId: firstStage.id, publicCapture: true },
      });
    }

    return NextResponse.json({ ok: true, leadId: lead.id }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/public/lead] Erro ao criar lead.", {
      leadTypeKey,
      leadTypeId: leadType.id,
      initialStageId: firstStage.id,
      selectedOwner: ownerUserId,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json(
      { error: "Erro ao registrar lead. Tente novamente em instantes." },
      { status: 500 }
    );
  }
}
