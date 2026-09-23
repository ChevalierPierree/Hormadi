'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX, ArrowUpRight } from 'lucide-react'
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

        {/* Bottom overlay controls */}
        <div className="absolute bottom-0 inset-x-0 pb-6 sm:pb-10 section-padding flex items-center justify-end gap-3">
          {/* Mute toggle */}
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

          {/* Link to Magnus TV */}
          <a
            href={CTA_LINKS.magnusTV}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Voir Magnus TV"
            className="flex-shrink-0 h-11 sm:h-12 rounded-full bg-black/50 border border-white/20
                       backdrop-blur-sm flex items-center gap-1.5 px-4 sm:px-5 hover:bg-black/70 transition-colors"
          >
            <span className="text-white text-xs sm:text-sm font-medium">Magnus TV</span>
            <ArrowUpRight size={18} className="text-white" />
          </a>
        </div>
      </div>
    </section>
  )
}
