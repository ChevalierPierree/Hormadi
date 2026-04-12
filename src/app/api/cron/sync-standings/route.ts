/**
 * Cron route: Sync standings from liguemagnus.com into Supabase
 * Runs daily via Vercel Cron — also callable manually via GET
 *
 * Usage:
 *   GET /api/cron/sync-standings
 *   GET /api/cron/sync-standings?competition=pm   (for Poule de Maintien)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { scrapeStandings, LIGUE_MAGNUS_URLS } from '@/lib/scraper'

export const dynamic = 'force-dynamic'
export const maxDuration = 30 // seconds

const SEASON = '2025-2026'

export async function GET(request: NextRequest) {
  try {
    // Optional: verify cron secret for Vercel Cron
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Allow without auth in dev or if CRON_SECRET is not set
      if (process.env.NODE_ENV === 'production' && cronSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const { searchParams } = new URL(request.url)
    const competitionParam = searchParams.get('competition')

    // Determine which standings to scrape
    const targets: { url: string; competition: string }[] = []

    if (competitionParam === 'pm') {
      targets.push({
        url: LIGUE_MAGNUS_URLS.standingsPM,
        competition: 'Poule de Maintien',
      })
    } else if (competitionParam === 'regular') {
      targets.push({
        url: LIGUE_MAGNUS_URLS.standingsRegular,
        competition: 'Ligue Magnus',
      })
    } else {
      // Default: sync both
      targets.push(
        { url: LIGUE_MAGNUS_URLS.standingsRegular, competition: 'Ligue Magnus' },
        { url: LIGUE_MAGNUS_URLS.standingsPM, competition: 'Poule de Maintien' },
      )
    }

    const results: { competition: string; count: number; error?: string }[] = []

    for (const target of targets) {
      try {
        const scraped = await scrapeStandings(target.url)

        if (scraped.length === 0) {
          results.push({
            competition: target.competition,
            count: 0,
            error: 'No standings found — page structure may have changed',
          })
          continue
        }

        // Upsert each standing into the database
        let upserted = 0
        for (const s of scraped) {
          await prisma.standing.upsert({
            where: {
              team_competition_season: {
                team: s.team,
                competition: target.competition,
                season: SEASON,
              },
            },
            update: {
              rank: s.rank,
              gp: s.gp,
              w: s.w,
              l: s.l,
              otw: s.otw,
              otl: s.otl,
              gf: s.gf,
              ga: s.ga,
              diff: s.diff,
              pts: s.pts,
            },
            create: {
              team: s.team,
              competition: target.competition,
              season: SEASON,
              rank: s.rank,
              gp: s.gp,
              w: s.w,
              l: s.l,
              otw: s.otw,
              otl: s.otl,
              gf: s.gf,
              ga: s.ga,
              diff: s.diff,
              pts: s.pts,
            },
          })
          upserted++
        }

        results.push({
          competition: target.competition,
          count: upserted,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        console.error(`Failed to sync ${target.competition}:`, message)
        results.push({
          competition: target.competition,
          count: 0,
          error: message,
        })
      }
    }

    const hasErrors = results.some(r => r.error)

    return NextResponse.json({
      ok: !hasErrors,
      syncedAt: new Date().toISOString(),
      results,
    }, { status: hasErrors ? 207 : 200 })

  } catch (error) {
    console.error('Sync standings cron error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 },
    )
  }
}
