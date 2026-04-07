'use client'

import { useState, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface SeatInfo {
  id: string
  zone: string
  row: number
  seat: number
  x: number
  y: number
}

export interface ZoneConfig {
  id: string
  name: string
  categoryId: string
  price: number
  color: string
  type: 'seated' | 'standing'
  capacity: number
}

interface PatinaireSeatMapProps {
  zones: ZoneConfig[]
  soldSeats: Set<string>
  selectedSeats: string[]
  standingSelections: Record<string, number>
  onSeatClick: (seatId: string, zone: ZoneConfig) => void
  onStandingChange: (zoneId: string, quantity: number) => void
  maxSeats?: number
}

/* ─── Seat layout generation ──────────────────────────── */

function generateTribunePrincipale(): SeatInfo[] {
  const seats: SeatInfo[] = []
  const startY = 55
  const rowSpacing = 14
  const seatSpacing = 11
  const rows = 4

  // Cat3 Left: 4 rows x 20 seats
  for (let r = 0; r < rows; r++) {
    for (let s = 0; s < 20; s++) {
      seats.push({ id: `cat3l-R${r+1}-S${s+1}`, zone: 'cat3_left', row: r+1, seat: s+1, x: 50 + s * seatSpacing, y: startY + r * rowSpacing })
    }
  }
  // Cat2 Left: 4 rows x 25 seats
  for (let r = 0; r < rows; r++) {
    for (let s = 0; s < 25; s++) {
      seats.push({ id: `cat2l-R${r+1}-S${s+1}`, zone: 'cat2_left', row: r+1, seat: s+1, x: 280 + s * seatSpacing, y: startY + r * rowSpacing })
    }
  }
  // Cat1 Centre: 4 rows x 30 seats
  for (let r = 0; r < rows; r++) {
    for (let s = 0; s < 30; s++) {
      seats.push({ id: `cat1-R${r+1}-S${s+1}`, zone: 'cat1', row: r+1, seat: s+1, x: 570 + s * seatSpacing, y: startY + r * rowSpacing })
    }
  }
  // Cat2 Right: 4 rows x 25 seats
  for (let r = 0; r < rows; r++) {
    for (let s = 0; s < 25; s++) {
      seats.push({ id: `cat2r-R${r+1}-S${s+1}`, zone: 'cat2_right', row: r+1, seat: s+1, x: 920 + s * seatSpacing, y: startY + r * rowSpacing })
    }
  }
  // Cat3 Right: 4 rows x 20 seats
  for (let r = 0; r < rows; r++) {
    for (let s = 0; s < 20; s++) {
      seats.push({ id: `cat3r-R${r+1}-S${s+1}`, zone: 'cat3_right', row: r+1, seat: s+1, x: 1210 + s * seatSpacing, y: startY + r * rowSpacing })
    }
  }
  return seats
}

function generateTribunePropp(): SeatInfo[] {
  const seats: SeatInfo[] = []
  for (let r = 0; r < 4; r++) {
    for (let s = 0; s < 20; s++) {
      seats.push({ id: `propp-R${r+1}-S${s+1}`, zone: 'propp', row: r+1, seat: s+1, x: 12 + r * 14, y: 175 + s * 11 })
    }
  }
  return seats
}

function generateAllSeats(): SeatInfo[] {
  return [...generateTribunePrincipale(), ...generateTribunePropp()]
}

const ZONE_COLORS: Record<string, { fill: string; stroke: string; hover: string; label: string; labelBg: string }> = {
  propp:       { fill: '#ff69b4', stroke: '#ff1493', hover: '#ff85c8', label: 'Tribune Propp', labelBg: '#ff69b4' },
  cat1:        { fill: '#e4002b', stroke: '#c50025', hover: '#ff3355', label: 'Catégorie 1', labelBg: '#e4002b' },
  cat2_left:   { fill: '#1e40af', stroke: '#1e3a8a', hover: '#3b82f6', label: 'Catégorie 2', labelBg: '#1e40af' },
  cat2_right:  { fill: '#1e40af', stroke: '#1e3a8a', hover: '#3b82f6', label: 'Catégorie 2', labelBg: '#1e40af' },
  cat3_left:   { fill: '#ec4899', stroke: '#db2777', hover: '#f9a8d4', label: 'Catégorie 3', labelBg: '#ec4899' },
  cat3_right:  { fill: '#ec4899', stroke: '#db2777', hover: '#f9a8d4', label: 'Catégorie 3', labelBg: '#ec4899' },
  debout_left: { fill: '#22c55e', stroke: '#16a34a', hover: '#86efac', label: 'Debout', labelBg: '#22c55e' },
  debout_right:{ fill: '#22c55e', stroke: '#16a34a', hover: '#86efac', label: 'Debout', labelBg: '#22c55e' },
}

function formatPrice(cents: number) {
  return (cents / 100).toFixed(0) + '€'
}

export default function PatinaireSeatMap({
  zones,
  soldSeats,
  selectedSeats,
  standingSelections,
  onSeatClick,
  onStandingChange,
  maxSeats = 10,
}: PatinaireSeatMapProps) {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)

  const allSeats = useMemo(() => generateAllSeats(), [])

  const zoneMap = useMemo(() => {
    const map: Record<string, ZoneConfig> = {}
    zones.forEach((z) => map[z.id] = z)
    return map
  }, [zones])

  const totalSelected = selectedSeats.length + Object.values(standingSelections).reduce((a, b) => a + b, 0)

  const handleSeatHover = useCallback((seat: SeatInfo, svgX: number, svgY: number) => {
    const colors = ZONE_COLORS[seat.zone]
    const zone = zoneMap[seat.zone]
    const isSold = soldSeats.has(seat.id)
    const isSelected = selectedSeats.includes(seat.id)
    const status = isSold ? ' (Vendu)' : isSelected ? ' (Sélectionné)' : ''
    setHoveredSeat(seat.id)
    setTooltip({
      x: svgX,
      y: svgY - 22,
      text: `${colors?.label || seat.zone} — Rang ${seat.row}, Siège ${seat.seat}${status}${zone ? ` — ${formatPrice(zone.price)}` : ''}`,
    })
  }, [soldSeats, selectedSeats, zoneMap])

  const handleSeatLeave = useCallback(() => {
    setHoveredSeat(null)
    setTooltip(null)
  }, [])

  const handleSeatClick = useCallback((seat: SeatInfo) => {
    const zone = zoneMap[seat.zone]
    if (!zone || soldSeats.has(seat.id)) return
    onSeatClick(seat.id, zone)
  }, [zoneMap, soldSeats, onSeatClick])

  // Handle standing zone click: +1 place
  const handleStandingClick = useCallback((zoneId: string) => {
    const zone = zoneMap[zoneId]
    if (!zone) return
    const current = standingSelections[zoneId] || 0
    if (totalSelected >= maxSeats && current === 0) return
    if (current >= zone.capacity) return
    onStandingChange(zoneId, current + 1)
  }, [zoneMap, standingSelections, totalSelected, maxSeats, onStandingChange])

  // Handle standing zone right-click: -1 place
  const handleStandingRightClick = useCallback((e: React.MouseEvent, zoneId: string) => {
    e.preventDefault()
    const current = standingSelections[zoneId] || 0
    if (current <= 0) return
    onStandingChange(zoneId, current - 1)
  }, [standingSelections, onStandingChange])

  const viewBoxWidth = 1450
  const viewBoxHeight = 640

  // Zone label positions with background pill — prices from actual zones if available
  const getZonePrice = (zoneId: string): string => {
    const zone = zoneMap[zoneId]
    return zone ? formatPrice(zone.price) : '—'
  }
  const zoneLabels = [
    { x: 50 + 20*11/2, y: 42, text: 'CAT. 3', subtext: getZonePrice('cat3_left'), color: '#ec4899', w: 70 },
    { x: 280 + 25*11/2, y: 42, text: 'CAT. 2', subtext: getZonePrice('cat2_left'), color: '#1e40af', w: 70 },
    { x: 570 + 30*11/2, y: 42, text: 'CAT. 1', subtext: getZonePrice('cat1'), color: '#e4002b', w: 70 },
    { x: 920 + 25*11/2, y: 42, text: 'CAT. 2', subtext: getZonePrice('cat2_right'), color: '#1e40af', w: 70 },
    { x: 1210 + 20*11/2, y: 42, text: 'CAT. 3', subtext: getZonePrice('cat3_right'), color: '#ec4899', w: 70 },
  ]

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#9ca3af] border border-[#6b7280]" />
          <span className="text-hormadi-muted">Vendu</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-white border-2 border-[#fbbf24]" />
          <span className="text-hormadi-muted">Sélectionné</span>
        </span>
        {Object.entries(ZONE_COLORS).filter(([k]) => !k.includes('right')).map(([key, val]) => (
          <span key={key} className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: val.fill }} />
            <span className="text-hormadi-muted">{val.label}</span>
          </span>
        ))}
      </div>

      {/* SVG Map */}
      <div className="relative bg-hormadi-dark/50 rounded-xl overflow-hidden">
        <svg
          viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
          className="w-full h-auto"
          style={{ maxHeight: '65vh' }}
        >
          {/* Background */}
          <rect x="0" y="0" width={viewBoxWidth} height={viewBoxHeight} fill="#012e24" rx="12" />

          {/* ═══ ICE RINK ═══ */}
          <rect x="150" y="135" width="1150" height="370" rx="60" fill="#e8f4f8" stroke="#b0d4e8" strokeWidth="2" />
          <rect x="160" y="145" width="1130" height="350" rx="55" fill="none" stroke="#c0dce8" strokeWidth="1" />

          {/* Centre line */}
          <line x1="725" y1="145" x2="725" y2="495" stroke="#e4002b" strokeWidth="2" />
          {/* Blue lines */}
          <line x1="475" y1="145" x2="475" y2="495" stroke="#1e40af" strokeWidth="2" />
          <line x1="975" y1="145" x2="975" y2="495" stroke="#1e40af" strokeWidth="2" />
          {/* Centre circle */}
          <circle cx="725" cy="320" r="40" fill="none" stroke="#1e40af" strokeWidth="2" />
          <circle cx="725" cy="320" r="3" fill="#1e40af" />
          {/* Logo Hormadi sous la glace */}
          <image
            href="/images/logo-hormadi.png"
            x={725 - 55}
            y={320 - 55}
            width="110"
            height="110"
            opacity="0.3"
            style={{ pointerEvents: 'none' }}
          />
          {/* Goals */}
          <rect x="247" y="305" width="6" height="30" fill="#e4002b" rx="2" />
          <rect x="1197" y="305" width="6" height="30" fill="#e4002b" rx="2" />
          {/* Face-off circles */}
          {[375, 575, 875, 1075].map((cx) => [220, 420].map((cy) => (
            <g key={`${cx}-${cy}`}>
              <circle cx={cx} cy={cy} r="22" fill="none" stroke="#e4002b" strokeWidth="1" />
              <circle cx={cx} cy={cy} r="2.5" fill="#e4002b" />
            </g>
          )))}
          {/* GLACE text removed */}

          {/* ═══ TRIBUNE PRINCIPALE HEADER ═══ */}
          <rect x="550" y="5" width="350" height="22" rx="4" fill="white" fillOpacity="0.1" />
          <text x="725" y="21" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" letterSpacing="3">
            TRIBUNE PRINCIPALE
          </text>

          {/* ═══ Zone label pills ═══ */}
          {zoneLabels.map((lbl, i) => (
            <g key={i}>
              <rect x={lbl.x - lbl.w/2} y={lbl.y - 12} width={lbl.w} height="17" rx="8" fill={lbl.color} fillOpacity="0.9" />
              <text x={lbl.x - 8} y={lbl.y} textAnchor="middle" fill="white" fontSize="9" fontWeight="800">
                {lbl.text}
              </text>
              <text x={lbl.x + 22} y={lbl.y} textAnchor="middle" fill="white" fontSize="8" fontWeight="600" opacity="0.9">
                {lbl.subtext}
              </text>
            </g>
          ))}

          {/* ═══ SEATED SECTIONS ═══ */}
          {allSeats.map((seat) => {
            const isSold = soldSeats.has(seat.id)
            const isSelected = selectedSeats.includes(seat.id)
            const isHovered = hoveredSeat === seat.id
            const colors = ZONE_COLORS[seat.zone]
            const canSelect = !isSold && (isSelected || totalSelected < maxSeats)

            let fill = colors?.fill || '#888'
            let stroke = colors?.stroke || '#666'
            let opacity = 1

            if (isSold) {
              fill = '#4b5563'; stroke = '#374151'; opacity = 0.35
            } else if (isSelected) {
              fill = '#ffffff'; stroke = '#fbbf24'
            } else if (isHovered && canSelect) {
              fill = colors?.hover || fill
            }

            return (
              <circle
                key={seat.id}
                cx={seat.x}
                cy={seat.y}
                r={isSelected ? 5 : isHovered ? 5 : 4}
                fill={fill}
                stroke={stroke}
                strokeWidth={isSelected ? 2.5 : 1}
                opacity={opacity}
                className={cn(
                  'transition-all duration-100',
                  isSold ? 'cursor-not-allowed' : canSelect ? 'cursor-pointer' : 'cursor-default'
                )}
                onMouseEnter={() => handleSeatHover(seat, seat.x, seat.y)}
                onMouseLeave={handleSeatLeave}
                onClick={() => canSelect && handleSeatClick(seat)}
              />
            )
          })}

          {/* ═══ TRIBUNE PROPP LABEL ═══ */}
          <rect x="2" y="145" width="70" height="16" rx="8" fill="#ff69b4" fillOpacity="0.9" />
          <text x="37" y="156" textAnchor="middle" fill="white" fontSize="8" fontWeight="800">
            PROPP · {getZonePrice('propp')}
          </text>

          {/* ═══ DEBOUT ZONES (clickable) ═══ */}
          {/* Debout Gauche */}
          <g
            className="cursor-pointer"
            onClick={() => handleStandingClick('debout_left')}
            onContextMenu={(e) => handleStandingRightClick(e, 'debout_left')}
            onMouseEnter={() => {
              setHoveredZone('debout_left')
              const zone = zoneMap['debout_left']
              const qty = standingSelections['debout_left'] || 0
              setTooltip({ x: 107, y: 165, text: `Debout Gauche — ${zone ? formatPrice(zone.price) : '—'} — Clic = +1 place${qty > 0 ? ` (${qty} sélectionnée${qty > 1 ? 's' : ''})` : ''}` })
            }}
            onMouseLeave={() => { setHoveredZone(null); setTooltip(null) }}
          >
            <rect
              x="80" y="185" width="55" height="200" rx="6"
              fill={hoveredZone === 'debout_left' ? '#2dd36f' : '#22c55e'}
              fillOpacity={standingSelections['debout_left'] ? 0.5 : 0.25}
              stroke="#22c55e"
              strokeWidth={hoveredZone === 'debout_left' ? 2.5 : 1}
            />
            <text x="107" y="275" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="800" className="pointer-events-none">
              DEBOUT
            </text>
            <text x="107" y="290" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="600" opacity="0.8" className="pointer-events-none">
              {getZonePrice('debout_left')}
            </text>
            {(standingSelections['debout_left'] || 0) > 0 && (
              <g className="pointer-events-none">
                <circle cx="107" cy="315" r="14" fill="#22c55e" />
                <text x="107" y="320" textAnchor="middle" fill="white" fontSize="12" fontWeight="900">
                  {standingSelections['debout_left']}
                </text>
              </g>
            )}
          </g>

          {/* Debout Droite */}
          <g
            className="cursor-pointer"
            onClick={() => handleStandingClick('debout_right')}
            onContextMenu={(e) => handleStandingRightClick(e, 'debout_right')}
            onMouseEnter={() => {
              setHoveredZone('debout_right')
              const zone = zoneMap['debout_right']
              const qty = standingSelections['debout_right'] || 0
              setTooltip({ x: 1342, y: 165, text: `Debout Droite — ${zone ? formatPrice(zone.price) : '—'} — Clic = +1 place${qty > 0 ? ` (${qty} sélectionnée${qty > 1 ? 's' : ''})` : ''}` })
            }}
            onMouseLeave={() => { setHoveredZone(null); setTooltip(null) }}
          >
            <rect
              x="1315" y="185" width="55" height="200" rx="6"
              fill={hoveredZone === 'debout_right' ? '#2dd36f' : '#22c55e'}
              fillOpacity={standingSelections['debout_right'] ? 0.5 : 0.25}
              stroke="#22c55e"
              strokeWidth={hoveredZone === 'debout_right' ? 2.5 : 1}
            />
            <text x="1342" y="275" textAnchor="middle" fill="#22c55e" fontSize="11" fontWeight="800" className="pointer-events-none">
              DEBOUT
            </text>
            <text x="1342" y="290" textAnchor="middle" fill="#22c55e" fontSize="9" fontWeight="600" opacity="0.8" className="pointer-events-none">
              {getZonePrice('debout_right')}
            </text>
            {(standingSelections['debout_right'] || 0) > 0 && (
              <g className="pointer-events-none">
                <circle cx="1342" cy="315" r="14" fill="#22c55e" />
                <text x="1342" y="320" textAnchor="middle" fill="white" fontSize="12" fontWeight="900">
                  {standingSelections['debout_right']}
                </text>
              </g>
            )}
          </g>

          {/* ═══ LOGES (bottom) ═══ */}
          {Array.from({ length: 10 }).map((_, i) => (
            <rect key={`loge-${i}`} x={275 + i*92} y={530} width={82} height={45} rx="4" fill="#f59e0b" fillOpacity={0.25} stroke="#f59e0b" strokeWidth={1} />
          ))}
          <text x="725" y="595" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="700" letterSpacing="2">
            LOGES — HOSPITALITÉS
          </text>

          {/* ═══ Tooltip ═══ */}
          {tooltip && (
            <g className="pointer-events-none">
              <rect
                x={Math.max(5, Math.min(tooltip.x - 140, viewBoxWidth - 290))}
                y={tooltip.y - 16}
                width="280"
                height="26"
                rx="6"
                fill="#0a0a1a"
                stroke="#444"
                strokeWidth="1"
                opacity="0.97"
              />
              <text
                x={Math.max(145, Math.min(tooltip.x, viewBoxWidth - 145))}
                y={tooltip.y + 1}
                textAnchor="middle"
                fill="white"
                fontSize="10"
                fontWeight="600"
              >
                {tooltip.text}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Standing hint */}
      <p className="text-hormadi-muted/50 text-xs mt-2 text-center">
        Zones debout : cliquez sur la zone verte pour ajouter une place, clic droit pour retirer.
      </p>
    </div>
  )
}
