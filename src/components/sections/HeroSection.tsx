'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Ticket, ShoppingBag, Tv, ChevronRight, MapPin, Clock, Calendar } from 'lucide-react'
import { CTA_LINKS } from '@/lib/constants'
import TeamLogo from '@/components/ui/TeamLogo'

const HERO_IMAGES = [
  '/images/BG1.jpg',
  '/images/BG2.jpg',
  '/images/BG3.jpg',
  '/images/BG4.jpg',
  '/images/BG5.jpg',
]

function HeroSlideshow() {
  const [current, setCurrent] = useState(0)

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_IMAGES.length)
  }, [])

  // Auto-advance every 6 seconds
  useEffect(() => {
    const timer = setInterval(advance, 6000)
    return () => clearInterval(timer)
  }, [advance])

  return (
    <div className="absolute inset-0">
      {HERO_IMAGES.map((src, idx) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: idx === current ? 1 : 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        </div>
      ))}

      {/* Gradient overlays for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-hormadi-dark via-hormadi-dark/40 to-hormadi-dark/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-hormadi-dark/50 via-hormadi-dark/20 to-transparent" />

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {HERO_IMAGES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-1 rounded-full transition-all duration-500 ${
              idx === current ? 'w-8 bg-hormadi-red' : 'w-3 bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background slideshow */}
      <HeroSlideshow />

      {/* Geometric decorative shapes */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10"
           style={{ clipPath: 'polygon(30% 0, 100% 0, 100% 100%, 0% 100%)' }}>
        <div className="w-full h-full bg-hormadi-red" />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-hormadi-red via-hormadi-ocean to-transparent" />

      {/* Diagonal red accent stripe */}
      <div className="absolute top-20 -right-20 w-[500px] h-[3px] bg-hormadi-red/30 rotate-[-35deg] hidden lg:block" />
      <div className="absolute top-28 -right-20 w-[400px] h-[2px] bg-hormadi-ocean/20 rotate-[-35deg] hidden lg:block" />

      {/* Main content */}
      <div className="relative w-full pb-12 sm:pb-16 lg:pb-20 pt-32 sm:pt-40">
        <div className="section-padding">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-end">
            {/* Left: main content */}
            <div className="lg:col-span-3">
              {/* Title with stacked typography */}
              <h1 className="mb-6 animate-slide-up">
                <span className="block text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black
                                 leading-[0.85] tracking-tighter text-white">
                  HORMADI
                </span>
                <span className="block text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black
                                 leading-[0.9] tracking-tight text-gradient mt-1">
                  PAYS BASQUE
                </span>
              </h1>

              {/* Tagline with red accent bar */}
              <div className="flex items-center gap-4 mb-8 animate-slide-up"
                   style={{ animationDelay: '200ms' }}>
                <div className="w-12 h-1 bg-hormadi-red rounded-full flex-shrink-0" />
                <p className="text-base sm:text-lg text-gray-300 max-w-md">
                  Le hockey sur glace au cœur du Pays Basque.
                  L&apos;intensité de la Ligue Magnus à la Patinoire de la Barre.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 animate-slide-up"
                   style={{ animationDelay: '400ms' }}>
                <Link href={CTA_LINKS.billetterie}
                      className="btn-primary text-base gap-2 group">
                  <Ticket size={20} />
                  Billetterie
                  <ChevronRight size={16}
                                className="group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link href={CTA_LINKS.boutique}
                      className="btn-outline text-base gap-2">
                  <ShoppingBag size={20} />
                  Boutique
                </Link>

                <a href={CTA_LINKS.magnusTV}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="btn-secondary text-base gap-2">
                  <Tv size={20} />
                  Magnus TV
                </a>
              </div>

              {/* Since 1970 */}
              <div className="mt-10 pt-6 border-t border-white/10 animate-slide-up"
                   style={{ animationDelay: '600ms' }}>
                <span className="text-lg sm:text-xl font-bold text-white/80 uppercase tracking-widest">
                  Depuis 1970
                </span>
              </div>
            </div>

            {/* Right: Next match card */}
            <div className="lg:col-span-2 animate-slide-up hidden md:block"
                 style={{ animationDelay: '500ms' }}>
              <NextMatchCard />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

function NextMatchCard() {
  const [nextMatch, setNextMatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 })

  useEffect(() => {
    fetch('/api/matches?status=upcoming&limit=1')
      .then(r => r.json())
      .then(data => {
        if (data.matches?.[0]) setNextMatch(data.matches[0])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Live countdown timer
  useEffect(() => {
    if (!nextMatch) return
    const update = () => {
      const diff = new Date(nextMatch.date).getTime() - Date.now()
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, mins: 0 })
        return
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      })
    }
    update()
    const interval = setInterval(update, 30000) // update every 30s
    return () => clearInterval(interval)
  }, [nextMatch])

  // No upcoming match — show end of season message
  if (!loading && !nextMatch) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-hormadi-surface/90 backdrop-blur-xl">
        <div className="h-1 bg-gradient-to-r from-hormadi-red to-red-700" />
        <div className="p-5 sm:p-6 text-center">
          <Calendar size={32} className="text-hormadi-muted mx-auto mb-3" />
          <p className="text-white font-bold text-sm mb-1">Pas de match à venir</p>
          <p className="text-hormadi-muted text-xs mb-4">
            La saison est terminée ou le calendrier n&apos;est pas encore publié.
          </p>
          <Link href="/calendrier" className="btn-outline w-full text-sm gap-2">
            Voir le calendrier
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    )
  }

  if (loading || !nextMatch) return null

  const match = nextMatch
  const matchDate = new Date(match.date)

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-hormadi-surface/90 backdrop-blur-xl">
      {/* Red top accent */}
      <div className="h-1 bg-gradient-to-r from-hormadi-red to-red-700" />

      <div className="p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-xs font-bold uppercase tracking-widest text-hormadi-red">
            Prochain match
          </span>
          <span className="badge-red text-[10px]">
            {match.competition || 'Ligue Magnus'}
          </span>
        </div>

        {/* Teams matchup */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex flex-col items-center gap-2">
            <TeamLogo team="Anglet" size={56} isHormadi />
            <span className="text-xs font-bold text-white">ANG</span>
          </div>

          <div className="flex flex-col items-center gap-1 px-4">
            <span className="text-2xl font-black text-hormadi-red">VS</span>
            <div className="text-[10px] text-hormadi-muted uppercase">
              {matchDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <TeamLogo team={match.awayTeam || 'Rouen'} size={56} />
            <span className="text-xs font-bold text-white">
              {(match.awayTeam || 'Rouen').substring(0, 3).toUpperCase()}
            </span>
          </div>
        </div>

        {/* Match info */}
        <div className="space-y-2 mb-5 text-sm text-hormadi-muted">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-hormadi-ocean" />
            {matchDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-hormadi-ocean" />
            {matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-hormadi-ocean" />
            {match.venue || 'Patinoire de la Barre, Anglet'}
          </div>
        </div>

        {/* Countdown */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          {[
            { value: countdown.days, label: 'Jours' },
            { value: countdown.hours, label: 'Heures' },
            { value: countdown.mins, label: 'Min' },
          ].map((unit, i) => (
            <div key={i} className="bg-hormadi-dark/60 rounded-lg py-2.5 text-center border border-white/5">
              <div className="text-xl sm:text-2xl font-black text-white">{unit.value}</div>
              <div className="text-[10px] text-hormadi-muted uppercase tracking-wider">{unit.label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {match.isHomeGame ? (
          <Link href={`/billetterie/${match.id}`} className="btn-primary w-full text-sm gap-2">
            <Ticket size={16} />
            Réserver mes places
            <ChevronRight size={14} />
          </Link>
        ) : (
          <Link href="/calendrier" className="btn-outline w-full text-sm gap-2">
            <Calendar size={16} />
            Voir le calendrier
            <ChevronRight size={14} />
          </Link>
        )}
      </div>
    </div>
  )
}
