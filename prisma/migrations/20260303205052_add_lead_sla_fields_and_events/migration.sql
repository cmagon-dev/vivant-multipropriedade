-- CreateEnum
CREATE TYPE "LeadSlaEventType" AS ENUM ('STAGE_CHANGED', 'SLA_WARNING', 'SLA_BREACHED', 'SLA_RESOLVED');

-- AlterTable
ALTER TABLE "lead_stages" ADD COLUMN     "slaEnabled" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "slaThresholds" JSONB;

-- AlterTable
ALTER TABLE "leads" ADD COLUMN     "stageBreachedAt" TIMESTAMP(3),
ADD COLUMN     "stageDueAt" TIMESTAMP(3),
ADD COLUMN     "stageEnteredAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "lead_sla_events" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "stageId" TEXT NOT NULL,
    "type" "LeadSlaEventType" NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lead_sla_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lead_sla_events_leadId_createdAt_idx" ON "lead_sla_events"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "lead_sla_events_createdAt_idx" ON "lead_sla_events"("createdAt");

-- CreateIndex
CREATE INDEX "leads_stageDueAt_idx" ON "leads"("stageDueAt");

-- CreateIndex
CREATE INDEX "leads_ownerUserId_stageDueAt_idx" ON "leads"("ownerUserId", "stageDueAt");

-- AddForeignKey
ALTER TABLE "lead_sla_events" ADD CONSTRAINT "lead_sla_events_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lead_sla_events" ADD CONSTRAINT "lead_sla_events_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "lead_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
