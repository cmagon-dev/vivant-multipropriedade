import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** GET — métricas CRM: por tipo, gargalos, vendedores (sempre dados atualizados) */
export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const isOwner =
    (session.user as { roleKey?: string }).roleKey === "OWNER" ||
    (session.user as { roleKey?: string }).roleKey === "SUPER_ADMIN";
  const canManage = hasPermission(session as any, "crm.manage");
  const canViewComercial = hasPermission(session as any, "comercial.view");
  if (!isOwner && !canManage && !canViewComercial) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const [byType, byStage, byOwner, byLossReason] = await Promise.all([
    prisma.lead.groupBy({
      by: ["leadTypeId", "status"],
      where: { status: { in: ["ACTIVE", "WON", "LOST"] } },
      _count: { id: true },
    }),
    prisma.lead.groupBy({
      by: ["stageId"],
      where: { status: "ACTIVE" },
      _count: { id: true },
    }),
    prisma.lead.groupBy({
      by: ["ownerUserId"],
      where: { status: "WON" },
      _count: { id: true },
    }),
    prisma.lead.groupBy({
      by: ["lossReasonId"],
      where: { status: "LOST" },
      _count: { id: true },
    }),
  ]);

  const types = await prisma.leadType.findMany({
    select: { id: true, key: true, name: true },
    orderBy: { order: "asc" },
  });
  const lossReasons = await prisma.leadLossReason.findMany({
    select: { id: true, name: true, leadTypeId: true },
    orderBy: [{ leadTypeId: "asc" }, { order: "asc" }],
  });
  const lossReasonMap = new Map(lossReasons.map((r) => [r.id, r]));
  const stages = await prisma.leadStage.findMany({
    select: { id: true, name: true, order: true, leadTypeId: true },
    orderBy: [{ leadTypeId: "asc" }, { order: "asc" }],
  });
  const owners = await prisma.user.findMany({
    where: {
      id: {
        in: Array.from(
          new Set(
            byOwner
              .map((o) => o.ownerUserId)
              .filter((id): id is string => !!id)
          )
        ),
      },
    },
    select: { id: true, name: true, email: true },
  });

  const typeMap = new Map(types.map((t) => [t.id, t]));
  const stageMap = new Map(stages.map((s) => [s.id, s]));
  const ownerMap = new Map(owners.map((o) => [o.id, o]));

  const metricsByType = types.map((t) => {
    const active = byType.filter((x) => x.leadTypeId === t.id && x.status === "ACTIVE").reduce((s, x) => s + x._count.id, 0);
    const won = byType.filter((x) => x.leadTypeId === t.id && x.status === "WON").reduce((s, x) => s + x._count.id, 0);
    const lost = byType.filter((x) => x.leadTypeId === t.id && x.status === "LOST").reduce((s, x) => s + x._count.id, 0);
    return { leadTypeId: t.id, key: t.key, name: t.name, active, won, lost };
  });

  const bottleneck = byStage
    .map((s) => ({ stageId: s.stageId, count: s._count.id, stage: stageMap.get(s.stageId) }))
    .filter((x) => x.stage)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const ranking = byOwner
    .map((o) => ({
      ownerUserId: o.ownerUserId,
      won: o._count.id,
      owner: o.ownerUserId ? ownerMap.get(o.ownerUserId) : null,
    }))
    .filter((x) => x.owner)
    .sort((a, b) => b.won - a.won);

  const lossesByReason = byLossReason
    .filter((x) => x.lossReasonId != null)
    .map((x) => ({
      lossReasonId: x.lossReasonId!,
      count: x._count.id,
      reason: lossReasonMap.get(x.lossReasonId!),
    }))
    .filter((x) => x.reason)
    .sort((a, b) => b.count - a.count);

  return NextResponse.json({
    byType: metricsByType,
    bottleneck,
    ranking,
    lossesByReason,
  });
}
