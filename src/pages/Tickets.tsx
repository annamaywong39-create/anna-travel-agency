import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, X, Check } from 'lucide-react';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import { supabase } from '../lib/supabase';
import { useData } from '../contexts/DataContext';

// ─── Types ──────────────────────────────────────────────

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
  type: 'match';
}

interface EventTicketItem {
  id: string;
  event_id: string;
  category_name: string;
  price: number;
  quantity_available: number;
}

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  city: string;
  image_url: string;
  status: string;
  type: 'event';
  tickets: EventTicketItem[];
}

type DisplayItem = (MatchTicket | EventItem) & { type: 'match' | 'event' };

// ─── FIFA Match Ticket Categories ──────────────────────

const TICKET_CATEGORIES = [
  { id: 'category_1', name: 'Category 1', description: 'Premium lower-tier seating', icon: '🌟', color: 'from-amber-500 to-yellow-500' },
  { id: 'category_2', name: 'Category 2', description: 'Lower and upper tier seating', icon: '💎', color: 'from-blue-500 to-cyan-400' },
  { id: 'category_3', name: 'Category 3', description: 'Upper tier seating', icon: '🎯', color: 'from-emerald-500 to-green-400' },
  { id: 'category_4', name: 'Category 4', description: 'Most affordable seating', icon: '🎫', color: 'from-purple-500 to-pink-400' },
  { id: 'supporter_entry', name: 'Supporter Entry', description: 'Fixed-price for fans (USD 60)', icon: '🏴', color: 'from-red-500 to-orange-400' },
];

// ─── Main Component ─────────────────────────────────────

export default function Tickets() {
  const [items, setItems] = useState<DisplayItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<DisplayItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('category_1');
  const [quantity, setQuantity] = useState(1);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const { addToCart } = useData();

  // ─── Fetch matches & events ──────────────────────────

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      // 1. Fetch matches
      const { data: matches, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .gte('match_date', '2026-07-01')
        .order('match_date', { ascending: true });
      if (matchError) throw matchError;

      // 2. Fetch events
      const { data: events, error: eventError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      if (eventError) throw eventError;

      // 3. Fetch tickets for events
      const eventIds = events?.map(e => e.id) || [];
      let eventTickets: EventTicketItem[] = [];
      if (eventIds.length) {
        const { data: tickets, error: ticketError } = await supabase
          .from('event_tickets')
          .select('*')
          .in('event_id', eventIds);
        if (!ticketError) eventTickets = tickets;
      }

      // 4. Combine into one array
      const matchItems: DisplayItem[] = (matches || []).map(m => ({ ...m, type: 'match' }));
      const eventItems: DisplayItem[] = (events || []).map(e => ({
        ...e,
        type: 'event',
        tickets: eventTickets.filter(t => t.event_id === e.id),
      }));

      setItems([...matchItems, ...eventItems]);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────

  const getCategoryPrice = (match: MatchTicket, categoryId: string): number => {
    const map: Record<string, number> = {
      category_1: match.category_1_price || 0,
      category_2: match.category_2_price || 0,
      category_3: match.category_3_price || 0,
      category_4: match.category_4_price || 0,
      supporter_entry: match.supporter_entry_price || 0,
    };
    return map[categoryId] || 0;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStageLabel = (dateStr: string): string => {
    if (!dateStr) return 'Knockout';
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

  // ─── Handlers ──────────────────────────────────────────

  const handleBuy = (item: DisplayItem) => {
    setSelectedItem(item);
    // Default to first available category
    if (item.type === 'match') {
      setSelectedCategory('category_1');
    } else if (item.tickets.length > 0) {
      setSelectedCategory(item.tickets[0].id);
    }
    setQuantity(1);
    setPurchaseSuccess(false);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setPurchaseSuccess(false);
  };

  const handlePurchase = () => {
    if (!selectedItem) return;

    if (selectedItem.type === 'match') {
      const price = getCategoryPrice(selectedItem as MatchTicket, selectedCategory);
      addToCart({
        id: selectedItem.id,
        type: 'ticket',
        item: {
          eventName: `${(selectedItem as MatchTicket).home_team} vs ${(selectedItem as MatchTicket).away_team}`,
          ticketId: selectedItem.id,
          unitPrice: price,
          quantity: quantity,
        },
        quantity: quantity,
        price: price,
      });
    } else {
      const ticket = (selectedItem as EventItem).tickets.find(t => t.id === selectedCategory);
      if (ticket) {
        addToCart({
          id: selectedItem.id,
          type: 'ticket',
          item: {
            eventName: selectedItem.title,
            ticketId: ticket.id,
            unitPrice: ticket.price,
            quantity: quantity,
          },
          quantity: quantity,
          price: ticket.price,
        });
      }
    }

    setPurchaseSuccess(true);
    setTimeout(() => closeModal(), 3000);
  };

  // ─── Render ────────────────────────────────────────────

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Tickets" description="Buy tickets for World Cup matches and special events." path="/tickets" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Header ─── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-6">
            <Ticket className="w-4 h-4" /> Tickets & Events
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            World Cup 2026 <br />
            <span className="bg-gradient-to-r from-amber-300 to-red-400 bg-clip-text text-transparent">Tickets & Events</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Secure your seat for matches and special events.
          </p>
        </motion.div>

        {/* ─── Loading ─── */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent" />
            <p className="text-gray-400 mt-4">Loading tickets...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-5xl mb-4">🎟️</div>
            <p className="text-gray-400">No tickets available at the moment.</p>
          </div>
        ) : (
          /* ─── Grid ─── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => {
              const isMatch = item.type === 'match';
              const stage = isMatch ? getStageLabel((item as MatchTicket).match_date) : 'Event';
              const isFinal = stage.includes('FINAL');
              const availCats = isMatch
                ? TICKET_CATEGORIES.filter(c => getCategoryPrice(item as MatchTicket, c.id) > 0)
                : (item as EventItem).tickets.map(t => ({
                    id: t.id,
                    name: t.category_name,
                    price: t.price,
                    icon: '🎫',
                    color: 'from-purple-500 to-pink-400',
                    quantity_available: t.quantity_available,
                  }));

              return (
                <motion.div key={`${item.type}-${item.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Card3D glowColor={isFinal ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.1)'}>
                    <div className={`p-6 ${isFinal ? 'border-b-2 border-amber-500/30' : ''}`}>
                      {/* Badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isFinal ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                          {isMatch ? stage : '🎉 Event'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs border ${
                          item.status === 'live' ? 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse' :
                          item.status === 'finished' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' :
                          'bg-green-500/20 text-green-400 border-green-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(isMatch ? (item as MatchTicket).match_date : (item as EventItem).date)}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-600" />
                          <MapPin className="w-4 h-4" />
                          <span>{item.city}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-2">
                          {isMatch ? `${(item as MatchTicket).home_team} vs ${(item as MatchTicket).away_team}` : (item as EventItem).title}
                        </h3>
                        <p className="text-gray-400 text-sm">{item.venue}</p>
                      </div>

                      {/* Ticket Tiers */}
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {(availCats || []).map((cat: any) => {
                          const isSoldOut = cat.quantity_available === 0;
                          return (
                            <div
                              key={cat.id}
                              className={`text-center p-2 rounded-lg bg-gradient-to-br ${cat.color} bg-opacity-10 border border-white/10 ${isSoldOut ? 'opacity-50' : ''}`}
                            >
                              <span className="text-xs">{cat.icon}</span>
                              <p className="text-white font-bold text-sm">{isSoldOut ? 'Sold Out' : `$${cat.price}`}</p>
                              <p className="text-gray-400 text-[10px]">{cat.name}</p>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => handleBuy(item)}
                        className={`mt-4 w-full py-3 rounded-xl font-bold hover:scale-105 transition-all shadow-lg ${
                          item.status === 'finished'
                            ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-amber-500 to-red-500 text-white shadow-amber-500/25'
                        }`}
                        disabled={item.status === 'finished'}
                      >
                        {item.status === 'finished' ? 'Finished' : 'Buy Tickets'}
                      </button>
                    </div>
                  </Card3D>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Purchase Modal ──────────────────────────────────── */}
      {selectedItem && !purchaseSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={closeModal}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#14142a] rounded-2xl border border-white/10 max-w-md w-full p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">
                {selectedItem.type === 'match'
                  ? `${(selectedItem as MatchTicket).home_team} vs ${(selectedItem as MatchTicket).away_team}`
                  : (selectedItem as EventItem).title}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-400 text-sm mb-4">{selectedItem.venue}, {selectedItem.city}</p>

            {/* Category Selection */}
            <div className="space-y-3 mb-6">
              <label className="text-gray-400 text-sm block">Select Ticket Category</label>
              {selectedItem.type === 'match'
                ? TICKET_CATEGORIES.filter(c => getCategoryPrice(selectedItem as MatchTicket, c.id) > 0).map((cat) => {
                    const price = getCategoryPrice(selectedItem as MatchTicket, cat.id);
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/40 ring-1 ring-amber-500/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
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
                  })
                : (selectedItem as EventItem).tickets.map((t) => {
                    const isSelected = selectedCategory === t.id;
                    const isSoldOut = t.quantity_available === 0;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setSelectedCategory(t.id)}
                        disabled={isSoldOut}
                        className={`w-full flex items-center justify-between p-3 rounded-xl transition-all border ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/40 ring-1 ring-amber-500/20'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        } ${isSoldOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">🎫</span>
                          <div className="text-left">
                            <p className={`text-sm font-medium ${isSelected ? 'text-amber-300' : 'text-white'}`}>{t.category_name}</p>
                            <p className="text-gray-500 text-xs">{isSoldOut ? 'Sold Out' : `${t.quantity_available} available`}</p>
                          </div>
                        </div>
                        <span className={`font-bold ${isSelected ? 'text-amber-400' : 'text-white'}`}>${t.price}</span>
                      </button>
                    );
                  })}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <label className="text-gray-400 text-sm">Quantity</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-16 px-3 py-2 text-center rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-amber-500/50"
                />
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-8 h-8 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total & Purchase */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-red-500/10 border border-amber-500/20 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-bold">
                  ${(() => {
                    let price = 0;
                    if (selectedItem.type === 'match') {
                      price = getCategoryPrice(selectedItem as MatchTicket, selectedCategory);
                    } else {
                      const ticket = (selectedItem as EventItem).tickets.find(t => t.id === selectedCategory);
                      price = ticket?.price || 0;
                    }
                    return (price * quantity).toLocaleString();
                  })()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>Service fee</span>
                <span>Included</span>
              </div>
            </div>

            <button
              onClick={handlePurchase}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-105 transition-all shadow-lg shadow-amber-500/25"
            >
              <Ticket className="w-4 h-4 inline mr-2" /> Add to Cart
            </button>
            <p className="text-gray-500 text-xs text-center mt-4">🔒 Secure checkout.</p>
          </motion.div>
        </div>
      )}

      {/* ─── Success Toast ──────────────────────────────────── */}
      {purchaseSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#14142a] rounded-2xl border border-green-500/30 max-w-md w-full p-8 text-center shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Added to Cart! 🎉</h3>
            <p className="text-gray-400 mb-4">
              {quantity} ticket{quantity > 1 ? 's' : ''} added to your cart.
            </p>
            <button
              onClick={closeModal}
              className="px-6 py-2 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition-all"
            >
              Continue Shopping
            </button>
          </motion.div>
        </div>
      )}
    </main>
  );
}