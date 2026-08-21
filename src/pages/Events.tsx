import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Search, X, Globe, Grid3X3, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import BtsPromoBanner from '../components/BtsPromoBanner';
import { useData, type Event } from '../contexts/DataContext';
import { eventImageFor } from '../lib/eventImages';
import { formatVenueDate } from '../lib/eventDate';
import { useCurrency, getCurrencyForCity } from '../contexts/CurrencyContext';
import { CURRENCIES } from '../contexts/CurrencyContext';

function hasEventEnded(event: Pick<Event, 'date' | 'status'>) {
  return event.status === 'finished' || new Date(event.date).getTime() < Date.now();
}

function isSoldOut(event: Pick<Event, 'status'>) {
  return event.status === 'sold_out';
}

export default function Events() {
  const { fetchEvents } = useData();
  const { formatDual } = useCurrency();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'finished' | 'sold_out'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await fetchEvents();
    // Restore ALL events: future + past. Mark past as finished so overlay shows.
    const normalized = (data || []).map((event) =>
      hasEventEnded(event) ? { ...event, status: 'finished' as const } : event
    );
    // Keep full list — do NOT filter by date here. Sort upcoming first (soonest), then history (recent first)
    const now = Date.now();
    normalized.sort((a, b) => {
      const aPast = new Date(a.date).getTime() < now;
      const bPast = new Date(b.date).getTime() < now;
      if (aPast !== bPast) return aPast ? 1 : -1; // upcoming before past
      if (!aPast) return new Date(a.date).getTime() - new Date(b.date).getTime();
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setEvents(normalized);
    setLoading(false);
  };

  // Derived counts for UI
  const upcomingCount = events.filter((e) => !hasEventEnded(e) && e.status !== 'sold_out').length;
  const finishedCount = events.filter((e) => hasEventEnded(e)).length;
  const soldOutCount = events.filter((e) => isSoldOut(e)).length;

  const filteredEvents = events.filter((event) => {
    // Status filter — 'all' returns EVERYTHING (future + past) as requested
    if (filter !== 'all' && event.status !== filter) {
      // Special: when filtering 'finished', include hasEventEnded
      if (filter === 'finished' && !hasEventEnded(event)) return false;
      if (filter !== 'finished' && filter !== 'sold_out') {
        if (event.status !== filter) return false;
      }
      if (filter === 'sold_out' && !isSoldOut(event)) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        event.title.toLowerCase().includes(q) ||
        event.city.toLowerCase().includes(q) ||
        event.venue.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Split into two visible sections so user clearly sees history restored
  const upcomingEvents = filteredEvents.filter((e) => !hasEventEnded(e));
  const pastEvents = filteredEvents.filter((e) => hasEventEnded(e));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'live':
        return 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse';
      case 'finished':
        return 'bg-gray-500/20 text-[#687A90] border-gray-500/30';
      case 'sold_out':
        return 'bg-[#C49B55]/20 text-[#C49B55] border-[#C49B55]/30';
      default:
        return 'bg-gray-500/20 text-[#687A90]';
    }
  };

  const renderEventGrid = (list: Event[], isHistory = false) => (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
      {list.map((event, i) => {
        const ended = hasEventEnded(event);
        const soldOut = isSoldOut(event);
        const localCurrency = getCurrencyForCity(event.city);
        const currencyInfo = CURRENCIES[localCurrency];
        const dualSample = formatDual(100, event.city); // sample $100 conversion for display
        return (
          <motion.div
            key={`${isHistory ? 'past' : 'upcoming'}-${event.id}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
          >
            <Card3D glowColor={event.status === 'live' ? 'rgba(239, 68, 68, 0.2)' : ended ? 'rgba(100, 116, 139, 0.15)' : 'rgba(245, 158, 11, 0.1)'}>
              <div className="relative event-media rounded-t-2xl overflow-hidden">
                <img
                  src={eventImageFor(event)}
                  alt={event.title}
                  width={500}
                  height={300}
                  decoding="async"
                  className={`w-full h-48 object-cover ${ended ? 'grayscale-[0.6] opacity-80' : ''}`}
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      ended
                        ? 'bg-slate-700/90 text-slate-100 border-slate-500/60'
                        : soldOut
                        ? 'bg-[#C49B55]/90 text-white border-[#C49B55]/60'
                        : getStatusColor(event.status)
                    }`}
                  >
                    {ended ? 'Event ended' : soldOut ? 'Sold out' : event.status}
                  </span>
                </div>
                <div className="absolute bottom-2 left-2 rounded-full bg-[#0F1E3A]/85 px-2.5 py-1 text-[10px] font-bold text-white border border-white/20">
                  {currencyInfo.flag} {localCurrency} • {currencyInfo.symbol} Pay
                </div>
                {ended && <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[0.5px] pointer-events-none" />}
              </div>
              {ended ? (
                <div className="border-y border-slate-500/40 bg-slate-700/80 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-100">
                  This event has passed • Sold out / Ended
                </div>
              ) : soldOut ? (
                <div className="border-y border-amber-500/30 bg-amber-500/15 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-amber-700">
                  Sold out
                </div>
              ) : null}
              <div className="p-5">
                <h3 className="text-xl font-bold text-[#14253F] mb-2 line-clamp-1">{event.title}</h3>
                <div className="space-y-1 text-sm text-[#687A90] mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{formatVenueDate(event.date, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-400" />
                    <span>{event.venue}, {event.city}</span>
                  </div>
                </div>
                {/* Currency & conversion */}
                <div className="mb-3 rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] p-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#8A9AB0]">Payment currency</p>
                  <p className="mt-1 text-sm font-semibold text-[#14253F]">{currencyInfo.flag} {currencyInfo.name} ({localCurrency}) • USD equivalent shown</p>
                  <p className="mt-1 text-xs text-[#5B6B82]">{dualSample.rateText}</p>
                  <p className="mt-1 text-xs text-[#687A90]">Example: $100 USD = {formatDual(100, event.city).local}</p>
                </div>
                <p className="text-[#687A90] text-sm line-clamp-2 mb-4">{event.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={ended || soldOut}
                    onClick={() => setSelectedEvent(event)}
                    className={`py-3 rounded-xl font-bold transition-all shadow-lg ${ended || soldOut ? 'cursor-not-allowed bg-slate-700 text-slate-300 shadow-none' : 'bg-gradient-to-r from-amber-500 to-red-500 text-[#14253F] hover:scale-[1.02] shadow-amber-500/25'}`}
                  >
                    {ended ? 'Event ended' : soldOut ? 'Sold out' : 'View Tickets'}
                  </button>
                  <Link to={`/listings?city=${encodeURIComponent(event.city)}&cityId=${encodeURIComponent(event.city.toLowerCase().includes('bogot') ? 'bogota' : event.city.toLowerCase().includes('lima') ? 'lima' : event.city.toLowerCase().includes('santiago') ? 'santiago' : event.city.toLowerCase().includes('buenos') ? 'buenosaires' : event.city.toLowerCase().includes('são') || event.city.toLowerCase().includes('sao') ? 'saopaulo' : event.city.toLowerCase().includes('kaohsiung') ? 'kaohsiung' : event.city.toLowerCase().includes('bangkok') ? 'bangkok' : event.city.toLowerCase().includes('kuala') ? 'kualalumpur' : event.city.toLowerCase().includes('singapore') ? 'singapore' : event.city.toLowerCase().includes('jakarta') ? 'jakarta' : event.city.toLowerCase().includes('toronto') ? 'toronto' : event.city.toLowerCase().includes('chicago') ? 'chicago' : 'la')}`} className="flex items-center justify-center gap-1 rounded-xl border border-[#D8E5F0] bg-white py-3 text-sm font-semibold text-[#687A90] hover:border-[#1267C4] hover:text-[#1267C4]">
                    🏨 Hotels in {event.city.split(',')[0]}
                  </Link>
                </div>
              </div>
            </Card3D>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <main className="pb-20 min-h-screen">
      <BtsPromoBanner />
      <SEO title="Events" description="Discover and book tickets for exciting events worldwide. Past events restored as history." path="/events" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-[#0a0a1a] via-[#14142a] to-[#0a0a1a] border border-[#D8E5F0] p-8 md:p-12"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-6">
              <Globe className="w-4 h-4" />
              All Events Restored • History + Upcoming
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#14253F] mb-3">Events — Full Catalog</h1>
            <p className="text-[#687A90] text-lg max-w-2xl">
              Every event returned: <strong>future + past</strong>. Past events show as <span className="px-2 py-0.5 rounded bg-slate-700 text-white text-xs">Event ended / Sold out</span> across them.
              Tickets tab stays <strong>upcoming-only</strong>.
            </p>
            {!loading && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-[#14253F] text-white px-3 py-1.5 font-semibold">
                  {events.length} total • {upcomingEvents.length} upcoming • {finishedCount} history • {soldOutCount} sold out
                </span>
                <span className="rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 px-3 py-1.5 font-medium">
                  Past restored with “Event ended / Sold out” banner — Tickets remains upcoming-only
                </span>
              </div>
            )}
            <div className="mt-5 flex gap-2">
              <span className="rounded-full bg-[#14253F] px-5 py-2.5 text-sm font-bold text-white">Events Tab — All Events (future + past)</span>
              <Link to="/tickets" className="rounded-full border border-[#D8E5F0] bg-white px-5 py-2.5 text-sm font-bold text-[#687A90] hover:border-[#1267C4] hover:text-[#1267C4]">Ticket Tab — Available Only →</Link>
            </div>

            {/* Search */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-3xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#687A90]" />
                <input
                  type="text"
                  placeholder="Search events by name, city, or venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F7FAFD] border border-[#D8E5F0] text-[#14253F] placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-[#687A90] hover:text-[#14253F]" />
                  </button>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'upcoming', 'live', 'finished', 'sold_out'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filter === f
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                        : 'bg-[#F7FAFD] border border-[#D8E5F0] text-[#687A90] hover:bg-white'
                    }`}
                  >
                    {f === 'sold_out' ? 'Sold Out' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-xl border border-[#D8E5F0] bg-[#F7FAFD] p-1">
                <button type="button" onClick={() => setViewMode('grid')} aria-label="Grid view" className={`rounded-lg p-2 ${viewMode === 'grid' ? 'bg-amber-500/20 text-amber-300' : 'text-[#687A90] hover:text-[#14253F]'}`}>
                  <Grid3X3 className="h-4 w-4" />
                </button>
                <button type="button" onClick={() => setViewMode('list')} aria-label="List view" className={`rounded-lg p-2 ${viewMode === 'list' ? 'bg-amber-500/20 text-amber-300' : 'text-[#687A90] hover:text-[#14253F]'}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading / Empty */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent" />
            <p className="text-[#687A90] mt-4">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-[#14253F] mb-2">No events found</h3>
            <p className="text-[#687A90]">Try search or set filter to “All”.</p>
          </div>
        ) : (
          <>
            {/* Upcoming Section */}
            {upcomingEvents.length > 0 && (
              <section className="mb-12">
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-2xl font-black text-[#14253F]">Upcoming Events</h2>
                  <span className="rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-bold text-blue-600">{upcomingEvents.length} upcoming</span>
                </div>
                {renderEventGrid(upcomingEvents, false)}
              </section>
            )}

            {/* Past / History Section */}
            {pastEvents.length > 0 && (
              <section className="mb-12">
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="text-2xl font-black text-[#14253F]">Past Events • History</h2>
                  <span className="rounded-full bg-slate-700 text-white px-3 py-1 text-xs font-bold">{pastEvents.length} history — marked Ended / Sold out</span>
                </div>
                <p className="mb-4 text-sm text-[#687A90]">These events have passed — showing with <strong>“This event has passed • Sold out / Ended”</strong> banner as requested.</p>
                {renderEventGrid(pastEvents, true)}
              </section>
            )}

            {/* If filter is specifically finished or sold_out, also show dedicated count */}
            {filter !== 'all' && (
              <div className="mt-6 text-center text-xs text-[#687A90]">
                Showing {filteredEvents.length} events for filter “{filter}” — switch to “All” to see full catalog (future + past).
              </div>
            )}
          </>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl border border-[#D8E5F0] max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-[#14253F]">{selectedEvent.title}</h2>
              <button onClick={() => setSelectedEvent(null)} className="text-[#687A90] hover:text-[#14253F]">
                <X className="w-5 h-5" />
              </button>
            </div>
            {hasEventEnded(selectedEvent) && (
              <div className="mb-4 rounded-lg bg-slate-700 text-white px-4 py-2 text-center text-xs font-bold uppercase tracking-widest">This event has passed • Ended / Sold out</div>
            )}
            <div className="relative rounded-xl overflow-hidden mb-4">
              <img src={eventImageFor(selectedEvent)} alt={selectedEvent.title} width={800} height={400} className="w-full h-64 object-cover" />
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-[#687A90]">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{formatVenueDate(selectedEvent.date, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-[#687A90]">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>
                  {selectedEvent.venue}, {selectedEvent.city}
                </span>
              </div>
              <p className="text-[#4B5563] leading-relaxed">{selectedEvent.description}</p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedEvent.status)}`}>{selectedEvent.status}</span>
              </div>
            </div>
            {hasEventEnded(selectedEvent) || isSoldOut(selectedEvent) ? (
              <div className="w-full py-4 rounded-xl bg-slate-700 text-white font-bold text-center">Event ended / Sold out</div>
            ) : (
              <>
                <Link to={`/tickets?search=${encodeURIComponent(selectedEvent.title)}`} className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-[#14253F] font-bold text-center block hover:scale-105 transition-all shadow-lg shadow-amber-500/25" onClick={() => setSelectedEvent(null)}>
                  Go to Ticket Tab — Buy Tickets
                </Link>
                <p className="mt-2 text-center text-xs text-[#687A90]">Events tab shows all events (future + past). Ticket tab shows only available tickets. This link takes you to Ticket tab filtered for this event.</p>
                <Link to="/events" onClick={() => setSelectedEvent(null)} className="mt-3 block text-center text-xs text-[#8A9AB0] underline">Stay in Events tab (full catalog)</Link>
              </>
            )}
          </motion.div>
        </div>
      )}
    </main>
  );
}
