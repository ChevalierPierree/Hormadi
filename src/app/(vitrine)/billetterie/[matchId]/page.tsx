'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import {
  ChevronRight, Ticket, Clock, MapPin, ArrowRight, AlertCircle,
  Loader2, Shield, Check, X, Users, ExternalLink
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { findTeam, SULF_BILLETTERIE_URL } from '@/lib/constants'
import PatinaireSeatMap, { ZoneConfig } from '@/components/PatinaireSeatMap'

interface TicketCategory {
  id: string
  name: string
  price: number
  capacity: number
  sold: number
  available: number
}

interface MatchData {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  venue: string
  status: string
  isHomeGame: boolean
  competition: string
  ticketCategories: TicketCategory[]
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

// Map DB category names to zone IDs (supports both naming schemes)
const CATEGORY_TO_ZONE: Record<string, string> = {
  // New naming scheme
  'Tribune Propp': 'propp',
  'Catégorie 1': 'cat1',
  'Catégorie 2 Gauche': 'cat2_left',
  'Catégorie 2 Droite': 'cat2_right',
  'Catégorie 3 Gauche': 'cat3_left',
  'Catégorie 3 Droite': 'cat3_right',
  'Debout Gauche': 'debout_left',
  'Debout Droite': 'debout_right',
  // Legacy naming scheme (from seed)
  'Tribune Est': 'cat2_right',
  'Tribune Ouest': 'cat2_left',
  'Virage Nord': 'cat3_left',
  'Virage Sud': 'cat3_right',
  'Espace VIP': 'propp',
}

export default function TicketSelectionPage() {
  const params = useParams()
  const matchId = params.matchId as string

  const [match, setMatch] = useState<MatchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Seat selection state
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [standingSelections, setStandingSelections] = useState<Record<string, number>>({})
  // Track which zone each selected seat belongs to
  const [seatZones, setSeatZones] = useState<Record<string, string>>({}) // seatId -> zone.id

  useEffect(() => {
    async function fetchMatch() {
      try {
        const res = await fetch(`/api/matches/${matchId}`)
        if (!res.ok) throw new Error('Match introuvable')
        const data = await res.json()
        setMatch(data.match)
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }
    fetchMatch()
  }, [matchId])

  // Build zone configs from match ticket categories
  const zones: ZoneConfig[] = useMemo(() => {
    if (!match) return []
    console.log('[Billetterie] ticketCategories:', match.ticketCategories?.map(tc => tc.name))
    const mapped = match.ticketCategories
      .filter((tc) => {
        const mapped = CATEGORY_TO_ZONE[tc.name]
        if (!mapped) console.warn(`[Billetterie] Category "${tc.name}" has no zone mapping`)
        return !!mapped
      })
      .map((tc) => ({
        id: CATEGORY_TO_ZONE[tc.name],
        name: tc.name,
        categoryId: tc.id,
        price: tc.price,
        color: '',
        type: tc.name.startsWith('Debout') ? 'standing' as const : 'seated' as const,
        capacity: tc.available,
      }))
    console.log('[Billetterie] Zones mapped:', mapped.map(z => `${z.id} (${z.name})`))
    return mapped
  }, [match])

  // Sold seats: currently no real seat-level tracking, so this is empty
  // When a real ticketing system is integrated, this would fetch actual sold seat IDs
  const soldSeats = useMemo(() => new Set<string>(), [])

  const handleSeatClick = (seatId: string, zone: ZoneConfig) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        // Deselect
        setSeatZones((z) => {
          const next = { ...z }
          delete next[seatId]
          return next
        })
        return prev.filter((id) => id !== seatId)
      }
      // Check max
      const totalStanding = Object.values(standingSelections).reduce((a, b) => a + b, 0)
      if (prev.length + totalStanding >= 10) return prev
      // Select
      setSeatZones((z) => ({ ...z, [seatId]: zone.id }))
      return [...prev, seatId]
    })
  }

  const handleStandingChange = (zoneId: string, quantity: number) => {
    setStandingSelections((prev) => ({ ...prev, [zoneId]: quantity }))
  }

  // Compute order summary
  const orderSummary = useMemo(() => {
    const items: { zoneName: string; categoryId: string; zoneId: string; quantity: number; unitPrice: number; seatIds: string[] }[] = []

    // Group selected seats by zone
    const seatsByZone: Record<string, string[]> = {}
    selectedSeats.forEach((seatId) => {
      const zoneId = seatZones[seatId]
      if (zoneId) {
        if (!seatsByZone[zoneId]) seatsByZone[zoneId] = []
        seatsByZone[zoneId].push(seatId)
      }
    })

    // Create items for seated zones
    Object.entries(seatsByZone).forEach(([zoneId, seats]) => {
      const zone = zones.find((z) => z.id === zoneId)
      if (zone) {
        items.push({
          zoneName: zone.name,
          categoryId: zone.categoryId,
          zoneId,
          quantity: seats.length,
          unitPrice: zone.price,
          seatIds: seats,
        })
      }
    })

    // Create items for standing zones
    Object.entries(standingSelections).forEach(([zoneId, qty]) => {
      if (qty <= 0) return
      const zone = zones.find((z) => z.id === zoneId)
      if (zone) {
        items.push({
          zoneName: zone.name,
          categoryId: zone.categoryId,
          zoneId,
          quantity: qty,
          unitPrice: zone.price,
          seatIds: [],
        })
      }
    })

    const total = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0)
    return { items, total, totalQty }
  }, [selectedSeats, seatZones, standingSelections, zones])

  function handleContinue() {
    // La billetterie réelle est opérée par SULF (pas d'API/lien par match disponible) —
    // on affiche les tarifs par zone pour info, puis on renvoie vers la billetterie officielle.
    window.open(SULF_BILLETTERIE_URL, '_blank', 'noopener,noreferrer')
  }

  if (loading) {
    return (
      <div className="-mt-[5.5rem] pt-[5.5rem] min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-hormadi-red animate-spin" />
        <span className="ml-3 text-hormadi-muted">Chargement du match...</span>
      </div>
    )
  }

  if (error || !match) {
    return (
      <div className="-mt-[5.5rem] pt-[5.5rem] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={48} className="text-hormadi-red mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-2">Match introuvable</h1>
          <p className="text-hormadi-muted mb-6">{error}</p>
          <Link
            href="/billetterie"
            className="inline-flex items-center gap-2 bg-hormadi-red text-white font-bold px-6 py-3 rounded-xl hover:bg-hormadi-red/80 transition-colors"
          >
            <ArrowRight size={16} className="rotate-180" />
            Retour à la billetterie
          </Link>
        </div>
      </div>
    )
  }

  // Block ticket sales for past matches
  const matchDate = new Date(match.date)
  const isPastMatch = matchDate.getTime() < Date.now()

  if (isPastMatch) {
    return (
      <div className="-mt-[5.5rem] pt-[5.5rem] min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Clock size={48} className="text-hormadi-muted mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-2">Match terminé</h1>
          <p className="text-hormadi-muted mb-6">
            Ce match a déjà eu lieu le {matchDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}. La réservation de billets n&apos;est plus possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/billetterie"
              className="inline-flex items-center gap-2 bg-hormadi-red text-white font-bold px-6 py-3 rounded-xl hover:bg-hormadi-red/80 transition-colors"
            >
              <Ticket size={16} />
              Voir les prochains matchs
            </Link>
            <Link
              href="/calendrier"
              className="inline-flex items-center gap-2 bg-hormadi-surface border border-hormadi-border text-white font-bold px-6 py-3 rounded-xl hover:border-hormadi-red/50 transition-colors"
            >
              Calendrier & Résultats
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const awayTeam = findTeam(match.awayTeam)
  const { full: dateStr, time } = formatMatchDate(match.date)

  return (
    <div className="-mt-[5.5rem]">
      {/* ═══════════════════ HERO COMPACT ═══════════════════ */}
      <section className="relative h-[30vh] min-h-[250px] max-h-[350px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/hero-billetterie.jpg"
          alt="Billetterie"
          className="absolute inset-0 z-[1] w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/60 to-hormadi-dark/30" />

        <div className="relative z-[5] h-full flex flex-col justify-end pb-8 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <Link href="/billetterie" className="hover:text-white transition-colors">Billetterie</Link>
            <ChevronRight size={14} />
            <span className="text-white">Réservation</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                <img src="/images/teams/Anglet.png" alt="Hormadi" className="w-10 h-10 sm:w-11 sm:h-11 object-contain" />
              </div>
              <span className="text-white/50 font-black text-xl">VS</span>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                {awayTeam ? (
                  <img src={awayTeam.logo} alt={awayTeam.name} className="w-10 h-10 sm:w-11 sm:h-11 object-contain" />
                ) : (
                  <span className="text-sm font-bold text-gray-500">?</span>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                ANGLET vs {awayTeam ? awayTeam.name.toUpperCase() : match.awayTeam.toUpperCase()}
              </h1>
              <div className="flex items-center gap-4 text-hormadi-muted text-sm mt-1">
                <span className="flex items-center gap-1"><Clock size={14} />{dateStr} — {time}</span>
                <span className="flex items-center gap-1"><MapPin size={14} />{match.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SEAT SELECTION ═══════════════════ */}
      <section className="py-10 sm:py-14">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            {/* Step indicator */}
            <div className="flex items-center gap-4 mb-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-hormadi-red flex items-center justify-center text-white text-sm font-bold">1</div>
                <span className="text-white font-semibold text-sm hidden sm:inline">Choisir vos places</span>
              </div>
              <div className="flex-1 h-px bg-hormadi-border" />
              <div className="flex items-center gap-2 opacity-40">
                <div className="w-8 h-8 rounded-full bg-hormadi-surface border border-hormadi-border flex items-center justify-center text-hormadi-muted text-sm font-bold">2</div>
                <span className="text-hormadi-muted font-semibold text-sm hidden sm:inline">Vos informations</span>
              </div>
              <div className="flex-1 h-px bg-hormadi-border" />
              <div className="flex items-center gap-2 opacity-40">
                <div className="w-8 h-8 rounded-full bg-hormadi-surface border border-hormadi-border flex items-center justify-center text-hormadi-muted text-sm font-bold">3</div>
                <span className="text-hormadi-muted font-semibold text-sm hidden sm:inline">Confirmation</span>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* ─── Left: Seat map ─── */}
              <div className="xl:col-span-3">
                <div className="border-l-4 border-hormadi-red pl-6 mb-6">
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    CHOISISSEZ VOS PLACES
                  </h2>
                  <p className="text-hormadi-muted text-sm mt-1">
                    Cliquez sur les sièges pour les sélectionner (10 places max) — Zones debout : choisissez la quantité ci-dessous
                  </p>
                </div>

                {zones.length === 0 && match ? (
                  <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl p-8 text-center">
                    <AlertCircle size={40} className="text-[#f59e0b] mx-auto mb-4" />
                    <h3 className="text-white font-bold text-lg mb-2">Billetterie non disponible</h3>
                    <p className="text-hormadi-muted text-sm">
                      La vente de billets n'est pas encore ouverte pour ce match.
                      {match.ticketCategories?.length === 0
                        ? ' Aucune catégorie de billet n\'a été configurée.'
                        : ` Catégories trouvées : ${match.ticketCategories.map(tc => tc.name).join(', ')}`}
                    </p>
                  </div>
                ) : (
                  <PatinaireSeatMap
                    zones={zones}
                    soldSeats={soldSeats}
                    selectedSeats={selectedSeats}
                    standingSelections={standingSelections}
                    onSeatClick={handleSeatClick}
                    onStandingChange={handleStandingChange}
                    maxSeats={10}
                  />
                )}
              </div>

              {/* ─── Right: Order summary sidebar ─── */}
              <div className="xl:col-span-1">
                <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-5 sticky top-28">
                  <h3 className="text-white font-black text-lg mb-4 flex items-center gap-2">
                    <Ticket size={18} className="text-hormadi-red" />
                    Votre sélection
                  </h3>

                  {orderSummary.totalQty === 0 ? (
                    <div className="text-center py-8">
                      <Users size={32} className="text-hormadi-muted/40 mx-auto mb-3" />
                      <p className="text-hormadi-muted text-sm">Aucune place sélectionnée</p>
                      <p className="text-hormadi-muted/60 text-xs mt-1">Cliquez sur un siège ou ajoutez des places debout</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 mb-4">
                        {orderSummary.items.map((item, i) => (
                          <div key={i} className="bg-hormadi-dark/50 rounded-lg p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-white font-semibold text-sm">{item.zoneName}</p>
                                <p className="text-hormadi-muted text-xs">
                                  {item.quantity} place{item.quantity > 1 ? 's' : ''} × {formatPrice(item.unitPrice)}
                                </p>
                                {item.seatIds.length > 0 && (
                                  <p className="text-hormadi-muted/60 text-[10px] mt-1">
                                    {item.seatIds.map((id) => {
                                      const parts = id.split('-')
                                      return `R${parts[1]?.replace('R', '')}S${parts[2]?.replace('S', '')}`
                                    }).join(', ')}
                                  </p>
                                )}
                              </div>
                              <p className="text-white font-bold text-sm whitespace-nowrap">
                                {formatPrice(item.quantity * item.unitPrice)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Totals */}
                      <div className="pt-4 border-t border-hormadi-border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-hormadi-muted text-sm">
                            {orderSummary.totalQty} place{orderSummary.totalQty > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white font-black text-lg">TOTAL</span>
                          <span className="text-2xl font-black text-hormadi-red">{formatPrice(orderSummary.total)}</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Continue button — redirige vers la billetterie officielle (SULF) */}
                  <button
                    onClick={handleContinue}
                    disabled={orderSummary.totalQty === 0}
                    className={cn(
                      'w-full mt-6 flex items-center justify-center gap-2 font-bold py-3.5 rounded-xl transition-all',
                      orderSummary.totalQty > 0
                        ? 'bg-hormadi-red text-white hover:bg-hormadi-red/80 shadow-lg shadow-hormadi-red/30'
                        : 'bg-hormadi-surface border border-hormadi-border text-hormadi-muted cursor-not-allowed'
                    )}
                  >
                    Acheter sur la billetterie officielle
                    <ExternalLink size={18} />
                  </button>
                  <p className="text-hormadi-muted text-xs text-center mt-3">
                    Vous serez redirigé vers notre partenaire billetterie pour finaliser votre achat.
                  </p>

                  {/* Clear selection */}
                  {orderSummary.totalQty > 0 && (
                    <button
                      onClick={() => {
                        setSelectedSeats([])
                        setSeatZones({})
                        setStandingSelections({})
                      }}
                      className="w-full mt-2 text-hormadi-muted hover:text-hormadi-red text-xs font-semibold flex items-center justify-center gap-1 py-2 transition-colors"
                    >
                      <X size={12} />
                      Tout désélectionner
                    </button>
                  )}

                  {/* Trust badges */}
                  <div className="mt-6 pt-4 border-t border-hormadi-border space-y-2">
                    <p className="text-hormadi-muted/60 text-xs flex items-center gap-1"><Shield size={12} />Paiement sécurisé</p>
                    <p className="text-hormadi-muted/60 text-xs flex items-center gap-1"><Ticket size={12} />E-billet immédiat</p>
                    <p className="text-hormadi-muted/60 text-xs flex items-center gap-1"><Check size={12} />Confirmation par email</p>
                  </div>

                  {/* Hospitalités link */}
                  <div className="mt-4 p-3 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-lg">
                    <p className="text-[#f59e0b] text-xs font-semibold mb-1">Vous cherchez les Loges VIP ?</p>
                    <Link href="/hospitalites" className="text-[#f59e0b]/80 text-xs hover:text-[#f59e0b] transition-colors flex items-center gap-1">
                      Découvrir nos offres Hospitalités
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Back link */}
            <div className="mt-8">
              <Link
                href="/billetterie"
                className="text-hormadi-muted hover:text-white transition-colors text-sm font-semibold flex items-center gap-2"
              >
                <ArrowRight size={14} className="rotate-180" />
                Retour à la billetterie
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
