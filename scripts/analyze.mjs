import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const articles = await prisma.article.findMany({
  where: { imageUrl: null },
  select: { id: true, slug: true, title: true, content: true },
  orderBy: { createdAt: 'desc' }
})

console.log(`Total articles with no images: ${articles.length}\n`)

// Find video articles
const videoArticles = articles.filter(a =>
  a.title.toLowerCase().includes('highlights') ||
  a.title.toLowerCase().includes('season 18') ||
  a.title.toLowerCase().includes('season 19') ||
  a.title.includes('18-19') ||
  a.title.includes('2018-2019')
)

console.log(`Video-related articles found: ${videoArticles.length}\n`)

if (videoArticles.length > 0) {
  console.log('Sample articles:')
  console.log('='.repeat(80))

  for (let i = 0; i < Math.min(5, videoArticles.length); i++) {
    const article = videoArticles[i]
    const hasYoutube = /youtube|youtu\.be|iframe.*youtube/.test(article.content)
    const hasVimeo = /vimeo/.test(article.content)
    const textContent = article.content.replace(/<[^>]+>/g, '').trim()

    console.log(`\n[${i + 1}] ${article.title}`)
    console.log(`    Slug: ${article.slug}`)
    console.log(`    Content size: ${article.content.length} chars`)
    console.log(`    Has YouTube: ${hasYoutube}`)
    console.log(`    Has Vimeo: ${hasVimeo}`)
    console.log(`    Text content: ${textContent.length} chars`)
    if (textContent.length > 0) {
      console.log(`    Preview: ${textContent.substring(0, 100)}...`)
    }
  }

  console.log('\n' + '='.repeat(80))

  const youtubeCount = videoArticles.filter(a => /youtube|youtu\.be/.test(a.content)).length
  const vimeoCount = videoArticles.filter(a => /vimeo/.test(a.content)).length
  const emptyCount = videoArticles.filter(a => a.content.replace(/<[^>]+>/g, '').trim().length < 50).length

  console.log(`\nSummary:`)
  console.log(`  YouTube embeds: ${youtubeCount}`)
  console.log(`  Vimeo embeds: ${vimeoCount}`)
  console.log(`  Essentially empty stubs: ${emptyCount}`)
}

await prisma.$disconnect()
