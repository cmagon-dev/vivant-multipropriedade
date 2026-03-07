import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const canView =
  (s: { user?: { id?: string }; permissions?: string[]; roleKey?: string }) =>
    (s.user as { roleKey?: string })?.roleKey === "OWNER" ||
    (s.user as { roleKey?: string })?.roleKey === "SUPER_ADMIN" ||
    (s.user as { permissions?: string[] })?.permissions?.includes("sla.manage") ||
    (s.user as { permissions?: string[] })?.permissions?.includes("crm.manage") ||
    (s.user as { permissions?: string[] })?.permissions?.includes("tasks.view");

/** GET — leads atrasados agora + contagem de SLA_BREACHED na semana (sla.manage ou crm.manage ou tasks.view) */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!canView(session as any)) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const ownerUserId = searchParams.get("ownerUserId") ?? undefined;
  const stageId = searchParams.get("stageId") ?? undefined;
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "10", 10) || 10, 50);

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  startOfWeek.setHours(0, 0, 0, 0);

  const whereOverdueBase: Prisma.LeadWhereInput = {
    status: "ACTIVE",
  };
  if (ownerUserId) whereOverdueBase.ownerUserId = ownerUserId;
  if (stageId) whereOverdueBase.stageId = stageId;

  const [overdueCount, overdueLeads, breachedThisWeek] = await Promise.all([
    prisma.lead.count({
      where: {
        ...whereOverdueBase,
        stageDueAt: { lt: now, not: null },
        stageEnteredAt: { not: null },
      },
    }),
    prisma.lead.findMany({
      where: {
        ...whereOverdueBase,
        stageDueAt: { lt: now, not: null },
        stageEnteredAt: { not: null },
      },
      select: {
        id: true,
        name: true,
        stageDueAt: true,
        stage: { select: { name: true } },
        owner: { select: { name: true } },
      },
      orderBy: { stageDueAt: "asc" },
      take: limit,
    }),
    prisma.leadSlaEvent.count({
      where: { type: "SLA_BREACHED", createdAt: { gte: startOfWeek } },
    }),
  ]);

  const overdueLeadsWithHours = overdueLeads.map((l) => ({
    id: l.id,
    name: l.name,
    stageName: l.stage?.name,
    ownerName: l.owner?.name,
    overdueHours: l.stageDueAt
      ? Math.round((now.getTime() - new Date(l.stageDueAt).getTime()) / (1000 * 60 * 60))
      : 0,
  }));

  return NextResponse.json({
    overdueCount,
    overdueLeads: overdueLeadsWithHours,
    breachedThisWeek,
  });
}
