'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import TeamLogo from '@/components/ui/TeamLogo'

type Match = {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  isHomeGame: boolean
  status: string
  venue: string
  competition?: string
}

function getShortName(teamName: string): string {
  const map: Record<string, string> = {
    'hormadi': 'ANG', 'anglet': 'ANG',
    'rouen': 'ROU', 'dragons': 'ROU',
    'grenoble': 'GRE', 'brûleurs': 'GRE',
    'gap': 'GAP', 'rapaces': 'GAP',
    'bordeaux': 'BDX', 'boxers': 'BDX',
    'angers': 'DAN', 'ducs': 'DAN',
    'amiens': 'AMI', 'gothiques': 'AMI',
    'cergy': 'CER', 'jokers': 'CER',
    'briançon': 'BRI', 'diables': 'BRI',
    'chamonix': 'CHA', 'pionniers': 'CHA',
    'nice': 'NIC', 'aigles': 'NIC',
    'marseille': 'MAR', 'spartiates': 'MAR',
    'mulhouse': 'MUL', 'scorpions': 'MUL',
    'toulouse': 'TLS',
  }
  const lower = teamName.toLowerCase()
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val
  }
  return teamName.substring(0, 3).toUpperCase()
}

function getCompetitionBadge(competition?: string) {
  switch (competition) {
    case 'Poule de Maintien':
      return { label: 'Maintien', color: 'bg-amber-500/20 text-amber-400' }
    case 'Coupe de France':
      return { label: 'Coupe de France', color: 'bg-blue-500/20 text-blue-400' }
    default:
      return { label: 'Ligue Magnus', color: 'bg-hormadi-red/20 text-hormadi-red' }
  }
}

export default function RecentResults() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/matches?status=completed&limit=3')
      .then(r => r.json())
      .then(data => {
        const list = data.matches || data.data || (Array.isArray(data) ? data : [])
        if (list.length > 0) setMatches(list)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && matches.length === 0) return null

  return (
    <section className="py-20">
      <div className="section-padding">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div className="border-l-4 border-hormadi-red pl-6">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              DERNIERS RÉSULTATS
            </h2>
            <p className="text-hormadi-muted text-sm sm:text-base mt-1">
              Saison 2025-2026
            </p>
          </div>
          <Link
            href="/calendrier"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-hormadi-muted hover:text-hormadi-red transition-colors group"
          >
            Voir tout le calendrier
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 rounded-xl bg-hormadi-surface animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {matches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}

        {/* Mobile link */}
        <Link
          href="/calendrier"
          className="sm:hidden mt-8 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-hormadi-red text-white font-semibold hover:bg-hormadi-red/90 transition-colors w-full"
        >
          Voir tout le calendrier
          <ChevronRight size={16} />
        </Link>
      </div>
    </section>
  )
}

function MatchCard({ match }: { match: Match }) {
  const date = new Date(match.date)
  const hormScore = match.isHomeGame ? match.homeScore : match.awayScore
  const oppScore = match.isHomeGame ? match.awayScore : match.homeScore
  const isWin = (hormScore ?? 0) > (oppScore ?? 0)
  const badge = getCompetitionBadge(match.competition)

  return (
    <div className="bg-hormadi-surface rounded-xl overflow-hidden">
      {/* Top accent bar */}
      <div className={`h-1 ${isWin ? 'bg-emerald-500' : 'bg-hormadi-red'}`} />

      <div className="p-5">
        {/* Date + Competition + Result badge */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-hormadi-muted">
              {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${isWin ? 'bg-emerald-500' : 'bg-hormadi-red'}`}>
            {isWin ? 'V' : 'D'}
          </span>
        </div>

        {/* Teams + Score */}
        <div className="flex items-center justify-between">
          {/* Home team */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <TeamLogo team={getShortName(match.homeTeam)} size={36} isHormadi={match.isHomeGame} />
            <div className="min-w-0">
              <div className={`text-sm font-semibold truncate ${match.isHomeGame ? 'text-white' : 'text-hormadi-muted'}`}>
                {getShortName(match.homeTeam)}
              </div>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center gap-2 px-4">
            <span className={`text-2xl font-black ${(match.homeScore ?? 0) > (match.awayScore ?? 0) ? 'text-white' : 'text-hormadi-muted'}`}>
              {match.homeScore ?? '-'}
            </span>
            <span className="text-hormadi-muted text-lg">-</span>
            <span className={`text-2xl font-black ${(match.awayScore ?? 0) > (match.homeScore ?? 0) ? 'text-white' : 'text-hormadi-muted'}`}>
              {match.awayScore ?? '-'}
            </span>
          </div>

          {/* Away team */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0 justify-end">
            <div className="min-w-0 text-right">
              <div className={`text-sm font-semibold truncate ${!match.isHomeGame ? 'text-white' : 'text-hormadi-muted'}`}>
                {getShortName(match.awayTeam)}
              </div>
            </div>
            <TeamLogo team={getShortName(match.awayTeam)} size={36} isHormadi={!match.isHomeGame} />
          </div>
        </div>

        {/* DOM / EXT */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-end">
          <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${match.isHomeGame ? 'bg-emerald-500/15 text-emerald-400' : 'bg-hormadi-ocean/15 text-hormadi-ocean'}`}>
            {match.isHomeGame ? 'Domicile' : 'Extérieur'}
          </span>
        </div>
      </div>
    </div>
  )
}
