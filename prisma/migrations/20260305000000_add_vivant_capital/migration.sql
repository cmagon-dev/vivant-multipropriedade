-- CreateTable
CREATE TABLE "capital_asset_configs" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "totalCotas" INTEGER NOT NULL DEFAULT 100,
    "valorPorCota" DECIMAL(15,2) NOT NULL,
    "taxaAdministracaoPercent" DECIMAL(5,2) NOT NULL,
    "reservaPercent" DECIMAL(5,2) NOT NULL,
    "ativoStatus" TEXT NOT NULL DEFAULT 'ATIVO',
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capital_asset_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capital_investor_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipoPessoa" TEXT NOT NULL DEFAULT 'PF',
    "documento" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capital_investor_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capital_participations" (
    "id" TEXT NOT NULL,
    "investorProfileId" TEXT NOT NULL,
    "assetConfigId" TEXT NOT NULL,
    "numeroCotas" INTEGER NOT NULL,
    "percentualTotal" DECIMAL(5,2) NOT NULL,
    "valorAportado" DECIMAL(15,2) NOT NULL,
    "dataEntrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'ATIVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capital_participations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capital_distributions" (
    "id" TEXT NOT NULL,
    "assetConfigId" TEXT NOT NULL,
    "competencia" TEXT NOT NULL,
    "receitaBruta" DECIMAL(15,2) NOT NULL,
    "custos" DECIMAL(15,2) NOT NULL,
    "taxaAdministracaoValor" DECIMAL(15,2) NOT NULL,
    "reservaValor" DECIMAL(15,2) NOT NULL,
    "resultadoDistribuivel" DECIMAL(15,2) NOT NULL,
    "valorTotalDistribuido" DECIMAL(15,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RASCUNHO',
    "dataAprovacao" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capital_distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capital_distribution_items" (
    "id" TEXT NOT NULL,
    "distributionId" TEXT NOT NULL,
    "investorProfileId" TEXT NOT NULL,
    "percentualAplicado" DECIMAL(5,2) NOT NULL,
    "valorDevido" DECIMAL(15,2) NOT NULL,
    "valorPago" DECIMAL(15,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capital_distribution_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capital_valuations" (
    "id" TEXT NOT NULL,
    "assetConfigId" TEXT NOT NULL,
    "dataReferencia" TIMESTAMP(3) NOT NULL,
    "valorImovel" DECIMAL(15,2) NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capital_valuations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "capital_liquidity_requests" (
    "id" TEXT NOT NULL,
    "investorProfileId" TEXT NOT NULL,
    "assetConfigId" TEXT NOT NULL,
    "tipoSolicitacao" TEXT NOT NULL,
    "valorSolicitado" DECIMAL(15,2) NOT NULL,
    "motivo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "observacaoAdmin" TEXT,
    "dataSolicitacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataDecisao" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "capital_liquidity_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "capital_asset_configs_propertyId_key" ON "capital_asset_configs"("propertyId");
CREATE INDEX "capital_asset_configs_propertyId_idx" ON "capital_asset_configs"("propertyId");
CREATE INDEX "capital_asset_configs_enabled_idx" ON "capital_asset_configs"("enabled");
CREATE INDEX "capital_asset_configs_ativoStatus_idx" ON "capital_asset_configs"("ativoStatus");

CREATE UNIQUE INDEX "capital_investor_profiles_userId_key" ON "capital_investor_profiles"("userId");
CREATE INDEX "capital_investor_profiles_userId_idx" ON "capital_investor_profiles"("userId");
CREATE INDEX "capital_investor_profiles_status_idx" ON "capital_investor_profiles"("status");

CREATE UNIQUE INDEX "capital_participations_investorProfileId_assetConfigId_key" ON "capital_participations"("investorProfileId", "assetConfigId");
CREATE INDEX "capital_participations_investorProfileId_idx" ON "capital_participations"("investorProfileId");
CREATE INDEX "capital_participations_assetConfigId_idx" ON "capital_participations"("assetConfigId");
CREATE INDEX "capital_participations_status_idx" ON "capital_participations"("status");

CREATE UNIQUE INDEX "capital_distributions_assetConfigId_competencia_key" ON "capital_distributions"("assetConfigId", "competencia");
CREATE INDEX "capital_distributions_assetConfigId_idx" ON "capital_distributions"("assetConfigId");
CREATE INDEX "capital_distributions_status_idx" ON "capital_distributions"("status");
CREATE INDEX "capital_distributions_competencia_idx" ON "capital_distributions"("competencia");

CREATE UNIQUE INDEX "capital_distribution_items_distributionId_investorProfileId_key" ON "capital_distribution_items"("distributionId", "investorProfileId");
CREATE INDEX "capital_distribution_items_distributionId_idx" ON "capital_distribution_items"("distributionId");
CREATE INDEX "capital_distribution_items_investorProfileId_idx" ON "capital_distribution_items"("investorProfileId");

CREATE INDEX "capital_valuations_assetConfigId_idx" ON "capital_valuations"("assetConfigId");
CREATE INDEX "capital_valuations_dataReferencia_idx" ON "capital_valuations"("dataReferencia");

CREATE INDEX "capital_liquidity_requests_investorProfileId_idx" ON "capital_liquidity_requests"("investorProfileId");
CREATE INDEX "capital_liquidity_requests_assetConfigId_idx" ON "capital_liquidity_requests"("assetConfigId");
CREATE INDEX "capital_liquidity_requests_status_idx" ON "capital_liquidity_requests"("status");

-- AddForeignKey
ALTER TABLE "capital_asset_configs" ADD CONSTRAINT "capital_asset_configs_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "capital_investor_profiles" ADD CONSTRAINT "capital_investor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_participations" ADD CONSTRAINT "capital_participations_investorProfileId_fkey" FOREIGN KEY ("investorProfileId") REFERENCES "capital_investor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_participations" ADD CONSTRAINT "capital_participations_assetConfigId_fkey" FOREIGN KEY ("assetConfigId") REFERENCES "capital_asset_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "capital_distributions" ADD CONSTRAINT "capital_distributions_assetConfigId_fkey" FOREIGN KEY ("assetConfigId") REFERENCES "capital_asset_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "capital_distribution_items" ADD CONSTRAINT "capital_distribution_items_distributionId_fkey" FOREIGN KEY ("distributionId") REFERENCES "capital_distributions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_distribution_items" ADD CONSTRAINT "capital_distribution_items_investorProfileId_fkey" FOREIGN KEY ("investorProfileId") REFERENCES "capital_investor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_valuations" ADD CONSTRAINT "capital_valuations_assetConfigId_fkey" FOREIGN KEY ("assetConfigId") REFERENCES "capital_asset_configs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_liquidity_requests" ADD CONSTRAINT "capital_liquidity_requests_investorProfileId_fkey" FOREIGN KEY ("investorProfileId") REFERENCES "capital_investor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "capital_liquidity_requests" ADD CONSTRAINT "capital_liquidity_requests_assetConfigId_fkey" FOREIGN KEY ("assetConfigId") REFERENCES "capital_asset_configs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
