'use client'

import { useState } from 'react'
import { findTeam, TEAMS } from '@/lib/constants'

interface TeamLogoProps {
  /** Team name, abbreviation, or key (e.g. "Rouen", "ROU", "rouen", "Dragons de Rouen") */
  team: string
  /** Size in pixels (default: 40) */
  size?: number
  /** Extra CSS classes for the container */
  className?: string
  /** Whether this is the Hormadi team (uses red bg for fallback) */
  isHormadi?: boolean
}

export default function TeamLogo({ team, size = 40, className = '', isHormadi }: TeamLogoProps) {
  const [error, setError] = useState(false)

  const matched = findTeam(team)
  const logo = matched?.logo
  const short = matched?.short || team.substring(0, 3).toUpperCase()
  const isAnglet = isHormadi ?? (matched?.name === 'Anglet')

  if (!logo || error) {
    return (
      <div
        className={`rounded-full flex items-center justify-center font-bold text-white
                     ${isAnglet ? 'bg-hormadi-red' : 'bg-hormadi-forest'} ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.28 }}
      >
        {short}
      </div>
    )
  }

  return (
    <div
      className={`rounded-full overflow-hidden flex items-center justify-center bg-white ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={logo}
        alt={matched?.fullName || team}
        width={size * 0.8}
        height={size * 0.8}
        className="object-contain"
        style={{ width: size * 0.8, height: size * 0.8 }}
        onError={() => setError(true)}
      />
    </div>
  )
}
