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

type StaffCategory = 'direction' | 'staff_technique' | 'encadrement'

interface StaffMember {
  id: string
  name: string
  role: string
  category: StaffCategory
  photoUrl?: string
  order: number
  visible: boolean
}

interface StaffFormData {
  name: string
  role: string
  category: StaffCategory
  photoUrl: string
  order: string
  visible: boolean
}

const CATEGORY_LABELS: Record<StaffCategory, string> = {
  direction: 'Direction',
  staff_technique: 'Staff Technique',
  encadrement: 'Encadrement',
}

const CATEGORY_COLORS: Record<StaffCategory, string> = {
  direction: 'bg-hormadi-red/20 text-hormadi-red border-hormadi-red/30',
  staff_technique: 'bg-hormadi-ocean/20 text-hormadi-ocean border-hormadi-ocean/30',
  encadrement: 'bg-hormadi-forest/20 text-hormadi-ice border-hormadi-forest/30',
}

const EMPTY_FORM: StaffFormData = {
  name: '',
  role: '',
  category: 'direction',
  photoUrl: '',
  order: '',
  visible: true,
}

export default function AdminOrganigrammePage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<StaffCategory | 'all'>('all')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [formData, setFormData] = useState<StaffFormData>(EMPTY_FORM)

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/staff')
      if (!response.ok) throw new Error('Failed to fetch staff')
      const data = await response.json()
      setStaff(data.staff || [])
    } catch (error) {
      console.error('Error fetching staff:', error)
      setStaff([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenForm = (member?: StaffMember) => {
    if (member) {
      setEditingStaff(member)
      setFormData({
        name: member.name,
        role: member.role,
        category: member.category,
        photoUrl: member.photoUrl || '',
        order: member.order.toString(),
        visible: member.visible,
      })
    } else {
      setEditingStaff(null)
      setFormData({ ...EMPTY_FORM, order: (staff.length + 1).toString() })
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingStaff(null)
    setFormData(EMPTY_FORM)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.role.trim()) {
      alert('Le nom et le rôle sont requis')
      return
    }

    try {
      setFormSubmitting(true)

      const payload = {
        name: formData.name.trim(),
        role: formData.role.trim(),
        category: formData.category,
        photoUrl: formData.photoUrl || undefined,
        order: parseInt(formData.order) || staff.length + 1,
        visible: formData.visible,
      }

      const url = editingStaff ? `/api/staff/${editingStaff.id}` : '/api/staff'
      const method = editingStaff ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save staff member')

      await fetchStaff()
      handleCloseForm()
    } catch (error) {
      console.error('Error saving staff member:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette personne ?')) return
    try {
      const response = await fetch(`/api/staff/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Failed to delete')
      await fetchStaff()
    } catch (error) {
      console.error('Error deleting staff member:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleToggleVisibility = async (member: StaffMember) => {
    try {
      const response = await fetch(`/api/staff/${member.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !member.visible }),
      })
      if (!response.ok) throw new Error('Failed to update')
      await fetchStaff()
    } catch (error) {
      console.error('Error toggling visibility:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || member.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const groupedByCategory = (Object.keys(CATEGORY_LABELS) as StaffCategory[]).reduce<Record<StaffCategory, StaffMember[]>>(
    (acc, category) => {
      acc[category] = filteredStaff.filter((m) => m.category === category)
      return acc
    },
    {} as Record<StaffCategory, StaffMember[]>
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-display text-white mb-2">Organigramme</h1>
          <p className="text-hormadi-muted">Gérez la direction, le staff technique et l'encadrement du club</p>
        </div>
        <button onClick={() => handleOpenForm()} className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto">
          <Plus size={20} />
          Ajouter une personne
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-hormadi-muted" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-hormadi-surface border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
          />
        </div>
        <div className="relative">
          <Filter size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-hormadi-muted pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as StaffCategory | 'all')}
            className="pl-10 pr-4 py-2 bg-hormadi-surface border border-hormadi-border rounded-lg text-white focus:outline-none focus:border-hormadi-ocean transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Toutes les catégories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-hormadi-ocean" size={32} />
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-12 text-center">
          <p className="text-hormadi-muted mb-4">Personne trouvée dans l'organigramme</p>
          <button onClick={() => handleOpenForm()} className="btn-primary inline-flex items-center gap-2">
            <Plus size={18} />
            Ajouter une personne
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByCategory).map(([category, members]) => {
            if (members.length === 0) return null
            const categoryKey = category as StaffCategory
            return (
              <div key={categoryKey}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-white">{CATEGORY_LABELS[categoryKey]}</h2>
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-hormadi-ocean text-white text-sm font-bold rounded-full">
                    {members.length}
                  </span>
                </div>
                <div className="grid gap-4">
                  {members.map((member) => (
                    <StaffRow
                      key={member.id}
                      member={member}
                      onEdit={() => handleOpenForm(member)}
                      onDelete={() => handleDelete(member.id)}
                      onToggleVisibility={() => handleToggleVisibility(member)}
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
                {editingStaff ? 'Modifier' : 'Ajouter une personne'}
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
                  placeholder="Prénom Nom"
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Rôle / Fonction *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="ex: Président, Entraîneur principal..."
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Catégorie *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as StaffCategory })}
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white focus:outline-none focus:border-hormadi-ocean transition-colors appearance-none cursor-pointer"
                  required
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">Photo (URL, optionnel)</label>
                <input
                  type="text"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="/images/staff/nom.jpg ou https://..."
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
                  {formSubmitting ? 'En cours...' : editingStaff ? 'Mettre à jour' : 'Ajouter'}
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

function StaffRow({
  member,
  onEdit,
  onDelete,
  onToggleVisibility,
}: {
  member: StaffMember
  onEdit: () => void
  onDelete: () => void
  onToggleVisibility: () => void
}) {
  return (
    <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-4 hover:bg-hormadi-border/30 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-shrink-0">
          {member.photoUrl ? (
            <img src={member.photoUrl} alt={member.name} className="h-12 w-12 object-cover rounded-full" />
          ) : (
            <div className="h-12 w-12 bg-hormadi-dark rounded-full flex items-center justify-center">
              <span className="text-hormadi-muted text-xs font-bold">
                {member.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
            <h3 className="text-white font-semibold">{member.name}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border w-fit ${CATEGORY_COLORS[member.category]}`}>
              {CATEGORY_LABELS[member.category]}
            </span>
          </div>
          <p className="text-hormadi-muted text-sm">{member.role}</p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={onToggleVisibility} className="p-2 text-hormadi-muted hover:text-hormadi-ice transition-colors" title={member.visible ? 'Masquer' : 'Afficher'}>
            {member.visible ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          <button onClick={onEdit} className="p-2 text-hormadi-muted hover:text-hormadi-ocean transition-colors" title="Modifier">
            <Pencil size={18} />
          </button>
          <button onClick={onDelete} className="p-2 text-hormadi-muted hover:text-hormadi-red transition-colors" title="Supprimer">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {!member.visible && (
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
