import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, X, Check, Shield } from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import { supabase } from '../lib/supabase';

interface MatchTicket {
  id: string;
  match_date: string;
  home_team: string;
  away_team: string;
  venue: string;
  city: string;
  category_1_price: number;
  category_2_price: number;
  category_3_price: number;
  category_4_price: number;
  supporter_entry_price: number;
  status: string;
}

const TICKET_CATEGORIES = [
  { id: 'category_1', name: 'Category 1', description: 'Premium lower-tier seating', icon: '🌟', color: 'from-amber-500 to-yellow-500' },
  { id: 'category_2', name: 'Category 2', description: 'Lower and upper tier seating', icon: '💎', color: 'from-blue-500 to-cyan-400' },
  { id: 'category_3', name: 'Category 3', description: 'Upper tier seating', icon: '🎯', color: 'from-emerald-500 to-green-400' },
  { id: 'category_4', name: 'Category 4', description: 'Most affordable seating', icon: '🎫', color: 'from-purple-500 to-pink-400' },
  { id: 'supporter_entry', name: 'Supporter Entry', description: 'Fixed-price for fans (USD 60)', icon: '🏴', color: 'from-red-500 to-orange-400' },
];

export default function Tickets() {
  // ✅ ALL HOOKS AT THE TOP — NO CONDITIONAL RETURNS BEFORE THIS
  const [matches, setMatches] = useState<MatchTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<MatchTicket | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('category_1');
  const [quantity, setQuantity] = useState(1);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, []);

  // ---- helper functions ----
  const fetchMatches = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .gte('match_date', '2026-07-01')
      .order('match_date', { ascending: true });
    if (error) {
      console.error('Error fetching matches:', error);
    } else {
      setMatches(data || []);
    }
    setLoading(false);
  };

  const getStatusInfo = (status: string) => {
    const map: Record<string, { label: string; color: string }> = {
      scheduled: { label: 'Available', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      live: { label: 'Live Now', color: 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' },
      finished: { label: 'Finished', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    };
    return map[status] || { label: status, color: 'bg-gray-500/20 text-gray-400' };
  };

  const getCategoryPrice = (match: MatchTicket, categoryId: string): number => {
    const map: Record<string, number> = {
      category_1: match.category_1_price,
      category_2: match.category_2_price,
      category_3: match.category_3_price,
      category_4: match.category_4_price,
      supporter_entry: match.supporter_entry_price,
    };
    return map[categoryId] || 0;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStageLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    const month = date.getMonth();
    const day = date.getDate();
    if (month === 6 && day >= 28) return 'Round of 32';
    if (month === 7 && day >= 1 && day <= 3) return 'Round of 32';
    if (month === 7 && day >= 4 && day <= 7) return 'Round of 16';
    if (month === 7 && day >= 9 && day <= 11) return 'Quarter-finals';
    if (month === 7 && day >= 14 && day <= 15) return 'Semi-finals';
    if (month === 7 && day === 18) return 'Third Place';
    if (month === 7 && day === 19) return '🏆 FINAL';
    return 'Knockout';
  };

  const availableCategories = (match: MatchTicket) => {
    return TICKET_CATEGORIES.filter((cat) => {
      const price = getCategoryPrice(match, cat.id);
      return price > 0;
    });
  };

  const handleBuyTicket = (match: MatchTicket) => {
    setSelectedMatch(match);
    setSelectedCategory('category_1');
    setQuantity(1);
    setPurchaseSuccess(false);
  };

  const closeModal = () => {
    setSelectedMatch(null);
    setPurchaseSuccess(false);
  };

  const handlePurchase = () => {
    setPurchaseSuccess(true);
    setTimeout(() => {
      closeModal();
    }, 3000);
  };

  // ---- render ----
  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="FIFA World Cup 2026 Tickets" description="Buy official tickets for World Cup 2026 matches." path="/tickets" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-6">
            <Ticket className="w-4 h-4" /> Official FIFA World Cup 2026™ Tickets
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            World Cup 2026 <br />
            <span className="bg-gradient-to-r from-amber-300 to-red-400 bg-clip-text text-transparent">Tickets</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Secure your seat for the biggest matches — from the Round of 32 to the Final.
          </p>
        </motion.div>

        {/* Category Legend */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10 p-4 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-400" /> Official FIFA Ticket Categories
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {TICKET_CATEGORIES.map((cat) => (
              <div key={cat.id} className="text-center p-2 rounded-lg bg-white/5">
                <span className="text-lg">{cat.icon}</span>
                <p className="text-white text-xs font-medium">{cat.name}</p>
                <p className="text-gray-500 text-[10px] hidden md:block">{cat.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Matches Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent"></div>
            <p className="text-gray-400 mt-4">Loading matches...</p>
          </div>
        ) : matches.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-5xl mb-4">🎟️</div>
            <p className="text-gray-400 text-lg">No matches available from July 1 onward.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => {
              const statusInfo = getStatusInfo(match.status);
              const stage = getStageLabel(match.match_date);
              const isFinal = stage.includes('FINAL');
              const availCats = availableCategories(match);
              return (
                <motion.div key={match.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Card3D glowColor={isFinal ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)'}>
                    <div className={`p-6 ${isFinal ? 'border-b-2 border-amber-500/30' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isFinal ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                          {stage}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(match.match_date)}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600" />
                          <span>{match.city}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-2">{match.home_team} vs {match.away_team}</h3>
                        <p className="text-gray-400 text-sm">{match.venue}</p>
                      </div>
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availCats.map((cat) => {
                          const price = getCategoryPrice(match, cat.id);
                          return (
                            <div key={cat.id} className={`text-center p-2 rounded-lg bg-gradient-to-br ${cat.color} bg-opacity-10 border border-white/10`}>
                              <span className="text-xs">{cat.icon}</span>
                              <p className="text-white font-bold text-sm">${price}</p>
                              <p className="text-gray-400 text-[10px]">{cat.name}</p>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        onClick={() => handleBuyTicket(match)}
                        className={`mt-4 w-full py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg ${match.status === 'finished' ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-amber-500/25'}`}
                        disabled={match.status === 'finished'}
                      >
                        {match.status === 'finished' ? 'Match Finished' : 'Buy Tickets'}
                      </button>
                    </div>
                  </Card3D>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Purchase Modal */}
      {selectedMatch && !purchaseSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#14142a] rounded-2xl border border-white/10 max-w-md w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">{selectedMatch.home_team} vs {selectedMatch.away_team}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-gray-400 text-sm mb-4">{selectedMatch.venue}, {selectedMatch.city} – {formatDate(selectedMatch.match_date)}</p>
            <div className="mb-4 p-3 rounded-lg bg-white/5 border border-white/10">
              <p className="text-amber-400 text-xs font-medium">Stage: {getStageLabel(selectedMatch.match_date)}</p>
            </div>
            <div className="space-y-3 mb-6">
              <label className="text-gray-400 text-sm block">Select Ticket Category</label>
              {availableCategories(selectedMatch).map((cat) => {
                const price = getCategoryPrice(selectedMatch, cat.id);
                const isSelected = selectedCategory === cat.id;
                return (
                  <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${isSelected ? 'bg-amber-500/20 border-amber-500/40 ring-1 ring-amber-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cat.icon}</span>
                      <div className="text-left">
                        <p className={`text-sm font-medium ${isSelected ? 'text-amber-300' : 'text-white'}`}>{cat.name}</p>
                        <p className="text-gray-500 text-xs">{cat.description}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${isSelected ? 'text-amber-400' : 'text-white'}`}>${price}</span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 mb-6">
              <label className="text-gray-400 text-sm">Quantity</label>
              <div className="flex items-center gap-2">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg bg-white/5 text-white hover:bg-white/10">−</button>
                <input type="number" min="1" max="10" value={quantity} onChange={(e) => setQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))} className="w-16 px-3 py-2 text-center rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50" />
                <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-8 h-8 rounded-lg bg-white/5 text-white hover:bg-white/10">+</button>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-bold">${(getCategoryPrice(selectedMatch, selectedCategory) * quantity).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1"><span>Service fee</span><span>Included</span></div>
            </div>
            <button onClick={handlePurchase} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-105 transition-all shadow-lg shadow-amber-500/25">
              <span className="flex items-center justify-center gap-2"><Ticket className="w-4 h-4" /> Purchase Tickets</span>
            </button>
            <p className="text-gray-500 text-xs text-center mt-4">🔒 Secure checkout. All payments are encrypted.</p>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      {purchaseSuccess && selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#14142a] rounded-2xl border border-green-500/30 max-w-md w-full p-8 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-400" /></div>
            <h3 className="text-2xl font-bold text-white mb-2">Tickets Reserved! 🎉</h3>
            <p className="text-gray-400 mb-4">{quantity} ticket{quantity > 1 ? 's' : ''} for {selectedMatch.home_team} vs {selectedMatch.away_team}</p>
            <p className="text-gray-500 text-sm mb-6">A confirmation email has been sent to your registered email address.</p>
            <button onClick={closeModal} className="px-6 py-2 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20">Close</button>
          </motion.div>
        </div>
      )}
    </main>
  );
}