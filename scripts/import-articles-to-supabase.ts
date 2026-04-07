/**
 * Import real articles from the local JSON export into Supabase PostgreSQL
 *
 * Usage: npx tsx scripts/import-articles-to-supabase.ts
 *
 * Make sure DATABASE_URL is set in .env to your Supabase connection string.
 */

import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

interface ArticleData {
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  imageUrl: string | null
  published: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

async function main() {
  console.log('🏒 Hormadi — Import real articles to Supabase')
  console.log('==============================================\n')

  // Load articles from JSON
  const jsonPath = path.join(__dirname, 'articles-data.json')
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ articles-data.json not found! Run the export first.')
    process.exit(1)
  }

  const articles: ArticleData[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  console.log(`📰 Found ${articles.length} articles to import\n`)

  // Step 1: Delete existing demo articles
  console.log('🗑️  Deleting existing articles...')
  const deleted = await prisma.article.deleteMany({})
  console.log(`   Deleted ${deleted.count} existing articles\n`)

  // Step 2: Import all real articles
  console.log('💾 Importing articles...')
  let imported = 0
  let skipped = 0

  for (const a of articles) {
    try {
      // Check for duplicate slugs
      const existing = await prisma.article.findUnique({ where: { slug: a.slug } })
      if (existing) {
        skipped++
        continue
      }

      await prisma.article.create({
        data: {
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt || a.title.substring(0, 200),
          content: a.content || '',
          category: a.category || 'Club',
          imageUrl: a.imageUrl || null,
          published: a.published !== false,
          publishedAt: a.publishedAt ? new Date(a.publishedAt) : null,
          createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
          updatedAt: a.updatedAt ? new Date(a.updatedAt) : new Date(),
        },
      })
      imported++
      if (imported % 50 === 0) {
        console.log(`   ✅ ${imported} articles imported...`)
      }
    } catch (err: any) {
      console.warn(`   ⚠ Failed to import "${a.slug}": ${err.message}`)
      skipped++
    }
  }

  console.log('\n==============================================')
  console.log('✅ Import complete!')
  console.log(`   📰 Imported: ${imported}`)
  console.log(`   ⏭️  Skipped: ${skipped}`)

  const total = await prisma.article.count()
  console.log(`\n📊 Total articles in Supabase: ${total}`)

  await prisma.$disconnect()
}

main().catch((err) => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
