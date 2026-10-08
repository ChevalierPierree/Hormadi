'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { ChevronRight, Gavel, Clock, Users, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface RecentBid {
  amount: number;
  createdAt: string;
  bidderInitial: string;
}

interface AuctionItemDetail {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  startPrice: number;
  minIncrement: number;
  currentPrice: number;
  bidCount: number;
  endDate: string;
  isEnded: boolean;
  recentBids: RecentBid[];
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function timeLeft(endDate: string) {
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 'Enchère terminée';
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (days > 0) return `${days} j ${hours} h restants`;
  if (hours > 0) return `${hours} h ${minutes} min restantes`;
  return `${minutes} min restantes`;
}

export default function AuctionItemPage() {
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<AuctionItemDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [amount, setAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchItem = () => {
    fetch(`/api/auctions/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then((data) => {
        setItem(data.item);
        const minAcceptable = data.item.bidCount > 0
          ? data.item.currentPrice + data.item.minIncrement
          : data.item.startPrice;
        setAmount((minAcceptable / 100).toString());
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItem(); }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    setError(null);
    setSuccess(null);

    const amountCents = Math.round(parseFloat(amount.replace(',', '.')) * 100);

    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Merci de remplir tous les champs.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`/api/auctions/${id}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountCents, bidderName: name, bidderEmail: email, bidderPhone: phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.");
        return;
      }
      setSuccess(`Votre mise de ${formatPrice(amountCents)} € a bien été enregistrée (réf. ${data.reference}). Nous vous contacterons si vous remportez l'objet.`);
      fetchItem();
    } catch {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-hormadi-dark text-white flex items-center justify-center">
      <Loader2 className="animate-spin text-hormadi-ocean" size={32} />
    </div>;
  }

  if (notFound || !item) {
    return (
      <div className="min-h-screen bg-hormadi-dark text-white flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-hormadi-muted">Cet objet n'existe pas ou n'est plus disponible.</p>
        <Link href="/encheres" className="text-hormadi-red hover:text-white transition-colors">
          Retour aux enchères
        </Link>
      </div>
    );
  }

  const minAcceptable = item.bidCount > 0 ? item.currentPrice + item.minIncrement : item.startPrice;

  return (
    <div className="min-h-screen bg-hormadi-dark text-white">
      <div className="section-padding max-w-6xl mx-auto pt-8 pb-20 sm:pb-28">
        <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-8">
          <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
          <ChevronRight size={14} />
          <Link href="/encheres" className="hover:text-white transition-colors">Enchères</Link>
          <ChevronRight size={14} />
          <span className="text-white line-clamp-1">{item.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden border border-hormadi-border aspect-[4/3] bg-zinc-900">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Gavel size={64} className="text-white/10" />
              </div>
            )}
          </div>

          {/* Info + bid form */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-black mb-4">{item.title}</h1>
            <p className="text-hormadi-ice leading-relaxed mb-6 whitespace-pre-line">{item.description}</p>

            <div className="flex items-center gap-6 text-sm text-hormadi-muted mb-6">
              <span className="flex items-center gap-1.5"><Users size={14} /> {item.bidCount} mise{item.bidCount !== 1 ? 's' : ''}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {timeLeft(item.endDate)}</span>
            </div>

            <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6 mb-6">
              <p className="text-hormadi-muted text-xs uppercase tracking-wider mb-1">Mise actuelle</p>
              <p className="text-white font-black text-4xl">{formatPrice(item.currentPrice)} €</p>
            </div>

            {item.isEnded ? (
              <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6 text-center text-hormadi-muted">
                Cette enchère est terminée.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6 space-y-4">
                <h3 className="text-white font-bold uppercase text-sm tracking-wider mb-2">Faire une offre</h3>

                <div>
                  <label className="block text-sm text-hormadi-muted mb-1.5">
                    Votre mise (minimum {formatPrice(minAcceptable)} €)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      min={minAcceptable / 100}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-2.5 bg-hormadi-dark border border-hormadi-border rounded-lg text-white focus:outline-none focus:border-hormadi-ocean transition-colors"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-hormadi-muted">€</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-hormadi-muted mb-1.5">Nom complet</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-hormadi-muted mb-1.5">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-hormadi-muted mb-1.5">Téléphone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-hormadi-dark border border-hormadi-border rounded-lg text-white placeholder-hormadi-muted focus:outline-none focus:border-hormadi-ocean transition-colors"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" /> {error}
                  </div>
                )}
                {success && (
                  <div className="flex items-start gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
                    <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" /> {success}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-lg font-bold uppercase text-white text-sm bg-hormadi-red hover:bg-hormadi-red/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : <Gavel size={18} />}
                  {submitting ? 'Envoi…' : 'Miser'}
                </button>
                <p className="text-hormadi-muted text-xs text-center">
                  En cas de victoire, le club vous contactera pour organiser le paiement et la remise de l'objet.
                </p>
              </form>
            )}

            {item.recentBids.length > 0 && (
              <div className="mt-6">
                <h3 className="text-white font-bold uppercase text-xs tracking-wider mb-3">Dernières mises</h3>
                <div className="space-y-2">
                  {item.recentBids.map((bid, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-hormadi-surface/50 border border-hormadi-border/50 rounded-lg px-4 py-2.5">
                      <span className="text-hormadi-muted">Enchérisseur {bid.bidderInitial}.</span>
                      <span className="text-white font-bold">{formatPrice(bid.amount)} €</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
