-- Fix ticket categories in production to match PatinaireSeatMap zone names
-- Run this in Supabase SQL Editor

-- Step 1: See current categories
SELECT tc.id, tc.name, tc.price, tc.capacity, tc.sold, m."homeTeam", m."awayTeam", m.date
FROM "TicketCategory" tc
JOIN "Match" m ON tc."matchId" = m.id
ORDER BY m.date, tc.name;

-- Step 2: For each match that has the old 5-category scheme, replace with the new 8-category scheme
-- First, delete old categories
DELETE FROM "TicketCategory"
WHERE "matchId" IN (
  SELECT m.id FROM "Match" m
  WHERE m.status = 'scheduled' AND m."isHomeGame" = true
);

-- Step 3: Insert new categories for each upcoming home game
INSERT INTO "TicketCategory" (id, name, price, capacity, sold, "matchId")
SELECT
  gen_random_uuid(),
  cat.name,
  cat.price,
  cat.capacity,
  0,
  m.id
FROM "Match" m
CROSS JOIN (VALUES
  ('Tribune Propp', 2700, 80),
  ('Catégorie 1', 2400, 120),
  ('Catégorie 2 Gauche', 2000, 100),
  ('Catégorie 2 Droite', 2000, 100),
  ('Catégorie 3 Gauche', 1700, 80),
  ('Catégorie 3 Droite', 1700, 80),
  ('Debout Gauche', 1100, 150),
  ('Debout Droite', 1100, 150)
) AS cat(name, price, capacity)
WHERE m.status = 'scheduled' AND m."isHomeGame" = true;

-- Step 4: Verify
SELECT tc.name, tc.price, tc.capacity, m."awayTeam", m.date
FROM "TicketCategory" tc
JOIN "Match" m ON tc."matchId" = m.id
WHERE m.status = 'scheduled' AND m."isHomeGame" = true
ORDER BY m.date, tc.name;
