import Link from 'next/link'
import { ArrowRight, Users, Heart, Trophy, Clock, Check } from 'lucide-react'

const FEATURES = [
  'Baby hockey dès 3 ans',
  'École de glace & initiation',
  'Équipes jeunes U9 à U20',
  'Seniors loisir & compétition',
  'Entraînements toute la semaine',
  'Esprit club & valeurs',
]

export default function AmateurSection() {
  return (
    <section className="py-20 sm:py-28">
      <div className="section-padding max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-hormadi-border">
          <div className="absolute inset-0 bg-gradient-to-br from-hormadi-forest via-hormadi-dark to-hormadi-dark" />

          {/* Amateur club logo — top right */}
          <div className="absolute top-5 right-5 z-20">
            <img
              src="/images/logo-amateur.png"
              alt="Logo section amateur Hormadi"
              className="w-24 h-24 sm:w-28 sm:h-28 object-contain opacity-90"
            />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row">
            {/* Left — Photo with diagonal edge (inversé du CTA partenaire) */}
            <div className="relative lg:w-[48%] min-h-[300px] lg:min-h-[500px]"
                 style={{ clipPath: 'polygon(0% 0%, 100% 0%, 88% 100%, 0% 100%)' }}>
              <img
                src="/images/amateur-section.jpg"
                alt="Section amateur Hormadi"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-hormadi-dark/60 via-transparent to-transparent lg:hidden" />
            </div>

            {/* Right — Text & CTA */}
            <div className="flex-1 p-10 sm:p-14 lg:p-16 flex flex-col justify-center">
              <div className="inline-block bg-hormadi-ocean text-white text-[11px] font-bold uppercase tracking-wider px-4 py-1.5 mb-6 w-fit">
                Association
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                SECTION<br />AMATEUR
              </h2>
              <p className="text-hormadi-muted text-base sm:text-lg max-w-lg mb-4 leading-relaxed">
                L'Hormadi, c'est aussi une association qui fait vivre le hockey sur glace au Pays Basque depuis 1970.
              </p>
              <p className="text-hormadi-muted text-sm max-w-lg mb-8 leading-relaxed">
                Des plus jeunes aux vétérans, venez partager notre passion sur la glace d'Anglet. Rejoignez une communauté de passionnés où chacun trouve sa place.
              </p>

              {/* Features list */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8">
                {FEATURES.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-hormadi-ocean/20 border border-hormadi-ocean/40 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-hormadi-ocean" strokeWidth={3} />
                    </div>
                    <span className="text-hormadi-ice text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/club"
                className="inline-flex items-center justify-center gap-2 bg-hormadi-ocean text-white font-bold
                           px-8 py-3.5 rounded-lg hover:bg-hormadi-ocean/90 transition-all
                           hover:shadow-lg hover:shadow-hormadi-ocean/30 text-sm uppercase tracking-wider group w-fit"
              >
                Découvrir
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
