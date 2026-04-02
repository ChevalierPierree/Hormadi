'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Edit2, Trash2, Plus, Download } from 'lucide-react';

interface TicketCategory {
  id: string;
  name: string;
  price: number;
  capacity: number;
  sold: number;
}

interface Reservation {
  id: string;
  reference: string;
  customerName: string;
  email: string;
  quantity: number;
  amount: number;
  status: 'confirmed' | 'pending' | 'cancelled';
}

interface QuickSaleForm {
  customerName: string;
  email: string;
  phone: string;
  sectionId: string;
  quantity: number;
}

const DEMO_CATEGORIES: TicketCategory[] = [
  {
    id: 'tribune-est',
    name: 'Tribune Est',
    price: 18,
    capacity: 300,
    sold: 180,
  },
  {
    id: 'tribune-ouest',
    name: 'Tribune Ouest',
    price: 18,
    capacity: 300,
    sold: 150,
  },
  {
    id: 'virage-nord',
    name: 'Virage Nord',
    price: 15,
    capacity: 250,
    sold: 200,
  },
  {
    id: 'virage-sud',
    name: 'Virage Sud',
    price: 15,
    capacity: 250,
    sold: 100,
  },
  {
    id: 'vip',
    name: 'VIP',
    price: 35,
    capacity: 100,
    sold: 75,
  },
];

const DEMO_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    reference: 'HRM-001234',
    customerName: 'Jean Dupont',
    email: 'jean@example.com',
    quantity: 2,
    amount: 36,
    status: 'confirmed',
  },
  {
    id: '2',
    reference: 'HRM-001235',
    customerName: 'Marie Martin',
    email: 'marie@example.com',
    quantity: 4,
    amount: 60,
    status: 'confirmed',
  },
  {
    id: '3',
    reference: 'HRM-001236',
    customerName: 'Pierre Bernard',
    email: 'pierre@example.com',
    quantity: 1,
    amount: 15,
    status: 'pending',
  },
];

export default function AdminMatchDetailPage({ params }: { params: { matchId: string } }) {
  const [categories, setCategories] = useState<TicketCategory[]>(DEMO_CATEGORIES);
  const [reservations, setReservations] = useState<Reservation[]>(DEMO_RESERVATIONS);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [showQuickSale, setShowQuickSale] = useState(false);
  const [quickSaleForm, setQuickSaleForm] = useState<QuickSaleForm>({
    customerName: '',
    email: '',
    phone: '',
    sectionId: DEMO_CATEGORIES[0].id,
    quantity: 1,
  });

  const matchData = {
    date: '2026-04-05',
    time: '20:00',
    homeTeam: 'Hormadi Anglet',
    awayTeam: 'Grenoble',
    venue: 'Patinoire de la Barre',
  };

  const totalCapacity = categories.reduce((sum, c) => sum + c.capacity, 0);
  const totalSold = categories.reduce((sum, c) => sum + c.sold, 0);
  const totalRevenue = categories.reduce((sum, c) => sum + c.sold * c.price, 0);

  const handleEditPrice = (categoryId: string, newPrice: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, price: newPrice } : cat)),
    );
    setEditingCategoryId(null);
  };

  const handleEditCapacity = (categoryId: string, newCapacity: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, capacity: newCapacity } : cat)),
    );
  };

  const handleQuickSaleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuickSaleForm((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) : value,
    }));
  };

  const handleQuickSale = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCategory = categories.find((c) => c.id === quickSaleForm.sectionId);
    if (!selectedCategory) return;

    const available = selectedCategory.capacity - selectedCategory.sold;
    if (quickSaleForm.quantity > available) {
      alert('Pas assez de places disponibles');
      return;
    }

    // Update category
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === quickSaleForm.sectionId ? { ...cat, sold: cat.sold + quickSaleForm.quantity } : cat,
      ),
    );

    // Add reservation
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      reference: `HRM-${Math.random().toString().slice(2, 8).padStart(6, '0')}`,
      customerName: quickSaleForm.customerName,
      email: quickSaleForm.email,
      quantity: quickSaleForm.quantity,
      amount: quickSaleForm.quantity * selectedCategory.price,
      status: 'confirmed',
    };

    setReservations((prev) => [newReservation, ...prev]);

    setQuickSaleForm({
      customerName: '',
      email: '',
      phone: '',
      sectionId: DEMO_CATEGORIES[0].id,
      quantity: 1,
    });
    setShowQuickSale(false);
  };

  const handleExportCSV = () => {
    let csv = 'Catégorie,Prix,Capacité,Vendus,Restants,Revenu\n';
    categories.forEach((cat) => {
      const remaining = cat.capacity - cat.sold;
      const revenue = cat.sold * cat.price;
      csv += `${cat.name},${cat.price}€,${cat.capacity},${cat.sold},${remaining},${revenue}€\n`;
    });

    csv += '\n\nRéservations\n';
    csv += 'Référence,Client,Email,Quantité,Montant,Statut\n';
    reservations.forEach((res) => {
      csv += `${res.reference},${res.customerName},${res.email},${res.quantity},${res.amount}€,${res.status}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `billetterie-${matchData.date}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'badge-win';
      case 'pending':
        return 'bg-yellow-900/30 text-yellow-200 border border-yellow-700/50';
      case 'cancelled':
        return 'badge-loss';
      default:
        return 'bg-hormadi-border text-hormadi-muted';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-hormadi-dark via-hormadi-surface to-hormadi-dark">
      {/* Header */}
      <section className="section-padding border-b border-hormadi-border bg-hormadi-surface">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/admin/billetterie"
            className="flex items-center gap-2 text-hormadi-red hover:text-red-400 transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour à la billetterie
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">
            {matchData.homeTeam} vs {matchData.awayTeam}
          </h1>
          <p className="text-hormadi-muted">
            {formatDate(matchData.date)} à {matchData.time} - {matchData.venue}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <p className="text-hormadi-muted text-sm font-semibold mb-2">Billets vendus</p>
              <p className="text-3xl font-bold text-white">{totalSold}</p>
              <p className="text-xs text-hormadi-muted mt-2">sur {totalCapacity}</p>
            </div>
            <div className="card">
              <p className="text-hormadi-muted text-sm font-semibold mb-2">Revenu total</p>
              <p className="text-3xl font-bold text-white">{totalRevenue.toLocaleString()}€</p>
            </div>
            <div className="card">
              <p className="text-hormadi-muted text-sm font-semibold mb-2">Taux de remplissage</p>
              <p className="text-3xl font-bold text-white">{Math.round((totalSold / totalCapacity) * 100)}%</p>
              <div className="w-full bg-hormadi-border rounded-full h-2 mt-3">
                <div
                  className="h-full bg-hormadi-red rounded-full"
                  style={{ width: `${(totalSold / totalCapacity) * 100}%` }}
                />
              </div>
            </div>
            <div className="card">
              <p className="text-hormadi-muted text-sm font-semibold mb-2">Places restantes</p>
              <p className="text-3xl font-bold text-white">{totalCapacity - totalSold}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Table */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto mb-8">
          <div className="card">
            <h3 className="text-xl font-bold text-white mb-6">Catégories de billets</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-hormadi-border">
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Catégorie</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Prix</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Capacité</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Vendus</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Restants</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Revenu</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-hormadi-border hover:bg-hormadi-border/50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">{category.name}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">{category.price}€</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white">{category.capacity}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">{category.sold}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-hormadi-muted">{category.capacity - category.sold}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">{(category.sold * category.price).toLocaleString()}€</span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => setEditingCategoryId(category.id)}
                          className="text-hormadi-red hover:text-red-400 transition-colors inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Reservations Section */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white">Réservations</h3>
            <div className="flex gap-3">
              <button
                onClick={() => setShowQuickSale(!showQuickSale)}
                className="btn-secondary px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Vente directe
              </button>
              <button
                onClick={handleExportCSV}
                className="btn-secondary px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Quick Sale Form */}
          {showQuickSale && (
            <div className="card mb-8 border border-hormadi-red">
              <h4 className="text-lg font-bold text-white mb-4">Vente directe (guichet)</h4>
              <form onSubmit={handleQuickSale} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Nom du client</label>
                    <input
                      type="text"
                      name="customerName"
                      value={quickSaleForm.customerName}
                      onChange={handleQuickSaleChange}
                      className="input w-full"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={quickSaleForm.email}
                      onChange={handleQuickSaleChange}
                      className="input w-full"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Catégorie</label>
                    <select
                      name="sectionId"
                      value={quickSaleForm.sectionId}
                      onChange={handleQuickSaleChange}
                      className="input w-full"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} ({cat.capacity - cat.sold} places)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Quantité</label>
                    <input
                      type="number"
                      name="quantity"
                      value={quickSaleForm.quantity}
                      onChange={handleQuickSaleChange}
                      className="input w-full"
                      min="1"
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <button type="submit" className="btn-primary w-full py-2 rounded-lg font-semibold">
                      Enregistrer
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Reservations Table */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-hormadi-border">
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Référence</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Client</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Email</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Quantité</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Montant</th>
                    <th className="text-left py-3 px-4 text-hormadi-muted font-semibold text-sm">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id} className="border-b border-hormadi-border hover:bg-hormadi-border/50 transition-colors">
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold font-mono text-sm">{reservation.reference}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white">{reservation.customerName}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-hormadi-muted text-sm">{reservation.email}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">{reservation.quantity}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-white font-semibold">{reservation.amount}€</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`${getStatusBadgeClass(reservation.status)} px-3 py-1 rounded text-xs font-semibold`}>
                          {reservation.status === 'confirmed' && 'Confirmée'}
                          {reservation.status === 'pending' && 'En attente'}
                          {reservation.status === 'cancelled' && 'Annulée'}
                        </span>
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
