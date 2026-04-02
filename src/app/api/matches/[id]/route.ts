import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { authenticateRequest, jsonResponse, errorResponse, sanitizeString, logAdminAction } from '@/lib/api-utils';

async function formatMatch(m: any) {
  // Fetch ticket categories for this match
  const ticketCategories = await prisma.$queryRawUnsafe<any[]>(
    `SELECT id, name, price, capacity, sold FROM TicketCategory WHERE matchId = '${m.id.replace(/'/g, "''")}'`
  );

  return {
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
    ticketCategories: ticketCategories.map((tc: any) => ({
      id: tc.id,
      name: tc.name,
      price: tc.price,
      capacity: tc.capacity,
      sold: tc.sold,
      available: tc.capacity - tc.sold,
    })),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM Match WHERE id = '${id.replace(/'/g, "''")}'`
    );

    if (!rows.length) {
      return errorResponse('Match not found', 404);
    }

    return jsonResponse({ match: await formatMatch(rows[0]) }, 200);
  } catch (error) {
    console.error('Get match error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request, ['admin_billetterie', 'super_admin']);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const { id } = params;
    const body = await request.json();
    const { homeTeam, awayTeam, date, status, venue, homeScore, awayScore, competition, isHomeGame } = body;

    // Check if match exists
    const existing = await prisma.$queryRawUnsafe<any[]>(
      `SELECT id FROM Match WHERE id = '${id.replace(/'/g, "''")}'`
    );
    if (!existing.length) {
      return errorResponse('Match not found', 404);
    }

    // Build SET clauses
    const sets: string[] = [];
    if (homeTeam !== undefined) sets.push(`homeTeam = '${sanitizeString(homeTeam).replace(/'/g, "''")}'`);
    if (awayTeam !== undefined) sets.push(`awayTeam = '${sanitizeString(awayTeam).replace(/'/g, "''")}'`);
    if (date !== undefined) sets.push(`date = '${new Date(date).toISOString()}'`);
    if (status !== undefined) sets.push(`status = '${sanitizeString(status).replace(/'/g, "''")}'`);
    if (venue !== undefined) sets.push(`venue = '${(venue ? sanitizeString(venue) : '').replace(/'/g, "''")}'`);
    if (homeScore !== undefined) sets.push(`homeScore = ${homeScore === null ? 'NULL' : Number(homeScore)}`);
    if (awayScore !== undefined) sets.push(`awayScore = ${awayScore === null ? 'NULL' : Number(awayScore)}`);
    if (competition !== undefined) sets.push(`competition = '${sanitizeString(competition).replace(/'/g, "''")}'`);
    if (isHomeGame !== undefined) sets.push(`isHomeGame = ${isHomeGame ? 1 : 0}`);
    sets.push(`updatedAt = '${new Date().toISOString()}'`);

    await prisma.$executeRawUnsafe(
      `UPDATE Match SET ${sets.join(', ')} WHERE id = '${id.replace(/'/g, "''")}'`
    );

    // Read back updated match
    const updated = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM Match WHERE id = '${id.replace(/'/g, "''")}'`
    );

    const updatedFields = [homeTeam && 'homeTeam', awayTeam && 'awayTeam', date && 'date',
      status && 'status', venue !== undefined && 'venue', homeScore !== undefined && 'homeScore',
      awayScore !== undefined && 'awayScore', competition && 'competition', isHomeGame !== undefined && 'isHomeGame'
    ].filter(Boolean);

    // Log admin action
    await logAdminAction(
      auth.id,
      'UPDATE_MATCH',
      'Match',
      id,
      `Updated ${updatedFields.join(', ')}`
    );

    return jsonResponse({ match: updated.length ? await formatMatch(updated[0]) : { id } }, 200);
  } catch (error) {
    console.error('Update match error:', error);
    if (error instanceof Error && error.message.includes('validation')) {
      return errorResponse(error.message, 400);
    }
    return errorResponse('Internal server error', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request, ['super_admin']);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const { id } = params;

    // Find match
    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT * FROM Match WHERE id = '${id.replace(/'/g, "''")}'`
    );

    if (!rows.length) {
      return errorResponse('Match not found', 404);
    }

    // Delete match
    await prisma.$executeRawUnsafe(
      `DELETE FROM Match WHERE id = '${id.replace(/'/g, "''")}'`
    );

    // Log admin action
    await logAdminAction(
      auth.id,
      'DELETE_MATCH',
      'Match',
      id,
      `Deleted match: ${rows[0].homeTeam} vs ${rows[0].awayTeam}`
    );

    return jsonResponse({ message: 'Match deleted' }, 200);
  } catch (error) {
    console.error('Delete match error:', error);
    return errorResponse('Internal server error', 500);
  }
}
