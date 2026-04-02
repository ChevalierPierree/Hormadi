'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, Users, Percent, Calendar, Plus, ArrowRight } from 'lucide-react';

interface MatchStats {
  id: string;
  date: string;
  opponent: string;
  venue: string;
  sold: number;
  capacity: number;
  revenue: number;
}

interface FormData {
  date: string;
  time: string;
  homeTeam: string;
  awayTeam: string;
  venue: string;
  capacity: number;
}

const DEMO_MATCHES: MatchStats[] = [
  {
    id: '1',
    date: '2026-04-05',
    opponent: 'Grenoble',
    venue: 'Patinoire de la Barre',
    sold: 450,
    capacity: 1200,
    revenue: 6750,
  },
  {
    id: '2',
    date: '2026-04-12',
    opponent: 'Lyon',
    venue: 'Patinoire de la Barre',
    sold: 980,
    capacity: 1200,
    revenue: 17640,
  },
  {
    id: '3',
    date: '2026-04-19',
    opponent: 'Annecy',
    venue: 'Patinoire de la Barre',
    sold: 1200,
    capacity: 1200,
    revenue: 19200,
  },
  {
    id: '4',
    date: '2026-04-26',
    opponent: 'Chamonix',
    venue: 'Patinoire de la Barre',
    sold: 600,
    capacity: 1200,
    revenue: 8400,
  },
  {
    id: '5',
    date: '2026-05-03',
    opponent: 'Courchevel',
    venue: 'Patinoire de la Barre',
    sold: 300,
    capacity: 1200,
    revenue: 4500,
  },
];

export default function AdminBilletteriePage() {
  const [matches, setMatches] = useState<MatchStats[]>(DEMO_MATCHES);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    date: '',
    time: '',
    homeTeam: 'Hormadi Anglet',
    awayTeam: '',
    venue: 'Patinoire de la Barre',
    capacity: 1200,
  });

  const totalSold = matches.reduce((sum, m) => sum + m.sold, 0);
  const totalCapacity = matches.reduce((sum, m) => sum + m.capacity, 0);
  const totalRevenue = matches.reduce((sum, m) => sum + m.revenue, 0);
  const avgFillRate = totalCapacity > 0 ? Math.round((totalSold / totalCapacity) * 100) : 0;

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) : value,
    }));
  };

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.awayTeam) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    const newMatch: MatchStats = {
      id: `match-${Date.now()}`,
      date: formData.date,
      opponent: formData.awayTeam,
      venue: formData.venue,
      sold: 0,
      capacity: formData.capacity,
      revenue: 0,
    };

    setMatches([...matches, newMatch]);
    setFormData({
      date: '',
      time: '',
      homeTeam: 'Hormadi Anglet',
      awayTeam: '',
      venue: 'Patinoire de la Barre',
      capacity: 1200,
    });
    setShowForm(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getFillPercentage = (sold: number, capacity: number) => {
    return capacity > 0 ? Math.round((sold / capacity) * 100) : 0;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-hormadi-dark via-hormadi-surface to-hormadi-dark">
      {/* Header */}
      <section className="section-padding border-b border-hormadi-border bg-hormadi-surface">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Billetterie</h1>
          <p className="text-hormadi-muted">Gestion complète des ventes de billets</p>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* Total Sold */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-hormadi-muted text-sm font-semibold uppercase">Billets vendus</h3>
                <Users className="w-5 h-5 text-hormadi-red" />
              </div>
              <p className="text-3xl font-bold text-white">{totalSold}</p>
              <p className="text-xs text-hormadi-muted mt-2">sur {totalCapacity} places</p>
            </div>

            {/* Revenue */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-hormadi-muted text-sm font-semibold uppercase">Revenu</h3>
                <TrendingUp className="w-5 h-5 text-hormadi-red" />
              </div>
              <p className="text-3xl font-bold text-white">{totalRevenue.toLocaleString()}€</p>
              <p className="text-xs text-hormadi-muted mt-2">Total généré</p>
            </div>

            {/* Fill Rate */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-hormadi-muted text-sm font-semibold uppercase">Taux remplissage</h3>
                <Percent className="w-5 h-5 text-hormadi-red" />
              </div>
              <p className="text-3xl font-bold text-white">{avgFillRate}%</p>
              <div className="w-full bg-hormadi-border rounded-full h-2 mt-3">
                <div
                  className="h-full bg-gradient-to-r from-hormadi-red to-red-400 rounded-full transition-all"
                  style={{ width: `${avgFillRate}%` }}
                />
              </div>
            </div>

            {/* Upcoming Matches */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-hormadi-muted text-sm font-semibold uppercase">Prochains matchs</h3>
                <Calendar className="w-5 h-5 text-hormadi-red" />
              </div>
              <p className="text-3xl font-bold text-white">{matches.length}</p>
              <p className="text-xs text-hormadi-muted mt-2">en vente</p>
            </div>
          </div>

          {/* Add Match Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary px-6 py-2 rounded-lg font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Ajouter un match
            </button>
          </div>

          {/* Add Match Form Modal */}
          {showForm && (
            <div className="card mb-8 border border-hormadi-red">
              <h3 className="text-xl font-bold text-white mb-6">Ajouter un nouveau match</h3>
              <form onSubmit={handleAddMatch} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleFormChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Heure</label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={handleFormChange}
                      className="input w-full"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Équipe adverse</label>
                    <input
                      type="text"
                      name="awayTeam"
                      value={formData.awayTeam}
                      onChange={handleFormChange}
                      className="input w-full"
                      placeholder="ex: Grenoble"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Lieu</label>
                    <input
                      type="text"
                      name="venue"
                      value={formData.venue}
                      onChange={handleFormChange}
                      className="input w-full"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Capacité</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleFormChange}
                    className="input w-full"
                    min="100"
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn-primary flex-1 py-2 rounded-lg font-semibold">
                    Créer le match
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-secondary flex-1 py-2 rounded-lg font-semibold"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Matches Table */}
          <div className="card overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-6">Matchs à venir</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-hormadi-border">
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Date</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Adversaire</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Lieu</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Ventes</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Revenu</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Taux</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((match) => (
                    <tr key={match.id} className="border-b border-hormadi-border hover:bg-hormadi-border/50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">{formatDate(match.date)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white">{match.opponent}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-hormadi-muted text-sm">{match.venue}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">
                          {match.sold}/{match.capacity}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">{match.revenue.toLocaleString()}€</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-hormadi-border rounded-full h-2">
                            <div
                              className="h-full bg-hormadi-red rounded-full"
                              style={{ width: `${getFillPercentage(match.sold, match.capacity)}%` }}
                            />
                          </div>
                          <span className="text-white text-sm font-semibold w-10 text-right">
                            {getFillPercentage(match.sold, match.capacity)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          href={`/admin/billetterie/${match.id}`}
                          className="text-hormadi-red hover:text-red-400 transition-colors inline-flex items-center gap-1"
                        >
                          Détails
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
