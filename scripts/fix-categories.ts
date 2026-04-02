/**
 * Fix article categories by re-fetching from WordPress REST API
 *
 * Usage: npx tsx scripts/fix-categories.ts
 *
 * The initial import mapped all categories to "Club"/"Équipe".
 * This script re-fetches the original WP categories and assigns
 * the correct granular categories (Arrivées, Départs, Prolongations, etc.)
 */

import { PrismaClient } from '@prisma/client'
import * as https from 'https'

const prisma = new PrismaClient()
const WP_BASE = 'https://pro.hormadi.fr/wp-json/wp/v2'

// ─── Helpers ─────────────────────────────────────────────

async function fetchJSON(url: string): Promise<{ json: any; headers: any }> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Hormadi-Site-Importer/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchJSON(res.headers.location!).then(resolve).catch(reject)
      }
      let data = ''
      res.on('data', (chunk: string) => { data += chunk })
      res.on('end', () => {
        try {
          resolve({ json: JSON.parse(data), headers: res.headers })
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}`))
        }
      })
      res.on('error', reject)
    }).on('error', reject)
  })
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
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

function mapCategory(wpCategories: string[]): string {
  if (wpCategories.some(c => c === 'Arrivées')) return 'Arrivées'
  if (wpCategories.some(c => c === 'Départs')) return 'Départs'
  if (wpCategories.some(c => c === 'Prolongations')) return 'Prolongations'
  if (wpCategories.some(c => c === 'Interview')) return 'Interview'
  if (wpCategories.some(c => c === 'Jeu concours')) return 'Jeu concours'
  if (wpCategories.some(c => c === 'Vie du Club')) return 'Vie du Club'
  if (wpCategories.some(c => c === 'Divers')) return 'Club'
  if (wpCategories.some(c => c === 'Articles')) return 'Club'
  return 'Club'
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  console.log('🏒 Hormadi Category Fixer')
  console.log('=========================\n')

  // 1. Fetch WP categories
  console.log('📂 Fetching WordPress categories...')
  const { json: categories } = await fetchJSON(`${WP_BASE}/categories?per_page=100&_fields=id,name,slug`)
  const catMap: Record<number, string> = {}
  categories.forEach((c: any) => { catMap[c.id] = c.name })
  console.log(`   Found: ${categories.map((c: any) => c.name).join(', ')}`)

  // 2. Fetch all WP posts to get title → categories mapping
  console.log('\n📰 Fetching WordPress posts...')
  const wpPosts: any[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const { json: posts, headers } = await fetchJSON(
      `${WP_BASE}/posts?per_page=100&page=${page}&_fields=id,title,slug,categories`
    )
    if (page === 1) {
      totalPages = parseInt(headers['x-wp-totalpages'] || '1')
      console.log(`   Total: ${headers['x-wp-total']} posts across ${totalPages} pages`)
    }
    wpPosts.push(...posts)
    page++
  }
  console.log(`   Fetched ${wpPosts.length} posts`)

  // 3. Build a slug → category map from WordPress
  // We generate slugs the same way the import script does
  const slugToCat: Record<string, string> = {}
  for (const post of wpPosts) {
    const titleRaw = stripHtml(post.title?.rendered || '')
    if (!titleRaw) continue

    let slug = slugify(titleRaw)
    if (!slug || slug.length < 3) slug = `article-${post.id}`

    const wpCats = (post.categories || []).map((cid: number) => catMap[cid]).filter(Boolean)
    const category = mapCategory(wpCats)

    slugToCat[slug] = category
    // Also store with -id suffix variant
    slugToCat[`${slug}-${post.id}`] = category
  }

  // 4. Update articles in database
  console.log('\n💾 Updating article categories...')
  const articles = await prisma.article.findMany({ select: { id: true, slug: true, category: true } })

  let updated = 0
  let unchanged = 0
  let notFound = 0
  const catCounts: Record<string, number> = {}

  for (const article of articles) {
    const newCat = slugToCat[article.slug]
    if (newCat) {
      catCounts[newCat] = (catCounts[newCat] || 0) + 1
      if (article.category !== newCat) {
        await prisma.article.update({
          where: { id: article.id },
          data: { category: newCat }
        })
        updated++
      } else {
        unchanged++
      }
    } else {
      notFound++
      // Keep as "Club" by default
    }
  }

  console.log(`\n✅ Done!`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Unchanged: ${unchanged}`)
  console.log(`   Not matched: ${notFound} (kept as "${articles.find(a => !slugToCat[a.slug])?.category || 'Club'}")`)
  console.log(`\n📊 Category distribution:`)
  Object.entries(catCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`)
    })

  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('❌ Error:', e)
  await prisma.$disconnect()
  process.exit(1)
})
