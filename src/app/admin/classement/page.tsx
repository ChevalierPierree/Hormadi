'use client'

import { useState, useEffect } from 'react'
import { ArrowUp, ArrowDown, Save, Loader, RefreshCw } from 'lucide-react'

type Standing = {
  id: string
  team: string
  rank: number
  gp: number
  w: number
  l: number
  otw: number
  otl: number
  gf: number
  ga: number
  pts: number
}

export default function AdminClassementPage() {
  const [standings, setStandings] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const fetchStandings = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/standings')
      const data = await res.json()
      setStandings((data.standings || []).sort((a: Standing, b: Standing) => a.rank - b.rank))
    } catch (e) {
      console.error('Error fetching standings:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchStandings() }, [])

  const handleFieldChange = (id: string, field: keyof Standing, value: number) => {
    setStandings(standings.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleMoveTeam = (id: string, direction: 'up' | 'down') => {
    const idx = standings.findIndex(s => s.id === id)
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === standings.length - 1)) return
    const newStandings = [...standings]
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1
    ;[newStandings[idx], newStandings[targetIdx]] = [newStandings[targetIdx], newStandings[idx]]
    newStandings.forEach((s, i) => { s.rank = i + 1 })
    setStandings(newStandings)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch('/api/standings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(standings),
      })
      if (res.ok) {
        setMessage({ text: 'Classement mis à jour avec succès', type: 'success' })
      } else {
        const err = await res.json()
        setMessage({ text: err.error || 'Erreur lors de la mise à jour', type: 'error' })
      }
    } catch {
      setMessage({ text: 'Erreur réseau', type: 'error' })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 4000)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-hormadi-red" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Classement</h1>
          <p className="text-hormadi-muted text-sm">Gestion du classement Ligue Magnus</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchStandings} className="text-hormadi-muted hover:text-white transition-colors">
            <RefreshCw size={18} />
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border text-sm ${message.type === 'success' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
          {message.text}
        </div>
      )}

      {standings.length === 0 ? (
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-12 text-center text-hormadi-muted">
          Aucune équipe dans le classement. Ajoutez-en via la base de données.
        </div>
      ) : (
        <div className="bg-hormadi-surface border border-hormadi-border rounded-xl overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-hormadi-border">
              <tr>
                <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-xs">#</th>
                <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-xs">Équipe</th>
                <th className="text-center py-3 px-2 text-hormadi-muted font-semibold text-xs">PJ</th>
                <th className="text-center py-3 px-2 text-hormadi-muted font-semibold text-xs">V</th>
                <th className="text-center py-3 px-2 text-hormadi-muted font-semibold text-xs">D</th>
                <th className="text-center py-3 px-2 text-hormadi-muted font-semibold text-xs">VP</th>
                <th className="text-center py-3 px-2 text-hormadi-muted font-semibold text-xs">DP</th>
                <th className="text-center py-3 px-2 text-hormadi-muted font-semibold text-xs">BP</th>
                <th className="text-center py-3 px-2 text-hormadi-muted font-semibold text-xs">BC</th>
                <th className="text-center py-3 px-2 text-hormadi-muted font-semibold text-xs">Diff</th>
                <th className="text-center py-3 px-2 text-hormadi-muted font-semibold text-xs">PTS</th>
                <th className="text-center py-3 px-2 text-hormadi-muted font-semibold text-xs">Ordre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hormadi-border/50">
              {standings.map((team) => {
                const diff = team.gf - team.ga
                const isHormadi = team.team.toLowerCase().includes('anglet') || team.team.toLowerCase().includes('hormadi')
                return (
                  <tr key={team.id} className={`hover:bg-hormadi-border/20 ${isHormadi ? 'bg-hormadi-red/5 border-l-2 border-l-hormadi-red' : ''}`}>
                    <td className="py-3 px-4">
                      <span className="text-white font-bold">{team.rank}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-semibold text-sm ${isHormadi ? 'text-hormadi-red' : 'text-white'}`}>
                        {team.team}
                      </span>
                    </td>
                    {(['gp', 'w', 'l', 'otw', 'otl', 'gf', 'ga'] as const).map((field) => (
                      <td key={field} className="py-3 px-1 text-center">
                        <input
                          type="number"
                          value={team[field]}
                          onChange={(e) => handleFieldChange(team.id, field, parseInt(e.target.value) || 0)}
                          className="w-12 h-8 px-1 bg-hormadi-dark/60 border border-hormadi-border rounded text-white text-center text-sm focus:border-hormadi-red/50 focus:outline-none"
                          min="0"
                        />
                      </td>
                    ))}
                    <td className="py-3 px-2 text-center">
                      <span className={`font-semibold text-sm ${diff > 0 ? 'text-green-400' : diff < 0 ? 'text-red-400' : 'text-hormadi-muted'}`}>
                        {diff >= 0 ? '+' : ''}{diff}
                      </span>
                    </td>
                    <td className="py-3 px-1 text-center">
                      <input
                        type="number"
                        value={team.pts}
                        onChange={(e) => handleFieldChange(team.id, 'pts', parseInt(e.target.value) || 0)}
                        className="w-12 h-8 px-1 bg-hormadi-dark/60 border border-hormadi-border rounded text-white text-center text-sm font-bold focus:border-hormadi-red/50 focus:outline-none"
                        min="0"
                      />
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center gap-0.5">
                        <button onClick={() => handleMoveTeam(team.id, 'up')} disabled={team.rank === 1}
                          className="p-1 text-hormadi-muted hover:text-white disabled:opacity-30 transition-colors">
                          <ArrowUp size={14} />
                        </button>
                        <button onClick={() => handleMoveTeam(team.id, 'down')} disabled={team.rank === standings.length}
                          className="p-1 text-hormadi-muted hover:text-white disabled:opacity-30 transition-colors">
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Legend */}
      <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-white mb-3">Légende</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div><span className="text-hormadi-muted">PJ</span> <span className="text-white ml-1">Parties Jouées</span></div>
          <div><span className="text-hormadi-muted">V / D</span> <span className="text-white ml-1">Victoires / Défaites</span></div>
          <div><span className="text-hormadi-muted">VP / DP</span> <span className="text-white ml-1">Victoires / Défaites Prolongations</span></div>
          <div><span className="text-hormadi-muted">BP / BC</span> <span className="text-white ml-1">Buts Pour / Contre</span></div>
        </div>
      </div>
    </div>
  )
}
