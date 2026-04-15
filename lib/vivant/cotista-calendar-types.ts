/** Semana oficial no portal do cotista (dados da API). */
export type CotistaOfficialWeek = {
  id: string;
  weekIndex: number;
  startDate: string;
  endDate: string;
  description?: string | null;
  officialWeekType?: string;
  tier?: string;
  isExtra?: boolean;
  exchangeAllowed?: boolean;
};

export type CotistaWeekReservation = {
  id: string;
  propertyCalendarWeekId: string;
  weekIndex: number;
  year: number;
  dataInicio: string;
  dataFim: string;
  status: string;
  observacoes?: string | null;
};

export type WeekCardStatus =
  | "available"
  | "reserved"
  | "confirmed"
  | "in-use"
  | "past"
  | "not-yours";

export function getOfficialWeekStatus(
  week: CotistaOfficialWeek,
  isMine: boolean,
  reservation: CotistaWeekReservation | undefined,
  now = new Date()
): WeekCardStatus {
  if (!isMine) return "not-yours";

  const end = new Date(week.endDate);
  if (!reservation) {
    return end < now ? "past" : "available";
  }

  if (reservation.status === "NAO_UTILIZADA" || reservation.status === "CANCELADA") {
    return end < now ? "past" : "available";
  }

  if (end < now) {
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
