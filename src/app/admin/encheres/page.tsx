'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Loader,
  Gavel,
  Users,
  Clock,
  Trophy,
} from 'lucide-react'
import ImageUpload from '@/components/admin/ImageUpload'

interface Bid {
  id: string
  amount: number
  bidderName: string
  bidderEmail: string
  bidderPhone: string
  createdAt: string
}

interface AuctionItem {
  id: string
  title: string
  description: string
  imageUrl: string | null
  startPrice: number
  minIncrement: number
  endDate: string
  order: number
  visible: boolean
  currentPrice: number
  bidCount: number
  isEnded: boolean
  bids: Bid[]
}

interface FormData {
  title: string
  description: string
  imageUrl: string
  startPrice: string
  minIncrement: string
  endDate: string
  order: string
  visible: boolean
}

const EMPTY_FORM: FormData = {
  title: '',
  description: '',
  imageUrl: '',
  startPrice: '',
  minIncrement: '5',
  endDate: '',
  order: '',
  visible: true,
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

// datetime-local expects "YYYY-MM-DDTHH:mm" in local time
function toDatetimeLocal(iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export default function AdminEncheresPage() {
  const [items, setItems] = useState<AuctionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<AuctionItem | null>(null)
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [bidsItem, setBidsItem] = useState<AuctionItem | null>(null)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/auctions?admin=true')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenForm = (item?: AuctionItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        description: item.description,
        imageUrl: item.imageUrl || '',
        startPrice: (item.startPrice / 100).toString(),
        minIncrement: (item.minIncrement / 100).toString(),
        endDate: toDatetimeLocal(item.endDate),
        order: item.order.toString(),
        visible: item.visible,
      })
    } else {
      setEditingItem(null)
      setFormData({ ...EMPTY_FORM, order: (items.length + 1).toString() })
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingItem(null)
    setFormData(EMPTY_FORM)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.startPrice || !formData.endDate) {
      alert('Titre, prix de départ et date de fin sont requis')
      return
    }

    try {
      setFormSubmitting(true)
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: formData.imageUrl || undefined,
        startPrice: Math.round(parseFloat(formData.startPrice) * 100),
        minIncrement: Math.round(parseFloat(formData.minIncrement || '5') * 100),
        endDate: new Date(formData.endDate).toISOString(),
        order: parseInt(formData.order) || items.length + 1,
        visible: formData.visible,
      }

      const url = editingItem ? `/api/auctions/${editingItem.id}` : '/api/auctions'
      const method = editingItem ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Failed to save')

      await fetchItems()
      handleCloseForm()
    } catch (e) {
      console.error(e)
      alert("Erreur lors de la sauvegarde de l'objet")
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet objet et toutes ses enchères ?')) return
    try {
      const res = await fetch(`/api/auctions/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchItems()
    } catch (e) {
      console.error(e)
      alert('Erreur lors de la suppression')
    }
  }

  const handleToggleVisibility = async (item: AuctionItem) => {
    try {
      const res = await fetch(`/api/auctions/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !item.visible }),
      })
      if (!res.ok) throw new Error('Failed to update')
      await fetchItems()
    } catch (e) {
      console.error(e)
      alert('Erreur lors de la mise à jour')
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-display text-white mb-2">Enchères</h1>
          <p className="text-hormadi-muted">Gérez les objets mis aux enchères et suivez les mises</p>
        </div>
        <button onClick={() => handleOpenForm()} className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto">
          <Plus size={20} />
          Ajouter un objet
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-hormadi-ocean" size={32} />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-12 text-center">
          <p className="text-hormadi-muted mb-4">Aucun objet en vente</p>
          <button onClick={() => handleOpenForm()} className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} />
            Ajouter un objet
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-hormadi-surface border border-hormadi-border rounded-xl p-4 hover:bg-hormadi-border/30 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.title} className="h-16 w-16 object-cover rounded-lg bg-hormadi-dark" />
                  ) : (
                    <div className="h-16 w-16 bg-hormadi-dark rounded-lg flex items-center justify-center">
                      <Gavel size={22} className="text-hormadi-muted" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    {item.isEnded ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-hormadi-muted/20 text-hormadi-muted border-hormadi-muted/30">
                        Terminée
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                        En cours
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-hormadi-muted">
                    <span className="text-white font-bold">{formatPrice(item.currentPrice)} €</span>
                    <span className="flex items-center gap-1"><Users size={13} /> {item.bidCount} mise{item.bidCount !== 1 ? 's' : ''}</span>
                    <span className="flex items-center gap-1"><Clock size={13} /> {new Date(item.endDate).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setBidsItem(item)} className="p-2 text-hormadi-muted hover:text-hormadi-ice transition-colors" title="Voir les mises">
                    <Trophy size={18} />
                  </button>
                  <button onClick={() => handleToggleVisibility(item)} className="p-2 text-hormadi-muted hover:text-hormadi-ice transition-colors" title={item.visible ? 'Masquer' : 'Afficher'}>
                    {item.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  <button onClick={() => handleOpenForm(item)} className="p-2 text-hormadi-muted hover:text-hormadi-ocean transition-colors" title="Modifier">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-hormadi-muted hover:text-hormadi-red transition-colors" title="Supprimer">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-hormadi-surface border border-hormadi-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-hormadi-border flex items-center justify-between sticky top-0 bg-hormadi-surface">
              <h2 className="text-2xl font-bold font-display text-white">
                {editingItem ? "Modifier l'objet" : 'Ajouter un objet'}
              </h2>
              <button onClick={handleCloseForm} className="text-hormadi-muted hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Titre *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Maillot domicile dédicacé n°10"
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Maillot porté lors du match retour contre Grenoble..."
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors resize-none"
                  required
                />
              </div>

              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                folder="auctions"
                label="Photo (optionnel)"
                previewClassName="aspect-[4/3] w-48"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Prix de départ (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.startPrice}
                    onChange={(e) => setFormData({ ...formData, startPrice: e.target.value })}
                    placeholder="50"
                    className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Palier minimum (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.minIncrement}
                    onChange={(e) => setFormData({ ...formData, minIncrement: e.target.value })}
                    placeholder="5"
                    className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Date et heure de fin *</label>
                <input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white focus:outline-none focus:border-hormadi-ocean transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Ordre d'affichage</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  placeholder="1"
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                  min="1"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-hormadi-dark border border-hormadi-border rounded-lg">
                <input
                  type="checkbox"
                  id="visible"
                  checked={formData.visible}
                  onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor="visible" className="flex-1 text-white cursor-pointer">Visible sur le site</label>
              </div>

              <div className="flex gap-4 pt-6 border-t border-hormadi-border">
                <button type="submit" disabled={formSubmitting} className="flex-1 btn-primary disabled:opacity-50">
                  {formSubmitting ? 'En cours...' : editingItem ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button type="button" onClick={handleCloseForm} className="flex-1 px-4 py-2 bg-hormadi-dark border border-hormadi-border text-white rounded-lg hover:bg-hormadi-border/50 transition-colors">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bids Modal */}
      {bidsItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-hormadi-surface border border-hormadi-border rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-hormadi-border flex items-center justify-between sticky top-0 bg-hormadi-surface">
              <div>
                <h2 className="text-xl font-bold font-display text-white">{bidsItem.title}</h2>
                <p className="text-hormadi-muted text-sm mt-1">{bidsItem.bidCount} mise{bidsItem.bidCount !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setBidsItem(null)} className="text-hormadi-muted hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              {bidsItem.bids.length === 0 ? (
                <p className="text-hormadi-muted text-center py-8">Aucune mise pour le moment</p>
              ) : (
                bidsItem.bids.map((bid, i) => (
                  <div key={bid.id} className={`rounded-lg p-4 border ${i === 0 ? 'bg-hormadi-red/10 border-hormadi-red/30' : 'bg-hormadi-dark border-hormadi-border'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-bold text-lg">{formatPrice(bid.amount)} €</span>
                      {i === 0 && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-hormadi-red">
                          <Trophy size={13} /> {bidsItem.isEnded ? 'Gagnant' : 'Meilleure offre'}
                        </span>
                      )}
                    </div>
                    <p className="text-white text-sm">{bid.bidderName}</p>
                    <p className="text-hormadi-muted text-xs mt-0.5">{bid.bidderEmail} · {bid.bidderPhone}</p>
                    <p className="text-hormadi-muted text-xs mt-1">{new Date(bid.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
