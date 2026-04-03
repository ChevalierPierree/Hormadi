import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
import { authenticateRequest, jsonResponse, errorResponse, sanitizeString, logAdminAction } from '@/lib/api-utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        ticketCategories: true,
      },
    });

    if (!match) {
      return errorResponse('Match not found', 404);
    }

    // Format ticket categories with available count
    const formattedMatch = {
      ...match,
      ticketCategories: match.ticketCategories.map((tc) => ({
        id: tc.id,
        name: tc.name,
        price: tc.price,
        capacity: tc.capacity,
        sold: tc.sold,
        available: tc.capacity - tc.sold,
      })),
    };

    return jsonResponse({ match: formattedMatch }, 200);
  } catch (error) {
    console.error('Get match error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request, ['admin_billetterie', 'super_admin']);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const { id } = await params;
    const body = await request.json();
    const { homeTeam, awayTeam, date, status, venue, homeScore, awayScore, competition, isHomeGame } = body;

    // Check if match exists
    const existing = await prisma.match.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse('Match not found', 404);
    }

    // Build update data
    const updateData: any = {};
    if (homeTeam !== undefined) updateData.homeTeam = sanitizeString(homeTeam);
    if (awayTeam !== undefined) updateData.awayTeam = sanitizeString(awayTeam);
    if (date !== undefined) updateData.date = new Date(date);
    if (status !== undefined) updateData.status = sanitizeString(status);
    if (venue !== undefined) updateData.venue = venue ? sanitizeString(venue) : '';
    if (homeScore !== undefined) updateData.homeScore = homeScore === null ? null : Number(homeScore);
    if (awayScore !== undefined) updateData.awayScore = awayScore === null ? null : Number(awayScore);
    if (competition !== undefined) updateData.competition = sanitizeString(competition);
    if (isHomeGame !== undefined) updateData.isHomeGame = Boolean(isHomeGame);

    const updated = await prisma.match.update({
      where: { id },
      data: updateData,
      include: {
        ticketCategories: true,
      },
    });

    const updatedFields = Object.keys(updateData);

    // Log admin action
    await logAdminAction(
      auth.id,
      'UPDATE_MATCH',
      'Match',
      id,
      `Updated ${updatedFields.join(', ')}`
    );

    return jsonResponse({ match: updated }, 200);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request, ['super_admin']);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const { id } = await params;

    // Find match
    const match = await prisma.match.findUnique({ where: { id } });
    if (!match) {
      return errorResponse('Match not found', 404);
    }

    // Delete match (ticket categories cascade)
    await prisma.match.delete({ where: { id } });

    // Log admin action
    await logAdminAction(
      auth.id,
      'DELETE_MATCH',
      'Match',
      id,
      `Deleted match: ${match.homeTeam} vs ${match.awayTeam}`
    );

    return jsonResponse({ message: 'Match deleted' }, 200);
  } catch (error) {
    console.error('Delete match error:', error);
    return errorResponse('Internal server error', 500);
  }
}
