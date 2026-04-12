-- ============================================================
-- HORMADI — Migrate Standing & Match tables for external sync
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Add externalId to Match table (for deduplication with scraped data)
ALTER TABLE "Match" ADD COLUMN IF NOT EXISTS "externalId" TEXT UNIQUE;

-- 2. Drop the old unique constraint on Standing.team (if exists)
ALTER TABLE "Standing" DROP CONSTRAINT IF EXISTS "Standing_team_key";

-- 3. Add new columns to Standing table
ALTER TABLE "Standing" ADD COLUMN IF NOT EXISTS "competition" TEXT NOT NULL DEFAULT 'Ligue Magnus';
ALTER TABLE "Standing" ADD COLUMN IF NOT EXISTS "season" TEXT NOT NULL DEFAULT '2025-2026';
ALTER TABLE "Standing" ADD COLUMN IF NOT EXISTS "diff" INTEGER NOT NULL DEFAULT 0;

-- 4. Add composite unique constraint
ALTER TABLE "Standing" ADD CONSTRAINT "Standing_team_competition_season_key"
  UNIQUE ("team", "competition", "season");

-- 5. Verify
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'Standing' ORDER BY ordinal_position;
