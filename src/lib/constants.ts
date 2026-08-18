// ─── Club Info ───────────────────────────────────────────
export const CLUB = {
  name: 'Hormadi',
  fullName: 'Anglet Hormadi Pays Basque',
  city: 'Anglet',
  founded: 1969,
  arena: 'Patinoire de la Barre',
  arenaCapacity: 1200,
  address: '299 avenue de l\'Adour, 64600 Anglet',
  league: 'Synerglace Ligue Magnus',
  season: '2026-2027',
  hashtags: ['#GoHormadi', '#JoTaKelrabaziArte'],
} as const

// ─── Navigation ──────────────────────────────────────────
export const NAV_LINKS = [
  { label: 'Accueil', href: '/' },
  { label: 'Actualités', href: '/actualites' },
  { label: 'Calendrier', href: '/calendrier' },
  { label: 'Classement', href: '/classement' },
  { label: 'Club', href: '/histoire' },
  { label: 'Hospitalités', href: '/hospitalites' },
  { label: 'Partenaires', href: '/partenaires' },
] as const

export const CTA_LINKS = {
  billetterie: '/billetterie',
  boutique: '/boutique',
  magnusTV: 'https://www.magnus.tv',
  instagram: 'https://www.instagram.com/hormadi_officiel',
  facebook: 'https://www.facebook.com/HormadiOfficiel',
  twitter: 'https://twitter.com/HormadiOfficiel',
} as const

// ─── Ligue Magnus Teams with logo paths ─────────────────
export const TEAMS: Record<string, { name: string; fullName: string; short: string; logo: string }> = {
  anglet: { name: 'Anglet', fullName: 'Hormadi Anglet', short: 'ANG', logo: '/images/teams/Anglet.png' },
  amiens: { name: 'Amiens', fullName: 'Gothiques d\'Amiens', short: 'AMI', logo: '/images/teams/Amiens.png' },
  angers: { name: 'Angers', fullName: 'Ducs d\'Angers', short: 'DAN', logo: '/images/teams/Angers.png' },
  bordeaux: { name: 'Bordeaux', fullName: 'Boxers de Bordeaux', short: 'BDX', logo: '/images/teams/Bordeaux.png' },
  briancon: { name: 'Briançon', fullName: 'Diables Rouges de Briançon', short: 'BRI', logo: '/images/teams/Briancon.png' },
  cergy: { name: 'Cergy-Pontoise', fullName: 'Jokers de Cergy', short: 'CER', logo: '/images/teams/Cergy.png' },
  chamonix: { name: 'Chamonix', fullName: 'Pionniers de Chamonix', short: 'CHA', logo: '/images/teams/Chamonix.png' },
  gap: { name: 'Gap', fullName: 'Rapaces de Gap', short: 'GAP', logo: '/images/teams/GAP.png' },
  grenoble: { name: 'Grenoble', fullName: 'Brûleurs de Loups de Grenoble', short: 'GRE', logo: '/images/teams/Grenoble.png' },
  marseille: { name: 'Marseille', fullName: 'Spartiates de Marseille', short: 'MAR', logo: '/images/teams/Marseille.png' },
  nice: { name: 'Nice', fullName: 'Aigles de Nice', short: 'NIC', logo: '/images/teams/Nice.png' },
  rouen: { name: 'Rouen', fullName: 'Dragons de Rouen', short: 'ROU', logo: '/images/teams/Rouen.png' },
}

// ─── Team Lookup Helpers ────────────────────────────────
/** Find a team by any string (name, fullName, short, or partial match) */
export function findTeam(query: string): typeof TEAMS[string] | null {
  const q = query.toLowerCase().trim()
  // Direct key match
  if (TEAMS[q]) return TEAMS[q]
  // Search by short, name, fullName
  for (const team of Object.values(TEAMS)) {
    if (team.short.toLowerCase() === q) return team
    if (team.name.toLowerCase() === q) return team
    if (team.fullName.toLowerCase() === q) return team
    if (team.fullName.toLowerCase().includes(q)) return team
    if (q.includes(team.name.toLowerCase())) return team
  }
  return null
}

// ─── Hospitality Packages ────────────────────────────────
export const HOSPITALITY_PACKAGES = [
  {
    id: 'salon-h',
    name: 'Salon H',
    tagline: 'Là où le match frappe fort.',
    capacity: 100,
    description: 'Offrez-vous une immersion totale dans le match avec le Salon H, situé directement derrière le but. Ressentez chaque action en direct, au plus près du jeu, dans une ambiance animée et conviviale. Ici, on vit le hockey à fond du début à la fin.',
    features: [
      'Prestation en quatre temps',
      'Cocktail dînatoire',
      'Boissons en open-bar',
      'Entrée VIP réservée / parking privatif',
      'Au cœur de l\'action',
      'Accès au salon Eguzki avec les joueurs en après-match',
    ],
    pricing: {
      saisonComplete: 1980,
      packMagnus: 1100,
      packAngloy: 770,
      placeSupplementaire: 90,
      placePonctuelle: 110,
    },
  },
  {
    id: 'loge-1970',
    name: 'Loge 1970',
    tagline: 'Loge VIP d\'exception.',
    capacity: 128,
    description: 'Conçue pour accueillir jusqu\'à 16 convives dans un cadre raffiné et intimiste. Idéalement située, elle offre une vue de choix sur la glace, vous plaçant au cœur de l\'action pour vivre chaque match avec une intensité incomparable.',
    features: [
      'Prestation en 4 temps',
      'Cocktail dînatoire',
      'Prestation traiteur',
      'Boissons en open-bar',
      'Entrée VIP réservée / parking privatif',
      'Loge privative',
      'Accès au salon Eguzki avec les joueurs en après-match',
    ],
    pricing: {
      saisonComplete: 3300,
      packMagnus: 1760,
      packAngloy: 1190,
      placeSupplementaire: 150,
      placePonctuelle: 170,
    },
  },
  {
    id: 'loge-eguzki',
    name: 'Loge Eguzki',
    tagline: 'Nouvelle expérience au plus près de la glace.',
    capacity: 20,
    description: 'Soyez au plus près de l\'action avec un accès direct au bord de glace. Vivez une expérience immersive et authentique, où la passion du sport se mêle au confort et à la proximité du jeu dans une ambiance conviviale.',
    features: [
      'Prestation en quatre temps',
      'Cocktail dînatoire',
      'Boissons en open-bar',
      'Entrée VIP réservée / parking privatif',
      'Accès bord de glace',
      'Passage des joueurs et du coach en après-match',
    ],
    pricing: {
      saisonComplete: 3740,
      packMagnus: 1980,
      packAngloy: 1330,
      placeSupplementaire: 170,
      placePonctuelle: 190,
    },
  },
  {
    id: 'loge-prestige',
    name: 'Loge Prestige',
    tagline: 'Comme à la maison, en mieux.',
    capacity: 16,
    description: 'Entrez dans l\'univers feutré de la Loge Prestige, un salon privé surplombant la glace, où confort et élégance s\'invitent à chaque match. À chaque rencontre, un nouveau restaurateur transforme l\'instant en une célébration du goût.',
    features: [
      'Vue panoramique sur la patinoire',
      'Service en continu tout au long de votre soirée',
      'Avant-match et pauses entre les tiers-temps en salon',
      'Boissons en open-bar',
      'Entrée VIP réservée / parking privatif',
      'Confort',
      'Une expérience gastronomique unique',
      'Accès au salon Eguzki avec les joueurs en après-match',
    ],
    pricing: {
      saisonComplete: 3960,
      packMagnus: 2090,
      packAngloy: 1400,
      placeSupplementaire: 180,
      placePonctuelle: 200,
    },
  },
  {
    id: 'chalet-coach',
    name: 'Chalet Bouney',
    tagline: 'Le match en face-à-face.',
    capacity: 10,
    description: 'Dans une atmosphère boisée et chaleureuse, plongez au cœur du match avec une vue directe sur la glace. Cet espace exclusif mêle convivialité, proximité avec le jeu et instants gourmands. Une expérience au centre de l\'action.',
    features: [
      'Prestation en 4 temps',
      'Cocktail dînatoire',
      'Boissons en open-bar',
      'Entrée VIP réservée / parking privatif',
      'Espace intimiste / proximité immédiate du banc des joueurs',
      'Accès au salon Eguzki avec les joueurs en après-match',
    ],
    pricing: {
      logeCompleteMatch: 2100,
    },
  },
  {
    id: 'chalet-axp',
    name: 'Chalet AXP / DOC E-MAJ',
    tagline: 'L\'esprit pub.',
    capacity: 10,
    description: 'Découvrez un refuge élégant inspiré des pubs irlandais, où bois sombre, cuir patiné et lumières tamisées composent un décor à la fois authentique et feutré. Le chalet AXP / DOC E-MAJ vous accueille pour vivre le match dans un esprit club.',
    features: [
      'Prestation en quatre temps',
      'Cocktail dînatoire',
      'Boissons en open-bar',
      'Entrée VIP réservée / parking privatif',
      'Espace intimiste / proximité immédiate du banc des joueurs',
      'Accès au salon Eguzki avec les joueurs en après-match',
    ],
    pricing: {
      logeCompleteMatch: 2100,
    },
  },
] as const

// ─── H Business ──────────────────────────────────────────
export const H_BUSINESS = {
  name: 'H Business',
  tagline: 'Le réseau d\'affaires de l\'Anglet Hormadi Pays-Basque !',
  description: 'Rejoindre le H Business, c\'est intégrer un écosystème d\'entrepreneurs, dirigeants et décideurs où chaque rencontre peut devenir une opportunité.',
  stats: [
    { value: '8', label: 'formats différents pour une originalité sans faille' },
    { value: '10', label: 'événements exclusifs par saison' },
    { value: '+130', label: 'entreprises membres du H Business' },
    { value: '95%', label: 'de taux de renouvellement' },
  ],
} as const

// ─── Product Categories ──────────────────────────────────
export const PRODUCT_CATEGORIES = [
  { id: 'maillots', label: 'Maillots', icon: 'shirt' },
  { id: 'textile', label: 'Textile', icon: 'shirt' },
  { id: 'accessoires', label: 'Accessoires', icon: 'gem' },
  { id: 'enfant', label: 'Enfant', icon: 'baby' },
  { id: 'collectors', label: 'Collectors', icon: 'star' },
] as const

// ─── Ticket Categories ───────────────────────────────────
export const TICKET_CATEGORIES = [
  { id: 'tribune-est', label: 'Tribune Est', color: '#e4002b' },
  { id: 'tribune-ouest', label: 'Tribune Ouest', color: '#00664f' },
  { id: 'virage-nord', label: 'Virage Nord', color: '#009681' },
  { id: 'virage-sud', label: 'Virage Sud', color: '#a8d7d2' },
  { id: 'vip', label: 'Espace VIP', color: '#e4002b' },
] as const
