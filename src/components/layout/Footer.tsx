import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { CLUB, NAV_LINKS, CTA_LINKS } from '@/lib/constants'
export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0a1a14 0%, #061210 100%)' }}>
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-hormadi-red via-hormadi-red to-transparent" />

      <div className="section-padding pt-16 pb-10">
        {/* Main grid — 4 columns + logo */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">

          {/* Col 1: Navigation */}
          <div className="lg:w-[22%]">
            <h3 className="font-bold text-sm text-white mb-6">Navigation</h3>
            <ul className="space-y-3">
              {[
                { label: 'Actualités', href: '/actualites' },
                { label: 'Calendrier', href: '/calendrier' },
                { label: 'Classement', href: '/classement' },
                { label: 'Club', href: '/histoire' },
                { label: 'Partenaires', href: '/partenaires' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Services */}
          <div className="lg:w-[22%]">
            <h3 className="font-bold text-sm text-white mb-6">Services</h3>
            <ul className="space-y-3">
              {[
                { label: 'Billetterie', href: CTA_LINKS.billetterie },
                { label: 'Boutique', href: CTA_LINKS.boutique },
                { label: 'Hospitalités', href: '/hospitalites' },
                { label: 'Magnus TV', href: CTA_LINKS.magnusTV, external: true },
                { label: 'Contact', href: '/contact' },
              ].map(service => (
                <li key={service.label}>
                  {service.external ? (
                    <a
                      href={service.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5"
                    >
                      {service.label}
                      <ExternalLink size={11} className="opacity-50" />
                    </a>
                  ) : (
                    <Link
                      href={service.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                    >
                      {service.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: A propos */}
          <div className="lg:w-[22%]">
            <h3 className="font-bold text-sm text-white mb-6">A propos</h3>
            <ul className="space-y-3">
              {[
                { label: 'Mentions légales', href: '/mentions-legales' },
                { label: 'Politique de confidentialité', href: '/politique-confidentialite' },
                { label: 'Données personnelles', href: '/politique-confidentialite' },
                { label: CLUB.league, href: '/classement' },
              ].map(item => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-white/60 hover:text-white transition-colors duration-200"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Nous suivre */}
          <div className="lg:w-[22%]">
            <h3 className="font-bold text-sm text-white mb-6">Nous suivre</h3>
            <p className="text-sm text-white/60 leading-relaxed mb-5">
              Rejoignez la communauté sur les réseaux sociaux et ne manquez rien de l&apos;actualité du club !
            </p>
            <div className="flex gap-3">
              {[
                {
                  label: 'Instagram',
                  href: 'https://www.instagram.com/anglet_hormadi/',
                  bg: 'bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
                },
                {
                  label: 'Facebook',
                  href: 'https://www.facebook.com/anglethormadiofficiel/',
                  bg: 'bg-[#1877F2]',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                },
                {
                  label: 'YouTube',
                  href: 'https://www.youtube.com/channel/UCXXa4o0epdaQ-TZaIc-T6_g',
                  bg: 'bg-[#FF0000]',
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
                },
                {
                  label: 'X',
                  href: 'https://x.com/anglet_hormadi',
                  bg: 'bg-white',
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="black"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                },
              ].map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-lg ${social.bg} flex items-center justify-center hover:scale-110 transition-transform duration-200`}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Logo — far right */}
          <div className="hidden lg:flex lg:w-[12%] items-start justify-end">
            <div className="w-20 h-20 relative">
              <Image
                src="/images/logo-hormadi.png"
                alt={CLUB.name}
                width={80}
                height={80}
                className="object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="section-padding py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <span>&copy; {currentYear} {CLUB.fullName}. Tous droits réservés.</span>
            <div className="flex gap-6">
              <Link href="/mentions-legales" className="hover:text-white transition-colors">
                Mentions légales
              </Link>
              <Link href="/politique-confidentialite" className="hover:text-white transition-colors">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Giant animated text — "ICI C'EST ANGLET" ═══ */}
      <div
        className="relative overflow-hidden border-t border-white/5"
        style={{ background: 'linear-gradient(180deg, #061210 0%, #030a08 100%)' }}
      >
        <div className="py-8 sm:py-12">
          <div className="flex items-center justify-center">
            <h2
              className="font-black text-[15vw] sm:text-[12vw] lg:text-[10vw] leading-[0.85] tracking-tighter text-center select-none whitespace-nowrap"
              style={{
                WebkitTextStroke: '2px rgba(255,255,255,0.15)',
                WebkitTextFillColor: 'transparent',
              }}
            >
              LET&apos;S GO{' '}
              <span
                style={{
                  WebkitTextStroke: '0px',
                  WebkitTextFillColor: 'white',
                }}
              >
                ANGLET
              </span>
            </h2>
          </div>
        </div>
      </div>
    </footer>
  )
}
