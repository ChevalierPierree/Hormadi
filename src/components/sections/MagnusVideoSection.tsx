'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { CTA_LINKS } from '@/lib/constants'

export default function MagnusVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.4 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative bg-black overflow-hidden">
      <div className="relative w-full aspect-video sm:aspect-[21/9]">
        <video
          ref={videoRef}
          src="/videos/magnus-tv.mp4"
          poster="/images/cta-magnustv-video-poster.jpg"
          muted={muted}
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Vignette top */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
        {/* Vignette bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        {/* Top overlay content */}
        <div className="absolute top-0 inset-x-0 pt-6 sm:pt-10 section-padding">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-400/40 rounded-full px-4 py-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Magnus TV</span>
          </div>
          <h2 className="mt-3 text-2xl sm:text-4xl lg:text-5xl font-black leading-tight text-white drop-shadow-lg">
            Ne manquez plus <span className="text-hormadi-red">aucun match</span>
          </h2>
        </div>

        {/* Bottom overlay content */}
        <div className="absolute bottom-0 inset-x-0 pb-6 sm:pb-10 section-padding flex items-end justify-between gap-4">
          <a
            href={CTA_LINKS.magnusTV}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold
                       px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg hover:bg-blue-700 transition-all
                       hover:shadow-lg hover:shadow-blue-600/30 text-xs sm:text-sm uppercase tracking-wider"
          >
            S&apos;abonner à Magnus TV
          </a>

          {/* Mute toggle — the only playback control */}
          <button
            onClick={() => setMuted(m => !m)}
            aria-label={muted ? 'Activer le son' : 'Couper le son'}
            className="flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/50 border border-white/20
                       backdrop-blur-sm flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            {muted ? (
              <VolumeX size={20} className="text-white" />
            ) : (
              <Volume2 size={20} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </section>
  )
}
