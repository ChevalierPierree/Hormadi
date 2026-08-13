'use client';

import Link from 'next/link';
import {
  ChevronRight,
  ChevronDown,
  Crown,
  Check,
  Mail,
  Phone,
  MapPin,
  Star,
  Zap,
  Eye,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import { useState } from 'react';

/* ─── Salon data (from official plaquette PDF) ──────────────── */
const SALONS = [
  {
    id: 'salon-h',
    name: 'Salon H',
    tagline: 'Là où le match frappe fort.',
    capacity: 100,
    headerImage: '/images/hospitalites/header-salon-h.jpg',
    planImage: '/images/hospitalites/plan-salon-h.png',
    description:
      "Immersion totale derrière le but. Vivez chaque action au plus près du jeu, dans une ambiance conviviale et animée. Ici, on vit le hockey à fond.",
    features: [
      'Entrée + Parking VIP',
      'Cocktail dînatoire',
      'Open-bar',
      'Au cœur de l\'action',
      'Après-match avec les joueurs',
    ],
    pricing: {
      saisonComplete: '1 980',
      packMagnus: '1 100',
      packAngloy: '770',
      placeSupplementaire: '90',
      placePonctuelle: '110',
    },
  },
  {
    id: 'loge-1970',
    name: 'Loge 1970',
    tagline: "Loge VIP d'exception.",
    capacity: 128,
    headerImage: '/images/hospitalites/header-loge-1970.jpg',
    planImage: '/images/hospitalites/plan-loge-1970.png',
    description:
      "Jusqu'à 16 convives dans un cadre raffiné et intimiste. Une vue de choix sur la glace pour vivre chaque match avec une intensité incomparable.",
    features: [
      'Entrée + Parking VIP',
      'Cocktail dînatoire',
      'Loge privative',
      'Prestation traiteur',
      'Open-bar',
      'Après-match avec les joueurs',
    ],
    pricing: {
      saisonComplete: '3 300',
      packMagnus: '1 760',
      packAngloy: '1 190',
      placeSupplementaire: '150',
      placePonctuelle: '170',
    },
  },
  {
    id: 'loge-eguzki',
    name: 'Loge Eguzki',
    tagline: 'Nouvelle expérience au plus près de la glace.',
    capacity: 20,
    isPremium: true,
    headerImage: '/images/hospitalites/header-loge-eguzki.jpg',
    planImage: '/images/hospitalites/plan-loge-eguzki.png',
    description:
      "Accès direct au bord de glace pour une expérience immersive et authentique. La passion du sport se mêle au confort dans une ambiance conviviale.",
    features: [
      'Entrée + Parking VIP',
      'Accès bord de glace',
      'Cocktail dînatoire',
      'Open-bar',
      'Passage des joueurs en après-match',
    ],
    pricing: {
      saisonComplete: '3 740',
      packMagnus: '1 980',
      packAngloy: '1 330',
      placeSupplementaire: '170',
      placePonctuelle: '190',
    },
  },
  {
    id: 'loge-prestige',
    name: 'Loge Prestige',
    tagline: 'Comme à la maison, en mieux.',
    capacity: 16,
    isPremium: true,
    headerImage: '/images/hospitalites/header-loge-prestige.jpg',
    planImage: '/images/hospitalites/plan-loge-prestige.png',
    description:
      "Salon privé surplombant la glace, où confort et élégance se mêlent à l'excellence culinaire. Un restaurateur différent à chaque rencontre.",
    features: [
      'Vue panoramique',
      'Entrée + Parking VIP',
      'Service en continu',
      'Expérience gastronomique',
      'Pauses en salon',
      'Open-bar',
      'Après-match avec les joueurs',
    ],
    pricing: {
      saisonComplete: '3 960',
      packMagnus: '2 090',
      packAngloy: '1 400',
      placeSupplementaire: '180',
      placePonctuelle: '200',
    },
  },
  {
    id: 'chalet-coach',
    name: 'Chalet du Coach',
    tagline: 'Le match en face-à-face.',
    capacity: 10,
    isChalet: true,
    headerImage: '/images/hospitalites/header-chalet-coach.jpg',
    planImage: '/images/hospitalites/plan-chalet-coach.png',
    description:
      "Atmosphère boisée et chaleureuse avec vue directe sur la glace. Un espace exclusif mêlant convivialité, proximité avec le jeu et instants gourmands.",
    features: [
      'Entrée + Parking VIP',
      'Cocktail dînatoire',
      'Open-bar',
      'Proximité du banc des joueurs',
      'Après-match avec les joueurs',
    ],
    pricing: {
      logeComplete: '2 100',
    },
  },
  {
    id: 'chalet-axp',
    name: 'Chalet AXP / DOC E-MAJ',
    tagline: "L'esprit pub.",
    capacity: 10,
    isChalet: true,
    headerImage: '/images/hospitalites/header-chalet-axp.jpg',
    planImage: '/images/hospitalites/plan-chalet-axp.png',
    description:
      "Refuge élégant inspiré des pubs irlandais : bois sombre, cuir patiné et lumières tamisées. Vivez le match dans un esprit club, entre échanges et saveurs.",
    features: [
      'Entrée + Parking VIP',
      'Cocktail dînatoire',
      'Open-bar',
      'Proximité du banc des joueurs',
      'Après-match avec les joueurs',
    ],
    pricing: {
      logeComplete: '2 100',
    },
  },
];

export default function HospitalitesPage() {
  return (
    <div className="min-h-screen bg-hormadi-dark text-white">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/hero-hospitalites.jpg"
          alt="Hospitalités Hormadi"
          className="absolute inset-0 z-[1] w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/50 to-hormadi-dark/20" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-hormadi-dark/70 via-transparent to-transparent" />
        <div className="absolute z-[3] top-0 right-0 w-96 h-96 bg-hormadi-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute z-[3] bottom-0 left-0 w-72 h-72 bg-hormadi-ocean/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-[5] h-full flex flex-col justify-end pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Hospitalités</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
                  <Crown size={20} className="text-hormadi-red" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
                  Saison 2026-2027
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
                HOSPITALITÉS
              </h1>
              <p className="text-hormadi-muted mt-3 text-base sm:text-lg max-w-lg">
                Vivez le hockey autrement avec nos offres VIP, loges et salons privés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          INTRO
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <div className="section-padding max-w-4xl mx-auto text-center">
          <p className="text-hormadi-ice text-lg sm:text-xl leading-relaxed">
            Découvrez nos espaces d'hospitalité premium au cœur de la glace. Chaque offre est conçue pour vous offrir une immersion totale dans l'univers du hockey sur glace avec service haut de gamme, gastronomie raffinée et confort d'exception.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SALONS & LOGES
      ═══════════════════════════════════════════════════════ */}
      <section className="pb-20 sm:pb-28">
        <div className="section-padding max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white">
                NOS SALONS & LOGES
              </h2>
              <div className="h-1 w-12 bg-hormadi-red rounded-full" />
            </div>
            <p className="text-hormadi-muted text-base sm:text-lg">
              Choisissez l'expérience qui vous ressemble
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {SALONS.map((salon) => {
              const isPremium = (salon as any).isPremium;
              const isChalet = (salon as any).isChalet;
              const hasFullPricing = 'saisonComplete' in salon.pricing;

              return (
                <div
                  key={salon.id}
                  className={`rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col ${
                    isPremium
                      ? 'border-hormadi-red/40 hover:border-hormadi-red'
                      : 'border-hormadi-border hover:border-hormadi-ocean/50'
                  }`}
                >
                  {/* Header with background image */}
                  <div className="relative overflow-hidden border-b border-hormadi-border">
                    {salon.headerImage && (
                      <>
                        <img
                          src={salon.headerImage}
                          alt={salon.name}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                      </>
                    )}
                    {!salon.headerImage && (
                      <div className={`absolute inset-0 ${
                        isPremium
                          ? 'bg-gradient-to-r from-hormadi-red/15 to-hormadi-red/5'
                          : 'bg-hormadi-surface/80'
                      }`} />
                    )}
                    <div className="relative z-10 p-6 sm:p-8">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl sm:text-3xl font-black text-white">
                          {salon.name}
                        </h3>
                        {isPremium && (
                          <div className="flex items-center gap-0.5">
                            <Star className="w-4 h-4 text-hormadi-red fill-hormadi-red" />
                            <Star className="w-4 h-4 text-hormadi-red fill-hormadi-red" />
                            <Star className="w-4 h-4 text-hormadi-red fill-hormadi-red" />
                          </div>
                        )}
                      </div>
                      <p className="text-white/70 italic mb-3">{salon.tagline}</p>
                      <div className="inline-flex items-center gap-1.5 bg-hormadi-red rounded-lg px-4 py-1.5">
                        <span className="text-white font-black text-base">{salon.capacity}</span>
                        <span className="text-white/80 text-xs font-bold uppercase">places</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 bg-hormadi-surface/50 gap-8 flex-1 flex flex-col">
                    {/* Description + Plan */}
                    <div className="flex flex-col sm:flex-row gap-6">
                      <p className="text-hormadi-ice leading-relaxed flex-1">{salon.description}</p>
                      {salon.planImage && (
                        <div className="flex-shrink-0 rounded-lg overflow-hidden border border-hormadi-border bg-black/50 self-start">
                          <img
                            src={salon.planImage}
                            alt={`Plan ${salon.name}`}
                            className="w-auto h-auto max-w-[220px] lg:max-w-[260px] object-contain"
                          />
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="flex-1">
                      <h4 className="text-hormadi-red font-bold uppercase text-xs mb-4 tracking-wider">
                        Prestations incluses
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {salon.features.map((feature, fidx) => (
                          <li key={fidx} className="flex items-start gap-2.5">
                            <div className="w-5 h-5 rounded-full bg-hormadi-ocean/20 border border-hormadi-ocean/40 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 text-hormadi-ocean" strokeWidth={3} />
                            </div>
                            <span className="text-hormadi-ice text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pricing Accordion */}
                    <PricingAccordion salon={salon} hasFullPricing={hasFullPricing} />

                    {/* CTA */}
                    <Link
                      href="/contact"
                      className="w-full mt-auto py-3.5 px-6 rounded-lg font-bold uppercase text-white text-sm
                                 bg-hormadi-red hover:bg-hormadi-red/90 transition-all duration-300
                                 hover:shadow-lg hover:shadow-hormadi-red/30
                                 flex items-center justify-center gap-2 group"
                    >
                      Réserver cet espace
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          H BUSINESS
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 border-t border-hormadi-border overflow-hidden">
        {/* Geometric BG like Prochain Match (Boxers style) */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 30%, #111 50%, #1a1a1a 70%, #0c0c0c 100%)' }} />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-[30%] w-[40%] h-full bg-white/[0.02] -skew-x-12" />
          <div className="absolute top-0 left-[35%] w-[30%] h-full bg-white/[0.015] -skew-x-12" />
          <div className="absolute top-0 right-[10%] w-[25%] h-full bg-white/[0.02] skew-x-12" />
        </div>

        <div className="relative z-10 section-padding max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-hormadi-red text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 mb-6">
              Réseau d'affaires
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4">
              LE H BUSINESS
            </h2>
            <p className="text-xl sm:text-2xl font-bold text-hormadi-red mb-6">
              Le réseau d'affaires de l'Anglet Hormadi Pays-Basque
            </p>
            <p className="text-gray-400 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
              Rejoindre le H Business, c'est intégrer un écosystème d'entrepreneurs, dirigeants et décideurs où chaque rencontre peut devenir une opportunité. Deux fois par mois, des rendez-vous exclusifs offrent un cadre privilégié pour développer votre réseau.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {[
              { value: '2', label: 'Événements par mois' },
              { value: '+130', label: 'Membres actifs' },
              { value: '+10', label: 'Formats différents' },
              { value: '+90%', label: 'De renouvellement' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/[0.03] border border-white/10 rounded-xl p-6 text-center
                           hover:border-hormadi-red/40 transition-all duration-300"
              >
                <p className="text-3xl sm:text-4xl font-black text-hormadi-red mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: MapPin,
                title: 'Ancrage local',
                description: 'Un réseau ancré au cœur du Pays Basque, connectant les acteurs économiques du territoire.',
              },
              {
                icon: Eye,
                title: 'Visibilité nationale',
                description: 'Votre marque exposée sur la scène de la Ligue Magnus, le plus haut niveau du hockey français.',
              },
              {
                icon: Briefcase,
                title: 'Club business',
                description: 'Un écosystème d\'entrepreneurs et de décideurs pour créer des synergies durables.',
              },
              {
                icon: Zap,
                title: 'Offres exclusives',
                description: 'Des formats uniques et des expériences privilégiées réservées aux membres du réseau.',
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="bg-white/[0.03] border border-white/10 rounded-xl p-6
                             hover:border-hormadi-ocean/40 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-hormadi-ocean/20 border border-hormadi-ocean/40
                                  flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-hormadi-ocean" />
                  </div>
                  <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA DEVENIR PARTENAIRE — Split layout (Fitness Park style)
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="section-padding max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-hormadi-border">
            <div className="absolute inset-0 bg-gradient-to-br from-hormadi-forest via-hormadi-dark to-hormadi-dark" />

            <div className="relative z-10 flex flex-col lg:flex-row">
              {/* Left — Text & CTA */}
              <div className="flex-1 p-10 sm:p-14 lg:p-16 flex flex-col justify-center">
                <div className="inline-block bg-hormadi-red text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 mb-6 w-fit">
                  Partenariat
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                  DEVENEZ<br />PARTENAIRE
                </h2>
                <p className="text-hormadi-muted text-base sm:text-lg max-w-lg mb-4 leading-relaxed">
                  Associez votre image à l'Hormadi et bénéficiez d'une visibilité unique auprès d'un public passionné.
                </p>
                <p className="text-hormadi-muted text-sm max-w-lg mb-8 leading-relaxed">
                  Nous construisons ensemble un partenariat sur-mesure adapté à vos objectifs. Rejoignez un réseau de +130 entreprises partenaires au cœur du Pays Basque.
                </p>

                {/* Commerciaux contacts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/[0.05] border border-white/10 rounded-xl p-5">
                    <h4 className="text-white font-black text-base mb-2">Thomas Carton</h4>
                    <div className="space-y-1.5">
                      <a href="mailto:t.carton@hormadi.fr" className="flex items-center gap-2 text-hormadi-muted text-sm hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5 text-hormadi-red flex-shrink-0" />
                        t.carton@hormadi.fr
                      </a>
                      <a href="tel:+33609331583" className="flex items-center gap-2 text-hormadi-muted text-sm hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5 text-hormadi-red flex-shrink-0" />
                        06 09 33 15 83
                      </a>
                    </div>
                  </div>
                  <div className="bg-white/[0.05] border border-white/10 rounded-xl p-5">
                    <h4 className="text-white font-black text-base mb-2">Philippe Ranger</h4>
                    <div className="space-y-1.5">
                      <a href="mailto:p.ranger@hormadi.fr" className="flex items-center gap-2 text-hormadi-muted text-sm hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5 text-hormadi-red flex-shrink-0" />
                        p.ranger@hormadi.fr
                      </a>
                      <a href="tel:+33785138199" className="flex items-center gap-2 text-hormadi-muted text-sm hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5 text-hormadi-red flex-shrink-0" />
                        07 85 13 81 99
                      </a>
                    </div>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-hormadi-red text-white font-bold
                             px-8 py-3.5 rounded-lg hover:bg-hormadi-red/90 transition-all
                             hover:shadow-lg hover:shadow-hormadi-red/30 text-sm uppercase tracking-wider group text-center"
                >
                  Nous contacter
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Right — Photo with diagonal edge (like Fitness Park) */}
              <div className="relative lg:w-[48%] min-h-[300px] lg:min-h-[450px]"
                   style={{ clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
                <img
                  src="/images/cta-hospitalites.jpg"
                  alt="Hospitalités Hormadi"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hormadi-dark/60 via-transparent to-transparent lg:hidden" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ─── Pricing Accordion Component ──────────────────────────── */
function PricingAccordion({ salon, hasFullPricing }: { salon: typeof SALONS[number]; hasFullPricing: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-t border-hormadi-border pt-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between group"
      >
        <h4 className="text-hormadi-red font-bold uppercase text-sm tracking-wider">
          Tarifs
        </h4>
        <div className="flex items-center gap-2 text-hormadi-muted text-xs group-hover:text-white transition-colors">
          <span>{open ? 'Masquer' : 'Voir les tarifs'}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          open ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="overflow-hidden rounded-lg border border-hormadi-border">
          <table className="w-full text-sm">
            <tbody>
              {hasFullPricing ? (
                <>
                  <tr className="bg-hormadi-ocean/10 border-b border-hormadi-border">
                    <td className="px-5 py-3.5 text-hormadi-ice font-medium">Saison Complète</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-black text-white text-base">{(salon.pricing as any).saisonComplete}€</span>
                      <span className="text-hormadi-muted text-xs ml-1">HT</span>
                    </td>
                  </tr>
                  <tr className="border-b border-hormadi-border">
                    <td className="px-5 py-3.5 text-hormadi-ice font-medium">Pack Magnus</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-black text-white text-base">{(salon.pricing as any).packMagnus}€</span>
                      <span className="text-hormadi-muted text-xs ml-1">HT</span>
                    </td>
                  </tr>
                  <tr className="bg-hormadi-ocean/10 border-b border-hormadi-border">
                    <td className="px-5 py-3.5 text-hormadi-ice font-medium">Pack Angloy</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-black text-white text-base">{(salon.pricing as any).packAngloy}€</span>
                      <span className="text-hormadi-muted text-xs ml-1">HT</span>
                    </td>
                  </tr>
                  <tr className="border-b border-hormadi-border">
                    <td className="px-5 py-3.5 text-hormadi-ice font-medium">Place Supplémentaire Partenaire</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-black text-white text-base">{(salon.pricing as any).placeSupplementaire}€</span>
                      <span className="text-hormadi-muted text-xs ml-1">HT</span>
                    </td>
                  </tr>
                  <tr className="bg-hormadi-ocean/10">
                    <td className="px-5 py-3.5 text-hormadi-ice font-medium">Place Ponctuelle</td>
                    <td className="px-5 py-3.5 text-right">
                      <span className="font-black text-white text-base">{(salon.pricing as any).placePonctuelle}€</span>
                      <span className="text-hormadi-muted text-xs ml-1">HT</span>
                    </td>
                  </tr>
                </>
              ) : (
                <tr className="bg-hormadi-ocean/10">
                  <td className="px-5 py-3.5 text-hormadi-ice font-medium">Loge complète au match (10 personnes)</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-black text-white text-base">{(salon.pricing as any).logeComplete}€</span>
                    <span className="text-hormadi-muted text-xs ml-1">HT</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
