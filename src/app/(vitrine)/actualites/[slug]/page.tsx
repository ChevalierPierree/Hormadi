'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  category: string
  imageUrl: string | null
  publishedAt: string | null
  createdAt: string
}

interface RecentArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  imageUrl: string | null
  publishedAt: string | null
  category: string
}

interface ApiResponse {
  article: Article
  recentArticles: RecentArticle[]
}

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

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function loadArticle() {
      setLoading(true)
      try {
        const res = await fetch(`/api/articles/${params.slug}`)
        if (!res.ok) {
          setNotFound(true)
          return
        }
        const data: ApiResponse = await res.json()
        setArticle(data.article)
        setRecentArticles(data.recentArticles || [])
      } catch (err) {
        console.error('Failed to load article:', err)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    loadArticle()
  }, [params.slug])

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return ''
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateStr))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-hormadi-dark text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-hormadi-red" />
      </div>
    )
  }

  if (notFound || !article) {
    return (
      <div className="min-h-screen bg-hormadi-dark text-white flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mb-4 text-6xl">📰</div>
          <h1 className="text-3xl font-display font-bold mb-2">Article non trouvé</h1>
          <p className="text-hormadi-muted mb-8">Désolé, cet article n'existe pas ou a été supprimé.</p>
          <Link href="/actualites" className="btn-primary inline-block">
            Retour aux actualités
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-hormadi-dark text-white">
      {/* Hero Image with Title Overlay */}
      <div className="relative w-full h-96 sm:h-[500px] overflow-hidden bg-hormadi-dark">
        {article.imageUrl ? (
          <>
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-hormadi-dark via-hormadi-dark/40 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-hormadi-forest to-hormadi-dark
                          flex items-center justify-center">
            <div className="text-7xl opacity-20">⚽</div>
          </div>
        )}

        {/* Title Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className={cn('px-3 py-1.5 text-xs font-bold rounded-full', categoryColors[article.category] || 'bg-white/20 text-white')}>
                {article.category}
              </span>
              <span className="flex items-center gap-2 text-sm text-hormadi-ice font-medium">
                <Calendar size={16} />
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-tight max-w-4xl">
              {article.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-12 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Article Content */}
          <div className="lg:col-span-2">
            {/* Article Body */}
            <div
              className="prose-hormadi prose prose-invert max-w-none
                         prose-p:text-hormadi-ice prose-p:leading-relaxed prose-p:text-base
                         prose-a:text-hormadi-ocean prose-a:font-medium hover:prose-a:text-hormadi-red
                         prose-img:rounded-lg prose-img:mx-auto prose-img:shadow-lg
                         prose-strong:text-white prose-strong:font-bold
                         prose-h2:text-white prose-h2:font-display prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                         prose-h3:text-hormadi-ice prose-h3:font-display prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
                         prose-h4:text-hormadi-ice prose-h4:font-bold prose-h4:mt-8
                         prose-blockquote:border-l-4 prose-blockquote:border-hormadi-red prose-blockquote:bg-hormadi-surface/50 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:text-hormadi-muted
                         prose-ul:text-hormadi-ice prose-ul:space-y-2
                         prose-ol:text-hormadi-ice prose-ol:space-y-2
                         prose-li:marker:text-hormadi-red
                         prose-table:border prose-table:border-hormadi-border
                         prose-th:bg-hormadi-surface prose-th:border prose-th:border-hormadi-border prose-th:text-white
                         prose-td:border prose-td:border-hormadi-border
                         mb-12"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Back Link */}
            <Link
              href="/actualites"
              className="inline-flex items-center gap-2 text-hormadi-red hover:text-hormadi-ice transition-colors font-bold group"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              Retour aux actualités
            </Link>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6 sticky top-24">
              <h3 className="text-lg font-display font-bold mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-hormadi-red rounded-full" />
                Articles récents
              </h3>

              {recentArticles.length > 0 ? (
                <div className="space-y-4">
                  {recentArticles.map((recent) => (
                    <Link
                      key={recent.id}
                      href={`/actualites/${recent.slug}`}
                      className="group flex gap-3 p-3 rounded-lg bg-hormadi-dark border border-hormadi-border
                                 hover:border-hormadi-red transition-all hover:shadow-lg hover:shadow-hormadi-red/10"
                    >
                      {/* Thumbnail */}
                      {recent.imageUrl ? (
                        <img
                          src={recent.imageUrl}
                          alt={recent.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-hormadi-forest flex-shrink-0 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-bold text-hormadi-ocean">⚽</span>
                        </div>
                      )}

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-hormadi-muted mb-1 font-medium">
                          {formatDate(recent.publishedAt)}
                        </p>
                        <p className="text-sm font-bold group-hover:text-hormadi-red transition-colors line-clamp-2">
                          {recent.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-hormadi-muted">Aucun article récent.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
