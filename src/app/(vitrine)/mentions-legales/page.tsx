'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function MentionsLegalesPage() {
  return (
    <div className="-mt-[5.5rem]">
      {/* Hero */}
      <section className="relative h-[25vh] min-h-[200px] max-h-[280px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <div className="relative z-[5] h-full flex flex-col justify-end pb-8 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Mentions légales</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">MENTIONS LÉGALES</h1>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto prose-custom">

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Éditeur du site</h2>
              <div className="text-hormadi-muted space-y-1 text-sm">
                <p><strong className="text-white">Association Hormadi Anglet</strong></p>
                <p>Association loi 1901</p>
                <p>Patinoire de la Barre, Boulevard du BAB, 64600 Anglet</p>
                <p>Email : <a href="mailto:contact@hormadi.fr" className="text-hormadi-red hover:underline">contact@hormadi.fr</a></p>
                <p>Directeur de la publication : Le Président de l'association Hormadi Anglet</p>
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
              <h2 className="text-xl font-black text-white mb-4">Propriété intellectuelle</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                L'ensemble du contenu de ce site (textes, images, logos, vidéos, graphismes, icônes) est la propriété exclusive
                de l'association Hormadi Anglet ou de ses partenaires, et est protégé par les lois françaises et internationales
                relatives à la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation
                de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans
                l'autorisation écrite préalable de l'Hormadi Anglet.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Limitation de responsabilité</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                L'Hormadi Anglet s'efforce d'assurer au mieux l'exactitude et la mise à jour des informations diffusées sur ce site.
                Toutefois, l'Hormadi Anglet ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à
                disposition. En conséquence, l'Hormadi Anglet décline toute responsabilité pour toute imprécision, inexactitude ou
                omission portant sur des informations disponibles sur le site. L'Hormadi Anglet ne saurait être tenu responsable des
                dommages directs ou indirects résultant de l'accès ou de l'utilisation du site.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Liens hypertextes</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Le site peut contenir des liens hypertextes vers d'autres sites internet. L'Hormadi Anglet n'exerce aucun contrôle
                sur ces sites et décline toute responsabilité quant à leur contenu. L'existence d'un lien hypertexte depuis le
                site de l'Hormadi Anglet vers un autre site ne constitue pas une validation de ce site ou de son contenu.
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
    </div>
  )
}
