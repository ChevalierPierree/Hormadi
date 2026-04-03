import { NextRequest, NextResponse } from 'next/server'
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
} from '@/lib/api-utils'

// ─── GET: List Products ──────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const { page, limit, skip } = getPaginationParams(req)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    const featured = url.searchParams.get('featured')

    // Build filter
    const where: any = { published: true }

    if (category) {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (featured === 'true') {
      where.featured = true
    }

    // Get total count
    const total = await prisma.product.count({ where })

    // Get products
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    })

    return jsonResponse({
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return errorResponse('Erreur lors de la récupération des produits', 500)
  }
}

// ─── POST: Create Product ────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Authenticate
    const auth = await authenticateRequest(req, ['admin_boutique'])
    if (auth instanceof NextResponse) {
      return auth
    }

    // Parse body
    const body = await req.json()

    // Validate required fields
    const validation = validateRequired(body, [
      'name',
      'slug',
      'description',
      'price',
      'category',
      'stock',
    ])
    if (validation) return errorResponse(validation)

    // Validate price is a number
    if (typeof body.price !== 'number' || body.price < 0) {
      return errorResponse('Le prix doit être un nombre positif')
    }

    // Check slug uniqueness
    const existing = await prisma.product.findUnique({
      where: { slug: body.slug },
    })
    if (existing) {
      return errorResponse('Ce slug est déjà utilisé')
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: sanitizeString(body.name),
        slug: sanitizeString(body.slug),
        description: sanitizeString(body.description),
        price: Math.round(body.price * 100), // Convert to cents
        category: sanitizeString(body.category),
        stock: Math.max(0, parseInt(body.stock) || 0),
        featured: body.featured === true,
        published: body.published !== false,
        imageUrl: body.imageUrl ? sanitizeString(body.imageUrl) : null,
        sizes: body.sizes ? JSON.stringify(body.sizes) : null,
      },
    })

    // Log action
    await logAdminAction(auth.id, 'create', 'Product', product.id, `Created ${product.name}`)

    return jsonResponse(product, 201)
  } catch (error) {
    console.error('Error creating product:', error)
    return errorResponse('Erreur lors de la création du produit', 500)
  }
}
