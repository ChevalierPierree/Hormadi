import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

import {
  authenticateRequest,
  jsonResponse,
  errorResponse,
  sanitizeString,
  logAdminAction,
} from '@/lib/api-utils';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRequest(request, ['super_admin', 'editor']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = params;
    const body = await request.json();
    const { name, number, position, nationality, photoUrl, order, visible } = body;

    const player = await prisma.player.findUnique({ where: { id } });
    if (!player) {
      return errorResponse('Player not found', 404);
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = sanitizeString(name);
    if (number !== undefined) updateData.number = number === '' ? null : parseInt(number);
    if (position !== undefined) updateData.position = sanitizeString(position);
    if (nationality !== undefined) updateData.nationality = nationality ? sanitizeString(nationality) : null;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl ? sanitizeString(photoUrl) : null;
    if (order !== undefined) updateData.order = order;
    if (visible !== undefined) updateData.visible = visible;

    const updated = await prisma.player.update({ where: { id }, data: updateData });

    await logAdminAction(
      authResult.id,
      'UPDATE_PLAYER',
      'Player',
      id,
      `Updated fields: ${Object.keys(updateData).join(', ')}`
    );

    return jsonResponse({ player: updated }, 200);
  } catch (error) {
    console.error('Update player error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await authenticateRequest(request, ['super_admin']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = params;
    const player = await prisma.player.findUnique({ where: { id } });
    if (!player) {
      return errorResponse('Player not found', 404);
    }

    await prisma.player.delete({ where: { id } });

    await logAdminAction(
      authResult.id,
      'DELETE_PLAYER',
      'Player',
      id,
      `Deleted player: ${player.name}`
    );

    return jsonResponse({ message: 'Player deleted successfully' }, 200);
  } catch (error) {
    console.error('Delete player error:', error);
    return errorResponse('Internal server error', 500);
  }
}
