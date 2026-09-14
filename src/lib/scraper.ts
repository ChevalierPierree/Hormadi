/**
 * Scraping utilities for fetching hockey data from external sources.
 * Used by cron routes to sync standings and games into Supabase.
 *
 * Primary source: liguemagnus.com (official)
 * Fallback source: flashscore.fr
 */

// @ts-ignore — cheerio types installed separately, works at runtime
import * as cheerio from 'cheerio'

const HORMADI_NAMES = ['anglet', 'hormadi']

// ─── Types ───────────────────────────────────────────────

export interface ScrapedStanding {
  rank: number
  team: string
  gp: number
  w: number
  l: number
  otw: number // VP (victoires prolongations)
  otl: number // DP (défaites prolongations)
  gf: number  // BP (buts pour)
  ga: number  // BC (buts contre)
  diff: number
  pts: number
}

export interface ScrapedGame {
  externalId: string
  date: Date
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  status: string // scheduled, finished, live, postponed
  competition: string
  venue: string
  isHomeGame: boolean
}

// ─── Helpers ─────────────────────────────────────────────

function isHormadi(teamName: string): boolean {
  const lower = teamName.toLowerCase()
  return HORMADI_NAMES.some(n => lower.includes(n))
}

/**
 * Normalize team names to a consistent format
 */
function normalizeTeamName(raw: string): string {
  const cleaned = raw.trim()
    .replace(/\s+/g, ' ')
    .replace(/^[\d]+\.\s*/, '') // remove leading "1. "

  // Common normalizations
  const mapping: Record<string, string> = {
    'rouen': 'Dragons de Rouen',
    'grenoble': 'Brûleurs de Loups de Grenoble',
    'angers': 'Ducs d\'Angers',
    'bordeaux': 'Boxers de Bordeaux',
    'marseille': 'Spartiates de Marseille',
    'nice': 'Aigles de Nice',
    'briançon': 'Diables Rouges de Briançon',
    'amiens': 'Gothiques d\'Amiens',
    'cergy': 'Jokers de Cergy-Pontoise',
    'anglet': 'Hormadi Anglet',
    'chamonix': 'Pionniers de Chamonix',
    'gap': 'Rapaces de Gap',
    'mulhouse': 'Scorpions de Mulhouse',
  }

  const lower = cleaned.toLowerCase()
  for (const [key, fullName] of Object.entries(mapping)) {
    if (lower.includes(key)) return fullName
  }

  return cleaned
}

/** Known Ligue Magnus club full names — anything else is not a Magnus team (wrong division/competition on the scraped page). */
const KNOWN_MAGNUS_TEAMS = new Set([
  'Dragons de Rouen',
  'Brûleurs de Loups de Grenoble',
  'Ducs d\'Angers',
  'Boxers de Bordeaux',
  'Spartiates de Marseille',
  'Aigles de Nice',
  'Diables Rouges de Briançon',
  'Gothiques d\'Amiens',
  'Jokers de Cergy-Pontoise',
  'Hormadi Anglet',
  'Pionniers de Chamonix',
  'Rapaces de Gap',
  'Scorpions de Mulhouse',
])

/** A row only makes it past normalization if the points total matches the official formula (V×3 + VP×2 + DP×1). */
function isPlausibleStandingRow(s: Omit<ScrapedStanding, 'rank'>): boolean {
  if (!KNOWN_MAGNUS_TEAMS.has(s.team)) return false
  if (s.gp <= 0) return false
  const expectedPts = s.w * 3 + s.otw * 2 + s.otl * 1
  return Math.abs(expectedPts - s.pts) <= 1 // official tables occasionally round by 1 — never more
}

// ─── Scrape standings from liguemagnus.com ───────────────

/**
 * Scrapes the standings from the official Ligue Magnus website.
 * URL patterns:
 *   Regular season: /saison-reguliere/classement/?phase=560
 *   Poule de maintien: /saison-reguliere/classement-pm-2/?phase=651
 */
export async function scrapeStandings(url: string): Promise<ScrapedStanding[]> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; HormadiBot/1.0)',
      'Accept': 'text/html,application/xhtml+xml',
    },
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch standings from ${url}: ${res.status}`)
  }

  const html = await res.text()
  const $ = cheerio.load(html)
  const standings: ScrapedStanding[] = []

  // The standings table on liguemagnus.com
  // Look for table rows with team data
  $('table tbody tr, .classement-table tr, .standings-row, .table-standings tbody tr').each((i: number, el: any) => {
    const cells = $(el).find('td')
    if (cells.length < 5) return // skip header or invalid rows

    // Try to extract data from cells
    const texts = cells.map((_: number, cell: any) => $(cell).text().trim()).get()

    // Typical format: Rang, Équipe, PJ, V, VP, DP, D, BP, BC, Diff, Pts
    // But the exact column order varies, so we try to be smart about it
    const rank = parseInt(texts[0]) || (i + 1)
    const team = texts[1] || ''

    if (!team || team.length < 2) return

    // Parse numeric values safely
    const nums = texts.slice(2).map((t: string) => parseInt(t.replace(/[^\d-]/g, '')) || 0)

    const row = {
      team: normalizeTeamName(team),
      gp: nums[0] || 0,   // MJ/PJ
      w: nums[1] || 0,     // V
      otw: nums[2] || 0,   // VP
      otl: nums[3] || 0,   // DP
      l: nums[4] || 0,     // D
      gf: nums[5] || 0,    // BP
      ga: nums[6] || 0,    // BC
      diff: nums[7] || 0,  // Diff
      pts: nums[8] || nums[nums.length - 1] || 0, // PTS (usually last column)
    }

    if (isPlausibleStandingRow(row)) {
      standings.push({ rank, ...row })
    } else {
      console.warn(`[scrapeStandings] Rejected implausible row: ${JSON.stringify(row)}`)
    }
  })

  // If the main approach didn't work, try alternative selectors — but only within a
  // table whose header row actually looks like a standings table (MJ/PJ + Pts columns),
  // never "any table on the page" (news widgets, ads, etc. would otherwise get parsed).
  if (standings.length === 0) {
    $('table').each((_: number, table: any) => {
      const rows = $(table).find('tr')
      if (rows.length < 5) return // not a standings table

      const headerText = $(rows[0]).text().toLowerCase()
      const looksLikeStandings = /(mj|pj)/.test(headerText) && /pts?/.test(headerText)
      if (!looksLikeStandings) return

      rows.each((i: number, row: any) => {
        if (i === 0) return // skip header
        const cells = $(row).find('td')
        if (cells.length < 5) return

        const texts = cells.map((_: number, cell: any) => $(cell).text().trim()).get()
        const rank = parseInt(texts[0]) || i
        const team = texts[1] || texts[0] || ''

        if (!team || team.length < 2 || /^\d+$/.test(team)) return

        const nums = texts.map((t: string) => parseInt(t.replace(/[^\d-]/g, ''))).filter((n: number) => !isNaN(n))

        if (nums.length >= 3) {
          const parsed = {
            team: normalizeTeamName(team),
            gp: nums[1] || 0,
            w: nums[2] || 0,
            otw: nums[3] || 0,
            otl: nums[4] || 0,
            l: nums[5] || 0,
            gf: nums[6] || 0,
            ga: nums[7] || 0,
            diff: nums[8] || 0,
            pts: nums[nums.length - 1] || 0,
          }
          if (isPlausibleStandingRow(parsed)) {
            standings.push({ rank, ...parsed })
          } else {
            console.warn(`[scrapeStandings] Rejected implausible fallback row: ${JSON.stringify(parsed)}`)
          }
        }
      })
    })
  }

  return standings
}

// ─── Scrape games/results from liguemagnus.com ──────────

// liguemagnus.com's /calendrier-resultats/ page no longer contains match data in its
// static HTML — it's loaded client-side via a WordPress AJAX JSON endpoint. Calling that
// endpoint directly is far more robust than scraping rendered HTML (structured fields,
// stable match IDs), so that's what this does instead of parsing the page.
const HORMADI_TEAM_ID = 75 // "72001S - ANGLET HORMADI Ligue MAGNUS" on liguemagnus.com

/**
 * Fetches Hormadi's games for a given competition/phase from the official
 * Ligue Magnus AJAX endpoint (admin-ajax.php, action=get_rencontres).
 */
export async function scrapeGames(_url: string, competitionId = LIGUE_MAGNUS_IDS.competitionId, phaseId = LIGUE_MAGNUS_IDS.phaseId): Promise<ScrapedGame[]> {
  const body = new URLSearchParams({
    action: 'get_rencontres',
    equipe_id: String(HORMADI_TEAM_ID),
    competition_id: String(competitionId),
    phase_id: String(phaseId),
    par_page: '300',
    limite: '0',
  })

  const res = await fetch('https://liguemagnus.com/wp-admin/admin-ajax.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': 'Mozilla/5.0 (compatible; HormadiBot/1.0)',
      'Accept': 'application/json',
    },
    body: body.toString(),
    next: { revalidate: 0 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch games from liguemagnus.com: ${res.status}`)
  }

  const json = await res.json()
  const matches = json?.data?.data
  if (!Array.isArray(matches)) return []

  const games: ScrapedGame[] = []
  const now = Date.now()

  for (const m of matches) {
    const homeRaw = m.receveur?.libelle_court || m.receveur?.libelle_complet
    const awayRaw = m.visiteur?.libelle_court || m.visiteur?.libelle_complet
    const dateStr: string | undefined = m.calendrier?.date_debut
    if (!homeRaw || !awayRaw || !dateStr || !m.id) continue

    // "2026-09-15 20:30:00" — local (Europe/Paris) time, no offset marker.
    const date = new Date(dateStr.replace(' ', 'T'))
    if (isNaN(date.getTime())) continue

    const homeIsHormadi = m.receveur?.id === HORMADI_TEAM_ID || isHormadi(homeRaw)
    const awayIsHormadi = m.visiteur?.id === HORMADI_TEAM_ID || isHormadi(awayRaw)

    // The API doesn't reliably flag "finished" pre-season (no games played yet to check
    // against) — infer it from kickoff time plus a game's duration instead.
    const isPast = date.getTime() < now - 3 * 60 * 60 * 1000
    const status = m.en_cours ? 'live' : isPast ? 'finished' : 'scheduled'

    const scores: any[] = Array.isArray(m.score) ? m.score : []
    const homeScoreEntry = scores.find((s) => s.equipe_id === m.receveur?.id)
    const awayScoreEntry = scores.find((s) => s.equipe_id === m.visiteur?.id)
    const homeScore = isPast && homeScoreEntry?.score != null ? homeScoreEntry.score : null
    const awayScore = isPast && awayScoreEntry?.score != null ? awayScoreEntry.score : null

    games.push({
      externalId: `lm-${m.id}`,
      date,
      homeTeam: normalizeTeamName(homeRaw),
      awayTeam: normalizeTeamName(awayRaw),
      homeScore,
      awayScore,
      status,
      competition: 'Ligue Magnus',
      venue: homeIsHormadi ? 'Patinoire de la Barre' : '',
      isHomeGame: homeIsHormadi,
    })
  }

  return games
}

// ─── Export constants ────────────────────────────────────

// competitionId/phaseId are liguemagnus.com's own internal IDs for "Synerglace Ligue
// Magnus" / "Saison régulière 2026-2027" — found by inspecting the site's own AJAX calls
// (admin-ajax.php, actions get_phases / get_rencontres). These change every season; if
// standings/games sync starts silently returning nothing again, re-check them the same way:
// open the site's network tab (or curl the page and grep for `phase=`) and update below.
export const LIGUE_MAGNUS_IDS = {
  competitionId: 240,
  phaseId: 714,
}

export const LIGUE_MAGNUS_URLS = {
  standingsRegular: `https://liguemagnus.com/saison-reguliere/classement/?phase=${LIGUE_MAGNUS_IDS.phaseId}`,
  standingsPM: 'https://liguemagnus.com/saison-reguliere/classement-pm-2/?phase=651',
  calendar: 'https://liguemagnus.com/calendrier-resultats/',
}
