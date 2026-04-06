-- Permite lead sem responsável ("Não distribuído")
ALTER TABLE "leads"
  ALTER COLUMN "ownerUserId" DROP NOT NULL;

-- Ajusta FK para manter lead quando usuário for removido
ALTER TABLE "leads" DROP CONSTRAINT IF EXISTS "leads_ownerUserId_fkey";

ALTER TABLE "leads"
  ADD CONSTRAINT "leads_ownerUserId_fkey"
  FOREIGN KEY ("ownerUserId") REFERENCES "users"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
