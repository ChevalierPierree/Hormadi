import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isDemoMode, demoArticles } from '@/lib/demo-data'

export const dynamic = 'force-dynamic'
import { authenticateRequest, jsonResponse, errorResponse, getPaginationParams } from '@/lib/api-utils'

// ─── Public GET ─────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const category = url.searchParams.get('category')
    const search = url.searchParams.get('search')
    const published = url.searchParams.get('published')
    const slug = url.searchParams.get('slug')
    const { page, limit, skip } = getPaginationParams(request)

    // Return demo data if database is unavailable
    if (isDemoMode) {
      let filtered = [...demoArticles];

      // If fetching by slug, return single article
      if (slug) {
        const article = filtered.find(a => a.slug === slug);
        if (!article) return errorResponse('Article non trouvé', 404);
        return jsonResponse({ article });
      }

      // Filter by published status
      if (published === 'false') {
        filtered = filtered.filter(a => !a.published);
      } else if (published !== 'all') {
        filtered = filtered.filter(a => a.published);
      }

      // Filter by category
      if (category && category !== 'Tous') {
        filtered = filtered.filter(a => a.category === category);
      }

      // Filter by search
      if (search) {
        filtered = filtered.filter(a =>
          a.title.includes(search) || a.excerpt.includes(search)
        );
      }

      // Sort by publishedAt desc, then createdAt desc
      filtered.sort((a, b) => {
        const aDate = new Date(a.publishedAt || a.createdAt).getTime();
        const bDate = new Date(b.publishedAt || b.createdAt).getTime();
        return bDate - aDate;
      });

      const total = filtered.length;
      const articles = filtered.slice(skip, skip + limit).map(a => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        category: a.category,
        imageUrl: a.imageUrl,
        published: a.published,
        publishedAt: a.publishedAt,
        createdAt: a.createdAt,
      }));

      return jsonResponse({
        articles,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    const where: any = {}

    // If fetching by slug, return single article
    if (slug) {
      const article = await prisma.article.findUnique({ where: { slug } })
      if (!article) return errorResponse('Article non trouvé', 404)
      return jsonResponse({ article })
    }

    // Published filter (default: only published for public)
    if (published === 'false') {
      where.published = false
    } else if (published === 'all') {
      // No filter — admin use
    } else {
      where.published = true
    }

    // Category filter
    if (category && category !== 'Tous') {
      where.category = category
    }

    // Search (SQLite doesn't support mode: 'insensitive', use contains only)
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ]
    }

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          category: true,
          imageUrl: true,
          published: true,
          publishedAt: true,
          createdAt: true,
        },
      }),
    ])

    return jsonResponse({
      articles,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET /api/articles error:', error)
    return errorResponse('Erreur serveur', 500)
  }
}

// ─── Authenticated POST ─────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const authResult = await authenticateRequest(request)
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json()
    const { title, excerpt, content, category, imageUrl, published } = body

    if (!title || !content) {
      return errorResponse('Titre et contenu requis', 400)
    }

    // Generate unique slug
    let slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 120)

    const existing = await prisma.article.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    const article = await prisma.article.create({
      data: {
        slug,
        title,
        excerpt: excerpt || title.substring(0, 200),
        content,
        category: category || 'Club',
        imageUrl: imageUrl || null,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
      },
    })

    return jsonResponse({ article }, 201)
  } catch (error) {
    console.error('POST /api/articles error:', error)
    return errorResponse('Erreur serveur', 500)
  }
}
