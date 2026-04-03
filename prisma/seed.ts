import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🏒 Seeding Hormadi database...\n')

  // ─── Users ───────────────────────────────────────────
  console.log('Creating admin users...')
  const password = await bcrypt.hash('hormadi2026', 12)

  await prisma.user.upsert({
    where: { email: 'admin@hormadi.fr' },
    update: {},
    create: {
      email: 'admin@hormadi.fr',
      password,
      name: 'Admin Hormadi',
      role: 'super_admin',
    },
  })

  await prisma.user.upsert({
    where: { email: 'billetterie@hormadi.fr' },
    update: {},
    create: {
      email: 'billetterie@hormadi.fr',
      password,
      name: 'Responsable Billetterie',
      role: 'admin_billetterie',
    },
  })

  await prisma.user.upsert({
    where: { email: 'boutique@hormadi.fr' },
    update: {},
    create: {
      email: 'boutique@hormadi.fr',
      password,
      name: 'Responsable Boutique',
      role: 'admin_boutique',
    },
  })

  await prisma.user.upsert({
    where: { email: 'editeur@hormadi.fr' },
    update: {},
    create: {
      email: 'editeur@hormadi.fr',
      password,
      name: 'Éditeur Contenu',
      role: 'editor',
    },
  })

  // ─── Standings ─────────────────────────────────────────
  console.log('Creating standings...')
  const teams = [
    { team: 'Dragons de Rouen', rank: 1, gp: 40, w: 30, l: 5, otw: 3, otl: 2, gf: 152, ga: 82, pts: 99 },
    { team: 'Brûleurs de Loups de Grenoble', rank: 2, gp: 40, w: 27, l: 7, otw: 4, otl: 2, gf: 145, ga: 88, pts: 93 },
    { team: 'Ducs d\'Angers', rank: 3, gp: 40, w: 25, l: 9, otw: 3, otl: 3, gf: 130, ga: 92, pts: 87 },
    { team: 'Hormadi Anglet', rank: 4, gp: 40, w: 23, l: 10, otw: 4, otl: 3, gf: 125, ga: 90, pts: 83 },
    { team: 'Aigles de Nice', rank: 5, gp: 40, w: 21, l: 12, otw: 4, otl: 3, gf: 118, ga: 98, pts: 77 },
    { team: 'Rapaces de Gap', rank: 6, gp: 40, w: 20, l: 14, otw: 3, otl: 3, gf: 112, ga: 102, pts: 72 },
    { team: 'Boxers de Bordeaux', rank: 7, gp: 40, w: 18, l: 15, otw: 4, otl: 3, gf: 108, ga: 105, pts: 67 },
    { team: 'Diables Rouges de Briançon', rank: 8, gp: 40, w: 16, l: 17, otw: 4, otl: 3, gf: 102, ga: 110, pts: 62 },
    { team: 'Jokers de Cergy', rank: 9, gp: 40, w: 14, l: 19, otw: 3, otl: 4, gf: 95, ga: 115, pts: 55 },
    { team: 'Pionniers de Chamonix', rank: 10, gp: 40, w: 12, l: 21, otw: 4, otl: 3, gf: 90, ga: 120, pts: 50 },
    { team: 'Spartiates de Marseille', rank: 11, gp: 40, w: 8, l: 25, otw: 3, otl: 4, gf: 78, ga: 135, pts: 37 },
    { team: 'Gothiques d\'Amiens', rank: 12, gp: 40, w: 5, l: 28, otw: 3, otl: 4, gf: 65, ga: 148, pts: 28 },
  ]

  for (const t of teams) {
    await prisma.standing.upsert({
      where: { team: t.team },
      update: t,
      create: t,
    })
  }

  // ─── Matches ───────────────────────────────────────────
  console.log('Creating matches...')
  const opponents = [
    'Dragons de Rouen', 'Brûleurs de Loups de Grenoble', 'Ducs d\'Angers',
    'Aigles de Nice', 'Rapaces de Gap', 'Boxers de Bordeaux',
    'Diables Rouges de Briançon', 'Jokers de Cergy',
    'Pionniers de Chamonix', 'Spartiates de Marseille', 'Gothiques d\'Amiens',
  ]

  const matchesData = [
    // Past matches — Ligue Magnus
    { date: '2025-09-13T20:30:00', opp: 0, home: true, hs: 3, as: 2, status: 'finished', comp: 'Ligue Magnus' },
    { date: '2025-09-20T20:00:00', opp: 5, home: false, hs: 4, as: 3, status: 'finished', comp: 'Ligue Magnus' },
    { date: '2025-10-04T20:30:00', opp: 1, home: true, hs: 2, as: 4, status: 'finished', comp: 'Ligue Magnus' },
    { date: '2025-10-18T20:00:00', opp: 3, home: false, hs: 3, as: 1, status: 'finished', comp: 'Ligue Magnus' },
    { date: '2025-11-08T20:30:00', opp: 4, home: true, hs: 5, as: 2, status: 'finished', comp: 'Ligue Magnus' },
    { date: '2025-11-22T20:00:00', opp: 6, home: false, hs: 2, as: 3, status: 'finished', comp: 'Ligue Magnus' },
    { date: '2025-12-06T20:30:00', opp: 2, home: true, hs: 4, as: 1, status: 'finished', comp: 'Ligue Magnus' },
    { date: '2025-12-20T20:00:00', opp: 7, home: false, hs: 6, as: 2, status: 'finished', comp: 'Ligue Magnus' },
    { date: '2026-01-10T20:30:00', opp: 8, home: true, hs: 3, as: 3, status: 'finished', comp: 'Ligue Magnus' },
    { date: '2026-01-24T20:00:00', opp: 9, home: false, hs: 5, as: 0, status: 'finished', comp: 'Ligue Magnus' },
    { date: '2026-02-07T20:30:00', opp: 10, home: true, hs: 7, as: 1, status: 'finished', comp: 'Ligue Magnus' },
    { date: '2026-02-21T20:00:00', opp: 0, home: false, hs: 1, as: 4, status: 'finished', comp: 'Ligue Magnus' },
    // Poule de Maintien
    { date: '2026-03-07T20:30:00', opp: 5, home: true, hs: 4, as: 2, status: 'finished', comp: 'Poule de Maintien' },
    { date: '2026-03-21T20:30:00', opp: 1, home: true, hs: 3, as: 3, status: 'finished', comp: 'Poule de Maintien' },
    { date: '2026-03-28T20:30:00', opp: 4, home: true, hs: 4, as: 2, status: 'finished', comp: 'Poule de Maintien' },
    // Upcoming
    { date: '2026-04-05T20:30:00', opp: 0, home: true, hs: null, as: null, status: 'scheduled', comp: 'Poule de Maintien' },
    { date: '2026-04-12T20:00:00', opp: 3, home: false, hs: null, as: null, status: 'scheduled', comp: 'Poule de Maintien' },
    { date: '2026-04-19T20:30:00', opp: 2, home: true, hs: null, as: null, status: 'scheduled', comp: 'Poule de Maintien' },
    { date: '2026-04-26T20:00:00', opp: 6, home: false, hs: null, as: null, status: 'scheduled', comp: 'Poule de Maintien' },
    { date: '2026-05-03T20:30:00', opp: 8, home: true, hs: null, as: null, status: 'scheduled', comp: 'Poule de Maintien' },
  ]

  for (const m of matchesData) {
    const oppName = opponents[m.opp]
    const match = await prisma.match.create({
      data: {
        date: new Date(m.date),
        homeTeam: m.home ? 'Hormadi Anglet' : oppName,
        awayTeam: m.home ? oppName : 'Hormadi Anglet',
        homeScore: m.hs,
        awayScore: m.as,
        venue: m.home ? 'Patinoire de la Barre' : `Patinoire de ${oppName.split(' ').pop()}`,
        status: m.status,
        isHomeGame: m.home,
        competition: m.comp,
      },
    })

    // Add ticket categories for upcoming home games
    if (m.status === 'scheduled' && m.home) {
      const categories = [
        { name: 'Tribune Est', price: 1500, capacity: 350, sold: Math.floor(Math.random() * 200) },
        { name: 'Tribune Ouest', price: 1500, capacity: 350, sold: Math.floor(Math.random() * 200) },
        { name: 'Virage Nord', price: 1200, capacity: 200, sold: Math.floor(Math.random() * 100) },
        { name: 'Virage Sud', price: 1200, capacity: 200, sold: Math.floor(Math.random() * 100) },
        { name: 'Espace VIP', price: 5000, capacity: 50, sold: Math.floor(Math.random() * 30) },
      ]

      for (const cat of categories) {
        await prisma.ticketCategory.create({
          data: { matchId: match.id, ...cat },
        })
      }
    }
  }

  // ─── Articles ──────────────────────────────────────────
  console.log('Creating articles...')
  const articles = [
    { slug: 'victoire-eclatante-gap', title: 'Victoire éclatante 4-2 contre les Rapaces de Gap', excerpt: 'L\'Hormadi enchaîne une troisième victoire consécutive à domicile.', category: 'Match', content: 'Belle victoire de l\'Hormadi ce samedi soir à la Patinoire de la Barre. Face aux Rapaces de Gap, nos joueurs ont livré une prestation solide, s\'imposant 4 buts à 2 devant un public conquis.\n\nLe premier tiers a vu l\'Hormadi prendre rapidement l\'avantage grâce à un but d\'Antoine Dumont dès la 5ème minute. Les Rapaces ont égalisé en fin de tiers, mais l\'Hormadi a repris les commandes au deuxième tiers avec deux buts en supériorité numérique.\n\nLe troisième tiers a été maîtrisé de bout en bout par nos joueurs, avec un quatrième but en cage vide pour sceller la victoire.' },
    { slug: 'nouveau-maillot-collector-2026', title: 'Nouveau maillot collector "Pays Basque" disponible', excerpt: 'Découvrez le nouveau maillot édition limitée aux couleurs du Pays Basque.', category: 'Club', content: 'L\'Hormadi est fier de présenter son nouveau maillot collector édition "Pays Basque". Ce maillot unique rend hommage aux racines basques du club avec un design exclusif intégrant les motifs traditionnels du Pays Basque.\n\nDisponible en édition limitée à 500 exemplaires, ce maillot est disponible dès maintenant dans notre boutique en ligne et au point de vente de la Patinoire de la Barre.' },
    { slug: 'hospitalites-playoffs-2026', title: 'Hospitalités Playoffs : réservez vos espaces VIP', excerpt: 'Les playoffs approchent ! Vivez les matchs dans des conditions exceptionnelles.', category: 'Hospitalités', content: 'Les playoffs de la Ligue Magnus approchent à grands pas et l\'Hormadi vous propose de vivre ces moments intenses dans des conditions exceptionnelles.\n\nNos packages VIP sont disponibles pour l\'ensemble des matchs de playoffs à domicile. Cocktail, repas gastronomique, places premium... Découvrez nos différentes formules.' },
    { slug: 'prolongation-contrat-dumont', title: 'Antoine Dumont prolonge son contrat de 3 ans', excerpt: 'Le capitaine de l\'Hormadi s\'engage pour trois saisons supplémentaires.', category: 'Équipe', content: 'Grande nouvelle pour l\'Hormadi ! Antoine Dumont, capitaine emblématique de l\'équipe, a prolongé son contrat pour trois saisons supplémentaires.\n\nArrivé en 2022, Dumont s\'est imposé comme le leader technique et humain de l\'équipe. Avec 45 points en saison régulière, il est le meilleur pointeur de l\'Hormadi cette saison.' },
    { slug: 'partenariat-region-nouvelle-aquitaine', title: 'Nouveau partenariat avec la Région Nouvelle-Aquitaine', excerpt: 'La Région Nouvelle-Aquitaine devient partenaire officiel de l\'Hormadi.', category: 'Partenaires', content: 'L\'Hormadi est heureux d\'annoncer un nouveau partenariat majeur avec la Région Nouvelle-Aquitaine. Ce partenariat va permettre au club de renforcer ses actions de formation auprès des jeunes et de développer le hockey sur glace dans tout le sud-ouest.' },
    { slug: 'defaite-honorable-rouen', title: 'Défaite honorable 1-4 à Rouen', excerpt: 'Malgré une défaite face au leader, l\'Hormadi a montré de belles choses.', category: 'Match', content: 'Déplacement difficile ce week-end à l\'Île Lacroix pour affronter les Dragons de Rouen, leaders incontestés de la Ligue Magnus. Malgré une défaite 4-1, l\'Hormadi a livré un match courageux.' },
    { slug: 'stage-hockey-vacances-paques', title: 'Stage de hockey pour les vacances de Pâques', excerpt: 'L\'école de hockey organise un stage pendant les vacances de Pâques.', category: 'Club', content: 'L\'école de hockey de l\'Hormadi organise son traditionnel stage de vacances pendant les vacances de Pâques, du 6 au 17 avril 2026. Ouvert aux enfants de 6 à 14 ans, ce stage est encadré par les éducateurs diplômés du club.' },
    { slug: 'victoire-bordeaux-exterieur', title: 'Belle victoire 5-3 à Bordeaux', excerpt: 'L\'Hormadi s\'impose en déplacement chez les Boxers.', category: 'Match', content: 'Excellente performance de l\'Hormadi ce samedi soir à Bordeaux. Nos joueurs se sont imposés 5 buts à 3 face aux Boxers dans un match spectaculaire.' },
    { slug: 'inauguration-espace-partenaires', title: 'Inauguration du nouvel espace partenaires', excerpt: 'La Patinoire de la Barre accueille un tout nouvel espace dédié aux partenaires.', category: 'Partenaires', content: 'L\'Hormadi a inauguré ce jeudi soir un nouvel espace partenaires au sein de la Patinoire de la Barre. Cet espace moderne et convivial permettra d\'accueillir les partenaires du club dans les meilleures conditions.' },
    { slug: 'record-affluence-mars-2026', title: 'Record d\'affluence battu en mars !', excerpt: 'Plus de 1 200 spectateurs pour le derby contre Bordeaux.', category: 'Club', content: 'Record battu ! La Patinoire de la Barre a affiché complet pour la réception des Boxers de Bordeaux ce samedi. Plus de 1 200 spectateurs étaient présents pour encourager l\'Hormadi dans une ambiance électrique.' },
  ]

  for (const a of articles) {
    await prisma.article.create({
      data: {
        ...a,
        published: true,
        publishedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    })
  }

  // ─── Products ──────────────────────────────────────────
  console.log('Creating products...')
  const products = [
    { slug: 'maillot-domicile-2025-2026', name: 'Maillot Domicile 2025-2026', description: 'Maillot officiel de l\'Hormadi pour la saison 2025-2026, porté par les joueurs à la Patinoire de la Barre. Design bleu et rouge aux couleurs du club.', price: 8900, category: 'maillots', sizes: '["S","M","L","XL","XXL"]', stock: 150, featured: true },
    { slug: 'maillot-exterieur-2025-2026', name: 'Maillot Extérieur 2025-2026', description: 'Maillot extérieur blanc avec accents bleu et rouge. Technologie respirante pour un confort optimal.', price: 8900, category: 'maillots', sizes: '["S","M","L","XL","XXL"]', stock: 120, featured: true },
    { slug: 'maillot-collector-pays-basque', name: 'Maillot Collector "Pays Basque"', description: 'Édition limitée à 500 exemplaires. Maillot aux couleurs du Pays Basque avec motifs traditionnels. Numéroté et certifié.', price: 12900, category: 'collectors', sizes: '["S","M","L","XL"]', stock: 45, featured: true },
    { slug: 'sweat-capuche-hormadi', name: 'Sweat à Capuche Hormadi', description: 'Sweat à capuche 100% coton avec logo brodé. Coupe moderne et confortable.', price: 5900, category: 'textile', sizes: '["S","M","L","XL","XXL"]', stock: 200 },
    { slug: 'tshirt-hormadi-bleu', name: 'T-Shirt Hormadi Bleu', description: 'T-shirt officiel bleu marine avec logo imprimé. Coupe ajustée.', price: 2900, category: 'textile', sizes: '["S","M","L","XL","XXL"]', stock: 300 },
    { slug: 'casquette-hormadi', name: 'Casquette Hormadi', description: 'Casquette snapback avec logo brodé. Taille unique ajustable.', price: 2500, category: 'accessoires', stock: 180 },
    { slug: 'echarpe-hormadi', name: 'Écharpe Hormadi', description: 'Écharpe supporters en maille jacquard aux couleurs du club. 150cm de long.', price: 1900, category: 'accessoires', stock: 250 },
    { slug: 'bonnet-hormadi', name: 'Bonnet Hormadi', description: 'Bonnet tricoté avec pompon et logo brodé. Parfait pour les soirs de match.', price: 2200, category: 'accessoires', stock: 200 },
    { slug: 'mug-hormadi', name: 'Mug Hormadi 350ml', description: 'Mug en céramique avec logo Hormadi. Passe au lave-vaisselle.', price: 1200, category: 'accessoires', stock: 400 },
    { slug: 'maillot-enfant-domicile', name: 'Maillot Enfant Domicile', description: 'Maillot domicile taille enfant. Réplique identique au maillot des pros.', price: 5900, category: 'enfant', sizes: '["6-8ans","8-10ans","10-12ans","12-14ans"]', stock: 100 },
    { slug: 'tshirt-enfant-hormadi', name: 'T-Shirt Enfant Hormadi', description: 'T-shirt enfant avec mascottes et logo du club. 100% coton bio.', price: 1900, category: 'enfant', sizes: '["4-6ans","6-8ans","8-10ans","10-12ans"]', stock: 150 },
    { slug: 'palet-dedicace-2026', name: 'Palet Dédicacé Saison 2026', description: 'Palet officiel de la Ligue Magnus dédicacé par l\'ensemble de l\'effectif 2025-2026. Présenté en boîtier.', price: 4900, category: 'collectors', stock: 25, featured: true },
    { slug: 'porte-cles-hormadi', name: 'Porte-clés Logo Hormadi', description: 'Porte-clés en métal émaillé avec logo Hormadi. Finition premium.', price: 800, category: 'accessoires', stock: 500 },
    { slug: 'drapeau-hormadi-150x90', name: 'Drapeau Hormadi 150x90cm', description: 'Grand drapeau Hormadi aux couleurs du club. Parfait pour les matchs et la décoration.', price: 2500, category: 'accessoires', stock: 100 },
    { slug: 'polo-hormadi-classique', name: 'Polo Hormadi Classique', description: 'Polo élégant avec logo brodé sur la poitrine. Coupe regular. Disponible en bleu marine.', price: 4500, category: 'textile', sizes: '["S","M","L","XL","XXL"]', stock: 80 },
  ]

  for (const p of products) {
    await prisma.product.create({ data: p })
  }

  // ─── Partners ──────────────────────────────────────────
  console.log('Creating partners...')
  const partners = [
    // Partenaires Principaux
    { name: 'MJ Développement', category: 'partenaire_principal', website: 'https://www.mj-developpement.com', logoUrl: '/images/partners/mj-developpement.png', order: 1, visible: true },
    { name: 'Communauté Pays Basque', category: 'partenaire_principal', website: 'https://www.communaute-paysbasque.fr', logoUrl: '/images/partners/communaute-pays-basque.png', order: 2, visible: true },
    { name: 'Ville d\'Anglet', category: 'partenaire_principal', website: 'https://www.anglet.fr', logoUrl: '/images/partners/ville-anglet.png', order: 3, visible: true },

    // Partenaires Officiels
    { name: 'Synerglace', category: 'partenaire_officiel', website: 'https://www.synerglace.com', logoUrl: '/images/partners/synerglace.png', order: 1, visible: true },
    { name: 'Région Nouvelle-Aquitaine', category: 'partenaire_officiel', website: 'https://www.nouvelle-aquitaine.fr', logoUrl: '/images/partners/region-nouvelle-aquitaine.png', order: 2, visible: true },
    { name: 'Département Pyrénées-Atlantiques', category: 'partenaire_officiel', website: 'https://www.le64.fr', logoUrl: '/images/partners/departement-64.png', order: 3, visible: true },
    { name: 'Keolis', category: 'partenaire_officiel', website: 'https://www.keolis.com', logoUrl: '/images/partners/keolis.png', order: 4, visible: true },

    // Fournisseurs Officiels
    { name: 'BASK Sport', category: 'fournisseur_officiel', website: 'https://www.basksport.com', logoUrl: '/images/partners/bask-sport.png', order: 1, visible: true },
    { name: 'Côte Basque Sport Santé', category: 'fournisseur_officiel', website: null, logoUrl: '/images/partners/cote-basque-sport-sante.png', order: 2, visible: true },

    // Partenaires Institutionnels
    { name: 'Fédération Française de Hockey sur Glace', category: 'partenaire_institutionnel', website: 'https://www.hockeyfrance.com', logoUrl: '/images/partners/ffhg.png', order: 1, visible: true },
    { name: 'Comité National Olympique', category: 'partenaire_institutionnel', website: 'https://www.comiteolympique.fr', logoUrl: '/images/partners/cnosf.png', order: 2, visible: true },

    // Partenaires
    { name: 'Adour Nettoyage', category: 'partenaire', website: null, logoUrl: '/images/partners/adour-nettoyage.png', order: 1, visible: true },
    { name: 'Auto Basque', category: 'partenaire', website: null, logoUrl: '/images/partners/auto-basque.png', order: 2, visible: true },
    { name: 'Mutuelle du Pays Basque', category: 'partenaire', website: null, logoUrl: '/images/partners/mutuelle-pays-basque.png', order: 3, visible: true },
    { name: 'Biarritz Tourisme', category: 'partenaire', website: 'https://www.tourisme.biarritz.fr', logoUrl: '/images/partners/biarritz-tourisme.png', order: 4, visible: true },
    { name: 'Hôtel de la Barre', category: 'partenaire', website: null, logoUrl: '/images/partners/hotel-de-la-barre.png', order: 5, visible: true },
    { name: 'Salon 707', category: 'partenaire', website: null, logoUrl: '/images/partners/salon-707.png', order: 6, visible: true },
    { name: 'Pizzeria du Port', category: 'partenaire', website: null, logoUrl: '/images/partners/pizzeria-du-port.png', order: 7, visible: true },
    { name: 'Cave des Vignerons', category: 'partenaire', website: null, logoUrl: '/images/partners/cave-vignerons.png', order: 8, visible: true },
  ]

  for (const p of partners) {
    await prisma.partner.create({ data: p })
  }

  console.log('\n✅ Database seeded successfully!')
  console.log('\n📋 Admin accounts:')
  console.log('   admin@hormadi.fr / hormadi2026 (Super Admin)')
  console.log('   billetterie@hormadi.fr / hormadi2026 (Admin Billetterie)')
  console.log('   boutique@hormadi.fr / hormadi2026 (Admin Boutique)')
  console.log('   editeur@hormadi.fr / hormadi2026 (Éditeur)')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
