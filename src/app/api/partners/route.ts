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

    // Filter by category if provided
    if (category) {
      where.category = sanitizeString(category);
    }

    // Filter by visible if provided
    if (visible !== null) {
      where.visible = visible === 'true';
    }

    // Fetch all partners ordered by order ASC, then name ASC
    const partners = await prisma.partner.findMany({
      where,
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    return jsonResponse({ partners }, 200);
  } catch (error) {
    console.error('Get partners error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate request
    const auth = await authenticateRequest(request, ['super_admin', 'editor']);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const body = await request.json();
    const { name, logoUrl, website, order, visible } = body;

    // Validate required fields
    const validationError = validateRequired(
      { name },
      ['name']
    );
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    const sanitizedName = sanitizeString(name);
    const sanitizedLogoUrl = logoUrl ? sanitizeString(logoUrl) : null;
    const sanitizedWebsite = website ? sanitizeString(website) : null;

    // Create partner
    const partner = await prisma.partner.create({
      data: {
        name: sanitizedName,
        logoUrl: sanitizedLogoUrl,
        website: sanitizedWebsite,
        order: order ?? 0,
        visible: visible ?? true,
      },
    });

    // Log admin action
    await logAdminAction(
      auth.id,
      'CREATE_PARTNER',
      'Partner',
      partner.id,
      `Created partner: ${sanitizedName}`
    );

    return jsonResponse({ partner }, 201);
  } catch (error) {
    console.error('Create partner error:', error);
    return errorResponse('Internal server error', 500);
  }
}
