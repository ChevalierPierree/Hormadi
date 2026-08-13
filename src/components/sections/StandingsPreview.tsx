'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import TeamLogo from '@/components/ui/TeamLogo'

type Standing = {
  rank: number
  team: string
  pj: number
  v: number
  d: number
  bp: number
  bc: number
  pts: number
  isHormadi?: boolean
}

function isHormadiTeam(name: string): boolean {
  const lower = name.toLowerCase()
  return lower.includes('anglet') || lower.includes('hormadi')
}

// Fallback (classement final Ligue Magnus 2025-2026) — utilisé si l'API est indisponible
const FALLBACK_STANDINGS: Standing[] = [
  { rank: 1,  team: 'Dragons de Rouen',               pj: 44, v: 32, d: 5,  bp: 184, bc: 90,  pts: 105 },
  { rank: 2,  team: 'Brûleurs de Loups de Grenoble',  pj: 44, v: 29, d: 9,  bp: 196, bc: 101, pts: 96 },
  { rank: 3,  team: "Ducs d'Angers",                  pj: 44, v: 26, d: 11, bp: 159, bc: 101, pts: 93 },
  { rank: 4,  team: 'Boxers de Bordeaux',             pj: 44, v: 22, d: 15, bp: 136, bc: 120, pts: 75 },
  { rank: 5,  team: 'Spartiates de Marseille',        pj: 44, v: 18, d: 18, bp: 132, bc: 135, pts: 68 },
  { rank: 6,  team: 'Aigles de Nice',                 pj: 44, v: 15, d: 17, bp: 130, bc: 143, pts: 64 },
  { rank: 7,  team: 'Diables Rouges de Briançon',     pj: 44, v: 13, d: 18, bp: 120, bc: 144, pts: 62 },
  { rank: 8,  team: "Gothiques d'Amiens",             pj: 44, v: 16, d: 19, bp: 112, bc: 150, pts: 56 },
  { rank: 9,  team: 'Jokers de Cergy-Pontoise',       pj: 44, v: 11, d: 24, bp: 134, bc: 146, pts: 46 },
  { rank: 10, team: 'Hormadi Anglet',                 pj: 44, v: 11, d: 25, bp: 112, bc: 166, pts: 45, isHormadi: true },
  { rank: 11, team: 'Rapaces de Gap',                 pj: 44, v: 9,  d: 25, bp: 112, bc: 167, pts: 41 },
  { rank: 12, team: 'Pionniers de Chamonix',          pj: 44, v: 11, d: 27, bp: 102, bc: 166, pts: 41 },
]

export default function StandingsPreview() {
  const [standings, setStandings] = useState<Standing[]>(FALLBACK_STANDINGS)

  useEffect(() => {
    fetch('/api/standings')
      .then(res => res.json())
      .then(data => {
        const rows = data.standings || []
        if (Array.isArray(rows) && rows.length > 0) {
          setStandings(
            rows.map((s: any) => ({
              rank: s.rank,
              team: s.team,
              pj: s.gp,
              v: s.w,
              d: s.l,
              bp: s.gf,
              bc: s.ga,
              pts: s.pts,
              isHormadi: isHormadiTeam(s.team),
            }))
          )
        }
      })
      .catch(() => {
        // Keep fallback standings
      })
  }, [])

  const displayStandings = standings.slice(0, 6)

  return (
    <section className="relative py-16 sm:py-20 overflow-hidden noise-overlay"
             style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 30%, #111 50%, #1a1a1a 70%, #0c0c0c 100%)' }}>
      {/* Formes géométriques diagonales — même langage visuel que CTASection */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-[30%] w-[40%] h-full bg-white/[0.02] -skew-x-12" />
        <div className="absolute top-0 left-[35%] w-[30%] h-full bg-white/[0.015] -skew-x-12" />
        <div className="absolute top-0 right-[10%] w-[25%] h-full bg-white/[0.02] skew-x-12" />
      </div>
      {/* Halos flous — accent couleur sur fond noir */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-hormadi-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-hormadi-ocean/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />

      <div className="relative z-10 section-padding">
        {/* Header with section red bar */}
        <div className="mb-10 border-l-4 border-hormadi-red pl-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            CLASSEMENT
          </h2>
          <p className="text-hormadi-muted text-sm sm:text-base mt-1">
            Ligue Magnus
          </p>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-lg border border-hormadi-border">
          <table className="w-full">
            <thead>
              <tr className="bg-hormadi-surface/80 border-b border-hormadi-border">
                <th className="px-4 py-4 text-left text-xs font-bold text-hormadi-muted uppercase tracking-wider w-12">
                  #
                </th>
                <th className="px-4 py-4 text-left text-xs font-bold text-hormadi-muted uppercase tracking-wider">
                  Équipe
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-hormadi-muted uppercase tracking-wider">
                  PJ
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-hormadi-muted uppercase tracking-wider">
                  V
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-hormadi-muted uppercase tracking-wider">
                  D
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-hormadi-muted uppercase tracking-wider hidden md:table-cell">
                  BP
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-hormadi-muted uppercase tracking-wider hidden md:table-cell">
                  BC
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-hormadi-muted uppercase tracking-wider hidden md:table-cell">
                  DIFF
                </th>
                <th className="px-4 py-4 text-center text-xs font-bold text-hormadi-red uppercase tracking-wider">
                  PTS
                </th>
              </tr>
            </thead>
            <tbody>
              {displayStandings.map((standing, index) => {
                const diff = standing.bp - standing.bc
                const isHormadi = standing.isHormadi
                const bgColor = isHormadi ? 'bg-hormadi-red/5' : index % 2 === 0 ? 'bg-white/2' : 'bg-transparent'

                return (
                  <tr
                    key={standing.rank}
                    className={cn(
                      'border-b border-hormadi-border/50 transition-all hover:bg-hormadi-red/10 group',
                      bgColor,
                      isHormadi && 'border-l-4 border-l-hormadi-red'
                    )}
                  >
                    <td className="px-4 py-4 font-black text-hormadi-muted group-hover:text-hormadi-red transition-colors">
                      {standing.rank}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <TeamLogo
                          team={standing.team}
                          size={32}
                          isHormadi={isHormadi}
                        />
                        <span
                          className={cn(
                            'text-sm sm:text-base',
                            isHormadi && 'font-bold text-white'
                          )}
                        >
                          {standing.team}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-hormadi-muted">
                      {standing.pj}
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-semibold">
                      {standing.v}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-hormadi-muted">
                      {standing.d}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-hormadi-muted hidden md:table-cell">
                      {standing.bp}
                    </td>
                    <td className="px-4 py-4 text-center text-sm text-hormadi-muted hidden md:table-cell">
                      {standing.bc}
                    </td>
                    <td
                      className={cn(
                        'px-4 py-4 text-center text-sm font-semibold hidden md:table-cell',
                        diff > 0 ? 'text-hormadi-success' : diff < 0 ? 'text-hormadi-red' : 'text-hormadi-muted'
                      )}
                    >
                      {diff > 0 ? '+' : ''}{diff}
                    </td>
                    <td className="px-4 py-4 text-center text-sm sm:text-base font-black text-hormadi-red">
                      {standing.pts}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Separator for more standings hint */}
        {standings.length > 6 && (
          <div className="mt-6 flex items-center justify-center">
            <div className="h-px w-full bg-hormadi-border/30" />
            <span className="px-4 text-xs text-hormadi-muted uppercase font-semibold whitespace-nowrap">
              {standings.length - 6} autres équipes
            </span>
            <div className="h-px w-full bg-hormadi-border/30" />
          </div>
        )}

        {/* Link to full standings */}
        <div className="mt-8 text-center sm:text-right">
          <Link
            href="/classement"
            className="inline-flex items-center gap-2 text-sm font-semibold text-hormadi-red hover:text-white transition-colors group"
          >
            <span>Classement complet</span>
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
