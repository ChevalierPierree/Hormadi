'use client'

import { useRef, useState } from 'react'
import { Play, Tv } from 'lucide-react'
import { CTA_LINKS } from '@/lib/constants'

export default function MagnusVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  const handlePlay = () => {
    setPlaying(true)
    videoRef.current?.play()
  }

  return (
    <section className="relative py-20 sm:py-28 bg-hormadi-dark overflow-hidden">
      <div className="section-padding max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-600/15 border border-blue-500/30 rounded-full px-4 py-1.5 mb-4">
            <Tv size={14} className="text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Magnus TV</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
            Ne manquez plus <span className="text-hormadi-red">aucun match</span>
          </h2>
          <p className="text-hormadi-muted mt-4 max-w-xl mx-auto text-sm sm:text-base">
            L&apos;intégralité de la saison en direct HD, où que vous soyez.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden border border-hormadi-border bg-black shadow-2xl">
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              src="/videos/magnus-tv.mp4"
              poster="/images/cta-magnustv-video-poster.jpg"
              controls={playing}
              preload="none"
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            />

            {!playing && (
              <button
                onClick={handlePlay}
                aria-label="Lancer la vidéo Magnus TV"
                className="group absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-colors duration-300"
              >
                <span className="w-20 h-20 rounded-full bg-hormadi-red flex items-center justify-center
                                  group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-black/40">
                  <Play size={30} className="text-white fill-white ml-1" />
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href={CTA_LINKS.magnusTV}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-bold
                       px-8 py-3.5 rounded-lg hover:bg-blue-700 transition-all
                       hover:shadow-lg hover:shadow-blue-600/30 text-sm uppercase tracking-wider"
          >
            S&apos;abonner à Magnus TV
          </a>
        </div>
      </div>
    </section>
  )
}
