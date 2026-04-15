/**
 * Distribuição de semanas por peso entre cotistas (equilíbrio greedy).
 * Não persiste nada — usado para simulação e para gerar lista de alocações.
 */

export type WeekForDistribution = {
  id: string;
  weight: number;
  isBlocked: boolean;
};

export type CotaRef = { id: string };

export type Assignment = { cotaId: string; propertyCalendarWeekId: string };

export type DistributionMetrics = {
  totalWeight: number;
  idealAverage: number;
  byCota: Array<{
    cotaId: string;
    weekCount: number;
    weightSum: number;
    deltaFromIdeal: number;
  }>;
  maxDelta: number;
};

/** Semanas já alocadas no slot: propertyCalendarWeekId -> cotaId */
export function buildExistingMap(
  allocations: Array<{ propertyCalendarWeekId: string; cotaId: string }>
): Map<string, string> {
  const m = new Map<string, string>();
  for (const a of allocations) {
    m.set(a.propertyCalendarWeekId, a.cotaId);
  }
  return m;
}

/**
 * Atribui cada semana disponível (não bloqueada e ainda sem dono no ciclo)
 * ao cotista com menor soma de peso acumulada (balanceamento por peso).
 */
export function computeBalancedAssignments(
  cotas: CotaRef[],
  weeks: WeekForDistribution[],
  existingWeekToCota: Map<string, string>
): Assignment[] {
  if (cotas.length === 0) return [];

  const available = weeks.filter(
    (w) => !w.isBlocked && !existingWeekToCota.has(w.id)
  );
  const sorted = [...available].sort((a, b) => b.weight - a.weight);

  const totals = new Map<string, number>();
  for (const c of cotas) totals.set(c.id, 0);

  const out: Assignment[] = [];
  for (const w of sorted) {
    let bestId = cotas[0].id;
    let bestTotal = Infinity;
    for (const c of cotas) {
      const t = totals.get(c.id) ?? 0;
      if (t < bestTotal) {
        bestTotal = t;
        bestId = c.id;
      }
    }
    totals.set(bestId, bestTotal + w.weight);
    out.push({ cotaId: bestId, propertyCalendarWeekId: w.id });
  }
  return out;
}

export function computeMetrics(
  cotas: CotaRef[],
  weeksById: Map<string, { weight: number }>,
  assignments: Array<{ cotaId: string; propertyCalendarWeekId: string }>
): DistributionMetrics {
  const byCota = new Map<
    string,
    { weekCount: number; weightSum: number }
  >();
  for (const c of cotas) {
    byCota.set(c.id, { weekCount: 0, weightSum: 0 });
  }

  let totalWeight = 0;
  for (const a of assignments) {
    const w = weeksById.get(a.propertyCalendarWeekId);
    if (!w) continue;
    const cur = byCota.get(a.cotaId);
    if (!cur) continue;
    cur.weekCount += 1;
    cur.weightSum += w.weight;
    totalWeight += w.weight;
  }

  const n = cotas.length;
  const idealAverage = n > 0 ? totalWeight / n : 0;

  const rows: DistributionMetrics["byCota"] = [];
  let maxDelta = 0;
  for (const c of cotas) {
    const cur = byCota.get(c.id)!;
    const delta = cur.weightSum - idealAverage;
    const ad = Math.abs(delta);
    if (ad > maxDelta) maxDelta = ad;
    rows.push({
      cotaId: c.id,
      weekCount: cur.weekCount,
      weightSum: Math.round(cur.weightSum * 10000) / 10000,
      deltaFromIdeal: Math.round(delta * 10000) / 10000,
    });
  }

  return {
    totalWeight: Math.round(totalWeight * 10000) / 10000,
    idealAverage: Math.round(idealAverage * 10000) / 10000,
    byCota: rows,
    maxDelta: Math.round(maxDelta * 10000) / 10000,
  };
}
