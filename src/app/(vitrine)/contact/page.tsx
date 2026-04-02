'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import {
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  MessageSquare,
  Ticket,
  Handshake,
  HelpCircle,
  ShoppingBag,
  Crown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Instagram,
  Facebook,
  Youtube,
} from 'lucide-react';

/* ─── Subject options with icons ─────────────────────────────── */
const SUBJECTS = [
  {
    id: 'general',
    label: 'Question générale',
    icon: HelpCircle,
    color: 'hormadi-ocean',
    description: 'Informations sur le club, les horaires, etc.',
  },
  {
    id: 'billetterie',
    label: 'Billetterie',
    icon: Ticket,
    color: 'hormadi-red',
    description: 'Places, abonnements, tarifs de matchs.',
  },
  {
    id: 'partenariat',
    label: 'Partenariat',
    icon: Handshake,
    color: 'hormadi-ocean',
    description: 'Devenir partenaire, sponsoring, H Business.',
  },
  {
    id: 'hospitalites',
    label: 'Hospitalités',
    icon: Crown,
    color: 'hormadi-red',
    description: 'Loges VIP, salons, événements privés.',
  },
  {
    id: 'boutique',
    label: 'Boutique',
    icon: ShoppingBag,
    color: 'hormadi-ocean',
    description: 'Commandes, échanges, produits dérivés.',
  },
  {
    id: 'presse',
    label: 'Presse & Médias',
    icon: MessageSquare,
    color: 'hormadi-red',
    description: 'Demandes d\'accréditation, interviews.',
  },
];

/* ─── Contact cards data ─────────────────────────────────────── */
const CONTACT_CARDS = [
  {
    icon: MapPin,
    title: 'Adresse',
    lines: ['Patinoire de la Barre', '2 Rue de Hausquette', '64600 Anglet'],
    accent: 'hormadi-red',
  },
  {
    icon: Phone,
    title: 'Téléphone',
    lines: ['05 59 52 98 15'],
    accent: 'hormadi-ocean',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['contact@hormadi.fr'],
    accent: 'hormadi-red',
  },
  {
    icon: Clock,
    title: 'Horaires bureau',
    lines: ['Lun-Ven : 9h - 17h', 'Fermé les jours de match'],
    accent: 'hormadi-ocean',
  },
];

/* ─── Main Component ──────────────────────────────────────────── */
export default function ContactPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLDivElement>(null);

  const handleSubjectSelect = (id: string) => {
    setSelectedSubject(id);
    // Smooth scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;

    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          subject: SUBJECTS.find((s) => s.id === selectedSubject)?.label || selectedSubject,
        }),
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', message: '' });
        setSelectedSubject(null);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-hormadi-dark text-white">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-[45vh] min-h-[350px] max-h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/hero-contact.jpg"
          alt="Contact Hormadi"
          className="absolute inset-0 z-[1] w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/60 to-hormadi-dark/20" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-hormadi-dark/70 via-transparent to-transparent" />
        <div className="absolute z-[3] top-0 right-0 w-96 h-96 bg-hormadi-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute z-[3] bottom-0 left-0 w-72 h-72 bg-hormadi-ocean/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-[5] h-full flex flex-col justify-end pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Contact</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
              <Mail size={20} className="text-hormadi-red" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
              Parlons hockey
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
            CONTACTEZ-NOUS
          </h1>
          <p className="text-hormadi-muted mt-3 text-base sm:text-lg max-w-lg">
            Une question, une demande ? L'équipe Hormadi est à votre écoute.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STEP 1 — SELECT SUBJECT (interactive cards)
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <div className="section-padding max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-hormadi-red/10 border border-hormadi-red/20 rounded-full px-5 py-2 mb-6">
              <span className="w-6 h-6 rounded-full bg-hormadi-red flex items-center justify-center text-white text-xs font-black">1</span>
              <span className="text-hormadi-red font-bold text-sm uppercase tracking-wider">Choisissez votre sujet</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              COMMENT POUVONS-NOUS VOUS AIDER ?
            </h2>
            <p className="text-hormadi-muted text-base sm:text-lg max-w-xl mx-auto">
              Sélectionnez la catégorie qui correspond à votre demande pour que nous puissions vous orienter au mieux.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
            {SUBJECTS.map((subject) => {
              const Icon = subject.icon;
              const isSelected = selectedSubject === subject.id;
              const isRed = subject.color === 'hormadi-red';

              return (
                <button
                  key={subject.id}
                  onClick={() => handleSubjectSelect(subject.id)}
                  className={`relative group text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300
                    ${isSelected
                      ? isRed
                        ? 'border-hormadi-red bg-hormadi-red/10 shadow-lg shadow-hormadi-red/10 scale-[1.02]'
                        : 'border-hormadi-ocean bg-hormadi-ocean/10 shadow-lg shadow-hormadi-ocean/10 scale-[1.02]'
                      : 'border-hormadi-border bg-hormadi-surface/50 hover:border-hormadi-ocean/40 hover:bg-hormadi-surface'
                    }`}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center
                      ${isRed ? 'bg-hormadi-red' : 'bg-hormadi-ocean'}`}>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}

                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300
                    ${isSelected
                      ? isRed ? 'bg-hormadi-red/20' : 'bg-hormadi-ocean/20'
                      : 'bg-white/[0.05] group-hover:bg-hormadi-ocean/10'
                    }`}>
                    <Icon className={`w-5 h-5 transition-colors duration-300
                      ${isSelected
                        ? isRed ? 'text-hormadi-red' : 'text-hormadi-ocean'
                        : 'text-hormadi-muted group-hover:text-hormadi-ocean'
                      }`} />
                  </div>

                  <h3 className={`font-bold text-sm sm:text-base mb-1 transition-colors duration-300
                    ${isSelected ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                    {subject.label}
                  </h3>
                  <p className="text-hormadi-muted text-xs sm:text-sm leading-relaxed">
                    {subject.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STEP 2 — CONTACT FORM + INFO SIDEBAR
      ═══════════════════════════════════════════════════════ */}
      <section ref={formRef} className="pb-20 sm:pb-28">
        <div className="section-padding max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-hormadi-ocean/10 border border-hormadi-ocean/20 rounded-full px-5 py-2 mb-6">
              <span className="w-6 h-6 rounded-full bg-hormadi-ocean flex items-center justify-center text-white text-xs font-black">2</span>
              <span className="text-hormadi-ocean font-bold text-sm uppercase tracking-wider">Envoyez votre message</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              DITES-NOUS TOUT
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {/* ─── Form (2/3 width) ─── */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div className="rounded-2xl border border-hormadi-success/30 bg-hormadi-success/5 p-10 sm:p-14 text-center">
                  <div className="w-16 h-16 rounded-full bg-hormadi-success/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-hormadi-success" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3">MESSAGE ENVOYÉ !</h3>
                  <p className="text-hormadi-muted text-base max-w-md mx-auto mb-8">
                    Merci pour votre message. Nous vous répondrons dans les meilleurs délais, généralement sous 48h.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center gap-2 bg-hormadi-red text-white font-bold px-6 py-3 rounded-lg
                               hover:bg-hormadi-red/90 transition-all text-sm uppercase tracking-wider"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Subject display */}
                  {selectedSubject && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-hormadi-surface/80 border border-hormadi-border">
                      {(() => {
                        const s = SUBJECTS.find((x) => x.id === selectedSubject);
                        if (!s) return null;
                        const SIcon = s.icon;
                        return (
                          <>
                            <SIcon className={`w-5 h-5 ${s.color === 'hormadi-red' ? 'text-hormadi-red' : 'text-hormadi-ocean'}`} />
                            <span className="font-bold text-white text-sm">{s.label}</span>
                            <button
                              type="button"
                              onClick={() => setSelectedSubject(null)}
                              className="ml-auto text-hormadi-muted text-xs hover:text-white transition-colors"
                            >
                              Changer
                            </button>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-hormadi-muted mb-2">
                        Prénom <span className="text-hormadi-red">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Votre prénom"
                        className="w-full bg-hormadi-surface/80 border border-hormadi-border rounded-xl px-5 py-3.5
                                   text-white placeholder:text-hormadi-muted/50 text-sm
                                   focus:outline-none focus:border-hormadi-ocean focus:ring-1 focus:ring-hormadi-ocean/30
                                   transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-hormadi-muted mb-2">
                        Nom <span className="text-hormadi-red">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Votre nom"
                        className="w-full bg-hormadi-surface/80 border border-hormadi-border rounded-xl px-5 py-3.5
                                   text-white placeholder:text-hormadi-muted/50 text-sm
                                   focus:outline-none focus:border-hormadi-ocean focus:ring-1 focus:ring-hormadi-ocean/30
                                   transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Email + Phone row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-hormadi-muted mb-2">
                        Email <span className="text-hormadi-red">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="votre@email.com"
                        className="w-full bg-hormadi-surface/80 border border-hormadi-border rounded-xl px-5 py-3.5
                                   text-white placeholder:text-hormadi-muted/50 text-sm
                                   focus:outline-none focus:border-hormadi-ocean focus:ring-1 focus:ring-hormadi-ocean/30
                                   transition-all duration-300"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-hormadi-muted mb-2">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="06 XX XX XX XX"
                        className="w-full bg-hormadi-surface/80 border border-hormadi-border rounded-xl px-5 py-3.5
                                   text-white placeholder:text-hormadi-muted/50 text-sm
                                   focus:outline-none focus:border-hormadi-ocean focus:ring-1 focus:ring-hormadi-ocean/30
                                   transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-hormadi-muted mb-2">
                      Message <span className="text-hormadi-red">*</span>
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Décrivez votre demande..."
                      className="w-full bg-hormadi-surface/80 border border-hormadi-border rounded-xl px-5 py-3.5
                                 text-white placeholder:text-hormadi-muted/50 text-sm resize-none
                                 focus:outline-none focus:border-hormadi-ocean focus:ring-1 focus:ring-hormadi-ocean/30
                                 transition-all duration-300"
                    />
                  </div>

                  {/* Error */}
                  {status === 'error' && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-hormadi-red/10 border border-hormadi-red/30">
                      <AlertCircle className="w-5 h-5 text-hormadi-red flex-shrink-0" />
                      <p className="text-hormadi-red text-sm">
                        Une erreur est survenue. Veuillez réessayer ou nous contacter directement par téléphone.
                      </p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!selectedSubject || status === 'sending'}
                    className={`w-full flex items-center justify-center gap-3 py-4 px-8 rounded-xl font-bold uppercase text-sm tracking-wider
                               transition-all duration-300 group
                      ${selectedSubject
                        ? 'bg-hormadi-red text-white hover:bg-hormadi-red/90 hover:shadow-lg hover:shadow-hormadi-red/30 cursor-pointer'
                        : 'bg-hormadi-surface border border-hormadi-border text-hormadi-muted cursor-not-allowed'
                      }`}
                  >
                    {status === 'sending' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        {selectedSubject ? 'Envoyer mon message' : 'Sélectionnez un sujet pour continuer'}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ─── Sidebar info cards (1/3 width) ─── */}
            <div className="space-y-4">
              {CONTACT_CARDS.map((card, idx) => {
                const CIcon = card.icon;
                const isRed = card.accent === 'hormadi-red';
                return (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-hormadi-border bg-hormadi-surface/50
                               hover:border-hormadi-ocean/30 transition-all duration-300 group"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                        ${isRed ? 'bg-hormadi-red/15' : 'bg-hormadi-ocean/15'}`}>
                        <CIcon className={`w-5 h-5 ${isRed ? 'text-hormadi-red' : 'text-hormadi-ocean'}`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm mb-1.5">{card.title}</h4>
                        {card.lines.map((line, lidx) => (
                          <p key={lidx} className="text-hormadi-muted text-sm leading-relaxed">{line}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Social links */}
              <div className="p-5 rounded-2xl border border-hormadi-border bg-hormadi-surface/50">
                <h4 className="font-bold text-white text-sm mb-4">Suivez-nous</h4>
                <div className="flex items-center gap-3">
                  {[
                    { icon: Instagram, href: 'https://www.instagram.com/hormadi_officiel', label: 'Instagram' },
                    { icon: Facebook, href: 'https://www.facebook.com/HormadiOfficiel', label: 'Facebook' },
                    { icon: Youtube, href: 'https://www.youtube.com/@hormadiofficiel', label: 'YouTube' },
                  ].map((social) => {
                    const SIcon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-xl bg-white/[0.05] border border-hormadi-border
                                   flex items-center justify-center hover:border-hormadi-red/50 hover:bg-hormadi-red/10
                                   transition-all duration-300 group"
                      >
                        <SIcon className="w-4 h-4 text-hormadi-muted group-hover:text-hormadi-red transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Quick links */}
              <div className="p-5 rounded-2xl border border-hormadi-border bg-hormadi-surface/50">
                <h4 className="font-bold text-white text-sm mb-4">Accès rapide</h4>
                <div className="space-y-2.5">
                  {[
                    { label: 'Billetterie', href: '/billetterie' },
                    { label: 'Hospitalités & Loges VIP', href: '/hospitalites' },
                    { label: 'Devenir partenaire', href: '/partenaires' },
                  ].map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="flex items-center gap-2 text-hormadi-muted text-sm hover:text-white transition-colors group"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-hormadi-red group-hover:translate-x-0.5 transition-transform" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CONTACT DIRECT — Commerciaux (like hospitalités page)
      ═══════════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 border-t border-hormadi-border overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 30%, #111 50%, #1a1a1a 70%, #0c0c0c 100%)' }} />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-[30%] w-[40%] h-full bg-white/[0.02] -skew-x-12" />
          <div className="absolute top-0 right-[10%] w-[25%] h-full bg-white/[0.02] skew-x-12" />
        </div>

        <div className="relative z-10 section-padding max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-hormadi-red text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 mb-6">
              Contacts directs
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3">
              VOS INTERLOCUTEURS
            </h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              Pour les demandes de partenariat ou d'hospitalité, contactez directement notre équipe commerciale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Thomas Carton',
                role: 'Responsable Commercial',
                email: 't.carton@hormadi.fr',
                phone: '06 09 33 15 83',
              },
              {
                name: 'Philippe Ranger',
                role: 'Développement Partenariats',
                email: 'p.ranger@hormadi.fr',
                phone: '07 85 13 81 99',
              },
              {
                name: 'Accueil Club',
                role: 'Informations générales',
                email: 'contact@hormadi.fr',
                phone: '05 59 52 98 15',
              },
            ].map((person, idx) => (
              <div
                key={idx}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-7
                           hover:border-hormadi-red/40 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-hormadi-red/10 border border-hormadi-red/20
                                flex items-center justify-center mb-5">
                  <span className="text-hormadi-red font-black text-lg">
                    {person.name.split(' ').map((n) => n[0]).join('')}
                  </span>
                </div>
                <h3 className="text-white font-black text-lg mb-1">{person.name}</h3>
                <p className="text-gray-400 text-sm mb-5">{person.role}</p>
                <div className="space-y-2.5">
                  <a
                    href={`mailto:${person.email}`}
                    className="flex items-center gap-2.5 text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 text-hormadi-red flex-shrink-0" />
                    {person.email}
                  </a>
                  <a
                    href={`tel:${person.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2.5 text-gray-400 text-sm hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 text-hormadi-red flex-shrink-0" />
                    {person.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          MAP SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative">
        <div className="section-padding max-w-7xl mx-auto py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">NOUS TROUVER</h2>
              <p className="text-hormadi-muted text-sm">Patinoire de la Barre — Anglet, Pays Basque</p>
            </div>
            <a
              href="https://www.google.com/maps/place/Patinoire+de+la+Barre/@43.4834,-1.5184,17z"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-hormadi-ocean text-sm font-semibold hover:text-white transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Ouvrir dans Google Maps
            </a>
          </div>
          <div className="rounded-2xl overflow-hidden border border-hormadi-border h-[350px] sm:h-[400px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2899.2!2d-1.5231!3d43.4796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd5140e69b1e5f8b%3A0x6ab2a07943ef5f0!2sPatinoire+de+la+Barre!5e0!3m2!1sfr!2sfr!4v1700000000000!5m2!1sfr!2sfr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-hormadi-muted text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-hormadi-ocean" />
              Bus lignes 36 & 38 — Arrêt Patinoire
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-hormadi-red" />
              Parking gratuit les jours de match
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
