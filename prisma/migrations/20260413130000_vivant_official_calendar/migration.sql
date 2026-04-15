-- Vivant: calendário oficial anual + week_reservations + trocas por semana oficial
-- Remove modelos legados: reservas (ano/numeroSemana), property_weeks, trocas_semanas, semanasConfig

-- Ordem: dependentes primeiro
DROP TABLE IF EXISTS "week_exchange_event_logs" CASCADE;
DROP TABLE IF EXISTS "week_exchange_peer_interests" CASCADE;
DROP TABLE IF EXISTS "week_exchange_requests" CASCADE;
DROP TABLE IF EXISTS "property_week_allocations" CASCADE;
DROP TABLE IF EXISTS "property_allocation_cycles" CASCADE;
DROP TABLE IF EXISTS "property_weeks" CASCADE;
DROP TABLE IF EXISTS "reservas" CASCADE;
DROP TABLE IF EXISTS "trocas_semanas" CASCADE;

-- Check-in: deixa de referenciar reserva legada
ALTER TABLE "checkin_checkout_reports" DROP CONSTRAINT IF EXISTS "checkin_checkout_reports_reservaId_fkey";
ALTER TABLE "checkin_checkout_reports" DROP COLUMN IF EXISTS "reservaId";
ALTER TABLE "checkin_checkout_reports" ADD COLUMN IF NOT EXISTS "weekReservationId" TEXT;

-- Cota: remove JSON de semanas legado
ALTER TABLE "cotas_propriedade" DROP COLUMN IF EXISTS "semanasConfig";

-- Tipos legados não usados
DROP TYPE IF EXISTS "WeekSeasonType";
DROP TYPE IF EXISTS "StatusTroca";
DROP TYPE IF EXISTS "TipoTroca";

-- Novos enums
CREATE TYPE "WeekTier" AS ENUM ('GOLD', 'SILVER', 'BLACK');
CREATE TYPE "OfficialWeekType" AS ENUM ('TYPE_1', 'TYPE_2', 'TYPE_3', 'TYPE_4', 'TYPE_5', 'TYPE_6', 'EXTRA');
CREATE TYPE "CalendarYearStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- Tabelas novas
CREATE TABLE "property_calendar_years" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "label" TEXT,
    "status" "CalendarYearStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_calendar_years_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "property_calendar_weeks" (
    "id" TEXT NOT NULL,
    "propertyCalendarYearId" TEXT NOT NULL,
    "weekIndex" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "officialWeekType" "OfficialWeekType" NOT NULL,
    "tier" "WeekTier" NOT NULL,
    "isExtra" BOOLEAN NOT NULL DEFAULT false,
    "exchangeAllowed" BOOLEAN NOT NULL DEFAULT true,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "weight" DECIMAL(12,4) NOT NULL DEFAULT 1,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "property_calendar_weeks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "calendar_distribution_slots" (
    "id" TEXT NOT NULL,
    "propertyCalendarYearId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RASCUNHO',
    "notes" TEXT,
    "finalizedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "calendar_distribution_slots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "property_week_assignments" (
    "id" TEXT NOT NULL,
    "distributionSlotId" TEXT NOT NULL,
    "cotaId" TEXT NOT NULL,
    "propertyCalendarWeekId" TEXT NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "property_week_assignments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "week_reservations" (
    "id" TEXT NOT NULL,
    "cotaId" TEXT NOT NULL,
    "cotistaId" TEXT NOT NULL,
    "propertyCalendarWeekId" TEXT NOT NULL,
    "status" "StatusReserva" NOT NULL DEFAULT 'PENDENTE',
    "confirmadoEm" TIMESTAMP(3),
    "checkInEm" TIMESTAMP(3),
    "checkOutEm" TIMESTAMP(3),
    "limpezaSolicitada" BOOLEAN NOT NULL DEFAULT false,
    "limpezaRealizada" BOOLEAN NOT NULL DEFAULT false,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "week_reservations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "week_exchange_requests" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "cotistaId" TEXT NOT NULL,
    "cotaId" TEXT NOT NULL,
    "ownedCalendarWeekId" TEXT NOT NULL,
    "desiredCalendarWeekId" TEXT,
    "desiredPeriodStart" TIMESTAMP(3),
    "desiredPeriodEnd" TIMESTAMP(3),
    "acceptsAlternatives" BOOLEAN NOT NULL DEFAULT false,
    "publicToPeers" BOOLEAN NOT NULL DEFAULT false,
    "status" "WeekExchangeRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "expiresAt" TIMESTAMP(3),
    "notes" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "week_exchange_requests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "week_exchange_peer_interests" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "interestedCotistaId" TEXT NOT NULL,
    "offeredCalendarWeekId" TEXT NOT NULL,
    "message" TEXT,
    "status" "WeekPeerInterestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "week_exchange_peer_interests_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "week_exchange_event_logs" (
    "id" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "actorType" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "week_exchange_event_logs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "property_calendar_years_propertyId_year_key" ON "property_calendar_years"("propertyId", "year");
CREATE INDEX "property_calendar_years_propertyId_idx" ON "property_calendar_years"("propertyId");

CREATE UNIQUE INDEX "property_calendar_weeks_propertyCalendarYearId_weekIndex_key" ON "property_calendar_weeks"("propertyCalendarYearId", "weekIndex");
CREATE INDEX "property_calendar_weeks_propertyCalendarYearId_idx" ON "property_calendar_weeks"("propertyCalendarYearId");
CREATE INDEX "property_calendar_weeks_startDate_endDate_idx" ON "property_calendar_weeks"("startDate", "endDate");

CREATE INDEX "calendar_distribution_slots_propertyCalendarYearId_idx" ON "calendar_distribution_slots"("propertyCalendarYearId");

CREATE UNIQUE INDEX "property_week_assignments_distributionSlotId_propertyCalend_key" ON "property_week_assignments"("distributionSlotId", "propertyCalendarWeekId");
CREATE INDEX "property_week_assignments_cotaId_idx" ON "property_week_assignments"("cotaId");
CREATE INDEX "property_week_assignments_propertyCalendarWeekId_idx" ON "property_week_assignments"("propertyCalendarWeekId");

CREATE UNIQUE INDEX "week_reservations_cotaId_propertyCalendarWeekId_key" ON "week_reservations"("cotaId", "propertyCalendarWeekId");
CREATE INDEX "week_reservations_cotistaId_idx" ON "week_reservations"("cotistaId");
CREATE INDEX "week_reservations_status_idx" ON "week_reservations"("status");
CREATE INDEX "week_reservations_propertyCalendarWeekId_idx" ON "week_reservations"("propertyCalendarWeekId");

CREATE INDEX "week_exchange_requests_propertyId_idx" ON "week_exchange_requests"("propertyId");
CREATE INDEX "week_exchange_requests_cotistaId_idx" ON "week_exchange_requests"("cotistaId");
CREATE INDEX "week_exchange_requests_status_idx" ON "week_exchange_requests"("status");

CREATE INDEX "week_exchange_peer_interests_requestId_idx" ON "week_exchange_peer_interests"("requestId");
CREATE INDEX "week_exchange_peer_interests_interestedCotistaId_idx" ON "week_exchange_peer_interests"("interestedCotistaId");

CREATE INDEX "week_exchange_event_logs_requestId_idx" ON "week_exchange_event_logs"("requestId");
CREATE INDEX "week_exchange_event_logs_createdAt_idx" ON "week_exchange_event_logs"("createdAt");

-- FKs
ALTER TABLE "property_calendar_years" ADD CONSTRAINT "property_calendar_years_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "property_calendar_weeks" ADD CONSTRAINT "property_calendar_weeks_propertyCalendarYearId_fkey" FOREIGN KEY ("propertyCalendarYearId") REFERENCES "property_calendar_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "calendar_distribution_slots" ADD CONSTRAINT "calendar_distribution_slots_propertyCalendarYearId_fkey" FOREIGN KEY ("propertyCalendarYearId") REFERENCES "property_calendar_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "property_week_assignments" ADD CONSTRAINT "property_week_assignments_distributionSlotId_fkey" FOREIGN KEY ("distributionSlotId") REFERENCES "calendar_distribution_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_week_assignments" ADD CONSTRAINT "property_week_assignments_cotaId_fkey" FOREIGN KEY ("cotaId") REFERENCES "cotas_propriedade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "property_week_assignments" ADD CONSTRAINT "property_week_assignments_propertyCalendarWeekId_fkey" FOREIGN KEY ("propertyCalendarWeekId") REFERENCES "property_calendar_weeks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "week_reservations" ADD CONSTRAINT "week_reservations_cotaId_fkey" FOREIGN KEY ("cotaId") REFERENCES "cotas_propriedade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_reservations" ADD CONSTRAINT "week_reservations_cotistaId_fkey" FOREIGN KEY ("cotistaId") REFERENCES "cotistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_reservations" ADD CONSTRAINT "week_reservations_propertyCalendarWeekId_fkey" FOREIGN KEY ("propertyCalendarWeekId") REFERENCES "property_calendar_weeks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "week_exchange_requests" ADD CONSTRAINT "week_exchange_requests_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_exchange_requests" ADD CONSTRAINT "week_exchange_requests_cotistaId_fkey" FOREIGN KEY ("cotistaId") REFERENCES "cotistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_exchange_requests" ADD CONSTRAINT "week_exchange_requests_cotaId_fkey" FOREIGN KEY ("cotaId") REFERENCES "cotas_propriedade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_exchange_requests" ADD CONSTRAINT "week_exchange_requests_ownedCalendarWeekId_fkey" FOREIGN KEY ("ownedCalendarWeekId") REFERENCES "property_calendar_weeks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "week_exchange_requests" ADD CONSTRAINT "week_exchange_requests_desiredCalendarWeekId_fkey" FOREIGN KEY ("desiredCalendarWeekId") REFERENCES "property_calendar_weeks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "week_exchange_peer_interests" ADD CONSTRAINT "week_exchange_peer_interests_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "week_exchange_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_exchange_peer_interests" ADD CONSTRAINT "week_exchange_peer_interests_interestedCotistaId_fkey" FOREIGN KEY ("interestedCotistaId") REFERENCES "cotistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_exchange_peer_interests" ADD CONSTRAINT "week_exchange_peer_interests_offeredCalendarWeekId_fkey" FOREIGN KEY ("offeredCalendarWeekId") REFERENCES "property_calendar_weeks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "week_exchange_event_logs" ADD CONSTRAINT "week_exchange_event_logs_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "week_exchange_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "checkin_checkout_reports" ADD CONSTRAINT "checkin_checkout_reports_weekReservationId_fkey" FOREIGN KEY ("weekReservationId") REFERENCES "week_reservations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
