'use client'

import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  ChevronRight, Ticket, Clock, MapPin, ArrowRight, AlertCircle,
  Loader2, Check, Download, Mail, QrCode, PartyPopper, Home, Calendar
} from 'lucide-react'
import { findTeam } from '@/lib/constants'

interface OrderData {
  id: string
  reference: string
  matchId: string
  matchDate: string
  homeTeam: string
  awayTeam: string
  venue: string
  categoryName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  customerName: string
  customerEmail: string
  customerPhone: string
  status: string
  createdAt: string
}

function formatMatchDate(dateStr: string) {
  const date = new Date(dateStr)
  const weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  return {
    full: `${weekdays[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`,
    time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
  }
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(2).replace('.', ',') + ' €'
}

function QRCodeSVG({ data, size = 200 }: { data: string; size?: number }) {
  // Simple QR code placeholder using an external API image
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}&bgcolor=012e24&color=ffffff&format=svg`

  return (
    <div className="relative">
      <img
        src={qrUrl}
        alt="QR Code billet"
        width={size}
        height={size}
        className="rounded-lg"
        onError={(e) => {
          // Fallback: show a styled placeholder if API fails
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            const fallback = document.createElement('div')
            fallback.className = 'flex flex-col items-center justify-center bg-hormadi-surface border-2 border-dashed border-hormadi-border rounded-lg'
            fallback.style.width = `${size}px`
            fallback.style.height = `${size}px`
            fallback.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#009681" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3"/><path d="M21 21v.01"/><path d="M12 7v3a2 2 0 0 1-2 2H7"/><path d="M3 12h.01"/><path d="M12 3h.01"/><path d="M12 16v.01"/><path d="M16 12h1"/><path d="M21 12v.01"/><path d="M12 21v-1"/></svg><p style="color:#009681;font-size:11px;margin-top:8px;font-weight:600">QR Code</p><p style="color:#6b9e95;font-size:10px">${data.slice(0, 20)}</p>`
            parent.appendChild(fallback)
          }
        }}
      />
    </div>
  )
}

export default function ConfirmationPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const matchId = params.matchId as string
  const reference = searchParams.get('reference') || ''

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!reference) {
      setError('Référence de commande manquante')
      setLoading(false)
      return
    }
    async function fetchOrder() {
      try {
        const res = await fetch(`/api/tickets?reference=${encodeURIComponent(reference)}`)
        if (!res.ok) throw new Error('Commande introuvable')
        const data = await res.json()
        setOrder(data.order)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [reference])

  if (loading) {
    return (
      <div className="-mt-[5.5rem] pt-[5.5rem] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-hormadi-red animate-spin" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="-mt-[5.5rem] pt-[5.5rem] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-hormadi-red mx-auto mb-4" />
          <p className="text-white text-xl font-bold mb-2">Commande introuvable</p>
          <p className="text-hormadi-muted mb-6">{error}</p>
          <Link href="/billetterie" className="text-hormadi-red hover:underline">Retour à la billetterie</Link>
        </div>
      </div>
    )
  }

  const awayTeam = findTeam(order.awayTeam)
  const { full: dateStr, time } = formatMatchDate(order.matchDate)
  const qrData = `HORMADI-TICKET|${order.reference}|${order.matchId}|${order.categoryName}|${order.quantity}|${order.customerName}`

  return (
    <div className="-mt-[5.5rem]">
      {/* ═══ Hero / Success banner ═══ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/hero-billetterie.jpg"
          alt=""
          className="absolute inset-0 z-[1] w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/60 to-hormadi-dark/30" />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_50%_50%,rgba(0,150,129,0.15),transparent_70%)]" />

        <div className="relative z-[5] pt-[7rem] pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-8">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <Link href="/billetterie" className="hover:text-white transition-colors">Billetterie</Link>
            <ChevronRight size={14} />
            <span className="text-white">Confirmation</span>
          </div>

          {/* Success animation */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-hormadi-ocean/20 flex items-center justify-center mx-auto mb-5 animate-bounce">
              <div className="w-14 h-14 rounded-full bg-hormadi-ocean flex items-center justify-center">
                <Check size={32} className="text-white" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
              RÉSERVATION CONFIRMÉE !
            </h1>
            <p className="text-hormadi-muted text-lg max-w-md mx-auto">
              Vos billets ont été envoyés à <span className="text-hormadi-ocean font-semibold">{order.customerEmail}</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Ticket Card ═══ */}
      <section className="py-10 sm:py-14">
        <div className="section-padding">
          <div className="max-w-2xl mx-auto">
            {/* E-Ticket card */}
            <div className="bg-hormadi-surface/80 border border-hormadi-border rounded-2xl overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-hormadi-red px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ticket size={22} className="text-white" />
                  <span className="text-white font-black text-lg">E-BILLET HORMADI</span>
                </div>
                <span className="text-white/80 text-xs font-mono">{order.reference}</span>
              </div>

              <div className="p-6 sm:p-8">
                {/* Match info */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md">
                      <img src="/images/teams/Anglet.png" alt="Hormadi" className="w-10 h-10 object-contain" />
                    </div>
                    <span className="text-white/40 font-black text-lg">VS</span>
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md">
                      {awayTeam ? (
                        <img src={awayTeam.logo} alt={awayTeam.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <span className="text-sm font-bold text-gray-500">?</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-white">
                      Anglet vs {awayTeam ? awayTeam.name : order.awayTeam}
                    </h2>
                    <p className="text-hormadi-muted text-sm">Ligue Magnus — Saison 2025-2026</p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-hormadi-dark/50 rounded-lg p-4">
                    <p className="text-hormadi-muted text-xs uppercase tracking-wider mb-1">Date</p>
                    <p className="text-white font-bold text-sm flex items-center gap-1">
                      <Calendar size={14} className="text-hormadi-ocean" />
                      {dateStr}
                    </p>
                  </div>
                  <div className="bg-hormadi-dark/50 rounded-lg p-4">
                    <p className="text-hormadi-muted text-xs uppercase tracking-wider mb-1">Heure</p>
                    <p className="text-white font-bold text-sm flex items-center gap-1">
                      <Clock size={14} className="text-hormadi-ocean" />
                      {time}
                    </p>
                  </div>
                  <div className="bg-hormadi-dark/50 rounded-lg p-4">
                    <p className="text-hormadi-muted text-xs uppercase tracking-wider mb-1">Lieu</p>
                    <p className="text-white font-bold text-sm flex items-center gap-1">
                      <MapPin size={14} className="text-hormadi-ocean" />
                      {order.venue}
                    </p>
                  </div>
                  <div className="bg-hormadi-dark/50 rounded-lg p-4">
                    <p className="text-hormadi-muted text-xs uppercase tracking-wider mb-1">Catégorie</p>
                    <p className="text-white font-bold text-sm flex items-center gap-1">
                      <Ticket size={14} className="text-hormadi-ocean" />
                      {order.categoryName}
                    </p>
                  </div>
                </div>

                {/* Ticket holder + quantity */}
                <div className="bg-hormadi-dark/50 rounded-lg p-4 mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-hormadi-muted text-xs uppercase tracking-wider mb-1">Titulaire</p>
                      <p className="text-white font-bold">{order.customerName}</p>
                      <p className="text-hormadi-muted text-xs">{order.customerEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-hormadi-muted text-xs uppercase tracking-wider mb-1">Places</p>
                      <p className="text-3xl font-black text-hormadi-red">{order.quantity}</p>
                    </div>
                  </div>
                </div>

                {/* Dashed separator */}
                <div className="border-t-2 border-dashed border-hormadi-border my-6 relative">
                  <div className="absolute -left-[1.75rem] -top-4 w-8 h-8 bg-hormadi-dark rounded-full" />
                  <div className="absolute -right-[1.75rem] -top-4 w-8 h-8 bg-hormadi-dark rounded-full" />
                </div>

                {/* QR Code */}
                <div className="text-center">
                  <p className="text-hormadi-muted text-xs uppercase tracking-wider mb-4">
                    Présentez ce QR code à l&apos;entrée
                  </p>
                  <div className="inline-block bg-white p-4 rounded-xl">
                    <QRCodeSVG data={qrData} size={180} />
                  </div>
                  <p className="text-hormadi-muted/60 text-xs mt-3 font-mono">{order.reference}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-hormadi-dark/50 px-6 py-4 flex items-center justify-between text-xs text-hormadi-muted/60">
                <span>Total payé : <span className="text-white font-bold">{formatPrice(order.totalPrice)}</span></span>
                <span>Hormadi Anglet — Saison 2025-2026</span>
              </div>
            </div>

            {/* Email notification */}
            <div className="mt-8 bg-hormadi-ocean/10 border border-hormadi-ocean/30 rounded-xl p-5 flex items-start gap-4">
              <Mail size={24} className="text-hormadi-ocean flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold text-sm mb-1">Confirmation envoyée par email</p>
                <p className="text-hormadi-muted text-sm">
                  Un email de confirmation avec votre QR code a été envoyé à <strong className="text-hormadi-ocean">{order.customerEmail}</strong>.
                  Pensez à vérifier vos spams si vous ne le trouvez pas.
                </p>
                <p className="text-hormadi-muted/60 text-xs mt-2">(Mode démo — Aucun email réel envoyé)</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-hormadi-surface border border-hormadi-border text-white font-bold px-6 py-3 rounded-xl hover:border-hormadi-red/50 transition-colors"
              >
                <Home size={18} />
                Retour à l&apos;accueil
              </Link>
              <Link
                href="/billetterie"
                className="inline-flex items-center gap-2 bg-hormadi-red text-white font-bold px-6 py-3 rounded-xl hover:bg-hormadi-red/80 transition-colors shadow-lg shadow-hormadi-red/30"
              >
                <Ticket size={18} />
                Acheter d&apos;autres places
              </Link>
            </div>

            {/* Reminder */}
            <div className="mt-10 text-center">
              <p className="text-hormadi-muted text-sm">
                Les portes ouvrent <strong className="text-white">1 heure avant le match</strong>.
                N&apos;oubliez pas votre billet !
              </p>
              <p className="text-hormadi-muted/60 text-xs mt-2">
                Pour toute question : <a href="mailto:contact@hormadi.fr" className="text-hormadi-ocean hover:text-hormadi-red transition-colors">contact@hormadi.fr</a>
                {' '}ou{' '}
                <a href="tel:+33559521964" className="text-hormadi-ocean hover:text-hormadi-red transition-colors">05 59 52 19 64</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
