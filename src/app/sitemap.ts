import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hormadi.vercel.app'

// Static, content pages of the vitrine site — utility/legal pages and internal
// flow steps (checkout, confirmation, admin) are intentionally left out.
const STATIC_ROUTES = [
  { path: '', changeFrequency: 'daily' as const, priority: 1 },
  { path: '/actualites', changeFrequency: 'daily' as const, priority: 0.9 },
  { path: '/calendrier', changeFrequency: 'daily' as const, priority: 0.9 },
  { path: '/classement', changeFrequency: 'daily' as const, priority: 0.8 },
  { path: '/billetterie', changeFrequency: 'weekly' as const, priority: 0.8 },
  { path: '/boutique', changeFrequency: 'weekly' as const, priority: 0.6 },
  { path: '/effectif', changeFrequency: 'weekly' as const, priority: 0.7 },
  { path: '/organigramme', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/histoire', changeFrequency: 'monthly' as const, priority: 0.5 },
  { path: '/amateur', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/hospitalites', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/partenaires', changeFrequency: 'monthly' as const, priority: 0.6 },
  { path: '/contact', changeFrequency: 'yearly' as const, priority: 0.4 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  const articles = await prisma.article.findMany({
    where: { published: true },
    select: { slug: true, publishedAt: true, updatedAt: true },
    orderBy: { publishedAt: 'desc' },
  })

  const articleEntries: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${SITE_URL}/actualites/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticEntries, ...articleEntries]
}
