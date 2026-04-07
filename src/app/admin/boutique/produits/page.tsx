'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Trash2, Edit, Plus, Search, Eye, EyeOff } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

type Product = {
  id: string
  slug: string
  name: string
  description: string
  price: number
  category: string
  imageUrl: string | null
  sizes: string | null
  stock: number
  featured: boolean
  published: boolean
  createdAt?: string
  updatedAt?: string
}

const CATEGORIES = ['maillots', 'textile', 'accessoires', 'enfant', 'collectors']

type ProductFormData = {
  name: string
  slug: string
  description: string
  price: string
  category: string
  stock: string
  featured: boolean
  published: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    slug: '',
    description: '',
    price: '',
    category: 'textile',
    stock: '',
    featured: false,
    published: true,
  })

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products?limit=200')
        if (res.ok) {
          const data = await res.json()
          setProducts(data?.data || [])
        }
      } catch {
        // ignore
      }
    }
    fetchProducts()
  }, [])

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === '' || p.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

  const handleOpenForm = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: (product.price / 100).toString(),
        category: product.category,
        stock: product.stock.toString(),
        featured: product.featured,
        published: product.published,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        slug: '',
        description: '',
        price: '',
        category: 'textile',
        stock: '',
        featured: false,
        published: true,
      })
    }
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, would call API
    alert(editingProduct ? 'Produit mis à jour (simulé)' : 'Produit créé (simulé)')
    handleCloseForm()
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      // In real app, would call API
      alert('Produit supprimé (simulé)')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Gestion des produits</h1>
              <p className="text-hormadi-muted">
                {filteredProducts.length} article{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => handleOpenForm()}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Nouveau produit
            </button>
          </div>

      {/* Filters */}
      <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-3 text-hormadi-muted" size={20} />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10 w-full"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input bg-hormadi-surface border border-hormadi-border text-white"
              >
                <option value="">Toutes les catégories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

      {/* Products Table */}
      <div className="bg-hormadi-surface border border-hormadi-border rounded-xl overflow-x-auto">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-hormadi-muted mb-4">Aucun produit trouvé</p>
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
                      Produit
                    </th>
                    <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                      Catégorie
                    </th>
                    <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                      Prix
                    </th>
                    <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                      Stock
                    </th>
                    <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                      Statut
                    </th>
                    <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hormadi-border">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-hormadi-surface/30">
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-hormadi-muted text-xs font-mono">{product.slug}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="badge">
                          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-hormadi-red font-semibold">
                        {formatPrice(product.price)}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`font-semibold ${
                            product.stock === 0
                              ? 'text-red-500'
                              : product.stock < 10
                                ? 'text-yellow-500'
                                : 'text-green-500'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {product.published ? (
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenForm(product)}
                            className="p-2 text-hormadi-muted hover:text-hormadi-red transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="p-2 text-hormadi-muted hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

      {/* Product Form Modal */}
      {showForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-hormadi-dark border border-hormadi-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-hormadi-border flex items-center justify-between sticky top-0 bg-hormadi-dark">
                  <h2 className="text-2xl font-bold text-white">
                    {editingProduct ? 'Modifier un produit' : 'Ajouter un produit'}
                  </h2>
                  <button
                    onClick={handleCloseForm}
                    className="text-hormadi-muted hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Name & Slug */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Nom</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Maillot Domicile 2024"
                        className="input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Slug</label>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData({ ...formData, slug: e.target.value })
                        }
                        placeholder="maillot-domicile-2024"
                        className="input w-full"
                        required
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Description du produit"
                      rows={4}
                      className="input w-full"
                      required
                    />
                  </div>

                  {/* Price & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Prix (€)
                      </label>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="69.99"
                        step="0.01"
                        min="0"
                        className="input w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">
                        Catégorie
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="input w-full bg-hormadi-surface"
                        required
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Stock */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: e.target.value })
                      }
                      placeholder="10"
                      min="0"
                      className="input w-full"
                      required
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) =>
                          setFormData({ ...formData, featured: e.target.checked })
                        }
                        className="w-4 h-4 accent-hormadi-red"
                      />
                      <span className="text-white">Article vedette</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) =>
                          setFormData({ ...formData, published: e.target.checked })
                        }
                        className="w-4 h-4 accent-hormadi-red"
                      />
                      <span className="text-white">Publié</span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4 pt-6 border-t border-hormadi-border">
                    <button type="submit" className="btn-primary flex-1">
                      {editingProduct ? 'Mettre à jour' : 'Créer'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCloseForm}
                      className="btn-secondary flex-1"
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
