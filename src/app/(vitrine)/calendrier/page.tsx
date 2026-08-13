'use client'

import { useState, useEffect, useMemo } from 'react'
import { Calendar, Filter, Ticket, ShoppingBag, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import TeamLogo from '@/components/ui/TeamLogo'
import Link from 'next/link'
import CTASection from '@/components/sections/CTASection'
import { CLUB } from '@/lib/constants'

interface Match {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  venue: string
  status: string
  isHomeGame: boolean
  competition: string
}

function getShortName(teamName: string): string {
  const map: Record<string, string> = {
    'hormadi': 'ANG', 'anglet': 'ANG',
    'rouen': 'ROU', 'dragons': 'ROU',
    'grenoble': 'GRE', 'brûleurs': 'GRE',
    'gap': 'GAP', 'rapaces': 'GAP',
    'bordeaux': 'BDX', 'boxers': 'BDX',
    'ducs': 'DAN',
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

const COMPETITIONS = [
  { label: 'Toutes', value: 'all' },
  { label: 'Ligue Magnus', value: 'Ligue Magnus' },
  { label: 'Maintien', value: 'Poule de Maintien' },
  { label: 'Coupe de France', value: 'Coupe de France' },
]

const MONTHS = [
  { label: 'Sep', value: '2026-09' },
  { label: 'Oct', value: '2026-10' },
  { label: 'Nov', value: '2026-11' },
  { label: 'Déc', value: '2026-12' },
  { label: 'Jan', value: '2027-01' },
  { label: 'Fév', value: '2027-02' },
  { label: 'Mar', value: '2027-03' },
  { label: 'Avr', value: '2027-04' },
  { label: 'Mai', value: '2027-05' },
]

function getCompBadge(comp: string) {
  switch (comp) {
    case 'Poule de Maintien':
      return { label: 'Maintien', cls: 'bg-amber-500/20 text-amber-400' }
    case 'Coupe de France':
      return { label: 'CDF', cls: 'bg-blue-500/20 text-blue-400' }
    default:
      return { label: 'LM', cls: 'bg-hormadi-red/20 text-hormadi-red' }
  }
}

export default function CalendrierPage() {
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedComp, setSelectedComp] = useState('all')

  useEffect(() => {
    fetch('/api/matches?limit=100')
      .then(r => r.json())
      .then(data => {
        const list = data.matches || data.data || (Array.isArray(data) ? data : [])
        setAllMatches(list)
        const now = new Date()
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        const hasCurrentMonth = list.some((m: Match) => m.date.substring(0, 7) === currentMonth)
        if (hasCurrentMonth) setSelectedMonth(currentMonth)
        else setSelectedMonth('all')
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let matches = [...allMatches]
    if (selectedMonth !== 'all') {
      matches = matches.filter(m => m.date.substring(0, 7) === selectedMonth)
    }
    if (selectedComp !== 'all') {
      matches = matches.filter(m => m.competition === selectedComp)
    }
    return matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [allMatches, selectedMonth, selectedComp])

  const now = new Date()
  const upcoming = filtered.filter(m => m.status === 'scheduled' && new Date(m.date) > now)
  const pastScheduled = filtered.filter(m => m.status === 'scheduled' && new Date(m.date) <= now)
  const finished = [...filtered.filter(m => m.status === 'finished'), ...pastScheduled]

  // Stats
  const totalPlayed = allMatches.filter(m => m.status === 'finished').length
  const wins = allMatches.filter(m => {
    if (m.status !== 'finished' || m.homeScore === null || m.awayScore === null) return false
    const hormScore = m.isHomeGame ? m.homeScore : m.awayScore
    const oppScore = m.isHomeGame ? m.awayScore : m.homeScore
    return hormScore > oppScore
  }).length
  const losses = totalPlayed - wins

  return (
    <div className="min-h-screen bg-hormadi-dark text-white">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden">
        {/* Fallback gradient (behind the image) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />

        {/* Background image */}
        <img
          src="/images/hero-calendrier.jpg"
          alt="Hormadi en action"
          className="absolute inset-0 z-[1] w-full h-full object-cover"
        />

        {/* Dark overlays for text readability */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/50 to-hormadi-dark/20" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-hormadi-dark/70 via-transparent to-transparent" />

        {/* Decorative elements */}
        <div className="absolute z-[3] top-0 right-0 w-96 h-96 bg-hormadi-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute z-[3] bottom-0 left-0 w-72 h-72 bg-hormadi-ocean/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        {/* Content */}
        <div className="relative z-[5] h-full flex flex-col justify-end pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Calendrier</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
                  <Calendar size={20} className="text-hormadi-red" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
                  Saison {CLUB.season}
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
                CALENDRIER
              </h1>
              <p className="text-hormadi-muted mt-3 text-base sm:text-lg max-w-lg">
                Retrouvez tous les matchs, résultats et prochaines rencontres de l&apos;Hormadi Anglet.
              </p>
            </div>

            {/* Stats cards */}
            <div className="flex gap-3">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10 text-center min-w-[80px]">
                <span className="block text-2xl font-black text-white">{totalPlayed}</span>
                <span className="text-[11px] text-hormadi-muted uppercase tracking-wide">Matchs</span>
              </div>
              <div className="bg-emerald-500/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-emerald-500/20 text-center min-w-[80px]">
                <span className="block text-2xl font-black text-emerald-400">{wins}</span>
                <span className="text-[11px] text-emerald-400/70 uppercase tracking-wide">Victoires</span>
              </div>
              <div className="bg-hormadi-red/10 backdrop-blur-sm rounded-xl px-5 py-3 border border-hormadi-red/20 text-center min-w-[80px]">
                <span className="block text-2xl font-black text-hormadi-red">{losses}</span>
                <span className="text-[11px] text-hormadi-red/70 uppercase tracking-wide">Défaites</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade line */}
        <div className="absolute z-[5] bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hormadi-red/30 to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════
          FILTERS + MATCH LIST
      ═══════════════════════════════════════════════════════ */}
      <div className="px-6 sm:px-8 lg:px-12 pt-24 pb-10 mx-auto max-w-7xl">
        {/* Filters */}
        <div className="mb-10 space-y-4">
          {/* Competition filter */}
          <div className="flex items-center gap-3">
            <Filter size={16} className="text-hormadi-muted shrink-0" />
            <div className="flex flex-wrap gap-2">
              {COMPETITIONS.map(c => (
                <button key={c.value} onClick={() => setSelectedComp(c.value)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-sm font-semibold transition-all',
                    selectedComp === c.value
                      ? 'bg-hormadi-red text-white'
                      : 'bg-hormadi-surface border border-hormadi-border text-hormadi-muted hover:text-white'
                  )}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Month filter */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setSelectedMonth('all')}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                selectedMonth === 'all'
                  ? 'bg-white/10 text-white'
                  : 'text-hormadi-muted hover:text-white'
              )}>
              Tous
            </button>
            {MONTHS.map(m => (
              <button key={m.value} onClick={() => setSelectedMonth(m.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold transition-all',
                  selectedMonth === m.value
                    ? 'bg-white/10 text-white'
                    : 'text-hormadi-muted hover:text-white'
                )}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-hormadi-surface rounded-lg animate-pulse" />)}
          </div>
        ) : (
          <>
            {/* Upcoming */}
            {upcoming.length > 0 ? (
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-hormadi-red rounded-full" />
                  Prochains matchs ({upcoming.length})
                </h2>
                <div className="space-y-2">
                  {upcoming.map(match => <MatchRow key={match.id} match={match} />)}
                </div>
              </div>
            ) : (
              <div className="mb-12 bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-8 text-center">
                <p className="text-hormadi-muted text-base">
                  {selectedMonth !== 'all' || selectedComp !== 'all'
                    ? 'Aucun match à venir pour cette sélection.'
                    : 'Plus de match à venir pour cette saison. Rendez-vous la saison prochaine !'}
                </p>
              </div>
            )}

            {/* Results */}
            {finished.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="w-1 h-6 bg-hormadi-ocean rounded-full" />
                  Résultats ({finished.length})
                </h2>
                <div className="space-y-2">
                  {finished.map(match => <MatchRow key={match.id} match={match} />)}
                </div>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="bg-hormadi-surface rounded-xl p-12 text-center">
                <p className="text-hormadi-muted text-lg">Aucun match pour cette sélection.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════
          CTA SECTION — 4 cards (Billetterie, Boutique, Magnus TV, Hospitalités)
      ═══════════════════════════════════════════════════════ */}
      <CTASection />
    </div>
  )
}

function MatchRow({ match }: { match: Match }) {
  const date = new Date(match.date)
  const isFinished = match.status === 'finished'
  const badge = getCompBadge(match.competition)

  const hormScore = match.isHomeGame ? match.homeScore : match.awayScore
  const oppScore = match.isHomeGame ? match.awayScore : match.homeScore
  const isWin = isFinished && (hormScore ?? 0) > (oppScore ?? 0)

  return (
    <div className={cn(
      'flex items-center gap-3 sm:gap-4 py-3 px-4 rounded-lg transition-colors',
      'bg-hormadi-surface/50 hover:bg-hormadi-surface',
      isFinished && isWin && 'border-l-2 border-emerald-500',
      isFinished && !isWin && 'border-l-2 border-hormadi-red',
      !isFinished && 'border-l-2 border-hormadi-ocean'
    )}>
      {/* Date */}
      <div className="text-center min-w-[50px] sm:min-w-[70px]">
        <div className="text-xs text-hormadi-muted uppercase">
          {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
        </div>
        <div className="text-sm font-bold text-white">
          {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
        </div>
      </div>

      {/* Competition badge */}
      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full hidden sm:inline', badge.cls)}>
        {badge.label}
      </span>

      {/* Home team */}
      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
        <span className={cn('text-sm font-semibold truncate', match.isHomeGame ? 'text-white' : 'text-hormadi-muted')}>
          {match.homeTeam}
        </span>
        <TeamLogo team={getShortName(match.homeTeam)} size={28} isHormadi={match.isHomeGame} />
      </div>

      {/* Score or time */}
      <div className="min-w-[60px] text-center">
        {isFinished ? (
          <span className="text-lg font-black text-white">
            {match.homeScore} - {match.awayScore}
          </span>
        ) : (
          <span className="text-sm font-semibold text-hormadi-muted">
            {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {/* Away team */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <TeamLogo team={getShortName(match.awayTeam)} size={28} isHormadi={!match.isHomeGame} />
        <span className={cn('text-sm font-semibold truncate', !match.isHomeGame ? 'text-white' : 'text-hormadi-muted')}>
          {match.awayTeam}
        </span>
      </div>

      {/* Result badge */}
      {isFinished && (
        <span className={cn(
          'text-[10px] font-bold px-2 py-0.5 rounded-full text-white hidden sm:inline',
          isWin ? 'bg-emerald-500' : 'bg-hormadi-red'
        )}>
          {isWin ? 'V' : 'D'}
        </span>
      )}

      {/* DOM / EXT badge */}
      <span className={cn(
        'text-[10px] font-semibold px-2.5 py-0.5 rounded-full hidden sm:inline',
        match.isHomeGame
          ? 'bg-emerald-500/15 text-emerald-400'
          : 'bg-hormadi-ocean/15 text-hormadi-ocean'
      )}>
        {match.isHomeGame ? 'Domicile' : 'Extérieur'}
      </span>
    </div>
  )
}
