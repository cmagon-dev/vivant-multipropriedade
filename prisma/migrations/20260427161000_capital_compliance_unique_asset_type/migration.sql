-- Remove duplicidades de compliance por empresa+ativo+tipo
-- mantendo o registro mais recentemente atualizado.
DELETE FROM "capital_compliance_documents" a
USING "capital_compliance_documents" b
WHERE a.id <> b.id
  AND a."companyId" = b."companyId"
  AND a."assetId" = b."assetId"
  AND a."type" = b."type"
  AND (
    a."updatedAt" < b."updatedAt"
    OR (a."updatedAt" = b."updatedAt" AND a."id" < b."id")
  );

CREATE UNIQUE INDEX "capital_compliance_documents_companyId_assetId_type_key"
ON "capital_compliance_documents"("companyId", "assetId", "type");
