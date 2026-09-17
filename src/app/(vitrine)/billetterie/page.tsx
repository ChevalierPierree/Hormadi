'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  ChevronRight, Ticket, MapPin, Clock, Car, Info,
  CreditCard, Phone, Mail, Shield, ArrowRight, ExternalLink, Star, Loader2
} from 'lucide-react'
import { findTeam, SULF_MATCHES_URL } from '@/lib/constants'

/* ─── Tarifs réels, saison 2026-2027 — source : grille tarifaire officielle du club.
   3 niveaux de matchs selon l'affiche (le classement par étoile de chaque match est
   publié par le club au fil de la saison, indépendamment de ce site). ─── */
const TARIFS = [
  {
    id: 'star1',
    stars: 1,
    label: 'Match 1 étoile',
    tagline: 'Pour vibrer à petit prix',
    rows: [
      { name: 'Tribune Propp', price: 26, reduit: 21 },
      { name: 'Catégorie 1', price: 26, reduit: 21 },
      { name: 'Catégorie 2', price: 20, reduit: 16 },
      { name: 'Catégorie 3', price: 15, reduit: 12 },
      { name: 'Debout', price: 11, reduit: null },
    ],
  },
  {
    id: 'star2',
    stars: 2,
    label: 'Match 2 étoiles',
    tagline: 'Les rencontres à ne pas manquer',
    rows: [
      { name: 'Tribune Propp', price: 27, reduit: 22 },
      { name: 'Catégorie 1', price: 27, reduit: 22 },
      { name: 'Catégorie 2', price: 21, reduit: 17 },
      { name: 'Catégorie 3', price: 16, reduit: 13 },
      { name: 'Debout', price: 12, reduit: null },
    ],
  },
  {
    id: 'star3',
    stars: 3,
    label: 'Match 3 étoiles',
    tagline: 'Les grandes affiches de la saison',
    rows: [
      { name: 'Tribune Propp', price: 29, reduit: 23 },
      { name: 'Catégorie 1', price: 29, reduit: 23 },
      { name: 'Catégorie 2', price: 23, reduit: 18 },
      { name: 'Catégorie 3', price: 18, reduit: 14 },
      { name: 'Debout', price: 13, reduit: null },
    ],
  },
]

interface MatchData {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  venue: string
  status: string
  isHomeGame: boolean
  competition: string
  ticketCategories: {
    id: string
    name: string
    price: number
    capacity: number
    sold: number
    available: number
  }[]
}

function formatMatchDate(dateStr: string) {
  const date = new Date(dateStr)
  const weekdays = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
  return {
    weekday: weekdays[date.getDay()],
    day: date.getDate(),
    month: months[date.getMonth()],
    time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    short: {
      weekday: weekdays[date.getDay()].slice(0, 3).toUpperCase(),
      day: String(date.getDate()),
      month: months[date.getMonth()].slice(0, 3).toUpperCase(),
    },
  }
}

export default function BilletteriePage() {
  const [matches, setMatches] = useState<MatchData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await fetch('/api/matches?status=upcoming&limit=20')
        const data = await res.json()
        const allMatches: MatchData[] = data.matches || []
        // Filter only home games
        const homeMatches = allMatches.filter((m) => m.isHomeGame)
        // Sort by date ascending
        homeMatches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        setMatches(homeMatches)
      } catch (err) {
        console.error('Failed to fetch matches:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  return (
    <main className="min-h-screen bg-hormadi-dark">
      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/hero-billetterie.jpg"
          alt="Billetterie Hormadi"
          className="absolute inset-0 z-[1] w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/50 to-hormadi-dark/20" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-hormadi-dark/70 via-transparent to-transparent" />
        <div className="absolute z-[3] top-0 right-0 w-96 h-96 bg-hormadi-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute z-[3] bottom-0 left-0 w-72 h-72 bg-hormadi-ocean/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-[5] h-full flex flex-col justify-end pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Billetterie</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
                  <Ticket size={20} className="text-hormadi-red" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
                  Saison 2026-2027
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
                BILLETTERIE
              </h1>
              <p className="text-hormadi-muted mt-3 text-base sm:text-lg max-w-lg">
                Réservez vos places pour les matchs à domicile de l&apos;Hormadi Anglet à la Patinoire de la Barre.
              </p>
            </div>

            {matches.length > 0 && (
              <Link
                href={`/billetterie/${matches[0].id}`}
                className="hidden sm:inline-flex items-center gap-2 bg-hormadi-red text-white font-bold px-6 py-3.5 rounded-xl hover:bg-hormadi-red/80 transition-colors shadow-lg shadow-hormadi-red/30 flex-shrink-0"
              >
                <Ticket size={20} />
                Acheter mes places
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PROCHAINS MATCHS ═══════════════════ */}
      <section className="py-16 sm:py-20">
        <div className="section-padding">
          <div className="border-l-4 border-hormadi-red pl-6 mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              PROCHAINS MATCHS À DOMICILE
            </h2>
            <p className="text-hormadi-muted text-sm sm:text-base mt-1">
              Patinoire de la Barre — Anglet
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-hormadi-red animate-spin" />
              <span className="ml-3 text-hormadi-muted">Chargement des matchs...</span>
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-12 text-center">
              <Ticket size={40} className="text-hormadi-muted/40 mx-auto mb-4" />
              <h3 className="text-white font-bold text-lg mb-2">Pas de match à venir</h3>
              <p className="text-hormadi-muted text-sm max-w-md mx-auto">
                Il n&apos;y a plus de match à domicile programmé pour cette saison. Retrouvez tous les résultats dans le calendrier.
              </p>
              <Link
                href="/calendrier"
                className="inline-flex items-center gap-2 text-hormadi-red hover:text-white transition-colors font-semibold text-sm mt-6"
              >
                Voir le calendrier & résultats
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => {
                const team = findTeam(match.awayTeam)
                const { short: s, time } = formatMatchDate(match.date)
                const totalAvailable = match.ticketCategories.reduce((sum, tc) => sum + (tc.capacity - tc.sold), 0)
                const almostFull = totalAvailable < 100 && totalAvailable > 0

                return (
                  <div
                    key={match.id}
                    className="group bg-hormadi-surface/50 border border-hormadi-border rounded-xl overflow-hidden hover:border-hormadi-red/40 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      {/* Date block */}
                      <div className="bg-hormadi-red w-20 sm:w-24 flex-shrink-0 flex flex-col items-center justify-center py-5 sm:py-6">
                        <span className="text-white/70 text-[10px] font-bold uppercase">{s.weekday}</span>
                        <span className="text-white text-3xl sm:text-4xl font-black leading-none">{s.day}</span>
                        <span className="text-white/70 text-[10px] font-bold uppercase">{s.month}</span>
                      </div>

                      {/* Match info */}
                      <div className="flex-1 flex items-center justify-between px-4 sm:px-8 py-4 gap-4">
                        <div className="flex items-center gap-4 sm:gap-6 flex-1">
                          {/* Hormadi */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                              <img src="/images/teams/Anglet.png" alt="Hormadi" className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                            </div>
                            <span className="text-white font-bold text-sm sm:text-base hidden sm:block">ANGLET</span>
                          </div>

                          {/* VS */}
                          <span className="text-hormadi-muted font-black text-sm">VS</span>

                          {/* Opponent */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                              {team ? (
                                <img src={team.logo} alt={team.name} className="w-7 h-7 sm:w-8 sm:h-8 object-contain" />
                              ) : (
                                <span className="text-xs font-bold text-gray-500">?</span>
                              )}
                            </div>
                            <div className="hidden sm:block">
                              <span className="text-white font-bold text-sm sm:text-base">
                                {team ? team.name.toUpperCase() : match.awayTeam.toUpperCase()}
                              </span>
                              {team && <p className="text-hormadi-muted text-xs">{team.fullName}</p>}
                            </div>
                          </div>
                        </div>

                        {/* Time + availability + CTA */}
                        <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
                          <div className="hidden md:flex flex-col items-end gap-1">
                            <div className="flex items-center gap-2 text-hormadi-muted text-sm">
                              <Clock size={14} />
                              <span>{time}</span>
                            </div>
                            {almostFull && (
                              <span className="text-hormadi-red text-xs font-bold animate-pulse">
                                Plus que {totalAvailable} places !
                              </span>
                            )}
                          </div>
                          <Link
                            href={`/billetterie/${match.id}`}
                            className="flex items-center gap-2 bg-hormadi-red text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-lg hover:bg-hormadi-red/80 transition-colors shadow-md shadow-hormadi-red/20"
                          >
                            <Ticket size={14} />
                            <span className="hidden sm:inline">Réserver</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/calendrier"
              className="inline-flex items-center gap-2 text-hormadi-muted hover:text-hormadi-red transition-colors font-semibold text-sm"
            >
              Voir le calendrier complet
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ TARIFS ═══════════════════ */}
      <section id="tarifs" className="py-16 sm:py-20 border-t border-hormadi-border scroll-mt-24">
        <div className="section-padding">
          <div className="border-l-4 border-hormadi-red pl-6 mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              TARIFS
            </h2>
            <p className="text-hormadi-muted text-sm sm:text-base mt-1">
              Place à l&apos;unité — Synerglace Ligue Magnus — Tarifs selon catégorie de match (1 à 3 étoiles)
            </p>
          </div>

          {/* Star system explanation */}
          <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-5 mb-8">
            <div className="flex items-start gap-3">
              <Star size={20} className="text-[#fbbf24] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-bold text-sm mb-1">Système par étoiles</p>
                <p className="text-hormadi-muted text-sm">
                  Les tarifs varient selon l&apos;intensité de l&apos;affiche : matchs 1 étoile (petits prix), 2 étoiles (rencontres à ne pas manquer), et 3 étoiles (grandes affiches). Le niveau de chaque match est communiqué par le club au fil de la saison — la billetterie Sulf affiche toujours le tarif exact du match choisi.
                </p>
                <p className="text-hormadi-muted/60 text-xs mt-2">
                  * Tarif réduit : - de 18 ans, étudiants, carte Synergies, handicapés, licenciés AHA, carte séniors Anglet (sur justificatif). Gratuit pour les - de 7 ans sur les genoux de l&apos;accompagnant.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TARIFS.map((tier) => (
              <div
                key={tier.id}
                className="rounded-xl border border-hormadi-border bg-hormadi-surface/50 overflow-hidden flex flex-col h-full"
              >
                <div className="bg-hormadi-dark/60 border-b border-hormadi-border px-5 py-4">
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: tier.stars }).map((_, i) => (
                      <Star key={i} size={14} className="text-[#fbbf24] fill-[#fbbf24]" />
                    ))}
                  </div>
                  <h3 className="text-white font-black">{tier.label}</h3>
                  <p className="text-hormadi-muted text-xs">{tier.tagline}</p>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {tier.rows.map((row) => (
                      <li key={row.name} className="flex items-center justify-between text-sm border-b border-hormadi-border/50 pb-2.5 last:border-0">
                        <span className="text-hormadi-muted">{row.name}</span>
                        <span className="text-right">
                          <span className="text-white font-bold">{row.price}€</span>
                          {row.reduit != null && (
                            <span className="text-hormadi-muted text-xs"> (réd. {row.reduit}€)</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={SULF_MATCHES_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-lg transition-all text-xs bg-hormadi-surface border border-hormadi-border text-white hover:border-hormadi-red/50"
                  >
                    Voir les matchs
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <p className="text-hormadi-muted text-xs text-center mt-6">
            Tarifs de la billetterie en ligne Sulf. Les loges et espaces VIP sont disponibles sur la page{' '}
            <Link href="/hospitalites" className="text-hormadi-ocean hover:text-hormadi-red transition-colors font-semibold">Hospitalités</Link>.
          </p>
        </div>
      </section>

      {/* ═══════════════════ ABONNEMENTS ═══════════════════ */}
      <section className="py-16 sm:py-20 border-t border-hormadi-border">
        <div className="section-padding">
          <div className="border-l-4 border-hormadi-red pl-6 mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              ABONNEMENTS
            </h2>
            <p className="text-hormadi-muted text-sm sm:text-base mt-1">
              Suivez l&apos;équipe toute la saison à la Patinoire de la Barre
            </p>
          </div>

          <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-2xl p-8 sm:p-10 max-w-3xl">
            <p className="text-white font-bold mb-1">Les abonnements ne se prennent pas en ligne</p>
            <p className="text-hormadi-muted text-sm leading-relaxed mb-6">
              Contrairement à la billetterie à l&apos;unité (Sulf), les abonnements saison se souscrivent
              directement au bureau du club, sur présentation d&apos;un justificatif pour les tarifs réduits.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-hormadi-red flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-semibold">Bureau de l&apos;Hormadi</p>
                  <p className="text-hormadi-muted text-sm">Patinoire de la Barre — porte côté Adour, interphone « Bureau Hormadi »</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-hormadi-red flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-semibold">Horaires d&apos;ouverture</p>
                  <p className="text-hormadi-muted text-sm">Lundi, mardi, jeudi et vendredi<br />9h30 – 12h et 14h30 – 18h00</p>
                </div>
              </div>
            </div>

            <p className="text-hormadi-muted/60 text-xs mb-6">
              * Tarif réduit : étudiant, - de 18 ans, personne en situation de handicap, carte Séniors Anglet et
              Synergies, sur présentation d&apos;un justificatif en cours de validité.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:+33559571737"
                className="flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-lg transition-all bg-hormadi-red text-white hover:bg-hormadi-red/80 shadow-lg shadow-hormadi-red/30"
              >
                <Phone size={16} />
                05 59 57 17 37
              </a>
              <a
                href="mailto:contact@hormadi.fr"
                className="flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-lg transition-all bg-hormadi-surface border border-hormadi-border text-white hover:border-hormadi-red/50"
              >
                <Mail size={16} />
                contact@hormadi.fr
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ INFOS PRATIQUES ═══════════════════ */}
      <section className="py-16 sm:py-20 border-t border-hormadi-border">
        <div className="section-padding">
          <div className="border-l-4 border-hormadi-red pl-6 mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              INFOS PRATIQUES
            </h2>
            <p className="text-hormadi-muted text-sm sm:text-base mt-1">
              Tout savoir pour votre venue à la Patinoire de la Barre
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: 'Patinoire de la Barre',
                content: '299 avenue de l\'Adour\n64600 Anglet\nCapacité : 1 200 places',
                link: { label: 'Itinéraire Google Maps', href: 'https://maps.google.com/?q=Patinoire+de+la+Barre+Anglet' },
              },
              {
                icon: Clock,
                title: 'Ouverture des portes',
                content: 'Les portes ouvrent 1h avant le coup d\'envoi.\nMatchs généralement à 20h30 en semaine et 18h00 le samedi.\nArrivez en avance pour profiter de l\'ambiance !',
              },
              {
                icon: Car,
                title: 'Accès & Parking',
                content: 'Grand parking gratuit sur place.\nBus : lignes 36 et 38 (arrêt Patinoire).\nPlaces PMR réservées à proximité de l\'entrée.',
              },
              {
                icon: CreditCard,
                title: 'Modes de paiement',
                content: 'En ligne : CB (tarifs majorés de 1€).\nSur place : CB, espèces.\nCaisse ouverte le soir du match.',
              },
              {
                icon: Shield,
                title: 'Tarifs réduits',
                content: 'Sur présentation d\'un justificatif : - de 18 ans, étudiants, personnes en situation de handicap, Carte Synergies, Carte Séniors Anglet.',
              },
              {
                icon: Info,
                title: 'Bon à savoir',
                content: 'Gratuit pour les - de 7 ans sur les genoux de l\'accompagnant.\nBuvette et restauration sur place.',
              },
            ].map(({ icon: Icon, title, content, link }) => (
              <div
                key={title}
                className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 hover:border-hormadi-red/30 transition-colors"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-hormadi-red/10 flex items-center justify-center flex-shrink-0">
                    <Icon size={20} className="text-hormadi-red" />
                  </div>
                  <h3 className="text-white font-bold">{title}</h3>
                </div>
                <p className="text-hormadi-muted text-sm leading-relaxed whitespace-pre-line">
                  {content}
                </p>
                {link && (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-hormadi-ocean hover:text-hormadi-red transition-colors text-sm font-semibold mt-3"
                  >
                    {link.label}
                    <ArrowRight size={14} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA — RÉSEAUX SOCIAUX
      ═══════════════════════════════════════════════════════ */}
      <section className="px-6 sm:px-8 lg:px-12 pb-24 sm:pb-28 max-w-7xl mx-auto">
          {/* ── CTA Réseaux Sociaux — full width, photo BG ── */}
          <div className="relative overflow-hidden rounded-2xl border border-hormadi-border">
            <img
              src="/images/cta-supporters.jpg"
              alt="Supporters Hormadi"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/50" />

            <div className="relative z-10 p-10 sm:p-14 lg:p-16">
              <div className="inline-block bg-hormadi-red text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 mb-5">
                Nous suivre
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase mb-7 leading-tight">
                Merci à tous nos <span className="text-hormadi-red">supporters</span>
              </h3>

              <div className="flex flex-wrap items-center gap-5 sm:gap-8">
                {/* Instagram */}
                <a href="https://www.instagram.com/anglet_hormadi/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center flex-shrink-0
                                  group-hover:scale-110 transition-transform">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white leading-none">+ 13 000</span>
                    <span className="block text-[10px] text-white/50 -mt-0.5">sur <span className="text-[#dc2743] font-bold">Instagram</span></span>
                  </div>
                </a>

                {/* Facebook */}
                <a href="https://www.facebook.com/anglethormadiofficiel/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-[#1877F2] flex items-center justify-center flex-shrink-0
                                  group-hover:scale-110 transition-transform">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white leading-none">+ 14 000</span>
                    <span className="block text-[10px] text-white/50 -mt-0.5">sur <span className="text-[#1877F2] font-bold">Facebook</span></span>
                  </div>
                </a>

                {/* YouTube */}
                <a href="https://www.youtube.com/channel/UCXXa4o0epdaQ-TZaIc-T6_g" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-[#FF0000] flex items-center justify-center flex-shrink-0
                                  group-hover:scale-110 transition-transform">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white leading-none">+ 650</span>
                    <span className="block text-[10px] text-white/50 -mt-0.5">sur <span className="text-[#FF0000] font-bold">YouTube</span></span>
                  </div>
                </a>

                {/* X */}
                <a href="https://x.com/anglet_hormadi" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0
                                  group-hover:scale-110 transition-transform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="black"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white leading-none">+ 200</span>
                    <span className="block text-[10px] text-white/50 -mt-0.5">sur <span className="text-white font-bold">X</span></span>
                  </div>
                </a>
              </div>

              {/* Abonnement CTA */}
              <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
                <p className="text-white/50 text-xs italic">Abonnez-vous pour un tarif préférentiel et de nombreux avantages !</p>
                <Link
                  href="/contact"
                  className="group relative inline-flex items-center flex-shrink-0 overflow-hidden"
                >
                  <div className="border-2 border-white/40 text-white font-bold px-6 py-2.5 -skew-x-6
                                  group-hover:border-hormadi-red group-hover:bg-hormadi-red transition-all duration-200">
                    <span className="skew-x-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider">
                      Abonnez-vous
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
      </section>
    </main>
  )
}
