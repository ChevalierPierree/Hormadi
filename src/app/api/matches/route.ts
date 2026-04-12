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

    // Build where clause
    const where: any = {};

    if (status) {
      if (status === 'completed') {
        where.status = 'finished';
      } else if (status === 'upcoming') {
        where.status = 'scheduled';
        // Only return matches that are actually in the future
        where.date = {
          ...where.date,
          gt: new Date(),
        };
      } else {
        where.status = status;
      }
    }

    if (month) {
      const [year, monthNum] = month.split('-');
      if (year && monthNum) {
        const monthStart = new Date(`${year}-${monthNum}-01T00:00:00Z`);
        const endMonth = parseInt(monthNum) + 1;
        const endYear = endMonth > 12 ? parseInt(year) + 1 : parseInt(year);
        const endMonthStr = String(endMonth > 12 ? 1 : endMonth).padStart(2, '0');
        const monthEnd = new Date(`${endYear}-${endMonthStr}-01T00:00:00Z`);
        where.date = {
          gte: monthStart,
          lt: monthEnd,
        };
      }
    }

    const offset = (page - 1) * limit;

    const [total, matches] = await Promise.all([
      prisma.match.count({ where }),
      prisma.match.findMany({
        where,
        orderBy: { date: status === 'upcoming' ? 'asc' : 'desc' },
        skip: offset,
        take: limit,
        include: {
          ticketCategories: true,
        },
      }),
    ]);

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

    const match = await prisma.match.create({
      data: {
        date: new Date(date),
        homeTeam: sanitizeString(homeTeam),
        awayTeam: sanitizeString(awayTeam),
        homeScore: homeScore !== undefined ? Number(homeScore) : null,
        awayScore: awayScore !== undefined ? Number(awayScore) : null,
        venue: venue ? sanitizeString(venue) : 'Patinoire de la Barre',
        status: sanitizeString(status),
        competition: sanitizeString(competition),
        isHomeGame: Boolean(isHomeGame),
      },
      include: {
        ticketCategories: true,
      },
    });

    // Log admin action
    await logAdminAction(
      auth.id,
      'CREATE_MATCH',
      'Match',
      match.id,
      `Created match: ${match.homeTeam} vs ${match.awayTeam}`
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
