'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  X,
  Loader,
} from 'lucide-react'

type Position = 'gardien' | 'defenseur' | 'attaquant'

interface Player {
  id: string
  name: string
  number?: number
  position: Position
  nationality?: string
  photoUrl?: string
  order: number
  visible: boolean
}

interface PlayerFormData {
  name: string
  number: string
  position: Position
  nationality: string
  photoUrl: string
  order: string
  visible: boolean
}

const POSITION_LABELS: Record<Position, string> = {
  gardien: 'Gardien',
  defenseur: 'Défenseur',
  attaquant: 'Attaquant',
}

const POSITION_COLORS: Record<Position, string> = {
  gardien: 'bg-hormadi-red/20 text-hormadi-red border-hormadi-red/30',
  defenseur: 'bg-hormadi-ocean/20 text-hormadi-ocean border-hormadi-ocean/30',
  attaquant: 'bg-hormadi-forest/20 text-hormadi-ice border-hormadi-forest/30',
}

const EMPTY_FORM: PlayerFormData = {
  name: '',
  number: '',
  position: 'attaquant',
  nationality: '',
  photoUrl: '',
  order: '',
  visible: true,
}

export default function AdminEffectifPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPosition, setSelectedPosition] = useState<Position | 'all'>('all')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formData, setFormData] = useState<PlayerFormData>(EMPTY_FORM)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/players')
      if (!response.ok) throw new Error('Failed to fetch players')
      const data = await response.json()
      setPlayers(data.players || [])
    } catch (error) {
      console.error('Error fetching players:', error)
      setPlayers([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenForm = (player?: Player) => {
    if (player) {
      setEditingPlayer(player)
      setFormData({
        name: player.name,
        number: player.number?.toString() || '',
        position: player.position,
        nationality: player.nationality || '',
        photoUrl: player.photoUrl || '',
        order: player.order.toString(),
        visible: player.visible,
      })
    } else {
      setEditingPlayer(null)
      setFormData({ ...EMPTY_FORM, order: (players.length + 1).toString() })
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingPlayer(null)
    setFormData(EMPTY_FORM)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('Le nom du joueur est requis')
      return
    }

    try {
      setFormSubmitting(true)

      const payload = {
        name: formData.name.trim(),
        number: formData.number.trim() || undefined,
        position: formData.position,
        nationality: formData.nationality.trim() || undefined,
        photoUrl: formData.photoUrl || undefined,
        order: parseInt(formData.order) || players.length + 1,
        visible: formData.visible,
      }

      const url = editingPlayer ? `/api/players/${editingPlayer.id}` : '/api/players'
      const method = editingPlayer ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save player')

      await fetchPlayers()
      handleCloseForm()
    } catch (error) {
      console.error('Error saving player:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce joueur ?')) return
    try {
      const response = await fetch(`/api/players/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      await fetchPlayers()
    } catch (error) {
      console.error('Error deleting player:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleToggleVisibility = async (player: Player) => {
    try {
      const response = await fetch(`/api/players/${player.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !player.visible }),
      })
      if (!response.ok) throw new Error('Failed to update')
      await fetchPlayers()
    } catch (error) {
      console.error('Error toggling visibility:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const filteredPlayers = players.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPosition = selectedPosition === 'all' || player.position === selectedPosition
    return matchesSearch && matchesPosition
  })

  const groupedByPosition = (Object.keys(POSITION_LABELS) as Position[]).reduce<Record<Position, Player[]>>(
    (acc, position) => {
      acc[position] = filteredPlayers.filter((p) => p.position === position)
      return acc
    },
    {} as Record<Position, Player[]>
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-display text-white mb-2">Effectif</h1>
          <p className="text-hormadi-muted">Gérez le roster de l'équipe pro</p>
        </div>
        <button onClick={() => handleOpenForm()} className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto">
          <Plus size={20} />
          Ajouter un joueur
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-hormadi-muted" />
          <input
            type="text"
            placeholder="Rechercher un joueur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-hormadi-surface border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
          />
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-hormadi-muted pointer-events-none" />
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value as Position | 'all')}
            className="pl-10 pr-4 py-2 bg-hormadi-surface border border-hormadi-border rounded-lg text-white focus:outline-none focus:border-hormadi-ocean transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Tous les postes</option>
            {Object.entries(POSITION_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-hormadi-ocean" size={32} />
        </div>
      ) : filteredPlayers.length === 0 ? (
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-12 text-center">
          <p className="text-hormadi-muted mb-4">Aucun joueur trouvé</p>
          <button onClick={() => handleOpenForm()} className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} />
            Ajouter un joueur
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByPosition).map(([position, list]) => {
            if (list.length === 0) return null
            const positionKey = position as Position
            return (
              <div key={positionKey}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-white">{POSITION_LABELS[positionKey]}s</h2>
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-hormadi-ocean text-white text-sm font-bold rounded-full">
                    {list.length}
                  </span>
                </div>
                <div className="grid gap-4">
                  {list.map((player) => (
                    <PlayerRow
                      key={player.id}
                      player={player}
                      onEdit={() => handleOpenForm(player)}
                      onDelete={() => handleDelete(player.id)}
                      onToggleVisibility={() => handleToggleVisibility(player)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-hormadi-surface border border-hormadi-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-hormadi-border flex items-center justify-between sticky top-0 bg-hormadi-surface">
              <h2 className="text-2xl font-bold font-display text-white">
                {editingPlayer ? 'Modifier le joueur' : 'Ajouter un joueur'}
              </h2>
              <button onClick={handleCloseForm} className="text-hormadi-muted hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Prénom NOM"
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Numéro</label>
                  <input
                    type="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="ex: 27"
                    className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-white mb-2">Poste *</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value as Position })}
                    className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white focus:outline-none focus:border-hormadi-ocean transition-colors appearance-none cursor-pointer"
                    required
                  >
                    {Object.entries(POSITION_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Nationalité (optionnel)</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="ex: France, Canada..."
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Photo (URL, optionnel)</label>
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="/images/effectif/nom.jpg ou https://..."
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                />
                {formData.photoUrl && (
                  <div className="mt-3 flex items-center gap-3 p-3 bg-hormadi-dark border border-hormadi-border rounded-lg">
                    <img src={formData.photoUrl} alt="Aperçu" className="h-12 w-12 object-cover rounded-full" />
                    <p className="text-sm text-hormadi-muted truncate">{formData.photoUrl}</p>
                  </div>
                )}
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
                  {formSubmitting ? 'En cours...' : editingPlayer ? 'Mettre à jour' : 'Ajouter'}
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="flex-1 px-4 py-2 bg-hormadi-dark border border-hormadi-border text-white rounded-lg hover:bg-hormadi-border/50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function PlayerRow({
  player,
  onEdit,
  onDelete,
  onToggleVisibility,
}: {
  player: Player
  onEdit: () => void
  onDelete: () => void
  onToggleVisibility: () => void
}) {
  return (
    <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-4 hover:bg-hormadi-border/30 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-shrink-0">
          {player.photoUrl ? (
            <img src={player.photoUrl} alt={player.name} className="h-12 w-12 object-cover rounded-full" />
          ) : (
            <div className="h-12 w-12 bg-hormadi-dark rounded-full flex items-center justify-center">
              <span className="text-hormadi-muted text-xs font-bold">
                {player.number ?? player.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h3 className="text-white font-semibold">
              {player.number !== undefined && player.number !== null ? `#${player.number} ` : ''}{player.name}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border w-fit ${POSITION_COLORS[player.position]}`}>
              {POSITION_LABELS[player.position]}
            </span>
          </div>
          {player.nationality && <p className="text-hormadi-muted text-sm">{player.nationality}</p>}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={onToggleVisibility} className="p-2 text-hormadi-muted hover:text-hormadi-ice transition-colors" title={player.visible ? 'Masquer' : 'Afficher'}>
            {player.visible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button onClick={onEdit} className="p-2 text-hormadi-muted hover:text-hormadi-ocean transition-colors" title="Modifier">
            <Pencil size={18} />
          </button>
          <button onClick={onDelete} className="p-2 text-hormadi-muted hover:text-hormadi-red transition-colors" title="Supprimer">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {!player.visible && (
        <div className="mt-3 pt-3 border-t border-hormadi-border">
          <span className="inline-flex items-center gap-1 text-hormadi-muted text-xs bg-hormadi-dark px-2 py-1 rounded">
            <EyeOff size={12} />
            Non visible sur le site
          </span>
        </div>
      )}
    </div>
  )
}
