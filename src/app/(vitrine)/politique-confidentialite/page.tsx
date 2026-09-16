'use client'

import Link from 'next/link'
import { ChevronRight, ShieldCheck } from 'lucide-react'

export default function PolitiqueConfidentialitePage() {
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
            <span className="text-white">Politique de confidentialité</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
              <ShieldCheck size={20} className="text-hormadi-red" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
              Vos données
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight text-white">
            CONFIDENTIALITÉ
          </h1>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto prose-custom">

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Responsable du traitement</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Le responsable du traitement des données personnelles collectées sur ce site est{' '}
                <strong className="text-white">Anglet Hormadi Elite</strong> (SASP), 299 Avenue de l&apos;Adour, 64600 Anglet
                — <a href="mailto:contact@hormadi.fr" className="text-hormadi-red hover:underline">contact@hormadi.fr</a>.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Collecte des données personnelles</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Ce site collecte des données personnelles uniquement lorsque vous remplissez le{' '}
                <strong className="text-white">formulaire de contact</strong> : nom, prénom, adresse email, numéro de téléphone
                (facultatif) et contenu de votre message. Aucune donnée n&apos;est collectée à votre insu.
              </p>
              <p className="text-hormadi-muted text-sm leading-relaxed mt-3">
                L&apos;achat de billets se fait exclusivement via notre billetterie partenaire{' '}
                <strong className="text-white">Sulf</strong>, et l&apos;achat de produits dérivés directement chez nos partenaires
                boutique (Pull In, Macron, Promoglace). Ce site ne traite et ne stocke aucune donnée bancaire ou de paiement :
                ces informations sont collectées et gérées uniquement par ces prestataires tiers, selon leurs propres politiques
                de confidentialité respectives.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Utilisation des données</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed mb-3">
                Les données transmises via le formulaire de contact sont utilisées exclusivement pour :
              </p>
              <ul className="text-hormadi-muted text-sm space-y-2 ml-4">
                <li className="flex items-start gap-2"><span className="text-hormadi-red mt-1">•</span>Répondre à votre demande ou question</li>
                <li className="flex items-start gap-2"><span className="text-hormadi-red mt-1">•</span>Assurer le suivi de la relation avec vous (partenariat, presse, question générale, etc.)</li>
              </ul>
              <p className="text-hormadi-muted text-sm leading-relaxed mt-3">
                Ces données ne sont ni cédées, ni louées, ni vendues à des tiers, et ne sont utilisées à aucune fin commerciale
                ou publicitaire.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Protection des données</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés,
                vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition au traitement de vos données
                personnelles. Anglet Hormadi Elite met en place les mesures techniques et organisationnelles appropriées pour
                garantir la sécurité et la confidentialité de vos données.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Cookies</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Ce site n&apos;utilise aucun cookie publicitaire, de traçage ou de mesure d&apos;audience. Un seul cookie
                technique est déposé, strictement nécessaire à la connexion de l&apos;équipe du club à son espace
                d&apos;administration (back-office) ; il n&apos;est jamais déposé chez un visiteur classique du site public et
                ne sert à aucun suivi de navigation.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Durée de conservation</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Les messages envoyés via le formulaire de contact sont transmis par email au club et ne sont pas conservés dans
                une base de données du site. Ils sont conservés le temps nécessaire au traitement de votre demande, et au
                maximum 3 ans à compter du dernier contact, conformément aux recommandations de la CNIL.
              </p>
            </div>

            <div className="bg-hormadi-surface/50 border border-hormadi-border rounded-xl p-6 sm:p-8 mb-8">
              <h2 className="text-xl font-black text-white mb-4">Exercer vos droits</h2>
              <p className="text-hormadi-muted text-sm leading-relaxed">
                Pour exercer vos droits (accès, rectification, suppression, opposition), vous pouvez nous contacter par email à{' '}
                <a href="mailto:contact@hormadi.fr" className="text-hormadi-red hover:underline">contact@hormadi.fr</a> ou
                par courrier à l'adresse : Anglet Hormadi Elite, 299 Avenue de l&apos;Adour, 64600 Anglet.
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
    </main>
  )
}
