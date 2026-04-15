-- Marketplace de semanas (cotista a cotista; pagamento externo na venda)

CREATE TYPE "WeekMarketplaceListingType" AS ENUM ('EXCHANGE', 'SALE', 'BOTH');
CREATE TYPE "WeekMarketplaceListingStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'NEGOTIATING', 'WAITING_CONFIRMATION', 'COMPLETED', 'CANCELLED');
CREATE TYPE "WeekMarketplaceProposalType" AS ENUM ('EXCHANGE', 'SALE');
CREATE TYPE "WeekMarketplaceProposalStatus" AS ENUM ('PENDING', 'ACCEPTED_BY_OWNER', 'ACCEPTED_BY_PROPOSER', 'REJECTED', 'CANCELLED', 'COMPLETED');
CREATE TYPE "WeekUsageOverrideReason" AS ENUM ('EXCHANGE', 'SALE');

CREATE TABLE "week_marketplace_listings" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "propertyCalendarYearId" TEXT NOT NULL,
    "ownerCotistaId" TEXT NOT NULL,
    "ownerCotaId" TEXT NOT NULL,
    "ownedCalendarWeekId" TEXT NOT NULL,
    "type" "WeekMarketplaceListingType" NOT NULL,
    "preferences" JSONB,
    "status" "WeekMarketplaceListingStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "week_marketplace_listings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "week_marketplace_proposals" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "proposerCotistaId" TEXT NOT NULL,
    "proposerCotaId" TEXT NOT NULL,
    "proposerWeekId" TEXT,
    "type" "WeekMarketplaceProposalType" NOT NULL,
    "status" "WeekMarketplaceProposalStatus" NOT NULL DEFAULT 'PENDING',
    "ownerAcceptedAt" TIMESTAMP(3),
    "proposerAcceptedAt" TIMESTAMP(3),
    "sellerConfirmedAt" TIMESTAMP(3),
    "buyerConfirmedAt" TIMESTAMP(3),
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "week_marketplace_proposals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "week_usage_overrides" (
    "id" TEXT NOT NULL,
    "propertyCalendarWeekId" TEXT NOT NULL,
    "fromCotaId" TEXT NOT NULL,
    "toCotaId" TEXT NOT NULL,
    "reason" "WeekUsageOverrideReason" NOT NULL,
    "proposalId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "week_usage_overrides_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "week_marketplace_event_logs" (
    "id" TEXT NOT NULL,
    "listingId" TEXT,
    "actorCotistaId" TEXT,
    "action" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "week_marketplace_event_logs_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "week_usage_overrides_propertyCalendarWeekId_key" ON "week_usage_overrides"("propertyCalendarWeekId");

CREATE INDEX "week_marketplace_listings_propertyId_status_idx" ON "week_marketplace_listings"("propertyId", "status");
CREATE INDEX "week_marketplace_listings_ownerCotistaId_idx" ON "week_marketplace_listings"("ownerCotistaId");
CREATE INDEX "week_marketplace_listings_propertyCalendarYearId_idx" ON "week_marketplace_listings"("propertyCalendarYearId");
CREATE INDEX "week_marketplace_listings_ownedCalendarWeekId_idx" ON "week_marketplace_listings"("ownedCalendarWeekId");

CREATE INDEX "week_marketplace_proposals_listingId_idx" ON "week_marketplace_proposals"("listingId");
CREATE INDEX "week_marketplace_proposals_proposerCotistaId_idx" ON "week_marketplace_proposals"("proposerCotistaId");
CREATE INDEX "week_marketplace_proposals_status_idx" ON "week_marketplace_proposals"("status");

CREATE INDEX "week_usage_overrides_fromCotaId_idx" ON "week_usage_overrides"("fromCotaId");
CREATE INDEX "week_usage_overrides_toCotaId_idx" ON "week_usage_overrides"("toCotaId");
CREATE INDEX "week_usage_overrides_proposalId_idx" ON "week_usage_overrides"("proposalId");

CREATE INDEX "week_marketplace_event_logs_listingId_idx" ON "week_marketplace_event_logs"("listingId");
CREATE INDEX "week_marketplace_event_logs_createdAt_idx" ON "week_marketplace_event_logs"("createdAt");

ALTER TABLE "week_marketplace_listings" ADD CONSTRAINT "week_marketplace_listings_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_marketplace_listings" ADD CONSTRAINT "week_marketplace_listings_propertyCalendarYearId_fkey" FOREIGN KEY ("propertyCalendarYearId") REFERENCES "property_calendar_years"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_marketplace_listings" ADD CONSTRAINT "week_marketplace_listings_ownerCotistaId_fkey" FOREIGN KEY ("ownerCotistaId") REFERENCES "cotistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_marketplace_listings" ADD CONSTRAINT "week_marketplace_listings_ownerCotaId_fkey" FOREIGN KEY ("ownerCotaId") REFERENCES "cotas_propriedade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_marketplace_listings" ADD CONSTRAINT "week_marketplace_listings_ownedCalendarWeekId_fkey" FOREIGN KEY ("ownedCalendarWeekId") REFERENCES "property_calendar_weeks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "week_marketplace_proposals" ADD CONSTRAINT "week_marketplace_proposals_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "week_marketplace_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_marketplace_proposals" ADD CONSTRAINT "week_marketplace_proposals_proposerCotistaId_fkey" FOREIGN KEY ("proposerCotistaId") REFERENCES "cotistas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_marketplace_proposals" ADD CONSTRAINT "week_marketplace_proposals_proposerCotaId_fkey" FOREIGN KEY ("proposerCotaId") REFERENCES "cotas_propriedade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_marketplace_proposals" ADD CONSTRAINT "week_marketplace_proposals_proposerWeekId_fkey" FOREIGN KEY ("proposerWeekId") REFERENCES "property_calendar_weeks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "week_usage_overrides" ADD CONSTRAINT "week_usage_overrides_propertyCalendarWeekId_fkey" FOREIGN KEY ("propertyCalendarWeekId") REFERENCES "property_calendar_weeks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_usage_overrides" ADD CONSTRAINT "week_usage_overrides_fromCotaId_fkey" FOREIGN KEY ("fromCotaId") REFERENCES "cotas_propriedade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_usage_overrides" ADD CONSTRAINT "week_usage_overrides_toCotaId_fkey" FOREIGN KEY ("toCotaId") REFERENCES "cotas_propriedade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "week_usage_overrides" ADD CONSTRAINT "week_usage_overrides_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "week_marketplace_proposals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "week_marketplace_event_logs" ADD CONSTRAINT "week_marketplace_event_logs_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "week_marketplace_listings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
