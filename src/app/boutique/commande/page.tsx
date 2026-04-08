'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, AlertCircle, ChevronLeft, Truck, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/lib/cart'

type OrderStatus = 'checkout' | 'success'
type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
}

type OrderData = FormData & {
  reference: string
  total: number
  subtotal: number
  shipping: number
}

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Livraison Standard (5-7 jours)', price: 590, days: '5-7' },
  { id: 'express', label: 'Livraison Express (2-3 jours)', price: 1290, days: '2-3' },
  { id: 'free', label: 'Livraison Gratuite (7-10 jours)', price: 0, days: '7-10' },
]

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart()
  const [status, setStatus] = useState<OrderStatus>('checkout')
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedShipping, setSelectedShipping] = useState('standard')

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  })

  // Calculate totals
  const subtotal = getTotal()
  const selectedShippingOption = SHIPPING_OPTIONS.find((opt) => opt.id === selectedShipping)
  const shipping = selectedShippingOption?.price || 590
  const total = subtotal + shipping

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est requis'
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est requis'
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'L\'email est invalide'
    if (!formData.phone.trim()) newErrors.phone = 'Le téléphone est requis'
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise'
    if (!formData.city.trim()) newErrors.city = 'La ville est requise'
    if (!formData.zip.trim()) newErrors.zip = 'Le code postal est requis'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submit — creates a real order via API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      // Build order payload for API
      const orderPayload = {
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        shippingCity: formData.city,
        shippingZip: formData.zip,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size || null,
        })),
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Erreur lors de la création de la commande')
      }

      const data = await res.json()
      const reference = data.reference || data.id?.substring(0, 8).toUpperCase() || `HOR-${Date.now().toString(36).toUpperCase()}`

      // Set success data
      setOrderData({
        ...formData,
        reference,
        total,
        subtotal,
        shipping,
      })

      setStatus('success')
      clearCart()
    } catch (err: any) {
      console.error('Order error:', err)
      setErrors({ submit: err.message || 'Erreur lors de la commande. Veuillez réessayer.' })
    } finally {
      setLoading(false)
    }
  }

  // Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  if (items.length === 0 && status === 'checkout') {
    return (
      <main className="min-h-screen bg-hormadi-dark">
        <section className="section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <AlertCircle className="mx-auto text-hormadi-muted mb-6" size={64} />
            <h1 className="text-4xl font-black text-white mb-4">Panier vide</h1>
            <p className="text-hormadi-muted text-lg mb-8">
              Vous devez avoir des articles dans votre panier pour passer une commande
            </p>
            <Link href="/boutique" className="btn-primary">
              Retour à la boutique
            </Link>
          </div>
        </section>
      </main>
    )
  }

  if (status === 'success' && orderData) {
    return (
      <main className="min-h-screen bg-hormadi-dark">
        <section className="section-padding">
          <div className="max-w-2xl mx-auto">
            {/* Success Message */}
            <div className="text-center mb-12">
              <CheckCircle className="mx-auto text-green-500 mb-6" size={80} />
              <h1 className="text-4xl font-black text-white mb-4">Commande confirmée!</h1>
              <p className="text-hormadi-muted text-lg mb-4">
                Merci d'avoir passé commande chez Hormadi Anglet
              </p>
              <p className="text-hormadi-red font-black text-2xl">
                Référence: {orderData.reference}
              </p>
            </div>

            {/* Order Summary Card */}
            <div className="card border-2 border-hormadi-border mb-8">
              <h2 className="text-2xl font-black text-white mb-8 text-hormadi-red">
                RÉSUMÉ DE COMMANDE
              </h2>

              {/* Customer Info */}
              <div className="mb-8 pb-8 border-b-2 border-hormadi-border">
                <h3 className="text-sm font-black text-hormadi-red uppercase mb-4 tracking-wide">
                  Informations client
                </h3>
                <div className="space-y-2 text-white">
                  <p>
                    <span className="text-hormadi-muted font-semibold">Nom:</span> {orderData.firstName}{' '}
                    {orderData.lastName}
                  </p>
                  <p>
                    <span className="text-hormadi-muted font-semibold">Email:</span> {orderData.email}
                  </p>
                  <p>
                    <span className="text-hormadi-muted font-semibold">Téléphone:</span> {orderData.phone}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-8 pb-8 border-b-2 border-hormadi-border">
                <h3 className="text-sm font-black text-hormadi-red uppercase mb-4 tracking-wide">
                  Adresse de livraison
                </h3>
                <div className="space-y-1 text-white flex gap-3">
                  <MapPin className="text-hormadi-red flex-shrink-0 mt-1" size={20} />
                  <div>
                    <p>{orderData.address}</p>
                    <p>
                      {orderData.zip} {orderData.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="mb-8 pb-8 border-b-2 border-hormadi-border">
                <h3 className="text-sm font-black text-hormadi-red uppercase mb-4 tracking-wide">
                  Articles commandés
                </h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="flex justify-between text-sm"
                    >
                      <div>
                        <span className="text-white font-semibold">{item.name}</span>
                        {item.size && <span className="text-hormadi-muted ml-2">({item.size})</span>}
                        <p className="text-hormadi-muted text-xs mt-1">Quantité: {item.quantity}</p>
                      </div>
                      <span className="text-hormadi-red font-bold">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prices */}
              <div className="space-y-3 mb-8 pb-8 border-b-2 border-hormadi-border">
                <div className="flex justify-between text-hormadi-muted font-semibold">
                  <span>Sous-total</span>
                  <span>{formatPrice(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between text-hormadi-muted font-semibold">
                  <span>Livraison</span>
                  <span>
                    {orderData.shipping === 0 ? (
                      <span className="text-green-500">Gratuite</span>
                    ) : (
                      formatPrice(orderData.shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-white font-black">Total</span>
                  <span className="text-hormadi-red font-black text-2xl">{formatPrice(orderData.total)}</span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="card bg-green-950/30 border-2 border-green-600/30 mb-8">
              <h3 className="text-white font-black mb-4 text-lg">Prochaines étapes</h3>
              <ol className="space-y-3 text-hormadi-muted text-sm">
                <li className="flex gap-3">
                  <span className="font-bold text-green-500">1.</span>
                  <span>Un email de confirmation a été envoyé à <span className="text-white font-semibold">{orderData.email}</span></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-green-500">2.</span>
                  <span>Votre commande sera préparée sous 24h</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-green-500">3.</span>
                  <span>Vous recevrez une notification d'expédition avec un numéro de suivi</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-green-500">4.</span>
                  <span>Livraison en 5-7 jours ouvrés</span>
                </li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/boutique" className="btn-secondary text-center font-bold text-lg py-4">
                Continuer les achats
              </Link>
              <Link href="/" className="btn-primary text-center font-bold text-lg py-4">
                Retour à l'accueil
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-hormadi-dark">
      {/* Header */}
      <div className="section-padding border-b-2 border-hormadi-red bg-gradient-to-r from-hormadi-forest/50 to-hormadi-dark">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/boutique/panier"
            className="inline-flex items-center gap-2 text-hormadi-red hover:text-hormadi-red font-bold mb-6 group transition-all"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Retour au panier
          </Link>
          <h1 className="text-4xl font-black text-white">FINALISER LA COMMANDE</h1>
        </div>
      </div>

      {/* Checkout Form */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="card border-2 border-hormadi-border">
                {/* Step 1: Shipping Info */}
                <div className="mb-12 pb-12 border-b-2 border-hormadi-border">
                  <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-hormadi-red text-white flex items-center justify-center font-black">
                      1
                    </span>
                    Adresse de livraison
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-black text-white mb-3 uppercase">Prénom</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Jean"
                        className={cn(
                          'input w-full border-2',
                          errors.firstName ? 'border-red-500' : 'border-hormadi-border'
                        )}
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs font-bold mt-2">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-black text-white mb-3 uppercase">Nom</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Dupont"
                        className={cn(
                          'input w-full border-2',
                          errors.lastName ? 'border-red-500' : 'border-hormadi-border'
                        )}
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs font-bold mt-2">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-black text-white mb-3 uppercase">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jean.dupont@example.com"
                      className={cn(
                        'input w-full border-2',
                        errors.email ? 'border-red-500' : 'border-hormadi-border'
                      )}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs font-bold mt-2">{errors.email}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-black text-white mb-3 uppercase">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 6 12 34 56 78"
                      className={cn(
                        'input w-full border-2',
                        errors.phone ? 'border-red-500' : 'border-hormadi-border'
                      )}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs font-bold mt-2">{errors.phone}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-black text-white mb-3 uppercase">Adresse</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="123 rue de la Paix"
                      className={cn(
                        'input w-full border-2',
                        errors.address ? 'border-red-500' : 'border-hormadi-border'
                      )}
                    />
                    {errors.address && (
                      <p className="text-red-500 text-xs font-bold mt-2">{errors.address}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-black text-white mb-3 uppercase">Ville</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Anglet"
                        className={cn(
                          'input w-full border-2',
                          errors.city ? 'border-red-500' : 'border-hormadi-border'
                        )}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-xs font-bold mt-2">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-black text-white mb-3 uppercase">Code Postal</label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        placeholder="64600"
                        className={cn(
                          'input w-full border-2',
                          errors.zip ? 'border-red-500' : 'border-hormadi-border'
                        )}
                      />
                      {errors.zip && (
                        <p className="text-red-500 text-xs font-bold mt-2">{errors.zip}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Step 2: Shipping Options */}
                <div className="mb-12 pb-12 border-b-2 border-hormadi-border">
                  <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-hormadi-red text-white flex items-center justify-center font-black">
                      2
                    </span>
                    Mode de livraison
                  </h2>

                  <div className="space-y-3">
                    {SHIPPING_OPTIONS.map((option) => (
                      <label
                        key={option.id}
                        className="flex items-center p-4 border-2 border-hormadi-border rounded-lg cursor-pointer hover:border-hormadi-red/50 transition-all"
                      >
                        <input
                          type="radio"
                          name="shipping"
                          value={option.id}
                          checked={selectedShipping === option.id}
                          onChange={(e) => setSelectedShipping(e.target.value)}
                          className="w-4 h-4 accent-hormadi-red cursor-pointer"
                        />
                        <div className="ml-4 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Truck size={18} className="text-hormadi-red" />
                            <span className="font-bold text-white">{option.label}</span>
                          </div>
                          <p className="text-hormadi-muted text-sm">Livraison en {option.days} jours ouvrés</p>
                        </div>
                        <span className={cn(
                          'font-black text-lg',
                          option.price === 0 ? 'text-green-500' : 'text-hormadi-red'
                        )}>
                          {option.price === 0 ? 'Gratuit' : formatPrice(option.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Step 3: Payment */}
                <div className="mb-8 pb-8 border-b-2 border-hormadi-border">
                  <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-hormadi-red text-white flex items-center justify-center font-black">
                      3
                    </span>
                    Paiement simulé
                  </h2>

                  <div className="bg-hormadi-surface border-2 border-hormadi-border rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-10 bg-gradient-to-r from-hormadi-red to-hormadi-forest rounded flex items-center justify-center">
                        <span className="text-white text-xs font-black">CARD</span>
                      </div>
                      <div>
                        <p className="text-white font-bold">Paiement Test</p>
                        <p className="text-hormadi-muted text-sm">4532 •••• •••• 9865</p>
                      </div>
                    </div>
                    <p className="text-hormadi-muted text-sm">
                      Mode de paiement simulé pour les tests. Aucun paiement réel ne sera effectué. Cette commande est confirmée sans traitement de paiement.
                    </p>
                  </div>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm font-semibold flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full font-black text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      Traitement en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={24} />
                      Confirmer la commande
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="card sticky top-6 border-2 border-hormadi-border bg-hormadi-surface/50">
                <h2 className="text-2xl font-black text-hormadi-red mb-8">RÉCAPITULATIF</h2>

                {/* Items */}
                <div className="space-y-3 mb-8 pb-8 border-b-2 border-hormadi-border max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={`${item.productId}-${item.size}`}
                      className="text-sm"
                    >
                      <div className="flex justify-between mb-1">
                        <p className="text-white font-bold">{item.name}</p>
                        <span className="text-hormadi-red font-black">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                      {item.size && (
                        <p className="text-hormadi-muted text-xs">Taille: {item.size}</p>
                      )}
                      <p className="text-hormadi-muted text-xs">Quantité: {item.quantity} × {formatPrice(item.price)}</p>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="space-y-3 mb-8 pb-8 border-b-2 border-hormadi-border">
                  <div className="flex justify-between text-hormadi-muted">
                    <span className="font-semibold">Sous-total</span>
                    <span className="text-white font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-hormadi-muted">
                    <span className="font-semibold">Livraison</span>
                    <span className="font-bold">
                      {shipping === 0 ? (
                        <span className="text-green-500">Gratuite</span>
                      ) : (
                        <span className="text-white">{formatPrice(shipping)}</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div>
                  <div className="flex justify-between items-end">
                    <span className="font-black text-hormadi-muted">Total</span>
                    <span className="text-4xl font-black text-hormadi-red">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
