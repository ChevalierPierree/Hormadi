'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Save, X, RefreshCw } from 'lucide-react'

interface Match {
  id: string
  date: string
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  venue: string
  status: string
  isHomeGame: boolean
  competition?: string
}

const EMPTY_FORM = {
  date: '',
  time: '20:30',
  homeTeam: 'Hormadi Anglet',
  awayTeam: '',
  venue: 'Patinoire de la Barre',
  status: 'scheduled',
  competition: 'Ligue Magnus',
  isHomeGame: true,
  homeScore: '',
  awayScore: '',
}

export default function AdminMatchsPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [editScoreId, setEditScoreId] = useState<string | null>(null)
  const [scoreForm, setScoreForm] = useState({ home: 0, away: 0 })

  const fetchMatches = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/matches?limit=50')
      const data = await res.json()
      setMatches(data.matches || [])
    } catch (e) {
      console.error('Error fetching matches:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMatches() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.awayTeam || !form.date) return
    setSaving(true)

    const dateTime = new Date(`${form.date}T${form.time || '20:30'}:00`)
    const body: any = {
      homeTeam: form.isHomeGame ? 'Hormadi Anglet' : form.awayTeam,
      awayTeam: form.isHomeGame ? form.awayTeam : 'Hormadi Anglet',
      date: dateTime.toISOString(),
      venue: form.venue,
      status: form.status,
      competition: form.competition,
      isHomeGame: form.isHomeGame,
    }

    if (form.status === 'finished') {
      body.homeScore = parseInt(form.homeScore) || 0
      body.awayScore = parseInt(form.awayScore) || 0
    }

    try {
      const url = editingId ? `/api/matches/${editingId}` : '/api/matches'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'Erreur lors de la sauvegarde')
        return
      }
      setShowForm(false)
      setEditingId(null)
      setForm(EMPTY_FORM)
      fetchMatches()
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (match: Match) => {
    const d = new Date(match.date)
    setEditingId(match.id)
    setForm({
      date: d.toISOString().split('T')[0],
      time: d.toTimeString().slice(0, 5),
      homeTeam: match.homeTeam,
      awayTeam: match.isHomeGame ? match.awayTeam : match.homeTeam,
      venue: match.venue,
      status: match.status,
      competition: (match as any).competition || '',
      isHomeGame: match.isHomeGame,
      homeScore: match.homeScore?.toString() || '',
      awayScore: match.awayScore?.toString() || '',
    })
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce match ?')) return
    try {
      const res = await fetch(`/api/matches/${id}`, { method: 'DELETE' })
      if (res.ok) fetchMatches()
      else alert('Erreur lors de la suppression')
    } catch {
      alert('Erreur réseau')
    }
  }

  const handleSaveScore = async (matchId: string) => {
    try {
      const res = await fetch(`/api/matches/${matchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          homeScore: scoreForm.home,
          awayScore: scoreForm.away,
          status: 'finished',
        }),
      })
      if (res.ok) {
        setEditScoreId(null)
        fetchMatches()
      } else {
        alert('Erreur lors de la mise à jour du score')
      }
    } catch {
      alert('Erreur réseau')
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      finished: { label: 'Terminé', cls: 'bg-gray-600/30 text-gray-300 border border-gray-500/50' },
      scheduled: { label: 'À venir', cls: 'bg-hormadi-ocean/20 text-hormadi-ocean border border-hormadi-ocean/50' },
      live: { label: 'En direct', cls: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' },
      postponed: { label: 'Reporté', cls: 'bg-yellow-900/30 text-yellow-300 border border-yellow-700/50' },
    }
    const s = map[status] || { label: status, cls: 'bg-hormadi-border text-hormadi-muted' }
    return <span className={`${s.cls} px-3 py-1 rounded text-xs font-semibold`}>{s.label}</span>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Gestion des matchs</h1>
          <p className="text-hormadi-muted text-sm">Créez et gérez les matchs, entrez les scores</p>
        </div>
        <button onClick={fetchMatches} className="text-hormadi-muted hover:text-white transition-colors">
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div>
        <div className="mb-6">
          {!showForm && (
            <button
              onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setShowForm(true) }}
              className="btn-primary px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus size={16} /> Ajouter un match
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-8">
            <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                {editingId ? 'Modifier le match' : 'Nouveau match'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Date</label>
                    <input type="date" value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })}
                      className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white" required />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Heure</label>
                    <input type="time" value={form.time}
                      onChange={e => setForm({ ...form, time: e.target.value })}
                      className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white" required />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Domicile / Extérieur</label>
                    <select value={form.isHomeGame ? 'home' : 'away'}
                      onChange={e => setForm({ ...form, isHomeGame: e.target.value === 'home' })}
                      className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white">
                      <option value="home">Domicile</option>
                      <option value="away">Extérieur</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Adversaire</label>
                    <input type="text" value={form.awayTeam}
                      onChange={e => setForm({ ...form, awayTeam: e.target.value })}
                      className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white"
                      placeholder="ex: Dragons de Rouen" required />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Lieu</label>
                    <input type="text" value={form.venue}
                      onChange={e => setForm({ ...form, venue: e.target.value })}
                      className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Compétition</label>
                  <select value={form.competition}
                    onChange={e => setForm({ ...form, competition: e.target.value })}
                    className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white">
                    <option value="Ligue Magnus">Ligue Magnus</option>
                    <option value="Poule de Maintien">Poule de Maintien</option>
                    <option value="Coupe de France">Coupe de France</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Statut</label>
                  <select value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white">
                    <option value="scheduled">À venir</option>
                    <option value="live">En direct</option>
                    <option value="finished">Terminé</option>
                    <option value="postponed">Reporté</option>
                  </select>
                </div>

                {form.status === 'finished' && (
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Score {form.isHomeGame ? 'Hormadi' : 'Adversaire'} (dom.)
                      </label>
                      <input type="number" min="0" value={form.homeScore}
                        onChange={e => setForm({ ...form, homeScore: e.target.value })}
                        className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white" />
                    </div>
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Score {form.isHomeGame ? 'Adversaire' : 'Hormadi'} (ext.)
                      </label>
                      <input type="number" min="0" value={form.awayScore}
                        onChange={e => setForm({ ...form, awayScore: e.target.value })}
                        className="w-full px-3 py-2 bg-hormadi-dark border border-hormadi-border rounded-lg text-white" />
                    </div>
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button type="submit" disabled={saving}
                    className="btn-primary flex-1 py-2 rounded-lg font-semibold disabled:opacity-50">
                    {saving ? 'Enregistrement...' : editingId ? 'Mettre à jour' : 'Créer le match'}
                  </button>
                  <button type="button"
                    onClick={() => { setShowForm(false); setEditingId(null) }}
                    className="px-6 py-2 rounded-lg font-semibold bg-hormadi-border text-hormadi-muted hover:text-white transition-colors">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <div className="bg-hormadi-surface border border-hormadi-border rounded-xl overflow-hidden">
            <div className="p-6 border-b border-hormadi-border">
              <h3 className="text-xl font-bold text-white">
                Tous les matchs ({matches.length})
              </h3>
            </div>

            {loading ? (
              <div className="p-12 text-center text-hormadi-muted">Chargement...</div>
            ) : matches.length === 0 ? (
              <div className="p-12 text-center text-hormadi-muted">
                Aucun match. Commencez par en ajouter un.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-hormadi-border">
                      <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Date</th>
                      <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Match</th>
                      <th className="text-center py-3 px-4 text-hormadi-muted font-semibold text-sm">Score</th>
                      <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Lieu</th>
                      <th className="text-center py-3 px-4 text-hormadi-muted font-semibold text-sm">Statut</th>
                      <th className="text-center py-3 px-4 text-hormadi-muted font-semibold text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((match) => (
                      <tr key={match.id} className="border-b border-hormadi-border/50 hover:bg-hormadi-border/30 transition-colors">
                        <td className="py-4 px-4">
                          <div className="text-white font-semibold text-sm">{formatDate(match.date)}</div>
                          <div className="text-hormadi-muted text-xs">{formatTime(match.date)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white font-semibold text-sm">
                            {match.homeTeam}
                          </div>
                          <div className="text-hormadi-muted text-xs">
                            vs {match.awayTeam}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {editScoreId === match.id ? (
                            <div className="flex items-center justify-center gap-1">
                              <input type="number" min="0" value={scoreForm.home}
                                onChange={e => setScoreForm({ ...scoreForm, home: parseInt(e.target.value) || 0 })}
                                className="w-12 px-1 py-1 bg-hormadi-dark border border-hormadi-border rounded text-white text-center text-sm" />
                              <span className="text-hormadi-muted">-</span>
                              <input type="number" min="0" value={scoreForm.away}
                                onChange={e => setScoreForm({ ...scoreForm, away: parseInt(e.target.value) || 0 })}
                                className="w-12 px-1 py-1 bg-hormadi-dark border border-hormadi-border rounded text-white text-center text-sm" />
                              <button onClick={() => handleSaveScore(match.id)}
                                className="text-emerald-400 hover:text-emerald-300 ml-1">
                                <Save size={14} />
                              </button>
                              <button onClick={() => setEditScoreId(null)}
                                className="text-hormadi-muted hover:text-white ml-1">
                                <X size={14} />
                              </button>
                            </div>
                          ) : match.homeScore !== null ? (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-white font-bold">{match.homeScore}</span>
                              <span className="text-hormadi-muted">-</span>
                              <span className="text-white font-bold">{match.awayScore}</span>
                              <button onClick={() => {
                                setEditScoreId(match.id)
                                setScoreForm({ home: match.homeScore || 0, away: match.awayScore || 0 })
                              }} className="text-hormadi-muted hover:text-hormadi-red ml-2">
                                <Edit2 size={12} />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => {
                              setEditScoreId(match.id)
                              setScoreForm({ home: 0, away: 0 })
                            }} className="text-hormadi-ocean hover:text-hormadi-red text-xs underline">
                              Entrer score
                            </button>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-hormadi-muted text-sm">{match.venue}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {statusBadge(match.status)}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleEdit(match)}
                              className="text-hormadi-muted hover:text-hormadi-red transition-colors">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => handleDelete(match.id)}
                              className="text-hormadi-muted hover:text-red-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
      </div>
    </div>
  )
}
