'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronRight, Gavel, Clock, Users } from 'lucide-react';

interface AuctionItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  currentPrice: number;
  bidCount: number;
  endDate: string;
  isEnded: boolean;
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function timeLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 'Terminée';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return `${days} j ${hours} h restants`;
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 0) return `${hours} h ${minutes} min restantes`;
  return `${minutes} min restantes`;
}

export default function EncheresPage() {
  const [items, setItems] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auctions')
      .then((r) => r.json())
      .then((data) => setItems(data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const active = items.filter((i) => !i.isEnded);
  const ended = items.filter((i) => i.isEnded);

  return (
    <div className="min-h-screen bg-hormadi-dark text-white">
      {/* ═══ HERO ═══ */}
      <section className="relative h-[40vh] min-h-[340px] max-h-[460px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/40 to-transparent" />
        <div className="absolute z-[3] top-0 right-0 w-96 h-96 bg-hormadi-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute z-[3] bottom-0 left-0 w-72 h-72 bg-hormadi-ocean/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-[5] h-full flex flex-col justify-end pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Enchères</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
              <Gavel size={20} className="text-hormadi-red" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
              Objets du club
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
            ENCHÈRES
          </h1>
          <p className="text-hormadi-muted mt-3 text-base sm:text-lg max-w-lg">
            Maillots portés en match, objets dédicacés et souvenirs uniques du club — misez pour les remporter.
          </p>
        </div>
      </section>

      {/* ═══ ITEMS ═══ */}
      <section className="py-16 sm:py-20">
        <div className="section-padding max-w-7xl mx-auto">
          {loading ? (
            <p className="text-hormadi-muted text-center py-12">Chargement…</p>
          ) : items.length === 0 ? (
            <p className="text-hormadi-muted text-center py-12">Aucune enchère en cours pour le moment.</p>
          ) : (
            <>
              {active.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-2xl sm:text-3xl font-black mb-8">En cours</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {active.map((item) => <AuctionCard key={item.id} item={item} />)}
                  </div>
                </div>
              )}
              {ended.length > 0 && (
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black mb-8 text-hormadi-muted">Terminées</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ended.map((item) => <AuctionCard key={item.id} item={item} />)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function AuctionCard({ item }: { item: AuctionItem }) {
  return (
    <Link
      href={`/encheres/${item.id}`}
      className={`group rounded-xl overflow-hidden border border-hormadi-border hover:border-hormadi-red/40 transition-all duration-300 flex flex-col ${item.isEnded ? 'opacity-60' : ''}`}
      style={{ background: 'linear-gradient(160deg, #2b2f33 0%, #1c1f22 55%, #17191b 100%)' }}
    >
      <div className="aspect-[4/3] bg-zinc-900 relative overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gavel size={40} className="text-white/10" />
          </div>
        )}
        {item.isEnded && (
          <div className="absolute top-3 right-3 bg-hormadi-dark/90 text-hormadi-muted text-xs font-bold uppercase px-2.5 py-1 rounded">
            Terminée
          </div>
        )}
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">{item.title}</h3>
        <p className="text-hormadi-muted text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-hormadi-muted">Mise actuelle</span>
          <span className="text-white font-black text-xl">{formatPrice(item.currentPrice)} €</span>
        </div>
        <div className="flex items-center justify-between text-xs text-hormadi-muted mt-2 pt-3 border-t border-hormadi-border/50">
          <span className="flex items-center gap-1.5">
            <Users size={13} /> {item.bidCount} mise{item.bidCount !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} /> {timeLeft(item.endDate)}
          </span>
        </div>
      </div>
    </Link>
  );
}
