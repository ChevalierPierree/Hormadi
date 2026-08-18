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
    const { name, role, category, photoUrl, order, visible } = body;

    const staffMember = await prisma.staffMember.findUnique({ where: { id } });
    if (!staffMember) {
      return errorResponse('Staff member not found', 404);
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = sanitizeString(name);
    if (role !== undefined) updateData.role = sanitizeString(role);
    if (category !== undefined) updateData.category = sanitizeString(category);
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl ? sanitizeString(photoUrl) : null;
    if (order !== undefined) updateData.order = order;
    if (visible !== undefined) updateData.visible = visible;

    const updated = await prisma.staffMember.update({ where: { id }, data: updateData });

    await logAdminAction(
      authResult.id,
      'UPDATE_STAFF',
      'StaffMember',
      id,
      `Updated fields: ${Object.keys(updateData).join(', ')}`
    );

    return jsonResponse({ staff: updated }, 200);
  } catch (error) {
    console.error('Update staff error:', error);
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
    const staffMember = await prisma.staffMember.findUnique({ where: { id } });
    if (!staffMember) {
      return errorResponse('Staff member not found', 404);
    }

    await prisma.staffMember.delete({ where: { id } });

    await logAdminAction(
      authResult.id,
      'DELETE_STAFF',
      'StaffMember',
      id,
      `Deleted staff member: ${staffMember.name}`
    );

    return jsonResponse({ message: 'Staff member deleted successfully' }, 200);
  } catch (error) {
    console.error('Delete staff error:', error);
    return errorResponse('Internal server error', 500);
  }
}
