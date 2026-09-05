import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Search, X, Grid3X3, List, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import BtsPromoBanner from '../components/BtsPromoBanner';
import { useData, type Event } from '../contexts/DataContext';
import { eventImageFor } from '../lib/eventImages';
import { formatVenueDate } from '../lib/eventDate';

function hasEventEnded(event: Pick<Event, 'date' | 'status'>) {
  return event.status === 'finished' || new Date(event.date).getTime() < Date.now();
}

function isSoldOut(event: Pick<Event, 'status'>) {
  return event.status === 'sold_out';
}

export default function Events() {
  const { fetchEvents } = useData();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'finished' | 'sold_out'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await fetchEvents();
    const normalized = (data || []).map((e) =>
      hasEventEnded(e) ? { ...e, status: 'finished' as const } : e
    );
    const now = Date.now();
    normalized.sort((a, b) => {
      const aPast = new Date(a.date).getTime() < now;
      const bPast = new Date(b.date).getTime() < now;
      if (aPast !== bPast) return aPast ? 1 : -1;
      if (!aPast) return new Date(a.date).getTime() - new Date(b.date).getTime();
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setEvents(normalized);
    setLoading(false);
  };

  const filtered = events.filter((event) => {
    if (filter !== 'all' && event.status !== filter) {
      if (filter === 'finished' && !hasEventEnded(event)) return false;
      if (filter !== 'finished' && filter !== 'sold_out') {
        if (event.status !== filter) return false;
      }
      if (filter === 'sold_out' && !isSoldOut(event)) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return event.title.toLowerCase().includes(q) || event.city.toLowerCase().includes(q) || event.venue.toLowerCase().includes(q);
    }
    return true;
  });

  const upcoming = filtered.filter((e) => !hasEventEnded(e));
  const past = filtered.filter((e) => hasEventEnded(e));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30';
      case 'live': return 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/15 dark:text-red-300 animate-pulse';
      case 'finished': return 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/50';
      case 'sold_out': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/30';
      default: return 'bg-slate-50 text-slate-500 dark:bg-slate-800/30 dark:text-slate-400';
    }
  };

  const renderGrid = (list: Event[], isPast = false) => (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
      {list.map((event, i) => {
        const ended = hasEventEnded(event);
        const soldOut = isSoldOut(event);
        return (
          <motion.div key={`${isPast ? 'past' : 'up'}-${event.id}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}>
            <Card3D glowColor={ended ? 'rgba(100,116,139,0.08)' : 'rgba(18,103,196,0.08)'} disableTilt={isPast}>
              <div className="relative overflow-hidden rounded-t-2xl">
                <img src={eventImageFor(event)} alt={event.title} width={500} height={300} className={`w-full h-48 object-cover transition-all duration-700 ${ended ? 'grayscale opacity-80' : ''}`} loading="lazy" />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md transition-colors duration-300 ${ended ? 'bg-slate-900/80 text-white border-white/20' : soldOut ? 'bg-amber-900/80 text-amber-100 border-amber-200/30' : getStatusColor(event.status)}`}>
                    {ended ? 'Ended' : soldOut ? 'Sold out' : event.status}
                  </span>
                </div>
              </div>
              {ended && <div className="border-y border-slate-200 bg-slate-50 px-4 py-2 text-center text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:border-slate-700/50 dark:bg-slate-800/50 dark:text-slate-400">Ended</div>}
              <div className="p-5 bg-white dark:bg-[#132040] transition-colors duration-300">
                <h3 className="text-xl font-bold text-[#14253F] dark:text-white mb-2 line-clamp-1 transition-colors duration-300">{event.title}</h3>
                <div className="space-y-1.5 text-sm text-[#687A90] dark:text-[#94A3B8] mb-3 transition-colors duration-300">
                  <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#1267C4] dark:text-[#7CC4FF] transition-colors duration-300" /><span>{formatVenueDate(event.date, { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                  <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-[#1267C4] dark:text-[#7CC4FF] transition-colors duration-300" /><span>{event.venue}, {event.city}</span></div>
                </div>
                <p className="text-[#687A90] dark:text-[#94A3B8] text-sm line-clamp-2 mb-4 transition-colors duration-300">{event.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  <button disabled={ended || soldOut} onClick={() => setSelectedEvent(event)} className={`py-3 rounded-xl font-bold text-sm transition-all duration-300 ${ended || soldOut ? 'bg-slate-100 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-500' : 'bg-[#1267C4] text-white hover:bg-[#0F5AAC] shadow-sm hover:shadow-md dark:bg-[#1B6EC8] dark:hover:bg-[#164E8A]'}`}>{ended ? 'Ended' : soldOut ? 'Sold out' : 'View Tickets'}</button>
                  <Link to={`/listings?city=${encodeURIComponent(event.city)}`} className="flex items-center justify-center rounded-xl border border-[#D8E5F0] bg-white py-3 text-sm font-semibold text-[#687A90] hover:border-[#1267C4] hover:text-[#1267C4] dark:bg-[#162E55] dark:border-[#1E3A5F] dark:text-[#B8C6D9] dark:hover:border-[#5BA7E8] dark:hover:text-white transition-all duration-300">Hotels</Link>
                </div>
              </div>
            </Card3D>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F7FAFD] text-[#14253F] dark:bg-[#0A1931] dark:text-[#E2E8F0] transition-colors duration-500">
      <BtsPromoBanner />
      <SEO title="Events" description="Discover events worldwide." path="/events" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }} className="relative rounded-[2rem] overflow-hidden mb-10 bg-white border border-[#D8E5F0]/80 p-8 md:p-10 shadow-[0_8px_40px_-16px_rgba(20,37,63,0.12)] dark:bg-[#132040]/80 dark:border-[#1E3A5F]/60 dark:shadow-[0_8px_40px_-16px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E7F1FC]/60 via-transparent to-transparent dark:from-[#1A2E4D]/30 dark:via-transparent pointer-events-none transition-colors duration-500" />
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#14253F] dark:text-white transition-colors duration-500">Events</h1>
            <p className="mt-3 text-[#687A90] dark:text-[#B8C6D9] max-w-2xl transition-colors duration-500">Discover concerts, sports and cultural moments worth traveling for.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-3xl">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A9AB0] dark:text-[#6B7F9A] transition-colors duration-300 group-focus-within:text-[#1267C4] dark:group-focus-within:text-[#7CC4FF]" />
                <input type="text" placeholder="Search events..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F7FAFD] border border-[#D8E5F0] text-[#14253F] placeholder-[#8A9AB0] focus:outline-none focus:border-[#1267C4] focus:ring-4 focus:ring-[#1267C4]/10 dark:bg-[#162E55] dark:border-[#1E3A5F] dark:text-white dark:placeholder-[#6B7F9A] dark:focus:border-[#5BA7E8] dark:focus:ring-[#5BA7E8]/15 transition-all duration-300" />
                {searchQuery && <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A9AB0] hover:text-[#14253F] dark:text-[#6B7F9A] dark:hover:text-white transition-colors duration-200"><X className="w-4 h-4" /></button>}
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {(['all', 'upcoming', 'live', 'finished', 'sold_out'] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-300 ${filter === f ? 'bg-[#14253F] text-white border-[#14253F] shadow-sm dark:bg-white dark:text-[#0A1931] dark:border-white' : 'bg-[#F7FAFD] border-[#D8E5F0] text-[#687A90] hover:bg-white hover:border-[#1267C4]/30 hover:text-[#14253F] dark:bg-[#162E55] dark:border-[#1E3A5F] dark:text-[#94A3B8] dark:hover:bg-[#1E3A5F] dark:hover:text-white'}`}>
                    {f === 'sold_out' ? 'Sold Out' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] p-1 dark:bg-[#162E55] dark:border-[#1E3A5F] transition-colors duration-300">
                <button type="button" onClick={() => setViewMode('grid')} aria-label="Grid view" className={`rounded-lg p-2.5 transition-all duration-200 ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#1267C4] dark:bg-[#1E3A5F] dark:text-white' : 'text-[#8A9AB0] hover:text-[#14253F] dark:text-[#6B7F9A] dark:hover:text-white'}`}><Grid3X3 className="h-4 w-4" /></button>
                <button type="button" onClick={() => setViewMode('list')} aria-label="List view" className={`rounded-lg p-2.5 transition-all duration-200 ${viewMode === 'list' ? 'bg-white shadow-sm text-[#1267C4] dark:bg-[#1E3A5F] dark:text-white' : 'text-[#8A9AB0] hover:text-[#14253F] dark:text-[#6B7F9A] dark:hover:text-white'}`}><List className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="py-24 text-center"><div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-[#1267C4] border-t-transparent" /><p className="mt-4 text-[#687A90] dark:text-[#94A3B8]">Loading events...</p></div>
        ) : upcoming.length === 0 && !showPast ? (
          <div className="py-24 text-center"><div className="text-6xl mb-4">📅</div><h3 className="text-2xl font-bold dark:text-white">No upcoming events</h3><p className="text-[#687A90] dark:text-[#94A3B8] mt-2">Try search or check past events below.</p></div>
        ) : (
          <>
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-black text-[#14253F] dark:text-white transition-colors duration-500">Upcoming Events</h2>
                <Link to="/tickets" className="text-sm font-semibold text-[#1267C4] hover:text-[#0F5AAC] dark:text-[#7CC4FF] dark:hover:text-white transition-colors duration-300">Tickets →</Link>
              </div>
              {upcoming.length > 0 ? renderGrid(upcoming) : <p className="text-[#687A90] dark:text-[#94A3B8]">No upcoming events match your search.</p>}
            </section>

            {/* Subtle down-arrow toggle at bottom of upcoming */}
            {past.length > 0 && (
              <div className="mt-12 flex flex-col items-center">
                <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-[#D8E5F0] to-transparent dark:via-[#1E3A5F]/60 transition-colors duration-500" />
                <motion.button
                  onClick={() => setShowPast(!showPast)}
                  whileHover={{ y: 2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group mt-6 flex flex-col items-center gap-3"
                  aria-expanded={showPast}
                  aria-label={showPast ? 'Hide past events' : 'Show past events'}
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A9AB0] dark:text-[#6B7F9A] group-hover:text-[#687A90] dark:group-hover:text-[#94A3B8] transition-colors duration-300">
                    {showPast ? 'Hide past' : 'Past events'}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D8E5F0] bg-white shadow-[0_4px_20px_-8px_rgba(20,37,63,0.15)] group-hover:border-[#1267C4]/30 group-hover:shadow-[0_8px_30px_-12px_rgba(18,103,196,0.25)] dark:bg-[#132040] dark:border-[#1E3A5F] dark:shadow-[0_4px_20px_-8px_rgba(0,0,0,0.4)] dark:group-hover:border-[#5BA7E8]/30 transition-all duration-300">
                    <motion.div animate={{ rotate: showPast ? 180 : 0 }} transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}>
                      <ChevronDown className="h-5 w-5 text-[#687A90] dark:text-[#94A3B8] group-hover:text-[#1267C4] dark:group-hover:text-white transition-colors duration-300" />
                    </motion.div>
                  </div>
                </motion.button>
              </div>
            )}

            <AnimatePresence>
              {showPast && past.length > 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  className="mt-10 rounded-[2rem] border border-[#D8E5F0]/60 bg-white/60 p-6 md:p-8 shadow-[0_8px_40px_-20px_rgba(20,37,63,0.12)] backdrop-blur-sm dark:bg-[#0F1E3A]/40 dark:border-[#1E3A5F]/40 dark:shadow-[0_8px_40px_-20px_rgba(0,0,0,0.4)] transition-all duration-500"
                >
                  <div className="mb-6 flex items-center gap-3">
                    <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#D8E5F0] dark:to-[#1E3A5F]/60" />
                    <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-[#8A9AB0] dark:text-[#6B7F9A] transition-colors duration-300">Past</h3>
                    <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#D8E5F0] dark:to-[#1E3A5F]/60" />
                  </div>
                  {renderGrid(past, true)}
                </motion.section>
              )}
            </AnimatePresence>
          </>
        )}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A1931]/60 backdrop-blur-md" onClick={() => setSelectedEvent(null)}>
          <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }} className="bg-white rounded-[1.5rem] border border-[#D8E5F0] max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl dark:bg-[#132040] dark:border-[#1E3A5F] dark:shadow-[0_20px_80px_-20px_rgba(0,0,0,0.7)] transition-colors duration-500" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#14253F] dark:text-white transition-colors duration-300">{selectedEvent.title}</h2>
              <button onClick={() => setSelectedEvent(null)} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F7FAFD] border border-[#D8E5F0] text-[#687A90] hover:bg-white dark:bg-[#162E55] dark:border-[#1E3A5F] dark:text-[#94A3B8] transition-colors duration-300"><X className="w-4 h-4" /></button>
            </div>
            <div className="relative rounded-xl overflow-hidden mb-5">
              <img src={eventImageFor(selectedEvent)} alt={selectedEvent.title} width={800} height={400} className="w-full h-64 object-cover" />
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-[#687A90] dark:text-[#94A3B8] transition-colors duration-300"><Calendar className="w-4 h-4 text-[#1267C4] dark:text-[#7CC4FF]" /><span>{formatVenueDate(selectedEvent.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
              <div className="flex items-center gap-2 text-[#687A90] dark:text-[#94A3B8] transition-colors duration-300"><MapPin className="w-4 h-4 text-[#1267C4] dark:text-[#7CC4FF]" /><span>{selectedEvent.venue}, {selectedEvent.city}</span></div>
              <p className="text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed transition-colors duration-300">{selectedEvent.description}</p>
            </div>
            {hasEventEnded(selectedEvent) || isSoldOut(selectedEvent) ? (
              <div className="w-full py-4 rounded-xl bg-slate-100 text-slate-500 font-bold text-center dark:bg-slate-800 dark:text-slate-400 transition-colors duration-300">Ended</div>
            ) : (
              <Link to={`/tickets?search=${encodeURIComponent(selectedEvent.title)}`} className="w-full py-4 rounded-xl bg-[#1267C4] text-white font-bold text-center block hover:bg-[#0F5AAC] shadow-sm hover:shadow-md transition-all duration-300 dark:bg-[#1B6EC8] dark:hover:bg-[#164E8A]" onClick={() => setSelectedEvent(null)}>Buy Tickets</Link>
            )}
          </motion.div>
        </div>
      )}
    </main>
  );
}
