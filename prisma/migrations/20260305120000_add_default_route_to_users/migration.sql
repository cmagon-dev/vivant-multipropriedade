-- Add defaultRoute column to users (para compatibilizar com o schema atual)
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "defaultRoute" TEXT;

