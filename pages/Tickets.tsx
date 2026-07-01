import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Ticket, X, Check } from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

const TICKET_CATEGORIES = [
  { id: 'category_1', name: 'Category 1', description: 'Premium lower-tier seating', icon: '🌟', color: 'from-amber-500 to-yellow-500' },
  { id: 'category_2', name: 'Category 2', description: 'Upper tier outside Cat 1', icon: '💎', color: 'from-blue-500 to-cyan-400' },
  { id: 'category_3', name: 'Category 3', description: 'Great upper tier views', icon: '🎯', color: 'from-emerald-500 to-green-400' },
  { id: 'category_4', name: 'Category 4', description: 'Most affordable upper tier', icon: '🎫', color: 'from-purple-500 to-pink-400' },
  { id: 'supporter_entry', name: 'Supporter Entry', description: 'Fixed price for dedicated fans', icon: '🏴', color: 'from-red-500 to-orange-400' },
];

export default function Tickets() {
  const { matches, fetchMatches } = useData(); // Uses DataContext now!
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<any | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('category_1');
  const [quantity, setQuantity] = useState(1);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchMatches();
      setLoading(false);
    };
    load();
  }, []);

  const getCategoryPrice = (match: any, categoryId: string): number => {
    const map: Record<string, number> = {
      category_1: match.category_1_price, category_2: match.category_2_price,
      category_3: match.category_3_price, category_4: match.category_4_price,
      supporter_entry: match.supporter_entry_price,
    };
    return map[categoryId] || 0;
  };

  const getStageLabel = (dateStr: string): string => {
    const date = new Date(dateStr);
    const m = date.getMonth(); const d = date.getDate();
    if (m === 6 && d >= 28) return 'Round of 32';
    if (m === 7 && d >= 4 && d <= 7) return 'Round of 16';
    if (m === 7 && d >= 9 && d <= 11) return 'Quarter-finals';
    if (m === 7 && d >= 14 && d <= 15) return 'Semi-finals';
    if (m === 7 && d === 18) return 'Third Place';
    if (m === 7 && d === 19) return '🏆 FINAL';
    return 'Knockout';
  };

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="FIFA World Cup 2026 Tickets" description="Buy official tickets for World Cup 2026 matches." path="/tickets" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header same as before */}
        
        {loading ? (
          <div className="py-20 text-center"><div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent"></div><p className="text-gray-400 mt-4">Loading matches...</p></div>
        ) : matches.length === 0 ? (
          <div className="py-20 text-center"><div className="text-5xl mb-4">🎟️</div><p className="text-gray-400 text-lg">No matches available right now.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match) => {
              const stage = getStageLabel(match.match_date);
              const isFinal = stage.includes('FINAL');
              return (
                <motion.div key={match.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                  <Card3D glowColor={isFinal ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)'}>
                    <div className={`p-6 ${isFinal ? 'border-b-2 border-amber-500/30' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isFinal ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>{stage}</span>
                      </div>
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400"><Calendar className="w-4 h-4" /><span>{new Date(match.match_date).toLocaleDateString()}</span><span className="w-1 h-1 rounded-full bg-gray-600" /><MapPin className="w-4 h-4" /><span>{match.city}</span></div>
                        <h3 className="text-xl font-bold text-white mt-2">{match.home_team} vs {match.away_team}</h3>
                        <p className="text-gray-400 text-sm">{match.venue}</p>
                      </div>
                      <button onClick={() => setSelectedMatch(match)} className={`mt-4 w-full py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-amber-500/25`}>
                        Buy Tickets
                      </button>
                    </div>
                  </Card3D>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedMatch && !purchaseSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedMatch(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#14142a] rounded-2xl border border-white/10 max-w-md w-full p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4"><h3 className="text-2xl font-bold text-white">{selectedMatch.home_team} vs {selectedMatch.away_team}</h3><button onClick={() => setSelectedMatch(null)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button></div>
              <p className="text-gray-400 text-sm mb-4">{selectedMatch.venue}, {selectedMatch.city}</p>
              <div className="space-y-3 mb-6">
                <label className="text-gray-400 text-sm block">Select Ticket Category</label>
                {TICKET_CATEGORIES.map((cat) => {
                  const price = getCategoryPrice(selectedMatch, cat.id);
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${isSelected ? 'bg-amber-500/20 border-amber-500/40 ring-1 ring-amber-500/20' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                      <div className="flex items-center gap-3"><span className="text-xl">{cat.icon}</span><div className="text-left"><p className={`text-sm font-medium ${isSelected ? 'text-amber-300' : 'text-white'}`}>{cat.name}</p><p className="text-gray-500 text-xs">{cat.description}</p></div></div>
                      <span className={`font-bold ${isSelected ? 'text-amber-400' : 'text-white'}`}>${price}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-3 mb-6">
                <label className="text-gray-400 text-sm">Quantity</label>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all">−</button>
                  <input type="number" min="1" max="10" value={quantity} 
                    onChange={(e) => {
                      // ✅ FIXED: Prevents NaN from crashing React #310
                      const val = parseInt(e.target.value);
                      setQuantity(isNaN(val) ? 1 : Math.min(10, Math.max(1, val)));
                    }} 
                  className="w-16 px-3 py-2 text-center rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50" />
                  <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-8 h-8 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all">+</button>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20 mb-6">
                <div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span className="text-white font-bold">${(getCategoryPrice(selectedMatch, selectedCategory) * quantity).toLocaleString()}</span></div>
              </div>
              <button onClick={() => { setPurchaseSuccess(true); setTimeout(() => { setSelectedMatch(null); setPurchaseSuccess(false); }, 3000); }} className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-105 transition-all shadow-lg shadow-amber-500/25">
                Purchase Tickets
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {purchaseSuccess && selectedMatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#14142a] rounded-2xl border border-green-500/30 max-w-md w-full p-8 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-400" /></div>
              <h3 className="text-2xl font-bold text-white mb-2">Tickets Reserved! 🎉</h3>
              <p className="text-gray-400 mb-4">{quantity} ticket{quantity > 1 ? 's' : ''} for {selectedMatch.home_team} vs {selectedMatch.away_team}</p>
              <button onClick={() => { setSelectedMatch(null); setPurchaseSuccess(false); }} className="px-6 py-2 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition-all">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}