import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import { HOST_CITIES } from '../data/constants';
import { useMatches } from '../hooks/useMatches';
import { GROUP_MATCHES, KNOCKOUT_MATCHES, getMatchStatus, type GroupMatch } from '../data/matches';

const GROUPS = [
  { name: 'Group A', teams: [{ flag: '🇲🇽', name: 'Mexico' }, { flag: '🇿🇦', name: 'South Africa' }, { flag: '🇰🇷', name: 'South Korea' }, { flag: '🇨🇿', name: 'Czechia' }] },
  { name: 'Group B', teams: [{ flag: '🇨🇦', name: 'Canada' }, { flag: '🇧🇦', name: 'Bosnia & Herz.' }, { flag: '🇶🇦', name: 'Qatar' }, { flag: '🇨🇭', name: 'Switzerland' }] },
  { name: 'Group C', teams: [{ flag: '🇧🇷', name: 'Brazil' }, { flag: '🇲🇦', name: 'Morocco' }, { flag: '🇭🇹', name: 'Haiti' }, { flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', name: 'Scotland' }] },
  { name: 'Group D', teams: [{ flag: '🇺🇸', name: 'United States' }, { flag: '🇵🇾', name: 'Paraguay' }, { flag: '🇦🇺', name: 'Australia' }, { flag: '🇹🇷', name: 'Türkiye' }] },
  { name: 'Group E', teams: [{ flag: '🇩🇪', name: 'Germany' }, { flag: '🇪🇨', name: 'Ecuador' }, { flag: '🇨🇮', name: "Côte d'Ivoire" }, { flag: '🇨🇼', name: 'Curaçao' }] },
  { name: 'Group F', teams: [{ flag: '🇳🇱', name: 'Netherlands' }, { flag: '🇯🇵', name: 'Japan' }, { flag: '🇸🇪', name: 'Sweden' }, { flag: '🇹🇳', name: 'Tunisia' }] },
  { name: 'Group G', teams: [{ flag: '🇧🇪', name: 'Belgium' }, { flag: '🇮🇷', name: 'Iran' }, { flag: '🇪🇬', name: 'Egypt' }, { flag: '🇳🇿', name: 'New Zealand' }] },
  { name: 'Group H', teams: [{ flag: '🇪🇸', name: 'Spain' }, { flag: '🇺🇾', name: 'Uruguay' }, { flag: '🇸🇦', name: 'Saudi Arabia' }, { flag: '🇨🇻', name: 'Cape Verde' }] },
  { name: 'Group I', teams: [{ flag: '🇫🇷', name: 'France' }, { flag: '🇸🇳', name: 'Senegal' }, { flag: '🇮🇶', name: 'Iraq' }, { flag: '🇳🇴', name: 'Norway' }] },
  { name: 'Group J', teams: [{ flag: '🇦🇷', name: 'Argentina' }, { flag: '🇦🇹', name: 'Austria' }, { flag: '🇩🇿', name: 'Algeria' }, { flag: '🇯🇴', name: 'Jordan' }] },
  { name: 'Group K', teams: [{ flag: '🇵🇹', name: 'Portugal' }, { flag: '🇨🇴', name: 'Colombia' }, { flag: '🇺🇿', name: 'Uzbekistan' }, { flag: '🇨🇩', name: 'DR Congo' }] },
  { name: 'Group L', teams: [{ flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', name: 'England' }, { flag: '🇭🇷', name: 'Croatia' }, { flag: '🇬🇭', name: 'Ghana' }, { flag: '🇵🇦', name: 'Panama' }] },
];

const STADIUM_DETAILS: Record<string, { capacity: string; built: string; surface: string; image: string }> = {
  nyc: { capacity: '82,500', built: '2010', surface: 'Artificial turf', image: 'https://images.pexels.com/photos/1461370/pexels-photo-1461370.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  la: { capacity: '70,240', built: '2020', surface: 'Artificial turf', image: 'https://images.pexels.com/photos/38078377/pexels-photo-38078377.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  miami: { capacity: '64,767', built: '1987', surface: 'Natural grass', image: 'https://images.pexels.com/photos/31514419/pexels-photo-31514419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  houston: { capacity: '72,220', built: '2002', surface: 'Natural grass', image: 'https://images.pexels.com/photos/19186210/pexels-photo-19186210.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  dallas: { capacity: '80,000', built: '2009', surface: 'Artificial turf', image: 'https://images.pexels.com/photos/31514425/pexels-photo-31514425.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  sf: { capacity: '68,500', built: '2014', surface: 'Natural grass', image: 'https://images.pexels.com/photos/8134808/pexels-photo-8134808.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  seattle: { capacity: '69,000', built: '2002', surface: 'Artificial turf', image: 'https://images.pexels.com/photos/38104077/pexels-photo-38104077.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  philly: { capacity: '69,328', built: '2003', surface: 'Natural grass', image: 'https://images.pexels.com/photos/38078377/pexels-photo-38078377.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  atlanta: { capacity: '71,000', built: '2017', surface: 'Artificial turf', image: 'https://images.pexels.com/photos/19186210/pexels-photo-19186210.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  kansas: { capacity: '76,416', built: '1972', surface: 'Natural grass', image: 'https://images.pexels.com/photos/31514419/pexels-photo-31514419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  boston: { capacity: '65,878', built: '2002', surface: 'Artificial turf', image: 'https://images.pexels.com/photos/1461370/pexels-photo-1461370.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  mexico: { capacity: '87,523', built: '1966', surface: 'Natural grass', image: 'https://images.pexels.com/photos/20624534/pexels-photo-20624534.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  monterrey: { capacity: '53,500', built: '2015', surface: 'Natural grass', image: 'https://images.pexels.com/photos/16652814/pexels-photo-16652814.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  guadalajara: { capacity: '49,850', built: '2010', surface: 'Natural grass', image: 'https://images.pexels.com/photos/20624534/pexels-photo-20624534.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  toronto: { capacity: '30,000', built: '2007', surface: 'Natural grass', image: 'https://images.pexels.com/photos/25696388/pexels-photo-25696388.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
  vancouver: { capacity: '54,500', built: '1983', surface: 'Artificial turf', image: 'https://images.pexels.com/photos/38104077/pexels-photo-38104077.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500' },
};

type TabKey = 'groups' | 'group-stage' | 'knockout' | 'live';  // Added 'live'

const stageColors: Record<string, string> = { R32: 'from-blue-500 to-cyan-400', R16: 'from-emerald-500 to-green-400', QF: 'from-orange-500 to-amber-400', SF: 'from-red-500 to-rose-400', '3RD': 'from-teal-500 to-cyan-400', FINAL: 'from-amber-400 via-yellow-300 to-amber-500' };
const stageLabels: Record<string, string> = { R32: 'Round of 32', R16: 'Round of 16', QF: 'Quarter-final', SF: 'Semi-final', '3RD': 'Third-Place Match', FINAL: '🏆 THE FINAL' };

function MatchScore({ match }: { match: GroupMatch }) {
  const status = getMatchStatus(match.fullDate);
  const hasScore = match.homeScore !== undefined && match.awayScore !== undefined;

  if (status === 'played' && hasScore) {
    return (
      <div className="flex items-center justify-center gap-2 md:gap-3 min-w-0">
        <span className="text-sm md:text-base text-white font-medium text-right flex-1 truncate">{match.home}</span>
        <span className="text-lg md:text-xl">{match.homeFlag}</span>
        <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center gap-1">
          <span className="text-white font-bold text-base md:text-lg">{match.homeScore}</span>
          <span className="text-gray-500 text-xs">-</span>
          <span className="text-white font-bold text-base md:text-lg">{match.awayScore}</span>
        </div>
        <span className="text-lg md:text-xl">{match.awayFlag}</span>
        <span className="text-sm md:text-base text-white font-medium text-left flex-1 truncate">{match.away}</span>
      </div>
    );
  }

  if (status === 'live') {
    return (
      <div className="flex items-center justify-center gap-2 md:gap-3 min-w-0">
        <span className="text-sm md:text-base text-white font-medium text-right flex-1 truncate">{match.home}</span>
        <span className="text-lg md:text-xl">{match.homeFlag}</span>
        <div className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 animate-pulse">
          <span className="text-red-400 font-bold text-xs">LIVE</span>
        </div>
        <span className="text-lg md:text-xl">{match.awayFlag}</span>
        <span className="text-sm md:text-base text-white font-medium text-left flex-1 truncate">{match.away}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3 min-w-0">
      <span className="text-sm md:text-base text-white font-medium text-right flex-1 truncate">{match.home}</span>
      <span className="text-lg md:text-xl">{match.homeFlag}</span>
      <span className="text-gray-500 text-xs font-bold px-2">vs</span>
      <span className="text-lg md:text-xl">{match.awayFlag}</span>
      <span className="text-sm md:text-base text-white font-medium text-left flex-1 truncate">{match.away}</span>
    </div>
  );
}

export default function Schedule() {
  const [activeTab, setActiveTab] = useState<TabKey>('live');  // 🔥 CHANGED from 'groups' to 'live'
  const [groupFilter, setGroupFilter] = useState('all');
  const [expandedVenue, setExpandedVenue] = useState<string | null>(null);

  // 🔥 LIVE DATA FROM SUPABASE
  const { matches: liveMatches, loading, error } = useMatches();

  // Log for debugging
  console.log("🔍 LIVE MATCHES FROM SUPABASE:", liveMatches);
  console.log("📊 COUNT:", liveMatches.length);
  console.log("🔄 LOADING:", loading);
  console.log("❌ ERROR:", error);

  const filteredGroupMatches = groupFilter === 'all'
    ? GROUP_MATCHES
    : GROUP_MATCHES.filter(m => m.group === groupFilter);

  const playedCount = GROUP_MATCHES.filter(m => getMatchStatus(m.fullDate) === 'played' && m.homeScore !== undefined).length;

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Match Schedule" description="Full FIFA World Cup 2026 match schedule — all 104 matches with dates, times, teams & venues." path="/schedule" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-6">
            <Calendar className="w-4 h-4" />
            June 11 — July 19, 2026 · 104 Matches
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            FIFA World Cup 2026 <br />
            <span className="bg-gradient-to-r from-amber-300 to-red-400 bg-clip-text text-transparent">Match Schedule</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            48 teams · 16 venues · 3 countries — Live scores auto-update for played matches.
          </p>
          {playedCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4" /> {playedCount} matches played · Results updated
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {[
            { id: 'groups' as TabKey, label: '🏟️ Groups', count: '12' },
            { id: 'group-stage' as TabKey, label: '⚽ Matches', count: '72' },
            { id: 'knockout' as TabKey, label: '🏆 Knockout', count: '32' },
            { id: 'live' as TabKey, label: '📊 Live', count: `${liveMatches.length}` },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300' : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'}`}>
              {tab.label} <span className="text-xs opacity-60 ml-1">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* ═══ GROUPS TAB ═══ */}
        {activeTab === 'groups' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {GROUPS.map((group, i) => (
                <motion.div key={group.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card3D>
                    <div className="p-5">
                      <h3 className="text-amber-400 font-bold text-lg mb-3">{group.name}</h3>
                      <div className="space-y-2">
                        {group.teams.map((team, j) => (
                          <div key={j} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
                            <span className="text-xl">{team.flag}</span>
                            <span className="text-white font-medium text-sm">{team.name}</span>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => { setGroupFilter(group.name.split(' ')[1]); setActiveTab('group-stage'); }}
                        className="mt-3 w-full py-2 rounded-lg bg-amber-500/10 text-amber-400 text-sm hover:bg-amber-500/20 transition-all">
                        View Matches →
                      </button>
                    </div>
                  </Card3D>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ═══ GROUP STAGE TAB ═══ */}
        {activeTab === 'group-stage' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              <button onClick={() => setGroupFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${groupFilter === 'all' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                All Groups
              </button>
              {['A','B','C','D','E','F','G','H','I','J','K','L'].map((g) => (
                <button key={g} onClick={() => setGroupFilter(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${groupFilter === g ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                  {g}
                </button>
              ))}
            </div>

            <p className="text-gray-500 text-sm text-center mb-4">{filteredGroupMatches.length} matches · All times ET</p>

            <div className="space-y-2">
              {filteredGroupMatches.map((match, i) => {
                const status = getMatchStatus(match.fullDate);
                return (
                  <motion.div key={match.num} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}>
                    <Card3D>
                      <div className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 ${status === 'played' ? 'opacity-80' : ''} ${status === 'live' ? 'ring-1 ring-red-500/50' : ''}`}>
                        <div className="text-center shrink-0 w-14 md:w-20">
                          <span className="text-xs text-amber-400 font-medium block">{match.date}</span>
                          <span className="text-[10px] text-gray-500">{match.time}</span>
                          {status === 'played' && <span className="block text-[9px] text-green-400 mt-0.5">FT</span>}
                          {status === 'live' && <span className="block text-[9px] text-red-400 mt-0.5 animate-pulse">● LIVE</span>}
                        </div>
                        <div className="w-px h-10 bg-gradient-to-b from-amber-500/50 to-red-500/50 shrink-0" />
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/10 text-gray-400 shrink-0">{match.group}</span>
                        <div className="flex-1">
                          <MatchScore match={match} />
                        </div>
                        <div className="hidden md:flex items-center gap-1 text-gray-500 text-xs shrink-0 w-28">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{match.city}</span>
                        </div>
                      </div>
                    </Card3D>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ═══ KNOCKOUT TAB ═══ */}
        {activeTab === 'knockout' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {['R32', 'R16', 'QF', 'SF', '3RD', 'FINAL'].map((stage) => {
              const matches = KNOCKOUT_MATCHES.filter(m => m.stage === stage);
              const color = stageColors[stage] || 'from-gray-500 to-gray-400';
              const label = stageLabels[stage] || stage;

              return (
                <div key={stage} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${color}`} />
                    <h3 className={`text-xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}>{label}</h3>
                    <span className="text-gray-500 text-sm">({matches.length} matches)</span>
                    {stage === 'FINAL' && <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold animate-pulse">MUST SEE</span>}
                  </div>
                  <div className="space-y-2">
                    {matches.map((match, i) => {
                      const status = getMatchStatus(match.fullDate);
                      const hasScore = match.homeScore !== undefined && match.awayScore !== undefined;
                      return (
                        <motion.div key={match.num} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                          <Card3D>
                            <div className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 ${stage === 'FINAL' ? 'bg-gradient-to-r from-amber-500/5 to-red-500/5' : ''}`}>
                              <div className="text-center shrink-0 w-14 md:w-20">
                                <span className="text-xs text-amber-400 font-medium block">{match.date}</span>
                                <span className="text-[10px] text-gray-500">{match.time} ET</span>
                                {status === 'played' && hasScore && <span className="block text-[9px] text-green-400 mt-0.5">FT</span>}
                              </div>
                              <div className={`w-px h-10 bg-gradient-to-b ${color} shrink-0`} />
                              <div className="flex-1 min-w-0">
                                {status === 'played' && hasScore ? (
                                  <p className="text-white font-medium text-sm md:text-base">
                                    {match.home} <span className="text-green-400 font-bold">{match.homeScore} - {match.awayScore}</span> {match.away}
                                  </p>
                                ) : (
                                  <p className="text-white font-medium text-sm md:text-base">{match.home} <span className="text-gray-500">vs</span> {match.away}</p>
                                )}
                                <p className="text-gray-500 text-xs flex items-center gap-1">
                                  <MapPin className="w-3 h-3" /> {match.venue}, {match.city}
                                </p>
                              </div>
                              {stage === 'FINAL' && <Trophy className="w-5 h-5 text-amber-400 shrink-0" />}
                            </div>
                          </Card3D>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* ═══ LIVE MATCH TAB ═══ */}
        {activeTab === 'live' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-bold text-white mb-4">📊 Live Match Data from Supabase</h2>
            
            {loading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
                <p className="text-gray-400 mt-4">Loading matches...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-red-400">
                ❌ Error loading matches: {error}
              </div>
            ) : liveMatches.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                📭 No matches found in the database.
              </div>
            ) : (
              <div className="space-y-2">
                {liveMatches.map((match, i) => (
                  <motion.div key={match.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
                    <Card3D>
                      <div className="flex items-center gap-2 md:gap-4 p-3 md:p-4">
                        <div className="text-center shrink-0 w-14 md:w-20">
                          <span className="text-xs text-amber-400 font-medium block">{match.match_date}</span>
                        </div>
                        <div className="w-px h-10 bg-gradient-to-b from-amber-500/50 to-red-500/50 shrink-0" />
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm md:text-base">
                            {match.home_team} <span className="text-amber-400 font-bold">{match.home_score}</span> - <span className="text-amber-400 font-bold">{match.away_score}</span> {match.away_team}
                          </p>
                          <p className="text-gray-500 text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {match.venue}, {match.city}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${match.status === 'finished' ? 'bg-green-500/20 text-green-400' : match.status === 'live' ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-yellow-500/20 text-yellow-400'}`}>
                          {match.status}
                        </span>
                      </div>
                    </Card3D>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Host venues */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">All 16 Host Venues</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Click any venue to see stadium details</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HOST_CITIES.map((city) => {
              const details = STADIUM_DETAILS[city.id];
              const isExpanded = expandedVenue === city.id;
              return (
                <div key={city.id}>
                  <button onClick={() => setExpandedVenue(isExpanded ? null : city.id)}
                    className={`w-full p-3 rounded-xl text-center transition-all ${isExpanded ? 'bg-amber-500/10 border-2 border-amber-500/40 ring-1 ring-amber-500/20' : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
                    <span className="text-2xl">{city.countryFlag}</span>
                    <p className="text-white text-sm font-medium mt-1">{city.name}</p>
                    <p className={`text-xs mt-0.5 ${isExpanded ? 'text-amber-400' : 'text-gray-500'}`}>{city.stadium}</p>
                  </button>
                  {isExpanded && details && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                      <Card3D>
                        <div className="overflow-hidden rounded-xl">
                          <img src={details.image} alt={city.stadium} className="w-full h-28 object-cover" loading="lazy" />
                          <div className="p-3 space-y-1.5">
                            <h4 className="text-white font-bold text-sm">{city.stadium}</h4>
                            <p className="text-amber-400 text-xs">{city.name}, {city.country}</p>
                            <div className="grid grid-cols-2 gap-1 text-[11px]">
                              <div className="bg-white/5 rounded px-2 py-1"><span className="text-gray-500">Capacity</span><p className="text-white font-medium">{details.capacity}</p></div>
                              <div className="bg-white/5 rounded px-2 py-1"><span className="text-gray-500">Built</span><p className="text-white font-medium">{details.built}</p></div>
                              <div className="col-span-2 bg-white/5 rounded px-2 py-1"><span className="text-gray-500">Surface</span><p className="text-white font-medium">{details.surface}</p></div>
                            </div>
                          </div>
                        </div>
                      </Card3D>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </main>
  );
}