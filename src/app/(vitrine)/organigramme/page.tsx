'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Network, Users } from 'lucide-react'
import { CLUB } from '@/lib/constants'
import NewsPreview from '@/components/sections/NewsPreview'
import BoutiqueSocialCTA from '@/components/sections/BoutiqueSocialCTA'

interface StaffMember {
  id: string
  name: string
  role: string
  category: 'direction' | 'staff_technique' | 'encadrement'
  photoUrl?: string
}

const SECTIONS: { id: StaffMember['category']; title: string }[] = [
  { id: 'direction', title: 'Direction' },
  { id: 'staff_technique', title: 'Staff Technique' },
  { id: 'encadrement', title: 'Encadrement' },
]

export default function OrganigrammePage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/staff?visible=true')
      .then(res => res.json())
      .then(data => setStaff(data.staff || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-hormadi-dark">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/hero-organigramme.jpg"
          alt="Staff et dirigeants de l'Hormadi"
          className="absolute inset-0 z-[1] w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/60 to-hormadi-dark/30" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-hormadi-dark/70 via-transparent to-transparent" />
        <div className="absolute z-[3] top-0 right-0 w-96 h-96 bg-hormadi-red/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute z-[3] bottom-0 left-0 w-72 h-72 bg-hormadi-ocean/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-[5] h-full flex flex-col justify-end pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <Link href="/histoire" className="hover:text-white transition-colors">Club</Link>
            <ChevronRight size={14} />
            <span className="text-white">Organigramme</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
              <Network size={20} className="text-hormadi-red" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
              Saison {CLUB.season}
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight text-white">
            ORGANIGRAMME
          </h1>
          <p className="text-hormadi-muted mt-3 text-base sm:text-lg max-w-lg">
            Les femmes et les hommes qui font vivre l'Hormadi au quotidien.
          </p>
        </div>

        <div className="absolute z-[5] bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hormadi-red/30 to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════
          SECTIONS
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-hormadi-dark via-hormadi-forest/20 to-hormadi-dark noise-overlay">
        <div className="absolute inset-0 stripe-pattern pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-hormadi-red/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-hormadi-ocean/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 md:py-24 space-y-16">
          {loading ? (
            <p className="text-hormadi-muted text-center py-12">Chargement...</p>
          ) : staff.length === 0 ? (
            <div className="text-center py-12">
              <Users size={40} className="text-hormadi-muted mx-auto mb-4" />
              <p className="text-hormadi-muted">L'organigramme sera bientôt disponible.</p>
            </div>
          ) : (
            SECTIONS.map(section => {
              const members = staff.filter(m => m.category === section.id)
              if (members.length === 0) return null
              return (
                <div key={section.id}>
                  <div className="mb-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">{section.title}</h2>
                    <div className="w-12 h-1 bg-hormadi-red rounded-full mt-3" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                    {members.map(member => (
                      <StaffCard key={member.id} member={member} />
                    ))}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA — ACTUALITÉS, RÉSEAUX SOCIAUX & BOUTIQUE
      ═══════════════════════════════════════════════════════ */}
      <NewsPreview />
      <BoutiqueSocialCTA />
    </main>
  )
}

function StaffCard({ member }: { member: StaffMember }) {
  const initials = member.name.split(' ').map(w => w[0]).filter(Boolean).join('').toUpperCase().slice(0, 2)

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 hover:border-hormadi-red/40 transition-all duration-300 group shadow-lg shadow-black/30"
         style={{ background: 'linear-gradient(160deg, #2b2f33 0%, #1c1f22 55%, #17191b 100%)' }}>
      <div className="aspect-square bg-zinc-900 relative overflow-hidden">
        {member.photoUrl ? (
          <img
            src={member.photoUrl}
            alt={member.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
               style={{ background: 'linear-gradient(160deg, #2b2f33 0%, #17191b 100%)' }}>
            <span className="text-4xl font-black text-white/20">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>
      <div className="p-4 border-t border-white/5">
        <h3 className="text-white font-bold leading-tight">{member.name}</h3>
        <p className="text-zinc-400 text-sm mt-1">{member.role}</p>
      </div>
    </div>
  )
}
