/**
 * Clean WordPress shortcodes and broken HTML from article content in Supabase
 *
 * Usage: npx tsx scripts/clean-article-content.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function cleanContent(raw: string): string {
  let content = raw

  // ─── 1. Decode base64 blocks from [vc_raw_html] ────────────
  // These contain base64-encoded HTML like JTNDaWZyYW1l...
  content = content.replace(
    /\[vc_raw_html[^\]]*\]([A-Za-z0-9+/=\s]+)\[\/vc_raw_html\]/g,
    (_match, b64) => {
      try {
        const decoded = Buffer.from(b64.trim(), 'base64').toString('utf-8')
        // If it's an iframe (video embed), convert to a link or keep iframe
        if (decoded.includes('<iframe')) {
          const srcMatch = decoded.match(/src=["']([^"']+)["']/)
          if (srcMatch) {
            return `<p><a href="${srcMatch[1]}" target="_blank">Voir la vidéo</a></p>`
          }
        }
        return decoded
      } catch {
        return ''
      }
    }
  )

  // ─── 2. Remove ALL Visual Composer / WPBakery shortcodes ───
  // Self-closing: [vc_empty_space], [vc_separator], [vc_single_image ...], etc.
  content = content.replace(/\[\/?vc_[^\]]*\]/g, '')
  content = content.replace(/\[\/?stm_[^\]]*\]/g, '')

  // ─── 3. Fix HTML entities and encoding ─────────────────────
  content = content.replace(/&rsquo;/g, "'")
  content = content.replace(/&lsquo;/g, "'")
  content = content.replace(/&rdquo;/g, '"')
  content = content.replace(/&ldquo;/g, '"')
  content = content.replace(/&Prime;/g, '"')
  content = content.replace(/&prime;/g, "'")
  content = content.replace(/&nbsp;/g, ' ')
  content = content.replace(/&amp;/g, '&')
  content = content.replace(/&lt;/g, '<')
  content = content.replace(/&gt;/g, '>')
  content = content.replace(/&#8217;/g, "'")
  content = content.replace(/&#8216;/g, "'")
  content = content.replace(/&#8220;/g, '"')
  content = content.replace(/&#8221;/g, '"')
  content = content.replace(/&#8211;/g, '–')
  content = content.replace(/&#8212;/g, '—')
  content = content.replace(/&#8230;/g, '…')
  content = content.replace(/»/g, '»')
  content = content.replace(/«/g, '«')

  // ─── 4. Remove images pointing to old WordPress domain ─────
  content = content.replace(/<img[^>]*src=["'][^"']*pro\.hormadi\.fr[^"']*["'][^>]*\/?>/gi, '')

  // ─── 5. Remove empty/broken links to old domain ────────────
  content = content.replace(/<a[^>]*href=["'][^"']*pro\.hormadi\.fr[^"']*["'][^>]*>(.*?)<\/a>/gi, '$1')

  // ─── 6. Clean up remaining WordPress artifacts ─────────────
  // Remove inline styles and classes (already partially done by import script)
  content = content.replace(/\s*class="[^"]*"/g, '')
  content = content.replace(/\s*style="[^"]*"/g, '')
  content = content.replace(/\s*id="[^"]*"/g, '')
  content = content.replace(/\s*data-[a-z-]+="[^"]*"/g, '')

  // Remove loading/decoding attributes from any remaining images
  content = content.replace(/\s*loading="[^"]*"/g, '')
  content = content.replace(/\s*decoding="[^"]*"/g, '')
  content = content.replace(/\s*srcset="[^"]*"/g, '')
  content = content.replace(/\s*sizes="[^"]*"/g, '')
  content = content.replace(/\s*width="[^"]*"/g, '')
  content = content.replace(/\s*height="[^"]*"/g, '')

  // ─── 7. Clean up structural HTML ──────────────────────────
  // Remove empty divs, spans, paragraphs
  content = content.replace(/<div\s*>\s*<\/div>/g, '')
  content = content.replace(/<span\s*>\s*<\/span>/g, '')
  content = content.replace(/<p\s*>\s*<\/p>/g, '')
  content = content.replace(/<p\s*><br\s*\/?>\s*<\/p>/g, '')

  // Unwrap unnecessary divs (keep content)
  content = content.replace(/<div[^>]*>([\s\S]*?)<\/div>/g, '$1')
  // Run again for nested divs
  content = content.replace(/<div[^>]*>([\s\S]*?)<\/div>/g, '$1')
  content = content.replace(/<div[^>]*>([\s\S]*?)<\/div>/g, '$1')

  // ─── 8. Normalize whitespace ──────────────────────────────
  // Remove excessive line breaks
  content = content.replace(/\n{3,}/g, '\n\n')
  // Remove spaces between tags
  content = content.replace(/>\s+</g, '>\n<')
  // Trim
  content = content.trim()

  // ─── 9. Wrap plain text in paragraphs if needed ────────────
  // If content has no <p> tags at all, wrap lines in <p>
  if (!content.includes('<p>') && !content.includes('<p ')) {
    content = content
      .split(/\n\n+/)
      .filter(line => line.trim())
      .map(line => `<p>${line.trim()}</p>`)
      .join('\n')
  }

  return content
}

async function main() {
  console.log('🧹 Hormadi — Clean article content')
  console.log('====================================\n')

  const articles = await prisma.article.findMany({
    select: { id: true, slug: true, content: true },
  })

  console.log(`📰 Found ${articles.length} articles to clean\n`)

  let cleaned = 0
  let unchanged = 0

  for (const article of articles) {
    const original = article.content
    const cleanedContent = cleanContent(original)

    if (cleanedContent !== original) {
      await prisma.article.update({
        where: { id: article.id },
        data: { content: cleanedContent },
      })
      cleaned++
      if (cleaned % 50 === 0) {
        console.log(`   ✅ ${cleaned} articles cleaned...`)
      }
    } else {
      unchanged++
    }
  }

  console.log('\n====================================')
  console.log('✅ Cleaning complete!')
  console.log(`   🧹 Cleaned: ${cleaned}`)
  console.log(`   ✓  Unchanged: ${unchanged}`)

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
