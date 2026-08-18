import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

import {
  authenticateRequest,
  jsonResponse,
  errorResponse,
  validateRequired,
  sanitizeString,
  logAdminAction,
} from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const position = url.searchParams.get('position');
    const visible = url.searchParams.get('visible');

    const where: any = {};
    if (position) where.position = sanitizeString(position);
    if (visible !== null) where.visible = visible === 'true';

    const players = await prisma.player.findMany({
      where,
      orderBy: [{ order: 'asc' }, { number: 'asc' }],
    });

    return jsonResponse({ players }, 200);
  } catch (error) {
    console.error('Get players error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request, ['super_admin', 'editor']);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const body = await request.json();
    const { name, number, position, nationality, photoUrl, order, visible } = body;

    const validationError = validateRequired({ name }, ['name']);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    const player = await prisma.player.create({
      data: {
        name: sanitizeString(name),
        number: number !== undefined && number !== '' ? parseInt(number) : null,
        position: position ? sanitizeString(position) : 'attaquant',
        nationality: nationality ? sanitizeString(nationality) : null,
        photoUrl: photoUrl ? sanitizeString(photoUrl) : null,
        order: order ?? 0,
        visible: visible ?? true,
      },
    });

    await logAdminAction(
      auth.id,
      'CREATE_PLAYER',
      'Player',
      player.id,
      `Created player: ${player.name}`
    );

    return jsonResponse({ player }, 201);
  } catch (error) {
    console.error('Create player error:', error);
    return errorResponse('Internal server error', 500);
  }
}
