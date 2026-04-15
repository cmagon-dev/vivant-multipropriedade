import { prisma } from "@/lib/prisma";

export type AllocatedWeekSummary = {
  id: string;
  description: string | null;
  weekIndex: number;
  startDate: string;
  endDate: string;
  year: number;
  officialWeekType: string;
  tier: string;
  isExtra: boolean;
  exchangeAllowed: boolean;
};

/**
 * Semanas oficiais alocadas às cotas (slots de distribuição) para o ano civil,
 * apenas se o calendário do ano estiver publicado.
 */
export async function allocatedWeeksByCotaId(
  cotaIds: string[],
  year: number
): Promise<Map<string, AllocatedWeekSummary[]>> {
  const map = new Map<string, AllocatedWeekSummary[]>();
  if (cotaIds.length === 0) return map;
  for (const id of cotaIds) map.set(id, []);

  const rows = await prisma.propertyWeekAssignment.findMany({
    where: {
      cotaId: { in: cotaIds },
      distributionSlot: {
        calendarYear: {
          year,
          status: "PUBLISHED",
        },
      },
    },
    include: {
      calendarWeek: {
        select: {
          id: true,
          description: true,
          weekIndex: true,
          startDate: true,
          endDate: true,
          officialWeekType: true,
          tier: true,
          isExtra: true,
          exchangeAllowed: true,
          calendarYear: { select: { year: true } },
        },
      },
    },
    orderBy: { calendarWeek: { startDate: "asc" } },
  });

  for (const r of rows) {
    const w = r.calendarWeek;
    const list = map.get(r.cotaId) ?? [];
    list.push({
      id: w.id,
      description: w.description,
      weekIndex: w.weekIndex,
      startDate: w.startDate.toISOString(),
      endDate: w.endDate.toISOString(),
      year: w.calendarYear.year,
      officialWeekType: w.officialWeekType,
      tier: w.tier,
      isExtra: w.isExtra,
      exchangeAllowed: w.exchangeAllowed,
    });
    map.set(r.cotaId, list);
  }
  return map;
}
