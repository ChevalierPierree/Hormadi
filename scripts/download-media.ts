/**
 * Download large media from the Hormadi WordPress site
 *
 * Usage: npx tsx scripts/download-media.ts
 *
 * This script:
 * 1. Fetches media library from WordPress REST API
 * 2. Filters for large images (width > 800px) suitable for backgrounds
 * 3. Skips thumbnails and small images
 * 4. Downloads up to 20-30 images locally to public/images/site/
 * 5. Names them descriptively based on their alt_text or title
 */

import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

const WP_BASE = 'https://pro.hormadi.fr/wp-json/wp/v2'
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'site')
const MAX_DOWNLOADS = 25
const MIN_WIDTH = 800

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
    console.log(`  ✓ Already exists: ${filename}`)
    return `/images/site/${filename}`
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
          console.log(`  ✓ Downloaded: ${filename}`)
          resolve(`/images/site/${filename}`)
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

function getImageExtension(url: string): string {
  const match = url.match(/\.(jpe?g|png|gif|webp|svg)(\?.*)?$/i)
  return match ? match[1].toLowerCase() : 'jpg'
}

function sanitizeFilename(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100)
}

function isLargeImage(media: any): boolean {
  if (!media.media_details) return false

  const width = media.media_details.width
  const height = media.media_details.height

  // Must be at least MIN_WIDTH pixels wide
  if (!width || width < MIN_WIDTH) return false

  // Skip obviously small/thumbnail images
  // Typical thumbnails are < 300x300
  if (width < MIN_WIDTH || height < 400) return false

  return true
}

function getImageName(media: any): string {
  // Prefer alt_text, fall back to title, then slug
  let baseName = media.alt_text || media.title?.rendered || media.slug || `media-${media.id}`

  if (baseName.startsWith('<!-- wp:')) {
    baseName = `media-${media.id}`
  }

  baseName = sanitizeFilename(baseName)

  return baseName || `media-${media.id}`
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  console.log('🖼️  Hormadi Media Downloader')
  console.log('============================\n')

  // Ensure images directory
  fs.mkdirSync(IMAGES_DIR, { recursive: true })

  // Fetch all media (paginated)
  console.log('📦 Fetching media library...')
  const allMedia: any[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages && allMedia.length < MAX_DOWNLOADS * 2) {
    const { json: media, headers } = await fetchJSON(
      `${WP_BASE}/media?per_page=100&page=${page}&_fields=id,source_url,alt_text,title,slug,media_details`
    )

    if (page === 1) {
      totalPages = parseInt(headers['x-wp-totalpages'] || '1')
      const total = headers['x-wp-total'] || media.length
      console.log(`   Found ${total} total media items`)
    }

    allMedia.push(...media)
    console.log(`   Page ${page}/${totalPages}: +${media.length} items (total fetched: ${allMedia.length})`)

    if (media.length === 0) break
    page++
  }

  // Filter for large images suitable as backgrounds
  console.log('\n🔍 Filtering for large images (width > ' + MIN_WIDTH + 'px)...')
  const largeImages = allMedia.filter(isLargeImage)

  console.log(`   Found ${largeImages.length} large images`)

  if (largeImages.length === 0) {
    console.log('\n⚠️  No large images found. Exiting.')
    process.exit(0)
  }

  // Download up to MAX_DOWNLOADS
  console.log(`\n⬇️  Downloading up to ${MAX_DOWNLOADS} images...`)

  let downloaded = 0
  let failed = 0
  const downloadedUrls = new Set<string>()

  for (const media of largeImages) {
    if (downloaded >= MAX_DOWNLOADS) break

    const sourceUrl = media.source_url
    if (!sourceUrl || downloadedUrls.has(sourceUrl)) continue
    downloadedUrls.add(sourceUrl)

    const ext = getImageExtension(sourceUrl)
    const baseName = getImageName(media)
    const filename = `${baseName}.${ext}`

    console.log(`\n📥 [${downloaded + 1}/${Math.min(MAX_DOWNLOADS, largeImages.length)}] ${filename}`)
    console.log(`   Size: ${media.media_details.width}x${media.media_details.height}px`)

    const result = await downloadImage(sourceUrl, filename)

    if (result) {
      downloaded++
    } else {
      failed++
    }
  }

  console.log('\n============================')
  console.log('✅ Download complete!')
  console.log(`   🖼️  Images downloaded: ${downloaded}`)
  console.log(`   ⚠️  Images failed: ${failed}`)
  console.log(`   📁 Location: public/images/site/`)
}

main().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
