'use client'

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

// Classement officiel Ligue Magnus 2025-2026 — Saison régulière (44 matchs)
const DEMO_STANDINGS: Standing[] = [
  { rank: 1,  team: 'Rouen',          pj: 44, v: 31, d: 4,  bp: 168, bc: 90,  pts: 105 },
  { rank: 2,  team: 'Grenoble',       pj: 44, v: 28, d: 8,  bp: 155, bc: 102, pts: 96 },
  { rank: 3,  team: 'Angers',         pj: 44, v: 27, d: 7,  bp: 151, bc: 107, pts: 93 },
  { rank: 4,  team: 'Bordeaux',       pj: 44, v: 21, d: 12, bp: 134, bc: 118, pts: 75 },
  { rank: 5,  team: 'Marseille',      pj: 44, v: 19, d: 16, bp: 125, bc: 129, pts: 68 },
  { rank: 6,  team: 'Nice',           pj: 44, v: 18, d: 18, bp: 118, bc: 132, pts: 64 },
  { rank: 7,  team: 'Briançon',       pj: 44, v: 17, d: 18, bp: 121, bc: 135, pts: 62 },
  { rank: 8,  team: 'Amiens',         pj: 44, v: 15, d: 19, bp: 112, bc: 138, pts: 56 },
  { rank: 9,  team: 'Cergy-Pontoise', pj: 44, v: 12, d: 24, bp: 105, bc: 152, pts: 46 },
  { rank: 10, team: 'Anglet',         pj: 44, v: 12, d: 23, bp: 103, bc: 148, pts: 45, isHormadi: true },
  { rank: 11, team: 'Chamonix',       pj: 44, v: 11, d: 26, bp: 98,  bc: 162, pts: 41 },
  { rank: 12, team: 'Gap',            pj: 44, v: 11, d: 26, bp: 95,  bc: 160, pts: 41 },
]

export default function StandingsPreview() {
  const standings = DEMO_STANDINGS
  const displayStandings = standings.slice(0, 6)

  return (
    <section className="py-16 sm:py-20 bg-hormadi-surface/50">
      <div className="section-padding">
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
