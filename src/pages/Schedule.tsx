import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import { HOST_CITIES } from '../data/constants';
import { useMatches } from '../hooks/useMatches';
import { KNOCKOUT_MATCHES, getMatchStatus } from '../data/matches';

type TabKey = 'played' | 'live' | 'knockout';

// Team groups (hardcoded for display)
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

const stageColors: Record<string, string> = {
  R32: 'from-blue-500 to-cyan-400',
  R16: 'from-emerald-500 to-green-400',
  QF: 'from-orange-500 to-amber-400',
  SF: 'from-red-500 to-rose-400',
  '3RD': 'from-teal-500 to-cyan-400',
  FINAL: 'from-amber-400 via-yellow-300 to-amber-500'
};

const stageLabels: Record<string, string> = {
  R32: 'Round of 32',
  R16: 'Round of 16',
  QF: 'Quarter-final',
  SF: 'Semi-final',
  '3RD': 'Third-Place Match',
  FINAL: '🏆 THE FINAL'
};

// Get flag emoji by team name
function getFlag(teamName: string): string {
  const flagMap: Record<string, string> = {
    'Mexico': '🇲🇽', 'South Africa': '🇿🇦', 'South Korea': '🇰🇷', 'Czechia': '🇨🇿',
    'Canada': '🇨🇦', 'Bosnia & Herzegovina': '🇧🇦', 'Qatar': '🇶🇦', 'Switzerland': '🇨🇭',
    'Brazil': '🇧🇷', 'Morocco': '🇲🇦', 'Haiti': '🇭🇹', 'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    'United States': '🇺🇸', 'Paraguay': '🇵🇾', 'Australia': '🇦🇺', 'Türkiye': '🇹🇷',
    'Germany': '🇩🇪', 'Curaçao': '🇨🇼', "Côte d'Ivoire": '🇨🇮', 'Ecuador': '🇪🇨',
    'Netherlands': '🇳🇱', 'Japan': '🇯🇵', 'Sweden': '🇸🇪', 'Tunisia': '🇹🇳',
    'Spain': '🇪🇸', 'Saudi Arabia': '🇸🇦', 'Uruguay': '🇺🇾', 'Cape Verde': '🇨🇻',
    'Belgium': '🇧🇪', 'Iran': '🇮🇷', 'Egypt': '🇪🇬', 'New Zealand': '🇳🇿',
    'France': '🇫🇷', 'Senegal': '🇸🇳', 'Iraq': '🇮🇶', 'Norway': '🇳🇴',
    'Argentina': '🇦🇷', 'Austria': '🇦🇹', 'Algeria': '🇩🇿', 'Jordan': '🇯🇴',
    'Portugal': '🇵🇹', 'Colombia': '🇨🇴', 'Uzbekistan': '🇺🇿', 'DR Congo': '🇨🇩',
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'Croatia': '🇭🇷', 'Ghana': '🇬🇭', 'Panama': '🇵🇦',
  };
  return flagMap[teamName] || '🏳️';
}

export default function Schedule() {
  const [activeTab, setActiveTab] = useState<TabKey>('played');
  const [expandedVenue, setExpandedVenue] = useState<string | null>(null);

  const { matches: liveMatches, loading, error } = useMatches();
  const liveOnlyMatches = liveMatches.filter(m => m.status === 'live' || m.status === 'in_progress');

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Match Schedule" description="FIFA World Cup 2026 match schedule — live scores, group stage, and knockout rounds." path="/schedule" />
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
            48 teams · 16 venues · 3 countries — Book accommodation directly from any match!
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {[
            { id: 'played' as TabKey, label: '⚽ Played Matches', icon: '📋' },
            { id: 'live' as TabKey, label: '🔴 Live', icon: '📺', count: liveOnlyMatches.length },
            { id: 'knockout' as TabKey, label: '🏆 Knockout', icon: '🏆' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs animate-pulse">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Played Matches Tab */}
        {activeTab === 'played' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Group Arrangement */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-white mb-4">🏟️ Group Arrangement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {GROUPS.map((group, i) => (
                  <motion.div key={group.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <Card3D>
                      <div className="p-4">
                        <h3 className="text-amber-400 font-bold text-lg mb-3">{group.name}</h3>
                        <div className="space-y-2">
                          {group.teams.map((team, j) => (
                            <div key={j} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
                              <span className="text-xl">{team.flag}</span>
                              <span className="text-white font-medium text-sm">{team.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </Card3D>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* All Matches */}
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span>📋 All Matches</span>
              <span className="text-sm text-gray-500">({liveMatches.length} matches)</span>
            </h2>

            {loading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
                <p className="text-gray-400 mt-4">Loading matches...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-red-400">❌ Error loading matches: {error}</div>
            ) : liveMatches.length === 0 ? (
              <div className="py-12 text-center text-gray-400">📭 No matches found in the database.</div>
            ) : (
              <div className="space-y-2">
                {liveMatches.map((match, i) => {
                  const status = getMatchStatus(match.match_date);
                  return (
                    <motion.div key={match.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.02, 0.5) }}>
                      <Card3D>
                        <div className={`flex items-center gap-2 md:gap-4 p-3 md:p-4 ${status === 'played' ? 'opacity-80' : ''} ${status === 'live' ? 'ring-1 ring-red-500/50' : ''}`}>
                          <div className="text-center shrink-0 w-14 md:w-20">
                            <span className="text-xs text-amber-400 font-medium block">{match.match_date}</span>
                            {status === 'played' && match.home_score !== undefined && <span className="block text-[9px] text-green-400 mt-0.5">FT</span>}
                            {status === 'live' && <span className="block text-[9px] text-red-400 mt-0.5 animate-pulse">● LIVE</span>}
                          </div>
                          <div className="w-px h-10 bg-gradient-to-b from-amber-500/50 to-red-500/50 shrink-0" />
                          <div className="flex-1">
                            <div className="flex items-center justify-start gap-2 md:gap-3">
                              <span className="text-sm md:text-base text-white font-medium text-right">{match.home_team}</span>
                              <span className="text-lg md:text-xl">{getFlag(match.home_team)}</span>
                              {status === 'played' && match.home_score !== undefined ? (
                                <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/30 flex items-center gap-1">
                                  <span className="text-white font-bold text-base md:text-lg">{match.home_score}</span>
                                  <span className="text-gray-500 text-xs">-</span>
                                  <span className="text-white font-bold text-base md:text-lg">{match.away_score}</span>
                                </div>
                              ) : status === 'live' ? (
                                <div className="px-3 py-1 rounded-lg bg-red-500/20 border border-red-500/30 animate-pulse">
                                  <span className="text-red-400 font-bold text-xs">LIVE</span>
                                </div>
                              ) : (
                                <span className="text-gray-500 text-xs font-bold px-2">vs</span>
                              )}
                              <span className="text-lg md:text-xl">{getFlag(match.away_team)}</span>
                              <span className="text-sm md:text-base text-white font-medium text-left">{match.away_team}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <div className="flex items-center gap-1 text-gray-400 text-xs">
                                <MapPin className="w-3 h-3" />
                                <span>{match.venue || 'TBD'}</span>
                                {match.city && match.venue !== match.city && <span>, {match.city}</span>}
                              </div>
                              {match.city && (
                                <Link
                                  to={`/listings?city=${encodeURIComponent(match.city)}`}
                                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs hover:bg-amber-500/30 transition-all border border-amber-500/30"
                                >
                                  <Home className="w-3 h-3" />
                                  <span>Book in {match.city}</span>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card3D>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Live Tab */}
        {activeTab === 'live' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Live Now
            </h2>

            {loading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent"></div>
                <p className="text-gray-400 mt-4">Loading matches...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-red-400">❌ Error loading matches: {error}</div>
            ) : liveOnlyMatches.length === 0 ? (
              <div className="py-12 text-center">
                <div className="text-5xl mb-4">⏳</div>
                <p className="text-gray-400 text-lg">No matches currently live.</p>
                <p className="text-gray-500 text-sm mt-2">Check back during match days!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {liveOnlyMatches.map((match, i) => (
                  <motion.div key={match.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                    <Card3D>
                      <div className="flex items-center gap-2 md:gap-4 p-3 md:p-4 ring-1 ring-red-500/30 bg-red-500/5">
                        <div className="text-center shrink-0 w-14 md:w-20">
                          <span className="text-xs text-amber-400 font-medium block">{match.match_date}</span>
                        </div>
                        <div className="w-px h-10 bg-gradient-to-b from-red-500/50 to-red-500/50 shrink-0" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold animate-pulse">● LIVE</span>
                          </div>
                          <p className="text-white font-medium text-sm md:text-base flex items-center gap-2 flex-wrap">
                            <span>{match.home_team}</span>
                            <span className="text-amber-400 font-bold">{match.home_score}</span>
                            <span className="text-gray-500">vs</span>
                            <span className="text-amber-400 font-bold">{match.away_score}</span>
                            <span>{match.away_team}</span>
                          </p>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              <MapPin className="w-3 h-3" />
                              <span>{match.venue || 'TBD'}</span>
                              {match.city && match.venue !== match.city && <span>, {match.city}</span>}
                            </div>
                            {match.city && (
                              <Link
                                to={`/listings?city=${encodeURIComponent(match.city)}`}
                                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs hover:bg-amber-500/30 transition-all border border-amber-500/30"
                              >
                                <Home className="w-3 h-3" />
                                <span>Book in {match.city}</span>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card3D>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Knockout Tab */}
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
                    {stage === 'FINAL' && <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold animate-pulse">🏆 FINAL</span>}
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
                                <div className="flex items-center gap-3 mt-1 flex-wrap">
                                  <p className="text-gray-500 text-xs flex items-center gap-1">
                                    <MapPin className="w-3 h-3" /> {match.venue}, {match.city}
                                  </p>
                                  {match.city && (
                                    <Link
                                      to={`/listings?city=${encodeURIComponent(match.city)}`}
                                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs hover:bg-amber-500/30 transition-all border border-amber-500/30"
                                    >
                                      <Home className="w-3 h-3" />
                                      <span>Book in {match.city}</span>
                                    </Link>
                                  )}
                                </div>
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

        {/* Host Venues */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-16">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🏟️ All 16 Host Venues</h2>
          <p className="text-gray-500 text-sm text-center mb-6">Click any city to see matches and book accommodation there!</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HOST_CITIES.map((city) => {
              const isExpanded = expandedVenue === city.id;
              const cityMatchCount = liveMatches.filter(m => m.city?.toLowerCase().includes(city.name.toLowerCase())).length;

              return (
                <div key={city.id}>
                  <button
                    onClick={() => setExpandedVenue(isExpanded ? null : city.id)}
                    className={`w-full p-3 rounded-xl text-center transition-all ${isExpanded ? 'bg-amber-500/10 border-2 border-amber-500/40 ring-1 ring-amber-500/20' : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'}`}
                  >
                    <span className="text-2xl">{city.countryFlag}</span>
                    <p className="text-white text-sm font-medium mt-1">{city.name}</p>
                    <p className={`text-xs mt-0.5 ${isExpanded ? 'text-amber-400' : 'text-gray-500'}`}>{city.stadium}</p>
                    {cityMatchCount > 0 && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px]">
                        {cityMatchCount} matches
                      </span>
                    )}
                  </button>

                  {isExpanded && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2">
                      <Card3D>
                        <div className="p-4">
                          <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-amber-400" />
                            Matches in {city.name}
                          </h4>
                          {cityMatchCount === 0 ? (
                            <p className="text-gray-500 text-sm">No matches scheduled here yet.</p>
                          ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                              {liveMatches
                                .filter(m => m.city?.toLowerCase().includes(city.name.toLowerCase()))
                                .map((match) => (
                                  <div key={match.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5 text-sm">
                                    <span className="text-white">
                                      {match.home_team} vs {match.away_team}
                                    </span>
                                    <Link
                                      to={`/listings?city=${encodeURIComponent(city.name)}`}
                                      className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-[10px] hover:bg-amber-500/30 transition-all"
                                    >
                                      <Home className="w-3 h-3" />
                                      Book
                                    </Link>
                                  </div>
                                ))}
                            </div>
                          )}
                          <div className="mt-3 flex gap-2">
                            <Link
                              to={`/city/${city.id}`}
                              className="flex-1 py-2 rounded-lg bg-amber-500/10 text-amber-400 text-sm hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1"
                            >
                              View all <ChevronRight className="w-4 h-4" />
                            </Link>
                            <Link
                              to={`/listings?city=${encodeURIComponent(city.name)}`}
                              className="flex-1 py-2 rounded-lg bg-amber-500/20 text-amber-300 text-sm hover:bg-amber-500/30 transition-all flex items-center justify-center gap-1 border border-amber-500/30"
                            >
                              <Home className="w-4 h-4" />
                              Book Accommodation
                            </Link>
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