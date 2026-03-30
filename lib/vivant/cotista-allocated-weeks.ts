import { prisma } from "@/lib/prisma";

export type AllocatedWeekSummary = {
  id: string;
  label: string | null;
  weekIndex: number;
  startDate: string;
  endDate: string;
  year: number;
};

/**
 * Semanas já alocadas às cotas no planejamento (ciclo), para o ano civil informado.
 */
export async function allocatedWeeksByCotaId(
  cotaIds: string[],
  year: number
): Promise<Map<string, AllocatedWeekSummary[]>> {
  const map = new Map<string, AllocatedWeekSummary[]>();
  if (cotaIds.length === 0) return map;
  for (const id of cotaIds) map.set(id, []);

  const rows = await prisma.propertyWeekAllocation.findMany({
    where: {
      cotaId: { in: cotaIds },
      propertyWeek: { year },
    },
    include: {
      propertyWeek: {
        select: {
          id: true,
          label: true,
          weekIndex: true,
          startDate: true,
          endDate: true,
          year: true,
        },
      },
    },
    orderBy: { propertyWeek: { startDate: "asc" } },
  });

  for (const r of rows) {
    const w = r.propertyWeek;
    const list = map.get(r.cotaId) ?? [];
    list.push({
      id: w.id,
      label: w.label,
      weekIndex: w.weekIndex,
      startDate: w.startDate.toISOString(),
      endDate: w.endDate.toISOString(),
      year: w.year,
    });
    map.set(r.cotaId, list);
  }
  return map;
}
