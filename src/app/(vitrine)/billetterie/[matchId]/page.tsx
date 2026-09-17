'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  ChevronRight, Ticket, Clock, MapPin, ArrowRight, AlertCircle,
  Loader2, Shield, Check, ExternalLink, Tag,
} from 'lucide-react'
import { findTeam, SULF_MATCHES_URL } from '@/lib/constants'

interface MatchData {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  venue: string
  status: string
  isHomeGame: boolean
  competition: string
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

export default function TicketSelectionPage() {
  const params = useParams()
  const matchId = params.matchId as string

  const [match, setMatch] = useState<MatchData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const opponentName = match.isHomeGame ? match.awayTeam : match.homeTeam
  const opponent = findTeam(opponentName)
  const { full: dateStr, time } = formatMatchDate(match.date)

  return (
    <main className="min-h-screen bg-hormadi-dark">
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

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                {match.isHomeGame ? (
                  <img src="/images/teams/Anglet.png" alt="Hormadi" className="w-10 h-10 sm:w-11 sm:h-11 object-contain" />
                ) : opponent ? (
                  <img src={opponent.logo} alt={opponent.name} className="w-10 h-10 sm:w-11 sm:h-11 object-contain" />
                ) : (
                  <span className="text-sm font-bold text-gray-500">?</span>
                )}
              </div>
              <span className="text-white/50 font-black text-xl">VS</span>
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-lg">
                {match.isHomeGame ? (
                  opponent ? (
                    <img src={opponent.logo} alt={opponent.name} className="w-10 h-10 sm:w-11 sm:h-11 object-contain" />
                  ) : (
                    <span className="text-sm font-bold text-gray-500">?</span>
                  )
                ) : (
                  <img src="/images/teams/Anglet.png" alt="Hormadi" className="w-10 h-10 sm:w-11 sm:h-11 object-contain" />
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {match.isHomeGame ? 'ANGLET' : (opponent ? opponent.name.toUpperCase() : opponentName.toUpperCase())}
                {' vs '}
                {match.isHomeGame ? (opponent ? opponent.name.toUpperCase() : opponentName.toUpperCase()) : 'ANGLET'}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-hormadi-muted text-sm mt-1">
                <span className="flex items-center gap-1"><Clock size={14} />{dateStr} — {time}</span>
                <span className="flex items-center gap-1"><MapPin size={14} />{match.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ACHAT DE BILLETS ═══════════════════ */}
      <section className="py-12 sm:py-16">
        <div className="section-padding">
          <div className="max-w-3xl mx-auto">
            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-2xl p-8 sm:p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-hormadi-red/10 flex items-center justify-center mx-auto mb-6">
                <Ticket size={28} className="text-hormadi-red" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                Vos billets pour ce match
              </h2>
              <p className="text-hormadi-muted text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
                La billetterie de l&apos;Hormadi Anglet est intégralement gérée par notre partenaire{' '}
                <strong className="text-white">Sulf</strong>. Cliquez ci-dessous pour retrouver{' '}
                <strong className="text-white">
                  {match.isHomeGame ? 'Anglet' : (opponent ? opponent.name : opponentName)}
                  {' vs '}
                  {match.isHomeGame ? (opponent ? opponent.name : opponentName) : 'Anglet'}
                </strong> et
                finaliser votre achat en toute sécurité.
              </p>

              <a
                href={SULF_MATCHES_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-hormadi-red text-white font-bold px-8 py-4 rounded-xl hover:bg-hormadi-red/80 transition-all shadow-lg shadow-hormadi-red/30 text-sm sm:text-base uppercase tracking-wide"
              >
                Acheter mes billets sur Sulf
                <ExternalLink size={18} />
              </a>

              <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-hormadi-border">
                <p className="text-hormadi-muted/70 text-xs flex items-center gap-1.5"><Shield size={14} />Paiement sécurisé</p>
                <p className="text-hormadi-muted/70 text-xs flex items-center gap-1.5"><Ticket size={14} />E-billet immédiat</p>
                <p className="text-hormadi-muted/70 text-xs flex items-center gap-1.5"><Check size={14} />Confirmation par email</p>
              </div>
            </div>

            {/* Tarifs + Hospitalités links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <Link
                href="/billetterie#tarifs"
                className="flex items-center gap-3 p-5 bg-hormadi-surface/50 border border-hormadi-border rounded-xl hover:border-hormadi-red/40 transition-colors"
              >
                <Tag size={20} className="text-hormadi-red flex-shrink-0" />
                <div>
                  <p className="text-white font-semibold text-sm">Voir les tarifs par catégorie</p>
                  <p className="text-hormadi-muted text-xs">Tribune Propp, catégories 1 à 3, debout</p>
                </div>
              </Link>
              <Link
                href="/hospitalites"
                className="flex items-center gap-3 p-5 bg-[#f59e0b]/10 border border-[#f59e0b]/30 rounded-xl hover:border-[#f59e0b]/60 transition-colors"
              >
                <Ticket size={20} className="text-[#f59e0b] flex-shrink-0" />
                <div>
                  <p className="text-[#f59e0b] font-semibold text-sm">Vous cherchez les Loges VIP ?</p>
                  <p className="text-[#f59e0b]/70 text-xs">Découvrir nos offres Hospitalités</p>
                </div>
              </Link>
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
    </main>
  )
}
