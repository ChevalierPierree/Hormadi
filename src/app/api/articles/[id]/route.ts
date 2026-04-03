import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { authenticateRequest, jsonResponse, errorResponse } from '@/lib/api-utils'

// ─── Public GET (by ID or slug) ─────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try by ID first, then by slug
    let article = await prisma.article.findUnique({ where: { id } })
    if (!article) {
      article = await prisma.article.findUnique({ where: { slug: id } })
    }

    if (!article) {
      return errorResponse('Article non trouvé', 404)
    }

    // Get recent related articles for sidebar
    const recent = await prisma.article.findMany({
      where: { published: true, id: { not: article.id } },
      take: 4,
      orderBy: { publishedAt: 'desc' },
      select: { id: true, slug: true, title: true, imageUrl: true, publishedAt: true, category: true },
    })

    return jsonResponse({ article, recent })
  } catch (error) {
    console.error('GET /api/articles/[id] error:', error)
    return errorResponse('Erreur serveur', 500)
  }
}

// ─── Authenticated PUT ──────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) return authResult

    const { id } = await params
    const body = await request.json()

    const article = await prisma.article.findUnique({ where: { id } })
    if (!article) return errorResponse('Article non trouvé', 404)

    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.excerpt !== undefined) updateData.excerpt = body.excerpt
    if (body.content !== undefined) updateData.content = body.content
    if (body.category !== undefined) updateData.category = body.category
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl
    if (body.published !== undefined) {
      updateData.published = body.published
      if (body.published && !article.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }

    const updated = await prisma.article.update({ where: { id }, data: updateData })
    return jsonResponse({ article: updated })
  } catch (error) {
    console.error('PUT /api/articles/[id] error:', error)
    return errorResponse('Erreur serveur', 500)
  }
}

// ─── Authenticated DELETE ───────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authenticateRequest(request, ['super_admin'])
    if (authResult instanceof NextResponse) return authResult

    const { id } = await params
    await prisma.article.delete({ where: { id } })
    return jsonResponse({ success: true })
  } catch (error) {
    console.error('DELETE /api/articles/[id] error:', error)
    return errorResponse('Erreur serveur', 500)
  }
}
