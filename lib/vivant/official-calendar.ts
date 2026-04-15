import { prisma } from "@/lib/prisma";
import type { CalendarYearStatus, OfficialWeekType, WeekTier } from "@prisma/client";

/** Garante um registro de ano civil para a propriedade (rascunho por padrão). */
export async function getOrCreateCalendarYear(
  propertyId: string,
  year: number,
  status: CalendarYearStatus = "DRAFT"
) {
  return prisma.propertyCalendarYear.upsert({
    where: {
      propertyId_year: { propertyId, year },
    },
    create: { propertyId, year, status },
    update: {},
  });
}

export type GenerateWeekDefaults = {
  officialWeekType?: OfficialWeekType;
  tier?: WeekTier;
  isExtra?: boolean;
};

/** Gera grid quinta → quarta (até 53 semanas no ano civil). */
export async function generateThuToWedWeeks(
  propertyId: string,
  year: number,
  defaults: GenerateWeekDefaults = {}
) {
  const officialWeekType = defaults.officialWeekType ?? "TYPE_1";
  const tier = defaults.tier ?? "SILVER";
  const isExtra = defaults.isExtra ?? false;

  const calYear = await getOrCreateCalendarYear(propertyId, year, "DRAFT");

  const weight = 1;
  let d = new Date(year, 0, 1);
  while (d.getDay() !== 4) {
    d.setDate(d.getDate() + 1);
  }
  let idx = 1;
  while (d.getFullYear() === year && idx <= 53) {
    const start = new Date(d);
    const end = new Date(d);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    await prisma.propertyCalendarWeek.upsert({
      where: {
        propertyCalendarYearId_weekIndex: {
          propertyCalendarYearId: calYear.id,
          weekIndex: idx,
        },
      },
      create: {
        propertyCalendarYearId: calYear.id,
        weekIndex: idx,
        startDate: start,
        endDate: end,
        description: `Semana ${String(idx).padStart(2, "0")}`,
        officialWeekType,
        tier,
        isExtra,
        exchangeAllowed: true,
        isBlocked: false,
        weight,
      },
      update: {
        startDate: start,
        endDate: end,
        weight,
      },
    });
    d.setDate(d.getDate() + 7);
    idx += 1;
  }

  const weeks = await prisma.propertyCalendarWeek.findMany({
    where: { propertyCalendarYearId: calYear.id },
    orderBy: { weekIndex: "asc" },
  });

  return { calendarYear: calYear, weeks };
}
