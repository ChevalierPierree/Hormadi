'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  ChevronRight,
  Trophy,
  Building2,
  Heart,
  Users,
  MapPin,
  Calendar,
  Star,
  Shield,
  ArrowDown,
  Flame,
  Award,
  Clock,
} from 'lucide-react';

/* ─── Verified timeline ────────────────────────────────────────
   Sources: Wikipedia FR, anglethormadiamateur.fr, liguemagnus.com,
   hockeyfactory.fr, cotebasquemadame.fr, francebleu.fr
   ──────────────────────────────────────────────────────────── */
const timelineEvents = [
  {
    year: 1969,
    title: 'Naissance de la Patinoire & Premier Match',
    description:
      'La Patinoire de la Barre ouvre ses portes le 21 juin 1969, construite par le promoteur privé Lépine, inspiré par un voyage au Canada. Le 18 décembre 1969, le premier match de hockey est disputé contre Bordeaux sous le nom d\'Anglet Olympique.',
    icon: Building2,
    accent: 'red' as const,
  },
  {
    year: 1970,
    title: 'Création de l\'Anglet Hormadi Club',
    description:
      'Le club adopte officiellement le nom d\'Anglet Hormadi Club (AHC). "Hormadi" signifie "glace" en basque, ancrant dès l\'origine l\'identité du club dans la culture du Pays Basque. Les joueurs sont surnommés les "Hockeyeurs des Sables".',
    icon: Trophy,
    accent: 'ocean' as const,
  },
  {
    year: 1996,
    title: 'Les Orques & l\'Accession à l\'Élite',
    description:
      'Le club change de surnom pour devenir les "Orques d\'Anglet" et accède pour la première fois à l\'élite du hockey français lors de la saison 1996-1997. La patinoire est rénovée pour accompagner cette montée au plus haut niveau.',
    icon: Star,
    accent: 'red' as const,
  },
  {
    year: 2001,
    title: 'Vice-Champion de France',
    description:
      'Saison historique : l\'Hormadi atteint la finale de la Ligue Magnus. Menés par le capitaine Lionel Bilbao, le gardien Éric Raymond et le coach Karlos Gordovil, les Orques éliminent Angers en quarts et Reims en demi-finales. Le sommet sportif du club.',
    icon: Award,
    accent: 'ocean' as const,
  },
  {
    year: 2007,
    title: 'La Chute & la Résilience',
    description:
      'Relégué de la Ligue Magnus après la saison 2006-2007, le club descend jusqu\'en Division 3 faute de moyens financiers. Mais l\'esprit basque ne s\'éteint pas : la communauté se mobilise pour sauver son club.',
    icon: ArrowDown,
    accent: 'red' as const,
  },
  {
    year: 2009,
    title: 'Champion de France D3 — Invaincu',
    description:
      'Première titre de champion de France de l\'histoire du club ! L\'Hormadi remporte la Division 3 avec un parcours invaincu. Le début d\'une remontée spectaculaire à travers les divisions.',
    icon: Trophy,
    accent: 'ocean' as const,
  },
  {
    year: 2010,
    title: 'Champion de France D2',
    description:
      'Un an seulement après le titre en D3, le club est sacré Champion de France de Division 2 face à Toulouse, devant 1 500 supporters à la Barre. Deux titres en deux ans : la renaissance est en marche.',
    icon: Trophy,
    accent: 'red' as const,
  },
  {
    year: 2011,
    title: 'Le Retour au Nom "Hormadi"',
    description:
      'Le club abandonne le surnom "Orques d\'Anglet" pour revenir à son identité originelle : Hormadi. Ce recentrage sur les racines basques symbolise la fierté retrouvée après les années difficiles.',
    icon: Shield,
    accent: 'ocean' as const,
  },
  {
    year: 2012,
    title: 'Rénovation de la Patinoire',
    description:
      'La Patinoire de la Barre est entièrement restructurée : 6 000 m² rénovés et 800 m² d\'extension au nord pour créer des loges VIP. Le "Chaudron de la Barre" se modernise tout en gardant son âme.',
    icon: Building2,
    accent: 'red' as const,
  },
  {
    year: 2018,
    title: 'Retour en Ligue Magnus',
    description:
      'L\'Hormadi termine premier de Division 1 lors de la saison 2017-2018 et remonte en Ligue Magnus après 12 ans d\'absence, en battant les Albatros de Brest en finale des playoffs. Le rêve redevient réalité.',
    icon: Flame,
    accent: 'ocean' as const,
  },
  {
    year: 2025,
    title: 'Saison 2025-2026 — Ligue Magnus',
    description:
      'L\'Hormadi poursuit son aventure au plus haut niveau du hockey français. Chaque match à la Patinoire de la Barre est une fête, portée par des supporters passionnés et l\'âme du Pays Basque.',
    icon: Trophy,
    accent: 'red' as const,
  },
];

export default function ClubPage() {
  return (
    <div className="min-h-screen bg-hormadi-dark text-white">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION — same pattern as Classement/Calendrier/Actualités
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/hero-histoire.jpg"
          alt="Club Hormadi"
          className="absolute inset-0 z-[1] w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/50 to-hormadi-dark/20" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-hormadi-dark/70 via-transparent to-transparent" />
        <div className="absolute z-[3] top-0 right-0 w-96 h-96 bg-hormadi-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute z-[3] bottom-0 left-0 w-72 h-72 bg-hormadi-ocean/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-[5] h-full flex flex-col justify-end pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Club</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
                  <Clock size={20} className="text-hormadi-red" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
                  Hormadi
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
                NOTRE CLUB
              </h1>
              <p className="text-hormadi-muted mt-3 text-base sm:text-lg max-w-lg">
                Depuis 1970, l'histoire du hockey sur glace au cœur du Pays Basque.
              </p>
            </div>

            {/* Key stat card */}
            <div className="flex gap-3">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10 text-center min-w-[80px]">
                <span className="block text-2xl font-black text-hormadi-red">1970</span>
                <span className="text-[11px] text-hormadi-muted uppercase tracking-wide">Fondation du club</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute z-[5] bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hormadi-red/30 to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════
          TIMELINE SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="px-6 sm:px-8 lg:px-12 py-20 md:py-28 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">Chronologie</span>
          <h2 className="text-4xl md:text-5xl font-black mt-3 leading-tight">
            Les Grandes Dates
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-hormadi-red to-hormadi-ocean mx-auto mt-4" />
        </div>

        <div className="relative">
          {/* Central line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-hormadi-red/60 via-hormadi-ocean/40 to-hormadi-red/60 md:-translate-x-px" />

          <div className="space-y-12 md:space-y-16">
            {timelineEvents.map((event, idx) => {
              const isLeft = idx % 2 === 0;

              return (
                <div key={idx} className="relative">
                  {/* Dot */}
                  <div className={cn(
                    'absolute left-6 md:left-1/2 top-8 w-3 h-3 rounded-full border-2 z-10 -translate-x-1/2',
                    event.accent === 'red'
                      ? 'bg-hormadi-red border-hormadi-red/50 shadow-lg shadow-hormadi-red/30'
                      : 'bg-hormadi-ocean border-hormadi-ocean/50 shadow-lg shadow-hormadi-ocean/30'
                  )} />

                  {/* Card */}
                  <div className={cn(
                    'ml-14 md:ml-0 md:w-[calc(50%-1.5rem)]',
                    isLeft ? 'md:mr-auto md:pr-0' : 'md:ml-auto md:pl-0'
                  )}>
                    <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6 md:p-8 hover:border-white/20 transition-all duration-300 group">
                      <span className={cn(
                        'text-3xl md:text-4xl font-black',
                        event.accent === 'red' ? 'text-hormadi-red' : 'text-hormadi-ocean'
                      )}>
                        {event.year}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-white mt-1 leading-snug">
                        {event.title}
                      </h3>
                      <p className="text-hormadi-ice leading-relaxed text-sm md:text-base mt-3">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PATINOIRE DE LA BARRE
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-hormadi-surface/50 border-y border-hormadi-border">
        <div className="px-6 sm:px-8 lg:px-12 py-20 md:py-28 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-hormadi-dark border border-hormadi-border">
              <img
                src="/images/patinoire-barre.jpg"
                alt="Patinoire de la Barre"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-hormadi-dark/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white font-black text-xl">&quot;Le Chaudron de la Barre&quot;</p>
                <p className="text-hormadi-ice text-sm">Surnom donné par les supporters</p>
              </div>
            </div>

            {/* Content */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">Notre enceinte</span>
              <h2 className="text-4xl md:text-5xl font-black mt-3 mb-6 leading-tight">
                La Patinoire<br />
                <span className="text-hormadi-red">de la Barre</span>
              </h2>

              <p className="text-hormadi-ice leading-relaxed text-base mb-4">
                Ouverte le 21 juin 1969 par le promoteur Lépine — inspiré par un voyage au Canada — la Patinoire de la Barre est le berceau du hockey dans le sud-ouest de la France. Initialement appelée "Palais des Glaces", elle devient propriété municipale en 1976.
              </p>
              <p className="text-hormadi-ice leading-relaxed text-base mb-8">
                Rénovée en 1997 puis entièrement restructurée en 2012, elle bénéficie aujourd&apos;hui d&apos;une surface de 6 000 m² et d&apos;une extension VIP de 800 m². Nichée entre la forêt de Chiberta, l&apos;Adour et l&apos;océan, elle est l&apos;unique patinoire de la région avec celle de Bordeaux.
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-hormadi-dark/50 border border-hormadi-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Users size={18} className="text-hormadi-red" />
                    <span className="text-xs text-hormadi-muted uppercase font-bold">Capacité</span>
                  </div>
                  <p className="text-2xl font-black text-white">1 200</p>
                  <p className="text-xs text-hormadi-muted">places</p>
                </div>

                <div className="bg-hormadi-dark/50 border border-hormadi-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <MapPin size={18} className="text-hormadi-ocean" />
                    <span className="text-xs text-hormadi-muted uppercase font-bold">Glace</span>
                  </div>
                  <p className="text-2xl font-black text-white">56 x 26</p>
                  <p className="text-xs text-hormadi-muted">mètres</p>
                </div>

                <div className="bg-hormadi-dark/50 border border-hormadi-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={18} className="text-hormadi-red" />
                    <span className="text-xs text-hormadi-muted uppercase font-bold">Ouverture</span>
                  </div>
                  <p className="text-2xl font-black text-white">1969</p>
                  <p className="text-xs text-hormadi-muted">21 juin</p>
                </div>

                <div className="bg-hormadi-dark/50 border border-hormadi-border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 size={18} className="text-hormadi-ocean" />
                    <span className="text-xs text-hormadi-muted uppercase font-bold">Rénovation</span>
                  </div>
                  <p className="text-2xl font-black text-white">2012</p>
                  <p className="text-xs text-hormadi-muted">restructuration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          IDENTITÉ BASQUE
      ═══════════════════════════════════════════════════════ */}
      <section className="px-6 sm:px-8 lg:px-12 py-20 md:py-28 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-ocean">Notre identité</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-6 leading-tight">
              L&apos;Esprit<br />
              <span className="text-hormadi-ocean">Basque</span>
            </h2>

            <p className="text-hormadi-ice leading-relaxed text-base mb-4">
              Le nom "Hormadi" signifie "glace" en basque. Adopté dès la création du club en 1970, abandonné au profit des "Orques" en 1996, puis repris avec fierté en 2011, ce nom incarne l&apos;attachement indéfectible du club à ses racines.
            </p>

            <p className="text-hormadi-ice leading-relaxed text-base mb-8">
              Chaque match à la Barre est plus qu&apos;un événement sportif : c&apos;est une célébration de l&apos;identité locale. Le public rugit, les couleurs basques s&apos;affichent fièrement, et l&apos;esprit de communauté qui unit joueurs et supporters fait de l&apos;Hormadi un club unique en France.
            </p>

            {/* Name evolution */}
            <div className="inline-flex flex-col gap-3">
              <div className="inline-flex items-center gap-4 bg-hormadi-surface border border-hormadi-border rounded-lg p-4 w-fit">
                <span className="text-hormadi-red font-black text-sm whitespace-nowrap">1970 — 1996</span>
                <div className="w-px h-8 bg-hormadi-border" />
                <div>
                  <p className="text-white font-bold text-sm">Hockeyeurs des Sables</p>
                  <p className="text-hormadi-muted text-xs">Premier surnom du club</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-4 bg-hormadi-surface border border-hormadi-border rounded-lg p-4 w-fit">
                <span className="text-hormadi-ocean font-black text-sm whitespace-nowrap">1996 — 2011</span>
                <div className="w-px h-8 bg-hormadi-border" />
                <div>
                  <p className="text-white font-bold text-sm">Les Orques d&apos;Anglet</p>
                  <p className="text-hormadi-muted text-xs">Ère de l&apos;accession à l&apos;élite</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-4 bg-hormadi-surface border border-hormadi-border rounded-lg p-4 w-fit">
                <span className="text-hormadi-red font-black text-sm whitespace-nowrap">2011 — Auj.</span>
                <div className="w-px h-8 bg-hormadi-border" />
                <div>
                  <p className="text-white font-bold text-sm">Hormadi</p>
                  <p className="text-hormadi-muted text-xs">"Glace" en basque — retour aux racines</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual block — Hormadi meaning */}
          <div className="flex flex-col gap-0 rounded-2xl overflow-hidden border border-hormadi-border lg:max-w-[440px]">
            {/* Photo — full, no crop */}
            <div className="relative">
              <img
                src="/images/identite-basque.jpg"
                alt="L'identité basque de l'Hormadi"
                className="w-full h-auto block"
              />
              <div className="absolute inset-0 bg-hormadi-dark/35" />
            </div>

            {/* Text content below photo */}
            <div className="bg-hormadi-surface p-8 md:p-10 text-center">
              <p className="text-hormadi-red font-black text-lg uppercase tracking-widest mb-2">Hormadi</p>
              <p className="text-5xl md:text-6xl font-black text-white mb-3">Glace</p>
              <div className="w-12 h-1 bg-gradient-to-r from-hormadi-red to-hormadi-ocean mx-auto mb-4" />
              <p className="text-hormadi-ice text-base leading-relaxed max-w-sm mx-auto">
                Du basque <span className="text-white font-semibold">hor</span> (froid) et <span className="text-white font-semibold">madi</span> (surface). Symbole de force, de pureté et de l&apos;esprit indomptable du Pays Basque.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PALMARÈS
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-t border-hormadi-border"
                 style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 30%, #111 50%, #1a1a1a 70%, #0c0c0c 100%)' }}>
        {/* Geometric diagonal shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-[30%] w-[40%] h-full bg-white/[0.02] -skew-x-12" />
          <div className="absolute top-0 left-[35%] w-[30%] h-full bg-white/[0.015] -skew-x-12" />
          <div className="absolute top-0 right-[10%] w-[25%] h-full bg-white/[0.02] skew-x-12" />
        </div>
        <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-20 md:py-28 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">Palmarès</span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 leading-tight">
              Les Trophées
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-hormadi-red to-hormadi-ocean mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6 text-center group hover:border-hormadi-red/40 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-full bg-hormadi-red/15 border border-hormadi-red/30 flex items-center justify-center mx-auto mb-4">
                <Award size={24} className="text-hormadi-red" />
              </div>
              <p className="text-white font-bold text-base mb-1">Vice-Champion de France</p>
              <p className="text-hormadi-muted text-sm mb-3">Ligue Magnus</p>
              <span className="text-3xl font-black text-hormadi-red mt-auto">2001</span>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6 text-center group hover:border-hormadi-ocean/40 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-full bg-hormadi-ocean/15 border border-hormadi-ocean/30 flex items-center justify-center mx-auto mb-4">
                <Trophy size={24} className="text-hormadi-ocean" />
              </div>
              <p className="text-white font-bold text-base mb-1">Champion de France D3</p>
              <p className="text-hormadi-muted text-sm mb-3">Parcours invaincu</p>
              <span className="text-3xl font-black text-hormadi-ocean mt-auto">2009</span>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6 text-center group hover:border-hormadi-red/40 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-full bg-hormadi-red/15 border border-hormadi-red/30 flex items-center justify-center mx-auto mb-4">
                <Trophy size={24} className="text-hormadi-red" />
              </div>
              <p className="text-white font-bold text-base mb-1">Champion de France D2</p>
              <p className="text-hormadi-muted text-sm mb-3">vs Toulouse</p>
              <span className="text-3xl font-black text-hormadi-red mt-auto">2010</span>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-xl p-6 text-center group hover:border-hormadi-ocean/40 transition-all duration-300 flex flex-col">
              <div className="w-14 h-14 rounded-full bg-hormadi-ocean/15 border border-hormadi-ocean/30 flex items-center justify-center mx-auto mb-4">
                <Trophy size={24} className="text-hormadi-ocean" />
              </div>
              <p className="text-white font-bold text-base mb-1">Champion de Division 1</p>
              <p className="text-hormadi-muted text-sm mb-3">Retour en Magnus</p>
              <span className="text-3xl font-black text-hormadi-ocean mt-auto">2018</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
