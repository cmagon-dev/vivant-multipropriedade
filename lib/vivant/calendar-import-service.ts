import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import type { ParsedCalendarRow } from "@/lib/vivant/calendar-spreadsheet";
import {
  CALENDAR_IMPORT_SLOT_LABEL,
  letterFromNumeroCota,
} from "@/lib/vivant/calendar-spreadsheet";

export type ApplyCalendarImportResult = {
  calendarYearId: string;
  weeksCreated: number;
  weeksUpdated: number;
  assignmentsCreated: number;
  extrasCount: number;
  cotasAutoCreated: number;
  published: boolean;
};

async function deleteExchangeDataForWeeks(
  tx: Prisma.TransactionClient,
  weekIds: string[]
) {
  if (!weekIds.length) return;
  await tx.weekExchangePeerInterest.deleteMany({
    where: { offeredCalendarWeekId: { in: weekIds } },
  });
  await tx.weekExchangeRequest.deleteMany({
    where: {
      OR: [
        { ownedCalendarWeekId: { in: weekIds } },
        { desiredCalendarWeekId: { in: weekIds } },
      ],
    },
  });
}

async function removeCalendarYearIfExists(
  tx: Prisma.TransactionClient,
  propertyId: string,
  year: number
) {
  const cy = await tx.propertyCalendarYear.findUnique({
    where: { propertyId_year: { propertyId, year } },
    select: { id: true },
  });
  if (!cy) return;
  const weeks = await tx.propertyCalendarWeek.findMany({
    where: { propertyCalendarYearId: cy.id },
    select: { id: true },
  });
  const weekIds = weeks.map((w) => w.id);
  await deleteExchangeDataForWeeks(tx, weekIds);
  await tx.propertyCalendarYear.delete({ where: { id: cy.id } });
}

/**
 * Remove o PropertyCalendarYear (cascade: semanas, slots, assignments, reservas).
 * Trocas que referenciam semanas deste ano são removidas antes (FK Restrict).
 */
export async function deletePropertyCalendarYearByYear(
  propertyId: string,
  year: number
): Promise<{ deleted: boolean }> {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.propertyCalendarYear.findUnique({
      where: { propertyId_year: { propertyId, year } },
      select: { id: true },
    });
    if (!existing) return { deleted: false };
    await removeCalendarYearIfExists(tx, propertyId, year);
    return { deleted: true };
  });
}

async function getOrCreatePlaceholderCotista(
  tx: Prisma.TransactionClient,
  propertyId: string
) {
  const email = `import.cotas.${propertyId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 40)}@placeholder.vivant.local`;
  const existing = await tx.cotista.findUnique({ where: { email } });
  if (existing) return existing;

  for (let attempt = 0; attempt < 20; attempt++) {
    const digits = Array.from({ length: 11 }, () =>
      Math.floor(Math.random() * 10).toString()
    ).join("");
    try {
      return await tx.cotista.create({
        data: {
          name: "Disponível (importação calendário)",
          email,
          cpf: digits,
          password: await bcrypt.hash(randomBytes(24).toString("hex"), 10),
          active: false,
        },
      });
    } catch {
      /* cpf collision — retry */
    }
  }
  throw new Error("Não foi possível criar cotista placeholder para novas cotas.");
}

async function ensureCotasForLetters(
  tx: Prisma.TransactionClient,
  propertyId: string,
  letters: string[],
  placeholderCotistaId: string
): Promise<{ map: Map<string, string>; created: number }> {
  const prop = await tx.property.findUnique({
    where: { id: propertyId },
    include: { cotas: true },
  });
  if (!prop) throw new Error("Propriedade não encontrada");

  const map = new Map<string, string>();
  let created = 0;

  for (const c of prop.cotas) {
    const L = letterFromNumeroCota(c.numeroCota);
    if (L && letters.includes(L) && !map.has(L)) {
      map.set(L, c.id);
    }
  }

  for (const letter of letters) {
    if (map.has(letter)) continue;
    const novo = await tx.cotaPropriedade.create({
      data: {
        propertyId,
        cotistaId: placeholderCotistaId,
        numeroCota: letter,
        percentualCota: 0,
        semanasAno: 8,
        ativo: true,
      },
    });
    map.set(letter, novo.id);
    created += 1;
  }

  const total = await tx.cotaPropriedade.count({ where: { propertyId } });
  const needTotal = Math.max(prop.totalCotas ?? 0, total);
  if (needTotal !== prop.totalCotas) {
    await tx.property.update({
      where: { id: propertyId },
      data: { totalCotas: needTotal },
    });
  }

  return { map, created };
}

async function getOrCreateImportSlot(
  tx: Prisma.TransactionClient,
  propertyCalendarYearId: string
) {
  const found = await tx.calendarDistributionSlot.findFirst({
    where: { propertyCalendarYearId, label: CALENDAR_IMPORT_SLOT_LABEL },
  });
  if (found) return found;
  return tx.calendarDistributionSlot.create({
    data: {
      propertyCalendarYearId,
      label: CALENDAR_IMPORT_SLOT_LABEL,
      status: "IMPORTADO",
    },
  });
}

export async function applyCalendarImport(input: {
  propertyId: string;
  year: number;
  rows: ParsedCalendarRow[];
  mode: "replace" | "merge";
  publish: boolean;
}): Promise<ApplyCalendarImportResult> {
  const { propertyId, year, rows, mode, publish } = input;

  return prisma.$transaction(async (tx) => {
    const prop = await tx.property.findUnique({ where: { id: propertyId } });
    if (!prop) throw new Error("Propriedade não encontrada");

    const lettersNeeded = Array.from(
      new Set(rows.filter((r) => !r.isExtra).map((r) => r.cotaCode as string))
    ).filter((x) => x !== "EXTRA");

    const placeholder = await getOrCreatePlaceholderCotista(tx, propertyId);
    const { map: cotaByLetter, created: cotasAutoCreated } =
      await ensureCotasForLetters(tx, propertyId, lettersNeeded, placeholder.id);

    if (mode === "replace") {
      await removeCalendarYearIfExists(tx, propertyId, year);
    }

    let calYear = await tx.propertyCalendarYear.findUnique({
      where: { propertyId_year: { propertyId, year } },
    });
    if (!calYear) {
      calYear = await tx.propertyCalendarYear.create({
        data: {
          propertyId,
          year,
          status: publish ? "PUBLISHED" : "DRAFT",
          label: `Importado ${year}`,
        },
      });
    } else if (publish && calYear.status !== "PUBLISHED") {
      calYear = await tx.propertyCalendarYear.update({
        where: { id: calYear.id },
        data: { status: "PUBLISHED" },
      });
    }

    let weeksCreated = 0;
    let weeksUpdated = 0;

    for (const row of rows) {
      const existing = await tx.propertyCalendarWeek.findUnique({
        where: {
          propertyCalendarYearId_weekIndex: {
            propertyCalendarYearId: calYear.id,
            weekIndex: row.weekIndex,
          },
        },
      });
      await tx.propertyCalendarWeek.upsert({
        where: {
          propertyCalendarYearId_weekIndex: {
            propertyCalendarYearId: calYear.id,
            weekIndex: row.weekIndex,
          },
        },
        create: {
          propertyCalendarYearId: calYear.id,
          weekIndex: row.weekIndex,
          startDate: new Date(row.startDate),
          endDate: new Date(row.endDate),
          description: row.description,
          officialWeekType: row.officialWeekType,
          tier: row.tier,
          isExtra: row.isExtra,
          exchangeAllowed: true,
          isBlocked: false,
          weight: new Prisma.Decimal(1),
          notes: row.lastUseNote,
        },
        update: {
          startDate: new Date(row.startDate),
          endDate: new Date(row.endDate),
          description: row.description,
          officialWeekType: row.officialWeekType,
          tier: row.tier,
          isExtra: row.isExtra,
          exchangeAllowed: true,
          notes: row.lastUseNote,
        },
      });
      if (existing) weeksUpdated += 1;
      else weeksCreated += 1;
    }

    const slot = await getOrCreateImportSlot(tx, calYear.id);

    await tx.propertyWeekAssignment.deleteMany({
      where: { distributionSlotId: slot.id },
    });

    let assignmentsCreated = 0;
    const extrasCount = rows.filter((r) => r.isExtra).length;

    for (const row of rows) {
      if (row.isExtra) continue;
      const cotaId = cotaByLetter.get(row.cotaCode as string);
      if (!cotaId) continue;

      const week = await tx.propertyCalendarWeek.findUnique({
        where: {
          propertyCalendarYearId_weekIndex: {
            propertyCalendarYearId: calYear.id,
            weekIndex: row.weekIndex,
          },
        },
        select: { id: true },
      });
      if (!week) continue;

      await tx.propertyWeekAssignment.create({
        data: {
          distributionSlotId: slot.id,
          cotaId,
          propertyCalendarWeekId: week.id,
        },
      });
      assignmentsCreated += 1;
    }

    let final = calYear;
    if (publish && calYear.status !== "PUBLISHED") {
      final = await tx.propertyCalendarYear.update({
        where: { id: calYear.id },
        data: { status: "PUBLISHED" },
      });
    }

    return {
      calendarYearId: calYear.id,
      weeksCreated,
      weeksUpdated,
      assignmentsCreated,
      extrasCount,
      cotasAutoCreated,
      published: final.status === "PUBLISHED",
    };
  });
}
