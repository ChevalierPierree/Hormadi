-- ========================================
-- Fix Partner logoUrl values
-- Map seed partner names to actual files in /images/partenaires/
-- Set unmatched ones to NULL
-- ========================================

-- First set all partner logos to NULL (clean slate since none of the /images/partners/ paths exist)
UPDATE "Partner" SET "logoUrl" = NULL;

-- Now map the ones we have actual images for
UPDATE "Partner" SET "logoUrl" = '/images/partenaires/Nouvelle-Aquitaine.png' WHERE "name" = 'Région Nouvelle-Aquitaine';
UPDATE "Partner" SET "logoUrl" = '/images/partenaires/Burger-King.png' WHERE "name" ILIKE '%burger%king%';
UPDATE "Partner" SET "logoUrl" = '/images/partenaires/ESG.png' WHERE "name" ILIKE '%esg%';
UPDATE "Partner" SET "logoUrl" = '/images/partenaires/Eiffage.png' WHERE "name" ILIKE '%eiffage%';
UPDATE "Partner" SET "logoUrl" = '/images/partenaires/Ibis.png' WHERE "name" ILIKE '%ibis%';
UPDATE "Partner" SET "logoUrl" = '/images/partenaires/Krys.png' WHERE "name" ILIKE '%krys%';
UPDATE "Partner" SET "logoUrl" = '/images/partenaires/Pull-in.png' WHERE "name" ILIKE '%pull%in%';
UPDATE "Partner" SET "logoUrl" = '/images/partenaires/Societe-Generale.png' WHERE "name" ILIKE '%soci%g%n%rale%';
UPDATE "Partner" SET "logoUrl" = '/images/partenaires/Sud-Ouest.png' WHERE "name" ILIKE '%sud%ouest%';
UPDATE "Partner" SET "logoUrl" = '/images/partenaires/VandB.png' WHERE "name" ILIKE '%v%and%b%' OR "name" ILIKE '%v&b%';

-- ========================================
-- Fix Article imageUrl values
-- Map articles to real images from /images/news/
-- ========================================

UPDATE "Article" SET "imageUrl" = '/images/news/arrivee-de-jake-gagnon.jpg' WHERE "slug" = 'victoire-eclatante-gap';
UPDATE "Article" SET "imageUrl" = '/images/news/arrivee-de-keith-getson.jpeg' WHERE "slug" = 'nouveau-maillot-collector-2026';
UPDATE "Article" SET "imageUrl" = '/images/news/150-abonnes-en-10-jours.jpg' WHERE "slug" = 'hospitalites-playoffs-2026';
UPDATE "Article" SET "imageUrl" = '/images/news/andrea-palat-et-jules-boscq-signent.jpg' WHERE "slug" = 'prolongation-contrat-dumont';
UPDATE "Article" SET "imageUrl" = '/images/news/arrivee-de-alexander-khovanov.jpg' WHERE "slug" = 'partenariat-region-nouvelle-aquitaine';
UPDATE "Article" SET "imageUrl" = '/images/news/arrivee-de-brent-beaudoin.jpg' WHERE "slug" = 'defaite-honorable-rouen';
UPDATE "Article" SET "imageUrl" = '/images/news/arrivee-de-hugo-reinhardt.jpeg' WHERE "slug" = 'stage-hockey-vacances-paques';
UPDATE "Article" SET "imageUrl" = '/images/news/arrivee-de-connor-blake.jpg' WHERE "slug" = 'victoire-bordeaux-exterieur';
UPDATE "Article" SET "imageUrl" = '/images/news/arrivee-de-cole-thiessen.jpeg' WHERE "slug" = 'inauguration-espace-partenaires';
UPDATE "Article" SET "imageUrl" = '/images/news/arrivee-de-dominik-volejnicek.png' WHERE "slug" = 'record-affluence-mars-2026';
