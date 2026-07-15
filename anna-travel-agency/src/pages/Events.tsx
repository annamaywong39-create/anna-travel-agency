import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, Search, Filter, X, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Card3D from '../components/Card3D';
import { useData, type Event } from '../contexts/DataContext';

export default function Events() {
  const { fetchEvents } = useData();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'finished'>('all');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await fetchEvents();
    setEvents(data || []);
    setLoading(false);
  };

  const filteredEvents = events.filter((event) => {
    if (filter !== 'all' && event.status !== filter) return false;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'live': return 'bg-red-500/20 text-red-400 border-red-500/30 animate-pulse';
      case 'finished': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <main className="pt-24 pb-20 min-h-screen">
      <SEO title="Events" description="Discover and book tickets for exciting events worldwide." path="/events" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden mb-12 bg-gradient-to-r from-[#0a0a1a] via-[#14142a] to-[#0a0a1a] border border-white/10 p-8 md:p-12"
        >
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-6">
              <Globe className="w-4 h-4" />
              Discover Events Worldwide
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
              Upcoming Events
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              From concerts to sports, find events near you. Book tickets with ease.
            </p>

            {/* Search */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 max-w-3xl">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events by name, city, or venue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                {(['all', 'upcoming', 'live', 'finished'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      filter === f
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
                        : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-amber-500 border-t-transparent" />
            <p className="text-gray-400 mt-4">Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="py-20 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-white mb-2">No events found</h3>
            <p className="text-gray-400">Check back later for upcoming events.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card3D glowColor={event.status === 'live' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.1)'}>
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={event.image_url || 'https://images.pexels.com/photos/31514419/pexels-photo-31514419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=300&w=500'}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{event.title}</h3>
                    <div className="space-y-1 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-400" />
                        <span>{event.venue}, {event.city}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-4">{event.description}</p>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold hover:scale-105 transition-all shadow-lg shadow-amber-500/25"
                    >
                      View Tickets
                    </button>
                  </div>
                </Card3D>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Event Detail Modal ─── */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#14142a] rounded-2xl border border-white/10 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedEvent.title}</h2>
              <button onClick={() => setSelectedEvent(null)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative rounded-xl overflow-hidden mb-4">
              <img
                src={selectedEvent.image_url || 'https://images.pexels.com/photos/31514419/pexels-photo-31514419.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=800'}
                alt={selectedEvent.title}
                className="w-full h-64 object-cover"
              />
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>{selectedEvent.venue}, {selectedEvent.city}</span>
              </div>
              <p className="text-gray-300 leading-relaxed">{selectedEvent.description}</p>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedEvent.status)}`}>
                  {selectedEvent.status}
                </span>
              </div>
            </div>
            <Link
              to="/tickets"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 text-white font-bold text-center block hover:scale-105 transition-all shadow-lg shadow-amber-500/25"
              onClick={() => setSelectedEvent(null)}
            >
              Buy Tickets
            </Link>
          </motion.div>`  `
        </div>
      )}
    </main>
  );
}