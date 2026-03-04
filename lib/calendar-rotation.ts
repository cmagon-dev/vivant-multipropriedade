import { startOfYear, addWeeks, format, getWeek } from "date-fns";

export interface WeekRotationConfig {
  baseYear: number;
  weeks: number[];
  rotationOffset?: number;
}

export interface WeekInfo {
  number: number;
  startDate: Date;
  endDate: Date;
  year: number;
  formatted: string;
}

export function calculateWeeksForYear(
  config: WeekRotationConfig,
  targetYear: number
): number[] {
  const offset = config.rotationOffset || 1;
  const yearsDiff = targetYear - config.baseYear;
  const totalOffset = yearsDiff * offset;
  
  return config.weeks.map(weekNum => {
    let newWeek = weekNum + totalOffset;
    
    while (newWeek > 52) {
      newWeek -= 52;
    }
    while (newWeek < 1) {
      newWeek += 52;
    }
    
    return newWeek;
  });
}

export function getWeekInfo(year: number, weekNumber: number): WeekInfo {
  const yearStart = startOfYear(new Date(year, 0, 1));
  
  const weekStart = addWeeks(yearStart, weekNumber - 1);
  const weekEnd = addWeeks(weekStart, 1);
  weekEnd.setDate(weekEnd.getDate() - 1);
  
  return {
    number: weekNumber,
    startDate: weekStart,
    endDate: weekEnd,
    year,
    formatted: `Semana ${weekNumber} - ${format(weekStart, "dd/MM")} a ${format(weekEnd, "dd/MM/yyyy")}`
  };
}

export function getAllWeeksForYear(year: number): WeekInfo[] {
  const weeks: WeekInfo[] = [];
  
  for (let i = 1; i <= 52; i++) {
    weeks.push(getWeekInfo(year, i));
  }
  
  return weeks;
}

export function isWeekAvailable(
  weekNumber: number,
  cotaWeeks: number[],
  reservations: any[]
): boolean {
  if (!cotaWeeks.includes(weekNumber)) {
    return false;
  }
  
  const isReserved = reservations.some(
    res => res.numeroSemana === weekNumber && 
    res.status !== "CANCELADA" && 
    res.status !== "NAO_UTILIZADA"
  );
  
  return !isReserved;
}

export function getWeekStatus(
  weekNumber: number,
  cotaWeeks: number[],
  reservations: any[]
): "available" | "reserved" | "confirmed" | "in-use" | "past" | "not-yours" {
  if (!cotaWeeks.includes(weekNumber)) {
    return "not-yours";
  }
  
  const reservation = reservations.find(res => res.numeroSemana === weekNumber);
  
  if (!reservation) {
    return "available";
  }
  
  const now = new Date();
  const weekEnd = new Date(reservation.dataFim);
  
  if (weekEnd < now) {
    return "past";
  }
  
  switch (reservation.status) {
    case "CONFIRMADA":
      return "confirmed";
    case "EM_USO":
      return "in-use";
    case "PENDENTE":
      return "reserved";
    default:
      return "reserved";
  }
}

export interface CotaWithWeeks {
  id: string;
  semanasConfig: WeekRotationConfig;
  semanasAno: number;
}

export function generateYearlyCalendar(
  cotas: CotaWithWeeks[],
  year: number
): Map<string, number[]> {
  const cotaWeeksMap = new Map<string, number[]>();
  
  cotas.forEach(cota => {
    const weeks = calculateWeeksForYear(cota.semanasConfig, year);
    cotaWeeksMap.set(cota.id, weeks);
  });
  
  return cotaWeeksMap;
}

export function getNextAvailableWeek(
  cotaWeeks: number[],
  reservations: any[],
  currentYear: number
): WeekInfo | null {
  const currentWeek = getWeek(new Date());
  
  const availableWeek = cotaWeeks.find(weekNum => 
    weekNum >= currentWeek && 
    isWeekAvailable(weekNum, cotaWeeks, reservations)
  );
  
  if (availableWeek) {
    return getWeekInfo(currentYear, availableWeek);
  }
  
  const nextYearWeeks = calculateWeeksForYear(
    { baseYear: currentYear, weeks: cotaWeeks },
    currentYear + 1
  );
  
  if (nextYearWeeks.length > 0) {
    return getWeekInfo(currentYear + 1, nextYearWeeks[0]);
  }
  
  return null;
}
