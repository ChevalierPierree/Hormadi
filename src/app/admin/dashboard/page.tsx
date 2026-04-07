'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Ticket,
  ShoppingBag,
  Newspaper,
  Calendar,
  TrendingUp,
  BarChart3,
  Loader,
  Users,
  type LucideIcon,
} from 'lucide-react'

type Match = {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  venue: string
  status: string
  isHomeGame: boolean
  competition: string
}

type Article = {
  id: string
  title: string
  published: boolean
  createdAt: string
}

type Product = {
  id: string
  name: string
  price: number
}

type Partner = {
  id: string
  name: string
  visible: boolean
}

export default function AdminDashboard() {
  const [matches, setMatches] = useState<Match[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [matchRes, articleRes, productRes, partnerRes] = await Promise.all([
          fetch('/api/matches?limit=60'),
          fetch('/api/articles?published=all'),
          fetch('/api/products'),
          fetch('/api/partners'),
        ])
        const [matchData, articleData, productData, partnerData] = await Promise.all([
          matchRes.json(),
          articleRes.json(),
          productRes.json(),
          partnerRes.json(),
        ])
        setMatches(matchData.matches || [])
        setArticles(articleData.articles || [])
        setProducts(productData.products || [])
        setPartners(partnerData.partners || [])
      } catch (e) {
        console.error('Error fetching dashboard data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const upcomingMatches = matches
    .filter((m) => m.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const finishedMatches = matches.filter((m) => m.status === 'finished')
  const wins = finishedMatches.filter((m) => {
    if (m.isHomeGame) return (m.homeScore ?? 0) > (m.awayScore ?? 0)
    return (m.awayScore ?? 0) > (m.homeScore ?? 0)
  })
  const publishedArticles = articles.filter((a) => a.published)
  const visiblePartners = partners.filter((p) => p.visible)

  const nextMatch = upcomingMatches[0]
  const nextMatchLabel = nextMatch
    ? `${nextMatch.isHomeGame ? 'vs' : '@'} ${nextMatch.isHomeGame ? nextMatch.awayTeam : nextMatch.homeTeam}`
    : 'Aucun'
  const daysToNext = nextMatch
    ? Math.ceil((new Date(nextMatch.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-hormadi-red" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Tableau de bord</h1>
        <p className="text-hormadi-muted text-sm">
          Bienvenue dans l&apos;administration Hormadi Anglet Hockey
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard label="Matchs joués" value={finishedMatches.length} icon={Calendar} subtext={`${wins.length} victoires / ${finishedMatches.length - wins.length} défaites`} />
        <StatCard label="Matchs à venir" value={upcomingMatches.length} icon={TrendingUp} subtext={daysToNext !== null ? `Prochain dans ${daysToNext}j — ${nextMatchLabel}` : 'Aucun match prévu'} />
        <StatCard label="Articles publiés" value={publishedArticles.length} icon={Newspaper} subtext={`${articles.length - publishedArticles.length} brouillons`} />
        <StatCard label="Produits en boutique" value={products.length} icon={ShoppingBag} subtext="Boutique en ligne" />
        <StatCard label="Partenaires actifs" value={visiblePartners.length} icon={Users} subtext={`${partners.length} partenaires au total`} />
        <StatCard label="Total matchs saison" value={matches.length} icon={BarChart3} subtext="Saison 2025-2026" />
      </div>

      {/* Quick actions */}
      <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/admin/actualites" className="btn-primary text-center justify-center text-sm py-2.5">
            <Newspaper size={16} />
            Nouvel article
          </Link>
          <Link href="/admin/matchs" className="btn-secondary text-center justify-center text-sm py-2.5">
            <Calendar size={16} />
            Gérer les matchs
          </Link>
          <Link href="/admin/boutique/produits" className="btn-secondary text-center justify-center text-sm py-2.5">
            <ShoppingBag size={16} />
            Gérer la boutique
          </Link>
          <Link href="/admin/partenaires" className="btn-secondary text-center justify-center text-sm py-2.5">
            <Users size={16} />
            Gérer les partenaires
          </Link>
        </div>
      </div>

      {/* Two columns: upcoming matches + recent results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming */}
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Prochains matchs</h2>
          {upcomingMatches.length === 0 ? (
            <p className="text-hormadi-muted text-sm">Aucun match à venir</p>
          ) : (
            <div className="space-y-3">
              {upcomingMatches.slice(0, 5).map((match) => (
                <div key={match.id} className="flex items-center justify-between py-3 border-b border-hormadi-border/50 last:border-0">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {match.isHomeGame ? `Hormadi vs ${match.awayTeam}` : `${match.homeTeam} vs Hormadi`}
                    </p>
                    <p className="text-hormadi-muted text-xs">{match.venue}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-medium">
                      {new Date(match.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded ${match.isHomeGame ? 'bg-hormadi-red/20 text-hormadi-red' : 'bg-hormadi-ocean/20 text-hormadi-ocean'}`}>
                      {match.isHomeGame ? 'Dom.' : 'Ext.'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent results */}
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Derniers résultats</h2>
          <div className="space-y-3">
            {finishedMatches
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5)
              .map((match) => {
                const hormadiScore = match.isHomeGame ? match.homeScore : match.awayScore
                const opponentScore = match.isHomeGame ? match.awayScore : match.homeScore
                const isWin = (hormadiScore ?? 0) > (opponentScore ?? 0)
                const opponent = match.isHomeGame ? match.awayTeam : match.homeTeam
                return (
                  <div key={match.id} className="flex items-center justify-between py-3 border-b border-hormadi-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isWin ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {isWin ? 'V' : 'D'}
                      </span>
                      <div>
                        <p className="text-white font-semibold text-sm">
                          {match.isHomeGame ? `Hormadi vs ${opponent}` : `${opponent} vs Hormadi`}
                        </p>
                        <p className="text-hormadi-muted text-xs">
                          {new Date(match.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </div>
                    <p className="text-white font-bold">{match.homeScore} - {match.awayScore}</p>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Recent articles */}
      <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Articles récents</h2>
          <Link href="/admin/actualites" className="text-hormadi-red text-sm hover:underline">
            Voir tout →
          </Link>
        </div>
        <div className="space-y-3">
          {articles.slice(0, 5).map((article) => (
            <div key={article.id} className="flex items-center justify-between py-2 border-b border-hormadi-border/50 last:border-0">
              <p className="text-white text-sm font-medium truncate max-w-md">{article.title}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${article.published ? 'bg-green-500/20 text-green-400' : 'bg-hormadi-border text-hormadi-muted'}`}>
                  {article.published ? 'Publié' : 'Brouillon'}
                </span>
                <span className="text-hormadi-muted text-xs">
                  {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, subtext }: { label: string; value: string | number; icon: LucideIcon; subtext?: string }) {
  return (
    <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-hormadi-muted text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtext && <p className="text-hormadi-muted text-xs mt-2">{subtext}</p>}
        </div>
        <div className="p-3 bg-hormadi-red/10 rounded-lg">
          <Icon className="text-hormadi-red" size={22} />
        </div>
      </div>
    </div>
  )
}
