import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import {
  jsonResponse,
  errorResponse,
  authenticateRequest,
  validateRequired,
  sanitizeString,
  getPaginationParams,
  logAdminAction,
  generateReference,
} from '@/lib/api-utils'

// ─── GET: List Orders ────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    // Authenticate (admin only)
    const user = await authenticateRequest(req, ['admin_boutique'])
    if (user instanceof NextRequest) {
      return user as any
    }

    const url = new URL(req.url)
    const { page, limit, skip } = getPaginationParams(req)
    const status = url.searchParams.get('status')

    // Build filter
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Get total count
    const total = await prisma.shopOrder.count({ where })

    // Get orders
    const orders = await prisma.shopOrder.findMany({
      where,
      skip,
      take: limit,
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return jsonResponse({
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return errorResponse('Erreur lors de la récupération des commandes', 500)
  }
}

// ─── POST: Create Order ──────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate required fields
    const validation = validateRequired(body, [
      'customerName',
      'customerEmail',
      'shippingAddress',
      'shippingCity',
      'shippingZip',
      'items',
    ])
    if (validation) return errorResponse(validation)

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return errorResponse('Au moins un article est requis')
    }

    let totalPrice = 0
    const orderItems: any[] = []

    // Validate stock and prepare items
    for (const item of body.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      })

      if (!product) {
        return errorResponse(`Produit ${item.productId} non trouvé`, 404)
      }

      if (product.stock < item.quantity) {
        return errorResponse(
          `Stock insuffisant pour ${product.name}. Disponible: ${product.stock}`
        )
      }

      const itemTotal = product.price * item.quantity
      totalPrice += itemTotal

      orderItems.push({
        productId: product.id,
        quantity: item.quantity,
        size: item.size || null,
        unitPrice: product.price,
      })
    }

    // Create order with transaction
    const order = await prisma.shopOrder.create({
      data: {
        reference: generateReference('HOR'),
        customerName: sanitizeString(body.customerName),
        customerEmail: sanitizeString(body.customerEmail),
        customerPhone: body.customerPhone ? sanitizeString(body.customerPhone) : null,
        shippingAddress: sanitizeString(body.shippingAddress),
        shippingCity: sanitizeString(body.shippingCity),
        shippingZip: sanitizeString(body.shippingZip),
        totalPrice,
        status: 'pending',
        items: {
          create: orderItems,
        },
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    })

    // Decrement stock for each item
    for (const item of body.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    }

    return jsonResponse(order, 201)
  } catch (error) {
    console.error('Error creating order:', error)
    return errorResponse('Erreur lors de la création de la commande', 500)
  }
}
