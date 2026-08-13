'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ChevronRight, ShoppingCart, ShoppingBag, Heart, AlertCircle, Check, Home,
  Minus, Plus, Truck, RotateCcw, Shield, Star, Clock, Package, Users, Ruler,
  ChevronDown, ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/cart'

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
  published?: boolean
  badge?: string | null
  createdAt?: string
  updatedAt?: string
}

const CATEGORY_LABELS: Record<string, string> = {
  maillots: 'Maillots',
  textile: 'Textile',
  accessoires: 'Accessoires',
  enfant: 'Enfant',
  collectors: 'Collectors',
}

// Size guide data
const SIZE_GUIDE: Record<string, { headers: string[]; rows: string[][] }> = {
  maillots: {
    headers: ['Taille', 'Tour poitrine', 'Longueur'],
    rows: [['S', '88-92 cm', '70 cm'], ['M', '96-100 cm', '72 cm'], ['L', '104-108 cm', '74 cm'], ['XL', '112-116 cm', '76 cm'], ['XXL', '120-124 cm', '78 cm']],
  },
  textile: {
    headers: ['Taille', 'Tour poitrine', 'Longueur'],
    rows: [['XS', '84-88 cm', '66 cm'], ['S', '88-92 cm', '68 cm'], ['M', '96-100 cm', '70 cm'], ['L', '104-108 cm', '72 cm'], ['XL', '112-116 cm', '74 cm'], ['XXL', '120-124 cm', '76 cm']],
  },
  enfant: {
    headers: ['Taille', 'Âge', 'Tour poitrine'],
    rows: [['4-6 ans', '4-6', '56-60 cm'], ['6-8 ans', '6-8', '60-66 cm'], ['8-10 ans', '8-10', '66-72 cm'], ['10-12 ans', '10-12', '72-78 cm'], ['12-14 ans', '12-14', '78-84 cm']],
  },
}

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { addToCart, getItemCount } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [activeTab, setActiveTab] = useState<'description' | 'details' | 'livraison'>('description')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          setProduct(null)
        }
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [slug])

  const sizes = useMemo(() => {
    if (!product?.sizes) return null
    try { return JSON.parse(product.sizes) as string[] } catch { return null }
  }, [product])

  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!product) return
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/products?category=${product.category}&limit=5`)
        if (res.ok) {
          const data = await res.json()
          const list = data?.data || data?.products || []
          setRelatedProducts(list.filter((p: Product) => p.id !== product.id).slice(0, 4))
        }
      } catch {
        // ignore
      }
    }
    fetchRelated()
  }, [product])

  const sizeGuide = product ? SIZE_GUIDE[product.category] : null

  if (loading) {
    return (
      <main className="min-h-screen bg-hormadi-dark">
        <div className="section-padding max-w-6xl mx-auto py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-hormadi-surface/50 rounded-2xl animate-pulse" />
            <div className="space-y-6">
              <div className="h-4 bg-hormadi-surface/50 rounded w-1/4 animate-pulse" />
              <div className="h-10 bg-hormadi-surface/50 rounded w-3/4 animate-pulse" />
              <div className="h-20 bg-hormadi-surface/50 rounded w-full animate-pulse" />
              <div className="h-12 bg-hormadi-surface/50 rounded w-1/3 animate-pulse" />
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-hormadi-dark">
        <div className="section-padding max-w-4xl mx-auto text-center py-20">
          <AlertCircle className="mx-auto text-hormadi-muted mb-6" size={64} />
          <h1 className="text-3xl font-black text-white mb-4">Produit non trouvé</h1>
          <p className="text-hormadi-muted mb-8">Ce produit n&apos;existe pas ou a été retiré de la boutique.</p>
          <Link href="/boutique" className="inline-flex items-center gap-2 bg-hormadi-red text-white font-bold px-6 py-3 rounded-lg hover:bg-hormadi-red/80 transition-colors">
            <ShoppingBag size={18} />
            Retour à la boutique
          </Link>
        </div>
      </main>
    )
  }

  const isOutOfStock = product.stock === 0
  const isLowStock = product.stock > 0 && product.stock <= 5
  const needsSize = sizes !== null && !selectedSize
  const itemCount = getItemCount()

  const handleAddToCart = () => {
    if (needsSize || isOutOfStock) return
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      size: selectedSize || undefined,
      quantity,
      stock: product.stock,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2500)
  }

  return (
    <main className="min-h-screen bg-hormadi-dark">
      {/* Breadcrumb */}
      <div className="section-padding py-4 border-b border-hormadi-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-hormadi-muted text-sm flex-wrap">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home size={14} /> Accueil
            </Link>
            <ChevronRight size={14} />
            <Link href="/boutique" className="hover:text-white transition-colors">Boutique</Link>
            <ChevronRight size={14} />
            <span className="text-white font-semibold truncate max-w-[200px]">{product.name}</span>
          </div>
          {/* Mini cart */}
          <Link href="/boutique/panier" className="flex items-center gap-2 text-hormadi-muted hover:text-white transition-colors text-sm">
            <div className="relative">
              <ShoppingCart size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-hormadi-red text-white text-[9px] font-black flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Panier</span>
          </Link>
        </div>
      </div>

      {/* Product Section */}
      <section className="section-padding py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

            {/* ─── LEFT: Image ─── */}
            <div>
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-2xl shadow-black/20">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-hormadi-forest/20 to-hormadi-dark/10 flex items-center justify-center">
                    <ShoppingBag className="text-hormadi-forest/30" size={96} />
                  </div>
                )}
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      'inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg',
                      product.badge === 'Best-seller' ? 'bg-hormadi-forest text-white' :
                      product.badge === 'Édition limitée' ? 'bg-black text-white' :
                      product.badge === '-20%' ? 'bg-hormadi-red text-white' :
                      'bg-hormadi-red text-white'
                    )}>
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>

              {/* Reassurance under image */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: Truck, text: 'Livraison 5-7 jours' },
                  { icon: RotateCcw, text: 'Retour sous 30 jours' },
                  { icon: Shield, text: 'Paiement 100% sécurisé' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-2 py-3 px-2 bg-hormadi-surface/50 rounded-xl border border-hormadi-border text-center">
                    <Icon size={18} className="text-hormadi-ocean" />
                    <span className="text-[11px] text-hormadi-muted font-semibold leading-tight">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── RIGHT: Product Info ─── */}
            <div className="flex flex-col">
              {/* Category + badge */}
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-hormadi-forest/20 text-hormadi-ocean">
                  {CATEGORY_LABELS[product.category]}
                </span>
                {product.featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-400">
                    <Star size={12} /> Populaire
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight mb-2">
                {product.name}
              </h1>

              {/* Reviews placeholder */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} size={16} className={i <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
                  ))}
                </div>
                <span className="text-hormadi-muted text-sm">(12 avis)</span>
              </div>

              {/* Price block */}
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-black text-hormadi-red">
                  {formatPrice(product.price)}
                </span>
              </div>

              {/* Stock urgency */}
              <div className="mb-6">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 text-red-400 bg-red-500/10 px-4 py-2.5 rounded-lg text-sm font-bold">
                    <AlertCircle size={16} /> Rupture de stock
                  </div>
                ) : isLowStock ? (
                  <div className="flex items-center gap-2 text-orange-400 bg-orange-500/10 px-4 py-2.5 rounded-lg text-sm font-bold animate-pulse">
                    <Clock size={16} /> Attention : plus que {product.stock} en stock !
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2.5 rounded-lg text-sm font-bold">
                    <Check size={16} /> En stock — Expédition sous 48h
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-hormadi-muted text-base leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Divider */}
              <div className="h-px bg-hormadi-border mb-6" />

              {/* Size Selector */}
              {sizes && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-bold text-white uppercase tracking-wide">
                      Taille {needsSize && <span className="text-hormadi-red">— Sélectionnez une taille</span>}
                    </label>
                    {sizeGuide && (
                      <button
                        onClick={() => setShowSizeGuide(!showSizeGuide)}
                        className="flex items-center gap-1 text-xs text-hormadi-ocean hover:text-hormadi-red transition-colors font-semibold"
                      >
                        <Ruler size={14} />
                        Guide des tailles
                        <ChevronDown size={12} className={cn('transition-transform', showSizeGuide && 'rotate-180')} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={cn(
                          'px-5 py-3 rounded-lg font-bold text-sm transition-all border-2',
                          selectedSize === size
                            ? 'bg-hormadi-red text-white border-hormadi-red shadow-lg shadow-hormadi-red/30'
                            : 'bg-hormadi-surface text-hormadi-muted border-hormadi-border hover:border-hormadi-red/50 hover:text-white'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  {/* Size guide table */}
                  {showSizeGuide && sizeGuide && (
                    <div className="mt-4 bg-hormadi-surface/50 border border-hormadi-border rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-hormadi-border">
                            {sizeGuide.headers.map((h) => (
                              <th key={h} className="text-left px-4 py-3 text-hormadi-ocean font-bold text-xs uppercase">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sizeGuide.rows.map((row, i) => (
                            <tr key={i} className="border-b border-hormadi-border/50 last:border-0">
                              {row.map((cell, j) => (
                                <td key={j} className={cn('px-4 py-2.5', j === 0 ? 'text-white font-bold' : 'text-hormadi-muted')}>{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-white uppercase mb-3 tracking-wide">
                  Quantité
                </label>
                <div className="flex items-center gap-1 w-fit bg-hormadi-surface border border-hormadi-border rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-hormadi-border transition-colors text-hormadi-muted hover:text-white">
                    <Minus size={18} />
                  </button>
                  <span className="w-14 text-center font-bold text-white text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-12 h-12 flex items-center justify-center hover:bg-hormadi-border transition-colors text-hormadi-muted hover:text-white">
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Add to Cart + Wishlist */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || needsSize}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-3 font-bold text-lg py-4 rounded-xl transition-all duration-300',
                    addedToCart
                      ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
                      : isOutOfStock || needsSize
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-hormadi-red text-white hover:bg-hormadi-red/80 shadow-lg shadow-hormadi-red/30 hover:shadow-xl hover:shadow-hormadi-red/40 hover:scale-[1.02]'
                  )}
                >
                  {addedToCart ? (
                    <><Check size={22} /> Ajouté au panier !</>
                  ) : (
                    <><ShoppingCart size={22} /> Ajouter au panier — {formatPrice(product.price * quantity)}</>
                  )}
                </button>
                <button className="w-14 flex items-center justify-center bg-hormadi-surface border border-hormadi-border rounded-xl hover:border-hormadi-red/50 transition-colors group flex-shrink-0">
                  <Heart size={22} className="text-hormadi-muted group-hover:text-hormadi-red transition-colors" />
                </button>
              </div>

              {/* Free shipping banner */}
              {product.price * quantity < 5000 ? (
                <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Truck size={18} className="text-hormadi-ocean flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">
                        Plus que <span className="text-hormadi-red">{formatPrice(5000 - product.price * quantity)}</span> pour la livraison gratuite
                      </p>
                      <div className="w-full h-1.5 bg-hormadi-border rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-hormadi-ocean rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (product.price * quantity / 5000) * 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
                  <Truck size={18} className="text-green-400 flex-shrink-0" />
                  <p className="text-green-400 text-sm font-bold">Livraison gratuite pour cette commande !</p>
                </div>
              )}

              {/* Social proof */}
              <div className="flex items-center gap-3 text-hormadi-muted text-sm mb-6">
                <Users size={16} className="text-hormadi-ocean" />
                <span><strong className="text-white">24 personnes</strong> regardent cet article en ce moment</span>
              </div>
            </div>
          </div>

          {/* ─── PRODUCT TABS ─── */}
          <div className="mt-16 border-t border-hormadi-border pt-10">
            {/* Tab headers */}
            <div className="flex gap-1 mb-8 border-b border-hormadi-border">
              {[
                { id: 'description' as const, label: 'Description' },
                { id: 'details' as const, label: 'Caractéristiques' },
                { id: 'livraison' as const, label: 'Livraison & Retours' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-px',
                    activeTab === tab.id
                      ? 'border-hormadi-red text-white'
                      : 'border-transparent text-hormadi-muted hover:text-white'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="max-w-3xl">
              {activeTab === 'description' && (
                <div className="space-y-4 text-hormadi-muted leading-relaxed">
                  <p>{product.description}</p>
                  <p>
                    Produit officiel sous licence Hormadi Anglet. Chaque article est conçu pour offrir confort et style,
                    que ce soit pour les jours de match ou pour le quotidien. Rejoignez les milliers de supporters qui
                    portent fièrement les couleurs de l&apos;Hormadi.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    {[
                      { icon: Package, label: 'Produit officiel sous licence' },
                      { icon: Star, label: 'Qualité premium garantie' },
                      { icon: Shield, label: 'Conforme aux normes européennes' },
                      { icon: RotateCcw, label: 'Échangeable sous 30 jours' },
                    ].map(({ icon: Icon, label }) => (
                      <div key={label} className="flex items-center gap-3">
                        <Icon size={16} className="text-hormadi-ocean flex-shrink-0" />
                        <span className="text-sm">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-3">
                  {[
                    ['Marque', 'Hormadi Anglet'],
                    ['Collection', 'Saison 2026-2027'],
                    ['Catégorie', CATEGORY_LABELS[product.category]],
                    ['Référence', product.id.toUpperCase()],
                    ...(sizes ? [['Tailles disponibles', sizes.join(', ')]] : []),
                    ['Entretien', 'Lavage 30°C, pas de sèche-linge'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-3 border-b border-hormadi-border/50">
                      <span className="text-hormadi-muted font-semibold text-sm">{label}</span>
                      <span className="text-white text-sm font-bold">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'livraison' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <Truck size={18} className="text-hormadi-ocean" /> Livraison
                    </h3>
                    <div className="space-y-2 text-hormadi-muted text-sm">
                      <p>Livraison standard : 5 à 7 jours ouvrés — <strong className="text-white">5,90€</strong></p>
                      <p>Livraison express : 2 à 3 jours ouvrés — <strong className="text-white">9,90€</strong></p>
                      <p className="text-hormadi-ocean font-semibold">Livraison gratuite dès 50€ d&apos;achat !</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                      <RotateCcw size={18} className="text-hormadi-ocean" /> Retours
                    </h3>
                    <div className="space-y-2 text-hormadi-muted text-sm">
                      <p>Retour gratuit sous 30 jours après réception.</p>
                      <p>L&apos;article doit être dans son état d&apos;origine, non porté et avec ses étiquettes.</p>
                      <p>Remboursement sous 5 jours ouvrés après réception du retour.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── RELATED PRODUCTS ─── */}
      {relatedProducts.length > 0 && (
        <section className="section-padding py-12 border-t border-hormadi-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-white">Vous aimerez aussi</h2>
              <Link href="/boutique" className="hidden sm:flex items-center gap-1 text-sm text-hormadi-muted hover:text-hormadi-red transition-colors font-semibold">
                Voir tout <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((rp) => (
                <Link key={rp.id} href={`/boutique/${rp.slug}`} className="group">
                  <div className="rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-xl hover:shadow-black/20 transition-all duration-300">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      {rp.imageUrl ? (
                        <img src={rp.imageUrl} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-hormadi-forest/20 to-hormadi-dark/10 flex items-center justify-center">
                          <ShoppingBag className="text-hormadi-forest/30" size={40} />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-hormadi-forest transition-colors mb-1">{rp.name}</h3>
                      <span className="text-lg font-black text-hormadi-red">{formatPrice(rp.price)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
