'use client'

import Link from 'next/link'
import { Trash2, ShoppingCart, ShoppingBag, ChevronLeft, ChevronRight, Home, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/cart'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotal } = useCart()

  const subtotal = getTotal()
  const shipping = subtotal >= 5000 ? 0 : 590
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-hormadi-dark">
        <section className="section-padding py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 rounded-full bg-hormadi-surface border border-hormadi-border flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="text-hormadi-muted" size={40} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">Votre panier est vide</h1>
            <p className="text-hormadi-muted text-lg mb-10 max-w-md mx-auto">
              Parcourez notre boutique et trouvez les articles parfaits pour supporter l&apos;Hormadi !
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 bg-hormadi-red text-white font-bold px-8 py-4 rounded-xl hover:bg-hormadi-red/80 transition-colors shadow-lg shadow-hormadi-red/30"
            >
              <ShoppingBag size={20} />
              Découvrir la boutique
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-hormadi-dark">
      {/* Breadcrumb */}
      <div className="section-padding py-4 border-b border-hormadi-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-hormadi-muted text-sm">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <Home size={14} />
              Accueil
            </Link>
            <ChevronRight size={14} />
            <Link href="/boutique" className="hover:text-white transition-colors">
              Boutique
            </Link>
            <ChevronRight size={14} />
            <span className="text-white font-semibold">Panier</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="section-padding py-8 border-b border-hormadi-border">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            MON PANIER
            <span className="text-hormadi-muted text-lg font-normal ml-3">
              ({items.length} article{items.length !== 1 ? 's' : ''})
            </span>
          </h1>
        </div>
      </div>

      {/* Cart Content */}
      <section className="section-padding py-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-4 sm:p-6 flex gap-4 sm:gap-6"
                >
                  {/* Image placeholder */}
                  <Link href={`/boutique/${item.slug}`} className="flex-shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gradient-to-br from-hormadi-forest/20 to-hormadi-dark/10 flex items-center justify-center">
                      <ShoppingBag className="text-hormadi-forest/30" size={28} />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/boutique/${item.slug}`}>
                          <h3 className="font-bold text-white text-sm sm:text-base hover:text-hormadi-red transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        {item.size && (
                          <p className="text-xs sm:text-sm text-hormadi-muted mt-1">
                            Taille : <span className="text-white font-semibold">{item.size}</span>
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-hormadi-muted hover:text-hormadi-red transition-colors p-1.5 rounded-lg hover:bg-hormadi-red/10 flex-shrink-0"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity */}
                      <div className="flex items-center gap-0.5 bg-hormadi-dark border border-hormadi-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-hormadi-border transition-colors text-hormadi-muted hover:text-white"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-9 text-center font-bold text-white text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size)}
                          className="w-9 h-9 flex items-center justify-center hover:bg-hormadi-border transition-colors text-hormadi-muted hover:text-white"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price */}
                      <span className="text-lg sm:text-xl font-black text-hormadi-red">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 text-hormadi-muted hover:text-hormadi-red font-bold mt-4 group transition-all text-sm"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                Continuer mes achats
              </Link>
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-28 bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6">
                <h2 className="text-xl font-black text-white mb-6">Résumé de commande</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-hormadi-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-hormadi-muted">Sous-total</span>
                    <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-hormadi-muted">Livraison</span>
                    {shipping === 0 ? (
                      <span className="font-bold text-green-400">Gratuite</span>
                    ) : (
                      <span className="text-white font-bold">{formatPrice(shipping)}</span>
                    )}
                  </div>
                  {shipping > 0 && (
                    <div className="bg-hormadi-dark/50 rounded-lg p-3 mt-2">
                      <p className="text-xs text-hormadi-muted">
                        Plus que <span className="text-hormadi-red font-bold">{formatPrice(5000 - subtotal)}</span> pour la livraison gratuite !
                      </p>
                      <div className="w-full h-1.5 bg-hormadi-border rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-hormadi-red rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, (subtotal / 5000) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="font-bold text-hormadi-muted text-sm uppercase">Total</span>
                  <span className="text-3xl font-black text-hormadi-red">{formatPrice(total)}</span>
                </div>

                <button
                  className="w-full flex items-center justify-center gap-2 bg-hormadi-red text-white font-bold py-4 rounded-xl hover:bg-hormadi-red/80 transition-all shadow-lg shadow-hormadi-red/30 text-lg mb-6"
                >
                  <ShoppingCart size={20} />
                  Passer commande
                </button>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { icon: Truck, text: 'Livraison rapide' },
                    { icon: RotateCcw, text: 'Retour 30j' },
                    { icon: Shield, text: 'Paiement sécurisé' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex flex-col items-center gap-1.5 py-2 text-center">
                      <Icon size={16} className="text-hormadi-ocean" />
                      <span className="text-[10px] text-hormadi-muted font-semibold leading-tight">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
