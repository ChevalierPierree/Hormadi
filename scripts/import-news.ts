/**
 * Import articles from the old Hormadi WordPress site (pro.hormadi.fr)
 *
 * Usage: npx tsx scripts/import-news.ts
 *
 * This script:
 * 1. Fetches all posts from the WordPress REST API
 * 2. Fetches featured images (media)
 * 3. Fetches categories
 * 4. Downloads images locally to public/images/news/
 * 5. Creates articles in the Prisma SQLite database
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

const prisma = new PrismaClient()

const WP_BASE = 'https://pro.hormadi.fr/wp-json/wp/v2'
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'news')

// ─── Helpers ─────────────────────────────────────────────

async function fetchJSON(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Hormadi-Site-Importer/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchJSON(res.headers.location!).then(resolve).catch(reject)
      }
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          resolve({ json: JSON.parse(data), headers: res.headers })
        } catch {
          reject(new Error(`Failed to parse JSON from ${url}: ${data.substring(0, 200)}`))
        }
      })
    }).on('error', reject)
  })
}

async function downloadImage(url: string, filename: string): Promise<string | null> {
  const filePath = path.join(IMAGES_DIR, filename)
  if (fs.existsSync(filePath)) {
    return `/images/news/${filename}`
  }

  return new Promise((resolve) => {
    const doDownload = (downloadUrl: string, redirectCount = 0) => {
      if (redirectCount > 5) { resolve(null); return }

      const protocol = downloadUrl.startsWith('https') ? https : require('http')
      protocol.get(downloadUrl, { headers: { 'User-Agent': 'Hormadi-Site-Importer/1.0' } }, (res: any) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          doDownload(res.headers.location!, redirectCount + 1)
          return
        }
        if (res.statusCode !== 200) {
          console.warn(`  ⚠ Failed to download ${url} (${res.statusCode})`)
          resolve(null)
          return
        }
        const file = fs.createWriteStream(filePath)
        res.pipe(file)
        file.on('finish', () => {
          file.close()
          resolve(`/images/news/${filename}`)
        })
        file.on('error', () => {
          fs.unlinkSync(filePath)
          resolve(null)
        })
      }).on('error', () => resolve(null))
    }
    doDownload(url)
  })
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
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
  // Preserve granular WordPress categories for the frontend filter buttons
  // Priority order: most specific first
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

function getImageExtension(url: string): string {
  const match = url.match(/\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i)
  return match ? match[1].toLowerCase() : 'jpg'
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  console.log('🏒 Hormadi News Importer')
  console.log('========================\n')

  // Ensure images directory
  fs.mkdirSync(IMAGES_DIR, { recursive: true })

  // 1. Fetch categories
  console.log('📂 Fetching categories...')
  const { json: categories } = await fetchJSON(`${WP_BASE}/categories?per_page=100&_fields=id,name,slug`)
  const catMap: Record<number, string> = {}
  categories.forEach((c: any) => { catMap[c.id] = c.name })
  console.log(`   Found ${categories.length} categories: ${categories.map((c: any) => c.name).join(', ')}`)

  // 2. Fetch all posts (paginated, 100 per page)
  console.log('\n📰 Fetching articles...')
  const allPosts: any[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const { json: posts, headers } = await fetchJSON(
      `${WP_BASE}/posts?per_page=100&page=${page}&_fields=id,title,date,slug,excerpt,content,featured_media,categories`
    )
    if (page === 1) {
      totalPages = parseInt(headers['x-wp-totalpages'] || '1')
      const total = headers['x-wp-total'] || posts.length
      console.log(`   Total: ${total} articles across ${totalPages} pages`)
    }
    allPosts.push(...posts)
    console.log(`   Page ${page}/${totalPages}: +${posts.length} articles (total: ${allPosts.length})`)
    page++
  }

  // 3. Fetch featured media
  console.log('\n🖼️  Fetching media info...')
  const mediaIds = [...new Set(allPosts.map(p => p.featured_media).filter(id => id > 0))]
  const mediaMap: Record<number, string> = {}

  for (let i = 0; i < mediaIds.length; i += 100) {
    const batch = mediaIds.slice(i, i + 100)
    const { json: media } = await fetchJSON(
      `${WP_BASE}/media?include=${batch.join(',')}&per_page=100&_fields=id,source_url`
    )
    media.forEach((m: any) => { mediaMap[m.id] = m.source_url })
    console.log(`   Batch ${Math.floor(i / 100) + 1}: ${media.length} media items`)
  }
  console.log(`   Total media: ${Object.keys(mediaMap).length}`)

  // 4. Process and import articles
  console.log('\n💾 Importing articles to database...')

  let imported = 0
  let skipped = 0
  let imageDownloaded = 0
  let imageFailed = 0

  for (const post of allPosts) {
    const titleRaw = stripHtml(post.title?.rendered || '')
    if (!titleRaw) { skipped++; continue }

    // Generate a clean slug
    let slug = slugify(titleRaw)
    if (!slug || slug.length < 3) {
      slug = `article-${post.id}`
    }

    // Check if already exists
    const existing = await prisma.article.findFirst({ where: { slug } })
    if (existing) {
      // Try with id suffix
      slug = `${slug}-${post.id}`
      const existing2 = await prisma.article.findFirst({ where: { slug } })
      if (existing2) { skipped++; continue }
    }

    // Categories
    const wpCats = (post.categories || []).map((cid: number) => catMap[cid]).filter(Boolean)
    const category = mapCategory(wpCats)

    // Excerpt
    const excerpt = stripHtml(post.excerpt?.rendered || '').substring(0, 300)

    // Content — keep the HTML but clean it up slightly
    let content = post.content?.rendered || ''
    // Remove WordPress-specific classes but keep structure
    content = content.replace(/class="[^"]*"/g, '')
    content = content.replace(/style="[^"]*"/g, '')

    // Download featured image
    let imageUrl: string | null = null
    const wpImageUrl = mediaMap[post.featured_media]
    if (wpImageUrl) {
      const ext = getImageExtension(wpImageUrl)
      const imageFilename = `${slug.substring(0, 80)}.${ext}`
      imageUrl = await downloadImage(wpImageUrl, imageFilename)
      if (imageUrl) imageDownloaded++
      else imageFailed++
    }

    // Parse date
    const publishedAt = new Date(post.date)

    // Create article
    try {
      await prisma.article.create({
        data: {
          slug,
          title: titleRaw,
          excerpt: excerpt || titleRaw.substring(0, 200),
          content,
          category,
          imageUrl,
          published: true,
          publishedAt,
        }
      })
      imported++
      if (imported % 25 === 0) {
        console.log(`   ✅ ${imported} articles imported...`)
      }
    } catch (err: any) {
      console.warn(`   ⚠ Failed to import "${titleRaw.substring(0, 50)}": ${err.message}`)
      skipped++
    }
  }

  console.log('\n========================')
  console.log('✅ Import complete!')
  console.log(`   📰 Articles imported: ${imported}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)
  console.log(`   🖼️  Images downloaded: ${imageDownloaded}`)
  console.log(`   ⚠️  Images failed: ${imageFailed}`)

  // Show some stats
  const totalArticles = await prisma.article.count()
  console.log(`\n📊 Total articles in database: ${totalArticles}`)

  await prisma.$disconnect()
}

main().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
