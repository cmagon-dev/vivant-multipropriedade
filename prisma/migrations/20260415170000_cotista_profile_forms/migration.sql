-- Ficha cadastral completa do cotista (payload JSON flexível)

CREATE TABLE IF NOT EXISTS "cotista_profile_forms" (
  "id" TEXT NOT NULL,
  "cotistaId" TEXT NOT NULL,
  "payload" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "cotista_profile_forms_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "cotista_profile_forms_cotistaId_key" UNIQUE ("cotistaId"),
  CONSTRAINT "cotista_profile_forms_cotistaId_fkey"
    FOREIGN KEY ("cotistaId")
    REFERENCES "cotistas"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "cotista_profile_forms_cotistaId_idx"
  ON "cotista_profile_forms"("cotistaId");
