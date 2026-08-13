'use client'

import Link from 'next/link'
import {
  ChevronRight, Users, Heart, Trophy, Clock, Calendar, MapPin,
  Star, Shield, Baby, Snowflake, Medal, ArrowRight, Phone, Mail
} from 'lucide-react'

/* ─── Catégories d'âge ─────────────────────────────────────── */
const CATEGORIES = [
  {
    name: 'Baby Hockey',
    age: '3 – 5 ans',
    icon: Baby,
    color: 'from-pink-500 to-pink-600',
    description: 'Première découverte de la glace en toute sécurité. Développement de la motricité et de l\'équilibre à travers des jeux ludiques.',
    schedule: 'Mercredi 10h-11h / Samedi 10h-11h',
  },
  {
    name: 'École de Glace',
    age: '6 – 8 ans',
    icon: Snowflake,
    color: 'from-cyan-500 to-cyan-600',
    description: 'Apprentissage du patinage et initiation au hockey. Les bases techniques sont posées dans un cadre amusant et bienveillant.',
    schedule: 'Mercredi 11h-12h30 / Samedi 11h-12h',
  },
  {
    name: 'U9 – U11',
    age: '9 – 11 ans',
    icon: Shield,
    color: 'from-blue-500 to-blue-600',
    description: 'Perfectionnement technique et découverte du jeu collectif. Premiers tournois et rencontres inter-clubs.',
    schedule: 'Mardi & Jeudi 17h30-19h / Samedi 13h-14h30',
  },
  {
    name: 'U13 – U15',
    age: '12 – 15 ans',
    icon: Trophy,
    color: 'from-hormadi-red to-red-600',
    description: 'Formation approfondie, tactique de jeu et participation aux championnats régionaux. Développement physique adapté.',
    schedule: 'Lundi, Mercredi & Vendredi 18h-19h30',
  },
  {
    name: 'U17 – U20',
    age: '16 – 20 ans',
    icon: Medal,
    color: 'from-purple-500 to-purple-600',
    description: 'Préparation au haut niveau, championnats nationaux. Passerelle vers l\'équipe première pour les meilleurs éléments.',
    schedule: 'Lundi au Vendredi 18h30-20h',
  },
  {
    name: 'Seniors Loisir',
    age: '18 ans et +',
    icon: Users,
    color: 'from-hormadi-ocean to-teal-600',
    description: 'Hockey plaisir pour adultes, débutants ou confirmés. L\'essentiel : se faire plaisir sur la glace entre passionnés.',
    schedule: 'Mardi & Jeudi 20h30-22h',
  },
]

/* ─── Valeurs du club ──────────────────────────────────────── */
const VALUES = [
  {
    title: 'Passion',
    description: 'Le hockey sur glace est plus qu\'un sport, c\'est un mode de vie partagé par toute une communauté.',
    icon: Heart,
  },
  {
    title: 'Formation',
    description: 'Des éducateurs diplômés accompagnent chaque joueur dans sa progression, quel que soit son niveau.',
    icon: Star,
  },
  {
    title: 'Esprit d\'équipe',
    description: 'La solidarité et le respect sont les fondations du club. Sur la glace comme en dehors.',
    icon: Users,
  },
  {
    title: 'Accessibilité',
    description: 'Le hockey pour tous : des tarifs adaptés et un accueil chaleureux pour chaque famille.',
    icon: Shield,
  },
]

export default function AmateurPage() {
  return (
    <div className="-mt-[5.5rem]">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative h-[45vh] min-h-[350px] max-h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/amateur-section.jpg"
          alt="Section amateur Hormadi"
          className="absolute inset-0 z-[1] w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/50 to-transparent" />

        <div className="relative z-[5] h-full flex flex-col justify-end pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Section Amateur</span>
          </div>

          <div className="flex items-center gap-6">
            <img
              src="/images/logo-amateur.png"
              alt="Logo section amateur"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
            <div>
              <div className="inline-block bg-hormadi-ocean text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 mb-3">
                Association
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                SECTION AMATEUR
              </h1>
              <p className="text-hormadi-muted text-sm sm:text-base mt-2 max-w-xl">
                Le hockey sur glace au Pays Basque depuis 1970
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ INTRO ═══════════════════ */}
      <section className="py-14 sm:py-20">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white mb-6">
                  L'HORMADI, C'EST AUSSI UNE <span className="text-hormadi-ocean">GRANDE FAMILLE</span>
                </h2>
                <p className="text-hormadi-muted leading-relaxed mb-4">
                  Au-delà de l'équipe professionnelle évoluant en Ligue Magnus, l'Hormadi c'est avant tout une association
                  qui fait vivre le hockey sur glace au Pays Basque depuis plus de 50 ans. De la section baby hockey
                  aux seniors loisir, en passant par les équipes jeunes en compétition, le club accueille chaque saison
                  plus de 200 licenciés.
                </p>
                <p className="text-hormadi-muted leading-relaxed mb-4">
                  Encadrée par des éducateurs diplômés et passionnés, la section amateur a pour mission de former les
                  hockeyeurs de demain tout en transmettant les valeurs qui font l'identité de l'Hormadi : la passion,
                  le respect, la solidarité et l'attachement au Pays Basque.
                </p>
                <p className="text-hormadi-muted leading-relaxed">
                  Que vous ayez 3 ans ou 50 ans, débutant ou confirmé, il y a une place pour vous à la Patinoire de la Barre.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 text-center">
                  <p className="text-4xl font-black text-hormadi-ocean mb-1">200+</p>
                  <p className="text-hormadi-muted text-sm">Licenciés</p>
                </div>
                <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 text-center">
                  <p className="text-4xl font-black text-hormadi-red mb-1">6</p>
                  <p className="text-hormadi-muted text-sm">Catégories</p>
                </div>
                <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 text-center">
                  <p className="text-4xl font-black text-white mb-1">50+</p>
                  <p className="text-hormadi-muted text-sm">Ans d'histoire</p>
                </div>
                <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 text-center">
                  <p className="text-4xl font-black text-hormadi-ocean mb-1">10+</p>
                  <p className="text-hormadi-muted text-sm">Éducateurs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CATÉGORIES ═══════════════════ */}
      <section className="py-14 sm:py-20 bg-hormadi-surface/20">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-block bg-hormadi-ocean/10 border border-hormadi-ocean/30 text-hormadi-ocean text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full mb-4">
                Nos catégories
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                UNE PLACE POUR CHACUN
              </h2>
              <p className="text-hormadi-muted max-w-2xl mx-auto">
                Du baby hockey dès 3 ans aux seniors loisir, découvrez nos différentes catégories d'âge et trouvez celle qui vous correspond.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon
                return (
                  <div
                    key={cat.name}
                    className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl overflow-hidden hover:border-hormadi-ocean/40 transition-all group"
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${cat.color}`} />
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                          <p className="text-hormadi-ocean text-sm font-semibold">{cat.age}</p>
                        </div>
                      </div>
                      <p className="text-hormadi-muted text-sm leading-relaxed mb-4">
                        {cat.description}
                      </p>
                      <div className="flex items-center gap-2 text-hormadi-muted/70 text-xs">
                        <Clock size={14} />
                        <span>{cat.schedule}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ VALEURS ═══════════════════ */}
      <section className="py-14 sm:py-20">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                NOS VALEURS
              </h2>
              <p className="text-hormadi-muted max-w-2xl mx-auto">
                Ce qui nous rassemble sur la glace et en dehors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {VALUES.map((val) => {
                const Icon = val.icon
                return (
                  <div key={val.title} className="text-center p-6">
                    <div className="w-14 h-14 rounded-full bg-hormadi-ocean/10 border border-hormadi-ocean/30 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-hormadi-ocean" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{val.title}</h3>
                    <p className="text-hormadi-muted text-sm leading-relaxed">{val.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ INSCRIPTIONS ═══════════════════ */}
      <section className="py-14 sm:py-20 bg-hormadi-surface/20">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-2xl border border-hormadi-border">
              <div className="absolute inset-0 bg-gradient-to-br from-hormadi-ocean/20 via-hormadi-dark to-hormadi-dark" />

              <div className="relative z-10 p-10 sm:p-14 lg:p-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
                      REJOIGNEZ L'AVENTURE
                    </h2>
                    <p className="text-hormadi-muted leading-relaxed mb-6">
                      Les inscriptions pour la saison 2026-2027 sont ouvertes. Venez découvrir le hockey sur glace
                      avec une séance d'essai gratuite ! L'équipement est prêté pour les débutants.
                    </p>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-hormadi-ocean flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-semibold">Patinoire de la Barre</p>
                          <p className="text-hormadi-muted text-sm">Boulevard du BAB, 64600 Anglet</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Phone size={20} className="text-hormadi-ocean flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-semibold">05 59 52 99 00</p>
                          <p className="text-hormadi-muted text-sm">Secrétariat du club</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Mail size={20} className="text-hormadi-ocean flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-semibold">amateur@hormadi.fr</p>
                          <p className="text-hormadi-muted text-sm">Renseignements & inscriptions</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center gap-2 bg-hormadi-ocean text-white font-bold
                                   px-8 py-3.5 rounded-lg hover:bg-hormadi-ocean/90 transition-all
                                   hover:shadow-lg hover:shadow-hormadi-ocean/30 text-sm uppercase tracking-wider group"
                      >
                        Nous contacter
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link
                        href="/hospitalites"
                        className="inline-flex items-center justify-center gap-2 bg-transparent border border-hormadi-border text-white font-bold
                                   px-8 py-3.5 rounded-lg hover:border-hormadi-ocean/50 transition-all text-sm uppercase tracking-wider"
                      >
                        Tarifs & infos
                      </Link>
                    </div>
                  </div>

                  <div className="hidden lg:block">
                    <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-8">
                      <h3 className="text-white font-bold text-lg mb-6">Tarifs indicatifs 2026-2027</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-hormadi-border">
                          <span className="text-hormadi-muted">Baby Hockey (3-5 ans)</span>
                          <span className="text-white font-bold">250 &euro;</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-hormadi-border">
                          <span className="text-hormadi-muted">École de Glace (6-8 ans)</span>
                          <span className="text-white font-bold">300 &euro;</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-hormadi-border">
                          <span className="text-hormadi-muted">Jeunes (U9-U20)</span>
                          <span className="text-white font-bold">400 – 550 &euro;</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-hormadi-muted">Seniors Loisir</span>
                          <span className="text-white font-bold">450 &euro;</span>
                        </div>
                      </div>
                      <p className="text-hormadi-muted/60 text-xs mt-6">
                        * Tarifs licence FFHG incluse. Réductions famille disponibles. L'équipement de base est prêté pour la première saison des débutants.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
