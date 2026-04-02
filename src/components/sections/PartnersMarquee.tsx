import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface Partner {
  id: string
  name: string
  category?: string
  logoUrl?: string
  website?: string
}

const DEMO_PARTNERS: Partner[] = [
  { id: '1', name: 'Burger King', logoUrl: '/images/partenaires/Burger-King.png' },
  { id: '2', name: 'ESG', logoUrl: '/images/partenaires/ESG.png' },
  { id: '3', name: 'Eiffage', logoUrl: '/images/partenaires/Eiffage.png' },
  { id: '4', name: 'Ibis', logoUrl: '/images/partenaires/Ibis.png' },
  { id: '5', name: 'Krys', logoUrl: '/images/partenaires/Krys.png' },
  { id: '6', name: 'Nouvelle Aquitaine', logoUrl: '/images/partenaires/Nouvelle-Aquitaine.png' },
  { id: '7', name: 'Pull In', logoUrl: '/images/partenaires/Pull-in.png' },
  { id: '8', name: 'Société Générale', logoUrl: '/images/partenaires/Societe-Generale.png' },
  { id: '9', name: 'Sud Ouest', logoUrl: '/images/partenaires/Sud-Ouest.png' },
  { id: '10', name: 'V and B', logoUrl: '/images/partenaires/VandB.png' },
]

export default function PartnersMarquee() {
  // Duplicate array for infinite loop effect
  const doubledPartners = [...DEMO_PARTNERS, ...DEMO_PARTNERS]

  return (
    <section className="pt-16 pb-28 sm:pb-36 overflow-hidden">
      {/* Section title */}
      <div className="section-padding mb-12">
        <div className="flex items-end justify-between">
          <div className="border-l-4 border-hormadi-red pl-6">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              NOS PARTENAIRES
            </h2>
            <p className="text-hormadi-muted text-sm sm:text-base mt-1">
              Les entreprises qui soutiennent notre passion
            </p>
          </div>
          <Link href="/partenaires"
                className="hidden sm:inline-flex items-center gap-1 text-sm text-hormadi-muted hover:text-hormadi-red transition-colors group">
            Voir tous les partenaires
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Marquee container */}
      <div className="relative group">
        {/* Left gradient fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-hormadi-dark via-hormadi-dark/50 to-transparent z-20 pointer-events-none" />

        {/* Right gradient fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-hormadi-dark via-hormadi-dark/50 to-transparent z-20 pointer-events-none" />

        {/* Marquee animation */}
        <div className="flex animate-marquee gap-5 group-hover:[animation-play-state:paused]">
          {doubledPartners.map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex-shrink-0 w-32 h-32
                         rounded-xl overflow-hidden
                         bg-white
                         border border-white/20
                         hover:border-white/40
                         transition-all duration-300
                         flex items-center justify-center p-[5px]
                         group/card"
            >
              {partner.logoUrl ? (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-h-[95px] max-w-full object-contain
                             group-hover/card:scale-110 transition-transform duration-300"
                />
              ) : (
                <span className="text-center text-sm font-semibold text-white/80
                               group-hover/card:text-white transition-colors duration-300">
                  {partner.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
