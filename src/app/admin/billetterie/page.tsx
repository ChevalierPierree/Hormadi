'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, Users, Percent, Calendar, ArrowRight, Loader } from 'lucide-react'

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
  ticketCategories?: TicketCategory[]
}

type TicketCategory = {
  id: string
  name: string
  price: number
  capacity: number
  sold: number
}

export default function AdminBilletteriePage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/matches?limit=60')
        const data = await res.json()
        const allMatches: Match[] = data.matches || []

        // Only show upcoming home games (those with ticket sales)
        const upcomingHome = allMatches
          .filter((m) => m.status === 'scheduled' && m.isHomeGame)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        // Fetch ticket categories for each match
        const matchesWithTickets = await Promise.all(
          upcomingHome.map(async (match) => {
            try {
              const ticketRes = await fetch(`/api/matches/${match.id}`)
              const ticketData = await ticketRes.json()
              return { ...match, ticketCategories: ticketData.match?.ticketCategories || [] }
            } catch {
              return { ...match, ticketCategories: [] }
            }
          })
        )

        setMatches(matchesWithTickets)
      } catch (e) {
        console.error('Error fetching billetterie data:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const getMatchStats = (match: Match) => {
    const categories = match.ticketCategories || []
    const sold = categories.reduce((sum, c) => sum + c.sold, 0)
    const capacity = categories.reduce((sum, c) => sum + c.capacity, 0)
    const revenue = categories.reduce((sum, c) => sum + (c.sold * c.price), 0)
    return { sold, capacity, revenue }
  }

  const totalSold = matches.reduce((sum, m) => sum + getMatchStats(m).sold, 0)
  const totalCapacity = matches.reduce((sum, m) => sum + getMatchStats(m).capacity, 0)
  const totalRevenue = matches.reduce((sum, m) => sum + getMatchStats(m).revenue, 0)
  const avgFillRate = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-hormadi-red" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Billetterie</h1>
        <p className="text-hormadi-muted text-sm">Gestion des ventes de billets pour les matchs à domicile</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-hormadi-muted text-sm font-medium">Billets vendus</p>
              <p className="text-3xl font-bold text-white mt-2">{totalSold}</p>
              <p className="text-hormadi-muted text-xs mt-2">sur {totalCapacity} places</p>
            </div>
            <div className="p-3 bg-hormadi-red/10 rounded-lg">
              <Users className="text-hormadi-red" size={22} />
            </div>
          </div>
        </div>

        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-hormadi-muted text-sm font-medium">Revenu total</p>
              <p className="text-3xl font-bold text-white mt-2">{(totalRevenue / 100).toLocaleString('fr-FR')}€</p>
              <p className="text-hormadi-muted text-xs mt-2">Billetterie saison</p>
            </div>
            <div className="p-3 bg-hormadi-red/10 rounded-lg">
              <TrendingUp className="text-hormadi-red" size={22} />
            </div>
          </div>
        </div>

        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-hormadi-muted text-sm font-medium">Taux de remplissage</p>
              <p className="text-3xl font-bold text-white mt-2">{avgFillRate}%</p>
              <div className="w-full bg-hormadi-border rounded-full h-2 mt-3">
                <div
                  className="h-full bg-gradient-to-r from-hormadi-red to-red-400 rounded-full transition-all"
                  style={{ width: `${avgFillRate}%` }}
                />
              </div>
            </div>
            <div className="p-3 bg-hormadi-red/10 rounded-lg">
              <Percent className="text-hormadi-red" size={22} />
            </div>
          </div>
        </div>

        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-hormadi-muted text-sm font-medium">Matchs en vente</p>
              <p className="text-3xl font-bold text-white mt-2">{matches.length}</p>
              <p className="text-hormadi-muted text-xs mt-2">Matchs à domicile</p>
            </div>
            <div className="p-3 bg-hormadi-red/10 rounded-lg">
              <Calendar className="text-hormadi-red" size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Matches Table */}
      <div className="bg-hormadi-surface border border-hormadi-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-hormadi-border">
          <h2 className="text-lg font-bold text-white">Matchs à domicile à venir</h2>
        </div>
        {matches.length === 0 ? (
          <div className="p-12 text-center text-hormadi-muted">
            Aucun match à domicile à venir
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-hormadi-border">
                <tr>
                  <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Date</th>
                  <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Adversaire</th>
                  <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Compétition</th>
                  <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Ventes</th>
                  <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Revenu</th>
                  <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Taux</th>
                  <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hormadi-border/50">
                {matches.map((match) => {
                  const stats = getMatchStats(match)
                  const fillRate = stats.capacity > 0 ? Math.round((stats.sold / stats.capacity) * 100) : 0
                  const opponent = match.isHomeGame ? match.awayTeam : match.homeTeam
                  return (
                    <tr key={match.id} className="hover:bg-hormadi-border/20 transition-colors">
                      <td className="py-4 px-5">
                        <span className="text-white font-medium text-sm">
                          {new Date(match.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        <p className="text-hormadi-muted text-xs">
                          {new Date(match.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-white font-semibold text-sm">{opponent}</span>
                        <p className="text-hormadi-muted text-xs">{match.venue}</p>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-xs px-2 py-0.5 rounded bg-hormadi-ocean/20 text-hormadi-ocean">
                          {match.competition}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-white font-semibold text-sm">
                          {stats.sold}/{stats.capacity}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="text-white font-semibold text-sm">{(stats.revenue / 100).toLocaleString('fr-FR')}€</span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-hormadi-border rounded-full h-2">
                            <div
                              className="h-full bg-hormadi-red rounded-full"
                              style={{ width: `${fillRate}%` }}
                            />
                          </div>
                          <span className="text-white text-xs font-semibold w-8 text-right">
                            {fillRate}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <Link
                          href={`/admin/billetterie/${match.id}`}
                          className="text-hormadi-red hover:text-red-400 transition-colors inline-flex items-center gap-1 text-sm"
                        >
                          Détails
                          <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
