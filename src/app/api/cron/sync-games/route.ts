/**
 * Cron route: Sync games/results from liguemagnus.com into Supabase
 * Runs daily via Vercel Cron — also callable manually via GET
 *
 * Usage:
 *   GET /api/cron/sync-games
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { scrapeGames, LIGUE_MAGNUS_URLS } from '@/lib/scraper'

export const dynamic = 'force-dynamic'
export const maxDuration = 30 // seconds

export async function GET(request: NextRequest) {
  try {
    // Optional: verify cron secret for Vercel Cron
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      if (process.env.NODE_ENV === 'production' && cronSecret) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const scraped = await scrapeGames(LIGUE_MAGNUS_URLS.calendar)

    if (scraped.length === 0) {
      return NextResponse.json({
        ok: false,
        syncedAt: new Date().toISOString(),
        error: 'No games found — page structure may have changed',
        created: 0,
        updated: 0,
      }, { status: 200 })
    }

    let created = 0
    let updated = 0
    let skipped = 0

    for (const game of scraped) {
      try {
        // Check if game already exists by externalId
        const existing = await prisma.match.findUnique({
          where: { externalId: game.externalId },
        })

        if (existing) {
          // Update score and status if changed
          const needsUpdate =
            existing.homeScore !== game.homeScore ||
            existing.awayScore !== game.awayScore ||
            existing.status !== game.status

          if (needsUpdate) {
            await prisma.match.update({
              where: { externalId: game.externalId },
              data: {
                homeScore: game.homeScore,
                awayScore: game.awayScore,
                status: game.status,
              },
            })
            updated++
          } else {
            skipped++
          }
        } else {
          // Create new match
          await prisma.match.create({
            data: {
              externalId: game.externalId,
              date: game.date,
              homeTeam: game.homeTeam,
              awayTeam: game.awayTeam,
              homeScore: game.homeScore,
              awayScore: game.awayScore,
              status: game.status,
              competition: game.competition,
              venue: game.venue || 'Patinoire de la Barre',
              isHomeGame: game.isHomeGame,
            },
          })
          created++
        }
      } catch (err) {
        // Skip duplicate or constraint errors, log others
        const message = err instanceof Error ? err.message : 'Unknown'
        if (!message.includes('Unique constraint')) {
          console.error(`Failed to sync game ${game.externalId}:`, message)
        }
        skipped++
      }
    }

    return NextResponse.json({
      ok: true,
      syncedAt: new Date().toISOString(),
      total: scraped.length,
      created,
      updated,
      skipped,
    })

  } catch (error) {
    console.error('Sync games cron error:', error)
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 },
    )
  }
}
