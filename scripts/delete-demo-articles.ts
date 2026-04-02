/**
 * Delete demo articles that aren't from the WordPress import
 *
 * The 10 articles that didn't match any WordPress post are demo/seed data.
 * This script identifies and deletes them.
 *
 * Usage: npx tsx scripts/delete-demo-articles.ts
 */

import { PrismaClient } from '@prisma/client'
import * as https from 'https'

const prisma = new PrismaClient()
const WP_BASE = 'https://pro.hormadi.fr/wp-json/wp/v2'

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8230;/g, '…')
    .replace(/&#8216;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 120)
}

async function fetchJSON(url: string): Promise<{ json: any; headers: any }> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Hormadi-Site-Importer/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchJSON(res.headers.location!).then(resolve).catch(reject)
      }
      let data = ''
      res.on('data', (chunk: string) => { data += chunk })
      res.on('end', () => {
        try { resolve({ json: JSON.parse(data), headers: res.headers }) }
        catch (e) { reject(new Error(`Failed to parse JSON from ${url}`)) }
      })
      res.on('error', reject)
    }).on('error', reject)
  })
}

async function main() {
  console.log('🗑️  Delete Demo Articles')
  console.log('========================\n')

  // Build set of all known WordPress slugs
  console.log('📰 Fetching WordPress post slugs...')
  const wpSlugs = new Set<string>()
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const { json: posts, headers } = await fetchJSON(
      `${WP_BASE}/posts?per_page=100&page=${page}&_fields=id,title,slug`
    )
    if (page === 1) {
      totalPages = parseInt(headers['x-wp-totalpages'] || '1')
    }
    for (const post of posts) {
      const titleRaw = stripHtml(post.title?.rendered || '')
      let slug = slugify(titleRaw)
      if (!slug || slug.length < 3) slug = `article-${post.id}`
      wpSlugs.add(slug)
      wpSlugs.add(`${slug}-${post.id}`)
    }
    page++
  }
  console.log(`   ${wpSlugs.size} WordPress slug variants indexed\n`)

  // Find articles not in WordPress
  const allArticles = await prisma.article.findMany({
    select: { id: true, slug: true, title: true, createdAt: true }
  })

  const demoArticles = allArticles.filter(a => !wpSlugs.has(a.slug))

  if (demoArticles.length === 0) {
    console.log('✅ No demo articles found — all articles match WordPress posts.')
    await prisma.$disconnect()
    return
  }

  console.log(`Found ${demoArticles.length} demo articles to delete:\n`)
  for (const a of demoArticles) {
    console.log(`  🗑️  "${a.title.substring(0, 60)}" (slug: ${a.slug})`)
  }

  // Delete them
  const ids = demoArticles.map(a => a.id)
  const result = await prisma.article.deleteMany({
    where: { id: { in: ids } }
  })

  console.log(`\n✅ Deleted ${result.count} demo articles.`)

  const remaining = await prisma.article.count()
  console.log(`📊 Remaining articles: ${remaining}`)

  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('❌ Error:', e.message)
  await prisma.$disconnect()
  process.exit(1)
})
