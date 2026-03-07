import { describe, it, expect } from "vitest";
import { getSlaStatus, parseStageThresholds, getSlaBorderClass, type SlaThresholdEntry } from "../sla";

describe("getSlaStatus", () => {
  const base = {
    slaEnabled: true,
    slaHours: 24,
    thresholds: [] as SlaThresholdEntry[],
  };

  it("retorna NEUTRAL quando SLA desligado ou sem datas", () => {
    expect(
      getSlaStatus({
        ...base,
        stageDueAt: null,
        stageEnteredAt: null,
      }).status
    ).toBe("NEUTRAL");
    expect(
      getSlaStatus({
        ...base,
        slaEnabled: false,
        stageDueAt: new Date(Date.now() + 10000),
        stageEnteredAt: new Date(),
      }).status
    ).toBe("NEUTRAL");
  });

  it("retorna RED quando hoursLeft <= 0 e calcula overdueHours", () => {
    const due = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const result = getSlaStatus({
      ...base,
      stageDueAt: due,
      stageEnteredAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      now: new Date(),
    });
    expect(result.status).toBe("RED");
    expect(result.overdueHours).toBeGreaterThanOrEqual(1.9);
    expect(result.overdueHours).toBeLessThanOrEqual(2.1);
  });

  it("retorna GREEN quando dentro do prazo e sem thresholds", () => {
    const due = new Date(Date.now() + 12 * 60 * 60 * 1000);
    const result = getSlaStatus({
      ...base,
      stageDueAt: due,
      stageEnteredAt: new Date(),
      now: new Date(),
    });
    expect(result.status).toBe("GREEN");
    expect(result.hoursLeft).toBeGreaterThanOrEqual(11.9);
  });

  it("aplica thresholds: YELLOW quando hoursLeft <= 12, ORANGE quando <= 3", () => {
    const thresholds: SlaThresholdEntry[] = [
      { color: "ORANGE", hoursLeft: 3 },
      { color: "YELLOW", hoursLeft: 12 },
    ];
    const due = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const result = getSlaStatus({
      ...base,
      thresholds,
      stageDueAt: due,
      stageEnteredAt: new Date(),
      now: new Date(),
    });
    expect(result.status).toBe("ORANGE");
    const due2 = new Date(Date.now() + 8 * 60 * 60 * 1000);
    const result2 = getSlaStatus({
      ...base,
      thresholds,
      stageDueAt: due2,
      stageEnteredAt: new Date(),
      now: new Date(),
    });
    expect(result2.status).toBe("YELLOW");
    const due3 = new Date(Date.now() + 20 * 60 * 60 * 1000);
    const result3 = getSlaStatus({
      ...base,
      thresholds,
      stageDueAt: due3,
      stageEnteredAt: new Date(),
      now: new Date(),
    });
    expect(result3.status).toBe("GREEN");
  });
});

describe("parseStageThresholds", () => {
  it("retorna array vazio para input inválido", () => {
    expect(parseStageThresholds(null)).toEqual([]);
    expect(parseStageThresholds([])).toEqual([]);
    expect(parseStageThresholds("x")).toEqual([]);
  });

  it("parse e ordena thresholds por hoursLeft", () => {
    const raw = [
      { color: "YELLOW", hoursLeft: 12 },
      { color: "ORANGE", hoursLeft: 3 },
    ];
    const out = parseStageThresholds(raw);
    expect(out[0].hoursLeft).toBe(3);
    expect(out[1].hoursLeft).toBe(12);
  });
});

describe("getSlaBorderClass", () => {
  it("retorna classe de borda para cada status", () => {
    expect(getSlaBorderClass("GREEN")).toContain("green");
    expect(getSlaBorderClass("YELLOW")).toContain("yellow");
    expect(getSlaBorderClass("ORANGE")).toContain("orange");
    expect(getSlaBorderClass("RED")).toContain("red");
    expect(getSlaBorderClass("NEUTRAL")).toContain("gray");
  });
});
