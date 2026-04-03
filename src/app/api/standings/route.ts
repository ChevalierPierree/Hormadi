import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isDemoMode, demoStandings } from '@/lib/demo-data';

export const dynamic = 'force-dynamic';
import { authenticateRequest, jsonResponse, errorResponse, validateRequired, sanitizeString, logAdminAction } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    // Return demo data if database is unavailable
    if (isDemoMode) {
      const standings = [...demoStandings].sort((a, b) => a.rank - b.rank);
      return jsonResponse({ standings }, 200);
    }

    // Fetch all standings sorted by rank
    const standings = await prisma.standing.findMany({
      orderBy: { rank: 'asc' },
    });

    return jsonResponse({ standings }, 200);
  } catch (error) {
    console.error('Get standings error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request, ['admin_billetterie', 'super_admin']);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const body = await request.json();
    const standingsArray = Array.isArray(body) ? body : body.standings;

    // Validate it's an array
    if (!Array.isArray(standingsArray)) {
      return errorResponse('Expected array of standings', 400);
    }

    // Update each standing
    const updatedStandings = await Promise.all(
      standingsArray.map((standing: any) => {
        const { id, team, gp, w, l, otl, otw, gf, ga, pts } = standing;

        const validationError = validateRequired(
          { id, team },
          ['id', 'team']
        );
        if (validationError) {
          throw new Error(validationError);
        }

        return prisma.standing.update({
          where: { id },
          data: {
            team: sanitizeString(team),
            gp: gp !== undefined ? parseInt(gp) : undefined,
            w: w !== undefined ? parseInt(w) : undefined,
            l: l !== undefined ? parseInt(l) : undefined,
            otl: otl !== undefined ? parseInt(otl) : undefined,
            otw: otw !== undefined ? parseInt(otw) : undefined,
            gf: gf !== undefined ? parseInt(gf) : undefined,
            ga: ga !== undefined ? parseInt(ga) : undefined,
            pts: pts !== undefined ? parseInt(pts) : undefined,
          },
        });
      })
    );

    // Log admin action
    await logAdminAction(
      auth.id,
      'UPDATE_STANDINGS',
      'Standing',
      'batch',
      `Updated ${updatedStandings.length} standings`
    );

    return jsonResponse({ standings: updatedStandings }, 200);
  } catch (error) {
    console.error('Update standings error:', error);
    if (error instanceof Error && error.message.includes('validation')) {
      return errorResponse(error.message, 400);
    }
    return errorResponse('Internal server error', 500);
  }
}
