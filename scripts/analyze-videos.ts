/**
 * Analyze video articles (Highlights) from season 18/19
 * These articles have no images and likely only contain YouTube embeds
 *
 * Usage: npx tsx scripts/analyze-videos.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎥 Analyzing Video Articles\n')

  // Find articles with no images
  const noImageArticles = await prisma.article.findMany({
    where: { imageUrl: null },
    select: { id: true, slug: true, title: true, content: true, createdAt: true }
  })

  console.log(`Found ${noImageArticles.length} articles with no images\n`)

  // Find those with Highlights or season references
  const videoArticles = noImageArticles.filter(a =>
    a.title.toLowerCase().includes('highlights') ||
    a.title.includes('18') ||
    a.title.includes('19')
  )

  console.log(`Found ${videoArticles.length} articles that might be video content\n`)

  if (videoArticles.length === 0) {
    console.log('No video articles found.')
    await prisma.$disconnect()
    return
  }

  console.log('Sample video articles:')
  console.log('='.repeat(80))

  for (let i = 0; i < Math.min(5, videoArticles.length); i++) {
    const article = videoArticles[i]
    console.log(`\n[${i + 1}] ${article.title}`)
    console.log(`    Slug: ${article.slug}`)
    console.log(`    Created: ${article.createdAt.toISOString()}`)
    console.log(`    Content length: ${article.content.length} chars`)

    // Check if it's mostly just embeds
    const hasYoutube = /youtube|youtu\.be|iframe.*youtube/.test(article.content)
    const hasVimeo = /vimeo/.test(article.content)
    const stripHtml = article.content.replace(/<[^>]+>/g, '').trim()
    const textLength = stripHtml.length

    console.log(`    Has YouTube embed: ${hasYoutube}`)
    console.log(`    Has Vimeo embed: ${hasVimeo}`)
    console.log(`    Text content (non-HTML): ${textLength} chars`)

    if (textLength > 0) {
      console.log(`    Text preview: ${stripHtml.substring(0, 150)}${stripHtml.length > 150 ? '...' : ''}`)
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log(`\n📊 Summary:`)
  console.log(`   Total articles with no images: ${noImageArticles.length}`)
  console.log(`   Video-related articles: ${videoArticles.length}`)

  // Analyze patterns
  const youtubeCount = videoArticles.filter(a => /youtube|youtu\.be/.test(a.content)).length
  const vimeoCount = videoArticles.filter(a => /vimeo/.test(a.content)).length
  const emptyCount = videoArticles.filter(a => a.content.replace(/<[^>]+>/g, '').trim().length === 0).length

  console.log(`   YouTube embeds: ${youtubeCount}`)
  console.log(`   Vimeo embeds: ${vimeoCount}`)
  console.log(`   Essentially empty (embed-only): ${emptyCount}`)

  await prisma.$disconnect()
}

main().catch(err => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
