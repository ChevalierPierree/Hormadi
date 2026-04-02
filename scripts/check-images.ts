/**
 * Diagnostic: check how many articles have images and whether the files exist
 *
 * Usage: npx tsx scripts/check-images.ts
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()
const PUBLIC_DIR = path.join(process.cwd(), 'public')

async function main() {
  const articles = await prisma.article.findMany({
    select: { id: true, slug: true, title: true, imageUrl: true, published: true }
  })

  let withImage = 0
  let withoutImage = 0
  let imageExists = 0
  let imageMissing = 0
  const missingFiles: string[] = []
  const noImageArticles: string[] = []

  for (const a of articles) {
    if (a.imageUrl) {
      withImage++
      const filePath = path.join(PUBLIC_DIR, a.imageUrl)
      if (fs.existsSync(filePath)) {
        imageExists++
      } else {
        imageMissing++
        missingFiles.push(`${a.imageUrl} (${a.title.substring(0, 50)})`)
      }
    } else {
      withoutImage++
      noImageArticles.push(a.title.substring(0, 60))
    }
  }

  console.log('🖼️  Image Diagnostic Report')
  console.log('===========================\n')
  console.log(`Total articles: ${articles.length}`)
  console.log(`Published: ${articles.filter(a => a.published).length}`)
  console.log(`\nWith imageUrl set: ${withImage}`)
  console.log(`Without imageUrl (null): ${withoutImage}`)
  console.log(`\nImage file exists on disk: ${imageExists}`)
  console.log(`Image file MISSING from disk: ${imageMissing}`)

  if (imageMissing > 0) {
    console.log(`\n⚠️  Missing image files:`)
    missingFiles.forEach(f => console.log(`  - ${f}`))
  }

  if (noImageArticles.length > 0) {
    console.log(`\n📝 Articles without any image (${noImageArticles.length}):`)
    noImageArticles.forEach(t => console.log(`  - ${t}`))
  }

  // Check category distribution
  const cats: Record<string, number> = {}
  articles.forEach(a => {
    cats[a.imageUrl ? 'with_image' : 'no_image'] = (cats[a.imageUrl ? 'with_image' : 'no_image'] || 0) + 1
  })

  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error('Error:', e.message)
  await prisma.$disconnect()
})
