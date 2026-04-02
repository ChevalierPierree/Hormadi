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
    // Authenticate request
    const authResult = await authenticateRequest(request, ['super_admin', 'editor']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = params;
    const body = await request.json();
    const { name, logoUrl, website, category, order, visible } = body;

    // Find partner
    const partner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      return errorResponse('Partner not found', 404);
    }

    // Prepare update data (all fields optional for partial updates)
    const updateData: any = {};

    if (name !== undefined) {
      updateData.name = sanitizeString(name);
    }
    if (logoUrl !== undefined) {
      updateData.logoUrl = logoUrl ? sanitizeString(logoUrl) : null;
    }
    if (website !== undefined) {
      updateData.website = website ? sanitizeString(website) : null;
    }
    if (category !== undefined) {
      updateData.category = sanitizeString(category);
    }
    if (order !== undefined) {
      updateData.order = order;
    }
    if (visible !== undefined) {
      updateData.visible = visible;
    }

    // Update partner
    const updatedPartner = await prisma.partner.update({
      where: { id },
      data: updateData,
    });

    // Log admin action
    await logAdminAction(
      authResult.id,
      'UPDATE_PARTNER',
      'partner',
      id,
      `Updated fields: ${Object.keys(updateData).join(', ')}`
    );

    return jsonResponse({ partner: updatedPartner }, 200);
  } catch (error) {
    console.error('Update partner error:', error);
    return errorResponse('Internal server error', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate request - super_admin only for deletion
    const authResult = await authenticateRequest(request, ['super_admin']);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { id } = params;

    // Find partner
    const partner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      return errorResponse('Partner not found', 404);
    }

    // Delete partner
    await prisma.partner.delete({
      where: { id },
    });

    // Log admin action
    await logAdminAction(
      authResult.id,
      'DELETE_PARTNER',
      'partner',
      id,
      `Deleted partner: ${partner.name}`
    );

    return jsonResponse(
      { message: 'Partner deleted successfully' },
      200
    );
  } catch (error) {
    console.error('Delete partner error:', error);
    return errorResponse('Internal server error', 500);
  }
}
