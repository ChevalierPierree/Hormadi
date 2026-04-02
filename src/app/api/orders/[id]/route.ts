import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import {
  jsonResponse,
  errorResponse,
  authenticateRequest,
  logAdminAction,
} from '@/lib/api-utils'

// ─── GET: Single Order ───────────────────────────────────

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const order = await prisma.shopOrder.findFirst({
      where: {
        OR: [{ id }, { reference: id }],
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    if (!order) {
      return errorResponse('Commande non trouvée', 404)
    }

    return jsonResponse(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return errorResponse('Erreur lors de la récupération de la commande', 500)
  }
}

// ─── PUT: Update Order ───────────────────────────────────

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Authenticate
    const auth = await authenticateRequest(req, ['admin_boutique'])
    if (auth instanceof NextResponse) {
      return auth
    }

    // Get current order
    const order = await prisma.shopOrder.findFirst({
      where: {
        OR: [{ id }, { reference: id }],
      },
    })

    if (!order) {
      return errorResponse('Commande non trouvée', 404)
    }

    // Parse body
    const body = await req.json()

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']
    if (body.status && !validStatuses.includes(body.status)) {
      return errorResponse('Statut invalide')
    }

    // Update order
    const updated = await prisma.shopOrder.update({
      where: { id: order.id },
      data: {
        ...(body.status && { status: body.status }),
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    // Log action
    await logAdminAction(
      auth.id,
      'update',
      'ShopOrder',
      order.id,
      `Updated status to ${body.status}`
    )

    return jsonResponse(updated)
  } catch (error) {
    console.error('Error updating order:', error)
    return errorResponse('Erreur lors de la mise à jour de la commande', 500)
  }
}
