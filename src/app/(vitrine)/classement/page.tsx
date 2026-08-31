'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import TeamLogo from '@/components/ui/TeamLogo';
import { CLUB } from '@/lib/constants';
import { ArrowUp, ArrowDown, ChevronRight, Trophy, Ticket, Clock, MapPin } from 'lucide-react';
import BoutiqueSocialCTA from '@/components/sections/BoutiqueSocialCTA';

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

// Fallback hardcoded standings (used when DB is empty or API fails) — classement final Ligue Magnus 2025-2026
const FALLBACK_STANDINGS: TeamStanding[] = [
  { rang: 1,  nom: 'Dragons de Rouen',               pj: 44, v: 32, vp: 2, dp: 5, d: 5,  bp: 184, bc: 90,  diff: 94,  pts: 105 },
  { rang: 2,  nom: 'Brûleurs de Loups de Grenoble',  pj: 44, v: 29, vp: 3, dp: 3, d: 9,  bp: 196, bc: 101, diff: 95,  pts: 96 },
  { rang: 3,  nom: "Ducs d'Angers",                  pj: 44, v: 26, vp: 7, dp: 1, d: 11, bp: 159, bc: 101, diff: 58,  pts: 93 },
  { rang: 4,  nom: 'Boxers de Bordeaux',             pj: 44, v: 22, vp: 3, dp: 3, d: 15, bp: 136, bc: 120, diff: 16,  pts: 75 },
  { rang: 5,  nom: 'Spartiates de Marseille',        pj: 44, v: 18, vp: 4, dp: 5, d: 18, bp: 132, bc: 135, diff: -3,  pts: 68 },
  { rang: 6,  nom: 'Aigles de Nice',                 pj: 44, v: 15, vp: 7, dp: 5, d: 17, bp: 130, bc: 143, diff: -13, pts: 64 },
  { rang: 7,  nom: 'Diables Rouges de Briançon',     pj: 44, v: 13, vp: 9, dp: 5, d: 18, bp: 120, bc: 144, diff: -24, pts: 62 },
  { rang: 8,  nom: "Gothiques d'Amiens",             pj: 44, v: 16, vp: 1, dp: 7, d: 19, bp: 112, bc: 150, diff: -38, pts: 56 },
  { rang: 9,  nom: 'Jokers de Cergy-Pontoise',       pj: 44, v: 11, vp: 4, dp: 5, d: 24, bp: 134, bc: 146, diff: -12, pts: 46 },
  { rang: 10, nom: 'Hormadi Anglet',                 pj: 44, v: 11, vp: 4, dp: 4, d: 25, bp: 112, bc: 166, diff: -54, pts: 45, isHormadi: true },
  { rang: 11, nom: 'Rapaces de Gap',                 pj: 44, v: 9,  vp: 4, dp: 6, d: 25, bp: 112, bc: 167, diff: -55, pts: 41 },
  { rang: 12, nom: 'Pionniers de Chamonix',          pj: 44, v: 11, vp: 3, dp: 2, d: 27, bp: 102, bc: 166, diff: -64, pts: 41 },
];

const HORMADI_KEYWORDS = ['anglet', 'hormadi'];

function isHormadiTeam(name: string): boolean {
  const lower = name.toLowerCase();
  return HORMADI_KEYWORDS.some(k => lower.includes(k));
}

type SortColumn = 'rang' | 'pts' | 'pj' | 'v' | 'd' | 'diff';

interface NextMatch {
  homeTeam: string;
  awayTeam: string;
  date: string;
  venue: string;
  isHomeGame: boolean;
}

export default function ClassementPage() {
  const [standings, setStandings] = useState<TeamStanding[]>(FALLBACK_STANDINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [sortColumn, setSortColumn] = useState<SortColumn>('rang');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [nextMatch, setNextMatch] = useState<NextMatch | null>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [season, setSeason] = useState(CLUB.season);

  // Fetch standings from DB
  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const res = await fetch('/api/standings');
        const data = await res.json();
        const dbStandings = data.standings || [];

        if (data.season) setSeason(data.season);

        if (Array.isArray(dbStandings) && dbStandings.length > 0) {
          // Map DB fields to page fields
          const mapped: TeamStanding[] = dbStandings.map((s: any) => ({
            rang: s.rank,
            nom: s.team,
            pj: s.gp,
            v: s.w,
            d: s.l,
            vp: s.otw,
            dp: s.otl,
            bp: s.gf,
            bc: s.ga,
            diff: s.diff,
            pts: s.pts,
            isHormadi: isHormadiTeam(s.team),
          }));
          setStandings(mapped);
        }
        // If DB is empty, keep FALLBACK_STANDINGS
      } catch (err) {
        console.error('Failed to fetch standings:', err);
        // Keep fallback standings
      } finally {
        setIsLoading(false);
      }
    };
    fetchStandings();
  }, []);

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
                  Saison {season}
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
      <section className="relative overflow-hidden bg-gradient-to-b from-hormadi-dark via-hormadi-forest/25 to-hormadi-dark ice-pattern noise-overlay">
        <div className="absolute top-1/3 left-0 w-80 h-80 bg-hormadi-ocean/10 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-hormadi-red/10 rounded-full blur-3xl translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 px-6 sm:px-8 lg:px-12 pt-24 pb-12 max-w-7xl mx-auto">
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
          {nextMatch && (
            <div className="absolute top-0 left-0 z-20 bg-hormadi-red text-white text-[11px] font-bold uppercase tracking-wider px-5 py-2">
              {nextMatch.isHomeGame ? 'Le prochain match à domicile' : 'Le prochain match'}
            </div>
          )}

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
              <div className="flex flex-col items-center py-8 text-hormadi-muted">
                <Clock size={32} className="mb-3 opacity-40" />
                <p className="text-base font-semibold text-white mb-1">Pas de match à venir</p>
                <p className="text-sm">La saison est terminée ou le calendrier n&apos;est pas encore publié.</p>
                <Link href="/calendrier" className="mt-4 inline-flex items-center gap-2 text-hormadi-red text-sm font-bold hover:text-white transition-colors">
                  Voir le calendrier & résultats
                  <ChevronRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA — RÉSEAUX SOCIAUX + BOUTIQUE */}
      <BoutiqueSocialCTA />
    </main>
  );
}
