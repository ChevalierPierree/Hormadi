import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import {
  jsonResponse,
  errorResponse,
  authenticateRequest,
  sanitizeString,
  logAdminAction,
} from '@/lib/api-utils'

// ─── GET: Single Product ─────────────────────────────────

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    })

    if (!product) {
      return errorResponse('Produit non trouvé', 404)
    }

    return jsonResponse(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return errorResponse('Erreur lors de la récupération du produit', 500)
  }
}

// ─── PUT: Update Product ─────────────────────────────────

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Authenticate
    const auth = await authenticateRequest(req, ['admin_boutique'])
    if (auth instanceof NextResponse) {
      return auth
    }

    // Get current product
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    })

    if (!product) {
      return errorResponse('Produit non trouvé', 404)
    }

    // Parse body
    const body = await req.json()

    // Update product
    const updated = await prisma.product.update({
      where: { id: product.id },
      data: {
        ...(body.name && { name: sanitizeString(body.name) }),
        ...(body.description && { description: sanitizeString(body.description) }),
        ...(body.price !== undefined && {
          price: Math.round(body.price * 100),
        }),
        ...(body.category && { category: sanitizeString(body.category) }),
        ...(body.stock !== undefined && {
          stock: Math.max(0, parseInt(body.stock) || 0),
        }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.imageUrl !== undefined && {
          imageUrl: body.imageUrl ? sanitizeString(body.imageUrl) : null,
        }),
        ...(body.sizes !== undefined && {
          sizes: body.sizes ? JSON.stringify(body.sizes) : null,
        }),
      },
    })

    // Log action
    await logAdminAction(auth.id, 'update', 'Product', product.id, `Updated ${product.name}`)

    return jsonResponse(updated)
  } catch (error) {
    console.error('Error updating product:', error)
    return errorResponse('Erreur lors de la mise à jour du produit', 500)
  }
}

// ─── DELETE: Delete Product ─────────────────────────────

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    // Authenticate
    const auth = await authenticateRequest(req, ['admin_boutique'])
    if (auth instanceof NextResponse) {
      return auth
    }

    // Get product
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    })

    if (!product) {
      return errorResponse('Produit non trouvé', 404)
    }

    // Delete product
    await prisma.product.delete({
      where: { id: product.id },
    })

    // Log action
    await logAdminAction(auth.id, 'delete', 'Product', product.id, `Deleted ${product.name}`)

    return jsonResponse({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return errorResponse('Erreur lors de la suppression du produit', 500)
  }
}
