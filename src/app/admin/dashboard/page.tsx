'use client'

import { useState } from 'react'
import {
  Ticket,
  ShoppingBag,
  Newspaper,
  Calendar,
  TrendingUp,
  AlertCircle,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'

type StatCard = {
  label: string
  value: string | number
  icon: LucideIcon
  subtext?: string
}

type ActivityItem = {
  id: string
  type: 'ticket' | 'order' | 'article' | 'match'
  title: string
  description: string
  timestamp: string
  icon: LucideIcon
}

type Product = {
  id: string
  name: string
  quantity: number
  revenue: number
}

type Match = {
  id: string
  opponent: string
  date: string
  ticketsSold: number
  capacity: number
}

type ChartData = {
  month: string
  value: number
}

const demoStats: StatCard[] = [
  {
    label: 'Billets vendus ce mois',
    value: '847',
    icon: Ticket,
    subtext: '+12% vs mois dernier',
  },
  {
    label: 'Revenue billetterie',
    value: '12,450€',
    icon: TrendingUp,
    subtext: '+8% vs mois dernier',
  },
  {
    label: 'Commandes boutique',
    value: '156',
    icon: ShoppingBag,
    subtext: '+15 depuis hier',
  },
  {
    label: 'CA Boutique',
    value: '8,230€',
    icon: TrendingUp,
    subtext: '+5% vs mois dernier',
  },
  {
    label: 'Articles publiés',
    value: '42',
    icon: Newspaper,
    subtext: '12 ce mois',
  },
  {
    label: 'Prochain match dans',
    value: '7 jours',
    icon: Calendar,
    subtext: 'Hormadi vs Paris',
  },
]

const demoActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'ticket',
    title: 'Vente de billets - Hormadi vs Lyon',
    description: '45 billets vendus',
    timestamp: '2 heures ago',
    icon: Ticket,
  },
  {
    id: '2',
    type: 'order',
    title: 'Nouvelle commande boutique',
    description: 'Maillot Domicile XL - 79,99€',
    timestamp: '4 heures ago',
    icon: ShoppingBag,
  },
  {
    id: '3',
    type: 'article',
    title: 'Article publié',
    description: 'Victoire face à Lyon !',
    timestamp: '6 heures ago',
    icon: Newspaper,
  },
  {
    id: '4',
    type: 'match',
    title: 'Score mis à jour',
    description: 'Hormadi 4 - Nice 2',
    timestamp: '1 jour ago',
    icon: Calendar,
  },
  {
    id: '5',
    type: 'order',
    title: 'Nouvelle commande boutique',
    description: 'Pack Supporter - 149,99€',
    timestamp: '1 jour ago',
    icon: ShoppingBag,
  },
  {
    id: '6',
    type: 'ticket',
    title: 'Vente de billets - Hormadi vs Nice',
    description: '32 billets vendus',
    timestamp: '2 jours ago',
    icon: Ticket,
  },
  {
    id: '7',
    type: 'article',
    title: 'Article publié',
    description: 'Transfert de Dubois',
    timestamp: '3 jours ago',
    icon: Newspaper,
  },
  {
    id: '8',
    type: 'ticket',
    title: 'Vente de billets - Hormadi vs Marseille',
    description: '58 billets vendus',
    timestamp: '5 jours ago',
    icon: Ticket,
  },
]

const demoChartData: ChartData[] = [
  { month: 'Sept', value: 42 },
  { month: 'Oct', value: 38 },
  { month: 'Nov', value: 51 },
  { month: 'Déc', value: 68 },
  { month: 'Jan', value: 55 },
  { month: 'Fév', value: 72 },
  { month: 'Mars', value: 85 },
]

const demoTopProducts: Product[] = [
  { id: '1', name: 'Maillot Domicile 2024', quantity: 234, revenue: 18726 },
  { id: '2', name: 'Écharpe Hormadi', quantity: 189, revenue: 5670 },
  { id: '3', name: 'Casquette Hormadi', quantity: 156, revenue: 3120 },
  { id: '4', name: 'T-Shirt Logo', quantity: 142, revenue: 2980 },
  { id: '5', name: 'Pack Supporter', quantity: 78, revenue: 11700 },
]

const demoUpcomingMatches: Match[] = [
  {
    id: '1',
    opponent: 'Paris',
    date: '5 Avril 2024',
    ticketsSold: 1250,
    capacity: 2500,
  },
  {
    id: '2',
    opponent: 'Nice',
    date: '12 Avril 2024',
    ticketsSold: 950,
    capacity: 2500,
  },
  {
    id: '3',
    opponent: 'Marseille',
    date: '19 Avril 2024',
    ticketsSold: 1650,
    capacity: 2500,
  },
]

const StatCard = ({
  label,
  value,
  icon: Icon,
  subtext,
}: {
  label: string
  value: string | number
  icon: LucideIcon
  subtext?: string
}) => (
  <div className="card glass">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-hormadi-muted text-sm font-medium">{label}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
        {subtext && (
          <p className="text-hormadi-muted text-xs mt-2">{subtext}</p>
        )}
      </div>
      <div className="p-3 bg-hormadi-red/10 rounded-lg">
        <Icon className="text-hormadi-red" size={24} />
      </div>
    </div>
  </div>
)

const ActivityFeed = ({ items }: { items: ActivityItem[] }) => (
  <div className="card glass">
    <h2 className="text-xl font-bold text-white mb-6">Activités récentes</h2>
    <div className="space-y-4">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <div
            key={item.id}
            className="flex items-start gap-4 pb-4 border-b border-hormadi-border last:border-b-0 last:pb-0"
          >
            <div className="mt-1 p-2 bg-hormadi-forest/20 rounded-lg">
              <Icon className="text-hormadi-red" size={18} />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{item.title}</p>
              <p className="text-hormadi-muted text-sm">{item.description}</p>
              <p className="text-hormadi-muted text-xs mt-1">{item.timestamp}</p>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

const RevenueChart = ({ data }: { data: ChartData[] }) => {
  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="card glass">
      <h2 className="text-xl font-bold text-white mb-6">Revenus mensuels</h2>
      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((item) => {
          const heightPercent = (item.value / maxValue) * 100
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full bg-gradient-to-t from-hormadi-red to-hormadi-red/60 rounded-t transition-all hover:from-hormadi-red/80 hover:to-hormadi-red/40 cursor-pointer group"
                style={{ height: `${heightPercent}%` }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity h-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{item.value}k</span>
                </div>
              </div>
              <span className="text-xs text-hormadi-muted mt-2">{item.month}</span>
            </div>
          )
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-hormadi-border">
        <p className="text-hormadi-muted text-sm">
          Total: <span className="text-hormadi-red font-bold">595k€</span>
        </p>
      </div>
    </div>
  )
}

const TopProducts = ({ products }: { products: Product[] }) => (
  <div className="card glass">
    <h2 className="text-xl font-bold text-white mb-6">Articles les plus vendus</h2>
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="flex items-center justify-between pb-3 border-b border-hormadi-border last:border-b-0"
        >
          <div className="flex-1">
            <p className="text-white font-medium">{product.name}</p>
            <p className="text-hormadi-muted text-sm">
              {product.quantity} unités vendues
            </p>
          </div>
          <div className="text-right">
            <p className="text-hormadi-red font-bold">{product.revenue.toLocaleString('fr-FR')}€</p>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const UpcomingMatches = ({ matches }: { matches: Match[] }) => (
  <div className="card glass">
    <h2 className="text-xl font-bold text-white mb-6">Prochains matchs</h2>
    <div className="space-y-4">
      {matches.map((match) => {
        const occupancyPercent = (match.ticketsSold / match.capacity) * 100
        return (
          <div
            key={match.id}
            className="pb-4 border-b border-hormadi-border last:border-b-0"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-white font-bold">Hormadi vs {match.opponent}</p>
                <p className="text-hormadi-muted text-sm">{match.date}</p>
              </div>
              <div className="text-right">
                <p className="text-hormadi-red font-bold">
                  {match.ticketsSold}/{match.capacity}
                </p>
                <p className="text-hormadi-muted text-xs">{occupancyPercent.toFixed(0)}%</p>
              </div>
            </div>
            <div className="w-full bg-hormadi-surface rounded-full h-2">
              <div
                className="bg-gradient-to-r from-hormadi-red to-hormadi-red/60 h-2 rounded-full transition-all"
                style={{ width: `${occupancyPercent}%` }}
              ></div>
            </div>
          </div>
        )
      })}
    </div>
  </div>
)

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-2">
          Tableau de bord
        </h1>
        <p className="text-hormadi-muted">
          Bienvenue à l'administration Hormadi Anglet Hockey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {demoStats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            subtext={stat.subtext}
          />
        ))}
      </div>

      <div className="card glass">
        <h2 className="text-xl font-bold text-white mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button className="btn-primary justify-center">
            <Newspaper size={18} />
            Nouvel article
          </button>
          <button className="btn-secondary justify-center">
            <Calendar size={18} />
            Ajouter un match
          </button>
          <button className="btn-secondary justify-center">
            <ShoppingBag size={18} />
            Nouveau produit
          </button>
          <button className="btn-secondary justify-center">
            <BarChart3 size={18} />
            Voir statistiques
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart data={demoChartData} />
        </div>
        <div>
          <TopProducts products={demoTopProducts} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed items={demoActivities} />
        <UpcomingMatches matches={demoUpcomingMatches} />
      </div>
    </div>
  )
}
