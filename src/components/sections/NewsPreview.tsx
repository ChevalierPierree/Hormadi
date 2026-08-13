'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  category: string
  imageUrl: string | null
  publishedAt: string | null
  createdAt: string
}

const categoryColors: Record<string, string> = {
  Club: 'bg-hormadi-red/20 text-hormadi-red',
  'Vie du Club': 'bg-hormadi-ocean/20 text-hormadi-ocean',
  Arrivées: 'bg-green-500/20 text-green-400',
  Départs: 'bg-red-500/20 text-red-400',
  Prolongations: 'bg-hormadi-ocean/20 text-hormadi-ocean',
  Interview: 'bg-purple-500/20 text-purple-400',
  'Jeu concours': 'bg-pink-500/20 text-pink-400',
  Match: 'bg-hormadi-red/20 text-hormadi-red',
}

export default function NewsPreview() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/articles?published=true&limit=4')
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || [])
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const featuredArticle = articles[0]
  const otherArticles = articles.slice(1, 4)

  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <div className="section-padding">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12 sm:mb-16">
          <div className="border-l-4 border-hormadi-red pl-6">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              ACTUALITÉS
            </h2>
            <p className="text-hormadi-muted text-sm sm:text-base mt-1">
              Les dernières nouvelles du club
            </p>
          </div>
          <Link
            href="/actualites"
            className="hidden sm:inline-flex items-center gap-1 text-sm text-hormadi-muted hover:text-hormadi-red transition-colors group"
          >
            Toutes les actualités
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Featured skeleton */}
            <div className="lg:col-span-1 lg:row-span-2">
              <div className="card-news h-full overflow-hidden bg-hormadi-dark/50 animate-pulse">
                <div className="aspect-[16/9] bg-hormadi-forest/20" />
                <div className="p-6 sm:p-8 space-y-4">
                  <div className="h-4 bg-hormadi-forest/20 rounded w-1/4" />
                  <div className="h-6 bg-hormadi-forest/20 rounded w-3/4" />
                  <div className="h-4 bg-hormadi-forest/20 rounded w-full" />
                  <div className="h-4 bg-hormadi-forest/20 rounded w-5/6" />
                </div>
              </div>
            </div>

            {/* Other skeletons */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card-news overflow-hidden bg-hormadi-dark/50 animate-pulse">
                <div className="aspect-video bg-hormadi-forest/20" />
                <div className="p-4 sm:p-6 space-y-3">
                  <div className="h-3 bg-hormadi-forest/20 rounded w-1/3" />
                  <div className="h-4 bg-hormadi-forest/20 rounded w-5/6" />
                  <div className="h-3 bg-hormadi-forest/20 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Featured Article - Large Card */}
            {featuredArticle && (
              <FeaturedArticleCard article={featuredArticle} />
            )}

            {/* Other Articles - Normal Cards */}
            <div className="flex flex-col gap-6 lg:gap-8">
              {otherArticles.map((article) => (
                <NormalArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-hormadi-muted">Aucun article disponible</p>
          </div>
        )}
      </div>
    </section>
  )
}

function FeaturedArticleCard({ article }: { article: Article }) {
  const date = new Date(article.publishedAt || article.createdAt)
  const dateStr = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Link href={`/actualites/${article.slug}`} className="group h-full">
      <div className="card-news h-full overflow-hidden flex flex-col bg-hormadi-dark/30">
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-[16/9] bg-hormadi-forest/10">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105
                         transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-hormadi-forest to-hormadi-ocean
                            flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-hormadi-dark/50 flex items-center justify-center
                              group-hover:scale-125 transition-transform duration-500">
                <span className="text-5xl font-black text-hormadi-red/30">H</span>
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6">
            <span
              className={cn(
                'inline-flex items-center px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold',
                categoryColors[article.category] || 'bg-white/10 text-white'
              )}
            >
              {article.category}
            </span>
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between bg-white">
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-4">
            <Calendar size={14} className="text-hormadi-red" />
            <time>{dateStr}</time>
          </div>

          {/* Title & Excerpt */}
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4
                           text-gray-900 group-hover:text-hormadi-red transition-colors
                           leading-tight line-clamp-3">
              {article.title}
            </h3>

            <p className="text-sm sm:text-base text-gray-600 line-clamp-3 leading-relaxed">
              {article.excerpt}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-6 sm:mt-8 flex items-center gap-2 text-hormadi-red font-bold
                          text-sm sm:text-base group-hover:gap-3 transition-all">
            Lire l&apos;article complet
            <span className="text-lg">→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

function NormalArticleCard({ article }: { article: Article }) {
  const date = new Date(article.publishedAt || article.createdAt)
  const dateStr = date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Link href={`/actualites/${article.slug}`} className="group">
      <div className="card-news h-full overflow-hidden flex flex-col sm:flex-row
                      bg-hormadi-dark/30">
        {/* Image Container */}
        <div className="w-full sm:w-44 lg:w-52 flex-shrink-0 relative overflow-hidden
                        aspect-video sm:aspect-[4/3] bg-hormadi-forest/10">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105
                         transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-hormadi-forest to-hormadi-ocean
                            flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-hormadi-dark/50 flex items-center justify-center
                              group-hover:scale-110 transition-transform duration-700">
                <span className="text-3xl font-black text-hormadi-red/30">H</span>
              </div>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold',
                categoryColors[article.category] || 'bg-white/10 text-white'
              )}
            >
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:py-5 sm:px-6 flex flex-col justify-center min-h-0 bg-white">
          {/* Meta */}
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <Calendar size={12} className="text-hormadi-red" />
            <time>{dateStr}</time>
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-gray-900
                         group-hover:text-hormadi-red transition-colors duration-300
                         leading-snug line-clamp-2">
            {article.title}
          </h3>

          {/* CTA */}
          <div className="flex items-center gap-1.5 text-hormadi-red font-semibold
                          text-xs sm:text-sm mt-3 group-hover:gap-2.5 transition-all duration-300">
            Découvrir
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
