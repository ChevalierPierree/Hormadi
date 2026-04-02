/**
 * Fix missing article images by extracting them from HTML content
 *
 * Many articles (especially video highlights) have YouTube embeds or
 * inline images in the content but no featured_media on WordPress.
 * This script:
 * 1. Finds articles with no imageUrl
 * 2. Tries to extract a YouTube thumbnail from embed URLs
 * 3. Falls back to the first <img> in the HTML content
 * 4. Downloads the image and updates the article
 *
 * Usage: npx tsx scripts/fix-missing-images.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'

const prisma = new PrismaClient()
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'news')

// ─── Helpers ─────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80)
}

function downloadImage(url: string, filename: string): Promise<string | null> {
  return new Promise((resolve) => {
    const filePath = path.join(IMAGES_DIR, filename)

    // Skip if already exists
    if (fs.existsSync(filePath)) {
      resolve(`/images/news/${filename}`)
      return
    }

    const protocol = url.startsWith('https') ? https : http

    function doDownload(downloadUrl: string, redirectCount = 0) {
      if (redirectCount > 5) { resolve(null); return }

      protocol.get(downloadUrl, { headers: { 'User-Agent': 'Hormadi-Site-Importer/1.0' } }, (res: any) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          const location = res.headers.location
          if (location) {
            // Handle relative redirects
            const nextUrl = location.startsWith('http') ? location : new URL(location, downloadUrl).toString()
            doDownload(nextUrl, redirectCount + 1)
          } else {
            resolve(null)
          }
          return
        }
        if (res.statusCode !== 200) {
          resolve(null)
          return
        }
        const file = fs.createWriteStream(filePath)
        res.pipe(file)
        file.on('finish', () => {
          file.close()
          // Check file size — skip tiny images (broken downloads)
          const stat = fs.statSync(filePath)
          if (stat.size < 1000) {
            fs.unlinkSync(filePath)
            resolve(null)
          } else {
            resolve(`/images/news/${filename}`)
          }
        })
        file.on('error', () => {
          try { fs.unlinkSync(filePath) } catch {}
          resolve(null)
        })
      }).on('error', () => resolve(null))
    }

    doDownload(url)
  })
}

function extractYouTubeId(html: string): string | null {
  // Match YouTube embed URLs, watch URLs, youtu.be links
  const patterns = [
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ]
  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return match[1]
  }
  return null
}

function extractFirstImage(html: string): string | null {
  // Find the first <img> src in the content
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (match && match[1]) {
    const src = match[1]
    // Skip tiny tracking pixels, icons, emojis
    if (src.includes('wp-smiley') || src.includes('emoji') || src.includes('1x1')) return null
    // Must be a real image URL
    if (src.startsWith('http') || src.startsWith('//')) {
      return src.startsWith('//') ? `https:${src}` : src
    }
  }
  return null
}

// ─── Main ────────────────────────────────────────────────

async function main() {
  console.log('🖼️  Fix Missing Article Images')
  console.log('================================\n')

  fs.mkdirSync(IMAGES_DIR, { recursive: true })

  // Find articles without images
  const articles = await prisma.article.findMany({
    where: { imageUrl: null },
    select: { id: true, slug: true, title: true, content: true }
  })

  console.log(`Found ${articles.length} articles without images\n`)

  let fixed = 0
  let youtubeFixed = 0
  let inlineFixed = 0
  let unfixable = 0

  for (const article of articles) {
    const content = article.content || ''
    let imageUrl: string | null = null

    // Strategy 1: YouTube thumbnail
    const ytId = extractYouTubeId(content)
    if (ytId) {
      // Try maxresdefault first, then hqdefault
      const filename = `${slugify(article.title)}-yt.jpg`
      imageUrl = await downloadImage(`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`, filename)
      if (!imageUrl) {
        imageUrl = await downloadImage(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`, filename)
      }
      if (imageUrl) {
        youtubeFixed++
      }
    }

    // Strategy 2: First inline image
    if (!imageUrl) {
      const inlineSrc = extractFirstImage(content)
      if (inlineSrc) {
        const ext = inlineSrc.match(/\.(jpe?g|png|gif|webp)(\?.*)?$/i)?.[1] || 'jpg'
        const filename = `${slugify(article.title)}.${ext}`
        imageUrl = await downloadImage(inlineSrc, filename)
        if (imageUrl) {
          inlineFixed++
        }
      }
    }

    if (imageUrl) {
      await prisma.article.update({
        where: { id: article.id },
        data: { imageUrl }
      })
      fixed++
      console.log(`  ✅ ${article.title.substring(0, 55)} → ${imageUrl.split('/').pop()}`)
    } else {
      unfixable++
      console.log(`  ⬜ ${article.title.substring(0, 55)} — no image source found`)
    }
  }

  console.log('\n================================')
  console.log(`✅ Fixed: ${fixed} (YouTube: ${youtubeFixed}, Inline: ${inlineFixed})`)
  console.log(`⬜ No image source: ${unfixable}`)

  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('❌ Error:', e.message)
  await prisma.$disconnect()
  process.exit(1)
})
