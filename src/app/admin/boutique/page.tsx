'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, ShoppingCart, Package, TrendingUp, ArrowRight } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
type Product = { id: string; name: string; stock: number; price: number; category: string; slug: string; [key: string]: any }
type Order = { id: string; reference: string; customerName: string; customerEmail: string; items: any[]; totalPrice: number; status: string; createdAt: string }

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

export default function AdminShopDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersInProgress: 0,
    productsInStock: 0,
    lowStockAlerts: 0,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const prodRes = await fetch('/api/products?limit=200')
        const prodData = prodRes.ok ? await prodRes.json() : { data: [] }
        const prods: Product[] = prodData?.data || []
        setProducts(prods)

        const productsInStock = prods.filter((p) => p.stock > 0).length
        const lowStockAlerts = prods.filter((p) => p.stock > 0 && p.stock < 10).length

        // Fetch real orders from API
        let orders: Order[] = []
        try {
          const ordRes = await fetch('/api/orders?limit=50')
          if (ordRes.ok) {
            const ordData = await ordRes.json()
            orders = ordData?.data || []
          }
        } catch { /* no orders yet */ }

        setRecentOrders(orders.slice(0, 5))
        const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0)
        const ordersInProgress = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled').length

        setStats({ totalRevenue, ordersInProgress, productsInStock, lowStockAlerts })
      } catch {
        // fallback
      }
    }
    fetchData()
  }, [])

  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock < 10)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Tableau de Bord Boutique</h1>
        <p className="text-hormadi-muted text-sm">Gérez vos produits et commandes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Revenue */}
            <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-hormadi-muted text-sm font-semibold uppercase">
                  Chiffre d'affaires
                </h3>
                <TrendingUp className="text-hormadi-red" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">
                  {formatPrice(stats.totalRevenue)}
                </p>
                <p className="text-hormadi-muted text-xs mt-2">Total des commandes</p>
              </div>
            </div>

            {/* Orders In Progress */}
            <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-hormadi-muted text-sm font-semibold uppercase">
                  Commandes en cours
                </h3>
                <ShoppingCart className="text-hormadi-red" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.ordersInProgress}</p>
                <p className="text-hormadi-muted text-xs mt-2">À traiter ou expédier</p>
              </div>
            </div>

            {/* Products In Stock */}
            <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-hormadi-muted text-sm font-semibold uppercase">
                  Articles en stock
                </h3>
                <Package className="text-hormadi-red" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stats.productsInStock}</p>
                <p className="text-hormadi-muted text-xs mt-2">Sur {products.length} articles</p>
              </div>
            </div>

            {/* Stock Alerts */}
            <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-hormadi-muted text-sm font-semibold uppercase">
                  Alertes stock
                </h3>
                <AlertTriangle className="text-yellow-500" size={24} />
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-500">{stats.lowStockAlerts}</p>
                <p className="text-hormadi-muted text-xs mt-2">Articles en stock faible</p>
              </div>
            </div>
          </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Link href="/admin/boutique/produits" className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5 group cursor-pointer hover:border-hormadi-red/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1">Nouveau produit</h3>
                  <p className="text-hormadi-muted text-sm">Ajouter un produit</p>
                </div>
                <ArrowRight className="text-hormadi-muted group-hover:text-hormadi-red transition-colors" />
              </div>
            </Link>

            <Link href="/admin/boutique/commandes" className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5 group cursor-pointer hover:border-hormadi-red/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1">Voir commandes</h3>
                  <p className="text-hormadi-muted text-sm">Gérer toutes les commandes</p>
                </div>
                <ArrowRight className="text-hormadi-muted group-hover:text-hormadi-red transition-colors" />
              </div>
            </Link>

            <Link href="/admin/boutique/produits" className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5 group cursor-pointer hover:border-hormadi-red/50 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold mb-1">Gérer stock</h3>
                  <p className="text-hormadi-muted text-sm">Voir tous les produits</p>
                </div>
                <ArrowRight className="text-hormadi-muted group-hover:text-hormadi-red transition-colors" />
              </div>
            </Link>
          </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div className="lg:col-span-2">
              <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Commandes récentes</h2>
                  <Link href="/admin/boutique/commandes" className="text-hormadi-red text-sm hover:text-hormadi-red/80">
                    Voir tout
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-hormadi-border">
                      <tr>
                        <th className="text-left py-3 px-4 text-hormadi-muted font-semibold">
                          Référence
                        </th>
                        <th className="text-left py-3 px-4 text-hormadi-muted font-semibold">
                          Client
                        </th>
                        <th className="text-left py-3 px-4 text-hormadi-muted font-semibold">
                          Montant
                        </th>
                        <th className="text-left py-3 px-4 text-hormadi-muted font-semibold">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hormadi-border">
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 px-4 text-center text-hormadi-muted text-sm">
                            Aucune commande pour le moment
                          </td>
                        </tr>
                      ) : recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-hormadi-surface/30">
                          <td className="py-4 px-4 font-mono text-white text-xs">
                            {order.reference}
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <p className="text-white font-medium">{order.customerName}</p>
                              <p className="text-hormadi-muted text-xs">{order.customerEmail}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-hormadi-red font-semibold">
                            {formatPrice(order.totalPrice)}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`badge ${getStatusBadgeColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div>
              <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-5">
                <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-yellow-500" />
                  Stock faible
                </h2>

                {lowStockProducts.length === 0 ? (
                  <p className="text-hormadi-muted text-center py-8">Aucune alerte stock</p>
                ) : (
                  <div className="space-y-3">
                    {lowStockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-3 bg-hormadi-surface/50 border border-hormadi-border rounded-lg"
                      >
                        <p className="text-white font-medium text-sm">{product.name}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-hormadi-muted text-xs">Stock: {product.stock}</span>
                          <span className="badge bg-yellow-950 text-yellow-200">
                            {product.stock < 5 ? 'Critique' : 'Faible'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
    </div>
  )
}
