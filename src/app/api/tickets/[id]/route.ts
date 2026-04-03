import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';
import {
  authenticateRequest,
  jsonResponse,
  errorResponse,
  logAdminAction,
} from '@/lib/api-utils';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Try to find by id or reference
    const order = await prisma.ticketOrder.findFirst({
      where: {
        OR: [{ id }, { reference: id }],
      },
      include: {
        category: true,
        match: true,
      },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    return jsonResponse({
      ...order,
      categoryName: order.category.name,
      unitPrice: order.category.price,
      matchDate: order.match.date,
      homeTeam: order.match.homeTeam,
      awayTeam: order.match.awayTeam,
      venue: order.match.venue,
    });
  } catch (error) {
    console.error('Get ticket order error:', error);
    return errorResponse('Failed to fetch order', 500);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Authenticate
    const auth = await authenticateRequest(req, ['admin_billetterie', 'super_admin']);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return errorResponse('Status is required', 400);
    }

    const validStatuses = ['confirmed', 'cancelled', 'used'];
    if (!validStatuses.includes(status)) {
      return errorResponse('Invalid status', 400);
    }

    // Find order
    const order = await prisma.ticketOrder.findFirst({
      where: {
        OR: [{ id }, { reference: id }],
      },
    });

    if (!order) {
      return errorResponse('Order not found', 404);
    }

    // If cancelling, restore the sold count
    if (status === 'cancelled' && order.status !== 'cancelled') {
      await prisma.ticketCategory.update({
        where: { id: order.categoryId },
        data: { sold: { decrement: order.quantity } },
      });
    }

    // Update order
    const updated = await prisma.ticketOrder.update({
      where: { id: order.id },
      data: { status },
      include: {
        category: true,
        match: true,
      },
    });

    // Log admin action
    await logAdminAction(
      auth.id,
      'UPDATE_TICKET_ORDER',
      'TicketOrder',
      order.id,
      `Updated status to ${status}`
    );

    return jsonResponse(updated);
  } catch (error) {
    console.error('Update ticket order error:', error);
    return errorResponse('Failed to update order', 500);
  }
}
