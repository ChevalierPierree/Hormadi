'use client'

import { useState, useMemo, useEffect } from 'react'
import { Eye, Filter, Loader2, Package } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'

type OrderItem = {
  id: string
  productId: string
  quantity: number
  size: string | null
  unitPrice: number
  product?: { name: string; slug: string }
}

type Order = {
  id: string
  reference: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  shippingAddress: string
  shippingCity: string
  shippingZip: string
  items: OrderItem[]
  totalPrice: number
  status: string
  createdAt: string
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-950 text-yellow-200'
    case 'confirmed': return 'bg-hormadi-forest/30 text-hormadi-ice'
    case 'shipped': return 'bg-purple-950 text-purple-200'
    case 'delivered': return 'bg-green-950 text-green-200'
    case 'cancelled': return 'bg-red-950 text-red-200'
    default: return 'bg-hormadi-surface text-hormadi-muted'
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'En attente'
    case 'confirmed': return 'Confirmée'
    case 'shipped': return 'Expédiée'
    case 'delivered': return 'Livrée'
    case 'cancelled': return 'Annulée'
    default: return status
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderStatusUpdate, setOrderStatusUpdate] = useState<string>('')

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders?limit=200')
        if (res.ok) {
          const data = await res.json()
          setOrders(data?.data || [])
        }
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const filteredOrders = useMemo(() => {
    if (!selectedStatus) return orders
    return orders.filter((order) => order.status === selectedStatus)
  }, [orders, selectedStatus])

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setOrderStatusUpdate(order.status)
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        setOrderStatusUpdate(newStatus)
        setSelectedOrder({ ...selectedOrder, status: newStatus })
        setOrders((prev) =>
          prev.map((o) => (o.id === selectedOrder.id ? { ...o, status: newStatus } : o))
        )
      }
    } catch {
      alert('Erreur lors de la mise à jour du statut')
    }
  }

  const statusCounts = useMemo(() => ({
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    shipped: orders.filter((o) => o.status === 'shipped').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  }), [orders])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-hormadi-red animate-spin" />
        <span className="ml-3 text-hormadi-muted">Chargement des commandes...</span>
      </div>
    )
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
              selectedStatus === '' ? 'bg-hormadi-red text-white' : 'bg-hormadi-surface text-hormadi-muted hover:bg-hormadi-border'
            }`}
          >
            Toutes ({orders.length})
          </button>
          {(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedStatus === s ? getStatusBadgeColor(s) : 'bg-hormadi-surface text-hormadi-muted hover:bg-hormadi-border'
              }`}
            >
              {getStatusLabel(s)} ({statusCounts[s]})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-hormadi-surface border border-hormadi-border rounded-xl overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="text-hormadi-muted/30 mx-auto mb-4" />
            <p className="text-hormadi-muted mb-2">Aucune commande</p>
            <p className="text-hormadi-muted/60 text-sm">Les commandes passées sur la boutique apparaitront ici.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-hormadi-border">
              <tr>
                <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">Référence</th>
                <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">Client</th>
                <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">Articles</th>
                <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">Total</th>
                <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">Statut</th>
                <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">Date</th>
                <th className="text-left py-4 px-6 text-hormadi-muted font-semibold text-sm">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hormadi-border">
              {filteredOrders.map((order) => (
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
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-hormadi-dark border border-hormadi-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-hormadi-border flex items-center justify-between sticky top-0 bg-hormadi-dark">
              <h2 className="text-2xl font-bold text-white">Détail de commande</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-hormadi-muted hover:text-white transition-colors text-2xl leading-none">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <p className="text-hormadi-muted text-sm uppercase tracking-wide mb-1">Référence</p>
                <p className="text-white font-mono text-lg">{selectedOrder.reference}</p>
              </div>

              <div>
                <p className="text-hormadi-muted text-sm uppercase tracking-wide mb-3">Informations client</p>
                <div className="bg-hormadi-surface border border-hormadi-border rounded-lg p-4 space-y-2">
                  <p className="text-white"><span className="text-hormadi-muted">Nom:</span> {selectedOrder.customerName}</p>
                  <p className="text-white"><span className="text-hormadi-muted">Email:</span> {selectedOrder.customerEmail}</p>
                  {selectedOrder.customerPhone && (
                    <p className="text-white"><span className="text-hormadi-muted">Téléphone:</span> {selectedOrder.customerPhone}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-hormadi-muted text-sm uppercase tracking-wide mb-3">Adresse de livraison</p>
                <div className="bg-hormadi-surface border border-hormadi-border rounded-lg p-4 space-y-1">
                  <p className="text-white">{selectedOrder.shippingAddress}</p>
                  <p className="text-white">{selectedOrder.shippingZip} {selectedOrder.shippingCity}</p>
                </div>
              </div>

              <div>
                <p className="text-hormadi-muted text-sm uppercase tracking-wide mb-3">Articles</p>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-hormadi-surface border border-hormadi-border rounded-lg p-4">
                      <div>
                        <p className="text-white font-medium">{item.product?.name || `Produit #${item.productId.substring(0, 8)}`}</p>
                        {item.size && <p className="text-hormadi-muted text-xs">Taille: {item.size}</p>}
                        <p className="text-hormadi-muted text-sm">Quantité: {item.quantity}</p>
                      </div>
                      <span className="text-hormadi-red font-semibold">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-hormadi-border pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-white">Total</span>
                  <span className="text-2xl font-bold text-hormadi-red">{formatPrice(selectedOrder.totalPrice)}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">Mettre à jour le statut</label>
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

              <button onClick={() => setSelectedOrder(null)} className="btn-secondary w-full">Fermer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
