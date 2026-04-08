'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="-mt-[5.5rem]">
      {/* Hero */}
      <section className="relative h-[25vh] min-h-[200px] max-h-[280px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <div className="relative z-[5] h-full flex flex-col justify-end pb-8 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Politique de confidentialité</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">POLITIQUE DE CONFIDENTIALITÉ</h1>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto prose-custom">

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Collecte des données personnelles</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                L'Hormadi Anglet collecte des données personnelles uniquement dans le cadre de l'utilisation de ses services :
                achat de billets, commandes en boutique, formulaire de contact, inscription à la newsletter. Les données collectées
                peuvent inclure : nom, prénom, adresse email, numéro de téléphone, adresse postale et informations nécessaires au
                traitement des commandes.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Utilisation des données</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed mb-3">
                Les données personnelles collectées sont utilisées exclusivement pour :
              </p>
              <ul className="text-hormadi-muted text-sm space-y-2 ml-4">
                <li className="flex items-start gap-2"><span className="text-hormadi-red mt-1">•</span>Le traitement des commandes de billets et de produits de la boutique</li>
                <li className="flex items-start gap-2"><span className="text-hormadi-red mt-1">•</span>La gestion de la relation client et le suivi des demandes via le formulaire de contact</li>
                <li className="flex items-start gap-2"><span className="text-hormadi-red mt-1">•</span>L'envoi d'informations relatives aux matchs, événements et actualités du club (avec consentement)</li>
                <li className="flex items-start gap-2"><span className="text-hormadi-red mt-1">•</span>L'amélioration de nos services et de l'expérience utilisateur sur le site</li>
              </ul>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Protection des données</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
                vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données
                personnelles. L'Hormadi Anglet met en place les mesures techniques et organisationnelles appropriées pour
                garantir la sécurité et la confidentialité de vos données.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Cookies</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Ce site utilise des cookies techniques nécessaires au bon fonctionnement du site. Aucun cookie publicitaire ou de
                traçage n'est utilisé. Les cookies techniques permettent de mémoriser vos préférences et d'assurer le bon
                fonctionnement des services proposés (panier d'achat, authentification).
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Durée de conservation</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Les données personnelles sont conservées pour la durée nécessaire à la finalité de leur traitement, et au maximum
                pour une durée de 3 ans à compter du dernier contact avec l'utilisateur, conformément aux recommandations de la CNIL.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Exercer vos droits</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Pour exercer vos droits (accès, rectification, suppression, opposition), vous pouvez nous contacter par email à{' '}
                <a href="mailto:contact@hormadi.fr" className="text-hormadi-red hover:underline">contact@hormadi.fr</a> ou
                par courrier à l'adresse : Hormadi Anglet, Patinoire de la Barre, Boulevard du BAB, 64600 Anglet.
                Une réponse vous sera apportée dans un délai maximum d'un mois.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8">
              <h2 className="text-xl font-black text-white mb-4">Contact CNIL</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Si vous estimez que le traitement de vos données ne respecte pas la réglementation en vigueur, vous pouvez
                introduire une réclamation auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-hormadi-red hover:underline">www.cnil.fr</a>.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
