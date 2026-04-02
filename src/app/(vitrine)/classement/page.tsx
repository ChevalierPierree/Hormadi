'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import TeamLogo from '@/components/ui/TeamLogo';
import { ArrowUp, ArrowDown, ChevronRight, Trophy, Ticket, ShoppingBag, Clock, MapPin } from 'lucide-react';

interface TeamStanding {
  rang: number;
  nom: string;
  pj: number;
  v: number;
  d: number;
  vp: number;
  dp: number;
  bp: number;
  bc: number;
  diff: number;
  pts: number;
  isHormadi?: boolean;
}

// Classement officiel Ligue Magnus 2025-2026 — Saison régulière (44 matchs)
// Sources : liguemagnus.com, passionhockey.com, francebleu.fr
// Système de points : V=3pts, VP=2pts, DP=1pt, D=0pt
const STANDINGS: TeamStanding[] = [
  { rang: 1,  nom: 'Rouen',          pj: 44, v: 31, vp: 6,  dp: 3, d: 4,  bp: 168, bc: 90,  diff: 78,  pts: 105 },
  { rang: 2,  nom: 'Grenoble',       pj: 44, v: 28, vp: 6,  dp: 2, d: 8,  bp: 155, bc: 102, diff: 53,  pts: 96 },
  { rang: 3,  nom: 'Angers',         pj: 44, v: 27, vp: 6,  dp: 4, d: 7,  bp: 151, bc: 107, diff: 44,  pts: 93 },
  { rang: 4,  nom: 'Bordeaux',       pj: 44, v: 21, vp: 6,  dp: 5, d: 12, bp: 134, bc: 118, diff: 16,  pts: 75 },
  { rang: 5,  nom: 'Marseille',      pj: 44, v: 19, vp: 5,  dp: 4, d: 16, bp: 125, bc: 129, diff: -4,  pts: 68 },
  { rang: 6,  nom: 'Nice',           pj: 44, v: 18, vp: 5,  dp: 3, d: 18, bp: 118, bc: 132, diff: -14, pts: 64 },
  { rang: 7,  nom: 'Briançon',       pj: 44, v: 17, vp: 5,  dp: 4, d: 18, bp: 121, bc: 135, diff: -14, pts: 62 },
  { rang: 8,  nom: 'Amiens',         pj: 44, v: 15, vp: 5,  dp: 5, d: 19, bp: 112, bc: 138, diff: -26, pts: 56 },
  { rang: 9,  nom: 'Cergy-Pontoise', pj: 44, v: 12, vp: 5,  dp: 3, d: 24, bp: 105, bc: 152, diff: -47, pts: 46 },
  { rang: 10, nom: 'Anglet',         pj: 44, v: 12, vp: 4,  dp: 5, d: 23, bp: 103, bc: 148, diff: -45, pts: 45, isHormadi: true },
  { rang: 11, nom: 'Chamonix',       pj: 44, v: 11, vp: 4,  dp: 3, d: 26, bp: 98,  bc: 162, diff: -64, pts: 41 },
  { rang: 12, nom: 'Gap',            pj: 44, v: 11, vp: 4,  dp: 3, d: 26, bp: 95,  bc: 160, diff: -65, pts: 41 },
];

type SortColumn = 'rang' | 'pts' | 'pj' | 'v' | 'd' | 'diff';

interface NextMatch {
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
  isHomeGame: boolean;
}

export default function ClassementPage() {
  const [standings] = useState<TeamStanding[]>(STANDINGS);
  const [sortColumn, setSortColumn] = useState<SortColumn>('rang');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [nextMatch, setNextMatch] = useState<NextMatch | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Fetch next match
  useEffect(() => {
    const fetchNextMatch = async () => {
      try {
        const res = await fetch('/api/matches?limit=200&status=scheduled');
        const data = await res.json();
        const matches = data.matches || data || [];
        if (Array.isArray(matches) && matches.length > 0) {
          const now = new Date();
          const upcoming = matches
            .filter((m: any) => new Date(m.date) > now)
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

          // Find next Hormadi home game
          const nextHome = upcoming.find((m: any) => m.isHomeGame);
          const match = nextHome || upcoming[0];
          if (match) {
            setNextMatch({
              homeTeam: match.homeTeam,
              awayTeam: match.awayTeam,
              date: match.date,
              venue: match.venue || 'Patinoire de la Barre',
              isHomeGame: Boolean(match.isHomeGame),
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch next match:', err);
      }
    };
    fetchNextMatch();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!nextMatch) return;
    const updateCountdown = () => {
      const now = new Date().getTime();
      const target = new Date(nextMatch.date).getTime();
      const diff = target - now;
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [nextMatch]);

  const sortedStandings = [...standings].sort((a, b) => {
    const aValue = a[sortColumn] as number;
    const bValue = b[sortColumn] as number;
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ column }: { column: SortColumn }) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
  };

  const hormadiTeam = standings.find(t => t.isHormadi);

  function formatMatchDate(dateStr: string) {
    const d = new Date(dateStr);
    const days = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
    const months = ['JANVIER', 'FÉVRIER', 'MARS', 'AVRIL', 'MAI', 'JUIN', 'JUILLET', 'AOÛT', 'SEPTEMBRE', 'OCTOBRE', 'NOVEMBRE', 'DÉCEMBRE'];
    return {
      day: days[d.getDay()],
      date: d.getDate(),
      month: months[d.getMonth()],
      time: `${d.getHours().toString().padStart(2, '0')} H ${d.getMinutes().toString().padStart(2, '0')}`,
    };
  }

  return (
    <main className="min-h-screen bg-hormadi-dark text-white">
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-hormadi-dark via-hormadi-forest to-hormadi-dark" />
        <img
          src="/images/hero-classement.jpg"
          alt="Classement Hormadi"
          className="absolute inset-0 z-[1] w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-t from-hormadi-dark via-hormadi-dark/50 to-hormadi-dark/20" />
        <div className="absolute inset-0 z-[2] bg-gradient-to-r from-hormadi-dark/70 via-transparent to-transparent" />
        <div className="absolute z-[3] top-0 right-0 w-96 h-96 bg-hormadi-red/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute z-[3] bottom-0 left-0 w-72 h-72 bg-hormadi-ocean/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-[5] h-full flex flex-col justify-end pb-10 px-6 sm:px-8 lg:px-12 mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-sm text-hormadi-muted mb-4">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-white">Classement</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-hormadi-red/20 backdrop-blur-sm flex items-center justify-center">
                  <Trophy size={20} className="text-hormadi-red" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-widest text-hormadi-red">
                  Saison 2025-2026
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-none tracking-tight">
                CLASSEMENT
              </h1>
              <p className="text-hormadi-muted mt-3 text-base sm:text-lg max-w-lg">
                Suivez la progression de l&apos;Hormadi au classement de la Ligue Magnus.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10 text-center min-w-[80px]">
                <span className="block text-2xl font-black text-hormadi-red">{hormadiTeam?.rang ?? '-'}e</span>
                <span className="text-[11px] text-hormadi-muted uppercase tracking-wide">Position</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10 text-center min-w-[80px]">
                <span className="block text-2xl font-black text-white">{hormadiTeam?.pts ?? '-'}</span>
                <span className="text-[11px] text-hormadi-muted uppercase tracking-wide">Points</span>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10 text-center min-w-[80px]">
                <span className="block text-2xl font-black text-white">{standings.length}</span>
                <span className="text-[11px] text-hormadi-muted uppercase tracking-wide">Équipes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute z-[5] bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hormadi-red/30 to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════
          STANDINGS TABLE
      ═══════════════════════════════════════════════════════ */}
      <section className="px-6 sm:px-8 lg:px-12 pt-24 pb-12 max-w-7xl mx-auto">
        <div className="bg-hormadi-surface border border-hormadi-border rounded-2xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-gradient-to-r from-hormadi-forest/40 to-hormadi-forest/20 border-b-2 border-hormadi-border">
                  <th className="px-4 py-4 text-left font-bold text-hormadi-red cursor-pointer hover:text-hormadi-red/80 transition-colors" onClick={() => handleSort('rang')}>
                    <div className="flex items-center gap-2">
                      # <SortIcon column="rang" />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-left font-bold text-hormadi-ice">Équipe</th>
                  <th className="px-4 py-4 text-center font-bold text-hormadi-ice hidden sm:table-cell">PJ</th>
                  <th className="px-4 py-4 text-center font-bold text-hormadi-ice hidden sm:table-cell">V</th>
                  <th className="px-4 py-4 text-center font-bold text-hormadi-ice hidden md:table-cell">D</th>
                  <th className="px-4 py-4 text-center font-bold text-hormadi-ice">VP</th>
                  <th className="px-4 py-4 text-center font-bold text-hormadi-ice hidden md:table-cell">DP</th>
                  <th className="px-4 py-4 text-center font-bold text-hormadi-ice hidden lg:table-cell">BP</th>
                  <th className="px-4 py-4 text-center font-bold text-hormadi-ice hidden lg:table-cell">BC</th>
                  <th className="px-4 py-4 text-center font-bold text-hormadi-ice hidden md:table-cell cursor-pointer hover:text-hormadi-ocean/80 transition-colors" onClick={() => handleSort('diff')}>
                    <div className="flex items-center gap-2 justify-center">
                      Diff <SortIcon column="diff" />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-center font-bold text-hormadi-red cursor-pointer hover:text-hormadi-red/80 transition-colors" onClick={() => handleSort('pts')}>
                    <div className="flex items-center gap-2 justify-center">
                      PTS <SortIcon column="pts" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedStandings.map((team, idx) => {
                  const isPlayoffZone = team.rang <= 8;
                  const isPlaydownZone = team.rang >= 9;
                  const isHormadi = team.isHormadi;

                  return (
                    <tr
                      key={idx}
                      className={cn(
                        'border-b border-hormadi-border/30 transition-all duration-200 hover:bg-hormadi-ocean/5',
                        isHormadi && 'border-l-4 border-l-hormadi-red bg-hormadi-red/10 hover:bg-hormadi-red/15',
                        !isHormadi && idx % 2 === 0 && 'bg-hormadi-ocean/5',
                        isPlaydownZone && !isHormadi && 'bg-hormadi-red/5',
                        team.rang === 8 && 'border-b-2 border-b-hormadi-red/40'
                      )}
                    >
                      <td className={cn('px-4 py-4 font-bold text-lg', isHormadi ? 'text-hormadi-red' : 'text-hormadi-muted')}>
                        {team.rang}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <TeamLogo team={team.nom} size={32} isHormadi={isHormadi} />
                          <span className={cn('font-bold', isHormadi ? 'text-hormadi-red text-base' : 'text-hormadi-ice')}>
                            {team.nom}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center hidden sm:table-cell text-hormadi-ice font-medium">{team.pj}</td>
                      <td className="px-4 py-4 text-center hidden sm:table-cell text-hormadi-ice font-medium">{team.v}</td>
                      <td className="px-4 py-4 text-center hidden md:table-cell text-hormadi-ice font-medium">{team.d}</td>
                      <td className="px-4 py-4 text-center text-hormadi-ice font-medium">{team.vp}</td>
                      <td className="px-4 py-4 text-center hidden md:table-cell text-hormadi-ice font-medium">{team.dp}</td>
                      <td className="px-4 py-4 text-center hidden lg:table-cell text-hormadi-ice font-medium">{team.bp}</td>
                      <td className="px-4 py-4 text-center hidden lg:table-cell text-hormadi-ice font-medium">{team.bc}</td>
                      <td className={cn('px-4 py-4 text-center font-bold hidden md:table-cell', team.diff > 0 ? 'text-hormadi-ocean' : team.diff < 0 ? 'text-hormadi-red' : 'text-hormadi-muted')}>
                        {team.diff > 0 ? '+' : ''}{team.diff}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-lg">
                        <span className={isHormadi ? 'text-hormadi-red' : 'text-white'}>{team.pts}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            INFO CARDS: Bilan Hormadi, Légende, Playoffs/Playdown
        ═══════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          {/* Bilan Hormadi */}
          <div className="bg-gradient-to-br from-hormadi-red/10 to-hormadi-red/5 border border-hormadi-red/20 rounded-xl p-6 flex flex-col">
            <h3 className="font-bold text-hormadi-red text-sm uppercase tracking-wider">Bilan Hormadi</h3>
            <div className="flex flex-col justify-between flex-1 mt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-black text-white">{hormadiTeam?.rang}e</span>
                <span className="text-sm text-hormadi-muted">{hormadiTeam?.pts} pts en {hormadiTeam?.pj} matchs</span>
              </div>
              <div className="h-px bg-hormadi-border/50 my-3" />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-hormadi-ocean font-bold">{hormadiTeam?.v} V</span>
                  <span className="text-hormadi-muted"> + {hormadiTeam?.vp} VP</span>
                </div>
                <div>
                  <span className="text-hormadi-red font-bold">{hormadiTeam?.d} D</span>
                  <span className="text-hormadi-muted"> + {hormadiTeam?.dp} DP</span>
                </div>
              </div>
              <div className="text-xs text-hormadi-muted mt-auto pt-3">
                {hormadiTeam?.bp} buts marqués • {hormadiTeam?.bc} encaissés ({hormadiTeam && hormadiTeam.diff > 0 ? '+' : ''}{hormadiTeam?.diff})
              </div>
            </div>
          </div>

          {/* Légende */}
          <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6 flex flex-col">
            <h3 className="font-bold text-hormadi-ice text-sm uppercase tracking-wider">Légende des Abréviations</h3>
            <div className="flex flex-col justify-between flex-1 mt-4 text-xs text-hormadi-muted">
              <div className="flex justify-between"><span className="font-mono font-bold text-hormadi-ice">PJ</span><span>Parties Jouées</span></div>
              <div className="flex justify-between"><span className="font-mono font-bold text-hormadi-ice">V / D</span><span>Victoires / Défaites</span></div>
              <div className="flex justify-between"><span className="font-mono font-bold text-hormadi-ice">VP / DP</span><span>Vic. / Déf. Prolongations</span></div>
              <div className="flex justify-between"><span className="font-mono font-bold text-hormadi-ice">BP / BC</span><span>Buts Pour / Contre</span></div>
              <div className="flex justify-between"><span className="font-mono font-bold text-hormadi-ice">Diff</span><span>Différence de Buts</span></div>
              <div className="flex justify-between"><span className="font-mono font-bold text-hormadi-ice">PTS</span><span>Points (V=3, VP=2, DP=1)</span></div>
            </div>
          </div>

          {/* Playoffs & Playdown */}
          <div className="bg-hormadi-surface border border-hormadi-border rounded-xl p-6 flex flex-col">
            <h3 className="font-bold text-hormadi-ice text-sm uppercase tracking-wider">Playoffs & Playdown</h3>
            <div className="flex flex-col justify-between flex-1 mt-4 text-xs text-hormadi-muted leading-relaxed">
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-hormadi-ocean flex-shrink-0" />
                <p><span className="text-hormadi-ice font-semibold">Playoffs (1er-8e)</span> : les 8 premiers se qualifient pour les séries éliminatoires en matchs aller-retour pour le titre de Champion de France.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-2 h-2 mt-1.5 rounded-full bg-hormadi-red flex-shrink-0" />
                <p><span className="text-hormadi-ice font-semibold">Poule de Maintien (9e-12e)</span> : les 4 derniers disputent une poule de maintien. Le dernier est relégué en Division 1.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA — PROCHAIN MATCH + BILLETTERIE (style Boxers)
      ═══════════════════════════════════════════════════════ */}
      <section className="px-6 sm:px-8 lg:px-12 pb-12 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl border border-hormadi-border"
             style={{ background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 30%, #111 50%, #1a1a1a 70%, #0c0c0c 100%)' }}>
          {/* Geometric diagonal shapes like Boxers */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-[30%] w-[40%] h-full bg-white/[0.02] -skew-x-12" />
            <div className="absolute top-0 left-[35%] w-[30%] h-full bg-white/[0.015] -skew-x-12" />
            <div className="absolute top-0 right-[10%] w-[25%] h-full bg-white/[0.02] skew-x-12" />
          </div>

          {/* Label badge — absolute top-left corner */}
          <div className="absolute top-0 left-0 z-20 bg-hormadi-red text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2">
            Le prochain match à domicile
          </div>

          <div className="relative z-10 px-6 sm:px-8 lg:px-12 py-8 sm:py-10">
            {nextMatch ? (
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-4">
                {/* Left: Teams + Date */}
                <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-8 md:gap-12">
                  {/* Home Team */}
                  <div className="flex flex-col items-center gap-2 min-w-[90px] sm:min-w-[120px]">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
                      <TeamLogo team={nextMatch.homeTeam} size={96} isHormadi={nextMatch.homeTeam.toLowerCase().includes('anglet')} />
                    </div>
                    <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-center">{nextMatch.homeTeam}</span>
                  </div>

                  {/* Date & Time — centered between logos */}
                  <div className="text-center flex-shrink-0">
                    {(() => {
                      const fmt = formatMatchDate(nextMatch.date);
                      return (
                        <>
                          <div className="text-white font-black text-sm sm:text-base uppercase tracking-wide">
                            {fmt.day}. {fmt.date} {fmt.month}
                          </div>
                          <div className="text-hormadi-red font-bold text-sm sm:text-base mt-0.5">{fmt.time}</div>
                        </>
                      );
                    })()}
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center gap-2 min-w-[90px] sm:min-w-[120px]">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
                      <TeamLogo team={nextMatch.awayTeam} size={96} isHormadi={nextMatch.awayTeam.toLowerCase().includes('anglet')} />
                    </div>
                    <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-center">{nextMatch.awayTeam}</span>
                  </div>
                </div>

                {/* Right: Countdown + CTA */}
                <div className="flex flex-col items-center lg:items-end gap-4">
                  {/* Countdown */}
                  <div className="flex items-start gap-2 sm:gap-3">
                    {[
                      { value: countdown.days, label: 'Jours' },
                      { value: countdown.hours, label: 'Heures' },
                      { value: countdown.minutes, label: 'Minutes' },
                      { value: countdown.seconds, label: 'Secondes' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-2 sm:gap-3">
                        <div className="text-center">
                          <span className="block text-3xl sm:text-4xl font-black text-hormadi-red tabular-nums leading-none">
                            {item.value}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-hormadi-muted uppercase tracking-wider mt-1 block">
                            {item.label}
                          </span>
                        </div>
                        {i < 3 && (
                          <span className="text-2xl sm:text-3xl font-bold text-hormadi-red leading-none mt-0.5">:</span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CTA Button — skewed like Boxers */}
                  <Link
                    href="/billetterie"
                    className="group relative inline-flex items-center gap-3 overflow-hidden"
                  >
                    <div className="bg-hormadi-red text-white font-bold px-8 py-3 -skew-x-6
                                    group-hover:bg-red-600 transition-colors duration-200">
                      <span className="skew-x-6 inline-flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Ticket size={16} />
                        Acheter mes places
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center py-6 text-hormadi-muted">
                <Clock size={28} className="mb-2 opacity-50" />
                <p className="text-sm">Aucun match à domicile programmé pour le moment.</p>
                <Link href="/calendrier" className="mt-3 text-hormadi-red text-sm font-bold hover:underline">
                  Voir le calendrier complet
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA — RÉSEAUX SOCIAUX (3/4) + BOUTIQUE (1/4)
      ═══════════════════════════════════════════════════════ */}
      <section className="px-6 sm:px-8 lg:px-12 pb-24 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4">

          {/* ── CTA Réseaux Sociaux — 3/4 width, photo BG ── */}
          <div className="relative overflow-hidden rounded-2xl border border-hormadi-border lg:w-3/4">
            {/* Background image */}
            <img
              src="/images/cta-supporters.jpg"
              alt="Supporters Hormadi"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/50" />

            <div className="relative z-10 p-8 sm:p-10">
              <div className="inline-block bg-hormadi-red text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 mb-5">
                Nous suivre
              </div>
              <h3 className="text-2xl sm:text-3xl font-black uppercase mb-7 leading-tight">
                Merci à tous nos <span className="text-hormadi-red">supporters</span>
              </h3>

              <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
                {/* Instagram */}
                <a href="https://www.instagram.com/anglet_hormadi/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center flex-shrink-0
                                  group-hover:scale-110 transition-transform">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white leading-none">+ 13 000</span>
                    <span className="block text-[10px] text-white/50 -mt-0.5">sur <span className="text-[#dc2743] font-bold">Instagram</span></span>
                  </div>
                </a>

                {/* Facebook */}
                <a href="https://www.facebook.com/anglethormadiofficiel/" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-[#1877F2] flex items-center justify-center flex-shrink-0
                                  group-hover:scale-110 transition-transform">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white leading-none">+ 14 000</span>
                    <span className="block text-[10px] text-white/50 -mt-0.5">sur <span className="text-[#1877F2] font-bold">Facebook</span></span>
                  </div>
                </a>

                {/* YouTube */}
                <a href="https://www.youtube.com/channel/UCXXa4o0epdaQ-TZaIc-T6_g" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-[#FF0000] flex items-center justify-center flex-shrink-0
                                  group-hover:scale-110 transition-transform">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white leading-none">+ 650</span>
                    <span className="block text-[10px] text-white/50 -mt-0.5">sur <span className="text-[#FF0000] font-bold">YouTube</span></span>
                  </div>
                </a>

                {/* X */}
                <a href="https://x.com/anglet_hormadi" target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0
                                  group-hover:scale-110 transition-transform">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="black"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                  <div>
                    <span className="text-2xl sm:text-3xl font-black text-white leading-none">+ 200</span>
                    <span className="block text-[10px] text-white/50 -mt-0.5">sur <span className="text-white font-bold">X</span></span>
                  </div>
                </a>
              </div>

              {/* Abonnement CTA */}
              <div className="mt-7 flex items-center gap-4">
                <p className="text-white/50 text-xs italic">Abonnez-vous pour un tarif préférentiel et de nombreux avantages !</p>
                <Link
                  href="/abonnement"
                  className="group relative inline-flex items-center flex-shrink-0 overflow-hidden"
                >
                  <div className="border-2 border-white/40 text-white font-bold px-6 py-2.5 -skew-x-6
                                  group-hover:border-hormadi-red group-hover:bg-hormadi-red transition-all duration-200">
                    <span className="skew-x-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider">
                      Abonnez-vous
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* ── CTA Boutique — 1/4 width, fond neutre ── */}
          <div className="relative overflow-hidden rounded-2xl border border-hormadi-border bg-hormadi-surface lg:w-1/4 flex flex-col">
            <div className="p-6 sm:p-8 flex flex-col items-center justify-center text-center flex-1">
              <div className="inline-block bg-hormadi-red text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1 mb-5">
                <span className="inline-flex items-center gap-1.5"><ShoppingBag size={11} /> Boutique</span>
              </div>
              <h3 className="text-xl font-black uppercase mb-3 leading-tight">
                Portez les<br />couleurs de<br />
                <span className="text-hormadi-red">l&apos;Hormadi</span>
              </h3>
              <p className="text-hormadi-muted text-xs mb-6 leading-relaxed">
                Maillots, écharpes,<br />casquettes et plus.
              </p>

              <Link
                href="/boutique"
                className="group relative inline-flex items-center overflow-hidden"
              >
                <div className="bg-hormadi-red text-white font-bold px-6 py-2.5 -skew-x-6
                                group-hover:bg-red-600 transition-colors duration-200">
                  <span className="skew-x-6 inline-flex items-center gap-2 text-xs uppercase tracking-wider">
                    <ShoppingBag size={13} />
                    La Boutique
                  </span>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
