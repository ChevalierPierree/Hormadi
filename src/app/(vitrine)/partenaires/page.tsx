'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronRight, Handshake, ExternalLink, ArrowRight, Mail, Phone } from 'lucide-react'

/* ─── Partner data now lives in the DB (Partner table), managed via /admin/partenaires.
   This page only maps DB categories to display copy. ──────────── */

interface Partner {
  name: string
  logoUrl?: string
  website?: string
}

interface DbPartner extends Partner {
  category: string
}

interface PartnerCategory {
  id: string
  title: string
  subtitle: string
  partners: Partner[]
}

// DB `category` value -> section id/title/subtitle shown on the page.
// Keep in sync with the PartnerCategory type in src/app/admin/partenaires/page.tsx.
const CATEGORY_META: Record<string, { id: string; title: string; subtitle: string }> = {
  partenaire_principal: { id: 'labellises', title: 'Nos partenaires', subtitle: 'LABELLISÉS' },
  partenaire_institutionnel: { id: 'institutionnels', title: 'Nos partenaires', subtitle: 'INSTITUTIONNELS' },
  partenaire: { id: 'partenaires', title: 'Nos', subtitle: 'PARTENAIRES' },
  fournisseur_officiel: { id: 'fournisseurs', title: 'Nos fournisseurs', subtitle: 'OFFICIELS' },
  equipementier: { id: 'equipementiers', title: 'Nos partenaires', subtitle: 'ÉQUIPEMENTIERS' },
  media: { id: 'media', title: 'Nos partenaires', subtitle: 'MÉDIA' },
}

// Display order for the top category sections
const CATEGORY_ORDER = ['partenaire_principal', 'partenaire_institutionnel', 'partenaire', 'fournisseur_officiel', 'equipementier', 'media']

/* ─── Filter tabs for "Tous nos partenaires" ──────────────────── */
const FILTER_TABS = [
  { id: 'tous', label: 'TOUS' },
  { id: 'labellises', label: 'LABELLISÉS' },
  { id: 'institutionnels', label: 'INSTITUTIONNELS' },
  { id: 'partenaires', label: 'PARTENAIRES' },
  { id: 'fournisseurs', label: 'FOURNISSEURS' },
  { id: 'equipementiers', label: 'ÉQUIPEMENTIERS' },
  { id: 'media', label: 'MÉDIA' },
]

export default function PartenairesPage() {
  const [activeFilter, setActiveFilter] = useState('tous')
  const [dbPartners, setDbPartners] = useState<DbPartner[]>([])

  useEffect(() => {
    fetch('/api/partners?visible=true')
      .then(res => res.json())
      .then(data => setDbPartners(data.partners || []))
      .catch(() => {})
  }, [])

  const CATEGORIES: PartnerCategory[] = CATEGORY_ORDER
    .map(category => {
      const meta = CATEGORY_META[category]
      const partners = dbPartners
        .filter(p => p.category === category)
        .map(p => ({ name: p.name, logoUrl: p.logoUrl, website: p.website }))
      return { ...meta, partners }
    })
    .filter(cat => cat.partners.length > 0)

  // Get all unique partners for the grid (deduplicated by name)
  const allPartners = CATEGORIES.flatMap(cat =>
    cat.partners.map(p => ({ ...p, categoryId: cat.id }))
  )

  const filteredPartners = activeFilter === 'tous'
    ? allPartners
    : allPartners.filter(p => p.categoryId === activeFilter)

  // Deduplicate by name for display
  const seen = new Set<string>()
  const uniqueFiltered = filteredPartners.filter(p => {
    if (seen.has(p.name)) return false
    seen.add(p.name)
    return true
  })

  return (
    <main className="min-h-screen bg-hormadi-dark">

      {/* ════════════════════════════════════════════════════════
          HERO SECTION
      ════════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/hero-partenaires.jpg"
          alt="Partenaires Hormadi"
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
            <span className="text-white">Partenaires</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
                  <Handshake size={20} className="text-hormadi-red" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
                  Saison 2026-2027
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
                PARTENAIRES
              </h1>
              <p className="text-hormadi-muted mt-3 text-base sm:text-lg max-w-lg">
                Les entreprises qui font de l'Hormadi une force du hockey français.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CATEGORY SECTIONS (Boxers de Bordeaux style)
      ════════════════════════════════════════════════════════ */}
      {CATEGORIES.filter(cat => cat.id !== 'partenaires').map((category, index) => (
        <section
          key={category.id}
          className={cn(
            'py-16 md:py-20 border-b border-hormadi-border/30',
            index % 2 === 1 && 'bg-hormadi-surface/20'
          )}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            {/* Title */}
            <div className="mb-10">
              <p className="text-hormadi-red font-black text-xl sm:text-2xl uppercase leading-tight">
                {category.title}
              </p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white uppercase leading-none">
                {category.subtitle}
              </h2>
              <div className="w-12 h-1 bg-hormadi-red rounded-full mt-4" />
            </div>

            {/* Partner cards grid */}
            <div className={cn(
              'grid gap-5',
              category.partners.length <= 4
                ? 'grid-cols-2 lg:grid-cols-4'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            )}>
              {category.partners.map((partner, idx) => (
                <PartnerCard key={idx} partner={partner} size={category.partners.length <= 4 ? 'large' : 'normal'} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ════════════════════════════════════════════════════════
          TOUS NOS PARTENAIRES (with filter tabs)
      ════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header + Filter Tabs */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase mb-8">
              Tous nos partenaires
            </h2>
            <div className="flex flex-wrap gap-2">
              {FILTER_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={cn(
                    'px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200',
                    activeFilter === tab.id
                      ? 'bg-hormadi-red text-white'
                      : 'bg-white/[0.05] text-hormadi-muted border border-white/10 hover:border-hormadi-red/40 hover:text-white'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uniqueFiltered.map((partner, idx) => (
              <PartnerCard key={`${partner.name}-${idx}`} partner={partner} size="grid" />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CTA DEVENIR PARTENAIRE
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 sm:py-28 border-t border-hormadi-border/30">
        <div className="section-padding max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl border border-hormadi-border">
            <div className="absolute inset-0 bg-gradient-to-br from-hormadi-forest via-hormadi-dark to-hormadi-dark" />

            <div className="relative z-10 flex flex-col lg:flex-row">
              {/* Left — Text & CTA */}
              <div className="flex-1 p-10 sm:p-14 lg:p-16 flex flex-col justify-center">
                <div className="inline-block bg-hormadi-red text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 mb-6 w-fit">
                  Partenariat
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                  DEVENEZ<br />PARTENAIRE
                </h2>
                <p className="text-hormadi-muted text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
                  Associez votre image à l'Hormadi et bénéficiez d'une visibilité unique auprès d'un public passionné. Rejoignez un réseau de +130 entreprises partenaires.
                </p>

                {/* Commerciaux */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-white/[0.05] border border-white/10 rounded-xl p-5">
                    <h4 className="text-white font-black text-base mb-2">Thomas Carton</h4>
                    <div className="space-y-1.5">
                      <a href="mailto:t.carton@hormadi.fr" className="flex items-center gap-2 text-hormadi-muted text-sm hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5 text-hormadi-red flex-shrink-0" />
                        t.carton@hormadi.fr
                      </a>
                      <a href="tel:+33609331583" className="flex items-center gap-2 text-hormadi-muted text-sm hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5 text-hormadi-red flex-shrink-0" />
                        06 09 33 15 83
                      </a>
                    </div>
                  </div>
                  <div className="bg-white/[0.05] border border-white/10 rounded-xl p-5">
                    <h4 className="text-white font-black text-base mb-2">Philippe Ranger</h4>
                    <div className="space-y-1.5">
                      <a href="mailto:p.ranger@hormadi.fr" className="flex items-center gap-2 text-hormadi-muted text-sm hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5 text-hormadi-red flex-shrink-0" />
                        p.ranger@hormadi.fr
                      </a>
                      <a href="tel:+33785138199" className="flex items-center gap-2 text-hormadi-muted text-sm hover:text-white transition-colors">
                        <Phone className="w-3.5 h-3.5 text-hormadi-red flex-shrink-0" />
                        07 85 13 81 99
                      </a>
                    </div>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-hormadi-red text-white font-bold
                             px-8 py-3.5 rounded-lg hover:bg-hormadi-red/90 transition-all
                             hover:shadow-lg hover:shadow-hormadi-red/30 text-sm uppercase tracking-wider group w-fit"
                >
                  Nous contacter
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Right — Photo with diagonal edge */}
              <div className="relative lg:w-[48%] min-h-[300px] lg:min-h-[450px]"
                   style={{ clipPath: 'polygon(12% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
                <img
                  src="/images/cta-hospitalites.jpg"
                  alt="Devenir partenaire Hormadi"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-hormadi-dark/60 via-transparent to-transparent lg:hidden" />
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

/* ────────────────────────────────────────────────────────
   Partner Card Component
──────────────────────────────────────────────────────── */
function PartnerCard({ partner, size = 'normal' }: { partner: Partner; size?: 'large' | 'normal' | 'grid' }) {
  const [imgError, setImgError] = useState(false)

  const initials = partner.name
    .split(' ')
    .map(word => word[0])
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const hasLogo = partner.logoUrl && !imgError

  const sizeClasses = {
    large: 'aspect-[16/10] p-6',
    normal: 'aspect-square p-4',
    grid: 'aspect-square p-3',
  }

  const cardContent = (
    <div className={cn(
      'relative rounded-xl overflow-hidden bg-white flex items-center justify-center',
      'transition-all duration-300 ease-out group',
      'hover:shadow-lg hover:shadow-hormadi-ocean/10 hover:scale-[1.02]',
      sizeClasses[size],
    )}>
      {hasLogo ? (
        <img
          src={partner.logoUrl}
          alt={partner.name}
          className="max-w-[80%] max-h-[75%] object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-center px-2">
          <span className={cn(
            'font-black text-hormadi-dark/80',
            size === 'large' ? 'text-3xl' : size === 'grid' ? 'text-lg' : 'text-2xl'
          )}>
            {initials}
          </span>
          <span className={cn(
            'text-hormadi-dark/50 font-semibold leading-tight',
            size === 'large' ? 'text-sm' : 'text-[10px]'
          )}>
            {partner.name}
          </span>
        </div>
      )}

      {/* Hover overlay with partner name */}
      {hasLogo && (
        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
          <span className="text-white font-bold text-center text-sm">{partner.name}</span>
        </div>
      )}

      {/* External link icon */}
      {partner.website && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  )

  if (partner.website) {
    return (
      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="block">
        {cardContent}
      </a>
    )
  }

  return cardContent
}
