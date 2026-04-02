'use client'

import Link from 'next/link'
import { Ticket, ShoppingBag, Tv, Crown } from 'lucide-react'
import { CTA_LINKS } from '@/lib/constants'

const ctas = [
  {
    icon: Ticket,
    title: 'Billetterie',
    description: 'Prenez vos places pour vibrer à la Patinoire de la Barre.',
    href: CTA_LINKS.billetterie,
    gradient: 'from-hormadi-red via-red-600 to-red-700',
    external: false,
    image: '/images/cta-billetterie-bg.jpg',
  },
  {
    icon: ShoppingBag,
    title: 'Boutique',
    description: 'Maillots, écharpes et accessoires aux couleurs du club.',
    href: CTA_LINKS.boutique,
    gradient: 'from-hormadi-forest via-emerald-600 to-hormadi-dark',
    external: false,
    image: '/images/cta-boutique-bg.jpg',
  },
  {
    icon: Tv,
    title: 'Magnus TV',
    description: 'Matchs en direct et replays des plus beaux moments.',
    href: CTA_LINKS.magnusTV,
    gradient: 'from-blue-700 via-blue-600 to-blue-900',
    external: true,
    image: '/images/cta-magnustv-bg.jpg',
  },
  {
    icon: Crown,
    title: 'Hospitalités',
    description: 'Vivez le hockey autrement avec nos offres VIP et loges.',
    href: '/hospitalites',
    gradient: 'from-amber-500 via-amber-600 to-amber-800',
    external: false,
    image: '/images/cta-hospitalites-bg.jpg',
  },
]

export default function CTASection() {
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      {/* Full-width black geometric background */}
      <div className="absolute inset-0"
           style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 30%, #111 50%, #1a1a1a 70%, #0c0c0c 100%)' }} />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-[30%] w-[40%] h-full bg-white/[0.02] -skew-x-12" />
        <div className="absolute top-0 left-[35%] w-[30%] h-full bg-white/[0.015] -skew-x-12" />
        <div className="absolute top-0 right-[10%] w-[25%] h-full bg-white/[0.02] skew-x-12" />
      </div>

      <div className="relative z-10 section-padding">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            Vivez l&apos;<span className="text-hormadi-red">expérience</span> Hormadi
          </h2>
          <p className="text-hormadi-muted mt-4 max-w-xl mx-auto text-sm sm:text-base">
            Que vous soyez fan, partenaire ou simple curieux,
            il y a toujours une façon de vibrer avec nous.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ctas.map((cta) => {
            const Icon = cta.icon
            const Component = cta.external ? 'a' : Link
            const extraProps = cta.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {}

            return (
              <Component
                key={cta.title}
                href={cta.href}
                className="group relative rounded-2xl overflow-hidden h-full min-h-[380px]
                           transition-all duration-500 hover:scale-105 active:scale-95"
                {...(extraProps as any)}
              >
                {/* Background image */}
                <img
                  src={cta.image}
                  alt={cta.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Gradient overlay on top of image */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cta.gradient} opacity-40`} />

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-500" />

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col p-6 sm:p-7">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-white/15 backdrop-blur-sm
                                  flex items-center justify-center mb-auto
                                  group-hover:bg-white/25 group-hover:scale-110
                                  transition-all duration-500">
                    <Icon size={28} className="text-white" />
                  </div>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Title and description */}
                  <div>
                    <h3 className="font-black text-xl sm:text-2xl text-white mb-3
                                   group-hover:translate-y-[-4px] transition-transform duration-300">
                      {cta.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/85 leading-relaxed
                                 group-hover:text-white transition-colors duration-300">
                      {cta.description}
                    </p>
                  </div>

                  {/* Link indicator */}
                  <div className="mt-6 flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Découvrir
                    </span>
                    <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center
                                    group-hover:bg-white/40 group-hover:translate-x-1
                                    transition-all duration-300">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Component>
            )
          })}
        </div>
      </div>
    </section>

  )
}
