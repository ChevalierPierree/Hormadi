import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { authenticateRequest, jsonResponse, errorResponse, validateRequired, sanitizeString, getPaginationParams, logAdminAction } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const month = url.searchParams.get('month');
    const { page, limit } = getPaginationParams(request);

    // Build raw SQL to ensure we get the competition column
    // (Prisma client was generated before competition was added)
    const conditions: string[] = [];

    if (status) {
      const s = sanitizeString(status);
      if (s === 'completed') {
        conditions.push(`status = 'finished'`);
      } else if (s === 'upcoming') {
        conditions.push(`status = 'scheduled'`);
      } else {
        conditions.push(`status = '${s.replace(/'/g, "''")}'`);
      }
    }

    if (month) {
      const monthStr = sanitizeString(month);
      const [year, monthNum] = monthStr.split('-');
      if (year && monthNum) {
        conditions.push(`date >= '${year}-${monthNum}-01T00:00:00Z'`);
        const endMonth = parseInt(monthNum) + 1;
        const endYear = endMonth > 12 ? parseInt(year) + 1 : parseInt(year);
        const endMonthStr = String(endMonth > 12 ? 1 : endMonth).padStart(2, '0');
        conditions.push(`date < '${endYear}-${endMonthStr}-01T00:00:00Z'`);
      }
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const offset = (page - 1) * limit;

    // Count total
    const countResult = await prisma.$queryRawUnsafe<{ cnt: number }[]>(
      `SELECT COUNT(*) as cnt FROM Match ${whereClause}`
    );
    const total = Number(countResult[0]?.cnt ?? 0);

    // Fetch matches with raw SQL (includes competition column)
    const rawMatches = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM Match ${whereClause} ORDER BY date DESC LIMIT ${limit} OFFSET ${offset}`
    );

    // Format matches to match expected shape
    const matches = rawMatches.map((m: any) => ({
      id: m.id,
      date: m.date,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      homeScore: m.homeScore ?? null,
      awayScore: m.awayScore ?? null,
      venue: m.venue,
      status: m.status,
      isHomeGame: Boolean(m.isHomeGame),
      competition: m.competition || 'Ligue Magnus',
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      ticketCategories: [],
    }));

    return jsonResponse(
      {
        matches,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      200
    );
  } catch (error) {
    console.error('Get matches error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request, ['admin_billetterie', 'super_admin']);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const body = await request.json();
    const { homeTeam, awayTeam, date, status = 'scheduled', venue, competition = 'Ligue Magnus', isHomeGame = true, homeScore, awayScore } = body;

    // Validate required fields
    const validationError = validateRequired(
      { homeTeam, awayTeam, date },
      ['homeTeam', 'awayTeam', 'date']
    );
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    const sanitizedHomeTeam = sanitizeString(homeTeam);
    const sanitizedAwayTeam = sanitizeString(awayTeam);
    const sanitizedVenue = venue ? sanitizeString(venue) : 'Patinoire de la Barre';
    const sanitizedStatus = sanitizeString(status);
    const sanitizedComp = sanitizeString(competition);
    const dateISO = new Date(date).toISOString();
    const now = new Date().toISOString();
    const id = 'clm' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    // Create match with raw SQL to include competition
    await prisma.$executeRawUnsafe(
      `INSERT INTO Match (id, date, homeTeam, awayTeam, homeScore, awayScore, venue, status, isHomeGame, competition, createdAt, updatedAt)
       VALUES ('${id}', '${dateISO}', '${sanitizedHomeTeam.replace(/'/g, "''")}', '${sanitizedAwayTeam.replace(/'/g, "''")}', ${homeScore !== undefined ? Number(homeScore) : 'NULL'}, ${awayScore !== undefined ? Number(awayScore) : 'NULL'}, '${sanitizedVenue.replace(/'/g, "''")}', '${sanitizedStatus}', ${isHomeGame ? 1 : 0}, '${sanitizedComp.replace(/'/g, "''")}', '${now}', '${now}')`
    );

    // Read back the created match
    const created = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM Match WHERE id = '${id}'`
    );

    const match = created[0] ? {
      ...created[0],
      isHomeGame: Boolean(created[0].isHomeGame),
      competition: created[0].competition || 'Ligue Magnus',
      ticketCategories: [],
    } : { id };

    // Log admin action
    await logAdminAction(
      auth.id,
      'CREATE_MATCH',
      'Match',
      id,
      `Created match: ${sanitizedHomeTeam} vs ${sanitizedAwayTeam}`
    );

    return jsonResponse({ match }, 201);
  } catch (error) {
    console.error('Create match error:', error);
    if (error instanceof Error && error.message.includes('validation')) {
      return errorResponse(error.message, 400);
    }
    return errorResponse('Internal server error', 500);
  }
}
