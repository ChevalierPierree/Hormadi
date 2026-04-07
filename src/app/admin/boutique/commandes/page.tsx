'use client'

import { useState, useMemo } from 'react'
import { Eye, Filter } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

// Mock orders data
const mockOrders = [
  {
    id: 'ord-1',
    reference: 'HOR-ABC123-XYZ1',
    customerName: 'Jean Dupont',
    customerEmail: 'jean@example.com',
    customerPhone: '+33 6 12 34 56 78',
    shippingAddress: '123 rue de la Paix',
    shippingCity: 'Anglet',
    shippingZip: '64600',
    items: [
      { productId: 'prod-1', name: 'Maillot Domicile 2024', quantity: 1, size: 'L', unitPrice: 6999 },
      { productId: 'prod-4', name: 'Casquette Hormadi', quantity: 2, size: null, unitPrice: 1999 },
    ],
    totalPrice: 10997,
    status: 'pending',
    createdAt: '2024-03-28',
  },
  {
    id: 'ord-2',
    reference: 'HOR-DEF456-XYZ2',
    customerName: 'Marie Martin',
    customerEmail: 'marie@example.com',
    customerPhone: '+33 6 98 76 54 32',
    shippingAddress: '456 avenue des Pins',
    shippingCity: 'Bayonne',
    shippingZip: '64100',
    items: [
      { productId: 'prod-2', name: 'Maillot Extérieur 2024', quantity: 1, size: 'M', unitPrice: 6999 },
      { productId: 'prod-5', name: 'Écharpe Hormadi', quantity: 1, size: null, unitPrice: 2499 },
    ],
    totalPrice: 9498,
    status: 'confirmed',
    createdAt: '2024-03-27',
  },
  {
    id: 'ord-3',
    reference: 'HOR-GHI789-XYZ3',
    customerName: 'Pierre Lefebvre',
    customerEmail: 'pierre@example.com',
    customerPhone: '+33 6 55 44 33 22',
    shippingAddress: '789 rue du Stade',
    shippingCity: 'Biarritz',
    shippingZip: '64200',
    items: [
      { productId: 'prod-6', name: 'Maillot Enfant 2024', quantity: 1, size: '8-10 ans', unitPrice: 5499 },
    ],
    totalPrice: 5499,
    status: 'shipped',
    createdAt: '2024-03-26',
  },
  {
    id: 'ord-4',
    reference: 'HOR-JKL012-XYZ4',
    customerName: 'Sophie Bernard',
    customerEmail: 'sophie@example.com',
    customerPhone: '+33 6 11 22 33 44',
    shippingAddress: '321 chemin des Fleurs',
    shippingCity: 'Dax',
    shippingZip: '40100',
    items: [
      { productId: 'prod-7', name: 'Pack Supporter Hormadi', quantity: 1, size: 'XL', unitPrice: 8999 },
      { productId: 'prod-8', name: 'T-Shirt Hormadi', quantity: 2, size: 'M', unitPrice: 2299 },
    ],
    totalPrice: 13597,
    status: 'confirmed',
    createdAt: '2024-03-25',
  },
]

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-950 text-yellow-200'
    case 'confirmed':
      return 'bg-hormadi-forest/30 text-hormadi-ice'
    case 'shipped':
      return 'bg-purple-950 text-purple-200'
    case 'delivered':
      return 'bg-green-950 text-green-200'
    case 'cancelled':
      return 'bg-red-950 text-red-200'
    default:
      return 'bg-hormadi-surface text-hormadi-muted'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending':
      return 'En attente'
    case 'confirmed':
      return 'Confirmée'
    case 'shipped':
      return 'Expédiée'
    case 'delivered':
      return 'Livrée'
    case 'cancelled':
      return 'Annulée'
    default:
      return status
  }
}

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedOrder, setSelectedOrder] = useState<(typeof mockOrders)[0] | null>(null)
  const [orderStatusUpdate, setOrderStatusUpdate] = useState<string>('')

  const filteredOrders = useMemo(() => {
    if (!selectedStatus) return mockOrders
    return mockOrders.filter((order) => order.status === selectedStatus)
  }, [selectedStatus])

  const handleViewOrder = (order: (typeof mockOrders)[0]) => {
    setSelectedOrder(order)
    setOrderStatusUpdate(order.status)
  }

  const handleStatusChange = (newStatus: string) => {
    if (selectedOrder) {
      alert(`Statut mis à jour de "${getStatusLabel(selectedOrder.status)}" à "${getStatusLabel(newStatus)}" (simulé)`)
      setOrderStatusUpdate(newStatus)
      const updatedOrder = { ...selectedOrder, status: newStatus }
      setSelectedOrder(updatedOrder)
    }
  }

  const statusCounts = {
    pending: mockOrders.filter((o) => o.status === 'pending').length,
    confirmed: mockOrders.filter((o) => o.status === 'confirmed').length,
    shipped: mockOrders.filter((o) => o.status === 'shipped').length,
    delivered: mockOrders.filter((o) => o.status === 'delivered').length,
    cancelled: mockOrders.filter((o) => o.status === 'cancelled').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Gestion des commandes</h1>
        <p className="text-hormadi-muted text-sm">
          {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''}
          {selectedStatus && ` - ${getStatusLabel(selectedStatus)}`}
        </p>
      </div>

      {/* Status Filters */}
      <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Filter size={20} className="text-hormadi-red" />
              <h2 className="text-white font-semibold">Filtrer par statut</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedStatus('')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedStatus === ''
                    ? 'bg-hormadi-red text-white'
                    : 'bg-hormadi-surface text-hormadi-muted hover:bg-hormadi-border'
                }`}
              >
                Toutes ({mockOrders.length})
              </button>
              <button
                onClick={() => setSelectedStatus('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedStatus === 'pending'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-hormadi-surface text-hormadi-muted hover:bg-hormadi-border'
                }`}
              >
                En attente ({statusCounts.pending})
              </button>
              <button
                onClick={() => setSelectedStatus('confirmed')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedStatus === 'confirmed'
                    ? 'bg-hormadi-ocean text-white'
                    : 'bg-hormadi-surface text-hormadi-muted hover:bg-hormadi-border'
                }`}
              >
                Confirmée ({statusCounts.confirmed})
              </button>
              <button
                onClick={() => setSelectedStatus('shipped')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedStatus === 'shipped'
                    ? 'bg-purple-600 text-white'
                    : 'bg-hormadi-surface text-hormadi-muted hover:bg-hormadi-border'
                }`}
              >
                Expédiée ({statusCounts.shipped})
              </button>
              <button
                onClick={() => setSelectedStatus('delivered')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedStatus === 'delivered'
                    ? 'bg-green-600 text-white'
                    : 'bg-hormadi-surface text-hormadi-muted hover:bg-hormadi-border'
                }`}
              >
                Livrée ({statusCounts.delivered})
              </button>
            </div>
          </div>

      {/* Orders Table */}
      <div className="bg-hormadi-surface border border-hormadi-border rounded-xl overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-hormadi-border">
                <tr>
                  <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                    Référence
                  </th>
                  <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                    Client
                  </th>
                  <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                    Articles
                  </th>
                  <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                    Total
                  </th>
                  <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                    Statut
                  </th>
                  <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hormadi-border">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 px-6 text-center text-hormadi-muted">
                      Aucune commande
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-hormadi-surface/30">
                      <td className="py-4 px-6">
                        <span className="font-mono text-white text-sm">{order.reference}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-white font-medium">{order.customerName}</p>
                          <p className="text-hormadi-muted text-xs">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-hormadi-muted">
                        {order.items.length} article{order.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="py-4 px-6 text-hormadi-red font-semibold">
                        {formatPrice(order.totalPrice)}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`badge ${getStatusBadgeColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-hormadi-muted text-sm">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-2 text-hormadi-muted hover:text-hormadi-red transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-hormadi-dark border border-hormadi-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-hormadi-border flex items-center justify-between sticky top-0 bg-hormadi-dark">
                  <h2 className="text-2xl font-bold text-white">Détail de commande</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-hormadi-muted hover:text-white transition-colors text-2xl leading-none"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Reference */}
                  <div>
                    <p className="text-hormadi-muted text-sm uppercase tracking-wide mb-1">
                      Référence
                    </p>
                    <p className="text-white font-mono text-lg">{selectedOrder.reference}</p>
                  </div>

                  {/* Customer Info */}
                  <div>
                    <p className="text-hormadi-muted text-sm uppercase tracking-wide mb-3">
                      Informations client
                    </p>
                    <div className="bg-hormadi-surface border border-hormadi-border rounded-lg p-4 space-y-2">
                      <p className="text-white">
                        <span className="text-hormadi-muted">Nom:</span> {selectedOrder.customerName}
                      </p>
                      <p className="text-white">
                        <span className="text-hormadi-muted">Email:</span> {selectedOrder.customerEmail}
                      </p>
                      <p className="text-white">
                        <span className="text-hormadi-muted">Téléphone:</span>{' '}
                        {selectedOrder.customerPhone}
                      </p>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <p className="text-hormadi-muted text-sm uppercase tracking-wide mb-3">
                      Adresse de livraison
                    </p>
                    <div className="bg-hormadi-surface border border-hormadi-border rounded-lg p-4 space-y-1">
                      <p className="text-white">{selectedOrder.shippingAddress}</p>
                      <p className="text-white">
                        {selectedOrder.shippingZip} {selectedOrder.shippingCity}
                      </p>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-hormadi-muted text-sm uppercase tracking-wide mb-3">
                      Articles
                    </p>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center bg-hormadi-surface border border-hormadi-border rounded-lg p-4"
                        >
                          <div>
                            <p className="text-white font-medium">{item.name}</p>
                            {item.size && (
                              <p className="text-hormadi-muted text-xs">Taille: {item.size}</p>
                            )}
                            <p className="text-hormadi-muted text-sm">Quantité: {item.quantity}</p>
                          </div>
                          <span className="text-hormadi-red font-semibold">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-hormadi-border pt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-white">Total</span>
                      <span className="text-2xl font-bold text-hormadi-red">
                        {formatPrice(selectedOrder.totalPrice)}
                      </span>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Mettre à jour le statut
                    </label>
                    <select
                      value={orderStatusUpdate}
                      onChange={(e) => handleStatusChange(e.target.value)}
                      className="input w-full bg-hormadi-surface border border-hormadi-border text-white"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="shipped">Expédiée</option>
                      <option value="delivered">Livrée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="btn-secondary w-full"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            </div>
      )}
    </div>
  )
}
