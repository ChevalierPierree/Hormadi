'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Ticket, MapPin } from 'lucide-react'

interface Match {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  venue: string
  homeLogo: string
  awayLogo: string
  time: string
}

// Mapping des logos équipes Magnus
const TEAM_LOGOS: Record<string, string> = {
  'Anglet': '/images/teams/Anglet.png',
  'Chamonix': '/images/teams/Chamonix.png',
  'Grenoble': '/images/teams/Grenoble.png',
  'Marseille': '/images/teams/Marseille.png',
  'Bordeaux': '/images/teams/Bordeaux.png',
  'Rouen': '/images/teams/Rouen.png',
  'Gap': '/images/teams/GAP.png',
  'Amiens': '/images/teams/Amiens.png',
  'Cergy': '/images/teams/Cergy.png',
  'Briançon': '/images/teams/Briancon.png',
  'Angers': '/images/teams/Angers.png',
  'Nice': '/images/teams/Nice.png',
}

// Matchs à domicile uniquement — Patinoire de la Barre
const DEMO_MATCHES: Match[] = [
  {
    id: '1',
    date: '2026-04-07',
    time: '20:30',
    homeTeam: 'Anglet',
    awayTeam: 'Chamonix',
    venue: 'Patinoire de la Barre',
    homeLogo: '/images/teams/Anglet.png',
    awayLogo: '/images/teams/Chamonix.png',
  },
  {
    id: '2',
    date: '2026-04-14',
    time: '20:30',
    homeTeam: 'Anglet',
    awayTeam: 'Grenoble',
    venue: 'Patinoire de la Barre',
    homeLogo: '/images/teams/Anglet.png',
    awayLogo: '/images/teams/Grenoble.png',
  },
  {
    id: '3',
    date: '2026-04-21',
    time: '20:30',
    homeTeam: 'Anglet',
    awayTeam: 'Bordeaux',
    venue: 'Patinoire de la Barre',
    homeLogo: '/images/teams/Anglet.png',
    awayLogo: '/images/teams/Bordeaux.png',
  },
]

function formatMatchDate(dateStr: string): { day: string; month: string; weekday: string } {
  // Parse YYYY-MM-DD safely
  const parts = dateStr.split('T')[0].split('-')
  const year = parseInt(parts[0])
  const month = parseInt(parts[1]) - 1
  const dayNum = parseInt(parts[2])
  const date = new Date(year, month, dayNum)

  const weekdays = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']
  const months = ['JAN', 'FÉV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOÛ', 'SEP', 'OCT', 'NOV', 'DÉC']

  return {
    weekday: weekdays[date.getDay()] || '—',
    day: String(date.getDate()),
    month: months[date.getMonth()] || '—',
  }
}

function getTeamShortName(name: string): string {
  // Retourne le nom court pour l'affichage
  const mapping: Record<string, string> = {
    'Anglet': 'ANGLET',
    'Chamonix': 'CHAMONIX',
    'Grenoble': 'GRENOBLE',
    'Marseille': 'MARSEILLE',
    'Bordeaux': 'BORDEAUX',
    'Rouen': 'ROUEN',
    'Gap': 'GAP',
    'Amiens': 'AMIENS',
    'Cergy': 'CERGY',
    'Briançon': 'BRIANÇON',
    'Angers': 'ANGERS',
    'Nice': 'NICE',
  }
  return mapping[name] || name.toUpperCase()
}

function findTeamLogo(teamName: string): string {
  // Cherche le logo par nom partiel
  for (const [key, logo] of Object.entries(TEAM_LOGOS)) {
    if (teamName.toLowerCase().includes(key.toLowerCase())) {
      return logo
    }
  }
  return ''
}

function mapApiMatch(m: any): Match {
  const homeKey = m.homeTeam || ''
  const awayKey = m.awayTeam || ''
  const dateStr = typeof m.date === 'string' ? m.date : ''

  // Extraire l'heure depuis la date ISO ou utiliser 20:30 par défaut
  let time = '20:30'
  if (dateStr.includes('T')) {
    const timePart = dateStr.split('T')[1]
    if (timePart) {
      time = timePart.substring(0, 5)
      // Si heure = 00:00 c'est probablement pas renseigné
      if (time === '00:00') time = '20:30'
    }
  }

  return {
    id: m.id || String(Math.random()),
    date: dateStr.split('T')[0] || dateStr,
    time,
    homeTeam: homeKey,
    awayTeam: awayKey,
    venue: m.venue || 'Patinoire de la Barre',
    homeLogo: findTeamLogo(homeKey) || '/images/teams/Anglet.png',
    awayLogo: findTeamLogo(awayKey),
  }
}

export default function UpcomingMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/matches?status=upcoming&limit=10')
      .then(res => res.json())
      .then(data => {
        if (data.matches && Array.isArray(data.matches) && data.matches.length > 0) {
          // Filtrer uniquement les matchs à domicile
          const homeMatches = data.matches
            .filter((m: any) => {
              const isHome = m.isHomeGame === true || m.isHomeGame === 1
              const venue = (m.venue || '').toLowerCase()
              return isHome || venue.includes('barre') || venue.includes('anglet')
            })
            .map(mapApiMatch)
            .slice(0, 3)

          setMatches(homeMatches)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Don't render the section at all if loading or no matches
  if (loading) return null
  if (matches.length === 0) {
    return (
      <section className="py-20">
        <div className="section-padding">
          <div className="flex items-end justify-between mb-12">
            <div className="border-l-4 border-hormadi-red pl-6">
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                PROCHAINS MATCHS
              </h2>
              <p className="text-hormadi-muted text-sm sm:text-base mt-1">
                À domicile — Patinoire de la Barre
              </p>
            </div>
          </div>
          <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-12 text-center">
            <p className="text-hormadi-muted text-lg mb-2">Pas de match à domicile à venir pour le moment.</p>
            <p className="text-hormadi-muted/60 text-sm">Consultez le calendrier complet pour retrouver tous les résultats de la saison.</p>
            <Link href="/calendrier" className="inline-flex items-center gap-2 text-hormadi-red hover:text-white transition-colors font-semibold text-sm mt-4">
              Voir le calendrier complet
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="section-padding">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div className="border-l-4 border-hormadi-red pl-6">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              PROCHAINS MATCHS
            </h2>
            <p className="text-hormadi-muted text-sm sm:text-base mt-1">
              À domicile — Patinoire de la Barre
            </p>
          </div>
          <Link
            href="/calendrier"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-hormadi-muted hover:text-hormadi-red transition-colors group"
          >
            Voir le calendrier complet
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Match Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {matches.map((match) => {
            const { weekday, day, month } = formatMatchDate(match.date)
            return (
              <div
                key={match.id}
                className="relative overflow-hidden rounded-xl border border-hormadi-border
                           bg-hormadi-surface/50 hover:border-hormadi-red/40 transition-all duration-300 group"
              >
                {/* Date badge */}
                <div className="bg-hormadi-red px-4 py-3 flex items-center gap-4">
                  <div className="text-center min-w-[40px]">
                    <p className="text-white/70 text-[10px] font-bold uppercase">{weekday}</p>
                    <p className="text-white text-2xl font-black leading-none">{day}</p>
                    <p className="text-white/70 text-[10px] font-bold uppercase">{month}</p>
                  </div>
                  <div className="h-10 w-px bg-white/20" />
                  <div>
                    <p className="text-white font-bold text-sm">{match.time}</p>
                    <div className="flex items-center gap-1 text-white/60 text-[10px]">
                      <MapPin size={10} />
                      <span>{match.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Teams */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center justify-between gap-3 mb-5">
                    {/* Home */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                        <img
                          src={match.homeLogo}
                          alt={match.homeTeam}
                          className="w-11 h-11 object-contain"
                        />
                      </div>
                      <span className="text-white font-bold text-xs text-center uppercase leading-tight">
                        {getTeamShortName(match.homeTeam)}
                      </span>
                    </div>

                    {/* VS */}
                    <span className="text-hormadi-muted font-black text-lg">VS</span>

                    {/* Away */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-md">
                        {match.awayLogo ? (
                          <img
                            src={match.awayLogo}
                            alt={match.awayTeam}
                            className="w-11 h-11 object-contain"
                          />
                        ) : (
                          <span className="text-hormadi-dark font-black text-sm">
                            {match.awayTeam.slice(0, 3).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-white font-bold text-xs text-center uppercase leading-tight">
                        {getTeamShortName(match.awayTeam)}
                      </span>
                    </div>
                  </div>

                  {/* CTA Billetterie */}
                  <a
                    href="/billetterie"
                    className="w-full flex items-center justify-center gap-2 bg-hormadi-red text-white
                               font-bold text-xs uppercase tracking-wider py-3 rounded-lg
                               hover:bg-hormadi-red/90 transition-all hover:shadow-lg hover:shadow-hormadi-red/30"
                  >
                    <Ticket size={14} />
                    Acheter mes places
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 sm:hidden">
          <Link
            href="/calendrier"
            className="inline-flex items-center gap-1 text-sm text-hormadi-muted hover:text-hormadi-red transition-colors group"
          >
            Voir le calendrier complet
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  )
}
