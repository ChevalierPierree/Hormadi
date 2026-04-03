// ─── Demo data for Vercel deployment (no SQLite available) ────

const now = new Date().toISOString()

export const demoStandings = [
  { id: 'ds1', team: 'Dragons de Rouen', rank: 1, gp: 40, w: 30, l: 5, otw: 3, otl: 2, gf: 152, ga: 82, pts: 99, createdAt: now, updatedAt: now },
  { id: 'ds2', team: 'Brûleurs de Loups de Grenoble', rank: 2, gp: 40, w: 27, l: 7, otw: 4, otl: 2, gf: 145, ga: 88, pts: 93, createdAt: now, updatedAt: now },
  { id: 'ds3', team: "Ducs d'Angers", rank: 3, gp: 40, w: 25, l: 9, otw: 3, otl: 3, gf: 130, ga: 92, pts: 87, createdAt: now, updatedAt: now },
  { id: 'ds4', team: 'Hormadi Anglet', rank: 4, gp: 40, w: 23, l: 10, otw: 4, otl: 3, gf: 125, ga: 90, pts: 83, createdAt: now, updatedAt: now },
  { id: 'ds5', team: 'Aigles de Nice', rank: 5, gp: 40, w: 21, l: 12, otw: 4, otl: 3, gf: 118, ga: 98, pts: 77, createdAt: now, updatedAt: now },
  { id: 'ds6', team: 'Rapaces de Gap', rank: 6, gp: 40, w: 20, l: 14, otw: 3, otl: 3, gf: 112, ga: 102, pts: 72, createdAt: now, updatedAt: now },
  { id: 'ds7', team: 'Boxers de Bordeaux', rank: 7, gp: 40, w: 18, l: 15, otw: 4, otl: 3, gf: 108, ga: 105, pts: 67, createdAt: now, updatedAt: now },
  { id: 'ds8', team: 'Diables Rouges de Briançon', rank: 8, gp: 40, w: 16, l: 17, otw: 4, otl: 3, gf: 102, ga: 110, pts: 62, createdAt: now, updatedAt: now },
  { id: 'ds9', team: 'Jokers de Cergy', rank: 9, gp: 40, w: 14, l: 19, otw: 3, otl: 4, gf: 95, ga: 115, pts: 55, createdAt: now, updatedAt: now },
  { id: 'ds10', team: 'Pionniers de Chamonix', rank: 10, gp: 40, w: 12, l: 21, otw: 4, otl: 3, gf: 90, ga: 120, pts: 50, createdAt: now, updatedAt: now },
  { id: 'ds11', team: 'Spartiates de Marseille', rank: 11, gp: 40, w: 8, l: 25, otw: 3, otl: 4, gf: 78, ga: 135, pts: 37, createdAt: now, updatedAt: now },
  { id: 'ds12', team: "Gothiques d'Amiens", rank: 12, gp: 40, w: 5, l: 28, otw: 3, otl: 4, gf: 65, ga: 148, pts: 28, createdAt: now, updatedAt: now },
]

const opponents = [
  'Dragons de Rouen', 'Brûleurs de Loups de Grenoble', "Ducs d'Angers",
  'Aigles de Nice', 'Rapaces de Gap', 'Boxers de Bordeaux',
  'Diables Rouges de Briançon', 'Jokers de Cergy',
  'Pionniers de Chamonix', 'Spartiates de Marseille', "Gothiques d'Amiens",
]

const matchesRaw = [
  { date: '2025-09-13T20:30:00Z', opp: 0, home: true, hs: 3, as: 2, status: 'finished', competition: 'Ligue Magnus' },
  { date: '2025-09-20T20:00:00Z', opp: 5, home: false, hs: 4, as: 3, status: 'finished', competition: 'Ligue Magnus' },
  { date: '2025-10-04T20:30:00Z', opp: 1, home: true, hs: 2, as: 4, status: 'finished', competition: 'Ligue Magnus' },
  { date: '2025-10-18T20:00:00Z', opp: 3, home: false, hs: 3, as: 1, status: 'finished', competition: 'Ligue Magnus' },
  { date: '2025-11-08T20:30:00Z', opp: 4, home: true, hs: 5, as: 2, status: 'finished', competition: 'Ligue Magnus' },
  { date: '2025-11-22T20:00:00Z', opp: 6, home: false, hs: 2, as: 3, status: 'finished', competition: 'Ligue Magnus' },
  { date: '2025-12-06T20:30:00Z', opp: 2, home: true, hs: 4, as: 1, status: 'finished', competition: 'Ligue Magnus' },
  { date: '2025-12-20T20:00:00Z', opp: 7, home: false, hs: 6, as: 2, status: 'finished', competition: 'Ligue Magnus' },
  { date: '2026-01-10T20:30:00Z', opp: 8, home: true, hs: 3, as: 3, status: 'finished', competition: 'Ligue Magnus' },
  { date: '2026-01-24T20:00:00Z', opp: 9, home: false, hs: 5, as: 0, status: 'finished', competition: 'Ligue Magnus' },
  { date: '2026-02-07T20:30:00Z', opp: 10, home: true, hs: 7, as: 1, status: 'finished', competition: 'Ligue Magnus' },
  { date: '2026-02-21T20:00:00Z', opp: 0, home: false, hs: 1, as: 4, status: 'finished', competition: 'Ligue Magnus' },
  { date: '2026-03-07T20:30:00Z', opp: 5, home: true, hs: 4, as: 2, status: 'finished', competition: 'Poule de Maintien' },
  { date: '2026-03-21T20:30:00Z', opp: 1, home: true, hs: 3, as: 3, status: 'finished', competition: 'Poule de Maintien' },
  { date: '2026-03-28T20:30:00Z', opp: 4, home: true, hs: 4, as: 2, status: 'finished', competition: 'Poule de Maintien' },
  { date: '2026-04-05T20:30:00Z', opp: 0, home: true, hs: null, as: null, status: 'scheduled', competition: 'Poule de Maintien' },
  { date: '2026-04-07T18:30:00Z', opp: 8, home: true, hs: null, as: null, status: 'scheduled', competition: 'Poule de Maintien' },
  { date: '2026-04-12T20:00:00Z', opp: 3, home: false, hs: null, as: null, status: 'scheduled', competition: 'Poule de Maintien' },
  { date: '2026-04-19T20:30:00Z', opp: 2, home: true, hs: null, as: null, status: 'scheduled', competition: 'Poule de Maintien' },
  { date: '2026-04-26T20:00:00Z', opp: 6, home: false, hs: null, as: null, status: 'scheduled', competition: 'Poule de Maintien' },
]

export const demoMatches = matchesRaw.map((m, i) => {
  const oppName = opponents[m.opp]
  return {
    id: `dm${i + 1}`,
    date: m.date,
    homeTeam: m.home ? 'Hormadi Anglet' : oppName,
    awayTeam: m.home ? oppName : 'Hormadi Anglet',
    homeScore: m.hs,
    awayScore: m.as,
    venue: m.home ? 'Patinoire de la Barre' : `Patinoire de ${oppName.split(' ').pop()}`,
    status: m.status,
    isHomeGame: m.home,
    competition: m.competition,
    createdAt: now,
    updatedAt: now,
    ticketCategories: m.status === 'scheduled' && m.home ? [
      { id: `tc${i}a`, matchId: `dm${i + 1}`, name: 'Tribune Est', price: 1500, capacity: 350, sold: Math.floor(Math.random() * 200) },
      { id: `tc${i}b`, matchId: `dm${i + 1}`, name: 'Tribune Ouest', price: 1500, capacity: 350, sold: Math.floor(Math.random() * 200) },
      { id: `tc${i}c`, matchId: `dm${i + 1}`, name: 'Virage Nord', price: 1200, capacity: 200, sold: Math.floor(Math.random() * 100) },
      { id: `tc${i}d`, matchId: `dm${i + 1}`, name: 'Virage Sud', price: 1200, capacity: 200, sold: Math.floor(Math.random() * 100) },
      { id: `tc${i}e`, matchId: `dm${i + 1}`, name: 'Espace VIP', price: 5000, capacity: 50, sold: Math.floor(Math.random() * 30) },
    ] : [],
  }
})

export const demoArticles = [
  { id: 'da1', slug: 'victoire-eclatante-gap', title: 'Victoire éclatante 4-2 contre les Rapaces de Gap', excerpt: "L'Hormadi enchaîne une troisième victoire consécutive à domicile.", category: 'Match', content: "Belle victoire de l'Hormadi ce samedi soir à la Patinoire de la Barre. Face aux Rapaces de Gap, nos joueurs ont livré une prestation solide, s'imposant 4 buts à 2 devant un public conquis.\n\nLe premier tiers a vu l'Hormadi prendre rapidement l'avantage grâce à un but d'Antoine Dumont dès la 5ème minute. Les Rapaces ont égalisé en fin de tiers, mais l'Hormadi a repris les commandes au deuxième tiers avec deux buts en supériorité numérique.\n\nLe troisième tiers a été maîtrisé de bout en bout par nos joueurs, avec un quatrième but en cage vide pour sceller la victoire.", published: true, publishedAt: '2026-03-28T18:00:00Z', createdAt: now, updatedAt: now, imageUrl: null },
  { id: 'da2', slug: 'nouveau-maillot-collector-2026', title: 'Nouveau maillot collector "Pays Basque" disponible', excerpt: 'Découvrez le nouveau maillot édition limitée aux couleurs du Pays Basque.', category: 'Club', content: "L'Hormadi est fier de présenter son nouveau maillot collector édition \"Pays Basque\". Ce maillot unique rend hommage aux racines basques du club avec un design exclusif intégrant les motifs traditionnels du Pays Basque.\n\nDisponible en édition limitée à 500 exemplaires, ce maillot est disponible dès maintenant dans notre boutique en ligne et au point de vente de la Patinoire de la Barre.", published: true, publishedAt: '2026-03-25T10:00:00Z', createdAt: now, updatedAt: now, imageUrl: null },
  { id: 'da3', slug: 'hospitalites-playoffs-2026', title: 'Hospitalités Playoffs : réservez vos espaces VIP', excerpt: 'Les playoffs approchent ! Vivez les matchs dans des conditions exceptionnelles.', category: 'Hospitalités', content: "Les playoffs de la Ligue Magnus approchent à grands pas et l'Hormadi vous propose de vivre ces moments intenses dans des conditions exceptionnelles.\n\nNos packages VIP sont disponibles pour l'ensemble des matchs de playoffs à domicile.", published: true, publishedAt: '2026-03-20T14:00:00Z', createdAt: now, updatedAt: now, imageUrl: null },
  { id: 'da4', slug: 'prolongation-contrat-dumont', title: 'Antoine Dumont prolonge son contrat de 3 ans', excerpt: "Le capitaine de l'Hormadi s'engage pour trois saisons supplémentaires.", category: 'Équipe', content: "Grande nouvelle pour l'Hormadi ! Antoine Dumont, capitaine emblématique de l'équipe, a prolongé son contrat pour trois saisons supplémentaires.\n\nArrivé en 2022, Dumont s'est imposé comme le leader technique et humain de l'équipe. Avec 45 points en saison régulière, il est le meilleur pointeur de l'Hormadi cette saison.", published: true, publishedAt: '2026-03-15T09:00:00Z', createdAt: now, updatedAt: now, imageUrl: null },
  { id: 'da5', slug: 'partenariat-region-nouvelle-aquitaine', title: 'Nouveau partenariat avec la Région Nouvelle-Aquitaine', excerpt: "La Région Nouvelle-Aquitaine devient partenaire officiel de l'Hormadi.", category: 'Partenaires', content: "L'Hormadi est heureux d'annoncer un nouveau partenariat majeur avec la Région Nouvelle-Aquitaine. Ce partenariat va permettre au club de renforcer ses actions de formation.", published: true, publishedAt: '2026-03-10T11:00:00Z', createdAt: now, updatedAt: now, imageUrl: null },
  { id: 'da6', slug: 'defaite-honorable-rouen', title: 'Défaite honorable 1-4 à Rouen', excerpt: "Malgré une défaite face au leader, l'Hormadi a montré de belles choses.", category: 'Match', content: "Déplacement difficile ce week-end à l'Île Lacroix pour affronter les Dragons de Rouen, leaders incontestés de la Ligue Magnus. Malgré une défaite 4-1, l'Hormadi a livré un match courageux.", published: true, publishedAt: '2026-03-05T20:00:00Z', createdAt: now, updatedAt: now, imageUrl: null },
  { id: 'da7', slug: 'stage-hockey-vacances-paques', title: 'Stage de hockey pour les vacances de Pâques', excerpt: "L'école de hockey organise un stage pendant les vacances de Pâques.", category: 'Club', content: "L'école de hockey de l'Hormadi organise son traditionnel stage de vacances pendant les vacances de Pâques, du 6 au 17 avril 2026. Ouvert aux enfants de 6 à 14 ans.", published: true, publishedAt: '2026-03-01T08:00:00Z', createdAt: now, updatedAt: now, imageUrl: null },
  { id: 'da8', slug: 'victoire-bordeaux-exterieur', title: 'Belle victoire 5-3 à Bordeaux', excerpt: "L'Hormadi s'impose en déplacement chez les Boxers.", category: 'Match', content: "Excellente performance de l'Hormadi ce samedi soir à Bordeaux. Nos joueurs se sont imposés 5 buts à 3 face aux Boxers dans un match spectaculaire.", published: true, publishedAt: '2026-02-25T21:00:00Z', createdAt: now, updatedAt: now, imageUrl: null },
  { id: 'da9', slug: 'inauguration-espace-partenaires', title: 'Inauguration du nouvel espace partenaires', excerpt: 'La Patinoire de la Barre accueille un tout nouvel espace dédié aux partenaires.', category: 'Partenaires', content: "L'Hormadi a inauguré ce jeudi soir un nouvel espace partenaires au sein de la Patinoire de la Barre.", published: true, publishedAt: '2026-02-20T17:00:00Z', createdAt: now, updatedAt: now, imageUrl: null },
  { id: 'da10', slug: 'record-affluence-mars-2026', title: "Record d'affluence battu en mars !", excerpt: 'Plus de 1 200 spectateurs pour le derby contre Bordeaux.', category: 'Club', content: "Record battu ! La Patinoire de la Barre a affiché complet pour la réception des Boxers de Bordeaux ce samedi. Plus de 1 200 spectateurs étaient présents.", published: true, publishedAt: '2026-02-15T10:00:00Z', createdAt: now, updatedAt: now, imageUrl: null },
]

export const demoProducts = [
  { id: 'dp1', slug: 'maillot-domicile-2025-2026', name: 'Maillot Domicile 2025-2026', description: "Maillot officiel de l'Hormadi pour la saison 2025-2026, porté par les joueurs à la Patinoire de la Barre.", price: 8900, category: 'maillots', sizes: '["S","M","L","XL","XXL"]', stock: 150, featured: true, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp2', slug: 'maillot-exterieur-2025-2026', name: 'Maillot Extérieur 2025-2026', description: 'Maillot extérieur blanc avec accents bleu et rouge. Technologie respirante.', price: 8900, category: 'maillots', sizes: '["S","M","L","XL","XXL"]', stock: 120, featured: true, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp3', slug: 'maillot-collector-pays-basque', name: 'Maillot Collector "Pays Basque"', description: 'Édition limitée à 500 exemplaires. Maillot aux couleurs du Pays Basque.', price: 12900, category: 'collectors', sizes: '["S","M","L","XL"]', stock: 45, featured: true, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp4', slug: 'sweat-capuche-hormadi', name: 'Sweat à Capuche Hormadi', description: 'Sweat à capuche 100% coton avec logo brodé. Coupe moderne.', price: 5900, category: 'textile', sizes: '["S","M","L","XL","XXL"]', stock: 200, featured: false, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp5', slug: 'tshirt-hormadi-bleu', name: 'T-Shirt Hormadi Bleu', description: 'T-shirt officiel bleu marine avec logo imprimé.', price: 2900, category: 'textile', sizes: '["S","M","L","XL","XXL"]', stock: 300, featured: false, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp6', slug: 'casquette-hormadi', name: 'Casquette Hormadi', description: 'Casquette snapback avec logo brodé. Taille unique ajustable.', price: 2500, category: 'accessoires', sizes: null, stock: 180, featured: false, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp7', slug: 'echarpe-hormadi', name: 'Écharpe Hormadi', description: 'Écharpe supporters en maille jacquard aux couleurs du club.', price: 1900, category: 'accessoires', sizes: null, stock: 250, featured: false, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp8', slug: 'bonnet-hormadi', name: 'Bonnet Hormadi', description: 'Bonnet tricoté avec pompon et logo brodé.', price: 2200, category: 'accessoires', sizes: null, stock: 200, featured: false, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp9', slug: 'mug-hormadi', name: 'Mug Hormadi 350ml', description: 'Mug en céramique avec logo Hormadi.', price: 1200, category: 'accessoires', sizes: null, stock: 400, featured: false, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp10', slug: 'maillot-enfant-domicile', name: 'Maillot Enfant Domicile', description: 'Maillot domicile taille enfant.', price: 5900, category: 'enfant', sizes: '["6-8ans","8-10ans","10-12ans","12-14ans"]', stock: 100, featured: false, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp11', slug: 'tshirt-enfant-hormadi', name: 'T-Shirt Enfant Hormadi', description: 'T-shirt enfant avec mascottes et logo du club.', price: 1900, category: 'enfant', sizes: '["4-6ans","6-8ans","8-10ans","10-12ans"]', stock: 150, featured: false, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp12', slug: 'palet-dedicace-2026', name: 'Palet Dédicacé Saison 2026', description: "Palet officiel de la Ligue Magnus dédicacé par l'ensemble de l'effectif.", price: 4900, category: 'collectors', sizes: null, stock: 25, featured: true, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp13', slug: 'porte-cles-hormadi', name: 'Porte-clés Logo Hormadi', description: 'Porte-clés en métal émaillé avec logo Hormadi.', price: 800, category: 'accessoires', sizes: null, stock: 500, featured: false, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp14', slug: 'drapeau-hormadi-150x90', name: 'Drapeau Hormadi 150x90cm', description: 'Grand drapeau Hormadi aux couleurs du club.', price: 2500, category: 'accessoires', sizes: null, stock: 100, featured: false, imageUrl: null, createdAt: now, updatedAt: now },
  { id: 'dp15', slug: 'polo-hormadi-classique', name: 'Polo Hormadi Classique', description: 'Polo élégant avec logo brodé sur la poitrine.', price: 4500, category: 'textile', sizes: '["S","M","L","XL","XXL"]', stock: 80, featured: false, imageUrl: null, createdAt: now, updatedAt: now },
]

export const demoPartners = [
  { id: 'dpa1', name: 'MJ Développement', category: 'partenaire_principal', website: 'https://www.mj-developpement.com', logoUrl: '/images/partners/mj-developpement.png', order: 1, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa2', name: 'Communauté Pays Basque', category: 'partenaire_principal', website: 'https://www.communaute-paysbasque.fr', logoUrl: '/images/partners/communaute-pays-basque.png', order: 2, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa3', name: "Ville d'Anglet", category: 'partenaire_principal', website: 'https://www.anglet.fr', logoUrl: '/images/partners/ville-anglet.png', order: 3, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa4', name: 'Synerglace', category: 'partenaire_officiel', website: 'https://www.synerglace.com', logoUrl: '/images/partners/synerglace.png', order: 1, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa5', name: 'Région Nouvelle-Aquitaine', category: 'partenaire_officiel', website: 'https://www.nouvelle-aquitaine.fr', logoUrl: '/images/partners/region-nouvelle-aquitaine.png', order: 2, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa6', name: 'Département Pyrénées-Atlantiques', category: 'partenaire_officiel', website: 'https://www.le64.fr', logoUrl: '/images/partners/departement-64.png', order: 3, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa7', name: 'Keolis', category: 'partenaire_officiel', website: 'https://www.keolis.com', logoUrl: '/images/partners/keolis.png', order: 4, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa8', name: 'BASK Sport', category: 'fournisseur_officiel', website: 'https://www.basksport.com', logoUrl: '/images/partners/bask-sport.png', order: 1, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa9', name: 'Côte Basque Sport Santé', category: 'fournisseur_officiel', website: null, logoUrl: '/images/partners/cote-basque-sport-sante.png', order: 2, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa10', name: 'Fédération Française de Hockey sur Glace', category: 'partenaire_institutionnel', website: 'https://www.hockeyfrance.com', logoUrl: '/images/partners/ffhg.png', order: 1, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa11', name: 'Comité National Olympique', category: 'partenaire_institutionnel', website: 'https://www.comiteolympique.fr', logoUrl: '/images/partners/cnosf.png', order: 2, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa12', name: 'Adour Nettoyage', category: 'partenaire', website: null, logoUrl: '/images/partners/adour-nettoyage.png', order: 1, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa13', name: 'Auto Basque', category: 'partenaire', website: null, logoUrl: '/images/partners/auto-basque.png', order: 2, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa14', name: 'Mutuelle du Pays Basque', category: 'partenaire', website: null, logoUrl: '/images/partners/mutuelle-pays-basque.png', order: 3, visible: true, createdAt: now, updatedAt: now },
  { id: 'dpa15', name: 'Biarritz Tourisme', category: 'partenaire', website: 'https://www.tourisme.biarritz.fr', logoUrl: '/images/partners/biarritz-tourisme.png', order: 4, visible: true, createdAt: now, updatedAt: now },
]

// Helper to check if we're in demo mode (no database)
export const isDemoMode = !process.env.DATABASE_URL
