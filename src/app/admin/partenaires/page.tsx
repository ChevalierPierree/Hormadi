'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  ExternalLink,
  Search,
  Filter,
  X,
  Loader,
} from 'lucide-react'

type PartnerCategory =
  | 'partenaire_principal'
  | 'partenaire_officiel'
  | 'fournisseur_officiel'
  | 'partenaire_institutionnel'
  | 'partenaire'

interface Partner {
  id: string
  name: string
  category: PartnerCategory
  website?: string
  logoUrl?: string
  order: number
  visible: boolean
}

interface PartnerFormData {
  name: string
  category: PartnerCategory
  website: string
  logoUrl: string
  order: string
  visible: boolean
}

const CATEGORY_LABELS: Record<PartnerCategory, string> = {
  partenaire_principal: 'Partenaire Principal',
  partenaire_officiel: 'Partenaire Officiel',
  fournisseur_officiel: 'Fournisseur Officiel',
  partenaire_institutionnel: 'Partenaire Institutionnel',
  partenaire: 'Partenaire',
}

const CATEGORY_COLORS: Record<PartnerCategory, string> = {
  partenaire_principal: 'bg-hormadi-red/20 text-hormadi-red border-hormadi-red/30',
  partenaire_officiel: 'bg-hormadi-ocean/20 text-hormadi-ocean border-hormadi-ocean/30',
  fournisseur_officiel: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  partenaire_institutionnel: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  partenaire: 'bg-hormadi-forest/20 text-hormadi-ice border-hormadi-forest/30',
}

export default function AdminPartenairesPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<PartnerCategory | 'all'>('all')
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<PartnerFormData>({
    name: '',
    category: 'partenaire',
    website: '',
    logoUrl: '',
    order: '',
    visible: true,
  })

  // Fetch partners on mount
  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/partners')
      if (!response.ok) throw new Error('Failed to fetch partners')
      const data = await response.json()
      setPartners(Array.isArray(data) ? data : data.partners || [])
    } catch (error) {
      console.error('Error fetching partners:', error)
      setPartners([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenForm = (partner?: Partner) => {
    if (partner) {
      setEditingPartner(partner)
      setFormData({
        name: partner.name,
        category: partner.category,
        website: partner.website || '',
        logoUrl: partner.logoUrl || '',
        order: partner.order.toString(),
        visible: partner.visible,
      })
      setLogoPreview(partner.logoUrl || '')
    } else {
      setEditingPartner(null)
      setFormData({
        name: '',
        category: 'partenaire',
        website: '',
        logoUrl: '',
        order: (partners.length + 1).toString(),
        visible: true,
      })
      setLogoPreview('')
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingPartner(null)
    setLogoPreview('')
    setFormData({
      name: '',
      category: 'partenaire',
      website: '',
      logoUrl: '',
      order: '',
      visible: true,
    })
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploadingLogo(true)
      const formDataObj = new FormData()
      formDataObj.append('logo', file)

      const response = await fetch('/api/partners/upload', {
        method: 'POST',
        body: formDataObj,
      })

      if (!response.ok) throw new Error('Upload failed')
      const data = await response.json()
      const logoPath = data.path || data.url
      setFormData({ ...formData, logoUrl: logoPath })
      setLogoPreview(logoPath)
    } catch (error) {
      console.error('Error uploading logo:', error)
      alert('Erreur lors du téléchargement du logo')
    } finally {
      setUploadingLogo(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert('Le nom du partenaire est requis')
      return
    }

    try {
      setFormSubmitting(true)

      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        website: formData.website.trim() || undefined,
        logoUrl: formData.logoUrl || undefined,
        order: parseInt(formData.order) || partners.length + 1,
        visible: formData.visible,
      }

      const url = editingPartner
        ? `/api/partners/${editingPartner.id}`
        : '/api/partners'

      const method = editingPartner ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Failed to save partner')

      await fetchPartners()
      handleCloseForm()
    } catch (error) {
      console.error('Error saving partner:', error)
      alert('Erreur lors de la sauvegarde du partenaire')
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleDeletePartner = async (partnerId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire?')) return

    try {
      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete partner')

      await fetchPartners()
    } catch (error) {
      console.error('Error deleting partner:', error)
      alert('Erreur lors de la suppression du partenaire')
    }
  }

  const handleToggleVisibility = async (partnerId: string) => {
    const partner = partners.find((p) => p.id === partnerId)
    if (!partner) return

    try {
      const response = await fetch(`/api/partners/${partnerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...partner,
          visible: !partner.visible,
        }),
      })

      if (!response.ok) throw new Error('Failed to update partner')

      await fetchPartners()
    } catch (error) {
      console.error('Error toggling visibility:', error)
      alert('Erreur lors de la mise à jour')
    }
  }

  // Filter partners
  const filteredPartners = partners.filter((partner) => {
    const matchesSearch =
      partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.website?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'all' || partner.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Group by category
  const groupedByCategory = Object.values(
    CATEGORY_LABELS
  ).reduce<Record<PartnerCategory, Partner[]>>((acc, _, index) => {
    const category = Object.keys(CATEGORY_LABELS)[
      index
    ] as PartnerCategory
    acc[category] = filteredPartners.filter((p) => p.category === category)
    return acc
  }, {} as Record<PartnerCategory, Partner[]>)

  // Calculate stats
  const totalPartners = partners.length
  const categoryStats = Object.entries(CATEGORY_LABELS).map(([key]) => ({
    category: key as PartnerCategory,
    count: partners.filter((p) => p.category === key).length,
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold font-display text-white mb-2">
            Gestion des Partenaires
          </h1>
          <p className="text-hormadi-muted">
            Gérez tous vos partenaires et leurs informations
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={20} />
          Ajouter un partenaire
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-4">
          <p className="text-hormadi-muted text-sm font-medium mb-1">Total</p>
          <p className="text-2xl font-bold text-white">{totalPartners}</p>
        </div>
        {categoryStats.map((stat) => (
          <div
            key={stat.category}
            className="bg-hormadi-surface border border-hormadi-border rounded-xl p-4"
          >
            <p className="text-hormadi-muted text-xs font-medium mb-1 truncate">
              {CATEGORY_LABELS[stat.category]}
            </p>
            <p className="text-2xl font-bold text-white">{stat.count}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-hormadi-muted"
          />
          <input
            type="text"
            placeholder="Rechercher un partenaire..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-hormadi-surface border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
          />
        </div>
        <div className="relative">
          <Filter
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-hormadi-muted pointer-events-none"
          />
          <select
            value={selectedCategory}
            onChange={(e) =>
              setSelectedCategory(
                e.target.value as PartnerCategory | 'all'
              )
            }
            className="pl-10 pr-4 py-2 bg-hormadi-surface border border-hormadi-border rounded-lg text-white focus:outline-none focus:border-hormadi-ocean transition-colors appearance-none cursor-pointer"
          >
            <option value="all">Toutes les catégories</option>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Partners List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="animate-spin text-hormadi-ocean" size={32} />
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-12 text-center">
          <p className="text-hormadi-muted mb-4">Aucun partenaire trouvé</p>
          <button
            onClick={() => handleOpenForm()}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Ajouter un partenaire
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedByCategory).map(([category, partners]) => {
            if (partners.length === 0) return null

            const categoryKey = category as PartnerCategory

            return (
              <div key={categoryKey}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-xl font-bold text-white">
                    {CATEGORY_LABELS[categoryKey]}
                  </h2>
                  <span className="inline-flex items-center justify-center w-6 h-6 bg-hormadi-ocean text-white text-sm font-bold rounded-full">
                    {partners.length}
                  </span>
                </div>

                <div className="grid gap-4">
                  {partners.map((partner) => (
                    <PartnerRow
                      key={partner.id}
                      partner={partner}
                      category={categoryKey}
                      onEdit={() => handleOpenForm(partner)}
                      onDelete={() => handleDeletePartner(partner.id)}
                      onToggleVisibility={() =>
                        handleToggleVisibility(partner.id)
                      }
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-hormadi-surface border border-hormadi-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-hormadi-border flex items-center justify-between sticky top-0 bg-hormadi-surface">
              <h2 className="text-2xl font-bold font-display text-white">
                {editingPartner
                  ? 'Modifier le partenaire'
                  : 'Ajouter un partenaire'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-hormadi-muted hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Nom *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Nom du partenaire"
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value as PartnerCategory,
                    })
                  }
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white focus:outline-none focus:border-hormadi-ocean transition-colors appearance-none cursor-pointer"
                  required
                >
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Site web (optionnel)
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                />
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Logo (optionnel)
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingLogo}
                      className="flex items-center gap-2 px-4 py-2 bg-hormadi-ocean hover:bg-hormadi-ocean/80 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Upload size={18} />
                      {uploadingLogo ? 'Téléchargement...' : 'Télécharger'}
                    </button>
                    {formData.logoUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, logoUrl: '' })
                          setLogoPreview('')
                        }}
                        className="text-hormadi-muted hover:text-hormadi-red transition-colors"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  {logoPreview && (
                    <div className="flex items-center gap-3 p-3 bg-hormadi-dark border border-hormadi-border rounded-lg">
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-12 w-12 object-contain rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm text-white truncate">
                          {logoPreview.split('/').pop()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({ ...formData, order: e.target.value })
                  }
                  placeholder="1"
                  className="w-full px-4 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                  min="1"
                />
              </div>

              {/* Visibility Toggle */}
              <div className="flex items-center gap-3 p-4 bg-hormadi-dark border border-hormadi-border rounded-lg">
                <input
                  type="checkbox"
                  id="visible"
                  checked={formData.visible}
                  onChange={(e) =>
                    setFormData({ ...formData, visible: e.target.checked })
                  }
                  className="w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="visible"
                  className="flex-1 text-white cursor-pointer"
                >
                  Visible sur le site
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-6 border-t border-hormadi-border">
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {formSubmitting
                    ? 'En cours...'
                    : editingPartner
                      ? 'Mettre à jour'
                      : 'Ajouter'}
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

interface PartnerRowProps {
  partner: Partner
  category: PartnerCategory
  onEdit: () => void
  onDelete: () => void
  onToggleVisibility: () => void
}

function PartnerRow({
  partner,
  category,
  onEdit,
  onDelete,
  onToggleVisibility,
}: PartnerRowProps) {
  return (
    <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-4 hover:bg-hormadi-border/30 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          {partner.logoUrl ? (
            <img
              src={partner.logoUrl}
              alt={partner.name}
              className="h-12 w-12 object-contain rounded-lg bg-hormadi-dark p-2"
            />
          ) : (
            <div className="h-12 w-12 bg-hormadi-dark rounded-lg flex items-center justify-center">
              <span className="text-hormadi-muted text-xs font-bold">
                {partner.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 className="text-white font-semibold">{partner.name}</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border w-fit ${CATEGORY_COLORS[category]}`}
            >
              {CATEGORY_LABELS[category]}
            </span>
          </div>

          {partner.website && (
            <a
              href={partner.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-hormadi-red hover:text-hormadi-red/80 text-sm transition-colors"
            >
              <ExternalLink size={14} />
              <span className="truncate">{partner.website}</span>
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onToggleVisibility}
            className="p-2 text-hormadi-muted hover:text-hormadi-ice transition-colors"
            title={partner.visible ? 'Masquer' : 'Afficher'}
          >
            {partner.visible ? (
              <Eye size={18} />
            ) : (
              <EyeOff size={18} />
            )}
          </button>

          <button
            onClick={onEdit}
            className="p-2 text-hormadi-muted hover:text-hormadi-ocean transition-colors"
            title="Modifier"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={onDelete}
            className="p-2 text-hormadi-muted hover:text-hormadi-red transition-colors"
            title="Supprimer"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Visibility Badge */}
      {!partner.visible && (
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
