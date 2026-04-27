-- Ensure default company exists for backfill
INSERT INTO "companies" ("id", "name", "slug", "active", "createdAt", "updatedAt")
SELECT 'capital_default_company', 'Vivant', 'default', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM "companies" WHERE "slug" = 'default');

-- Add companyId and financial fields to existing Capital tables
ALTER TABLE "capital_asset_configs"
  ADD COLUMN IF NOT EXISTS "companyId" TEXT,
  ADD COLUMN IF NOT EXISTS "fundId" TEXT,
  ADD COLUMN IF NOT EXISTS "acquisitionValue" DECIMAL(15,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "structuredValue" DECIMAL(15,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "expectedReturnRate" DECIMAL(8,4) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "capRate" DECIMAL(8,4) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "operationalMarginMin" DECIMAL(8,4) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "operationalMarginMax" DECIMAL(8,4) NOT NULL DEFAULT 0;

ALTER TABLE "capital_investor_profiles"
  ADD COLUMN IF NOT EXISTS "companyId" TEXT;

ALTER TABLE "capital_participations"
  ADD COLUMN IF NOT EXISTS "companyId" TEXT,
  ADD COLUMN IF NOT EXISTS "investorId" TEXT,
  ADD COLUMN IF NOT EXISTS "assetId" TEXT,
  ADD COLUMN IF NOT EXISTS "quotas" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "totalInvested" DECIMAL(15,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "expectedReturn" DECIMAL(15,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "roiPercent" DECIMAL(8,4) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "observacoes" TEXT,
  ADD COLUMN IF NOT EXISTS "reserveDate" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "paymentDate" TIMESTAMP(3);

ALTER TABLE "capital_distributions"
  ADD COLUMN IF NOT EXISTS "companyId" TEXT;

ALTER TABLE "capital_distribution_items"
  ADD COLUMN IF NOT EXISTS "companyId" TEXT;

ALTER TABLE "capital_valuations"
  ADD COLUMN IF NOT EXISTS "companyId" TEXT;

ALTER TABLE "capital_liquidity_requests"
  ADD COLUMN IF NOT EXISTS "companyId" TEXT;

-- Backfill companyId with default company
UPDATE "capital_asset_configs"
SET "companyId" = COALESCE("companyId", (SELECT "id" FROM "companies" WHERE "slug" = 'default' LIMIT 1));

UPDATE "capital_investor_profiles"
SET "companyId" = COALESCE("companyId", (SELECT "id" FROM "companies" WHERE "slug" = 'default' LIMIT 1));

UPDATE "capital_participations" cp
SET
  "companyId" = COALESCE(cp."companyId", ac."companyId"),
  "investorId" = COALESCE(cp."investorId", cp."investorProfileId"),
  "assetId" = COALESCE(cp."assetId", cp."assetConfigId"),
  "quotas" = CASE WHEN cp."quotas" = 0 THEN cp."numeroCotas" ELSE cp."quotas" END,
  "totalInvested" = CASE WHEN cp."totalInvested" = 0 THEN cp."valorAportado" ELSE cp."totalInvested" END
FROM "capital_asset_configs" ac
WHERE cp."assetConfigId" = ac."id";

UPDATE "capital_distributions" cd
SET "companyId" = COALESCE(cd."companyId", ac."companyId")
FROM "capital_asset_configs" ac
WHERE cd."assetConfigId" = ac."id";

UPDATE "capital_distribution_items" cdi
SET "companyId" = COALESCE(cdi."companyId", cd."companyId")
FROM "capital_distributions" cd
WHERE cdi."distributionId" = cd."id";

UPDATE "capital_valuations" cv
SET "companyId" = COALESCE(cv."companyId", ac."companyId")
FROM "capital_asset_configs" ac
WHERE cv."assetConfigId" = ac."id";

UPDATE "capital_liquidity_requests" clr
SET "companyId" = COALESCE(clr."companyId", ac."companyId")
FROM "capital_asset_configs" ac
WHERE clr."assetConfigId" = ac."id";

-- Enforce NOT NULL companyId
ALTER TABLE "capital_asset_configs" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "capital_investor_profiles" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "capital_participations" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "capital_distributions" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "capital_distribution_items" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "capital_valuations" ALTER COLUMN "companyId" SET NOT NULL;
ALTER TABLE "capital_liquidity_requests" ALTER COLUMN "companyId" SET NOT NULL;

-- Drop global unique constraints and replace with company-scoped uniques
ALTER TABLE "capital_asset_configs" DROP CONSTRAINT IF EXISTS "capital_asset_configs_propertyId_key";
ALTER TABLE "capital_investor_profiles" DROP CONSTRAINT IF EXISTS "capital_investor_profiles_userId_key";
ALTER TABLE "capital_participations" DROP CONSTRAINT IF EXISTS "capital_participations_investorProfileId_assetConfigId_key";
ALTER TABLE "capital_distributions" DROP CONSTRAINT IF EXISTS "capital_distributions_assetConfigId_competencia_key";
ALTER TABLE "capital_distribution_items" DROP CONSTRAINT IF EXISTS "capital_distribution_items_distributionId_investorProfileId_key";

ALTER TABLE "capital_asset_configs" ADD CONSTRAINT "capital_asset_configs_companyId_propertyId_key" UNIQUE ("companyId", "propertyId");
ALTER TABLE "capital_investor_profiles" ADD CONSTRAINT "capital_investor_profiles_companyId_userId_key" UNIQUE ("companyId", "userId");
ALTER TABLE "capital_participations" ADD CONSTRAINT "capital_participations_companyId_investorProfileId_assetConfigId_key" UNIQUE ("companyId", "investorProfileId", "assetConfigId");
ALTER TABLE "capital_distributions" ADD CONSTRAINT "capital_distributions_companyId_assetConfigId_competencia_key" UNIQUE ("companyId", "assetConfigId", "competencia");
ALTER TABLE "capital_distribution_items" ADD CONSTRAINT "capital_distribution_items_companyId_distributionId_investorProfileId_key" UNIQUE ("companyId", "distributionId", "investorProfileId");

-- Add foreign keys for companyId/fundId
ALTER TABLE "capital_asset_configs"
  ADD CONSTRAINT "capital_asset_configs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_investor_profiles"
  ADD CONSTRAINT "capital_investor_profiles_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_participations"
  ADD CONSTRAINT "capital_participations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_distributions"
  ADD CONSTRAINT "capital_distributions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_distribution_items"
  ADD CONSTRAINT "capital_distribution_items_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_valuations"
  ADD CONSTRAINT "capital_valuations_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_liquidity_requests"
  ADD CONSTRAINT "capital_liquidity_requests_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create new Capital tables
CREATE TABLE IF NOT EXISTS "capital_funds" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "capital_funds_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "capital_payments" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "investmentId" TEXT NOT NULL,
  "investorId" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "amount" DECIMAL(15,2) NOT NULL,
  "guaranteeAmount" DECIMAL(15,2) NOT NULL,
  "operationAmount" DECIMAL(15,2) NOT NULL,
  "splitPercentageGuarantee" DECIMAL(5,2) NOT NULL,
  "splitPercentageOperation" DECIMAL(5,2) NOT NULL,
  "paidAt" TIMESTAMP(3),
  "status" TEXT NOT NULL DEFAULT 'PENDENTE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "capital_payments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "capital_wallets" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "totalGuaranteeBalance" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "totalOperationBalance" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "totalReceived" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "totalDistributed" DECIMAL(15,2) NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "capital_wallets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "capital_transactions" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "walletId" TEXT,
  "type" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "amount" DECIMAL(15,2) NOT NULL,
  "referenceId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "capital_transactions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "capital_compliance_documents" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "assetId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDENTE',
  "fileUrl" TEXT,
  "observations" TEXT,
  "concludedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "capital_compliance_documents_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "capital_settings" (
  "id" TEXT NOT NULL,
  "companyId" TEXT NOT NULL,
  "guaranteePercentage" DECIMAL(5,2) NOT NULL DEFAULT 50,
  "operationPercentage" DECIMAL(5,2) NOT NULL DEFAULT 50,
  "defaultReturnRate" DECIMAL(8,4) NOT NULL DEFAULT 12,
  "marginMin" DECIMAL(8,4) NOT NULL DEFAULT 18,
  "marginMax" DECIMAL(8,4) NOT NULL DEFAULT 35,
  "disclaimer" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "capital_settings_pkey" PRIMARY KEY ("id")
);

-- Indexes and unique constraints for new tables
CREATE UNIQUE INDEX IF NOT EXISTS "capital_funds_companyId_name_key" ON "capital_funds"("companyId", "name");
CREATE UNIQUE INDEX IF NOT EXISTS "capital_wallets_companyId_key" ON "capital_wallets"("companyId");
CREATE UNIQUE INDEX IF NOT EXISTS "capital_settings_companyId_key" ON "capital_settings"("companyId");

CREATE INDEX IF NOT EXISTS "capital_funds_companyId_idx" ON "capital_funds"("companyId");
CREATE INDEX IF NOT EXISTS "capital_payments_companyId_idx" ON "capital_payments"("companyId");
CREATE INDEX IF NOT EXISTS "capital_payments_investmentId_idx" ON "capital_payments"("investmentId");
CREATE INDEX IF NOT EXISTS "capital_payments_investorId_idx" ON "capital_payments"("investorId");
CREATE INDEX IF NOT EXISTS "capital_payments_assetId_idx" ON "capital_payments"("assetId");
CREATE INDEX IF NOT EXISTS "capital_payments_status_idx" ON "capital_payments"("status");
CREATE INDEX IF NOT EXISTS "capital_transactions_companyId_idx" ON "capital_transactions"("companyId");
CREATE INDEX IF NOT EXISTS "capital_transactions_walletId_idx" ON "capital_transactions"("walletId");
CREATE INDEX IF NOT EXISTS "capital_transactions_referenceId_idx" ON "capital_transactions"("referenceId");
CREATE INDEX IF NOT EXISTS "capital_transactions_type_idx" ON "capital_transactions"("type");
CREATE INDEX IF NOT EXISTS "capital_transactions_category_idx" ON "capital_transactions"("category");
CREATE INDEX IF NOT EXISTS "capital_compliance_documents_companyId_idx" ON "capital_compliance_documents"("companyId");
CREATE INDEX IF NOT EXISTS "capital_compliance_documents_assetId_idx" ON "capital_compliance_documents"("assetId");
CREATE INDEX IF NOT EXISTS "capital_compliance_documents_type_idx" ON "capital_compliance_documents"("type");
CREATE INDEX IF NOT EXISTS "capital_compliance_documents_status_idx" ON "capital_compliance_documents"("status");
CREATE INDEX IF NOT EXISTS "capital_settings_companyId_idx" ON "capital_settings"("companyId");
CREATE INDEX IF NOT EXISTS "capital_asset_configs_companyId_idx" ON "capital_asset_configs"("companyId");
CREATE INDEX IF NOT EXISTS "capital_asset_configs_fundId_idx" ON "capital_asset_configs"("fundId");
CREATE INDEX IF NOT EXISTS "capital_investor_profiles_companyId_idx" ON "capital_investor_profiles"("companyId");
CREATE INDEX IF NOT EXISTS "capital_participations_companyId_idx" ON "capital_participations"("companyId");
CREATE INDEX IF NOT EXISTS "capital_distributions_companyId_idx" ON "capital_distributions"("companyId");
CREATE INDEX IF NOT EXISTS "capital_distribution_items_companyId_idx" ON "capital_distribution_items"("companyId");
CREATE INDEX IF NOT EXISTS "capital_valuations_companyId_idx" ON "capital_valuations"("companyId");
CREATE INDEX IF NOT EXISTS "capital_liquidity_requests_companyId_idx" ON "capital_liquidity_requests"("companyId");

-- Foreign keys for new tables
ALTER TABLE "capital_asset_configs"
  ADD CONSTRAINT "capital_asset_configs_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "capital_funds"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "capital_funds"
  ADD CONSTRAINT "capital_funds_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_payments"
  ADD CONSTRAINT "capital_payments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_payments"
  ADD CONSTRAINT "capital_payments_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "capital_participations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "capital_payments"
  ADD CONSTRAINT "capital_payments_investorId_fkey" FOREIGN KEY ("investorId") REFERENCES "capital_investor_profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "capital_payments"
  ADD CONSTRAINT "capital_payments_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "capital_asset_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "capital_wallets"
  ADD CONSTRAINT "capital_wallets_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_transactions"
  ADD CONSTRAINT "capital_transactions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_transactions"
  ADD CONSTRAINT "capital_transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "capital_wallets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "capital_compliance_documents"
  ADD CONSTRAINT "capital_compliance_documents_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_compliance_documents"
  ADD CONSTRAINT "capital_compliance_documents_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "capital_asset_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_settings"
  ADD CONSTRAINT "capital_settings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create default settings and wallet per company if missing
INSERT INTO "capital_settings" ("id", "companyId", "guaranteePercentage", "operationPercentage", "defaultReturnRate", "marginMin", "marginMax", "createdAt", "updatedAt")
SELECT CONCAT('capital_settings_', c."id"), c."id", 50, 50, 12, 18, 35, NOW(), NOW()
FROM "companies" c
WHERE NOT EXISTS (SELECT 1 FROM "capital_settings" cs WHERE cs."companyId" = c."id");

INSERT INTO "capital_wallets" ("id", "companyId", "totalGuaranteeBalance", "totalOperationBalance", "totalReceived", "totalDistributed", "createdAt", "updatedAt")
SELECT CONCAT('capital_wallet_', c."id"), c."id", 0, 0, 0, 0, NOW(), NOW()
FROM "companies" c
WHERE NOT EXISTS (SELECT 1 FROM "capital_wallets" cw WHERE cw."companyId" = c."id");
