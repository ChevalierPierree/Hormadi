import { NextRequest, NextResponse } from 'next/server';

// Mock database
const ticketOrders: any[] = [
  {
    id: 'order-1',
    reference: 'HRM-001234',
    matchId: '1',
    customerName: 'Jean Dupont',
    email: 'jean@example.com',
    phone: '+33612345678',
    tickets: [
      { sectionId: 'tribune-est', sectionName: 'Tribune Est', quantity: 2, price: 18 },
    ],
    totalAmount: 36,
    status: 'confirmed',
    createdAt: new Date('2026-04-01').toISOString(),
  },
];

function hasAdminPermission(req: NextRequest): boolean {
  const authHeader = req.headers.get('authorization');
  return authHeader?.includes('admin') ?? false;
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Try to find by id or reference
    const order = ticketOrders.find(
      (order) => order.id === id || order.reference === id,
    );

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // Check admin permission for updates
    if (!hasAdminPermission(req)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const validStatuses = ['confirmed', 'pending', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Find and update order
    const orderIndex = ticketOrders.findIndex(
      (order) => order.id === id || order.reference === id,
    );

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    ticketOrders[orderIndex].status = status;
    ticketOrders[orderIndex].updatedAt = new Date().toISOString();

    return NextResponse.json(ticketOrders[orderIndex]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
