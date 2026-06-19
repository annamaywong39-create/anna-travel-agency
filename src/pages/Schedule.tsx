import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, CheckCircle2 } from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import { HOST_CITIES } from '../data/constants';
import { useMatches } from '../hooks/useMatches';
import { KNOCKOUT_MATCHES, getMatchStatus, type GroupMatch } from '../data/matches';

type TabKey = 'group-stage' | 'live' | 'knockout';

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

// Group stage matches with flags and labels
const GROUP_STAGE_MATCHES: GroupMatch[] = [
  // Matchday 1
  { num: 1, fullDate: '2026-06-11', date: 'Jun 11', time: '2:00 PM', group: 'A', home: 'Mexico', homeFlag: '🇲🇽', away: 'South Africa', awayFlag: '🇿🇦', venue: 'Estadio Azteca', city: 'Mexico City', homeScore: 2, awayScore: 0 },
  { num: 2, fullDate: '2026-06-11', date: 'Jun 11', time: '9:00 PM', group: 'A', home: 'South Korea', homeFlag: '🇰🇷', away: 'Czechia', awayFlag: '🇨🇿', venue: 'Estadio Akron', city: 'Guadalajara', homeScore: 2, awayScore: 1 },
  { num: 3, fullDate: '2026-06-12', date: 'Jun 12', time: '2:00 PM', group: 'B', home: 'Canada', homeFlag: '🇨🇦', away: 'Bosnia & Herzegovina', awayFlag: '🇧🇦', venue: 'BMO Field', city: 'Toronto', homeScore: 1, awayScore: 1 },
  { num: 4, fullDate: '2026-06-12', date: 'Jun 12', time: '8:00 PM', group: 'D', home: 'United States', homeFlag: '🇺🇸', away: 'Paraguay', awayFlag: '🇵🇾', venue: 'SoFi Stadium', city: 'Los Angeles', homeScore: 4, awayScore: 1 },
  { num: 5, fullDate: '2026-06-13', date: 'Jun 13', time: '2:00 PM', group: 'B', home: 'Qatar', homeFlag: '🇶🇦', away: 'Switzerland', awayFlag: '🇨🇭', venue: "Levi's Stadium", city: 'San Francisco', homeScore: 1, awayScore: 1 },
  { num: 6, fullDate: '2026-06-13', date: 'Jun 13', time: '5:00 PM', group: 'C', home: 'Brazil', homeFlag: '🇧🇷', away: 'Morocco', awayFlag: '🇲🇦', venue: 'MetLife Stadium', city: 'New York / NJ', homeScore: 1, awayScore: 1 },
  { num: 7, fullDate: '2026-06-13', date: 'Jun 13', time: '8:00 PM', group: 'C', home: 'Haiti', homeFlag: '🇭🇹', away: 'Scotland', awayFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', venue: 'Gillette Stadium', city: 'Boston', homeScore: 0, awayScore: 1 },
  { num: 8, fullDate: '2026-06-13', date: 'Jun 13', time: '11:00 PM', group: 'D', home: 'Australia', homeFlag: '🇦🇺', away: 'Türkiye', awayFlag: '🇹🇷', venue: 'BC Place', city: 'Vancouver', homeScore: 2, awayScore: 0 },
  { num: 9, fullDate: '2026-06-14', date: 'Jun 14', time: '12:00 PM', group: 'E', home: 'Germany', homeFlag: '🇩🇪', away: 'Curaçao', awayFlag: '🇨🇼', venue: 'NRG Stadium', city: 'Houston', homeScore: 7, awayScore: 1 },
  { num: 10, fullDate: '2026-06-14', date: 'Jun 14', time: '3:00 PM', group: 'F', home: 'Netherlands', homeFlag: '🇳🇱', away: 'Japan', awayFlag: '🇯🇵', venue: 'AT&T Stadium', city: 'Dallas', homeScore: 2, awayScore: 2 },
  { num: 11, fullDate: '2026-06-14', date: 'Jun 14', time: '6:00 PM', group: 'E', home: "Côte d'Ivoire", homeFlag: '🇨🇮', away: 'Ecuador', awayFlag: '🇪🇨', venue: 'Lincoln Financial Field', city: 'Philadelphia', homeScore: 1, awayScore: 0 },
  { num: 12, fullDate: '2026-06-14', date: 'Jun 14', time: '9:00 PM', group: 'F', home: 'Sweden', homeFlag: '🇸🇪', away: 'Tunisia', awayFlag: '🇹🇳', venue: 'Estadio BBVA', city: 'Monterrey', homeScore: 5, awayScore: 1 },
  // Matchday 2
  { num: 25, fullDate: '2026-06-18', date: 'Jun 18', time: '12:00 PM', group: 'A', home: 'Czechia', homeFlag: '🇨🇿', away: 'South Africa', awayFlag: '🇿🇦', venue: 'Mercedes-Benz Stadium', city: 'Atlanta' },
  { num: 26, fullDate: '2026-06-18', date: 'Jun 18', time: '3:00 PM', group: 'B', home: 'Switzerland', homeFlag: '🇨🇭', away: 'Bosnia & Herzegovina', awayFlag: '🇧🇦', venue: 'SoFi Stadium', city: 'Los Angeles' },
  { num: 27, fullDate: '2026-06-18', date: 'Jun 18', time: '6:00 PM', group: 'B', home: 'Canada', homeFlag: '🇨🇦', away: 'Qatar', awayFlag: '🇶🇦', venue: 'BC Place', city: 'Vancouver' },
  { num: 28, fullDate: '2026-06-18', date: 'Jun 18', time: '9:00 PM', group: 'A', home: 'Mexico', homeFlag: '🇲🇽', away: 'South Korea', awayFlag: '🇰🇷', venue: 'Estadio Akron', city: 'Guadalajara' },
  { num: 29, fullDate: '2026-06-19', date: 'Jun 19', time: '2:00 PM', group: 'C', home: 'Brazil', homeFlag: '🇧🇷', away: 'Haiti', awayFlag: '🇭🇹', venue: 'Lincoln Financial Field', city: 'Philadelphia' },
  { num: 30, fullDate: '2026-06-19', date: 'Jun 19', time: '6:00 PM', group: 'C', home: 'Scotland', homeFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', away: 'Morocco', awayFlag: '🇲🇦', venue: 'Gillette Stadium', city: 'Boston' },
  { num: 31, fullDate: '2026-06-19', date: 'Jun 19', time: '9:00 PM', group: 'D', home: 'Türkiye', homeFlag: '🇹🇷', away: 'Paraguay', awayFlag: '🇵🇾', venue: "Levi's Stadium", city: 'San Francisco' },
  { num: 32, fullDate: '2026-06-19', date: 'Jun 19', time: '3:00 PM', group: 'D', home: 'United States', homeFlag: '🇺🇸', away: 'Australia', awayFlag: '🇦🇺', venue: 'Lumen Field', city: 'Seattle' },
  { num: 33, fullDate: '2026-06-20', date: 'Jun 20', time: '4:00 PM', group: 'E', home: 'Germany', homeFlag: '🇩🇪', away: "Côte d'Ivoire", awayFlag: '🇨🇮', venue: 'BMO Field', city: 'Toronto' },
  { num: 34, fullDate: '2026-06-20', date: 'Jun 20', time: '7:00 PM', group: 'E', home: 'Ecuador', homeFlag: '🇪🇨', away: 'Curaçao', awayFlag: '🇨🇼', venue: 'Arrowhead Stadium', city: 'Kansas City' },
  { num: 35, fullDate: '2026-06-20', date: 'Jun 20', time: '12:00 PM', group: 'F', home: 'Netherlands', homeFlag: '🇳🇱', away: 'Sweden', awayFlag: '🇸🇪', venue: 'NRG Stadium', city: 'Houston' },
  { num: 36, fullDate: '2026-06-20', date: 'Jun 20', time: '10:00 PM', group: 'F', home: 'Tunisia', homeFlag: '🇹🇳', away: 'Japan', awayFlag: '🇯🇵', venue: 'Estadio BBVA', city: 'Monterrey' },
  // Add remaining group matches as needed...
];

// Helper to get match status
function getMatchStatus(fullDate: string): 'played' | 'live' | 'upcoming' {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  if (fullDate === todayStr) return 'live';
  if (fullDate < todayStr) return 'played';
  return 'upcoming';
}

// Match score display component
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
  const [activeTab, setActiveTab] = useState<TabKey>('group-stage');
  const { matches: liveMatches, loading, error } = useMatches();

  // Get only live matches (status === 'live')
  const liveOnlyMatches = liveMatches.filter(m => m.status === 'live' || m.status === 'in_progress');

  // Count played matches
  const playedCount = GROUP_STAGE_MATCHES.filter(m => getMatchStatus(m.fullDate) === 'played' && m.homeScore !== undefined).length;

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Match Schedule" description="Full FIFA World Cup 2026 match schedule — group stage, live matches, and knockout rounds." path="/schedule" />
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
            48 teams · 16 venues · 3 countries — Live scores auto-update.
          </p>
        </motion.div>

        {/* Tabs — Only 3 */}
        <div className="flex gap-2 mb-8 justify-center flex-wrap">
          {[
            { id: 'group-stage' as TabKey, label: '⚽ Group Stage', icon: '🏟️' },
            { id: 'live' as TabKey, label: `🔴 Live`, icon: '📺', count: liveOnlyMatches.length },
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

        {/* ═══ GROUP STAGE TAB ═══ */}
        {activeTab === 'group-stage' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Group Stage</h2>
              <span className="text-sm text-gray-500">{playedCount} matches played</span>
            </div>
            <div className="space-y-2">
              {GROUP_STAGE_MATCHES.map((match, i) => {
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

        {/* ═══ LIVE TAB ═══ */}
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
                          <p className="text-gray-500 text-xs flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {match.venue}, {match.city}
                          </p>
                        </div>
                      </div>
                    </Card3D>
                  </motion.div>
                ))}
              </div>
            )}
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
      </div>
    </main>
  );
}