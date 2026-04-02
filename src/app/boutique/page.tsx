'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { ShoppingCart, ShoppingBag, ChevronDown, ChevronRight, Star, Eye, Home, Truck, RotateCcw, Shield, Ticket } from 'lucide-react'
import CTASection from '@/components/sections/CTASection'
import SocialCTA from '@/components/sections/SocialCTA'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { demoProducts } from '@/lib/demo-products'
import { useCart } from '@/lib/cart'

// ─── Types ────────────────────────────────────────────

type Product = (typeof demoProducts)[0]

// ─── Constants ────────────────────────────────────────

const CATEGORIES = [
  { id: 'tous', label: 'Tous les articles', icon: '🏒' },
  { id: 'maillots', label: 'Maillots', icon: '👕' },
  { id: 'textile', label: 'Textile', icon: '🧥' },
  { id: 'accessoires', label: 'Accessoires', icon: '🎒' },
  { id: 'enfant', label: 'Enfant', icon: '👶' },
  { id: 'collectors', label: 'Collectors', icon: '⭐' },
]

const SORT_OPTIONS = [
  { id: 'featured', label: 'Vedettes' },
  { id: 'newest', label: 'Nouveautés' },
  { id: 'price-asc', label: 'Prix croissant' },
  { id: 'price-desc', label: 'Prix décroissant' },
]

// ─── Product Card ─────────────────────────────────────

function ProductCard({ product, onQuickAdd }: { product: Product; onQuickAdd: (p: Product) => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-xl bg-white transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-black/20">
        {/* Image */}
        <Link href={`/boutique/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-hormadi-forest/20 to-hormadi-dark/10 flex items-center justify-center">
                <ShoppingBag className="text-hormadi-forest/30" size={64} />
              </div>
            )}

            {/* Hover overlay */}
            <div className={cn(
              'absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300',
              isHovered ? 'opacity-100' : 'opacity-0'
            )}>
              <span className="bg-white text-hormadi-dark font-bold text-sm px-5 py-2.5 rounded-full flex items-center gap-2 shadow-lg">
                <Eye size={16} />
                Voir le produit
              </span>
            </div>

            {/* Badge */}
            {product.badge && (
              <div className="absolute top-3 left-3">
                <span className={cn(
                  'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide',
                  product.badge === 'Best-seller' ? 'bg-hormadi-forest text-white' :
                  product.badge === 'Édition limitée' ? 'bg-black text-white' :
                  product.badge === '-20%' ? 'bg-hormadi-red text-white' :
                  'bg-hormadi-red text-white'
                )}>
                  {product.badge}
                </span>
              </div>
            )}

            {/* Stock warning */}
            {product.stock > 0 && product.stock <= 5 && (
              <div className="absolute bottom-3 left-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-orange-500 text-white">
                  Plus que {product.stock} en stock
                </span>
              </div>
            )}

            {/* Out of stock */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-white text-gray-900 font-black text-sm px-5 py-2.5 rounded-full uppercase">
                  Rupture de stock
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="text-[11px] uppercase tracking-wider font-bold text-hormadi-forest mb-1.5">
            {CATEGORIES.find((c) => c.id === product.category)?.label}
          </p>

          {/* Name */}
          <Link href={`/boutique/${product.slug}`}>
            <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-hormadi-forest transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Price + Add to cart */}
          <div className="flex items-center justify-between gap-2 mt-3">
            <span className="text-xl font-black text-hormadi-red">
              {formatPrice(product.price)}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault()
                onQuickAdd(product)
              }}
              disabled={product.stock === 0}
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
                product.stock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-hormadi-red text-white hover:bg-hormadi-red/80 hover:scale-110 shadow-md shadow-hormadi-red/30'
              )}
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────

export default function BoutiquePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState('tous')
  const [sortBy, setSortBy] = useState('featured')
  const [loading, setLoading] = useState(true)
  const { addToCart, getItemCount } = useCart()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          const list = Array.isArray(data) ? data : data?.products
          if (Array.isArray(list) && list.length > 0) {
            setProducts(list)
          } else {
            setProducts(demoProducts)
          }
        } else {
          setProducts(demoProducts)
        }
      } catch {
        setProducts(demoProducts)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    let filtered = products
    if (selectedCategory !== 'tous') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }
    const sorted = [...filtered]
    if (sortBy === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    else if (sortBy === 'newest') sorted.reverse()
    else if (sortBy === 'featured') sorted.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
    return sorted
  }, [products, selectedCategory, sortBy])

  const handleQuickAdd = (product: Product) => {
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      stock: product.stock,
    })
  }

  const itemCount = getItemCount()

  return (
    <main className="min-h-screen bg-hormadi-dark">
      {/* ─── HERO (same pattern as other pages) ─── */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden -mt-[5.5rem]">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/hero-boutique.jpg"
          alt="Boutique Hormadi"
          className="absolute inset-0 z-[1] w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/50 to-hormadi-dark/20" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-hormadi-dark/70 via-transparent to-transparent" />
        <div className="absolute z-[3] top-0 right-0 w-96 h-96 bg-hormadi-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute z-[3] bottom-0 left-0 w-72 h-72 bg-hormadi-ocean/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-[5] h-full flex flex-col justify-end pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Boutique</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
                  <ShoppingBag size={20} className="text-hormadi-red" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
                  Collection 2025-2026
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
                BOUTIQUE
              </h1>
              <p className="text-hormadi-muted mt-3 text-base sm:text-lg max-w-lg">
                Retrouvez toute la collection officielle de l&apos;Hormadi Anglet. Maillots, textile et accessoires pour tous les supporters.
              </p>
            </div>

            {/* Cart CTA */}
            <Link
              href="/boutique/panier"
              className="hidden lg:flex items-center gap-3 bg-white text-hormadi-dark font-bold px-6 py-3.5 rounded-xl hover:bg-gray-100 transition-colors shadow-lg flex-shrink-0"
            >
              <div className="relative">
                <ShoppingCart size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-hormadi-red text-white text-[10px] font-black flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              Mon panier
            </Link>
          </div>
        </div>
      </section>

      {/* ─── AVANTAGES ─── */}
      <section className="border-b border-hormadi-border bg-hormadi-surface/30">
        <div className="section-padding">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: Truck, label: 'Livraison offerte', sub: 'Dès 50€ d\'achat' },
              { icon: RotateCcw, label: 'Retours gratuits', sub: 'Sous 30 jours' },
              { icon: Shield, label: 'Paiement sécurisé', sub: 'CB & PayPal' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 py-4">
                <div className="w-10 h-10 rounded-lg bg-hormadi-red/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-hormadi-red" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{label}</p>
                  <p className="text-hormadi-muted text-xs">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CATEGORY TABS + SORT ─── */}
      <section className="bg-hormadi-dark border-b border-hormadi-border">
        <div className="section-padding py-0">
          <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-hide">
            {/* Category tabs */}
            <div className="flex gap-1 py-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all duration-200',
                    selectedCategory === category.id
                      ? 'bg-hormadi-red text-white shadow-lg shadow-hormadi-red/30'
                      : 'text-hormadi-muted hover:text-white hover:bg-hormadi-surface'
                  )}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Sort + count */}
            <div className="hidden sm:flex items-center gap-4 flex-shrink-0">
              <span className="text-hormadi-muted text-sm">
                <span className="font-bold text-white">{filteredProducts.length}</span> article{filteredProducts.length !== 1 ? 's' : ''}
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-hormadi-surface border border-hormadi-border text-white text-sm rounded-lg pl-3 pr-8 py-2 cursor-pointer hover:border-hormadi-red/50 transition-colors"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-hormadi-muted pointer-events-none" size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRODUCTS GRID ─── */}
      <section className="section-padding py-10 sm:py-14">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-hormadi-surface/50 animate-pulse">
                  <div className="aspect-square bg-hormadi-forest/10 rounded-t-xl" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 bg-hormadi-forest/10 rounded w-1/3" />
                    <div className="h-4 bg-hormadi-forest/10 rounded w-3/4" />
                    <div className="h-5 bg-hormadi-forest/10 rounded w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="mx-auto text-hormadi-muted mb-6" size={64} />
              <h2 className="text-2xl font-black text-white mb-3">Aucun produit trouvé</h2>
              <p className="text-hormadi-muted mb-8">Aucun article dans cette catégorie pour le moment.</p>
              <button
                onClick={() => setSelectedCategory('tous')}
                className="inline-flex items-center gap-2 bg-hormadi-red text-white font-bold px-6 py-3 rounded-lg hover:bg-hormadi-red/80 transition-colors"
              >
                Voir tous les produits
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickAdd={handleQuickAdd}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA SECTIONS ─── */}
      <div className="py-16" />
      <CTASection />
      <div className="py-16" />
      <SocialCTA />
      <div className="py-8" />

      {/* ─── MOBILE CART BUTTON ─── */}
      {itemCount > 0 && (
        <div className="fixed bottom-6 right-6 lg:hidden z-50">
          <Link
            href="/boutique/panier"
            className="flex items-center gap-2 bg-hormadi-red text-white font-bold px-5 py-3.5 rounded-full shadow-2xl shadow-hormadi-red/40 hover:bg-hormadi-red/90 transition-colors"
          >
            <ShoppingCart size={20} />
            Panier ({itemCount})
          </Link>
        </div>
      )}
    </main>
  )
}
