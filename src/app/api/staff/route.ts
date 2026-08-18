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
    const category = url.searchParams.get('category');
    const visible = url.searchParams.get('visible');

    const where: any = {};
    if (category) where.category = sanitizeString(category);
    if (visible !== null) where.visible = visible === 'true';

    const staff = await prisma.staffMember.findMany({
      where,
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    return jsonResponse({ staff }, 200);
  } catch (error) {
    console.error('Get staff error:', error);
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
    const { name, role, category, photoUrl, order, visible } = body;

    const validationError = validateRequired({ name, role }, ['name', 'role']);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    const staffMember = await prisma.staffMember.create({
      data: {
        name: sanitizeString(name),
        role: sanitizeString(role),
        category: category ? sanitizeString(category) : 'direction',
        photoUrl: photoUrl ? sanitizeString(photoUrl) : null,
        order: order ?? 0,
        visible: visible ?? true,
      },
    });

    await logAdminAction(
      auth.id,
      'CREATE_STAFF',
      'StaffMember',
      staffMember.id,
      `Created staff member: ${staffMember.name}`
    );

    return jsonResponse({ staff: staffMember }, 201);
  } catch (error) {
    console.error('Create staff error:', error);
    return errorResponse('Internal server error', 500);
  }
}
