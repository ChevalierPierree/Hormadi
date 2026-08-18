'use client'

import Link from 'next/link'
import { ShoppingBag, ChevronRight, ExternalLink, Clock } from 'lucide-react'
import SocialCTA from '@/components/sections/SocialCTA'
import { CLUB } from '@/lib/constants'

// ─── Boutiques partenaires ──────────────────────────────
// Hub qui renvoie vers les vraies boutiques en ligne des partenaires
// (voir mail Xavier Daramy du 14/10/2025 : la boutique Hormadi n'est pas
// un site marchand unique mais 3 zones cliquables vers des sites tiers).

type ShopLink = {
  name: string
  description: string
  href: string | null
  logoUrl?: string
  comingSoon?: boolean
}

const SHOPS: ShopLink[] = [
  {
    name: 'Hormadi by Pull In',
    description: 'Textile lifestyle officiel : sweats, t-shirts, polos, casquettes et bonnets aux couleurs du club.',
    href: 'https://www.pull-in.com/collections/hormadi',
  },
  {
    name: 'Bauer / Promoglace',
    description: 'Équipement de hockey (patins, crosses, protections) et produits dérivés des clubs partenaires.',
    href: 'https://promoglace.com/634-hormadi-anglet',
  },
  {
    name: 'Full Ace',
    description: 'Boutique officielle des maillots et équipements de jeu — lien à venir.',
    href: null,
    comingSoon: true,
  },
]

export default function BoutiquePage() {
  return (
    <main className="min-h-screen bg-hormadi-dark">
      {/* ─── HERO ─── */}
      <section className="relative h-[45vh] min-h-[360px] max-h-[480px] overflow-hidden -mt-[5.5rem]">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/hero-boutique.jpg"
          alt="Boutique Hormadi"
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
            <span className="text-white">Boutique</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
              <ShoppingBag size={20} className="text-hormadi-red" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
              Saison {CLUB.season}
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight text-white">
            BOUTIQUE
          </h1>
          <p className="text-hormadi-muted mt-3 text-base sm:text-lg max-w-lg">
            Retrouvez les couleurs de l&apos;Hormadi chez nos partenaires officiels.
          </p>
        </div>
      </section>

      {/* ─── SHOP CARDS ─── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOPS.map(shop => (
            <ShopCard key={shop.name} shop={shop} />
          ))}
        </div>
      </section>

      <SocialCTA />
      <div className="py-8" />
    </main>
  )
}

function ShopCard({ shop }: { shop: ShopLink }) {
  const content = (
    <div className="group relative h-full flex flex-col bg-hormadi-surface border border-hormadi-border rounded-2xl overflow-hidden p-8 hover:border-hormadi-red/40 transition-all duration-300">
      <div className="flex-1">
        <div className="w-14 h-14 rounded-xl bg-hormadi-red/10 flex items-center justify-center mb-6 group-hover:bg-hormadi-red/20 transition-colors">
          <ShoppingBag size={26} className="text-hormadi-red" />
        </div>
        <h3 className="text-white font-black text-xl uppercase mb-3">{shop.name}</h3>
        <p className="text-hormadi-muted text-sm leading-relaxed">{shop.description}</p>
      </div>

      <div className="mt-6">
        {shop.comingSoon ? (
          <span className="inline-flex items-center gap-2 text-hormadi-muted text-xs font-bold uppercase tracking-wider">
            <Clock size={14} />
            Bientôt disponible
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-hormadi-red font-bold text-sm uppercase tracking-wider group-hover:gap-3 transition-all">
            Visiter la boutique
            <ExternalLink size={14} />
          </span>
        )}
      </div>
    </div>
  )

  if (!shop.href) {
    return <div className="h-full opacity-70 cursor-not-allowed">{content}</div>
  }

  return (
    <a href={shop.href} target="_blank" rel="noopener noreferrer" className="h-full block">
      {content}
    </a>
  )
}
