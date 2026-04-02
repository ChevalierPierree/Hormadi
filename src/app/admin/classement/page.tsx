'use client'

import { useState } from 'react'
import { ArrowUp, ArrowDown, Save } from 'lucide-react'

type Team = {
  id: string
  rank: number
  name: string
  pj: number
  v: number
  d: number
  vp: number
  dp: number
  bp: number
  bc: number
  pts: number
  isHormadi: boolean
}

type TeamFormData = {
  [key: string]: number
}

const demoTeams: Team[] = [
  {
    id: '1',
    rank: 1,
    name: 'Paris',
    pj: 32,
    v: 24,
    d: 4,
    vp: 3,
    dp: 1,
    bp: 115,
    bc: 62,
    pts: 77,
    isHormadi: false,
  },
  {
    id: '2',
    rank: 2,
    name: 'Lyon',
    pj: 32,
    v: 22,
    d: 6,
    vp: 2,
    dp: 2,
    bp: 108,
    bc: 75,
    pts: 73,
    isHormadi: false,
  },
  {
    id: '3',
    rank: 3,
    name: 'Hormadi Anglet',
    pj: 32,
    v: 20,
    d: 8,
    vp: 2,
    dp: 2,
    bp: 98,
    bc: 78,
    pts: 66,
    isHormadi: true,
  },
  {
    id: '4',
    rank: 4,
    name: 'Marseille',
    pj: 32,
    v: 18,
    d: 10,
    vp: 2,
    dp: 2,
    bp: 92,
    bc: 85,
    pts: 60,
    isHormadi: false,
  },
  {
    id: '5',
    rank: 5,
    name: 'Bordeaux',
    pj: 32,
    v: 16,
    d: 12,
    vp: 2,
    dp: 2,
    bp: 85,
    bc: 88,
    pts: 54,
    isHormadi: false,
  },
  {
    id: '6',
    rank: 6,
    name: 'Nice',
    pj: 32,
    v: 15,
    d: 13,
    vp: 1,
    dp: 3,
    bp: 82,
    bc: 90,
    pts: 51,
    isHormadi: false,
  },
  {
    id: '7',
    rank: 7,
    name: 'Nantes',
    pj: 32,
    v: 14,
    d: 14,
    vp: 1,
    dp: 3,
    bp: 79,
    bc: 92,
    pts: 48,
    isHormadi: false,
  },
  {
    id: '8',
    rank: 8,
    name: 'Rennes',
    pj: 32,
    v: 12,
    d: 16,
    vp: 2,
    dp: 2,
    bp: 75,
    bc: 95,
    pts: 44,
    isHormadi: false,
  },
  {
    id: '9',
    rank: 9,
    name: 'Toulouse',
    pj: 32,
    v: 10,
    d: 18,
    vp: 1,
    dp: 3,
    bp: 68,
    bc: 102,
    pts: 38,
    isHormadi: false,
  },
  {
    id: '10',
    rank: 10,
    name: 'Roanne',
    pj: 32,
    v: 8,
    d: 20,
    vp: 2,
    dp: 2,
    bp: 61,
    bc: 108,
    pts: 34,
    isHormadi: false,
  },
  {
    id: '11',
    rank: 11,
    name: 'Angers',
    pj: 32,
    v: 6,
    d: 22,
    vp: 1,
    dp: 3,
    bp: 54,
    bc: 115,
    pts: 28,
    isHormadi: false,
  },
  {
    id: '12',
    rank: 12,
    name: 'Metz',
    pj: 32,
    v: 4,
    d: 24,
    vp: 1,
    dp: 3,
    bp: 48,
    bc: 125,
    pts: 22,
    isHormadi: false,
  },
]

export default function AdminClassementPage() {
  const [teams, setTeams] = useState<Team[]>(demoTeams)
  const [formData, setFormData] = useState<TeamFormData>(
    demoTeams.reduce((acc, team) => {
      acc[`${team.id}-pj`] = team.pj
      acc[`${team.id}-v`] = team.v
      acc[`${team.id}-d`] = team.d
      acc[`${team.id}-vp`] = team.vp
      acc[`${team.id}-dp`] = team.dp
      acc[`${team.id}-bp`] = team.bp
      acc[`${team.id}-bc`] = team.bc
      acc[`${team.id}-pts`] = team.pts
      return acc
    }, {} as TeamFormData)
  )

  const handleFieldChange = (teamId: string, field: string, value: number) => {
    setFormData({
      ...formData,
      [`${teamId}-${field}`]: value,
    })
  }

  const handleMoveTeam = (teamId: string, direction: 'up' | 'down') => {
    const currentIndex = teams.findIndex((t) => t.id === teamId)
    if (
      (direction === 'up' && currentIndex > 0) ||
      (direction === 'down' && currentIndex < teams.length - 1)
    ) {
      const newTeams = [...teams]
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      ;[newTeams[currentIndex], newTeams[targetIndex]] = [
        newTeams[targetIndex],
        newTeams[currentIndex],
      ]

      newTeams.forEach((team, index) => {
        team.rank = index + 1
      })

      setTeams(newTeams)
    }
  }

  const handleSave = () => {
    const updatedTeams = teams.map((team) => ({
      ...team,
      pj: formData[`${team.id}-pj`] || team.pj,
      v: formData[`${team.id}-v`] || team.v,
      d: formData[`${team.id}-d`] || team.d,
      vp: formData[`${team.id}-vp`] || team.vp,
      dp: formData[`${team.id}-dp`] || team.dp,
      bp: formData[`${team.id}-bp`] || team.bp,
      bc: formData[`${team.id}-bc`] || team.bc,
      pts: formData[`${team.id}-pts`] || team.pts,
    }))

    setTeams(updatedTeams)
    alert('Classement mis à jour (simulé)')
  }

  const getTeamColor = (isHormadi: boolean) =>
    isHormadi ? 'bg-hormadi-surface border-hormadi-red' : ''

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Classement</h1>
          <p className="text-hormadi-muted">
            Gestion du classement de la ligue
          </p>
        </div>
        <button
          onClick={handleSave}
          className="btn-primary inline-flex items-center gap-2"
        >
          <Save size={20} />
          Mettre à jour
        </button>
      </div>

      <div className="card-glass overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-hormadi-border">
            <tr>
              <th className="text-left py-4 px-4 text-hormadi-muted font-semibold text-sm">
                Rang
              </th>
              <th className="text-left py-4 px-4 text-hormadi-muted font-semibold text-sm">
                Équipe
              </th>
              <th className="text-center py-4 px-2 text-hormadi-muted font-semibold text-sm">
                PJ
              </th>
              <th className="text-center py-4 px-2 text-hormadi-muted font-semibold text-sm">
                V
              </th>
              <th className="text-center py-4 px-2 text-hormadi-muted font-semibold text-sm">
                D
              </th>
              <th className="text-center py-4 px-2 text-hormadi-muted font-semibold text-sm">
                VP
              </th>
              <th className="text-center py-4 px-2 text-hormadi-muted font-semibold text-sm">
                DP
              </th>
              <th className="text-center py-4 px-2 text-hormadi-muted font-semibold text-sm">
                BP
              </th>
              <th className="text-center py-4 px-2 text-hormadi-muted font-semibold text-sm">
                BC
              </th>
              <th className="text-center py-4 px-2 text-hormadi-muted font-semibold text-sm">
                Diff
              </th>
              <th className="text-center py-4 px-2 text-hormadi-muted font-semibold text-sm">
                PTS
              </th>
              <th className="text-center py-4 px-2 text-hormadi-muted font-semibold text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hormadi-border">
            {teams.map((team) => {
              const bp = formData[`${team.id}-bp`] || team.bp
              const bc = formData[`${team.id}-bc`] || team.bc
              const diff = bp - bc

              return (
                <tr
                  key={team.id}
                  className={`hover:bg-hormadi-surface/30 ${getTeamColor(team.isHormadi)} ${
                    team.isHormadi ? 'border-l-2 border-l-hormadi-red' : ''
                  }`}
                >
                  <td className="py-4 px-4">
                    <span className="text-white font-bold text-lg">{team.rank}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`font-semibold ${team.isHormadi ? 'text-hormadi-red' : 'text-white'}`}>
                      {team.name}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="number"
                      value={formData[`${team.id}-pj`] || team.pj}
                      onChange={(e) =>
                        handleFieldChange(team.id, 'pj', parseInt(e.target.value) || 0)
                      }
                      className="input w-12 h-10 text-center text-sm"
                      min="0"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="number"
                      value={formData[`${team.id}-v`] || team.v}
                      onChange={(e) =>
                        handleFieldChange(team.id, 'v', parseInt(e.target.value) || 0)
                      }
                      className="input w-12 h-10 text-center text-sm"
                      min="0"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="number"
                      value={formData[`${team.id}-d`] || team.d}
                      onChange={(e) =>
                        handleFieldChange(team.id, 'd', parseInt(e.target.value) || 0)
                      }
                      className="input w-12 h-10 text-center text-sm"
                      min="0"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="number"
                      value={formData[`${team.id}-vp`] || team.vp}
                      onChange={(e) =>
                        handleFieldChange(team.id, 'vp', parseInt(e.target.value) || 0)
                      }
                      className="input w-12 h-10 text-center text-sm"
                      min="0"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="number"
                      value={formData[`${team.id}-dp`] || team.dp}
                      onChange={(e) =>
                        handleFieldChange(team.id, 'dp', parseInt(e.target.value) || 0)
                      }
                      className="input w-12 h-10 text-center text-sm"
                      min="0"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="number"
                      value={formData[`${team.id}-bp`] || team.bp}
                      onChange={(e) =>
                        handleFieldChange(team.id, 'bp', parseInt(e.target.value) || 0)
                      }
                      className="input w-12 h-10 text-center text-sm"
                      min="0"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="number"
                      value={formData[`${team.id}-bc`] || team.bc}
                      onChange={(e) =>
                        handleFieldChange(team.id, 'bc', parseInt(e.target.value) || 0)
                      }
                      className="input w-12 h-10 text-center text-sm"
                      min="0"
                    />
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className={`font-semibold ${diff > 0 ? 'text-hormadi-ocean' : diff < 0 ? 'text-hormadi-red' : 'text-hormadi-muted'}`}>
                      {diff >= 0 ? '+' : ''}{diff}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <input
                      type="number"
                      value={formData[`${team.id}-pts`] || team.pts}
                      onChange={(e) =>
                        handleFieldChange(team.id, 'pts', parseInt(e.target.value) || 0)
                      }
                      className="input w-12 h-10 text-center text-sm font-bold"
                      min="0"
                    />
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleMoveTeam(team.id, 'up')}
                        className="p-2 text-hormadi-muted hover:text-hormadi-red transition-colors disabled:opacity-50"
                        disabled={teams.indexOf(team) === 0}
                        title="Monter"
                      >
                        <ArrowUp size={16} />
                      </button>
                      <button
                        onClick={() => handleMoveTeam(team.id, 'down')}
                        className="p-2 text-hormadi-muted hover:text-hormadi-red transition-colors disabled:opacity-50"
                        disabled={teams.indexOf(team) === teams.length - 1}
                        title="Descendre"
                      >
                        <ArrowDown size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="card-glass">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-hormadi-muted text-sm">PJ</p>
            <p className="text-white font-semibold">Parties Jouées</p>
          </div>
          <div>
            <p className="text-hormadi-muted text-sm">V / D</p>
            <p className="text-white font-semibold">Victoires / Défaites</p>
          </div>
          <div>
            <p className="text-hormadi-muted text-sm">VP / DP</p>
            <p className="text-white font-semibold">Victoires Prolongations / Défaites Prolongations</p>
          </div>
          <div>
            <p className="text-hormadi-muted text-sm">BP / BC</p>
            <p className="text-white font-semibold">Buts Pour / Buts Contre</p>
          </div>
          <div>
            <p className="text-hormadi-muted text-sm">Diff</p>
            <p className="text-white font-semibold">Différence (BP - BC)</p>
          </div>
          <div>
            <p className="text-hormadi-muted text-sm">PTS</p>
            <p className="text-white font-semibold">Points</p>
          </div>
        </div>
      </div>
    </div>
  )
}
