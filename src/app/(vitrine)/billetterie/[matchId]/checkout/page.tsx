'use client'

import Link from 'next/link'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import {
  ChevronRight, Ticket, Clock, MapPin, ArrowRight, AlertCircle,
  Loader2, Shield, Check, CreditCard, User, Mail, Phone, Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { findTeam } from '@/lib/constants'

interface MatchData {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  venue: string
  status: string
}

interface OrderItem {
  categoryId: string
  categoryName: string
  quantity: number
  unitPrice: number
  seatIds: string[]
}

function formatMatchDate(dateStr: string) {
  const date = new Date(dateStr)
  const weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  return {
    full: `${weekdays[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`,
    time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  }
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €'
}

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const matchId = params.matchId as string

  // Parse order items from URL
  const orderItems: OrderItem[] = useMemo(() => {
    try {
      return JSON.parse(searchParams.get('items') || '[]')
    } catch { return [] }
  }, [searchParams])
  const totalPrice = parseInt(searchParams.get('totalPrice') || '0')
  const totalQty = parseInt(searchParams.get('totalQty') || '0')

  const [match, setMatch] = useState<MatchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    emailConfirm: '',
    phone: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [paymentStep, setPaymentStep] = useState<'form' | 'payment' | 'processing'>('form')

  useEffect(() => {
    if (orderItems.length === 0 || !totalPrice) {
      router.push(`/billetterie/${matchId}`)
      return
    }
    async function fetchMatch() {
      try {
        const res = await fetch(`/api/matches/${matchId}`)
        if (!res.ok) throw new Error('Match introuvable')
        const data = await res.json()
        setMatch(data.match)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchMatch()
  }, [matchId, orderItems.length, totalPrice, router])

  function validateForm() {
    const errors: Record<string, string> = {}
    if (!form.firstName.trim()) errors.firstName = 'Le prénom est requis'
    if (!form.lastName.trim()) errors.lastName = 'Le nom est requis'
    if (!form.email.trim()) errors.email = 'L\'email est requis'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Email invalide'
    if (form.email !== form.emailConfirm) errors.emailConfirm = 'Les emails ne correspondent pas'
    if (!form.phone.trim()) errors.phone = 'Le téléphone est requis'
    else if (!/^(\+33|0)[0-9]{9}$/.test(form.phone.replace(/\s/g, ''))) errors.phone = 'Numéro invalide (ex: 06 12 34 56 78)'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleContinueToPayment() {
    if (validateForm()) setPaymentStep('payment')
  }

  async function handleDemoPayment() {
    setPaymentStep('processing')
    setSubmitting(true)
    setError(null)

    try {
      await new Promise((r) => setTimeout(r, 2000))

      // Create orders for each item (one per category)
      const references: string[] = []
      for (const item of orderItems) {
        const res = await fetch('/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            matchId,
            categoryId: item.categoryId,
            quantity: item.quantity,
            customerName: `${form.firstName} ${form.lastName}`,
            customerEmail: form.email,
            customerPhone: form.phone.replace(/\s/g, ''),
            seatIds: item.seatIds,
          }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Erreur lors de la commande')
        references.push(data.order.reference)
      }

      // Go to confirmation with first reference (or comma-separated)
      router.push(`/billetterie/${matchId}/confirmation?reference=${references[0]}`)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du paiement')
      setPaymentStep('payment')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="-mt-[5.5rem] pt-[5.5rem] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-hormadi-red animate-spin" />
      </div>
    )
  }

  if (!match) {
    return (
      <div className="-mt-[5.5rem] pt-[5.5rem] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-hormadi-red mx-auto mb-4" />
          <p className="text-white text-xl font-bold mb-4">Match introuvable</p>
          <Link href="/billetterie" className="text-hormadi-red hover:underline">Retour à la billetterie</Link>
        </div>
      </div>
    )
  }

  const awayTeam = findTeam(match.awayTeam)
  const { full: dateStr, time } = formatMatchDate(match.date)

  return (
    <div className="-mt-[5.5rem]">
      {/* ═══ Mini Hero ═══ */}
      <section className="relative h-[25vh] min-h-[200px] max-h-[280px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img src="/images/hero-billetterie.jpg" alt="Billetterie" className="absolute inset-0 z-[1] w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/70 to-hormadi-dark/40" />

        <div className="relative z-[5] h-full flex flex-col justify-end pb-6 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-3">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <Link href="/billetterie" className="hover:text-white transition-colors">Billetterie</Link>
            <ChevronRight size={14} />
            <Link href={`/billetterie/${matchId}`} className="hover:text-white transition-colors">Réservation</Link>
            <ChevronRight size={14} />
            <span className="text-white">Checkout</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                <img src="/images/teams/Anglet.png" alt="Hormadi" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-white/50 font-black text-sm">VS</span>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
                {awayTeam ? (
                  <img src={awayTeam.logo} alt={awayTeam.name} className="w-7 h-7 object-contain" />
                ) : <span className="text-xs font-bold text-gray-500">?</span>}
              </div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                ANGLET vs {awayTeam ? awayTeam.name.toUpperCase() : match.awayTeam.toUpperCase()}
              </h1>
              <p className="text-hormadi-muted text-xs">{dateStr} — {time} — {match.venue}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Content ═══ */}
      <section className="py-10 sm:py-14">
        <div className="section-padding">
          <div className="max-w-5xl mx-auto">
            {/* Step indicator */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-hormadi-ocean flex items-center justify-center text-white text-sm font-bold"><Check size={16} /></div>
                <span className="text-hormadi-ocean font-semibold text-sm hidden sm:inline">Places choisies</span>
              </div>
              <div className="flex-1 h-px bg-hormadi-ocean" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-hormadi-red flex items-center justify-center text-white text-sm font-bold">2</div>
                <span className="text-white font-semibold text-sm hidden sm:inline">Vos informations</span>
              </div>
              <div className="flex-1 h-px bg-hormadi-border" />
              <div className="flex items-center gap-2 opacity-40">
                <div className="w-8 h-8 rounded-full bg-hormadi-surface border border-hormadi-border flex items-center justify-center text-hormadi-muted text-sm font-bold">3</div>
                <span className="text-hormadi-muted font-semibold text-sm hidden sm:inline">Confirmation</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ─── Left: Form ─── */}
              <div className="lg:col-span-2">
                {paymentStep === 'form' && (
                  <>
                    <div className="border-l-4 border-hormadi-red pl-6 mb-8">
                      <h2 className="text-2xl font-black text-white">VOS INFORMATIONS</h2>
                      <p className="text-hormadi-muted text-sm mt-1">Renseignez vos coordonnées pour recevoir vos billets</p>
                    </div>

                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-white text-sm font-semibold mb-2"><User size={14} className="inline mr-1" />Prénom *</label>
                          <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                            className={cn('w-full px-4 py-3 rounded-lg bg-hormadi-surface border text-white placeholder:text-hormadi-muted/50 focus:outline-none focus:ring-2 focus:ring-hormadi-red/50', formErrors.firstName ? 'border-hormadi-red' : 'border-hormadi-border')}
                            placeholder="Jean" />
                          {formErrors.firstName && <p className="text-hormadi-red text-xs mt-1">{formErrors.firstName}</p>}
                        </div>
                        <div>
                          <label className="block text-white text-sm font-semibold mb-2"><User size={14} className="inline mr-1" />Nom *</label>
                          <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                            className={cn('w-full px-4 py-3 rounded-lg bg-hormadi-surface border text-white placeholder:text-hormadi-muted/50 focus:outline-none focus:ring-2 focus:ring-hormadi-red/50', formErrors.lastName ? 'border-hormadi-red' : 'border-hormadi-border')}
                            placeholder="Dupont" />
                          {formErrors.lastName && <p className="text-hormadi-red text-xs mt-1">{formErrors.lastName}</p>}
                        </div>
                      </div>
                      <div>
                        <label className="block text-white text-sm font-semibold mb-2"><Mail size={14} className="inline mr-1" />Email *</label>
                        <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={cn('w-full px-4 py-3 rounded-lg bg-hormadi-surface border text-white placeholder:text-hormadi-muted/50 focus:outline-none focus:ring-2 focus:ring-hormadi-red/50', formErrors.email ? 'border-hormadi-red' : 'border-hormadi-border')}
                          placeholder="jean.dupont@email.com" />
                        {formErrors.email && <p className="text-hormadi-red text-xs mt-1">{formErrors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-white text-sm font-semibold mb-2"><Mail size={14} className="inline mr-1" />Confirmer l&apos;email *</label>
                        <input type="email" value={form.emailConfirm} onChange={(e) => setForm({ ...form, emailConfirm: e.target.value })}
                          className={cn('w-full px-4 py-3 rounded-lg bg-hormadi-surface border text-white placeholder:text-hormadi-muted/50 focus:outline-none focus:ring-2 focus:ring-hormadi-red/50', formErrors.emailConfirm ? 'border-hormadi-red' : 'border-hormadi-border')}
                          placeholder="jean.dupont@email.com" />
                        {formErrors.emailConfirm && <p className="text-hormadi-red text-xs mt-1">{formErrors.emailConfirm}</p>}
                      </div>
                      <div>
                        <label className="block text-white text-sm font-semibold mb-2"><Phone size={14} className="inline mr-1" />Téléphone *</label>
                        <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className={cn('w-full px-4 py-3 rounded-lg bg-hormadi-surface border text-white placeholder:text-hormadi-muted/50 focus:outline-none focus:ring-2 focus:ring-hormadi-red/50', formErrors.phone ? 'border-hormadi-red' : 'border-hormadi-border')}
                          placeholder="06 12 34 56 78" />
                        {formErrors.phone && <p className="text-hormadi-red text-xs mt-1">{formErrors.phone}</p>}
                      </div>
                      <p className="text-hormadi-muted/60 text-xs">* Vos billets seront envoyés à l&apos;adresse email indiquée.</p>
                      <button onClick={handleContinueToPayment}
                        className="w-full flex items-center justify-center gap-2 bg-hormadi-red text-white font-bold py-4 rounded-xl hover:bg-hormadi-red/80 transition-colors shadow-lg shadow-hormadi-red/30 text-lg mt-4">
                        Continuer vers le paiement <ArrowRight size={20} />
                      </button>
                    </div>
                  </>
                )}

                {paymentStep === 'payment' && (
                  <>
                    <div className="border-l-4 border-hormadi-red pl-6 mb-8">
                      <h2 className="text-2xl font-black text-white">PAIEMENT</h2>
                      <p className="text-hormadi-muted text-sm mt-1">Mode démo — Aucun paiement réel</p>
                    </div>
                    {error && (
                      <div className="bg-hormadi-red/10 border border-hormadi-red/30 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <AlertCircle size={20} className="text-hormadi-red flex-shrink-0 mt-0.5" />
                        <p className="text-hormadi-red text-sm">{error}</p>
                      </div>
                    )}
                    <div className="bg-hormadi-surface/80 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-6">
                      <div className="flex items-center gap-3 mb-6">
                        <CreditCard size={24} className="text-hormadi-ocean" />
                        <span className="text-white font-bold">Carte bancaire (démo)</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-hormadi-muted text-xs mb-1">Numéro de carte</label>
                          <div className="w-full px-4 py-3 rounded-lg bg-hormadi-surface border border-hormadi-border text-hormadi-muted">4242 4242 4242 4242</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-hormadi-muted text-xs mb-1">Expiration</label>
                            <div className="w-full px-4 py-3 rounded-lg bg-hormadi-surface border border-hormadi-border text-hormadi-muted">12/28</div>
                          </div>
                          <div>
                            <label className="block text-hormadi-muted text-xs mb-1">CVC</label>
                            <div className="w-full px-4 py-3 rounded-lg bg-hormadi-surface border border-hormadi-border text-hormadi-muted">123</div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-3 bg-hormadi-ocean/10 border border-hormadi-ocean/30 rounded-lg">
                        <p className="text-hormadi-ocean text-xs font-semibold flex items-center gap-1"><Shield size={14} />Mode démonstration — Aucun prélèvement réel</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setPaymentStep('form')}
                        className="flex-1 flex items-center justify-center gap-2 bg-hormadi-surface border border-hormadi-border text-white font-bold py-4 rounded-xl hover:border-hormadi-red/50 transition-colors">
                        <ArrowRight size={16} className="rotate-180" /> Retour
                      </button>
                      <button onClick={handleDemoPayment} disabled={submitting}
                        className="flex-[2] flex items-center justify-center gap-2 bg-hormadi-red text-white font-bold py-4 rounded-xl hover:bg-hormadi-red/80 transition-colors shadow-lg shadow-hormadi-red/30 text-lg disabled:opacity-50">
                        {submitting ? <><Loader2 size={20} className="animate-spin" />Traitement...</> : <><Lock size={18} />Payer {formatPrice(totalPrice)}</>}
                      </button>
                    </div>
                  </>
                )}

                {paymentStep === 'processing' && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 size={48} className="text-hormadi-red animate-spin mb-6" />
                    <h2 className="text-xl font-black text-white mb-2">Traitement du paiement...</h2>
                    <p className="text-hormadi-muted text-sm">Veuillez patienter, ne fermez pas cette page.</p>
                  </div>
                )}
              </div>

              {/* ─── Right: Order Summary ─── */}
              <div className="lg:col-span-1">
                <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sticky top-28">
                  <h3 className="text-white font-black text-lg mb-4">Récapitulatif</h3>

                  <div className="pb-4 mb-4 border-b border-hormadi-border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <img src="/images/teams/Anglet.png" alt="Hormadi" className="w-5 h-5 object-contain" />
                      </div>
                      <span className="text-white/40 font-black text-xs">VS</span>
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        {awayTeam ? <img src={awayTeam.logo} alt={awayTeam.name} className="w-5 h-5 object-contain" /> : <span className="text-[8px] font-bold text-gray-500">?</span>}
                      </div>
                    </div>
                    <p className="text-white font-bold text-sm">Anglet vs {awayTeam ? awayTeam.name : match.awayTeam}</p>
                    <p className="text-hormadi-muted text-xs mt-0.5">{dateStr} — {time}</p>
                  </div>

                  <div className="space-y-3 pb-4 mb-4 border-b border-hormadi-border">
                    {orderItems.map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-white font-semibold text-sm">{item.categoryName}</p>
                            <p className="text-hormadi-muted text-xs">{item.quantity} place{item.quantity > 1 ? 's' : ''}</p>
                          </div>
                          <p className="text-white font-bold text-sm">{formatPrice(item.quantity * item.unitPrice)}</p>
                        </div>
                        {item.seatIds.length > 0 && (
                          <p className="text-hormadi-muted/50 text-[10px] mt-0.5">
                            Sièges: {item.seatIds.map((id) => id.split('-').slice(1).join('-')).join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white font-black text-lg">TOTAL</span>
                    <span className="text-2xl font-black text-hormadi-red">{formatPrice(totalPrice)}</span>
                  </div>

                  <div className="mt-6 pt-4 border-t border-hormadi-border space-y-2">
                    <p className="text-hormadi-muted/60 text-xs flex items-center gap-1"><Shield size={12} />Paiement sécurisé SSL</p>
                    <p className="text-hormadi-muted/60 text-xs flex items-center gap-1"><Ticket size={12} />E-billet par email</p>
                    <p className="text-hormadi-muted/60 text-xs flex items-center gap-1"><Check size={12} />QR code de validation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
