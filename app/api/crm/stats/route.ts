import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { hasPermission } from "@/lib/auth/permissions";
import { prisma } from "@/lib/prisma";

/** GET — estatísticas do comercial (próprios leads): ativos, ganhos no mês, perdidos, tarefas em atraso */
export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  if (!hasPermission(session as any, "comercial.view")) return NextResponse.json({ error: "Acesso negado" }, { status: 403 });

  const userId = session.user!.id;
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const now = new Date();

  const [activeCount, wonThisMonth, lostThisMonth, overdueTaskCount] = await Promise.all([
    prisma.lead.count({ where: { ownerUserId: userId, status: "ACTIVE" } }),
    prisma.lead.count({
      where: {
        ownerUserId: userId,
        status: "WON",
        updatedAt: { gte: startOfMonth },
      },
    }),
    prisma.lead.count({
      where: {
        ownerUserId: userId,
        status: "LOST",
        updatedAt: { gte: startOfMonth },
      },
    }),
    prisma.systemTask.count({
      where: {
        assignedToUserId: userId,
        status: "OPEN",
        dueAt: { lt: now },
      },
    }),
  ]);

  return NextResponse.json({
    activeCount,
    wonThisMonth,
    lostThisMonth,
    overdueTaskCount,
  });
}
