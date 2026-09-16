'use client'

import Link from 'next/link'
import { ChevronRight, Scale } from 'lucide-react'

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-hormadi-dark">
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/patinoire-barre.jpg"
          alt="Hormadi Anglet"
          className="absolute inset-0 z-[1] w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/50 to-hormadi-dark/20" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-hormadi-dark/70 via-transparent to-transparent" />
        <div className="absolute z-[3] top-0 right-0 w-96 h-96 bg-hormadi-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute z-[3] bottom-0 left-0 w-72 h-72 bg-hormadi-ocean/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-[5] h-full flex flex-col justify-end pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Mentions légales</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
              <Scale size={20} className="text-hormadi-red" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
              Informations légales
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight text-white">
            MENTIONS LÉGALES
          </h1>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto prose-custom">

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Éditeur du site</h2>
              <div className="text-hormadi-muted space-y-1 text-sm">
                <p><strong className="text-white">Anglet Hormadi Elite</strong> — SASP (Société Anonyme Sportive Professionnelle)</p>
                <p>Capital social : 37 152 €</p>
                <p>Siège social : 299 Avenue de l&apos;Adour, 64600 Anglet</p>
                <p>SIRET : 434 920 682 00011 — RCS Bayonne</p>
                <p>N° TVA intracommunautaire : FR23 434920682</p>
                <p>Téléphone : 05 59 57 17 37</p>
                <p>Email : <a href="mailto:contact@hormadi.fr" className="text-hormadi-red hover:underline">contact@hormadi.fr</a></p>
                <p>Directeur de la publication : Olivier Bouney, Président</p>
              </div>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Conception et développement</h2>
              <div className="text-hormadi-muted space-y-1 text-sm">
                <p><strong className="text-white">Lemonstrawberry (LSB Group)</strong></p>
                <p>Contact : <a href="mailto:pierre@lsb-group.fr" className="text-hormadi-red hover:underline">pierre@lsb-group.fr</a></p>
              </div>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Hébergement</h2>
              <div className="text-hormadi-muted space-y-1 text-sm">
                <p><strong className="text-white">Vercel Inc.</strong></p>
                <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
                <p>Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-hormadi-red hover:underline">vercel.com</a></p>
              </div>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Crédits photos</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Sauf mention contraire, les photographies du site sont la propriété de{' '}
                <strong className="text-white">J2R Photography</strong>. Toute reproduction ou réutilisation sans autorisation
                préalable est interdite.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Propriété intellectuelle</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                L'ensemble du contenu de ce site (textes, images, logos, vidéos, graphismes, icônes) est la propriété exclusive
                d'Anglet Hormadi Elite ou de ses partenaires, et est protégé par les lois françaises et internationales
                relatives à la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation
                de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans
                l'autorisation écrite préalable d'Anglet Hormadi Elite. Toute exploitation non autorisée sera considérée comme
                constitutive d'une contrefaçon et poursuivie conformément aux articles L.335-2 et suivants du Code de la
                propriété intellectuelle.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Conditions d&apos;utilisation et limitation de responsabilité</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                L'utilisation du site www.hormadi.fr implique l'acceptation pleine et entière des présentes conditions.
                Anglet Hormadi Elite s'efforce d'assurer au mieux l'exactitude et la mise à jour des informations diffusées sur
                ce site, mais ne peut en garantir l'exactitude, la précision ou l'exhaustivité. Anglet Hormadi Elite décline
                toute responsabilité pour toute imprécision, inexactitude ou omission portant sur des informations disponibles
                sur le site, ainsi que pour les dommages directs ou indirects résultant de l'accès ou de l'utilisation du site,
                y compris en cas d'indisponibilité temporaire liée à la maintenance ou à un cas de force majeure.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Liens hypertextes</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Le site contient des liens hypertextes vers d'autres sites internet, notamment ceux de ses partenaires,
                fournisseurs officiels et de la billetterie (Sulf). Anglet Hormadi Elite n'exerce aucun contrôle sur ces sites
                tiers et décline toute responsabilité quant à leur contenu. L'existence d'un lien hypertexte depuis le site vers
                un autre site ne constitue pas une validation de ce site ou de son contenu.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-black text-white mb-4">Droit applicable</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux français seront
                seuls compétents.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
