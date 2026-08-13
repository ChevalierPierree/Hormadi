'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Search, Loader2, ChevronRight, ChevronLeft, Newspaper } from 'lucide-react'
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

interface ApiResponse {
  articles: Article[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

const CATEGORIES = ['Tous', 'Club', 'Vie du Club', 'Arrivées', 'Départs', 'Prolongations', 'Interview', 'Jeu concours']
const ITEMS_PER_PAGE = 12

const categoryColors: Record<string, string> = {
  Club: 'bg-hormadi-forest text-white',
  'Vie du Club': 'bg-hormadi-ocean/80 text-white',
  Arrivées: 'bg-green-600 text-white',
  Départs: 'bg-hormadi-red/80 text-white',
  Prolongations: 'bg-hormadi-ocean text-white',
  Interview: 'bg-purple-600 text-white',
  Match: 'bg-hormadi-red text-white',
  'Jeu concours': 'bg-pink-600 text-white',
}

function ArticleSkeleton() {
  return (
    <div className="bg-hormadi-surface border border-hormadi-border rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[16/10] bg-hormadi-dark" />
      <div className="p-5">
        <div className="h-4 bg-hormadi-dark rounded w-20 mb-3" />
        <div className="h-5 bg-hormadi-dark rounded mb-2" />
        <div className="h-5 bg-hormadi-dark rounded w-3/4 mb-3" />
        <div className="h-4 bg-hormadi-dark rounded w-full mb-2" />
        <div className="h-4 bg-hormadi-dark rounded w-2/3" />
      </div>
    </div>
  )
}

export default function ActualitesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('Tous')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [selectedCategory, currentPage, searchQuery])

  async function fetchArticles() {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        published: 'true',
        limit: ITEMS_PER_PAGE.toString(),
        page: currentPage.toString(),
      })

      if (selectedCategory !== 'Tous') {
        params.set('category', selectedCategory)
      }

      if (searchQuery) {
        params.set('search', searchQuery)
      }

      const res = await fetch(`/api/articles?${params}`)
      const data: ApiResponse = await res.json()
      setArticles(data.articles || [])
      setTotal(data.pagination?.total || 0)
      setTotalPages(data.pagination?.pages || 1)
    } catch (err) {
      console.error('Failed to fetch articles:', err)
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setCurrentPage(1)
  }

  function handleCategoryChange(category: string) {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return ''
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  return (
    <div className="min-h-screen bg-hormadi-dark text-white">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden">
        {/* Fallback gradient (behind the image) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />

        {/* Background image */}
        <img
          src="/images/hero-actualites.jpg"
          alt="Actualités Hormadi"
          className="absolute inset-0 z-[1] w-full h-full object-cover"
        />

        {/* Dark overlays for text readability */}
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/50 to-hormadi-dark/20" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-hormadi-dark/70 via-transparent to-transparent" />

        {/* Decorative elements */}
        <div className="absolute z-[3] top-0 right-0 w-96 h-96 bg-hormadi-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute z-[3] bottom-0 left-0 w-72 h-72 bg-hormadi-ocean/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        {/* Content */}
        <div className="relative z-[5] h-full flex flex-col justify-end pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Actualités</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
                  <Newspaper size={20} className="text-hormadi-red" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
                  Saison 2026-2027
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
                ACTUALITÉS
              </h1>
              <p className="text-hormadi-muted mt-3 text-base sm:text-lg max-w-lg">
                Suivez toutes les dernières nouvelles de l&apos;Hormadi Anglet, transferts, interviews et vie du club.
              </p>
            </div>

            {/* Stats cards */}
            <div className="flex gap-3">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10 text-center min-w-[80px]">
                <span className="block text-2xl font-black text-white">{total}</span>
                <span className="text-[11px] text-hormadi-muted uppercase tracking-wide">Articles</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade line */}
        <div className="absolute z-[5] bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hormadi-red/30 to-transparent" />
      </section>

      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pt-24 pb-24">
        {/* ═══════════════════════════════════════════════════════
            FILTERS & SEARCH
        ═══════════════════════════════════════════════════════ */}
        <div className="mb-10">
          {/* Top row: Category tabs + Search */}
          <div className="flex flex-col gap-6">
            {/* Category Filter — horizontal scroll on mobile */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={cn(
                    'relative px-4 py-2 text-sm font-semibold whitespace-nowrap rounded-lg transition-all duration-200',
                    selectedCategory === category
                      ? 'bg-hormadi-red/10 text-hormadi-red'
                      : 'text-hormadi-muted hover:text-white hover:bg-white/5'
                  )}
                >
                  {category}
                  {selectedCategory === category && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-hormadi-red rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-hormadi-border" />

            {/* Search + Results count row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-hormadi-muted pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-hormadi-surface/50 border border-hormadi-border
                             text-sm text-white placeholder:text-hormadi-muted/60
                             focus:outline-none focus:border-hormadi-red/50 focus:bg-hormadi-surface
                             transition-all duration-200"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setCurrentPage(1) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-hormadi-muted hover:text-white transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </button>
                )}
              </form>

              {/* Results count */}
              {!loading && (
                <span className="text-sm text-hormadi-muted tabular-nums">
                  {total} article{total !== 1 ? 's' : ''}
                  {selectedCategory !== 'Tous' && (
                    <> &middot; <span className="text-hormadi-red font-medium">{selectedCategory}</span></>
                  )}
                </span>
              )}
              {loading && (
                <span className="flex items-center gap-2 text-sm text-hormadi-muted">
                  <Loader2 size={14} className="animate-spin" />
                  Chargement...
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <ArticleSkeleton key={i} />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-hormadi-surface border border-hormadi-border flex items-center justify-center">
              <Newspaper size={28} className="text-hormadi-muted" />
            </div>
            <p className="text-base text-hormadi-muted mb-2">Aucun article trouvé</p>
            <p className="text-sm text-hormadi-muted/60 mb-6">
              {searchQuery ? `Aucun résultat pour "${searchQuery}"` : `Aucun article dans la catégorie "${selectedCategory}"`}
            </p>
            <button
              onClick={() => {
                setSelectedCategory('Tous')
                setSearchQuery('')
                setCurrentPage(1)
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-hormadi-red/10 text-hormadi-red text-sm font-semibold
                         hover:bg-hormadi-red hover:text-white transition-all duration-200"
            >
              Voir tous les articles
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/actualites/${article.slug}`}
                className="group card-sport bg-hormadi-surface border border-hormadi-border rounded-xl overflow-hidden
                           transition-all duration-300 hover:border-hormadi-red hover:shadow-xl hover:shadow-hormadi-red/20"
              >
                {/* Image with Gradient Overlay */}
                <div className="aspect-[16/10] w-full relative overflow-hidden bg-hormadi-dark">
                  {article.imageUrl ? (
                    <>
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-hormadi-dark via-transparent to-transparent opacity-60" />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-hormadi-forest to-hormadi-dark
                                    flex items-center justify-center">
                      <div className="text-5xl">⚽</div>
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={cn('px-3 py-1.5 text-xs font-bold rounded-full', categoryColors[article.category] || 'bg-white/20 text-white')}>
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-hormadi-muted mb-3 font-medium">
                    <Calendar size={14} className="flex-shrink-0" />
                    <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                  </div>
                  <h3 className="font-display font-bold text-base leading-snug mb-3
                                 group-hover:text-hormadi-red transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-hormadi-muted line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm text-hormadi-red font-bold
                                  group-hover:gap-3 transition-all">
                    Lire la suite
                    <ChevronRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 flex-wrap pt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={cn(
                'p-2 rounded-lg transition-all',
                currentPage === 1
                  ? 'text-hormadi-muted/50 cursor-not-allowed'
                  : 'text-hormadi-ice hover:bg-hormadi-red hover:text-white'
              )}
            >
              <ChevronLeft size={20} />
            </button>

            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let page: number
              if (totalPages <= 7) {
                page = i + 1
              } else if (currentPage <= 4) {
                page = i + 1
              } else if (currentPage >= totalPages - 3) {
                page = totalPages - 6 + i
              } else {
                page = currentPage - 3 + i
              }
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    'h-10 min-w-10 rounded-lg text-sm font-bold transition-all',
                    currentPage === page
                      ? 'bg-hormadi-red text-white shadow-lg shadow-hormadi-red/30'
                      : 'bg-hormadi-surface border border-hormadi-border text-hormadi-ice hover:border-hormadi-red hover:text-hormadi-red'
                  )}
                >
                  {page}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={cn(
                'p-2 rounded-lg transition-all',
                currentPage === totalPages
                  ? 'text-hormadi-muted/50 cursor-not-allowed'
                  : 'text-hormadi-ice hover:bg-hormadi-red hover:text-white'
              )}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
