'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Edit2, Plus, Download, Loader, X, Check } from 'lucide-react'

type TicketCategory = {
  id: string
  name: string
  price: number
  capacity: number
  sold: number
}

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
  ticketCategories: TicketCategory[]
}

type Reservation = {
  id: string
  reference: string
  customerName: string
  email: string
  quantity: number
  amount: number
  status: 'confirmed' | 'pending' | 'cancelled'
}

export default function AdminMatchDetailPage({ params }: { params: { matchId: string } }) {
  const [match, setMatch] = useState<Match | null>(null)
  const [categories, setCategories] = useState<TicketCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [editCapacity, setEditCapacity] = useState('')
  const [showQuickSale, setShowQuickSale] = useState(false)
  const [quickSale, setQuickSale] = useState({ customerName: '', email: '', sectionId: '', quantity: 1 })
  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    async function fetchMatch() {
      try {
        const res = await fetch(`/api/matches/${params.matchId}`)
        if (res.ok) {
          const data = await res.json()
          const m = data.match || data
          setMatch(m)
          setCategories(m.ticketCategories || [])
          if (m.ticketCategories?.length > 0) {
            setQuickSale(prev => ({ ...prev, sectionId: m.ticketCategories[0].id }))
          }
        }
      } catch (e) {
        console.error('Failed to fetch match:', e)
      } finally {
        setLoading(false)
      }
    }
    fetchMatch()
  }, [params.matchId])

  const totalCapacity = categories.reduce((sum, c) => sum + c.capacity, 0)
  const totalSold = categories.reduce((sum, c) => sum + c.sold, 0)
  const totalRevenue = categories.reduce((sum, c) => sum + c.sold * c.price, 0)
  const fillRate = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0

  const startEdit = (cat: TicketCategory) => {
    setEditingId(cat.id)
    setEditPrice((cat.price / 100).toString())
    setEditCapacity(cat.capacity.toString())
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (catId: string) => {
    // In a real app, this would call the API to update
    setCategories(prev => prev.map(c =>
      c.id === catId
        ? { ...c, price: Math.round(parseFloat(editPrice) * 100), capacity: parseInt(editCapacity) }
        : c
    ))
    setEditingId(null)
  }

  const handleQuickSale = (e: React.FormEvent) => {
    e.preventDefault()
    const cat = categories.find(c => c.id === quickSale.sectionId)
    if (!cat) return
    const available = cat.capacity - cat.sold
    if (quickSale.quantity > available) {
      alert('Pas assez de places disponibles')
      return
    }

    setCategories(prev => prev.map(c =>
      c.id === quickSale.sectionId ? { ...c, sold: c.sold + quickSale.quantity } : c
    ))

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      reference: `HRM-${Math.random().toString().slice(2, 8).padStart(6, '0')}`,
      customerName: quickSale.customerName,
      email: quickSale.email,
      quantity: quickSale.quantity,
      amount: quickSale.quantity * cat.price,
      status: 'confirmed',
    }
    setReservations(prev => [newRes, ...prev])
    setQuickSale({ customerName: '', email: '', sectionId: categories[0]?.id || '', quantity: 1 })
    setShowQuickSale(false)
  }

  const handleExportCSV = () => {
    let csv = 'Catégorie,Prix,Capacité,Vendus,Restants,Revenu\n'
    categories.forEach(cat => {
      csv += `${cat.name},${(cat.price / 100).toFixed(2)}€,${cat.capacity},${cat.sold},${cat.capacity - cat.sold},${((cat.sold * cat.price) / 100).toFixed(2)}€\n`
    })
    if (reservations.length > 0) {
      csv += '\nRéservations\nRéférence,Client,Email,Quantité,Montant,Statut\n'
      reservations.forEach(r => {
        csv += `${r.reference},${r.customerName},${r.email},${r.quantity},${(r.amount / 100).toFixed(2)}€,${r.status}\n`
      })
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `billetterie-${match?.date?.split('T')[0] || 'export'}.csv`
    link.click()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-hormadi-red" size={32} />
      </div>
    )
  }

  if (!match) {
    return (
      <div className="text-center py-16">
        <p className="text-hormadi-muted text-lg">Match non trouvé</p>
        <Link href="/admin/billetterie" className="text-hormadi-red hover:text-red-400 mt-4 inline-block">
          Retour à la billetterie
        </Link>
      </div>
    )
  }

  const opponent = match.isHomeGame ? match.awayTeam : match.homeTeam
  const matchDate = new Date(match.date)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/billetterie"
          className="inline-flex items-center gap-1 text-hormadi-red hover:text-red-400 transition-colors text-sm mb-3"
        >
          <ChevronLeft size={16} />
          Retour à la billetterie
        </Link>
        <h1 className="text-3xl font-bold text-white">
          {match.homeTeam} vs {match.awayTeam}
        </h1>
        <p className="text-hormadi-muted text-sm mt-1">
          {matchDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} à{' '}
          {matchDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - {match.venue}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
          <p className="text-hormadi-muted text-xs font-medium mb-2">Billets vendus</p>
          <p className="text-3xl font-bold text-white">{totalSold}</p>
          <p className="text-hormadi-muted text-xs mt-1">sur {totalCapacity}</p>
        </div>
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
          <p className="text-hormadi-muted text-xs font-medium mb-2">Revenu total</p>
          <p className="text-3xl font-bold text-white">{(totalRevenue / 100).toLocaleString('fr-FR')}€</p>
        </div>
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
          <p className="text-hormadi-muted text-xs font-medium mb-2">Taux de remplissage</p>
          <p className="text-3xl font-bold text-white">{fillRate}%</p>
          <div className="w-full bg-hormadi-border rounded-full h-2 mt-3">
            <div className="h-full bg-hormadi-red rounded-full" style={{ width: `${fillRate}%` }} />
          </div>
        </div>
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
          <p className="text-hormadi-muted text-xs font-medium mb-2">Places restantes</p>
          <p className="text-3xl font-bold text-white">{totalCapacity - totalSold}</p>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-hormadi-surface border border-hormadi-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-hormadi-border">
          <h2 className="text-lg font-bold text-white">Catégories de billets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-hormadi-border">
              <tr>
                <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Catégorie</th>
                <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Prix</th>
                <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Capacité</th>
                <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Vendus</th>
                <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Restants</th>
                <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Revenu</th>
                <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hormadi-border/50">
              {categories.map(cat => {
                const isEditing = editingId === cat.id
                return (
                  <tr key={cat.id} className="hover:bg-hormadi-border/20 transition-colors">
                    <td className="py-4 px-5 text-white font-semibold text-sm">{cat.name}</td>
                    <td className="py-4 px-5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editPrice}
                          onChange={e => setEditPrice(e.target.value)}
                          className="w-20 px-2 py-1 bg-hormadi-dark border border-hormadi-border rounded text-white text-sm"
                          step="0.01"
                        />
                      ) : (
                        <span className="text-white font-semibold text-sm">{(cat.price / 100).toFixed(0)}€</span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={editCapacity}
                          onChange={e => setEditCapacity(e.target.value)}
                          className="w-20 px-2 py-1 bg-hormadi-dark border border-hormadi-border rounded text-white text-sm"
                        />
                      ) : (
                        <span className="text-white text-sm">{cat.capacity}</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-white font-semibold text-sm">{cat.sold}</td>
                    <td className="py-4 px-5 text-hormadi-muted text-sm">{cat.capacity - cat.sold}</td>
                    <td className="py-4 px-5 text-white font-semibold text-sm">{((cat.sold * cat.price) / 100).toLocaleString('fr-FR')}€</td>
                    <td className="py-4 px-5">
                      {isEditing ? (
                        <div className="flex gap-1">
                          <button onClick={() => saveEdit(cat.id)} className="p-1.5 text-green-400 hover:text-green-300">
                            <Check size={16} />
                          </button>
                          <button onClick={cancelEdit} className="p-1.5 text-hormadi-muted hover:text-white">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => startEdit(cat)} className="p-1.5 text-hormadi-red hover:text-red-400 transition-colors">
                          <Edit2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reservations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Réservations</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowQuickSale(!showQuickSale)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-hormadi-surface border border-hormadi-border rounded-lg text-white text-sm font-medium hover:border-hormadi-red/50 transition-all"
            >
              <Plus size={16} />
              Vente directe
            </button>
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-2 px-4 py-2 bg-hormadi-surface border border-hormadi-border rounded-lg text-white text-sm font-medium hover:border-hormadi-red/50 transition-all"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        {/* Quick Sale Form */}
        {showQuickSale && (
          <div className="bg-hormadi-surface border border-hormadi-red/50 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-4">Vente directe (guichet)</h3>
            <form onSubmit={handleQuickSale} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-xs font-medium mb-1.5">Nom du client</label>
                  <input
                    type="text"
                    value={quickSale.customerName}
                    onChange={e => setQuickSale(p => ({ ...p, customerName: e.target.value }))}
                    className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white text-sm focus:border-hormadi-red/50 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-xs font-medium mb-1.5">Email</label>
                  <input
                    type="email"
                    value={quickSale.email}
                    onChange={e => setQuickSale(p => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white text-sm focus:border-hormadi-red/50 focus:outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-xs font-medium mb-1.5">Catégorie</label>
                  <select
                    value={quickSale.sectionId}
                    onChange={e => setQuickSale(p => ({ ...p, sectionId: e.target.value }))}
                    className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.capacity - cat.sold} places)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white text-xs font-medium mb-1.5">Quantité</label>
                  <input
                    type="number"
                    value={quickSale.quantity}
                    onChange={e => setQuickSale(p => ({ ...p, quantity: parseInt(e.target.value) || 1 }))}
                    className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white text-sm"
                    min="1"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button type="submit" className="w-full py-2 bg-hormadi-red text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors">
                    Enregistrer
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Reservations Table */}
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl overflow-hidden">
          {reservations.length === 0 ? (
            <div className="p-12 text-center text-hormadi-muted text-sm">
              Aucune réservation pour ce match
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-hormadi-border">
                  <tr>
                    <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Référence</th>
                    <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Client</th>
                    <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Email</th>
                    <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Quantité</th>
                    <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Montant</th>
                    <th className="text-left py-3 px-5 text-hormadi-muted font-semibold text-xs">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hormadi-border/50">
                  {reservations.map(r => (
                    <tr key={r.id} className="hover:bg-hormadi-border/20 transition-colors">
                      <td className="py-4 px-5 text-white font-mono text-xs">{r.reference}</td>
                      <td className="py-4 px-5 text-white text-sm">{r.customerName}</td>
                      <td className="py-4 px-5 text-hormadi-muted text-sm">{r.email}</td>
                      <td className="py-4 px-5 text-white font-semibold text-sm">{r.quantity}</td>
                      <td className="py-4 px-5 text-white font-semibold text-sm">{(r.amount / 100).toFixed(2)}€</td>
                      <td className="py-4 px-5">
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold ${
                          r.status === 'confirmed' ? 'bg-green-900/30 text-green-300' :
                          r.status === 'pending' ? 'bg-yellow-900/30 text-yellow-300' :
                          'bg-red-900/30 text-red-300'
                        }`}>
                          {r.status === 'confirmed' ? 'Confirmée' : r.status === 'pending' ? 'En attente' : 'Annulée'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
