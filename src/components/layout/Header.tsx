'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Ticket, ShoppingBag, ChevronRight } from 'lucide-react'
import { NAV_LINKS, CTA_LINKS, CLUB } from '@/lib/constants'
import { cn } from '@/lib/utils'

function LogoImage() {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="w-11 h-11 rounded-full border-2 border-hormadi-red flex items-center justify-center font-black text-lg text-hormadi-red">
        H
      </div>
    )
  }

  return (
    <img
      src="/images/logo-hormadi.png"
      alt="Hormadi"
      width={44}
      height={44}
      className="rounded-full"
      onError={() => setError(true)}
    />
  )
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar — hidden on scroll for more space */}
      <div className={cn(
        'bg-hormadi-red text-white text-xs transition-all duration-300 overflow-hidden',
        scrolled ? 'h-0 opacity-0' : 'h-8 opacity-100'
      )}>
        <div className="section-padding flex items-center justify-between h-8">
          <span className="font-semibold tracking-wide">
            {CLUB.league} — Saison {CLUB.season}
          </span>
          <div className="hidden sm:flex items-center gap-4 text-white/80">
            <a href={CTA_LINKS.magnusTV} target="_blank" rel="noopener noreferrer"
               className="hover:text-white transition-colors">
              Magnus TV
            </a>
            <span className="w-px h-3 bg-white/30" />
            <a href={CTA_LINKS.instagram} target="_blank" rel="noopener noreferrer"
               className="hover:text-white transition-colors">
              Instagram
            </a>
            <span className="w-px h-3 bg-white/30" />
            <a href={CTA_LINKS.facebook} target="_blank" rel="noopener noreferrer"
               className="hover:text-white transition-colors">
              Facebook
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className={cn(
        'transition-all duration-300 border-b',
        scrolled
          ? 'bg-hormadi-dark/95 backdrop-blur-xl border-hormadi-border shadow-xl shadow-black/20'
          : 'bg-hormadi-dark/60 backdrop-blur-md border-white/5'
      )}>
        <div className="section-padding flex items-center justify-between h-14 lg:h-16">
          {/* Logo + name */}
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <LogoImage />
            <div className="hidden sm:block">
              <div className="font-black text-base leading-none text-white tracking-tight">
                Hormadi
              </div>
              <div className="text-[10px] text-hormadi-muted uppercase tracking-[0.2em] mt-0.5">
                Pays Basque
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 relative',
                  pathname === link.href
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-hormadi-red rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* CTA buttons + mobile toggle */}
          <div className="flex items-center gap-2">
            <Link href={CTA_LINKS.billetterie}
                  className="hidden lg:inline-flex btn-primary text-sm !py-2 !px-4 gap-1.5">
              <Ticket size={15} />
              Billetterie
            </Link>
            <Link href={CTA_LINKS.boutique}
                  className="hidden lg:inline-flex btn-secondary text-sm !py-2 !px-4 gap-1.5">
              <ShoppingBag size={15} />
              Boutique
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
              aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={cn(
          'lg:hidden overflow-hidden transition-all duration-300',
          mobileOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        )}>
          <div className="bg-hormadi-dark/98 backdrop-blur-xl border-t border-white/5">
            <div className="section-padding py-4 space-y-1">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    pathname === link.href
                      ? 'text-white bg-hormadi-red/10 border-l-2 border-hormadi-red'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                  <ChevronRight size={16} className="text-hormadi-muted" />
                </Link>
              ))}

              <div className="pt-4 grid grid-cols-2 gap-2">
                <Link href={CTA_LINKS.billetterie}
                      className="btn-primary text-sm gap-1.5">
                  <Ticket size={16} />
                  Billetterie
                </Link>
                <Link href={CTA_LINKS.boutique}
                      className="btn-secondary text-sm gap-1.5">
                  <ShoppingBag size={16} />
                  Boutique
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
