'use client'

import { useState, useEffect, useMemo } from 'react'
import { Trash2, Edit, Plus, Search, Eye, EyeOff, AlertCircle, Loader } from 'lucide-react'

type Article = {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  imageUrl?: string
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt?: string
}

type ArticleFormData = {
  title: string
  excerpt: string
  content: string
  category: string
  imageUrl: string
  published: boolean
}

const CATEGORIES = [
  'Club',
  'Vie du Club',
  'Arrivées',
  'Départs',
  'Prolongations',
  'Interview',
  'Jeu concours',
]

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    excerpt: '',
    content: '',
    category: 'Club',
    imageUrl: '',
    published: false,
  })

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/articles?published=all')
      if (!response.ok) {
        throw new Error('Failed to fetch articles')
      }
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === '' || article.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [articles, searchTerm, selectedCategory])

  const handleOpenForm = (article?: Article) => {
    if (article) {
      setEditingArticle(article)
      setFormData({
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        category: article.category,
        imageUrl: article.imageUrl || '',
        published: article.published,
      })
    } else {
      setEditingArticle(null)
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        category: 'Club',
        imageUrl: '',
        published: false,
      })
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingArticle(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      const url = editingArticle ? `/api/articles/${editingArticle.id}` : '/api/articles'
      const method = editingArticle ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save article')
      }

      const data = await response.json()
      if (editingArticle) {
        setArticles(articles.map((a) => (a.id === data.article.id ? data.article : a)))
      } else {
        setArticles([data.article, ...articles])
      }
      handleCloseForm()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save article')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteArticle = async (articleId: string) => {
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete article')
      }

      setArticles(articles.filter((a) => a.id !== articleId))
      setDeleteConfirm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete article')
    }
  }

  const handleTogglePublish = async (articleId: string) => {
    const article = articles.find((a) => a.id === articleId)
    if (!article) return

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !article.published }),
      })

      if (!response.ok) {
        throw new Error('Failed to update article')
      }

      const data = await response.json()
      setArticles(articles.map((a) => (a.id === data.article.id ? data.article : a)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update article')
    }
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="text-red-500 font-semibold mb-1">Error</h3>
            <p className="text-red-500/80 text-sm">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-500 text-sm mt-2 underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Actualités</h1>
          <p className="text-hormadi-muted">
            {loading ? 'Loading...' : `${filteredArticles.length} article${filteredArticles.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Plus size={20} />
          Nouvel article
        </button>
      </div>

      <div className="card glass">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-3 text-hormadi-muted" size={20} />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input bg-hormadi-surface border border-hormadi-border text-white"
          >
            <option value="">Toutes les catégories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="card glass overflow-x-auto">
        {loading ? (
          <div className="text-center py-12">
            <Loader className="inline-block animate-spin text-hormadi-red mb-4" size={32} />
            <p className="text-hormadi-muted">Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-hormadi-muted mb-4">Aucun article trouvé</p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('')
              }}
              className="btn-secondary"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-hormadi-border">
              <tr>
                <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                  Titre
                </th>
                <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                  Catégorie
                </th>
                <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                  Statut
                </th>
                <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hormadi-border">
              {filteredArticles.map((article) => (
                <tr key={article.id} className="hover:bg-hormadi-surface/30">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {article.imageUrl && (
                        <img
                          src={article.imageUrl}
                          alt={article.title}
                          className="w-12 h-12 rounded object-cover bg-hormadi-surface"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-white font-medium truncate max-w-xs">
                          {article.title}
                        </p>
                        <p className="text-hormadi-muted text-xs truncate max-w-xs">
                          {article.excerpt}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-hormadi-surface border border-hormadi-border text-hormadi-muted">
                      {article.category}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {article.published ? (
                        <>
                          <Eye size={16} className="text-green-500" />
                          <span className="text-green-500 text-sm">Publié</span>
                        </>
                      ) : (
                        <>
                          <EyeOff size={16} className="text-hormadi-muted" />
                          <span className="text-hormadi-muted text-sm">Brouillon</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-hormadi-muted text-sm">
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString('fr-FR')
                        : new Date(article.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTogglePublish(article.id)}
                        className="p-2 text-hormadi-muted hover:text-hormadi-red transition-colors"
                        title={article.published ? 'Dépublier' : 'Publier'}
                      >
                        {article.published ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => handleOpenForm(article)}
                        className="p-2 text-hormadi-muted hover:text-hormadi-red transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <div className="relative inline-block">
                        <button
                          onClick={() =>
                            setDeleteConfirm(
                              deleteConfirm === article.id ? null : article.id
                            )
                          }
                          className="p-2 text-hormadi-muted hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                        {deleteConfirm === article.id && (
                          <div className="absolute right-0 top-full mt-2 bg-hormadi-dark border border-hormadi-border rounded-lg p-3 w-48 z-40 shadow-lg">
                            <p className="text-white text-sm font-semibold mb-3">
                              Supprimer cet article?
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteArticle(article.id)}
                                className="flex-1 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                              >
                                Supprimer
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 px-3 py-1 bg-hormadi-surface border border-hormadi-border text-white text-sm rounded hover:bg-hormadi-surface/80 transition-colors"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-hormadi-dark border border-hormadi-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-hormadi-border flex items-center justify-between sticky top-0 bg-hormadi-dark">
              <h2 className="text-2xl font-bold text-white">
                {editingArticle ? 'Modifier un article' : 'Nouvel article'}
              </h2>
              <button
                onClick={handleCloseForm}
                disabled={submitting}
                className="text-hormadi-muted hover:text-white transition-colors disabled:opacity-50"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Titre de l'article"
                  className="input w-full"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Catégorie *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="input w-full bg-hormadi-surface"
                  required
                  disabled={submitting}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="input w-full"
                  disabled={submitting}
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="mt-3 max-w-xs h-32 object-cover rounded bg-hormadi-surface"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Résumé *
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) =>
                    setFormData({ ...formData, excerpt: e.target.value })
                  }
                  placeholder="Résumé de l'article (visible en liste)"
                  rows={3}
                  className="input w-full"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Contenu *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Contenu de l'article (HTML supporté)"
                  rows={6}
                  className="input w-full font-mono text-sm"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData({ ...formData, published: e.target.checked })
                    }
                    className="w-4 h-4 accent-hormadi-red"
                    disabled={submitting}
                  />
                  <span className="text-white">Publier cet article</span>
                </label>
              </div>

              <div className="flex gap-4 pt-6 border-t border-hormadi-border">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader size={18} className="animate-spin" />
                      Saving...
                    </span>
                  ) : editingArticle ? (
                    'Mettre à jour'
                  ) : (
                    'Créer'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={submitting}
                  className="btn-secondary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
