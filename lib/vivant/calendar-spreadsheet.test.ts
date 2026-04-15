import { describe, expect, it } from "vitest";
import { letterFromNumeroCota, validateCalendarRows } from "@/lib/vivant/calendar-spreadsheet";

describe("letterFromNumeroCota", () => {
  it("reconhece letra isolada", () => {
    expect(letterFromNumeroCota("A")).toBe("A");
    expect(letterFromNumeroCota("c")).toBe("C");
  });
  it("reconhece Cota X", () => {
    expect(letterFromNumeroCota("Cota B")).toBe("B");
  });
});

describe("validateCalendarRows", () => {
  const header = [
    "Semana",
    "Início (quinta)",
    "Fim (quarta)",
    "Categoria",
    "Evento",
    "Cotas",
  ];
  it("valida uma linha mínima", () => {
    const table = [
      header,
      ["1", "2026-06-04", "2026-06-10", "Gold", "Réveillon", "A"],
    ];
    const r = validateCalendarRows(table, 2026);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.rows).toHaveLength(1);
      expect(r.rows[0].tier).toBe("GOLD");
      expect(r.rows[0].cotaCode).toBe("A");
      expect(r.rows[0].isExtra).toBe(false);
    }
  });
});
